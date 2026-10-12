(function(root,factory){if(typeof module==="object"&&module.exports)module.exports=factory();else (root.Hangul=root.Hangul||{}).Engine=factory();})(globalThis,function(){
"use strict";
const Ls="ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ",Vs="ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ",Ts=["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const SP={"ㅘ":"ㅗㅏ","ㅙ":"ㅗㅐ","ㅚ":"ㅗㅣ","ㅝ":"ㅜㅓ","ㅞ":"ㅜㅔ","ㅟ":"ㅜㅣ","ㅢ":"ㅡㅣ","ㄳ":"ㄱㅅ","ㄵ":"ㄴㅈ","ㄶ":"ㄴㅎ","ㄺ":"ㄹㄱ","ㄻ":"ㄹㅁ","ㄼ":"ㄹㅂ","ㄽ":"ㄹㅅ","ㄾ":"ㄹㅌ","ㄿ":"ㄹㅍ","ㅀ":"ㄹㅎ","ㅄ":"ㅂㅅ"};
const ROWS=[["qwertyuiop","ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔ"],["asdfghjkl","ㅁㄴㅇㄹㅎㅗㅓㅏㅣ"],["zxcvbnm","ㅋㅌㅊㅍㅠㅜㅡ"]];
const SH={Q:"ㅃ",W:"ㅉ",E:"ㄸ",R:"ㄲ",T:"ㅆ",O:"ㅒ",P:"ㅖ"};
const J2K={};ROWS.forEach(([k,j])=>[...k].forEach((c,i)=>J2K[j[i]]=c));for(const k in SH)J2K[SH[k]]=k;
const jk=j=>[...(SP[j]||j)].map(x=>J2K[x]);
const units=s=>[...s].map(ch=>{const n=ch.charCodeAt(0)-44032;let k=[];
 if(n>=0&&n<11172)k=[...jk(Ls[n/588|0]),...jk(Vs[(n%588)/28|0]),...(n%28?jk(Ts[n%28]):[])];
 else if(J2K[ch]||SP[ch])k=jk(ch);return{ch,k}});
const K2J={};for(const j in J2K)K2J[J2K[j]]=j;
const VW="ㅛㅕㅑㅐㅔㅗㅓㅏㅣㅠㅜㅡ",ALPHA={V:"ㅏ:a ㅑ:ya ㅓ:eo ㅕ:yeo ㅗ:o ㅛ:yo ㅜ:u ㅠ:yu ㅡ:eu ㅣ:i ㅐ:ae ㅔ:e",C:"ㄱ:g/k ㄴ:n ㄷ:d/t ㄹ:r/l ㅁ:m ㅂ:b/p ㅅ:s ㅇ:ng ㅈ:j ㅊ:ch ㅋ:k ㅌ:t ㅍ:p ㅎ:h ㄲ:kk ㄸ:tt ㅃ:pp ㅆ:ss ㅉ:jj"};

return {Ls,Vs,Ts,SP,ROWS,SH,J2K,K2J,VW,ALPHA,units};
});
