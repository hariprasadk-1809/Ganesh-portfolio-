import { useEffect, useRef, useState, useCallback, useMemo, createElement } from "react";
import type { CSSProperties, ReactNode, ElementType } from "react";
import { gsap } from "gsap";
import {
  Mail, Link2, ArrowUpRight, X, ChevronUp,
  ExternalLink, Copy, Check, MessageCircle, Download, Star,
} from "lucide-react";
import {
  VIDEO_URL, AVATAR, RESUME_PDF, ABOUT, MARQUEE,
  SKILLS, PROJECTS, SERVICE_CALLOUT, SERVICES, ACHIEVEMENTS, TESTIMONIALS,
} from "./config";
import "./GooeyNav.css";
import "./ProfileCard.css";
import "./BorderGlow.css";
import "./GlareHover.css";
import "./TextType.css";

// ═══ GLARE HOVER ═══
interface GHProps{width?:string;height?:string;background?:string;borderRadius?:string;borderColor?:string;children?:ReactNode;glareColor?:string;glareOpacity?:number;glareAngle?:number;glareSize?:number;transitionDuration?:number;playOnce?:boolean;className?:string;style?:CSSProperties;}
function GlareHover({width='100%',height='100%',background='rgba(18,15,23,0.95)',borderRadius='22px',borderColor='rgba(255,255,255,0.08)',children,glareColor='#ffffff',glareOpacity=0.1,glareAngle=-30,glareSize=260,transitionDuration=720,playOnce=false,className='',style={}}:GHProps){
  const hex=glareColor.replace('#','');let rgba=glareColor;
  if(/^[0-9A-Fa-f]{6}$/.test(hex)){const r=parseInt(hex.slice(0,2),16),g=parseInt(hex.slice(2,4),16),b=parseInt(hex.slice(4,6),16);rgba=`rgba(${r},${g},${b},${glareOpacity})`;}
  const vars={'--gh-width':width,'--gh-height':height,'--gh-bg':background,'--gh-br':borderRadius,'--gh-angle':`${glareAngle}deg`,'--gh-duration':`${transitionDuration}ms`,'--gh-size':`${glareSize}%`,'--gh-rgba':rgba,'--gh-border':borderColor} as CSSProperties;
  return <div className={`glare-hover${playOnce?' glare-hover--play-once':''} ${className}`} style={{...vars,...style}}>{children}</div>;
}

// ═══ TEXT TYPE ═══
interface TTProps{text:string|string[];as?:ElementType;typingSpeed?:number;initialDelay?:number;pauseDuration?:number;deletingSpeed?:number;loop?:boolean;className?:string;showCursor?:boolean;cursorCharacter?:string;cursorBlinkDuration?:number;cursorClassName?:string;}
function TextType({text,as:Comp='div',typingSpeed=65,initialDelay=0,pauseDuration=1800,deletingSpeed=32,loop=true,className='',showCursor=true,cursorCharacter='|',cursorBlinkDuration=0.5,cursorClassName=''}:TTProps){
  const [disp,setDisp]=useState('');const [ci,setCi]=useState(0);const [isDel,setIsDel]=useState(false);const [ti,setTi]=useState(0);
  const curRef=useRef<HTMLSpanElement>(null);
  const arr=useMemo(()=>Array.isArray(text)?text:[text],[text]);
  useEffect(()=>{if(showCursor&&curRef.current){gsap.set(curRef.current,{opacity:1});gsap.to(curRef.current,{opacity:0,duration:cursorBlinkDuration,repeat:-1,yoyo:true,ease:'power2.inOut'});}},[showCursor,cursorBlinkDuration]);
  useEffect(()=>{
    let tmr:number;const cur=arr[ti];
    const run=()=>{
      if(isDel){if(disp===''){setIsDel(false);if(ti===arr.length-1&&!loop)return;setTi(p=>(p+1)%arr.length);setCi(0);tmr=window.setTimeout(()=>{},pauseDuration);}else{tmr=window.setTimeout(()=>setDisp(p=>p.slice(0,-1)),deletingSpeed);}}
      else{if(ci<cur.length){tmr=window.setTimeout(()=>{setDisp(p=>p+cur[ci]);setCi(p=>p+1);},typingSpeed);}else{tmr=window.setTimeout(()=>setIsDel(true),pauseDuration);}}
    };
    if(ci===0&&!isDel&&disp===''){tmr=window.setTimeout(run,initialDelay);}else{run();}
    return()=>clearTimeout(tmr);
  },[disp,ci,isDel,typingSpeed,deletingSpeed,pauseDuration,arr,ti,loop,initialDelay]);
  return createElement(Comp,{className:`text-type ${className}`,style:{display:'inline',whiteSpace:'pre-wrap'}},
    <span className="text-type__content" style={{display:'inline'}}>{disp}</span>,
    showCursor&&<span ref={curRef} className={`text-type__cursor ${cursorClassName}`} style={{display:'inline',marginLeft:2}}>{cursorCharacter}</span>
  );
}

// ═══ BORDER GLOW ═══
function parseHSL(s:string){const m=s.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);if(!m)return{h:190,s:100,l:70};return{h:parseFloat(m[1]),s:parseFloat(m[2]),l:parseFloat(m[3])};}
function bGV(gc:string,intensity:number){const{h,s,l}=parseHSL(gc);const base=`${h}deg ${s}% ${l}%`;const ops=[100,60,50,40,30,20,10];const v:Record<string,string>={};['','−60','−50','−40','−30','−20','−10'].forEach((k,i)=>v[`--glow-color${k.replace('−','-')}`]=`hsl(${base} / ${Math.min(ops[i]*intensity,100)}%)`);return v;}
const GP=['80% 55%','69% 34%','8% 6%','41% 38%','86% 85%','82% 18%','51% 4%'];
const GK=['--gradient-one','--gradient-two','--gradient-three','--gradient-four','--gradient-five','--gradient-six','--gradient-seven'];
const CM=[0,1,2,0,1,2,1];
function bGrV(colors:string[]){const v:Record<string,string>={};for(let i=0;i<7;i++){const c=colors[Math.min(CM[i],colors.length-1)];v[GK[i]]=`radial-gradient(at ${GP[i]}, ${c} 0px, transparent 50%)`;}v['--gradient-base']=`linear-gradient(${colors[0]} 0 100%)`;return v;}
function eOC(x:number){return 1-Math.pow(1-x,3);}function eIC(x:number){return x*x*x;}
function aV({start=0,end=100,duration=1000,delay=0,ease=eOC,onUpdate,onEnd}:{start?:number;end?:number;duration?:number;delay?:number;ease?:(x:number)=>number;onUpdate:(v:number)=>void;onEnd?:()=>void}){const t0=performance.now()+delay;function tick(){const el=performance.now()-t0;const t=Math.min(el/duration,1);onUpdate(start+(end-start)*ease(t));if(t<1)requestAnimationFrame(tick);else if(onEnd)onEnd();}setTimeout(()=>requestAnimationFrame(tick),delay);}
interface BGProps{children:ReactNode;className?:string;edgeSensitivity?:number;glowColor?:string;backgroundColor?:string;borderRadius?:number;glowRadius?:number;glowIntensity?:number;coneSpread?:number;animated?:boolean;colors?:string[];fillOpacity?:number;style?:CSSProperties;}
function BorderGlow({children,className='',edgeSensitivity=30,glowColor='190 100 70',backgroundColor='rgba(10,10,15,0.95)',borderRadius=20,glowRadius=40,glowIntensity=1.0,coneSpread=25,animated=false,colors=['#00e5ff','#a78bfa','#38bdf8'],fillOpacity=0.5,style}:BGProps){
  const cardRef=useRef<HTMLDivElement>(null);
  const getCtr=useCallback((el:HTMLElement)=>{const{width,height}=el.getBoundingClientRect();return[width/2,height/2];},[]);
  const getEdge=useCallback((el:HTMLElement,x:number,y:number)=>{const[cx,cy]=getCtr(el);const dx=x-cx,dy=y-cy;let kx=Infinity,ky=Infinity;if(dx!==0)kx=cx/Math.abs(dx);if(dy!==0)ky=cy/Math.abs(dy);return Math.min(Math.max(1/Math.min(kx,ky),0),1);},[getCtr]);
  const getAngle=useCallback((el:HTMLElement,x:number,y:number)=>{const[cx,cy]=getCtr(el);const dx=x-cx,dy=y-cy;if(dx===0&&dy===0)return 0;let d=Math.atan2(dy,dx)*(180/Math.PI)+90;if(d<0)d+=360;return d;},[getCtr]);
  const onMove=useCallback((e:React.PointerEvent)=>{const c=cardRef.current;if(!c)return;const r=c.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;c.style.setProperty('--edge-proximity',`${(getEdge(c,x,y)*100).toFixed(3)}`);c.style.setProperty('--cursor-angle',`${getAngle(c,x,y).toFixed(3)}deg`);},[getEdge,getAngle]);
  useEffect(()=>{if(!animated||!cardRef.current)return;const c=cardRef.current;c.classList.add('sweep-active');c.style.setProperty('--cursor-angle','110deg');aV({duration:500,onUpdate:v=>c.style.setProperty('--edge-proximity',String(v))});aV({ease:eIC,duration:1500,end:50,onUpdate:v=>c.style.setProperty('--cursor-angle',`${(465-110)*(v/100)+110}deg`)});aV({ease:eOC,delay:1500,duration:2250,start:50,end:100,onUpdate:v=>c.style.setProperty('--cursor-angle',`${(465-110)*(v/100)+110}deg`)});aV({ease:eIC,delay:2500,duration:1500,start:100,end:0,onUpdate:v=>c.style.setProperty('--edge-proximity',String(v)),onEnd:()=>c.classList.remove('sweep-active')});},[animated]);
  const gv=bGV(glowColor,glowIntensity);
  return(<div ref={cardRef} onPointerMove={onMove} className={`border-glow-card ${className}`} style={{'--card-bg':backgroundColor,'--edge-sensitivity':edgeSensitivity,'--border-radius':`${borderRadius}px`,'--glow-padding':`${glowRadius}px`,'--cone-spread':coneSpread,'--fill-opacity':fillOpacity,...gv,...bGrV(colors),...style} as CSSProperties}><span className="edge-light"/><div className="border-glow-inner">{children}</div></div>);
}


// ═══ SERVICE SVG ICONS — professional, no emoji ═══
const SVC_SVG_ICONS: Record<string,ReactNode> = {
  "⚡": <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  "🛡":  <svg viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  "🤖": <svg viewBox="0 0 24 24" fill="none" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4M8 15h.01M16 15h.01"/></svg>,
  "⚙":  <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  "💼": <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  "💻": <svg viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
};

