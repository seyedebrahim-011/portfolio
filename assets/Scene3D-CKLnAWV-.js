import{r as pe,j as Te,g as de}from"./index-CkuJ6Qrk.js";import{W as Ee,S as Fe,P as Ve,G as fe,a as xe,C as V,V as Re,M as X,I as Ge,b as _e,A as z,T as ye,B as R,c as M,d as $,e as De,L as Le,f as Be,g as we}from"./three-COo8ura7.js";const Ne=`
vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`,We=`
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform float uPulse;
uniform vec2 uPointer;
varying vec3 vNormalV;
varying vec3 vViewDir;
varying float vNoise;
varying float vY;
${Ne}
void main(){
  vec3 dir = normalize(position);
  float n  = snoise(dir * uFreq + vec3(0.0, 0.0, uTime * 0.28));
  float n2 = snoise(dir * uFreq * 2.3 - vec3(uTime * 0.2, 0.0, 0.0)) * 0.5;
  float d  = n + n2 * 0.5;
  vec3 pdir = normalize(vec3(uPointer.x, uPointer.y, 0.9));
  float infl = pow(max(dot(dir, pdir), 0.0), 7.0) * 0.2;
  vec3 p = position + normal * (d * uAmp + infl + uPulse);
  vNoise = d;
  vY = dir.y;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vNormalV = normalize(normalMatrix * normal);
  vViewDir = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`,je=`
uniform float uTime;
uniform float uGlow;
uniform float uOpacity;
uniform vec3 uColA;
uniform vec3 uColB;
uniform vec3 uRim;
varying vec3 vNormalV;
varying vec3 vViewDir;
varying float vNoise;
varying float vY;
void main(){
  float ndv = max(dot(normalize(vNormalV), normalize(vViewDir)), 0.0);
  float fres = pow(1.0 - ndv, 2.4);
  vec3 col = mix(uColA, uColB, smoothstep(-0.7, 0.8, vNoise));
  float band = 0.5 + 0.5 * sin(vY * 22.0 - uTime * 1.4);
  col += uRim * fres * uGlow;
  col += uRim * 0.07 * band * (0.35 + fres);
  float alpha = (0.5 + fres * 0.5) * uOpacity;
  gl_FragColor = vec4(col, alpha);
}
`,Oe=`
uniform float uTime;
uniform float uSize;
uniform float uPixel;
attribute float aSeed;
attribute float aRadius;
varying float vTw;
void main(){
  float ang = uTime * (0.05 + aSeed * 0.12) + aSeed * 6.2831;
  float c = cos(ang);
  float s = sin(ang);
  vec3 p = position * aRadius;
  p = vec3(c * p.x + s * p.z, p.y + sin(uTime * 0.6 + aSeed * 12.0) * 0.05, -s * p.x + c * p.z);
  vTw = 0.55 + 0.45 * sin(uTime * 1.6 + aSeed * 40.0);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * uPixel * (0.45 + aSeed) * (7.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`,Ie=`
uniform vec3 uColor;
uniform float uOpacity;
varying float vTw;
void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(uColor, a * a * vTw * uOpacity);
}
`,Ye={ready:{amp:.16,freq:1.1,spin:.12,pulse:0},listening:{amp:.22,freq:1.35,spin:.2,pulse:1},processing:{amp:.3,freq:1.9,spin:.5,pulse:0}},r=(w,h,b)=>w+(h-w)*b;function Ue({tier:w,onFail:h}){const b=pe.useRef(null);return pe.useEffect(()=>{const J=b.current;if(!J)return;const p=w==="full";let u;try{u=new Ee({alpha:!0,antialias:p,powerPreference:"high-performance"})}catch{h();return}const K=Math.min(window.devicePixelRatio||1,p?1.75:1);u.setPixelRatio(K),u.setClearColor(0,0),J.appendChild(u.domElement);const G=new Fe,d=new Ve(40,1,.1,50);d.position.z=8;const f=new fe,v=new fe;f.add(v),G.add(f);const Q=new xe({vertexShader:We,fragmentShader:je,transparent:!0,uniforms:{uTime:{value:0},uAmp:{value:.16},uFreq:{value:1.1},uPulse:{value:0},uPointer:{value:new Re},uGlow:{value:1.35},uOpacity:{value:1},uColA:{value:new V(1181478)},uColB:{value:new V(6960639)},uRim:{value:new V(12164095)}}}),he=new X(new Ge(1.45,p?34:16),Q);v.add(he);const _=new _e({color:10120191,transparent:!0,opacity:.35,blending:z,depthWrite:!1}),D=new X(new ye(2.05,.006,8,160),_),L=new X(new ye(2.4,.005,8,160),_);D.rotation.x=1.15,L.rotation.set(.5,.6,0),v.add(D,L);const P=p?1800:600,Z=new Float32Array(P*3),ee=new Float32Array(P),te=new Float32Array(P);for(let e=0;e<P;e++){const n=Math.random()*2-1,t=Math.random()*Math.PI*2,c=Math.sqrt(1-n*n);Z.set([c*Math.cos(t),n,c*Math.sin(t)],e*3),ee[e]=Math.random(),te[e]=1.75+Math.random()*1}const A=new R;A.setAttribute("position",new M(Z,3)),A.setAttribute("aSeed",new M(ee,1)),A.setAttribute("aRadius",new M(te,1));const oe=new xe({vertexShader:Oe,fragmentShader:Ie,transparent:!0,depthWrite:!1,blending:z,uniforms:{uTime:{value:0},uSize:{value:5.5},uPixel:{value:K},uColor:{value:new V(13218047)},uOpacity:{value:.9}}}),ge=new $(A,oe);v.add(ge);const S=p?110:60,a=[],ze=Math.PI*(3-Math.sqrt(5));for(let e=0;e<S;e++){const n=1-e/(S-1)*2,t=Math.sqrt(1-n*n),c=ze*e;a.push(new De(Math.cos(c)*t,n,Math.sin(c)*t).multiplyScalar(1.95+(Math.random()-.5)*.18))}const x=[],Me=p?.98:1.35;for(let e=0;e<S;e++)for(let n=e+1;n<S;n++)a[e].distanceTo(a[n])<Me&&x.push([e,n]);const ne=new Float32Array(x.length*6);x.forEach(([e,n],t)=>{ne.set([a[e].x,a[e].y,a[e].z,a[n].x,a[n].y,a[n].z],t*6)});const ae=new R;ae.setAttribute("position",new M(ne,3));const re=new Le({color:10120191,transparent:!0,opacity:0,blending:z,depthWrite:!1}),be=new Be(ae,re),Pe=new R().setFromPoints(a),ie=new we({color:14272767,size:.07,sizeAttenuation:!0,transparent:!0,opacity:0,blending:z,depthWrite:!1}),Ae=new $(Pe,ie);v.add(be,Ae);const B=p?16:8,Se=Array.from({length:B},()=>({e:Math.floor(Math.random()*x.length),t:Math.random(),v:.25+Math.random()*.5})),C=new Float32Array(B*3),N=new R;N.setAttribute("position",new M(C,3));const se=new we({color:16777215,size:.12,sizeAttenuation:!0,transparent:!0,opacity:0,blending:z,depthWrite:!1});v.add(new $(N,se));const W=()=>{const e=window.innerWidth,n=window.innerHeight;u.setSize(e,n),d.aspect=e/n,d.updateProjectionMatrix()};W();const i={x:0,y:0,sx:0,sy:0},ce=e=>{i.x=e.clientX/window.innerWidth*2-1,i.y=-(e.clientY/window.innerHeight*2-1)},le=e=>{e.preventDefault(),h()};window.addEventListener("resize",W),window.addEventListener("pointermove",ce,{passive:!0}),u.domElement.addEventListener("webglcontextlost",le);const s=de(),o={x:r(s.a.x,s.b.x,s.t),y:r(s.a.y,s.b.y,s.t),s:r(s.a.s,s.b.s,s.t),net:r(s.a.net,s.b.net,s.t),amp:.16,freq:1.1,spin:.12};let q=0,j=performance.now(),O=0,I=!1;const ue=e=>{if(O=requestAnimationFrame(ue),document.hidden){j=e;return}if(!p&&(I=!I,I))return;const n=Math.min(.05,(e-j)/1e3);j=e,q+=n;const t=de(),c=r(t.a.x,t.b.x,t.t),T=r(t.a.y,t.b.y,t.t),E=r(t.a.s,t.b.s,t.t),Y=r(t.a.net,t.b.net,t.t),Ce=t.t<.5?t.a.mood:t.b.mood,F=Ye[Ce],l=1-Math.exp(-n*3.2);o.x+=(c-o.x)*l,o.y+=(T-o.y)*l,o.s+=(E-o.s)*l,o.net+=(Y-o.net)*l,o.amp+=(F.amp-o.amp)*l,o.freq+=(F.freq-o.freq)*l,o.spin+=(F.spin-o.spin)*l;const H=Math.tan(d.fov*Math.PI/360)*d.position.z,ve=H*d.aspect,me=d.aspect<.85,qe=document.documentElement.dir==="rtl"?-1:1;f.position.x=me?0:o.x*qe*ve*.7,f.position.y=me?H*.3:o.y*H*.6,f.scale.setScalar(o.s*Math.min(1.1,ve*.85/2.4)),i.sx+=(i.x-i.sx)*l,i.sy+=(i.y-i.sy)*l,v.rotation.y+=n*o.spin,v.rotation.x=r(v.rotation.x,-i.sy*.25,l),f.rotation.y=r(f.rotation.y,i.sx*.35,l);const g=Q.uniforms;if(g.uTime.value=q,g.uAmp.value=o.amp,g.uFreq.value=o.freq,g.uPulse.value=F.pulse?Math.sin(q*2.2)*.045:0,g.uPointer.value.set(i.sx,i.sy),oe.uniforms.uTime.value=q,D.rotation.z+=n*(.1+o.spin),L.rotation.z-=n*(.08+o.spin*.8),_.opacity=.35*(1-o.net*.6),re.opacity=.34*o.net,ie.opacity=.9*o.net,se.opacity=o.net>.05?Math.min(1,o.net*1.2):0,o.net>.05&&x.length){for(let y=0;y<B;y++){const m=Se[y];m.t+=n*m.v*(1+o.spin),m.t>1&&(m.t=0,m.e=Math.floor(Math.random()*x.length));const[k,U]=x[m.e];C[y*3]=r(a[k].x,a[U].x,m.t),C[y*3+1]=r(a[k].y,a[U].y,m.t),C[y*3+2]=r(a[k].z,a[U].z,m.t)}N.attributes.position.needsUpdate=!0}u.render(G,d)};return O=requestAnimationFrame(ue),()=>{cancelAnimationFrame(O),window.removeEventListener("resize",W),window.removeEventListener("pointermove",ce),u.domElement.removeEventListener("webglcontextlost",le),G.traverse(e=>{var c,T,E;const n=e;(T=(c=n.geometry)==null?void 0:c.dispose)==null||T.call(c);const t=n.material;Array.isArray(t)?t.forEach(Y=>Y.dispose()):(E=t==null?void 0:t.dispose)==null||E.call(t)}),u.dispose(),u.domElement.remove()}},[w,h]),Te.jsx("div",{ref:b,className:"scene-canvas","aria-hidden":"true"})}export{Ue as default};
