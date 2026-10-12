const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const M=require('../js/metrics.js');
const local=(y,m,d,h=12)=>new Date(y,m-1,d,h);
const storage=(initial={})=>{const data=new Map(Object.entries(initial));return {getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)}};

test('persisted correct/wrong reload and unrelated progress/preferences stay untouched',()=>{
 const s=storage({prog:'old',lang:'es','hangul-progress-v1':'completed'}),clock=()=>local(2026,10,12);
 const store=M.create(s,clock);store.record(true);store.record(false);store.record(true);
 const reloaded=M.create(s,clock).snapshot();assert.equal(reloaded.today.correct,2);assert.equal(reloaded.today.wrong,1);assert.equal(reloaded.today.total,3);assert.ok(Math.abs(reloaded.today.accuracy-200/3)<1e-10);
 assert.equal(s.getItem('prog'),'old');assert.equal(s.getItem('lang'),'es');assert.equal(s.getItem('hangul-progress-v1'),'completed');
 assert.equal(reloaded.yesterday.accuracy,null);assert.equal(reloaded.delta,null);
});
test('no attempts is no data; errors-only is real zero percent',()=>{
 const store=M.create(storage(),()=>local(2026,10,12));assert.equal(store.snapshot().today.accuracy,null);
 store.record(false);store.record(false);assert.deepEqual(store.snapshot().today,{correct:0,wrong:2,total:2,accuracy:0});
});
test('calendar yesterday crosses year/month/leap boundaries',()=>{
 for(const [date,expected] of [[local(2027,1,1),'2026-12-31'],[local(2026,3,1),'2026-02-28'],[local(2024,3,1),'2024-02-29'],[local(2026,11,1),'2026-10-31']])assert.equal(M.summarize(null,date).yesterdayKey,expected);
});
test('calendar dates use local time and yesterday survives DST, not minus 24 hours',()=>{
 const before=process.env.TZ;process.env.TZ='America/New_York';
 try{
  const spring=local(2026,3,9,0);assert.equal(M.day(M.offset(spring,-1)),'2026-03-08');
  assert.equal(M.day(new Date(spring.getTime()-86400000)),'2026-03-07');
  const late=local(2026,1,1,23);assert.equal(late.toISOString().slice(0,10),'2026-01-02');assert.equal(M.day(late),'2026-01-01');
  assert.equal(M.summarize(null,local(2026,11,2,0)).yesterdayKey,'2026-11-01');
 }finally{if(before===undefined)delete process.env.TZ;else process.env.TZ=before}
});
test('rollover keeps yesterday and compares pp only with both volumes',()=>{
 let now=local(2026,12,31);const store=M.create(storage(),()=>now);
 store.record(true);store.record(true);store.record(false);store.record(false);
 now=local(2027,1,1);assert.equal(store.snapshot().today.accuracy,null);assert.equal(store.snapshot().delta,null);
 store.record(true);for(let i=0;i<3;i++)store.record(false);
 const s=store.snapshot();assert.equal(s.today.accuracy,25);assert.equal(s.yesterday.accuracy,50);assert.equal(s.delta,-25);assert.equal(s.today.total,4);assert.equal(s.yesterday.total,4);
});
test('strict schema, safe counts, real dates and 90-day retention',()=>{
 const now=local(2026,10,12),first=M.day(M.offset(now,-89)),old=M.day(M.offset(now,-90));
 const row={correct:1,wrong:0};
 const value={version:1,days:{[first]:row,[old]:row,'2026-10-12':row,'2026-10-13':row,'2026-02-30':row,'2026-13-01':row,'0000-01-01':row,'2026-10-11':{correct:'1',wrong:0},'2026-10-10':{correct:-1,wrong:0},'2026-10-09':{correct:1.5,wrong:0},'2026-10-08':{correct:Number.MAX_SAFE_INTEGER,wrong:1},'2026-10-07':{correct:Infinity,wrong:0},'2026-10-06':null}};
 assert.deepEqual(Object.keys(M.validate(value,now).days).sort(),[first,'2026-10-12'].sort());
 for(const value of [null,[],1,'bad',{version:2,days:{}},{version:1,days:[]}])assert.deepEqual(M.validate(value,now),{version:1,days:{}});
 assert.equal(M.realDate('2024-02-29'),true);assert.equal(M.realDate('2026-02-29'),false);
});
test('corrupt storage loads safely; blocked writes accumulate in memory, not reset to one',()=>{
 for(const raw of ['{bad','null','[]','3','{"version":1,"days":null}'])assert.equal(M.create(storage({[M.KEY]:raw}),()=>local(2026,10,12)).snapshot().today.total,0);
 const denied={getItem(){throw Error('blocked')},setItem(){throw Error('quota')}};
 const store=M.create(denied,()=>local(2026,10,12));store.record(true);store.record(false);store.record(true);
 assert.equal(store.snapshot().today.total,3);assert.equal(store.snapshot().persistent,false);
 const quota=storage({[M.KEY]:JSON.stringify({version:1,days:{'2026-10-12':{correct:4,wrong:1}}})});quota.setItem=()=>{throw Error('quota')};
 const prior=M.create(quota,()=>local(2026,10,12));prior.record(false);prior.record(true);assert.equal(prior.snapshot().today.total,7);
 assert.equal(prior.record('true'),false);assert.equal(prior.snapshot().today.total,7);
});
test('eligible attempts exclude lesson/inactive/completed/Shift/control events',()=>{
 assert.equal(M.eligible('practice',0,2,'R'),true);assert.equal(M.eligible('practice',1,2,'k'),true);
 for(const args of [['lesson',0,2,'a'],['learn',0,2,'a'],['practice',2,2,'a'],['practice',0,0,'a'],['practice',0,2,'⇧'],['practice',0,2,'Enter']])assert.equal(M.eligible(...args),false);
});
test('alternating trackers read latest counts before incrementing, refresh never records',()=>{
 const s=storage(),clock=()=>local(2026,10,12),a=M.create(s,clock),b=M.create(s,clock);
 a.record(true);b.record(false);a.record(true);b.record(true);
 assert.deepEqual(a.snapshot().today,{correct:3,wrong:1,total:4,accuracy:75});
 assert.equal(b.snapshot().today.total,4);assert.equal(a.snapshot().today.total,4);
});
test('quota pending deltas survive refresh and another tracker, clear only after save',()=>{
 const s=storage(),clock=()=>local(2026,10,12);let blocked=true;
 const a=M.create({getItem:s.getItem,setItem:(key,value)=>{if(blocked)throw Error('quota');s.setItem(key,value)}},clock),b=M.create(s,clock);
 a.record(true);b.record(false);assert.equal(a.snapshot().today.total,2);
 a.record(true);b.record(true);assert.deepEqual(a.snapshot().today,{correct:3,wrong:1,total:4,accuracy:75});
 assert.equal(a.snapshot().today.total,4);blocked=false;a.record(false);
 assert.deepEqual(a.snapshot().today,{correct:3,wrong:2,total:5,accuracy:60});
 assert.equal(b.snapshot().today.total,5);assert.equal(a.snapshot().today.total,5);
});
test('controller records each physical/touch evaluation exactly once; routes/render/Shift do not count',()=>{
 const nodes=new Map(),listeners={},s=storage({'hangul-progress-v1':JSON.stringify({version:1,completed:['word-tree']})});let now=local(2026,10,12);
 class ClockDate extends Date{constructor(...args){super(...(args.length?args:[now.getTime()]))}}
 const node=id=>{if(!nodes.has(id))nodes.set(id,{hidden:false,dataset:{},style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},focus(){},appendChild(){},remove(){},setAttribute(){},offsetLeft:0,offsetWidth:0});return nodes.get(id)};
 const pills=[{dataset:{t:'learn'},classList:{toggle(){}},setAttribute(){}},{dataset:{t:'practice'},classList:{toggle(){}},setAttribute(){}}];
 const c=vm.createContext({Date:ClockDate,document:{querySelector:node,querySelectorAll:selector=>selector==='.pill button'?pills:[],documentElement:{dataset:{}},createElement:()=>node('particle')},localStorage:s,navigator:{language:'es'},matchMedia:()=>({matches:false}),location:{hash:'#practice/words'},scrollTo(){},setTimeout:()=>1,clearTimeout(){},addEventListener:(type,fn)=>listeners[type]=fn,console});
 for(const name of ['data','engine','progress','navigation','metrics','app'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../js',name+'.js'),'utf8'),c);
 const key=code=>listeners.keydown({code,target:{closest:()=>null},preventDefault(){}});
 const touch=k=>node('#kb').onclick({target:{closest:()=>({dataset:{k},classList:{toggle(){}},setAttribute(){}})}});
 const total=()=>Object.values(JSON.parse(s.getItem(M.KEY)||'{"days":{}}').days).reduce((n,row)=>n+row.correct+row.wrong,0);
 key('ShiftLeft');touch('⇧');assert.equal(total(),0);
 key('KeyE');key('KeyS');touch('k');key('KeyA');touch('n');assert.equal(total(),5); // one wrong, four correct: 나무
 const row=Object.values(JSON.parse(s.getItem(M.KEY)).days)[0];assert.deepEqual(row,{correct:4,wrong:1});
 key('KeyA');touch('a');assert.equal(total(),5); // completed item
 c.location.hash='#learn';listeners.hashchange();key('KeyA');touch('a');assert.equal(total(),5);
 c.location.hash='#lesson/words';listeners.hashchange();key('KeyA');touch('a');assert.equal(total(),5);
 c.location.hash='#practice/words';listeners.hashchange();assert.equal(total(),5);
 listeners.keydown({code:'KeyA',target:{closest:()=>({})},preventDefault(){}});assert.equal(total(),5);
 const external=M.create(s,()=>now);external.record(false);listeners.storage({key:M.KEY});assert.equal(total(),6);assert.match(node('#practice-summary').innerHTML,/66[.,]7%/);
 now=local(2026,10,13);listeners.focus();assert.match(node('#practice-summary').innerHTML,/2026-10-13/);assert.match(node('#practice-summary').innerHTML,/Sin datos/);assert.equal(total(),6);
 now=local(2026,10,14);listeners.visibilitychange();assert.match(node('#practice-summary').innerHTML,/2026-10-14/);assert.equal(total(),6);
});
