(function(root,factory){if(typeof module==="object"&&module.exports)module.exports=factory();else (root.Hangul=root.Hangul||{}).Progress=factory();})(globalThis,function(){
"use strict";
const KEY="hangul-progress-v1";
const record=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
function read(storage,key){try{return storage.getItem(key)}catch{return null}}
function write(storage,key,value){try{storage.setItem(key,value);return true}catch{return false}}
function decode(raw){try{return JSON.parse(raw)}catch{return null}}
function validIds(levels){return new Set(levels.flatMap(l=>l.items.map(x=>x.id)))}
function validate(value,levels){
 if(!record(value)||value.version!==1||!Array.isArray(value.completed))return [];
 const valid=validIds(levels);return [...new Set(value.completed.filter(id=>typeof id==="string"&&valid.has(id)))];
}
function migrate(value,levels,original){
 if(!record(value))return [];
 const valid=validIds(levels),out=[];
 for(let l=0;l<original.length;l++){
  if(!Array.isArray(value[l]))continue;
  for(const i of value[l])if(Number.isInteger(i)&&i>=0&&i<original[l].length&&valid.has(original[l][i]))out.push(original[l][i]);
 }
 return [...new Set(out)];
}
function load(storage,levels,original){
 const current=decode(read(storage,KEY));
 if(record(current)&&current.version===1&&Array.isArray(current.completed))return validate(current,levels);
 const migrated=migrate(decode(read(storage,"prog")),levels,original);
 save(storage,migrated,levels);return migrated;
}
function save(storage,completed,levels){return write(storage,KEY,JSON.stringify({version:1,completed:validate({version:1,completed},levels)}))}
function complete(completed,id,levels){return validate({version:1,completed:[...completed,id]},levels)}
function count(completed,level){const known=new Set(completed);return level.items.filter(x=>known.has(x.id)).length}

const ACCESS_KEY="hangul-unit-access-v1";
function practiceAccess(storage,levels){
 const ids=new Set(levels.map(l=>l.id));
 const clean=value=>record(value)&&value.version===1?{
  introduced:Array.isArray(value.introduced)?[...new Set(value.introduced.filter(id=>ids.has(id)))]:[],
  practiced:Array.isArray(value.practiced)?[...new Set(value.practiced.filter(id=>ids.has(id)))]:[]
 }:{introduced:[],practiced:[]};
 let state=clean(decode(read(storage,ACCESS_KEY))),pending=false;
 function refresh(){const saved=clean(decode(read(storage,ACCESS_KEY)));for(const kind of ["introduced","practiced"])state[kind]=[...new Set([...state[kind],...saved[kind]])]}
 function mark(kind,id){if(!ids.has(id))return false;refresh();if(!state[kind].includes(id)){state[kind].push(id);pending=true}if(pending)pending=!write(storage,ACCESS_KEY,JSON.stringify({version:1,...state}));return true}
 function canPractice(id,completed){refresh();const level=levels.find(l=>l.id===id);return !!level&&(state.introduced.includes(id)||state.practiced.includes(id)||count(completed,level)>0)}
 return {canPractice,acknowledge:id=>mark("introduced",id),recordAttempt:id=>mark("practiced",id)};
}

return {KEY,ACCESS_KEY,read,write,validate,migrate,load,save,complete,count,practiceAccess};
});
