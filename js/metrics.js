(function(root,factory){if(typeof module==="object"&&module.exports)module.exports=factory();else (root.Hangul=root.Hangul||{}).Metrics=factory();})(globalThis,function(){
"use strict";
const KEY="hangul-metrics-v1", DAYS=90;
const object=value=>value!==null&&typeof value==="object"&&!Array.isArray(value);
const number=value=>Number.isSafeInteger(value)&&value>=0;
function day(date){return `${String(date.getFullYear()).padStart(4,"0")}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`}
function offset(date,amount){const result=new Date(date.getTime());result.setHours(12,0,0,0);result.setDate(result.getDate()+amount);return result}
function realDate(key){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(key))return false;
 const [year,month,date]=key.split("-").map(Number);if(year<1)return false;
 const value=new Date(0);value.setUTCHours(0,0,0,0);value.setUTCFullYear(year,month-1,date);
 return value.getUTCFullYear()===year&&value.getUTCMonth()===month-1&&value.getUTCDate()===date;
}
function empty(){return {version:1,days:{}}}
function validate(value,now=new Date()){
 const result=empty();if(!object(value)||value.version!==1||!object(value.days))return result;
 const today=day(now),first=day(offset(now,-(DAYS-1)));
 for(const [key,row]of Object.entries(value.days)){
  if(!realDate(key)||key<first||key>today||!object(row)||!number(row.correct)||!number(row.wrong)||!Number.isSafeInteger(row.correct+row.wrong))continue;
  result.days[key]={correct:row.correct,wrong:row.wrong};
 }
 return result;
}
function row(value){const correct=value?.correct||0,wrong=value?.wrong||0,total=correct+wrong;return {correct,wrong,total,accuracy:total?correct/total*100:null}}
function summarize(value,now=new Date()){
 const data=validate(value,now),todayKey=day(now),yesterdayKey=day(offset(now,-1));
 const today=row(data.days[todayKey]),yesterday=row(data.days[yesterdayKey]);
 return {todayKey,yesterdayKey,today,yesterday,delta:today.total&&yesterday.total?today.accuracy-yesterday.accuracy:null};
}
function eligible(view,position,length,key){return view==="practice"&&position<length&&/^[a-zA-Z]$/.test(key)}
function create(storage,clock=()=>new Date()){
 let base=empty(),pending=empty(),persistent=true;
 function refresh(now){
  let raw;try{raw=storage.getItem(KEY)}catch{persistent=false;return}
  try{base=validate(JSON.parse(raw),now)}catch{base=empty()}
  if(!Object.keys(pending.days).length)persistent=true;
 }
 function combined(now){
  base=validate(base,now);pending=validate(pending,now);
  const state=validate(base,now);
  for(const [key,delta]of Object.entries(pending.days)){
   const prior=state.days[key]||{correct:0,wrong:0};
   const correct=prior.correct+delta.correct,wrong=prior.wrong+delta.wrong;
   if(Number.isSafeInteger(correct+wrong))state.days[key]={correct,wrong};
  }
  return state;
 }
 refresh(clock());
 function record(success){
  if(typeof success!=="boolean")return false;
  const now=clock();refresh(now);const key=day(now),current=combined(now).days[key]||{correct:0,wrong:0};
  if(current.correct+current.wrong===Number.MAX_SAFE_INTEGER)return false;
  const delta=pending.days[key]||{correct:0,wrong:0};
  pending.days[key]={correct:delta.correct+(success?1:0),wrong:delta.wrong+(success?0:1)};
  const state=combined(now);
  try{storage.setItem(KEY,JSON.stringify(state));base=state;pending=empty();persistent=true}catch{persistent=false}
  return true;
 }
 function snapshot(){const now=clock();refresh(now);return {...summarize(combined(now),now),persistent}}
 return {record,snapshot};
}
return {KEY,DAYS,day,offset,realDate,validate,summarize,eligible,create};
});
