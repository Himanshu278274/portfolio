(function(){
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var mx=0,my=0,sy=0,vel=0,last=0;
setTimeout(function(){document.getElementById('loader').classList.add('done');intro()},1500);

/* name scramble + role typing */
function intro(){
  var el=document.getElementById('name'),em=el.querySelector('em'),txt='Himanshu',ch='01<>/{}#%&';
  if(!reduce){var f=0,iv=setInterval(function(){f++;em.textContent=txt.split('').map(function(c,i){return i<f/3?c:ch[Math.floor(Math.random()*ch.length)]}).join('');if(f>=txt.length*3){clearInterval(iv);em.textContent=txt}},45)}
  var roles=['Frontend Developer','React Learner','Python Learner','3D Web Creator','Problem Solver'],ri=0,ci=0,del=false,out=document.getElementById('role');
  (function type(){
    var w=roles[ri];out.textContent=w.slice(0,ci);
    if(!del&&ci===w.length){del=true;return setTimeout(type,1400)}
    if(del&&ci===0){del=false;ri=(ri+1)%roles.length}
    ci+=del?-1:1;setTimeout(type,del?35:75);
  })();
}

/* reveal, counters, nav highlight */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');e.target.querySelectorAll('[data-n]').forEach(count);io.unobserve(e.target)}})},{threshold:.2});
document.querySelectorAll('.rv').forEach(function(x){io.observe(x)});
function count(n){var t=+n.dataset.n,i=0;var v=setInterval(function(){i++;n.textContent=i;if(i>=t)clearInterval(v)},250)}
var links=document.querySelectorAll('nav a'),secs=[].slice.call(document.querySelectorAll('section'));
var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})}})},{threshold:.5});
secs.forEach(function(s){so.observe(s)});

/* input */
var bar=document.getElementById('bar');
addEventListener('mousemove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
addEventListener('scroll',function(){var h=document.documentElement.scrollHeight-innerHeight;sy=h>0?scrollY/h:0;bar.style.width=(sy*100)+'%'},{passive:true});

/* card 3D tilt + spotlight */
if(!reduce)document.querySelectorAll('.card').forEach(function(el){
  el.addEventListener('mousemove',function(e){var b=el.getBoundingClientRect(),x=(e.clientX-b.left)/b.width,y=(e.clientY-b.top)/b.height;
    el.style.setProperty('--x',x*100+'%');el.style.setProperty('--y',y*100+'%');
    el.style.transform='rotateY('+(x-.5)*18+'deg) rotateX('+(.5-y)*18+'deg) translateZ(14px)'});
  el.addEventListener('mouseleave',function(){el.style.transform=''});
});


/* magnetic buttons */
if(!reduce)document.querySelectorAll('.btn').forEach(function(b){
  b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+(e.clientX-r.left-r.width/2)*.25+'px,'+(e.clientY-r.top-r.height/2)*.35+'px)'});
  b.addEventListener('mouseleave',function(){b.style.transform=''});
});
/* copy number */
var toast=document.getElementById('toast');
function say(t){toast.textContent=t;toast.classList.add('show');setTimeout(function(){toast.classList.remove('show')},1800)}
document.getElementById('copy').addEventListener('click',function(){
  var n='9996255639';
  if(navigator.clipboard)navigator.clipboard.writeText(n).then(function(){say('Number copied')},function(){say(n)});else say(n);
});
/* accent colour switcher */
var pal=[{c:'#00f0ff',r:'0,240,255',h:.5},{c:'#2dff8a',r:'45,255,138',h:.4},{c:'#ff3d81',r:'255,61,129',h:.94},{c:'#ffb020',r:'255,176,32',h:.11}],hue=.5,accent=0x00f0ff,onAccent=null;
document.querySelectorAll('#theme button').forEach(function(b){b.addEventListener('click',function(){
  var p=pal[+b.dataset.i],root=document.documentElement.style;root.setProperty('--c',p.c);root.setProperty('--rgb',p.r);
  document.querySelectorAll('#theme button').forEach(function(x){x.classList.toggle('on',x===b)});
  hue=p.h;accent=parseInt(p.c.slice(1),16);if(onAccent)onAccent();
})});

/* THREE scene */
if(typeof THREE==='undefined')return;
var cv=document.getElementById('bg'),R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
R.setPixelRatio(Math.min(devicePixelRatio,1.5));
var S=new THREE.Scene(),C=new THREE.PerspectiveCamera(60,1,.1,200);C.position.z=9;
var mob=innerWidth<800;
/* stars */
var N=1800,p=new Float32Array(N*3),k=new Float32Array(N*3),c1=new THREE.Color('#00f0ff'),c2=new THREE.Color('#b44cff'),c3=new THREE.Color('#ffffff');
for(var i=0;i<N;i++){var r=12+Math.random()*60,t=Math.random()*6.283,u=Math.acos(2*Math.random()-1);
  p[i*3]=r*Math.sin(u)*Math.cos(t);p[i*3+1]=r*Math.sin(u)*Math.sin(t);p[i*3+2]=r*Math.cos(u);
  var c=Math.random()<.15?c1:Math.random()<.2?c2:c3;k[i*3]=c.r;k[i*3+1]=c.g;k[i*3+2]=c.b}
var sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(p,3));sg.setAttribute('color',new THREE.BufferAttribute(k,3));
var stars=new THREE.Points(sg,new THREE.PointsMaterial({size:.09,vertexColors:true,transparent:true,opacity:.85,depthWrite:false}));S.add(stars);
/* core object: knot + shell + rings */
var core=new THREE.Group();S.add(core);
function wire(g,col,op){return new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:col,wireframe:true,transparent:true,opacity:op}))}
var knot=wire(new THREE.TorusKnotGeometry(1.5,.38,100,12,2,3),0x00f0ff,.55);core.add(knot);
var shell=wire(new THREE.IcosahedronGeometry(2.7,1),0xb44cff,.28);core.add(shell);
var inner=new THREE.Mesh(new THREE.OctahedronGeometry(.55),new THREE.MeshBasicMaterial({color:0xffffff,wireframe:true}));core.add(inner);
var rings=[];[3.4,4.1,4.9].forEach(function(rad,i){var m=new THREE.Mesh(new THREE.TorusGeometry(rad,.012,8,140),new THREE.MeshBasicMaterial({color:i==1?0xb44cff:0x00f0ff,transparent:true,opacity:.7}));m.rotation.x=1+i*.5;m.rotation.y=i*.7;core.add(m);rings.push(m)});
/* orbiting satellites */
var sats=[];for(var j=0;j<10;j++){var s=new THREE.Mesh(new THREE.BoxGeometry(.14,.14,.14),new THREE.MeshBasicMaterial({color:j%2?0x00f0ff:0xb44cff,wireframe:true}));s.userData={a:Math.random()*6.28,r:3+Math.random()*2.2,sp:.2+Math.random()*.5,y:(Math.random()-.5)*3};core.add(s);sats.push(s)}
/* floating shards */
var shards=[];for(var q=0;q<12;q++){var sh=wire(new THREE.TetrahedronGeometry(.25+Math.random()*.35),q%2?0x00f0ff:0xb44cff,.6);sh.position.set((Math.random()-.5)*34,(Math.random()-.5)*20,-4-Math.random()*20);sh.userData={rx:Math.random()*.01,ry:Math.random()*.01,fy:Math.random()*6};S.add(sh);shards.push(sh)}
onAccent=function(){rings.forEach(function(m,i){if(i!==1)m.material.color.setHex(accent)});sats.forEach(function(s,j){if(j%2)s.material.color.setHex(accent)});shards.forEach(function(s,q){if(q%2)s.material.color.setHex(accent)})};
function size(){R.setSize(innerWidth,innerHeight,false);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix();mob=innerWidth<800}
addEventListener('resize',size);size();
var T=0,cs=0,tx=0;
function loop(now){
  vel=Math.abs(sy-last)*60;last+=(sy-last)*.1;vel=Math.min(vel,1);
  if(!reduce){
    T+=.008+vel*.06;
    stars.rotation.y=T*.05;stars.rotation.x=sy*1.2;
    /* core follows scroll: slides side to side, zooms, spins faster when scrolling */
    var target=mob?0:3.2*Math.cos(sy*Math.PI*3.2);
    tx+=(target-tx)*.05;core.position.x=tx;core.position.y=Math.sin(T*2)*.25-sy*1.2;
    var sc=(mob?.62:1)*(1+.35*Math.sin(sy*Math.PI*2));core.scale.setScalar(sc);
    knot.rotation.x=T*.7;knot.rotation.y=T*.5+mx*1.5;
    shell.rotation.y=-T*.4;shell.rotation.x=T*.2+my;
    inner.rotation.x=T*2;inner.rotation.y=T*1.4;
    rings.forEach(function(m,i){m.rotation.z=T*(.4+i*.25)*(i%2?-1:1)});
    sats.forEach(function(s){var d=s.userData;d.a+=d.sp*.01*(1+vel*8);s.position.set(Math.cos(d.a)*d.r,d.y+Math.sin(d.a*2)*.4,Math.sin(d.a)*d.r);s.rotation.x+=.03;s.rotation.y+=.03});
    shards.forEach(function(s){var d=s.userData;s.rotation.x+=d.rx+vel*.05;s.rotation.y+=d.ry+vel*.05;s.position.y+=Math.sin(T*2+d.fy)*.004});
    /* camera: mouse parallax + fly-through on scroll */
    C.position.x+=(mx*2.4-C.position.x)*.04;C.position.y+=(-my*1.6-C.position.y)*.04;
    C.position.z=9-sy*3+vel*1.5;C.lookAt(0,0,0);
    knot.material.color.setHSL((hue+sy*.25)%1,1,.5);
  }
  R.render(S,C);requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
})();