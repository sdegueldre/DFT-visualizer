parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"yn5V":[function(require,module,exports) {
"use strict";module.exports=i;var r=8192,a=65536,t=new ArrayBuffer(4*a),o=new Float64Array(t,a,r),e=new Float64Array(t,2*a,r/2),n=h({Math:Math,Float64Array:Float64Array},null,t);function i(a){if(!a)throw Error("Input data is not provided, pass an array.");var t=a.length;if(t>r)throw Error("Input length is too big, must be under "+r);var i=Math.floor(Math.log(t)/Math.LN2);if(Math.pow(2,i)!==t)throw Error("Invalid array size, must be a power of 2.");return o.set(a),n(t,i),e.subarray(0,t/2)}function h(r,a,t){"use asm";var o=6.283185307179586;var e=r.Math.sqrt;var n=r.Math.sin;var i=r.Math.cos;var h=r.Math.abs;var l=r.Math.SQRT1_2;var f=r.Math.imul;var s=new r.Float64Array(t);var v=new r.Float64Array(t);var u=8192;var w=16384;function M(r,a){r=r|0;a=a|0;var t=0,u=0,M=0.0,d=0,p=0,A=0,c=0,F=0.0,b=0.0,m=0.0,g=0.0,E=0,I=0,q=0,x=0,z=0,B=0,L=0,N=0,Q=0.0,R=0.0,S=0.0,T=0.0,_=0.0,j=0.0,k=0.0,C=0.0,D=0.0,G=0.0;var H=0,J=0,K=0;t=r>>>1;M=2.0/+(r|0);y(r);for(H=0,K=4;(H|0)<(r|0);K=f(K,4)){for(J=H;(J|0)<(r|0);J=J+K|0){Q=v[J<<3>>3]-v[J+1<<3>>3];v[J<<3>>3]=v[J<<3>>3]+v[J+1<<3>>3];v[J+1<<3>>3]=Q}H=f(2,K-1)}d=2;c=r>>>1;while(c=c>>>1){H=0;d=d<<1;K=d<<1;p=d>>>2;A=d>>>3;do{if((p|0)!=1){for(J=H;(J|0)<(r|0);J=J+K|0){E=J;I=E+p|0;q=I+p|0;x=q+p|0;F=v[q<<3>>3]+v[x<<3>>3];v[x<<3>>3]=v[x<<3>>3]-v[q<<3>>3];v[q<<3>>3]=v[E<<3>>3]-F;v[E<<3>>3]=v[E<<3>>3]+F;E=E+A|0;I=I+A|0;q=q+A|0;x=x+A|0;F=v[q<<3>>3]+v[x<<3>>3];b=v[q<<3>>3]-v[x<<3>>3];F=-F*l;b=b*l;Q=+v[I<<3>>3];v[x<<3>>3]=F+Q;v[q<<3>>3]=F-Q;v[I<<3>>3]=v[E<<3>>3]-b;v[E<<3>>3]=v[E<<3>>3]+b}}else{for(J=H;(J|0)<(r|0);J=J+K|0){E=J;I=E+p|0;q=I+p|0;x=q+p|0;F=v[q<<3>>3]+v[x<<3>>3];v[x<<3>>3]=v[x<<3>>3]-v[q<<3>>3];v[q<<3>>3]=v[E<<3>>3]-F;v[E<<3>>3]=v[E<<3>>3]+F}}H=(K<<1)-d|0;K=K<<2}while((H|0)<(r|0));j=o/+(d|0);for(u=1;(u|0)<(A|0);u=u+1|0){k=+(u|0)*j;S=n(k);R=i(k);T=4.0*R*(R*R-0.75);_=4.0*S*(0.75-S*S);H=0;K=d<<1;do{for(J=H;(J|0)<(r|0);J=J+K|0){E=J+u|0;I=E+p|0;q=I+p|0;x=q+p|0;z=J+p-u|0;B=z+p|0;L=B+p|0;N=L+p|0;b=v[L<<3>>3]*R-v[q<<3>>3]*S;F=v[L<<3>>3]*S+v[q<<3>>3]*R;g=v[N<<3>>3]*T-v[x<<3>>3]*_;m=v[N<<3>>3]*_+v[x<<3>>3]*T;Q=b-g;b=b+g;g=Q;v[N<<3>>3]=b+v[B<<3>>3];v[q<<3>>3]=b-v[B<<3>>3];Q=m-F;F=F+m;m=Q;v[x<<3>>3]=m+v[I<<3>>3];v[L<<3>>3]=m-v[I<<3>>3];v[B<<3>>3]=v[E<<3>>3]-F;v[E<<3>>3]=v[E<<3>>3]+F;v[I<<3>>3]=g+v[z<<3>>3];v[z<<3>>3]=v[z<<3>>3]-g}H=(K<<1)-d|0;K=K<<2}while((H|0)<(r|0))}}while(t=t-1|0){C=+v[t<<3>>3];D=+v[r-t-1<<3>>3];G=M*e(C*C+D*D);s[w+t<<3>>3]=G}s[w+0<<3>>3]=h(M*v[0<<3>>3])}function y(r){r=r|0;var a=0,t=0,o=1,e=0,n=0;a=r>>>1;t=r-1|0;v[0<<3>>3]=s[u+0<<3>>3];do{e=e+a|0;v[o<<3>>3]=s[u+e<<3>>3];v[e<<3>>3]=s[u+o<<3>>3];o=o+1|0;n=a<<1;while(n=n>>1,((e=e^n)&n)==0){}if((e|0)>=(o|0)){v[o<<3>>3]=s[u+e<<3>>3];v[e<<3>>3]=s[u+o<<3>>3];v[t-o<<3>>3]=s[u+t-e<<3>>3];v[t-e<<3>>3]=s[u+t-o<<3>>3]}o=o+1|0}while((o|0)<(a|0));v[t<<3>>3]=s[u+t<<3>>3]}return M}
},{}],"Focm":[function(require,module,exports) {
"use strict";var t=e(require("fourier-transform/asm"));function e(t){return t&&t.__esModule?t:{default:t}}const n=document.querySelector("audio"),i=n.src,a=document.querySelector("canvas");a.width=window.innerWidth,a.height=window.innerHeight;let o=a.getContext("2d"),h=o.createLinearGradient(0,0,a.width,a.height);h.addColorStop(0,"#30bf33"),h.addColorStop(1,"#008ce2"),o.fillStyle=h;const r=44100;let d,l,c={};const s=new AudioContext;function u(t){const e=new FileReader,i=URL.createObjectURL(t);n.src=i,e.readAsArrayBuffer(t),e.onload=(async()=>{const t=await s.decodeAudioData(e.result);d=t.getChannelData(0),l=t.getChannelData(1),M||C(),console.log("Samples acquired")})}(async()=>{const t=await fetch(i);u(await t.blob())})();const w=document.querySelector("input");w.addEventListener("change",async()=>{c={},u(w.files[0])}),window.addEventListener("resize",()=>{a.width=window.innerWidth,a.height=window.innerHeight,o=a.getContext("2d"),(h=o.createLinearGradient(0,0,a.width,a.height)).addColorStop(0,"#30bf33"),h.addColorStop(1,"#008ce2"),o.fillStyle=h,M||C()});const g=4096;function f(e){const n=S(e*r,r/30);if(!c[n]){let e=d.slice(Math.max(0,n-g),Math.max(2*g,n+g)),i=l.slice(Math.max(0,n-g),Math.max(2*g,n+g));e=e.map((t,n)=>t*(Math.cos(n/e.length*2*Math.PI+Math.PI)+1)),i=i.map((t,e)=>t*(Math.cos(e/i.length*2*Math.PI+Math.PI)+1)),e.length!=2*g?c[n]=[[],[]]:c[n]=[[...(0,t.default)(e)],[...(0,t.default)(i)]]}return c[n]}const m=Math.log,y=1/m(g+1);let x,M=!1,p=[];function C(){M=!0,o.clearRect(0,0,a.width,a.height),(d?f(n.currentTime):[]).map((t,e)=>t.map((t,n)=>{const i=m(n+1)*a.width*y;return{x:i,y:(e%2?t:-t)*a.height/2*(Math.pow(25,i/a.width)/2)+a.height/2}})).forEach(t=>{if(0!=t.length){o.beginPath(),o.moveTo(0,a.height/2),o.lineTo(0,t[0].y);for(let e=1;e<t.length-1;e++){const n=t[e],i=t[e+1],a={x:.5*(n.x+i.x),y:.5*(n.y+i.y)};o.quadraticCurveTo(n.x,n.y,a.x,a.y)}o.lineTo(a.width,t[t.length-1].y),o.lineTo(a.width,a.height/2),o.fill()}});let t=Date.now();if(x&&p.push(t-x),p.length>=120){const t=`FPS: ${(1e3/(p=p.slice(1)).reduce((t,e)=>t+e)*p.length).toFixed(1)}`,e=o.measureText(t).width,i=n.clientHeight+10+10;o.fillText(t,o.canvas.width-e-10,i)}x=t,window.requestAnimationFrame(C)}function S(t,e){return Math.round(t/e)*e}window.fillCache=(()=>{for(let t=0;t<n.duration;t+=.001)f(t)});
},{"fourier-transform/asm":"yn5V"}]},{},["Focm"], null)
//# sourceMappingURL=src.b180bbfd.js.map