// ═══ SPLASH CURSOR (React Bits — rainbow) ═══
function SplashCursor({
  SIM_RESOLUTION=128,DYE_RESOLUTION=1440,CAPTURE_RESOLUTION=512,
  DENSITY_DISSIPATION=3.5,VELOCITY_DISSIPATION=2,PRESSURE=0.1,PRESSURE_ITERATIONS=20,
  CURL=3,SPLAT_RADIUS=0.2,SPLAT_FORCE=6000,SHADING=true,COLOR_UPDATE_SPEED=10,
  BACK_COLOR={r:0.5,g:0,b:0},TRANSPARENT=true,RAINBOW_MODE=true,COLOR='#ff0000'
}:{SIM_RESOLUTION?:number;DYE_RESOLUTION?:number;CAPTURE_RESOLUTION?:number;DENSITY_DISSIPATION?:number;VELOCITY_DISSIPATION?:number;PRESSURE?:number;PRESSURE_ITERATIONS?:number;CURL?:number;SPLAT_RADIUS?:number;SPLAT_FORCE?:number;SHADING?:boolean;COLOR_UPDATE_SPEED?:number;BACK_COLOR?:{r:number;g:number;b:number};TRANSPARENT?:boolean;RAINBOW_MODE?:boolean;COLOR?:string}={}){
  const cRef=useRef<HTMLCanvasElement>(null);const rRef=useRef<number>(0);
  useEffect(()=>{
    const canvas=cRef.current;if(!canvas)return;let active=true;
    function PP(this:any){this.id=-1;this.texcoordX=0;this.texcoordY=0;this.prevTexcoordX=0;this.prevTexcoordY=0;this.deltaX=0;this.deltaY=0;this.down=false;this.moved=false;this.color=[0,0,0];}
    const cfg:any={SIM_RESOLUTION,DYE_RESOLUTION,CAPTURE_RESOLUTION,DENSITY_DISSIPATION,VELOCITY_DISSIPATION,PRESSURE,PRESSURE_ITERATIONS,CURL,SPLAT_RADIUS,SPLAT_FORCE,SHADING,COLOR_UPDATE_SPEED,PAUSED:false,BACK_COLOR,TRANSPARENT,RAINBOW_MODE,COLOR};
    let ptrs:any[]=[new (PP as any)()];
    const p={alpha:true,depth:false,stencil:false,antialias:false,preserveDrawingBuffer:false};
    let gl:any=canvas.getContext('webgl2',p);const isWebGL2=!!gl;
    if(!isWebGL2){gl=canvas.getContext('webgl',p)||canvas.getContext('experimental-webgl',p);}
    if(!gl)return;
    let halfFloat:any,supportLinearFiltering:any;
    if(isWebGL2){gl.getExtension('EXT_color_buffer_float');supportLinearFiltering=gl.getExtension('OES_texture_float_linear');}
    else{halfFloat=gl.getExtension('OES_texture_half_float');supportLinearFiltering=gl.getExtension('OES_texture_half_float_linear');}
    gl.clearColor(0,0,0,1);
    const halfFloatTexType=isWebGL2?gl.HALF_FLOAT:halfFloat&&halfFloat.HALF_FLOAT_OES;
    let formatRGBA:any,formatRG:any,formatR:any;
    function getSupportedFormat(gl:any,internalFormat:any,format:any,type:any):any{
      if(!supportRenderTextureFormat(gl,internalFormat,format,type)){
        if(internalFormat===gl.R16F)return getSupportedFormat(gl,gl.RG16F,gl.RG,type);
        if(internalFormat===gl.RG16F)return getSupportedFormat(gl,gl.RGBA16F,gl.RGBA,type);
        return null;
      }
      return{internalFormat,format};
    }
    function supportRenderTextureFormat(gl:any,internalFormat:any,format:any,type:any){
      const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,internalFormat,4,4,0,format,type,null);const fbo=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);const status=gl.checkFramebufferStatus(gl.FRAMEBUFFER);gl.deleteTexture(texture);gl.deleteFramebuffer(fbo);return status===gl.FRAMEBUFFER_COMPLETE;
    }
    if(isWebGL2){formatRGBA=getSupportedFormat(gl,gl.RGBA16F,gl.RGBA,halfFloatTexType);formatRG=getSupportedFormat(gl,gl.RG16F,gl.RG,halfFloatTexType);formatR=getSupportedFormat(gl,gl.R16F,gl.RED,halfFloatTexType);}
    else{formatRGBA=getSupportedFormat(gl,gl.RGBA,gl.RGBA,halfFloatTexType);formatRG=formatRGBA;formatR=formatRGBA;}
    if(!formatRGBA){cfg.SHADING=false;cfg.DYE_RESOLUTION=512;}

    function compileShader(type:any,source:string,keywords?:string[]):any{
      if(keywords){let kws='';keywords.forEach(k=>{kws+='#define '+k+String.fromCharCode(10);});source=kws+source;}
      const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){console.error(gl.getShaderInfoLog(shader));gl.deleteShader(shader);return null;}
      return shader;
    }
    function createProgram(vertexShader:any,fragmentShader:any):any{
      const program=gl.createProgram();gl.attachShader(program,vertexShader);gl.attachShader(program,fragmentShader);gl.linkProgram(program);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS)){console.error(gl.getProgramInfoLog(program));return null;}
      const uniforms:any={};const count=gl.getProgramParameter(program,gl.ACTIVE_UNIFORMS);for(let i=0;i<count;i++){const name=gl.getActiveUniform(program,i).name;uniforms[name]=gl.getUniformLocation(program,name);}
      return{program,uniforms,bind(){gl.useProgram(program);}};
    }

    const baseVertexShader=compileShader(gl.VERTEX_SHADER,`precision highp float;attribute vec2 aPosition;varying vec2 vUv,vL,vR,vT,vB;uniform vec2 texelSize;void main(){vUv=aPosition*.5+.5;vL=vUv-vec2(texelSize.x,0.);vR=vUv+vec2(texelSize.x,0.);vT=vUv+vec2(0.,texelSize.y);vB=vUv-vec2(0.,texelSize.y);gl_Position=vec4(aPosition,0.,1.);}`);
    const copyShader=compileShader(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;void main(){gl_FragColor=texture2D(uTexture,vUv);}`);
    const clearShader=compileShader(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;uniform float value;void main(){gl_FragColor=value*texture2D(uTexture,vUv);}`);
    const displaySrc=`precision highp float;precision highp sampler2D;varying vec2 vUv,vL,vR,vT,vB;uniform sampler2D uTexture;uniform sampler2D uDithering;uniform vec2 ditherScale;uniform vec2 texelSize;vec3 linearToGamma(vec3 color){color=max(color,vec3(0));return max(1.055*pow(color,vec3(0.416666667))-0.055,vec3(0));}void main(){vec3 c=texture2D(uTexture,vUv).rgb;
#ifdef SHADING
vec3 lc=texture2D(uTexture,vL).rgb;vec3 rc=texture2D(uTexture,vR).rgb;vec3 tc=texture2D(uTexture,vT).rgb;vec3 bc=texture2D(uTexture,vB).rgb;float dx=length(rc)-length(lc);float dy=length(tc)-length(bc);vec3 n=normalize(vec3(dx,dy,length(texelSize)));vec3 l=vec3(0.,0.,1.);float diffuse=clamp(dot(n,l)+0.7,0.7,1.0);c*=diffuse;
#endif
float a=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c,a);}`;
    const splatShader=compileShader(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uTarget;uniform float aspectRatio;uniform vec3 color;uniform vec2 point;uniform float radius;void main(){vec2 p=vUv-point.xy;p.x*=aspectRatio;vec3 splat=exp(-dot(p,p)/radius)*color;vec3 base=texture2D(uTarget,vUv).xyz;gl_FragColor=vec4(base+splat,1.0);}`);
    const advectionShader=compileShader(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uVelocity;uniform sampler2D uSource;uniform vec2 texelSize;uniform vec2 dyeTexelSize;uniform float dt;uniform float dissipation;vec4 bilerp(sampler2D sam,vec2 uv,vec2 tsize){vec2 st=uv/tsize-0.5;vec2 iuv=floor(st);vec2 fuv=fract(st);vec4 a=texture2D(sam,(iuv+vec2(0.5,0.5))*tsize);vec4 b=texture2D(sam,(iuv+vec2(1.5,0.5))*tsize);vec4 c=texture2D(sam,(iuv+vec2(0.5,1.5))*tsize);vec4 d=texture2D(sam,(iuv+vec2(1.5,1.5))*tsize);return mix(mix(a,b,fuv.x),mix(c,d,fuv.x),fuv.y);}void main(){
#ifdef MANUAL_FILTERING
vec2 coord=vUv-dt*bilerp(uVelocity,vUv,texelSize).xy*texelSize;vec4 result=bilerp(uSource,coord,dyeTexelSize);
#else
vec2 coord=vUv-dt*texture2D(uVelocity,vUv).xy*texelSize;vec4 result=texture2D(uSource,coord);
#endif
float decay=1.0+dissipation*dt;gl_FragColor=result/decay;}`,supportLinearFiltering?undefined:['MANUAL_FILTERING']);
    const divergenceShader=compileShader(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;void main(){float L=texture2D(uVelocity,vL).x;float R=texture2D(uVelocity,vR).x;float T=texture2D(uVelocity,vT).y;float B=texture2D(uVelocity,vB).y;vec2 C=texture2D(uVelocity,vUv).xy;if(vL.x<0.0){L=-C.x;}if(vR.x>1.0){R=-C.x;}if(vT.y>1.0){T=-C.y;}if(vB.y<0.0){B=-C.y;}float div=0.5*(R-L+T-B);gl_FragColor=vec4(div,0.0,0.0,1.0);}`);
    const curlShader=compileShader(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;void main(){float L=texture2D(uVelocity,vL).y;float R=texture2D(uVelocity,vR).y;float T=texture2D(uVelocity,vT).x;float B=texture2D(uVelocity,vB).x;float vorticity=R-L-T+B;gl_FragColor=vec4(0.5*vorticity,0.0,0.0,1.0);}`);
    const vorticityShader=compileShader(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;uniform sampler2D uCurl;uniform float curl;uniform float dt;void main(){float L=texture2D(uCurl,vL).x;float R=texture2D(uCurl,vR).x;float T=texture2D(uCurl,vT).x;float B=texture2D(uCurl,vB).x;float C=texture2D(uCurl,vUv).x;vec2 force=0.5*vec2(abs(T)-abs(B),abs(R)-abs(L));force/=length(force)+0.0001;force*=curl*C;force.y*=-1.0;vec2 velocity=texture2D(uVelocity,vUv).xy;velocity+=force*dt;velocity=min(max(velocity,-1000.0),1000.0);gl_FragColor=vec4(velocity,0.0,1.0);}`);
    const pressureShader=compileShader(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uPressure;uniform sampler2D uDivergence;void main(){float L=texture2D(uPressure,vL).x;float R=texture2D(uPressure,vR).x;float T=texture2D(uPressure,vT).x;float B=texture2D(uPressure,vB).x;float C=texture2D(uPressure,vUv).x;float divergence=texture2D(uDivergence,vUv).x;float pressure=(L+R+B+T-divergence)*0.25;gl_FragColor=vec4(pressure,0.0,0.0,1.0);}`);
    const gradientSubtractShader=compileShader(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uPressure;uniform sampler2D uVelocity;void main(){float L=texture2D(uPressure,vL).x;float R=texture2D(uPressure,vR).x;float T=texture2D(uPressure,vT).x;float B=texture2D(uPressure,vB).x;vec2 velocity=texture2D(uVelocity,vUv).xy;velocity.xy-=vec2(R-L,T-B);gl_FragColor=vec4(velocity,0.0,1.0);}`);

    const copyProgram=createProgram(baseVertexShader,copyShader);
    const clearProgram=createProgram(baseVertexShader,clearShader);
    const splatProgram=createProgram(baseVertexShader,splatShader);
    const advectionProgram=createProgram(baseVertexShader,advectionShader);
    const divergenceProgram=createProgram(baseVertexShader,divergenceShader);
    const curlProgram=createProgram(baseVertexShader,curlShader);
    const vorticityProgram=createProgram(baseVertexShader,vorticityShader);
    const pressureProgram=createProgram(baseVertexShader,pressureShader);
    const gradSubtractProgram=createProgram(baseVertexShader,gradientSubtractShader);
    let displayProgram:any=null,displayUniforms:any=null;const displayPrograms:any={};
    function setDisplayKeywords(kws:string[]){
      let h=0;kws.forEach(k=>{for(let i=0;i<k.length;i++){h=(h<<5)-h+k.charCodeAt(i);h|=0;}});
      if(!displayPrograms[h]){const sh=compileShader(gl.FRAGMENT_SHADER,displaySrc,kws);if(!sh)return;const prog2=createProgram(baseVertexShader,sh);if(!prog2)return;displayPrograms[h]=prog2;}
      if(displayPrograms[h].program===displayProgram)return;displayProgram=displayPrograms[h].program;displayUniforms=displayPrograms[h].uniforms;gl.useProgram(displayProgram);
    }
    if(!copyProgram||!clearProgram||!splatProgram||!advectionProgram||!divergenceProgram||!curlProgram||!vorticityProgram||!pressureProgram||!gradSubtractProgram)return;

    gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),gl.STATIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),gl.STATIC_DRAW);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(0);

    function createFBO(w:number,h:number,iF:any,f:any,type:any,param:any):any{gl.activeTexture(gl.TEXTURE0);const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,param);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,param);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,iF,w,h,0,f,type,null);const fb=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT);return{texture:t,fbo:fb,width:w,height:h,texelSizeX:1/w,texelSizeY:1/h,attach(id:number){gl.activeTexture(gl.TEXTURE0+id);gl.bindTexture(gl.TEXTURE_2D,t);return id;}};}
    function createDFBO(w:number,h:number,iF:any,f:any,type:any,param:any):any{let a=createFBO(w,h,iF,f,type,param),b=createFBO(w,h,iF,f,type,param);return{width:w,height:h,texelSizeX:a.texelSizeX,texelSizeY:a.texelSizeY,get read(){return a;},set read(v){a=v;},get write(){return b;},set write(v){b=v;},swap(){const t=a;a=b;b=t;}};}
    function resizeFBO(t:any,w:number,h:number,iF:any,f:any,type:any,param:any):any{const n=createFBO(w,h,iF,f,type,param);copyProgram.bind();gl.uniform1i(copyProgram.uniforms.uTexture,t.attach(0));blit(n);return n;}
    function resizeDFBO(t:any,w:number,h:number,iF:any,f:any,type:any,param:any):any{if(t.width===w&&t.height===h)return t;t.read=resizeFBO(t.read,w,h,iF,f,type,param);t.write=createFBO(w,h,iF,f,type,param);t.width=w;t.height=h;t.texelSizeX=1/w;t.texelSizeY=1/h;return t;}
    function getResolution(r:number):{width:number;height:number}{let ar=gl.drawingBufferWidth/gl.drawingBufferHeight;if(ar<1)ar=1/ar;const m=Math.round(r),mx2=Math.round(r*ar);return gl.drawingBufferWidth>gl.drawingBufferHeight?{width:mx2,height:m}:{width:m,height:mx2};}
    function blit(target:any){if(target==null){gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);gl.bindFramebuffer(gl.FRAMEBUFFER,null);}else{gl.viewport(0,0,target.width,target.height);gl.bindFramebuffer(gl.FRAMEBUFFER,target.fbo);}gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);}

    let dye:any,velocity:any,divergence:any,curl:any,pressure:any;
    function initFBOs(){const simRes=getResolution(cfg.SIM_RESOLUTION),dyeRes=getResolution(cfg.DYE_RESOLUTION),texType=halfFloatTexType,lin=supportLinearFiltering?gl.LINEAR:gl.NEAREST;gl.disable(gl.BLEND);if(!dye)dye=createDFBO(dyeRes.width,dyeRes.height,formatRGBA.internalFormat,formatRGBA.format,texType,lin);else dye=resizeDFBO(dye,dyeRes.width,dyeRes.height,formatRGBA.internalFormat,formatRGBA.format,texType,lin);if(!velocity)velocity=createDFBO(simRes.width,simRes.height,formatRG.internalFormat,formatRG.format,texType,lin);else velocity=resizeDFBO(velocity,simRes.width,simRes.height,formatRG.internalFormat,formatRG.format,texType,lin);divergence=createFBO(simRes.width,simRes.height,formatR.internalFormat,formatR.format,texType,gl.NEAREST);curl=createFBO(simRes.width,simRes.height,formatR.internalFormat,formatR.format,texType,gl.NEAREST);pressure=createDFBO(simRes.width,simRes.height,formatR.internalFormat,formatR.format,texType,gl.NEAREST);}

    function resizeCanvas(){const w=Math.floor(canvas.clientWidth*(window.devicePixelRatio||1)),h=Math.floor(canvas.clientHeight*(window.devicePixelRatio||1));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;return true;}return false;}
    function HSVtoRGB(h:number,s:number,v:number):{r:number;g:number;b:number}{let r=0,g=0,b=0,i=Math.floor(h*6),f=h*6-i,p=v*(1-s),q=v*(1-f*s),t2=v*(1-(1-f)*s);switch(i%6){case 0:r=v;g=t2;b=p;break;case 1:r=q;g=v;b=p;break;case 2:r=p;g=v;b=t2;break;case 3:r=p;g=q;b=v;break;case 4:r=t2;g=p;b=v;break;case 5:r=v;g=p;b=q;break;}return{r,g,b};}
    function hexToRGB(hex:string):{r:number;g:number;b:number}{let val=hex.replace('#','');if(val.length===3)val=val[0]+val[0]+val[1]+val[1]+val[2]+val[2];const r=parseInt(val.slice(0,2),16)/255,g=parseInt(val.slice(2,4),16)/255,b=parseInt(val.slice(4,6),16)/255;return{r:r*0.15,g:g*0.15,b:b*0.15};}
    function generateColor():{r:number;g:number;b:number}{
      if(!cfg.RAINBOW_MODE)return hexToRGB(cfg.COLOR);
      const c=HSVtoRGB(Math.random(),1,1);
      return{r:c.r*.15,g:c.g*.15,b:c.b*.15};
    }
    function splat(x:number,y:number,dx:number,dy:number,color:{r:number;g:number;b:number}){splatProgram.bind();gl.uniform1i(splatProgram.uniforms.uTarget,velocity.read.attach(0));gl.uniform1f(splatProgram.uniforms.aspectRatio,canvas.width/canvas.height);gl.uniform2f(splatProgram.uniforms.point,x/canvas.width,1-y/canvas.height);gl.uniform3f(splatProgram.uniforms.color,dx,dy,0);gl.uniform1f(splatProgram.uniforms.radius,cfg.SPLAT_RADIUS/100*(canvas.width>canvas.height?canvas.width/canvas.height:1));blit(velocity.write);velocity.swap();gl.uniform1i(splatProgram.uniforms.uTarget,dye.read.attach(0));gl.uniform3f(splatProgram.uniforms.color,color.r,color.g,color.b);blit(dye.write);dye.swap();}
    function step(dt:number){gl.disable(gl.BLEND);curlProgram.bind();gl.uniform2f(curlProgram.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY);gl.uniform1i(curlProgram.uniforms.uVelocity,velocity.read.attach(0));blit(curl);vorticityProgram.bind();gl.uniform2f(vorticityProgram.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY);gl.uniform1i(vorticityProgram.uniforms.uVelocity,velocity.read.attach(0));gl.uniform1i(vorticityProgram.uniforms.uCurl,curl.attach(1));gl.uniform1f(vorticityProgram.uniforms.curl,cfg.CURL);gl.uniform1f(vorticityProgram.uniforms.dt,dt);blit(velocity.write);velocity.swap();divergenceProgram.bind();gl.uniform2f(divergenceProgram.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY);gl.uniform1i(divergenceProgram.uniforms.uVelocity,velocity.read.attach(0));blit(divergence);clearProgram.bind();gl.uniform1i(clearProgram.uniforms.uTexture,pressure.read.attach(0));gl.uniform1f(clearProgram.uniforms.value,cfg.PRESSURE);blit(pressure.write);pressure.swap();pressureProgram.bind();gl.uniform2f(pressureProgram.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY);gl.uniform1i(pressureProgram.uniforms.uDivergence,divergence.attach(0));for(let i=0;i<cfg.PRESSURE_ITERATIONS;i++){gl.uniform1i(pressureProgram.uniforms.uPressure,pressure.read.attach(1));blit(pressure.write);pressure.swap();}gradSubtractProgram.bind();gl.uniform2f(gradSubtractProgram.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY);gl.uniform1i(gradSubtractProgram.uniforms.uPressure,pressure.read.attach(0));gl.uniform1i(gradSubtractProgram.uniforms.uVelocity,velocity.read.attach(1));blit(velocity.write);velocity.swap();advectionProgram.bind();gl.uniform2f(advectionProgram.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY);if(!supportLinearFiltering)gl.uniform2f(advectionProgram.uniforms.dyeTexelSize,velocity.texelSizeX,velocity.texelSizeY);const vId=velocity.read.attach(0);gl.uniform1i(advectionProgram.uniforms.uVelocity,vId);gl.uniform1i(advectionProgram.uniforms.uSource,vId);gl.uniform1f(advectionProgram.uniforms.dt,dt);gl.uniform1f(advectionProgram.uniforms.dissipation,cfg.VELOCITY_DISSIPATION);blit(velocity.write);velocity.swap();if(!supportLinearFiltering)gl.uniform2f(advectionProgram.uniforms.dyeTexelSize,dye.texelSizeX,dye.texelSizeY);gl.uniform1i(advectionProgram.uniforms.uVelocity,velocity.read.attach(0));gl.uniform1i(advectionProgram.uniforms.uSource,dye.read.attach(1));gl.uniform1f(advectionProgram.uniforms.dissipation,cfg.DENSITY_DISSIPATION);blit(dye.write);dye.swap();}
    function render(){gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.enable(gl.BLEND);setDisplayKeywords(cfg.SHADING?['SHADING']:[]);gl.useProgram(displayProgram);if(cfg.SHADING)gl.uniform2f(displayUniforms.texelSize,1/gl.drawingBufferWidth,1/gl.drawingBufferHeight);gl.uniform1i(displayUniforms.uTexture,dye.read.attach(0));blit(null);}

    let lastTime=Date.now(),colorTimer=0;
    function frame(){
      if(!active)return;
      const now=Date.now();const dt=Math.min((now-lastTime)/1000,.016666);lastTime=now;
      colorTimer+=dt*cfg.COLOR_UPDATE_SPEED;if(colorTimer>=1){colorTimer=0;ptrs.forEach((p:any)=>{p.color=generateColor();});}
      ptrs.forEach((ptr:any)=>{if(ptr.moved){ptr.moved=false;splat(ptr.texcoordX,ptr.texcoordY,ptr.deltaX*cfg.SPLAT_FORCE,ptr.deltaY*cfg.SPLAT_FORCE,ptr.color);}});
      if(resizeCanvas())initFBOs();
      if(dye&&velocity){step(dt);render();}
      rRef.current=requestAnimationFrame(frame);
    }
    function updatePointer(ptr:any,x:number,y:number){ptr.prevTexcoordX=ptr.texcoordX;ptr.prevTexcoordY=ptr.texcoordY;ptr.texcoordX=x;ptr.texcoordY=y;ptr.deltaX=ptr.texcoordX-ptr.prevTexcoordX;ptr.deltaY=ptr.texcoordY-ptr.prevTexcoordY;ptr.moved=Math.abs(ptr.deltaX)>0||Math.abs(ptr.deltaY)>0;}
    const onMouseMove=(e:MouseEvent)=>{const ptr=ptrs[0];updatePointer(ptr,e.clientX,e.clientY);};
    const onMouseDown=(e:MouseEvent)=>{const ptr=ptrs[0];ptr.down=true;ptr.color=generateColor();const c={r:ptr.color.r*10,g:ptr.color.g*10,b:ptr.color.b*10};splat(e.clientX,e.clientY,10*(Math.random()-.5),10*(Math.random()-.5),c);};
    const onTouchStart=(e:TouchEvent)=>{if(e.touches[0]){const ptr=ptrs[0];ptr.down=true;ptr.color=generateColor();updatePointer(ptr,e.touches[0].clientX,e.touches[0].clientY);}};
    const onTouchMove=(e:TouchEvent)=>{if(e.touches[0]){const ptr=ptrs[0];updatePointer(ptr,e.touches[0].clientX,e.touches[0].clientY);}};

    setDisplayKeywords(cfg.SHADING?['SHADING']:[]);
    initFBOs();
    window.addEventListener('mousemove',onMouseMove,{passive:true});
    window.addEventListener('mousedown',onMouseDown,{passive:true});
    window.addEventListener('touchstart',onTouchStart,{passive:true});
    window.addEventListener('touchmove',onTouchMove,{passive:true});
    rRef.current=requestAnimationFrame(frame);
    return()=>{active=false;cancelAnimationFrame(rRef.current);window.removeEventListener('mousemove',onMouseMove);window.removeEventListener('mousedown',onMouseDown);window.removeEventListener('touchstart',onTouchStart);window.removeEventListener('touchmove',onTouchMove);};
  },[]);
  return(<div style={{position:'fixed',top:0,left:0,zIndex:0,pointerEvents:'none',width:'100%',height:'100%',isolation:'isolate'}}><canvas ref={cRef} style={{width:'100vw',height:'100vh',display:'block'}}/></div>);
}

// ═══ PROFILE TILT CARD — pointer-driven 3D tilt with glare ═══
const TLT={D:1200,X:70,Y:60,E:180};
const cV=(v:number,a=0,b=100)=>Math.min(Math.max(v,a),b);
const rVn=(v:number,p=3)=>parseFloat(v.toFixed(p));
const aVn=(v:number,f0:number,f1:number,t0:number,t1:number)=>rVn(t0+((t1-t0)*(v-f0))/(f1-f0));

function ProfileTiltCard({avatarUrl}:{avatarUrl:string}){
  const wR=useRef<HTMLDivElement>(null);
  const sR=useRef<HTMLDivElement>(null);
  const eT=useRef<number>(0);
  const lR=useRef<number>(0);

  const tilt=useMemo(()=>{
    let raf:number|null=null,run=false,lts=0,cx=0,cy=0,tx=0,ty=0,iu=0;
    const sv=(x:number,y:number)=>{
      const sh=sR.current,wr=wR.current;if(!sh||!wr)return;
      const w=sh.clientWidth||1,h=sh.clientHeight||1;
      const px=cV((100/w)*x),py=cV((100/h)*y),ox=px-50,oy=py-50;
      ([['--pointer-x',px+'%'],['--pointer-y',py+'%'],
        ['--background-x',aVn(px,0,100,35,65)+'%'],['--background-y',aVn(py,0,100,35,65)+'%'],
        ['--pointer-from-center',''+cV(Math.hypot(py-50,px-50)/50,0,1)],
        ['--pointer-from-top',''+py/100],['--pointer-from-left',''+px/100],
        ['--rotate-x',rVn(-(ox/5))+'deg'],['--rotate-y',rVn(oy/4)+'deg'],
      ] as [string,string][]).forEach(([k,v])=>wr.style.setProperty(k,v));
    };
    const step=(ts:number)=>{
      if(!run)return;if(!lts)lts=ts;
      const dt=(ts-lts)/1000;lts=ts;
      const k=1-Math.exp(-dt/(ts<iu?.6:.14));
      cx+=(tx-cx)*k;cy+=(ty-cy)*k;sv(cx,cy);
      if(Math.abs(tx-cx)>.05||Math.abs(ty-cy)>.05||document.hasFocus())raf=requestAnimationFrame(step);
      else{run=false;lts=0;if(raf){cancelAnimationFrame(raf);raf=null;}}
    };
    const go=()=>{if(run)return;run=true;lts=0;raf=requestAnimationFrame(step);};
    return{
      si(x:number,y:number){cx=x;cy=y;sv(x,y);},
      st(x:number,y:number){tx=x;ty=y;go();},
      tc(){const s=sR.current;if(s)this.st(s.clientWidth/2,s.clientHeight/2);},
      bi(d:number){iu=performance.now()+d;go();},
      gc(){return{x:cx,y:cy,tx,ty};},
      cancel(){if(raf)cancelAnimationFrame(raf);raf=null;run=false;lts=0;}
    };
  },[]);

  useEffect(()=>{
    const sh=sR.current;if(!sh)return;
    const off=(e:PointerEvent)=>{const r=sh.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};};
    const onE=(e:PointerEvent)=>{sh.classList.add('active','entering');clearTimeout(eT.current);eT.current=window.setTimeout(()=>sh.classList.remove('entering'),TLT.E);const{x,y}=off(e);tilt.st(x,y);};
    const onM=(e:PointerEvent)=>{const{x,y}=off(e);tilt.st(x,y);};
    const onL=()=>{tilt.tc();const ck=()=>{const{x,y,tx,ty}=tilt.gc();if(Math.hypot(tx-x,ty-y)<.6){sh.classList.remove('active');lR.current=0;}else lR.current=requestAnimationFrame(ck);};if(lR.current)cancelAnimationFrame(lR.current);lR.current=requestAnimationFrame(ck);};
    sh.addEventListener('pointerenter',onE);sh.addEventListener('pointermove',onM);sh.addEventListener('pointerleave',onL);
    tilt.si((sh.clientWidth||0)-TLT.X,TLT.Y);tilt.tc();tilt.bi(TLT.D);
    return()=>{sh.removeEventListener('pointerenter',onE);sh.removeEventListener('pointermove',onM);sh.removeEventListener('pointerleave',onL);clearTimeout(eT.current);if(lR.current)cancelAnimationFrame(lR.current);tilt.cancel();sh.classList.remove('entering');};
  },[tilt]);

  return(
    <div ref={wR} className="pc-card-wrapper" style={{'--icon':'none','--inner-gradient':'linear-gradient(145deg,rgba(0,229,255,0.04) 0%,rgba(167,139,250,0.10) 100%)','--behind-glow-color':'rgba(0,229,255,0.25)','--behind-glow-size':'60%'} as CSSProperties}>
      <div className="pc-behind"/>
      <div ref={sR} className="pc-card-shell">
        <section className="pc-card">
          <div className="pc-inside">
            <div className="pc-shine"/>
            <div className="pc-glare"/>
            {/* Photo — fills top portion */}
            <div className="pc-content pc-avatar-content">
              <img className="avatar" src={avatarUrl} alt={ABOUT.name} loading="lazy"/>
            </div>
            {/* Name / role / badge */}
            <div className="pc-content">
              <div className="pc-details">
                <h3>{ABOUT.name}</h3>
                <p>Full-Stack · Cybersecurity</p>
              </div>
              <div className="pc-status-badge">
                <span className="pc-status-dot"/>
                {ABOUT.statusTitle}
              </div>
              <div style={{marginTop:10,fontSize:11,color:'rgba(0,229,255,0.55)',letterSpacing:'1px',textAlign:'center'}}>
                Click to learn more →
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Static flip card — ProfileTiltCard front + AboutBackFace back
function StaticProfileCard({avatarUrl}:{avatarUrl:string}){
  const [flipped,setFlipped]=useState(false);
  return(
    <div style={{perspective:'900px',width:'100%',maxWidth:380}}>
      <div
        style={{
          position:'relative',transformStyle:'preserve-3d',
          transition:'transform 0.65s cubic-bezier(0.4,0,0.2,1)',
          transform:flipped?'rotateY(180deg)':'rotateY(0deg)',
          cursor:'pointer',minHeight:460,
        }}
        onClick={()=>setFlipped(p=>!p)}
      >
        <div style={{backfaceVisibility:'hidden',WebkitBackfaceVisibility:'hidden'}}>
          <ProfileTiltCard avatarUrl={avatarUrl}/>
        </div>
        <div style={{
          position:'absolute',inset:0,
          backfaceVisibility:'hidden',WebkitBackfaceVisibility:'hidden',
          transform:'rotateY(180deg)',
        }}>
          <AboutBackFace/>
        </div>
      </div>
    </div>
  );
}

function AboutBackFace(){
  const DegSvg=()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
  const PinSvg=()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
  const MailSvg=()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
  const TargetSvg=()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
  const facts=[
    {Icon:DegSvg, label:'Degree', val:ABOUT.degree},
    {Icon:PinSvg, label:'Location', val:ABOUT.location},
    {Icon:MailSvg, label:'Email', val:ABOUT.email},
    {Icon:TargetSvg, label:'Status', val:ABOUT.statusTitle},
  ];
  return(
    <div style={{width:'100%',borderRadius:24,background:'rgba(5,5,8,0.97)',border:'1px solid rgba(0,229,255,0.25)',display:'flex',flexDirection:'column',padding:'26px 22px',boxShadow:'0 0 40px rgba(0,229,255,0.12)',backdropFilter:'blur(20px)',minHeight:460,boxSizing:'border-box'}}>
      <div style={{height:2,background:'linear-gradient(90deg,#00e5ff,#a78bfa)',borderRadius:2,marginBottom:18}}/>
      <div style={{marginBottom:6,fontSize:10,letterSpacing:'3px',textTransform:'uppercase',color:'#00e5ff',fontWeight:700}}>About Me</div>
      <div style={{fontFamily:"'Instrument Serif',serif",fontStyle:'italic',fontSize:20,color:'#f0ede8',letterSpacing:'-0.5px',marginBottom:14,lineHeight:1.2}}>{ABOUT.name}</div>
      <p style={{fontSize:12.5,color:'rgba(240,237,232,0.62)',lineHeight:1.72,marginBottom:8}}>{ABOUT.bio1}</p>
      <p style={{fontSize:12.5,color:'rgba(240,237,232,0.62)',lineHeight:1.72,marginBottom:16}}>{ABOUT.bio2}</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,flex:1}}>
        {facts.map(({Icon,label,val},i)=>(
          <div key={i} style={{background:'rgba(255,255,255,0.05)',borderRadius:10,padding:'10px 12px',display:'flex',flexDirection:'column',gap:4,border:'1px solid rgba(255,255,255,0.06)'}}>
            <div style={{display:'flex',alignItems:'center',gap:5,color:'rgba(0,229,255,0.7)',marginBottom:2}}><Icon/><span style={{fontSize:9,letterSpacing:'1.5px',textTransform:'uppercase',fontWeight:600,color:'rgba(240,237,232,0.35)'}}>{label}</span></div>
            <span style={{fontSize:11,color:'rgba(240,237,232,0.75)',lineHeight:1.35,fontWeight:500,wordBreak:'break-word'}}>{val}</span>
          </div>
        ))}
      </div>
      <div style={{marginTop:16,fontSize:10,color:'rgba(0,229,255,0.45)',letterSpacing:'1px',textAlign:'center'}}>← Click to flip back</div>
    </div>
  );
}

// ═══ PROJECTS ═══
function ProjectsCarousel(){
  const trackRef=useRef<HTMLDivElement>(null);
  const paused=useRef(false);
  const rafRef=useRef<number>(0);
  const offsetRef=useRef(0);
  const lastTsRef=useRef<number|null>(null);
  const SPEED=0.09;
  const [cardW,setCardW]=useState(420);
  const total=PROJECTS.length;
  const ts=useRef(0);
  useEffect(()=>{const m=()=>{const vw=window.innerWidth;
      // Mobile: nearly full width. Desktop: ~28vw capped at 440
      const w=vw<768?Math.min(vw-32,480):Math.min(440,Math.max(300,Math.floor(vw*0.28)));
      setCardW(w);};m();window.addEventListener('resize',m);return()=>window.removeEventListener('resize',m);},[]);
  useEffect(()=>{const gap=20,stride=cardW+gap,totalW=stride*total;const animate=(now:number)=>{if(lastTsRef.current===null)lastTsRef.current=now;const dt=now-lastTsRef.current;lastTsRef.current=now;if(!paused.current)offsetRef.current=(offsetRef.current+SPEED*dt)%totalW;if(trackRef.current)trackRef.current.style.transform=`translateX(${-offsetRef.current}px)`;rafRef.current=requestAnimationFrame(animate);};rafRef.current=requestAnimationFrame(animate);return()=>cancelAnimationFrame(rafRef.current);},[cardW,total]);
  const gap=20,stride=cardW+gap;
  const copies=Math.ceil(window.innerWidth/stride)+4;
  const cards=Array.from({length:copies},(_,ci)=>PROJECTS[ci%total]);
  return(
    <div style={{width:'100vw',position:'relative',left:'50%',transform:'translateX(-50%)',overflow:'hidden'}}
      onMouseEnter={()=>{paused.current=true;}} onMouseLeave={()=>{paused.current=false;}}
      onTouchStart={e=>{ts.current=e.touches[0].clientX;paused.current=true;}}
      onTouchEnd={e=>{const dx=ts.current-e.changedTouches[0].clientX;if(Math.abs(dx)>40){const s=cardW+gap,totalW=s*total;offsetRef.current=((offsetRef.current+(dx>0?s:-s))%totalW+totalW)%totalW;}paused.current=false;}}>
      <div className="swipe-hint" style={{justifyContent:'center',paddingBottom:12,display:'none'}}><span>👆</span>Hover to pause</div>
      <div ref={trackRef} style={{display:'flex',gap:`${gap}px`,width:'max-content',willChange:'transform',paddingLeft:`${gap}px`}}>
        {cards.map((proj,i)=>(
          <div key={i} style={{width:cardW,flexShrink:0}}>
            <div style={{background:'#141416',borderRadius:16,overflow:'hidden',border:'1px solid rgba(255,255,255,0.08)',transition:'transform .3s',cursor:'pointer',display:'flex',flexDirection:'column',height:'100%'}}
              onMouseEnter={e=>(e.currentTarget.style.transform='translateY(-4px)')} onMouseLeave={e=>(e.currentTarget.style.transform='translateY(0)')}>
              <div style={{position:'relative',height:200,overflow:'hidden',background:'#0a0a0f',flexShrink:0}}>
                {proj.img&&!proj.img.includes('PLACEHOLDER')?<img src={proj.img} alt={proj.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>:<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:`${proj.color}10`}}><span style={{fontSize:36,opacity:.3}}>💼</span></div>}
                <div style={{position:'absolute',top:14,left:14,background:'rgba(10,10,15,0.75)',backdropFilter:'blur(8px)',borderRadius:8,padding:'4px 10px',border:'1px solid rgba(255,255,255,0.1)'}}>
                  <div style={{fontSize:9,letterSpacing:'2px',fontWeight:700,color:'rgba(240,237,232,0.55)',textTransform:'uppercase'}}>{proj.tag}</div>
                </div>
              </div>
              <div style={{padding:'18px 18px 20px',flex:1,display:'flex',flexDirection:'column'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                  <h3 style={{fontFamily:"'Instrument Serif',serif",fontSize:19,color:'#f0ede8',letterSpacing:'-.3px',lineHeight:1.2}}>{proj.title}</h3>
                  {proj.url!=='#'&&<a href={proj.url} target="_blank" rel="noopener noreferrer" style={{color:'rgba(240,237,232,0.4)',flexShrink:0,marginLeft:10,marginTop:2,transition:'color .2s'}} onMouseEnter={e=>(e.currentTarget.style.color='#f0ede8')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(240,237,232,0.4)')}><ExternalLink size={15}/></a>}
                </div>
                <p style={{fontSize:13,color:'rgba(240,237,232,0.55)',lineHeight:1.65,marginBottom:14}}>{proj.line}</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:14}}>{proj.tech.map(t=><span key={t} style={{fontSize:11,padding:'3px 10px',borderRadius:100,background:'rgba(255,255,255,0.07)',color:'rgba(240,237,232,0.5)',fontWeight:500}}>{t}</span>)}</div>
                {proj.url!=='#'&&<a href={proj.url} target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:13,fontWeight:600,color:proj.color,textDecoration:'none',marginTop:'auto'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.gap='9px';}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.gap='5px';}}>Visit Live →</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TESTIMONIALS — two horizontal auto-scroll rows
// Row 1: left → right  |  Row 2: right → left
// Hover pauses. Mobile: swipe. 10 unique reviews, tripled for seamless loop.
// ═══════════════════════════════════════════════════════════════════
function TestimonialRow({items,speed,direction}:{items:typeof TESTIMONIALS;speed:number;direction:'left'|'right'}){
  const trackRef=useRef<HTMLDivElement>(null);
  const paused=useRef(false);
  const rafRef=useRef<number>(0);
  const offsetRef=useRef(0);
  const lastTsRef=useRef<number|null>(null);
  const CARD_W=320,GAP=16,STRIDE=CARD_W+GAP;
  const totalW=STRIDE*items.length;
  const ts=useRef(0);
  // If direction=right, start from end so it goes right
  useEffect(()=>{if(direction==='right')offsetRef.current=totalW*0.5;},[direction,totalW]);
  useEffect(()=>{
    const animate=(now:number)=>{
      if(lastTsRef.current===null)lastTsRef.current=now;
      const dt=now-lastTsRef.current;lastTsRef.current=now;
      if(!paused.current){
        if(direction==='left')offsetRef.current=(offsetRef.current+speed*dt)%totalW;
        else offsetRef.current=((offsetRef.current-speed*dt)%totalW+totalW)%totalW;
      }
      if(trackRef.current)trackRef.current.style.transform=`translateX(${-offsetRef.current}px)`;
      rafRef.current=requestAnimationFrame(animate);
    };
    rafRef.current=requestAnimationFrame(animate);
    return()=>cancelAnimationFrame(rafRef.current);
  },[speed,direction,totalW]);
  return(
    <div style={{overflow:'hidden',width:'100%'}}
      onMouseEnter={()=>paused.current=true} onMouseLeave={()=>paused.current=false}
      onTouchStart={e=>{ts.current=e.touches[0].clientX;paused.current=true;}}
      onTouchEnd={e=>{const dx=ts.current-e.changedTouches[0].clientX;if(Math.abs(dx)>30){offsetRef.current=((offsetRef.current+(dx>0?STRIDE:-STRIDE))%totalW+totalW)%totalW;}paused.current=false;}}>
      <div ref={trackRef} style={{display:'flex',gap:`${GAP}px`,width:'max-content',willChange:'transform',padding:'8px 0'}}>
        {items.map((t,i)=>(
          <div key={i} style={{
            width:CARD_W,flexShrink:0,
            background:'rgba(16,16,20,0.95)',
            border:'1px solid rgba(255,255,255,0.09)',
            borderRadius:18,padding:'24px 24px 22px',
            backdropFilter:'blur(16px)',
            boxShadow:'0 4px 24px rgba(0,0,0,0.25)',
            transition:'border-color .25s,transform .25s,box-shadow .25s',
            cursor:'default',
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.16)';e.currentTarget.style.transform='translateY(-3px)';}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.08)';e.currentTarget.style.transform='translateY(0)';}}>
            {/* Stars */}
            <div style={{display:'flex',gap:3,marginBottom:12}}>
              {Array.from({length:t.rating}).map((_,si)=><Star key={si} size={13} fill="#f59e0b" stroke="none"/>)}
            </div>
            {/* Review text */}
            <p style={{fontSize:13,color:'rgba(240,237,232,0.75)',lineHeight:1.7,marginBottom:18,display:'-webkit-box',WebkitLineClamp:4,WebkitBoxOrient:'vertical' as any,overflow:'hidden'}}>"{t.review}"</p>
            {/* Author */}
            <div style={{display:'flex',alignItems:'center',gap:12,borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:14}}>
              <div style={{width:38,height:38,borderRadius:'50%',background:'rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{t.avatar}</div>
              <div style={{overflow:'hidden'}}>
                <div style={{fontSize:13,fontWeight:600,color:'#f0ede8',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t.name}</div>
                <div style={{fontSize:11,color:'rgba(240,237,232,0.45)',marginTop:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t.role}</div>
              </div>
              <div style={{marginLeft:'auto',fontSize:10,fontWeight:600,letterSpacing:'1px',textTransform:'uppercase',color:'rgba(0,229,255,0.6)',flexShrink:0,maxWidth:90,textAlign:'right',lineHeight:1.3}}>{t.project}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Testimonials(){
  // Triple each row for seamless loop
  const row1=[...TESTIMONIALS,...TESTIMONIALS,...TESTIMONIALS];
  const row2=[...TESTIMONIALS,...TESTIMONIALS,...TESTIMONIALS].reverse();
  return(
    <section style={{padding:'80px 0',overflow:'hidden',borderTop:'1px solid rgba(255,255,255,0.06)',isolation:'isolate',position:'relative',zIndex:2}}>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 64px',marginBottom:48}}>
        <div className="section-label reveal">Reviews</div>
        <h2 className="section-title reveal">What <em>Clients Say.</em></h2>
        <p className="section-sub reveal" style={{marginBottom:0}}>Real feedback from real projects — clients I've built for.</p>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:20}}>
        <TestimonialRow items={row1} speed={0.07} direction="left"/>
        <TestimonialRow items={row2} speed={0.06} direction="right"/>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CSS
// ═══════════════════════════════════════════════════════════════════
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap');
:root{--bg:#050508;--bg2:rgba(255,255,255,0.032);--bg3:rgba(255,255,255,0.065);--border:rgba(255,255,255,0.08);--border2:rgba(255,255,255,0.14);--text:#f0ede8;--text2:rgba(240,237,232,0.62);--text3:rgba(240,237,232,0.36);--accent:#00e5ff;--card:rgba(255,255,255,0.04);--glass:rgba(255,255,255,0.04);--lqg:rgba(255,255,255,0.07);--lqg-b:rgba(255,255,255,0.16);}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{overflow-x:hidden;scroll-behavior:smooth;}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);line-height:1.6;}
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:var(--bg);}::-webkit-scrollbar-thumb{background:rgba(0,229,255,.28);border-radius:2px;}

/* LOADER */
.loader{position:fixed;inset:0;background:#050508;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;gap:24px;}
.loader-name{font-family:'Instrument Serif',serif;font-style:italic;font-size:clamp(32px,6vw,64px);color:#f0ede8;letter-spacing:-1px;}
.loader-word{font-size:11px;letter-spacing:4px;text-transform:uppercase;color:rgba(0,229,255,.7);font-weight:500;height:16px;}
.loader-bar-track{width:clamp(200px,30vw,320px);height:2px;background:rgba(255,255,255,.08);border-radius:2px;overflow:hidden;}
.loader-bar-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,#00e5ff,#a78bfa);transition:width .05s linear;}
.loader-pct{font-size:11px;color:rgba(255,255,255,.3);letter-spacing:2px;}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:200;padding:14px 28px;}
.nav-bar{max-width:1180px;margin:0 auto;background:var(--lqg);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid var(--lqg-b);border-radius:16px;padding:10px 22px;display:flex;align-items:center;justify-content:space-between;position:relative;box-shadow:0 4px 32px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.1);}
.nav-bar::before{content:'';position:absolute;inset:0;border-radius:16px;padding:1px;background:linear-gradient(180deg,rgba(255,255,255,.18) 0%,rgba(255,255,255,.04) 50%,rgba(255,255,255,0) 100%);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;}
.nav-logo{font-family:'Instrument Serif',serif;font-style:italic;font-size:22px;color:var(--text);text-decoration:none;letter-spacing:-.5px;font-weight:600;flex-shrink:0;}
.nav-logo span{color:var(--accent);}
.nav-links{display:flex;gap:2px;list-style:none;position:absolute;left:50%;transform:translateX(-50%);}
.nav-links a{display:block;padding:7px 15px;border-radius:100px;font-size:13px;font-weight:400;color:var(--text2);text-decoration:none;transition:color .2s,background .2s;}
.nav-links a:hover{color:var(--text);background:var(--bg3);}
.nav-right{display:flex;align-items:center;gap:10px;flex-shrink:0;}
.nav-cta{background:var(--text);color:var(--bg);border:none;cursor:pointer;padding:7px 18px;border-radius:10px;font-size:13px;font-weight:500;transition:opacity .2s;text-decoration:none;white-space:nowrap;}
.nav-cta:hover{opacity:.82;}
.nav-ham{display:none;background:transparent;border:none;cursor:pointer;color:var(--text);width:34px;height:34px;padding:0;flex-direction:column;gap:5px;align-items:center;justify-content:center;}
.ham-bar{display:block;width:18px;height:1.5px;background:currentColor;border-radius:2px;transition:transform .28s ease,opacity .28s ease;}
.ham-bar-1-open{transform:rotate(45deg) translate(4.5px,4.5px);}
.ham-bar-2-open{opacity:0;}
.ham-bar-3-open{transform:rotate(-45deg) translate(4.5px,-4.5px);}
.nav-mobile-overlay{position:fixed;inset:0;background:rgba(5,5,8,.97);backdrop-filter:blur(24px);z-index:300;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;}
.nav-mobile-close{position:absolute;top:18px;right:18px;background:none;border:none;cursor:pointer;color:#f0ede8;padding:6px;}
.nav-mobile-link{font-family:'Instrument Serif',serif;font-style:italic;font-size:34px;color:rgba(240,237,232,.85);text-decoration:none;padding:10px 32px;border-radius:100px;transition:background .2s,color .2s;display:block;}
.nav-mobile-link:hover{background:rgba(0,229,255,.1);color:#00e5ff;}

/* HERO */
.hero{position:relative;min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;padding:0 64px 80px;overflow:hidden;}
.hero-video-wrap{position:absolute;inset:0;z-index:0;}
.hero-video-wrap video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(5,5,8,.18) 0%,rgba(5,5,8,.04) 28%,rgba(5,5,8,.45) 68%,rgba(5,5,8,.96) 100%);}
.hero-noise{position:absolute;inset:0;opacity:.04;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
.hero-content{position:relative;z-index:2;max-width:55%;min-width:280px;}
.hero-h1{font-family:'Instrument Serif',serif;font-size:clamp(40px,6.5vw,96px);line-height:.96;letter-spacing:-2.5px;color:#f0ede8;margin-bottom:20px;animation:fade-rise .8s ease-out .1s both;}
/* Typing role — GRAY italic, not white */
.hero-role-line{font-family:'Instrument Serif',serif;font-style:italic;color:rgba(240,237,232,0.48);font-size:clamp(38px,6vw,90px);line-height:.96;letter-spacing:-2.5px;display:block;margin:0;padding:0;}
.hero-role-line .text-type{display:inline!important;white-space:normal;}
.hero-role-line .text-type__content{display:inline;}
.hero-role-line .text-type__cursor{color:rgba(240,237,232,0.48);font-style:normal;display:inline;margin-left:2px;}
.hero-sub{font-size:clamp(14px,1.4vw,18px);color:rgba(240,237,232,.6);max-width:520px;line-height:1.75;margin-bottom:40px;animation:fade-rise .8s ease-out .3s both;}
.hero-actions{display:flex;gap:12px;flex-wrap:wrap;animation:fade-rise .8s ease-out .45s both;}
.btn-primary{background:var(--accent);color:#050508;border:none;cursor:pointer;padding:13px 26px;border-radius:100px;font-size:14px;font-weight:600;transition:opacity .2s,transform .2s;text-decoration:none;display:inline-flex;align-items:center;gap:8px;}
.btn-primary:hover{opacity:.85;transform:translateY(-2px);}
.btn-outline{background:rgba(255,255,255,.06);color:#f0ede8;border:1px solid rgba(255,255,255,.12);cursor:pointer;padding:13px 26px;border-radius:100px;font-size:14px;font-weight:500;transition:background .2s,transform .2s;text-decoration:none;display:inline-flex;align-items:center;gap:8px;}
.btn-outline:hover{background:rgba(255,255,255,.1);transform:translateY(-2px);}
.hero-scroll{position:absolute;bottom:28px;right:64px;z-index:2;display:flex;flex-direction:column;align-items:center;gap:8px;}
.hero-scroll-line{width:1px;height:44px;background:linear-gradient(to bottom,rgba(255,255,255,.4),transparent);animation:sl 1.8s ease-in-out infinite;}
@keyframes sl{0%,100%{transform:scaleY(1);opacity:1;}50%{transform:scaleY(.5);opacity:.4;}}
.hero-scroll-label{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.35);writing-mode:vertical-rl;}

/* MARQUEE */
.marquee-section{border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:15px 0;overflow:hidden;background:var(--bg2);}
.marquee-track{display:flex;width:max-content;animation:ms 28s linear infinite;}
.marquee-track:hover{animation-play-state:paused;}
@keyframes ms{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
.marquee-item{font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:var(--text3);font-weight:500;white-space:nowrap;display:flex;align-items:center;padding:0 22px;}
.marquee-dot{width:3px;height:3px;border-radius:50%;background:var(--accent);opacity:.6;margin-left:22px;}

/* SECTIONS */
.section{padding:96px 64px;max-width:1200px;margin:0 auto;}
.section-label{font-size:10px;letter-spacing:3.5px;text-transform:uppercase;color:var(--accent);font-weight:600;margin-bottom:14px;display:flex;align-items:center;gap:10px;}
.section-label::before{content:'';display:block;width:22px;height:1px;background:var(--accent);}
.section-title{font-family:'Instrument Serif',serif;font-size:clamp(28px,3.5vw,54px);line-height:1.1;letter-spacing:-1.5px;color:var(--text);margin-bottom:12px;}
.section-title em{font-style:italic;color:var(--text3);}
.section-sub{font-size:15px;color:var(--text2);max-width:480px;line-height:1.7;margin-bottom:52px;}

/* ABOUT */
.about-grid{display:grid;grid-template-columns:380px 1fr;gap:64px;align-items:start;}
.about-right{display:flex;flex-direction:column;gap:20px;padding-top:2px;}
.about-bio{font-size:15px;color:var(--text2);line-height:1.85;}
.about-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.about-card{background:var(--card);border-radius:12px;padding:13px 15px;border:1px solid var(--border);}
.about-card-label{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin-bottom:4px;}
.about-card-val{font-size:12px;font-weight:500;color:var(--text);line-height:1.4;}
.about-actions{display:flex;gap:8px;flex-wrap:wrap;}
.about-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 15px;border-radius:100px;font-size:12px;font-weight:500;text-decoration:none;border:1px solid var(--border2);color:var(--text2);background:var(--bg2);transition:background .2s,color .2s,border-color .2s;cursor:pointer;}
.about-btn:hover{background:var(--bg3);color:var(--text);border-color:var(--accent);}
.about-btn.primary{background:var(--accent);color:#050508;border-color:transparent;}
.about-btn.primary:hover{opacity:.85;}

/* ══ SKILLS — premium cards (Image 6 style) ══ */
.skills-tag-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,0.06);border-radius:24px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);}
.skill-card{background:#0c0c0f;padding:28px 24px;position:relative;overflow:hidden;cursor:default;transition:background .3s;}
.skill-card:hover{background:#111115;}
/* Top glow line */
.skill-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--sk-color,#00e5ff),transparent);opacity:0;transition:opacity .4s;}
.skill-card:hover::before{opacity:1;}
/* Category number */
.skill-num{font-size:52px;font-weight:800;color:rgba(255,255,255,0.04);position:absolute;bottom:16px;right:18px;line-height:1;letter-spacing:-3px;transition:color .3s;}
.skill-card:hover .skill-num{color:rgba(255,255,255,0.06);}
/* Category label */
.skill-card-label{font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:700;margin-bottom:16px;position:relative;z-index:1;}
/* Tags */
.skill-tags{display:flex;flex-wrap:wrap;gap:8px;position:relative;z-index:1;}
.skill-tag{
  font-size:12px;font-weight:500;
  color:rgba(240,237,232,0.6);
  background:rgba(255,255,255,0.05);
  border-radius:100px;padding:5px 13px;
  border:1px solid rgba(255,255,255,0.08);
  transition:background .2s,color .2s,border-color .2s,transform .15s;
}
.skill-tag:hover{background:rgba(255,255,255,0.08);color:var(--sk-color,#00e5ff);border-color:rgba(255,255,255,0.15);transform:translateY(-2px);}

/* SERVICES bento */
/* ═══ Services bento ═══
   Desktop: callout col-1 spans rows 1-3, 6 service cards fill cols 2-3
   Tablet (≤1100): callout full width, cards 2-col below
   Mobile (≤768): all cards single column, full width
*/
.services-bento{
  display:grid;
  grid-template-columns:1fr 1fr 1fr;
  grid-auto-rows:auto;
  gap:14px;
  align-items:stretch;
}
.svc-callout{
  grid-column:1;
  grid-row:1 / span 3;
  background:#f0ece5;
  border-radius:20px;
  padding:32px 28px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  min-height:300px;
}
.svc-callout-title{font-size:clamp(18px,2vw,26px);font-weight:700;color:#111;line-height:1.25;margin-bottom:10px;white-space:pre-line;}
.svc-callout-sub{font-size:13.5px;color:#666;line-height:1.6;flex:1;}
.svc-callout-btn{display:inline-flex;align-items:center;background:#111;color:#fff;padding:11px 20px;border-radius:100px;font-size:13px;font-weight:600;text-decoration:none;cursor:pointer;border:none;width:fit-content;margin-top:20px;flex-shrink:0;transition:opacity .2s;}
.svc-callout-btn:hover{opacity:.85;}
.svc-mini{background:#141416;border-radius:18px;padding:22px 20px;border:1px solid rgba(255,255,255,0.07);transition:background .25s,border-color .25s,transform .25s;display:flex;flex-direction:column;}
.svc-mini:hover{background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.14);transform:translateY(-3px);}
.svc-mini-icon{margin-bottom:12px;display:flex;align-items:center;justify-content:flex-start;line-height:1;width:36px;height:36px;}
.svc-mini-icon svg{width:28px;height:28px;}
.svc-mini-title{font-size:14px;font-weight:600;color:var(--text);margin-bottom:7px;line-height:1.3;}
.svc-mini-desc{font-size:12.5px;color:var(--text2);line-height:1.65;}

/* ACHIEVEMENTS */
.ach-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.ach-card{background:#141416;border-radius:18px;padding:24px 22px;border:1px solid rgba(255,255,255,0.07);position:relative;overflow:hidden;transition:background .25s,border-color .25s,transform .25s;}
.ach-card:hover{background:rgba(255,255,255,0.03);transform:translateY(-3px);}
.ach-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--ac,#00e5ff),transparent);}
.ach-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:16px;}
.ach-icon-box{width:52px;height:52px;border-radius:14px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
.ach-metric-badge{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:4px 10px;border-radius:100px;background:color-mix(in srgb, var(--ac,#00e5ff) 15%, transparent);color:var(--ac,#00e5ff);border:1px solid color-mix(in srgb, var(--ac,#00e5ff) 30%, transparent);white-space:nowrap;}
.ach-title{font-size:15px;font-weight:600;color:var(--text);margin-bottom:8px;}
.ach-desc{font-size:13px;color:var(--text2);line-height:1.65;}

/* CONTACT */
.contact-wrap{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;}
.contact-glass{background:var(--glass);border-radius:24px;padding:32px;backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);position:relative;overflow:hidden;border:1px solid var(--border);}
.contact-glass::before{content:'';position:absolute;inset:0;border-radius:24px;padding:1px;background:linear-gradient(145deg,rgba(0,229,255,.2) 0%,rgba(255,255,255,.05) 40%,rgba(255,255,255,.02) 70%,rgba(167,139,250,.12) 100%);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;}
.contact-link{display:flex;align-items:center;gap:12px;padding:13px 0;min-height:56px;border-bottom:1px solid var(--border);text-decoration:none;transition:padding-left .2s;overflow:hidden;}
.contact-link:last-child{border-bottom:none;}
.contact-link:hover{padding-left:4px;}
.cli{width:36px;height:36px;flex-shrink:0;border-radius:10px;background:rgba(0,229,255,.08);border:1px solid rgba(0,229,255,.15);display:flex;align-items:center;justify-content:center;color:var(--accent);}
.cll{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);}
.clv{font-size:13px;font-weight:500;color:var(--text);margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:220px;}

/* ══ FOOTER — improved ══ */
.footer{border-top:1px solid var(--border);padding:56px 64px 40px;margin-top:0;isolation:isolate;position:relative;z-index:2;}
.footer-inner{max-width:1200px;margin:0 auto;}
.footer-top{display:grid;grid-template-columns:1fr 1fr 1fr;gap:48px;margin-bottom:48px;}
.footer-brand .footer-name{font-family:'Instrument Serif',serif;font-style:italic;font-size:26px;color:var(--text);letter-spacing:-.5px;}
.footer-brand .footer-name span{color:var(--accent);}
.footer-brand p{font-size:13px;color:var(--text3);line-height:1.7;margin-top:10px;max-width:260px;}
.footer-col-title{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--text3);font-weight:600;margin-bottom:16px;}
.footer-nav-links{list-style:none;display:flex;flex-direction:column;gap:10px;}
.footer-nav-links a{font-size:13px;color:var(--text2);text-decoration:none;transition:color .2s;}
.footer-nav-links a:hover{color:var(--accent);}
.footer-contact-list{display:flex;flex-direction:column;gap:10px;}
.footer-contact-item{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text2);text-decoration:none;transition:color .2s;}
.footer-contact-item:hover{color:var(--accent);}
.footer-bottom{border-top:1px solid var(--border);padding-top:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}
.footer-copy{font-size:12px;color:var(--text3);line-height:1.5;}
.footer-socials{display:flex;gap:12px;}
.footer-social{width:34px;height:34px;border-radius:10px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--text3);text-decoration:none;transition:border-color .2s,color .2s,background .2s;}
.footer-social:hover{border-color:var(--accent);color:var(--accent);background:rgba(0,229,255,0.06);}
.footer-status{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:var(--accent);letter-spacing:.5px;}
.footer-status-dot{width:6px;height:6px;border-radius:50%;background:#34d399;animation:pulse-dot 2s ease-in-out infinite;flex-shrink:0;}
@keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(.7);}}

/* FAB */
.fab{position:fixed;bottom:22px;right:22px;z-index:100;width:42px;height:42px;border-radius:50%;background:var(--accent);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#050508;box-shadow:0 4px 20px rgba(0,229,255,.35);transition:transform .3s;}
.fab:hover{transform:translateY(-3px);}

@keyframes fade-rise{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
.reveal{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease;}
.reveal.visible{opacity:1;transform:translateY(0);}
.reveal-delay-1{transition-delay:.1s;}.reveal-delay-2{transition-delay:.2s;}.reveal-delay-3{transition-delay:.3s;}

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE — full coverage for all breakpoints
   ═══════════════════════════════════════════════════════════ */

/* ── 1280px — large desktop ── */
@media(max-width:1280px){
  .nav{padding:12px 20px;}
  .hero{padding:0 48px 72px;}
  .section{padding:80px 48px;}
  .footer{padding:48px 48px 32px;}
}

/* ── 1100px — small desktop / large tablet ── */
@media(max-width:1100px){
  .about-grid{grid-template-columns:1fr;}
  .skills-tag-grid{grid-template-columns:repeat(2,1fr);}
  /* Services: callout full top row, cards 2-col below */
  .services-bento{grid-template-columns:1fr 1fr;}
  .svc-callout{grid-column:1/3;grid-row:auto;min-height:auto;min-width:0;}
  .ach-grid{grid-template-columns:repeat(2,1fr);}
  .contact-wrap{grid-template-columns:1fr;}
  .footer-top{grid-template-columns:1fr 1fr;}
}

/* ── 768px — tablet / large mobile ── */
@media(max-width:768px){
  /* Nav */
  .nav{padding:10px 14px;}
  .nav-links{display:none!important;}
  .nav-cta{display:none!important;}
  .nav-ham{display:flex!important;}
  /* Hero */
  .hero{padding:0 20px 60px;}
  .hero-content{max-width:100%!important;}
  .hero-h1{font-size:clamp(30px,9vw,62px);letter-spacing:-1.5px;}
  .hero-role-line{font-size:clamp(28px,8.5vw,58px);}
  .hero-sub{font-size:15px;max-width:100%;}
  .hero-scroll{display:none;}
  /* Sections */
  .section{padding:60px 20px;}
  .section-sub{margin-bottom:36px;}
  /* About */
  .about-grid{gap:32px;}
  .about-cards{grid-template-columns:1fr 1fr;}
  /* Skills */
  .skills-tag-grid{grid-template-columns:1fr 1fr;}
  /* Services — on mobile: flex column, no grid placement */
  .services-bento{
    display:flex!important;
    flex-direction:column!important;
    gap:12px;
  }
  .svc-callout{
    grid-column:unset!important;
    grid-row:unset!important;
    width:100%!important;
    min-height:auto!important;
    padding:24px 20px;
  }
  .svc-callout-title{font-size:20px!important;white-space:normal!important;}
  .svc-mini{padding:20px 18px;width:100%!important;}
  .svc-callout-sub{flex:none!important;}
  /* Achievements */
  .ach-grid{grid-template-columns:1fr 1fr;}
  /* Contact */
  .contact-wrap{gap:28px;}
  /* Footer */
  .footer{padding:40px 20px 28px;}
  .footer-top{grid-template-columns:1fr;gap:28px;}
  .footer-bottom{flex-direction:column;align-items:flex-start;}
}

/* ── 640px — small mobile ── */
@media(max-width:640px){
  .ach-grid{grid-template-columns:1fr;}
  .about-cards{grid-template-columns:1fr;}
  .skills-tag-grid{grid-template-columns:1fr 1fr;}
}

/* ── 540px ── */
@media(max-width:540px){
  .skills-tag-grid{grid-template-columns:1fr;}
  .hero-h1{font-size:clamp(26px,8.5vw,52px);}
  .hero-role-line{font-size:clamp(24px,8vw,48px);}
  .hero-sub{font-size:14px;}
}

/* ── 480px ── */
@media(max-width:480px){
  .hero-content{max-width:100%!important;}
  .hero-actions{flex-direction:column;}
  .btn-primary,.btn-outline{width:100%;justify-content:center;}
  .about-actions{flex-direction:column;}
  .about-btn{width:100%;justify-content:center;text-align:center;}
  .section-title{font-size:clamp(24px,7vw,40px);}
}

/* ── 375px — smallest phones ── */
@media(max-width:375px){
  .hero-h1{font-size:clamp(22px,8vw,40px);}
  .hero-role-line{font-size:clamp(20px,7.5vw,36px);}
  .section{padding:44px 14px;}
  .contact-glass{padding:18px 14px;}
  .clv{max-width:140px;word-break:break-all;white-space:normal;}
  .svc-callout{padding:20px 16px;}
  .skill-card{padding:20px 16px;}
}
`;

// ═══ LOADER ═══
const WDS=["INITIALIZING","BUILDING","CRAFTING","DESIGNING","LAUNCHING"];
function Loader({onDone}:{onDone:()=>void}){
  const [p,setP]=useState(0),[w,setW]=useState(WDS[0]);
  const s=useRef(0),r=useRef(0);
  useEffect(()=>{s.current=performance.now();const t=(n:number)=>{const v=Math.min(Math.floor(((n-s.current)/2400)*100),100);setP(v);setW(WDS[Math.floor((v/100)*WDS.length)%WDS.length]);if(v<100)r.current=requestAnimationFrame(t);else setTimeout(onDone,300);};r.current=requestAnimationFrame(t);return()=>cancelAnimationFrame(r.current);},[onDone]);
  return(<div className="loader"><div className="loader-name">Devson<span style={{color:"#00e5ff"}}>.</span></div><div className="loader-word">{w}</div><div className="loader-bar-track"><div className="loader-bar-fill" style={{width:`${p}%`}}/></div><div className="loader-pct">{p}%</div></div>);
}

function Nav(){
  const [open,setOpen]=useState(false);
  const links=["About","Skills","Projects","Services","Contact"];
  const scroll=(id:string)=>{document.getElementById(id.toLowerCase())?.scrollIntoView({behavior:"smooth"});setOpen(false);};
  return(
    <>
      <nav className="nav">
        <div className="nav-bar">
          <a className="nav-logo" href="#">Devson<span>.</span></a>
          <ul className="nav-links">{links.map(l=><li key={l}><a href="#" onClick={e=>{e.preventDefault();scroll(l);}}>{l}</a></li>)}</ul>
          <div className="nav-right">
            <a className="nav-cta" href={`mailto:${ABOUT.email}`}>Start a Chat</a>
            <button className="nav-ham" onClick={()=>setOpen(o=>!o)}>
              <span className={`ham-bar${open?' ham-bar-1-open':''}`}/>
              <span className={`ham-bar${open?' ham-bar-2-open':''}`}/>
              <span className={`ham-bar${open?' ham-bar-3-open':''}`}/>
            </button>
          </div>
        </div>
      </nav>
      {open&&(<div className="nav-mobile-overlay"><button className="nav-mobile-close" onClick={()=>setOpen(false)}><X size={22} color="#f0ede8"/></button>{links.map(l=><a key={l} className="nav-mobile-link" href="#" onClick={e=>{e.preventDefault();scroll(l);}}>{l}</a>)}</div>)}
    </>
  );
}

function Hero(){
  return(
    <section className="hero" id="home">
      <div className="hero-video-wrap"><video autoPlay loop muted playsInline><source src={VIDEO_URL} type="video/mp4"/></video><div className="hero-overlay"/><div className="hero-noise"/></div>
      <div className="hero-content">
        <h1 className="hero-h1">
          <span style={{display:'block'}}>{ABOUT.headline1}</span>
          <span className="hero-role-line">
            <TextType text={ABOUT.typingRoles} typingSpeed={70} deletingSpeed={32} pauseDuration={1800} showCursor cursorCharacter="|" cursorBlinkDuration={0.5} loop as="span"/>
          </span>
        </h1>
        <p className="hero-sub">{ABOUT.subline}</p>
        <div className="hero-actions">
          <a className="btn-primary" href="#projects">View Projects <ArrowUpRight size={16}/></a>
          <a className="btn-outline" href={`mailto:${ABOUT.email}`}><Mail size={15}/> Get in Touch</a>
        </div>
      </div>
      <div className="hero-scroll"><div className="hero-scroll-line"/><span className="hero-scroll-label">Scroll</span></div>
    </section>
  );
}

function MarqueeBand(){
  const d=[...MARQUEE,...MARQUEE];
  return(<div className="marquee-section"><div className="marquee-track">{d.map((it,i)=><span key={i} className="marquee-item">{it}<span className="marquee-dot"/></span>)}</div></div>);
}
function useReveal(){
  useEffect(()=>{const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");obs.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll(".reveal").forEach(el=>obs.observe(el));return()=>obs.disconnect();},[]);
}

function About(){
  return(
    <section className="section" id="about" style={{paddingTop:120,position:'relative'}}>
      <div className="section-label reveal">About</div>
      <div className="about-grid">
        {/* Target anchor for flying card to dock into on desktop */}
        <div id="about-card-slot" className="reveal" style={{minHeight:460,position:'relative'}}>
          <StaticProfileCard avatarUrl={AVATAR}/>
        </div>
        <div className="about-right">
          <h2 className="section-title reveal">Who I <em>Am.</em></h2>
          <p className="about-bio reveal reveal-delay-1">{ABOUT.bio1}</p>
          <p className="about-bio reveal reveal-delay-2">{ABOUT.bio2}</p>
          <div className="about-cards reveal reveal-delay-3">
            <div className="about-card"><div className="about-card-label">Degree</div><div className="about-card-val">{ABOUT.degree}</div></div>
            <div className="about-card"><div className="about-card-label">Specialization</div><div className="about-card-val">{ABOUT.specialization}</div></div>
            <div className="about-card"><div className="about-card-label">University</div><div className="about-card-val">{ABOUT.college}</div></div>
            <div className="about-card"><div className="about-card-label">Status</div><div className="about-card-val">{ABOUT.year}</div></div>
          </div>
          <div className="about-actions reveal">
            {RESUME_PDF&&RESUME_PDF!=="RESUME_PLACEHOLDER"&&(<a className="about-btn primary" href={RESUME_PDF} download="Ganesh_M_Resume.pdf"><Download size={12}/> Resume</a>)}
            <a className="about-btn" href={ABOUT.github} target="_blank" rel="noopener noreferrer">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              GitHub
            </a>
            <a className="about-btn" href={ABOUT.linkedin} target="_blank" rel="noopener noreferrer">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn
            </a>
            <a className="about-btn" href={ABOUT.whatsapp} target="_blank" rel="noopener noreferrer">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const SK_COLORS=["#00e5ff","#a78bfa","#34d399","#f59e0b","#f97316","#ec4899"];
function Skills(){
  return(
    <section className="section" id="skills">
      <div className="section-label reveal">Stack</div>
      <h2 className="section-title reveal">Skills &amp; <em>Tools.</em></h2>
      <p className="section-sub reveal">Every tool I reach for has a reason behind it.</p>
      <div className="skills-tag-grid reveal">
        {Object.entries(SKILLS).map(([cat,tags],i)=>(
          <div key={cat} className="skill-card" style={{"--sk-color":SK_COLORS[i%SK_COLORS.length]} as CSSProperties}>
            <div className="skill-card-label" style={{color:SK_COLORS[i%SK_COLORS.length]}}>{cat}</div>
            <div className="skill-tags">{tags.map(t=><span key={t} className="skill-tag">{t}</span>)}</div>
            <div className="skill-num">0{i+1}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Projects(){
  return(
    <section className="section" id="projects" style={{overflow:'visible'}}>
      <div className="section-label reveal">Work</div>
      <h2 className="section-title reveal">Featured <em>Projects.</em></h2>
      <p className="section-sub reveal">Real clients. Real code. Real impact.</p>
      <ProjectsCarousel/>
    </section>
  );
}

function Services(){
  return(
    <section className="section" id="services">
      <div className="section-label reveal">Services</div>
      <h2 className="section-title reveal">What I <em>Offer.</em></h2>
      <div className="services-bento reveal">
        <div className="svc-callout">
          <div>
            <h3 className="svc-callout-title">{SERVICE_CALLOUT.title}</h3>
            <p className="svc-callout-sub">{SERVICE_CALLOUT.sub}</p>
          </div>
          <a className="svc-callout-btn" href={"mailto:"+ABOUT.email}>{SERVICE_CALLOUT.cta}</a>
        </div>
        {SERVICES.map((s,i)=>{
          const icon=SVC_SVG_ICONS[s.icon];
          return(
            <GlareHover key={s.title}
              width="100%" height="auto"
              background="#141416" borderRadius="18px"
              borderColor="rgba(255,255,255,0.07)"
              glareColor="#ffffff" glareOpacity={0.06}
              glareAngle={-25} glareSize={240} transitionDuration={700}
              className={"svc-mini reveal reveal-delay-"+(i%3+1)}
              style={{display:'block',width:'100%'}}>
              <div style={{padding:'22px 20px',display:'flex',flexDirection:'column',width:'100%'}}>
                <div className="svc-mini-icon">{icon||<span style={{fontSize:26}}>{s.icon}</span>}</div>
                <div className="svc-mini-title">{s.title}</div>
                <div className="svc-mini-desc">{s.desc}</div>
              </div>
            </GlareHover>
          );
        })}
      </div>
    </section>
  );
}

function Achievements(){
  return(
    <section className="section" id="achievements" style={{paddingTop:0}}>
      <div className="section-label reveal">Wins</div>
      <h2 className="section-title reveal">Achievements &amp; <em>Highlights.</em></h2>
      <div className="ach-grid">
        {ACHIEVEMENTS.map((a,i)=>(
          <div key={i} className={`ach-card reveal reveal-delay-${(i%3)+1}`} style={{"--ac":a.color} as CSSProperties}>
            <div className="ach-top">
              <div className="ach-icon-box" style={{background:`color-mix(in srgb, ${a.color} 12%, transparent)`}}><span style={{fontSize:22}}>{a.icon}</span></div>
              <span className="ach-metric-badge">{a.metric}</span>
            </div>
            <div className="ach-title">{a.title}</div>
            <div className="ach-desc">{a.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact(){
  const [cop,setCop]=useState(false);
  const cp=useCallback(()=>{navigator.clipboard.writeText(ABOUT.email);setCop(true);setTimeout(()=>setCop(false),2000);},[]);
  return(
    <section className="section" id="contact">
      <div className="contact-wrap">
        <div>
          <div className="section-label reveal">Contact</div>
          <h2 className="section-title reveal">Let's Build<br/><em>Something Great.</em></h2>
          <p className="section-sub reveal" style={{marginBottom:0}}>Open to freelance, internships, and cybersecurity collaborations.</p>
        </div>
        <div className="contact-glass reveal">
          <a className="contact-link" href={`mailto:${ABOUT.email}`}><div className="cli"><Mail size={15}/></div><div style={{overflow:"hidden",flex:1,minWidth:0}}><div className="cll">Email</div><div className="clv">{ABOUT.email}</div></div><button style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:"var(--text3)",flexShrink:0}} onClick={e=>{e.preventDefault();cp();}}>{cop?<Check size={13} style={{color:"var(--accent)"}}/>:<Copy size={13}/>}</button></a>
          <a className="contact-link" href={ABOUT.linkedin} target="_blank" rel="noopener noreferrer"><div className="cli"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></div><div style={{overflow:"hidden",flex:1,minWidth:0}}><div className="cll">LinkedIn</div><div className="clv">Ganesh M</div></div><ExternalLink size={12} style={{marginLeft:"auto",color:"var(--text3)",flexShrink:0}}/></a>
          <a className="contact-link" href={ABOUT.github} target="_blank" rel="noopener noreferrer"><div className="cli"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></div><div style={{overflow:"hidden",flex:1,minWidth:0}}><div className="cll">GitHub</div><div className="clv">dev-son123</div></div><ExternalLink size={12} style={{marginLeft:"auto",color:"var(--text3)",flexShrink:0}}/></a>
          <a className="contact-link" href={ABOUT.whatsapp} target="_blank" rel="noopener noreferrer"><div className="cli"><MessageCircle size={15}/></div><div style={{overflow:"hidden",flex:1,minWidth:0}}><div className="cll">WhatsApp</div><div className="clv">+91 93454 99833</div></div><ExternalLink size={12} style={{marginLeft:"auto",color:"var(--text3)",flexShrink:0}}/></a>
          <div style={{marginTop:18}}><a className="btn-primary" href={`mailto:${ABOUT.email}`} style={{width:"100%",justifyContent:"center",borderRadius:12}}>Send a Message <ArrowUpRight size={14}/></a></div>
        </div>
      </div>
    </section>
  );
}

// ═══ FOOTER — improved, 3-column ═══
function Footer(){
  const links=["About","Skills","Projects","Services","Contact","Testimonials"];
  const scroll=(id:string)=>document.getElementById(id.toLowerCase())?.scrollIntoView({behavior:"smooth"});
  return(
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-name">Devson<span>.</span></div>
            <p>Full-Stack Developer & Cybersecurity Enthusiast based in Tamil Nadu, India. Building secure, modern web products.</p>
            <div className="footer-status" style={{marginTop:14}}><span className="footer-status-dot"/>Available for new projects</div>
          </div>
          {/* Navigation */}
          <div>
            <div className="footer-col-title">Navigation</div>
            <ul className="footer-nav-links">
              {links.map(l=><li key={l}><a href="#" onClick={e=>{e.preventDefault();scroll(l);}}>{l}</a></li>)}
            </ul>
          </div>
          {/* Contact */}
          <div>
            <div className="footer-col-title">Get in Touch</div>
            <div className="footer-contact-list">
              <a className="footer-contact-item" href={`mailto:${ABOUT.email}`}><Mail size={13}/>{ABOUT.email}</a>
              <a className="footer-contact-item" href={ABOUT.linkedin} target="_blank" rel="noopener noreferrer"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>LinkedIn</a>
              <a className="footer-contact-item" href={ABOUT.github} target="_blank" rel="noopener noreferrer"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>GitHub</a>
              <a className="footer-contact-item" href={ABOUT.whatsapp} target="_blank" rel="noopener noreferrer"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>WhatsApp</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 Ganesh M (Devson). Built with React + Supabase + Claude API.</div>
          <div className="footer-socials">
            <a className="footer-social" href={ABOUT.github} target="_blank" rel="noopener noreferrer" title="GitHub"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a>
            <a className="footer-social" href={ABOUT.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>
            <a className="footer-social" href={`mailto:${ABOUT.email}`} title="Email"><Mail size={15}/></a>
            <a className="footer-social" href={ABOUT.whatsapp} target="_blank" rel="noopener noreferrer" title="WhatsApp"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Fab(){
  const [s,setS]=useState(false);
  useEffect(()=>{const h=()=>setS(window.scrollY>400);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h);},[]);
  if(!s)return null;
  return <button className="fab" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}><ChevronUp size={18}/></button>;
}

export default function App(){
  const [loaded,setLoaded]=useState(false);
  useReveal();
  const done=useCallback(()=>setLoaded(true),[]);
  return(
    <>
      <style dangerouslySetInnerHTML={{__html:CSS}}/>
      {!loaded&&<Loader onDone={done}/>}
      <div style={{opacity:loaded?1:0,transition:"opacity 0.6s ease",position:'relative',zIndex:1}}>
        <SplashCursor/>
        <Nav/>
        <Hero/>
        <MarqueeBand/>
        <About/>
        <Skills/>
        <Projects/>
        <Services/>
        <Achievements/>
        <Testimonials/>
        <Contact/>
        <Footer/>
        <Fab/>
      </div>
    </>
  );
}