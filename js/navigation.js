(function(root,factory){if(typeof module==="object"&&module.exports)module.exports=factory();else (root.Hangul=root.Hangul||{}).Navigation=factory();})(globalThis,function(){
"use strict";
function parse(hash,levels){
 const m=/^#(learn|practice|lesson)(?:\/([a-z-]+))?$/.exec(hash||"#learn");
 if(!m)return {view:"learn",level:0};
 const level=m[2]?levels.findIndex(l=>l.id===m[2]):0;
 if(level<0 || (m[1]==="learn"&&m[2]))return {view:"learn",level:0};
 return {view:m[1],level};
}
function hash(view,level,levels){return view==="learn"?"#learn":"#"+view+"/"+levels[level].id;}
function preferenceLanguage(value,fallback="es"){return value==="es"||value==="en"?value:fallback==="en"?"en":"es";}
function practiceEntry(state,level,length){
 if(!state.loaded||state.level!==level)return {action:"load",index:0};
 if(state.position>=state.units)return {action:"load",index:(state.index+1)%length};
 return {action:"resume",index:state.index};
}
function capturesKey(event,view){
 if(view!=="practice"||event.ctrlKey||event.metaKey||event.altKey||event.isComposing||!/^Key[A-Z]$/.test(event.code))return false;
 return !event.target?.closest?.("button,input,textarea,select,a,[contenteditable], [role=button]");
}
return {parse,hash,capturesKey,preferenceLanguage,practiceEntry};
});
