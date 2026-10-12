const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {DATA,ORIGINAL_IDS}=require('../js/data.js'),P=require('../js/progress.js'),M=require('../js/metrics.js');
const storage=(initial={})=>{const data=new Map(Object.entries(initial));return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)}};
const accessData=(introduced=[],practiced=[])=>JSON.stringify({version:1,introduced,practiced});
function controller(s=storage(),hash='#learn'){
 const nodes=new Map(),listeners={},timers=new Map();let clock=0;
 const node=id=>{if(!nodes.has(id))nodes.set(id,{hidden:false,dataset:{},style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},focus(){},appendChild(){},remove(){},setAttribute(){},offsetLeft:0,offsetWidth:0});return nodes.get(id)};
 const pills=['learn','practice'].map(t=>({dataset:{t},classList:{toggle(){}},setAttribute(){}})),location={hash};
 const c=vm.createContext({document:{querySelector:node,querySelectorAll:s=>s==='.pill button'?pills:[],documentElement:{dataset:{}},createElement:()=>node('particle')},localStorage:s,navigator:{language:'es'},matchMedia:()=>({matches:false}),location,history:{replaceState:(_state,_title,hash)=>location.hash=hash},scrollTo(){},setTimeout:(fn,ms)=>{const id=++clock;timers.set(id,{fn,ms});return id},clearTimeout:id=>timers.delete(id),addEventListener:(type,fn)=>listeners[type]=fn});
 for(const name of ['data','engine','progress','navigation','metrics','app'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../js',name+'.js'),'utf8'),c);
 const route=hash=>{location.hash=hash;listeners.hashchange()};
 const click=(id,b)=>{const before=location.hash;node(id).onclick({target:{dataset:b.dataset||{},closest:()=>b}});if(location.hash!==before)listeners.hashchange()};
 const cta=()=>click('#lesson',{dataset:{},hasAttribute:a=>a==='data-practice'});
 const key=(code,extra={})=>listeners.keydown({code,target:{closest:()=>null},preventDefault(){},...extra});
 const touch=k=>click('#kb',{dataset:{k},classList:{toggle(){}},setAttribute(){}});
 return {s,node,route,click,cta,key,touch,location,listeners,timers,visible:id=>!node('#'+id).hidden};
}

test('first practice is guarded through direct hashes, nav, level tabs and history; no sequential locks',()=>{
 const h=controller(undefined,'#practice/words');assert.equal(h.location.hash,'#lesson/words');assert.ok(h.visible('lesson'));assert.ok(!h.visible('practice'));
 h.key('KeyA');h.touch('a');assert.equal(h.s.getItem(P.ACCESS_KEY),null);assert.equal(h.s.getItem(M.KEY),null);
 h.route('#learn');h.click('.pill',{dataset:{t:'practice'}});assert.equal(h.location.hash,'#lesson/letters');
 h.cta();assert.ok(h.visible('practice'));
 for(let i=1;i<DATA.length;i++){
  h.click('#lv',{dataset:{l:String(i)}});assert.equal(h.location.hash,'#lesson/'+DATA[i].id);assert.ok(h.visible('lesson'));
  h.click('.pill',{dataset:{t:'practice'}});assert.equal(h.location.hash,'#lesson/'+DATA[i].id); // nav cannot bypass that unit
 }
 h.route('#practice/words');assert.equal(h.location.hash,'#lesson/words');
 h.route('#lesson/texts');h.cta();assert.equal(h.location.hash,'#practice/texts');assert.ok(h.visible('practice'));
 h.route('#learn');h.route('#practice/texts');assert.ok(h.visible('practice')); // allowed history entry
 h.route('#practice/sentences');assert.ok(h.visible('lesson')); // unallowed history entry
 assert.equal(h.s.getItem(M.KEY),null);assert.deepEqual(P.load(h.s,DATA,ORIGINAL_IDS),[]);
});

test('explicit CTA persists separately, survives reload and stays unit-scoped without a timer',()=>{
 const h=controller(undefined,'#lesson/words');assert.equal(h.s.getItem(P.ACCESS_KEY),null);
 h.click('#lesson',{dataset:{audio:'word-tree'},hasAttribute:()=>false});assert.equal(h.s.getItem(P.ACCESS_KEY),null);
 h.cta();assert.ok(h.visible('practice'));assert.deepEqual(JSON.parse(h.s.getItem(P.ACCESS_KEY)),{version:1,introduced:['words'],practiced:[]});
 assert.equal(h.s.getItem(M.KEY),null);assert.deepEqual(P.load(h.s,DATA,ORIGINAL_IDS),[]);assert.equal(h.timers.size,0);
 h.route('#lesson/words');h.cta();assert.ok(h.visible('practice'));
 assert.ok(controller(h.s,'#practice/words').visible('practice'));assert.ok(controller(h.s,'#practice/phrases').visible('lesson'));
});

test('valid completed IDs exempt existing users only in their own unit, including legacy migration',()=>{
 for(const initial of [{[P.KEY]:JSON.stringify({version:1,completed:['word-tree']})},{prog:JSON.stringify({1:[0]})}]){
  const h=controller(storage(initial),'#practice/words');assert.ok(h.visible('practice'));assert.equal(h.s.getItem(P.ACCESS_KEY),null);
  h.route('#practice/letters');assert.ok(h.visible('lesson'));assert.equal(h.s.getItem(M.KEY),null);
 }
 for(const level of DATA){const s=storage({[P.KEY]:JSON.stringify({version:1,completed:[level.items[0].id]})});assert.ok(controller(s,'#practice/'+level.id).visible('practice'))}
});

test('evaluated wrong and incomplete physical/touch attempts persist practice, not completion',()=>{
 for(const [attempt,correct] of [[h=>h.key('KeyE'),0],[h=>h.touch('q'),1]]){
  const s=storage({[P.KEY]:JSON.stringify({version:1,completed:['word-tree']})}),h=controller(s,'#practice/words');
  h.key('ShiftLeft');h.touch('⇧');h.key('KeyA',{ctrlKey:true});h.key('KeyA',{metaKey:true});h.key('KeyA',{altKey:true});h.key('KeyA',{isComposing:true});h.key('KeyA',{target:{closest:()=>({})}});
  h.click('#nx',{});assert.equal(s.getItem(P.ACCESS_KEY),null);assert.equal(s.getItem(M.KEY),null); // merely loading/skipping is not practice
  attempt(h);assert.deepEqual(JSON.parse(s.getItem(P.ACCESS_KEY)),{version:1,introduced:[],practiced:['words']});
  assert.equal(M.create(s).snapshot().today.total,1);assert.equal(M.create(s).snapshot().today.correct,correct);assert.deepEqual(P.load(s,DATA,ORIGINAL_IDS),['word-tree']);
  s.setItem(P.KEY,JSON.stringify({version:1,completed:[]}));assert.ok(controller(s,'#practice/words').visible('practice'));
  h.route('#learn');h.key('KeyA');h.touch('a');h.route('#lesson/phrases');h.key('KeyA');h.touch('a');assert.equal(M.create(s).snapshot().today.total,1);
 }
});

test('aggregate historical attempts cannot exempt any unit; malformed access cannot open routes',()=>{
 const metrics=JSON.stringify({version:1,days:{[M.day(new Date())]:{correct:20,wrong:5}}});
 for(const raw of ['{bad','null','[]','3','{"version":2,"introduced":["words"]}','{"version":1,"introduced":"words","practiced":null}',accessData(['unknown',null,0],['unknown'])]){
  const h=controller(storage({[M.KEY]:metrics,[P.ACCESS_KEY]:raw}),'#practice/words');assert.ok(h.visible('lesson'));assert.equal(h.s.getItem(M.KEY),metrics);
  h.cta();assert.ok(h.visible('practice'));assert.deepEqual(JSON.parse(h.s.getItem(P.ACCESS_KEY)),{version:1,introduced:['words'],practiced:[]});
 }
});

test('blocked storage keeps acknowledgment/attempts in memory; recovery retries without touching old keys',()=>{
 const denied={getItem(){throw Error('denied')},setItem(){throw Error('quota')}},h=controller(denied,'#practice/words');
 assert.ok(h.visible('lesson'));h.cta();h.key('KeyE');h.route('#learn');h.route('#practice/words');assert.ok(h.visible('practice'));
 h.route('#practice/phrases');assert.ok(h.visible('lesson'));assert.ok(controller(denied,'#practice/words').visible('lesson'));
 const s=storage({lang:'es',prog:'legacy',[P.KEY]:'progress',[M.KEY]:'metrics'});let blocked=true;
 const access=P.practiceAccess({getItem:s.getItem,setItem:(k,v)=>{if(blocked)throw Error('quota');s.setItem(k,v)}},DATA);
 access.acknowledge('words');access.recordAttempt('phrases');assert.ok(access.canPractice('words',[]));assert.ok(access.canPractice('phrases',[]));
 blocked=false;access.acknowledge('words');assert.deepEqual(JSON.parse(s.getItem(P.ACCESS_KEY)),{version:1,introduced:['words'],practiced:['phrases']});
 for(const [k,v] of Object.entries({lang:'es',prog:'legacy',[P.KEY]:'progress',[M.KEY]:'metrics'}))assert.equal(s.getItem(k),v);
 assert.equal(access.acknowledge('unknown'),false);assert.equal(access.canPractice('unknown',[]),false);
});

test('access validation preserves only stable known IDs and merges alternating trackers',()=>{
 const s=storage({[P.ACCESS_KEY]:accessData(['words','words',null,'unknown'],['phrases','phrases',3])}),a=P.practiceAccess(s,DATA),b=P.practiceAccess(s,DATA);
 assert.ok(a.canPractice('words',[]));assert.ok(a.canPractice('phrases',[]));assert.ok(!a.canPractice('letters',[]));
 a.acknowledge('letters');b.recordAttempt('texts');assert.ok(a.canPractice('texts',[]));
 assert.deepEqual(JSON.parse(s.getItem(P.ACCESS_KEY)),{version:1,introduced:['words','letters'],practiced:['phrases','texts']});
});

test('daily summary exists only inside Practice, retaining styles and classic script count',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8'),learn=html.slice(html.indexOf('<section id="learn"'),html.indexOf('<section id="lesson"')),practice=html.slice(html.indexOf('<section id="practice"'),html.indexOf('</main>'));
 assert.ok(!learn.includes('id="practice-summary"'));assert.ok(practice.includes('class="card" id="practice-summary"'));assert.equal((html.match(/id="practice-summary"/g)||[]).length,1);
 assert.equal((html.match(/<script defer src=/g)||[]).length,6);
});
