const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {DATA,ORIGINAL_IDS,LESSONS}=require('../js/data.js'),E=require('../js/engine.js'),P=require('../js/progress.js'),N=require('../js/navigation.js'),original=require('./original-content.json');
const keys=s=>E.units(s).flatMap(x=>x.k).join('');
const storage=(initial={})=>{const m=new Map(Object.entries(initial));return{getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)}};
test('30 original exercise tuples and explicit migration IDs unchanged',()=>{
 assert.deepEqual(DATA.map(l=>l.items.map(({ko,roman,es,en})=>[ko,roman,es,en])),original);
 assert.deepEqual(DATA.map(l=>l.items.length),[5,10,7,6,2]);
 const ids=DATA.flatMap(l=>l.items.map(x=>x.id));assert.equal(new Set(ids).size,30);
 assert.deepEqual(DATA.map(l=>l.items.map(x=>x.id)),ORIGINAL_IDS);
 for(const l of DATA)for(const x of l.items)for(const k of ['id','ko','roman','es','en'])assert.ok(typeof x[k]==='string'&&x[k]);
});
test('five bilingual reading lessons reference existing examples',()=>{
 assert.equal(LESSONS.length,5);const ids=new Set(DATA.flatMap(l=>l.items.map(x=>x.id)));
 for(const l of LESSONS){for(const lang of ['es','en']){assert.ok(l[lang].title);assert.equal(l[lang].paragraphs.length,3);assert.ok(l[lang].paragraphs.every(p=>p.length>60))}assert.ok(l.examples.every(id=>ids.has(id)))}
});
test('blocks, shifted consonants/vowels, compound vowels and batchim',()=>{
 for(const [s,k]of Object.entries({'한':'gks','물':'anf','한국':'gksrnr','까':'Rk','땀':'Eka','뻐':'Qj','써':'Tj','짜':'Wk','ㅒ':'O','ㅖ':'P','ㅘ':'hk','ㅙ':'ho','ㅚ':'hl','ㅝ':'nj','ㅞ':'np','ㅟ':'nl','ㅢ':'ml','값':'rkqt','읽':'dlfr','앉':'dksw','없':'djqt','괜':'rhos','꽃':'Rhc'}))assert.equal(keys(s),k,s);
 assert.deepEqual(E.units(' ?A\n').map(x=>x.k),[[],[],[],[]]);
});
test('all 11172 modern syllables produce nonempty mapped keys',()=>{
 for(let c=0xac00;c<=0xd7a3;c++){const k=E.units(String.fromCharCode(c))[0].k;assert.ok(k.length>=2&&k.every(x=>typeof x==='string'&&E.K2J[x]))}
});
test('migration respects zero, rejects invalid types/ranges and deduplicates',()=>{
 assert.deepEqual(P.migrate({0:[0,0,4,-1,5,.5,'1',null],1:[0,9,10],2:'0',4:[1],8:[0]},DATA,ORIGINAL_IDS),['letters-vowels','letters-compound-vowels','word-tree','word-friend','text-weekend']);
 for(const x of [null,[],0,'x',{0:{}}])assert.deepEqual(P.migrate(x,DATA,ORIGINAL_IDS),[]);
});
test('migration leaves legacy key intact; versioned progress takes precedence',()=>{
 const old=JSON.stringify({0:[0],1:[0]}),s=storage({prog:old});assert.deepEqual(P.load(s,DATA,ORIGINAL_IDS),['letters-vowels','word-tree']);assert.equal(s.getItem('prog'),old);
 P.save(s,['text-weekend'],DATA);assert.deepEqual(P.load(s,DATA,ORIGINAL_IDS),['text-weekend']);P.save(s,[],DATA);assert.deepEqual(P.load(s,DATA,ORIGINAL_IDS),[]);
});
test('malformed JSON/types and unavailable/quota-limited storage are safe',()=>{
 for(const x of ['{bad','null','[]','3','"bad"','{"version":1,"completed":null}'])assert.deepEqual(P.load(storage({prog:x,[P.KEY]:x}),DATA,ORIGINAL_IDS),[]);
 const denied={getItem(){throw Error('denied')},setItem(){throw Error('quota')}};assert.deepEqual(P.load(denied,DATA,ORIGINAL_IDS),[]);assert.equal(P.save(denied,['word-tree'],DATA),false);assert.deepEqual(P.load(null,DATA,ORIGINAL_IDS),[]);
 const quota=storage({prog:'{"0":[0]}'});quota.setItem=()=>{throw Error('quota')};assert.deepEqual(P.load(quota,DATA,ORIGINAL_IDS),['letters-vowels']);
});
test('new progress validates IDs, types and duplicates',()=>{
 assert.deepEqual(P.validate({version:1,completed:['word-tree','word-tree',null,0,'unknown']},DATA),['word-tree']);assert.deepEqual(P.validate({version:2,completed:['word-tree']},DATA),[]);assert.deepEqual(P.complete(['word-tree'],'word-tree',DATA),['word-tree']);
});
test('reordering items/levels cannot relabel old or new completion',()=>{
 const reordered=[...DATA].reverse().map(l=>({...l,items:[...l.items].reverse()})),s=storage({prog:'{"0":[0],"1":[0]}'});assert.deepEqual(P.load(s,reordered,ORIGINAL_IDS),['letters-vowels','word-tree']);assert.equal(P.count(['word-tree'],reordered.find(l=>l.id==='words')),1);assert.deepEqual(P.load(s,reordered,ORIGINAL_IDS),['letters-vowels','word-tree']);
});
test('lesson and practice hashes are distinct, invalid hashes fall back safely',()=>{
 for(let l=0;l<DATA.length;l++)for(const view of ['lesson','practice'])assert.deepEqual(N.parse(N.hash(view,l,DATA),DATA),{view,level:l});
 for(const hash of ['','#oops','#lesson/unknown','#learn/words'])assert.deepEqual(N.parse(hash,DATA),{view:'learn',level:0});
});
test('physical typing ignores controls, modifiers, IME and nonpractice views',()=>{
 const e={code:'KeyA',target:{closest:()=>null}};assert.equal(N.capturesKey(e,'practice'),true);
 for(const v of ['learn','lesson'])assert.equal(N.capturesKey(e,v),false);
 for(const x of [{ctrlKey:true},{metaKey:true},{altKey:true},{isComposing:true},{code:'Enter'},{target:{closest:()=>({})}}])assert.equal(N.capturesKey({...e,...x},'practice'),false);
});
test('classic scripts work without CommonJS, imports or fetch',()=>{
 const c=vm.createContext({});for(const name of ['data','engine','progress','navigation'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../js',name+'.js'),'utf8'),c);
 assert.equal(c.Hangul.Data.DATA.length,5);assert.equal(c.Hangul.Engine.units('한')[0].k.join(''),'gks');
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');assert.equal((html.match(/<script defer src=/g)||[]).length,5);assert.ok(!html.includes('type="module"'));
});
test('language preferences whitelist ES/EN and reject inherited or corrupt keys',()=>{
 for(const lang of ['es','en'])assert.equal(N.preferenceLanguage(lang),lang);
 for(const lang of ['__proto__','constructor','toString','valueOf','ES','',null,0,{},[]])assert.equal(N.preferenceLanguage(lang),'es');
 assert.equal(N.preferenceLanguage('__proto__','en'),'en');assert.equal(N.preferenceLanguage(null,'constructor'),'es');
});
test('practice reentry resumes unfinished items and advances finished ones without recounting',()=>{
 const state={loaded:true,level:1,index:0,position:4,units:4};
 assert.deepEqual(N.practiceEntry(state,1,10),{action:'load',index:1});
 // Same completed state applies to leaving/returning or clicking active Practice during celebration.
 assert.deepEqual(N.practiceEntry({...state,index:9},1,10),{action:'load',index:0});
 assert.deepEqual(N.practiceEntry({...state,position:2},1,10),{action:'resume',index:0});
 assert.deepEqual(N.practiceEntry(state,2,7),{action:'load',index:0});
 assert.deepEqual(N.practiceEntry({...state,loaded:false},1,10),{action:'load',index:0});
 assert.deepEqual(N.practiceEntry({...state,index:1,position:0},1,10),{action:'resume',index:1});
 assert.equal(state.index,0);assert.equal(state.position,4);
});
