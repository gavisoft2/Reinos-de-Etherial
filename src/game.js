"use strict";
const canvas=document.getElementById("game"),ctx=canvas.getContext("2d");ctx.imageSmoothingEnabled=false;
const W=2400,H=1600,keys=new Set();
const player={x:520,y:650,r:13,speed:210,hp:100,mp:60,level:1,xp:0,gold:25,attack:16};
const enemies=[
 {x:820,y:650,r:15,hp:42,maxHp:42,type:"Slime",xp:18,gold:5},
 {x:930,y:730,r:16,hp:55,maxHp:55,type:"Lobo",xp:25,gold:8},
 {x:1050,y:590,r:17,hp:70,maxHp:70,type:"Goblin",xp:32,gold:12}
];
const solids=[
 {x:330,y:250,w:300,h:180},{x:690,y:270,w:230,h:150},
 {x:350,y:790,w:220,h:150},{x:690,y:800,w:260,h:160},
 {x:495,y:495,w:90,h:90}
];
let cam={x:0,y:0},last=performance.now(),attackFlash=0;
function hitSolid(x,y){return solids.some(o=>x+player.r>o.x&&x-player.r<o.x+o.w&&y+player.r>o.y&&y-player.r<o.y+o.h)}
function move(dt){let dx=(keys.has("d")||keys.has("arrowright")?1:0)-(keys.has("a")||keys.has("arrowleft")?1:0),dy=(keys.has("s")||keys.has("arrowdown")?1:0)-(keys.has("w")||keys.has("arrowup")?1:0);if(!dx&&!dy)return;const l=Math.hypot(dx,dy);dx=dx/l*player.speed*dt;dy=dy/l*player.speed*dt;let nx=Math.max(player.r,Math.min(W-player.r,player.x+dx));if(!hitSolid(nx,player.y))player.x=nx;let ny=Math.max(player.r,Math.min(H-player.r,player.y+dy));if(!hitSolid(player.x,ny))player.y=ny}
function attack(){attackFlash=.14;let best=null,dist=70;for(const e of enemies){if(e.hp<=0)continue;const d=Math.hypot(e.x-player.x,e.y-player.y);if(d<dist){best=e;dist=d}}if(best){best.hp-=player.attack;if(best.hp<=0){player.xp+=best.xp;player.gold+=best.gold;if(player.xp>=100){player.xp-=100;player.level++;player.hp=100}setTimeout(()=>best.hp=best.maxHp,4500)}updateHud()}}
function updateHud(){hp.value=player.hp;mp.value=player.mp;xp.value=player.xp;level.textContent=player.level;gold.textContent=player.gold}
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x-cam.x),Math.round(y-cam.y),w,h)}
function drawWorld(){rect(0,0,W,H,"#4b7136");rect(0,610,W,130,"#aa9565");rect(480,0,130,H,"#aa9565");rect(280,200,720,820,"#65804a");for(const o of solids)rect(o.x,o.y,o.w,o.h,"#66533c");rect(500,500,80,80,"#527b86");for(let x=90;x<W;x+=180)for(let y=100;y<H;y+=190){if(x>260&&x<1020&&y>180&&y<1050)continue;rect(x-14,y-22,28,44,"#5a3b25");ctx.fillStyle="#244c2c";ctx.beginPath();ctx.arc(x-cam.x,y-35-cam.y,32,0,Math.PI*2);ctx.fill()}}
function drawActors(){for(const e of enemies){if(e.hp<=0)continue;ctx.fillStyle=e.type==="Slime"?"#78b54a":e.type==="Lobo"?"#777":"#6b8b45";ctx.beginPath();ctx.arc(e.x-cam.x,e.y-cam.y,e.r,0,Math.PI*2);ctx.fill();rect(e.x-22,e.y-30,44,5,"#321");rect(e.x-22,e.y-30,44*(e.hp/e.maxHp),5,"#b44");ctx.fillStyle="#fff";ctx.font="12px monospace";ctx.textAlign="center";ctx.fillText(e.type,e.x-cam.x,e.y-cam.y-36)}ctx.fillStyle=attackFlash>0?"#fff0a8":"#4ea4d8";ctx.beginPath();ctx.arc(player.x-cam.x,player.y-cam.y,player.r,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.font="bold 12px monospace";ctx.fillText("Héroe",player.x-cam.x,player.y-cam.y-22)}
function render(){cam.x=Math.max(0,Math.min(W-canvas.width,player.x-canvas.width/2));cam.y=Math.max(0,Math.min(H-canvas.height,player.y-canvas.height/2));ctx.clearRect(0,0,canvas.width,canvas.height);drawWorld();drawActors()}
function loop(t){const dt=Math.min(.04,(t-last)/1000);last=t;move(dt);attackFlash=Math.max(0,attackFlash-dt);render();requestAnimationFrame(loop)}
addEventListener("keydown",e=>{const k=e.key.toLowerCase();keys.add(k);if(k===" ")attack()});addEventListener("keyup",e=>keys.delete(e.key.toLowerCase()));
document.querySelectorAll("[data-skill]").forEach(b=>b.addEventListener("click",attack));
updateHud();requestAnimationFrame(loop);
