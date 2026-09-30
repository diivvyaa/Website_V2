// Smooth fade-in on scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.style.opacity=1;e.target.style.transform='none';io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('section h2, section article, section li, section p').forEach(el=>{el.style.transition='opacity .9s ease, transform .9s ease';el.style.opacity=0;el.style.transform='translateY(24px)';io.observe(el)});
// Heartbeat sound toggle
let ctx,timer,on=false;
const btn=[...document.querySelectorAll('button')].find(b=>/heartbeat/i.test(b.textContent));
function thump(t,f,d,g){const o=ctx.createOscillator(),v=ctx.createGain(),lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=180;o.frequency.setValueAtTime(f*1.6,t);o.frequency.exponentialRampToValueAtTime(f,t+.05);v.gain.setValueAtTime(.0001,t);v.gain.exponentialRampToValueAtTime(g,t+.015);v.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(v).connect(lp).connect(ctx.destination);o.start(t);o.stop(t+d+.05)}
function beat(){const t=ctx.currentTime+.02;thump(t,55,.22,.9);thump(t+.28,70,.28,.55)}
btn&&btn.addEventListener('click',()=>{on=!on;ctx=ctx||new AudioContext();ctx.resume();clearInterval(timer);if(on){beat();timer=setInterval(beat,880)}btn.lastElementChild.textContent=on?'Heartbeat on':'Play heartbeat'});
// Magnetic buttons
document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.15}px,${(e.clientY-r.top-r.height/2)*.15}px)`});el.addEventListener('mouseleave',()=>el.style.transform='')});

// Extra-smooth scrolling (Lenis) linked to GSAP
gsap.registerPlugin(ScrollTrigger);
const lenis=new Lenis({lerp:.08});
lenis.on('scroll',ScrollTrigger.update);
gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();lenis.scrollTo(t)}}));

// Heart-to-laptop pull-back: heart starts close, camera moves back and reveals the laptop
const heart=document.querySelector('#home img[src*="heart"]');
if(heart){
  const cam=heart.closest('.will-change-transform');          // outer wrapper (inner one has the CSS heartbeat)
  const laptop=document.querySelector('#home .absolute.inset-0.flex > .relative');
  const tl=gsap.timeline({scrollTrigger:{trigger:'#home',start:'top top',end:'bottom bottom',scrub:1}});
  tl.fromTo(cam,{scale:1.6},{scale:.42,y:-40,ease:'power1.inOut',duration:1},0)
    .fromTo(laptop,{scale:2.4,opacity:0},{scale:1,opacity:1,ease:'power1.inOut',duration:1},0)
    .to([cam,laptop],{xPercent:-30,ease:'none',duration:.5},1.1);
}

// Custom cursor: red dot + soft trailing ring
if(matchMedia('(pointer:fine)').matches){
  const dot=document.createElement('div'),ring=document.createElement('div');
  dot.style.cssText='position:fixed;top:0;left:0;width:8px;height:8px;border-radius:50%;background:#9E1B1B;pointer-events:none;z-index:9999;';
  ring.style.cssText='position:fixed;top:0;left:0;width:36px;height:36px;border-radius:50%;border:1px solid rgba(158,27,27,.5);pointer-events:none;z-index:9998;transition:width .25s,height .25s;';
  document.body.append(dot,ring);
  let mx=0,my=0,rx=0,ry=0;
  addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.transform=`translate(${mx-4}px,${my-4}px)`});
  (function loop(){rx+=(mx-rx)*.15;ry+=(my-ry)*.15;const s=ring.offsetWidth/2;ring.style.transform=`translate(${rx-s}px,${ry-s}px)`;requestAnimationFrame(loop)})();
  document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('mouseenter',()=>{ring.style.width=ring.style.height='60px'});el.addEventListener('mouseleave',()=>{ring.style.width=ring.style.height='36px'})});
}
