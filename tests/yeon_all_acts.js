const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1280,height:720}});
const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push('console: '+m.text())});
await pg.goto('file://'+process.cwd()+'/index.html');await pg.evaluate(()=>{localStorage.clear();localStorage.setItem('bd_char','yeon')});await pg.reload();await pg.waitForTimeout(300);
await pg.evaluate(()=>__bd.begin());await pg.waitForTimeout(300);
const r=await pg.evaluate(()=>{const out=[];const names=Object.keys(__bd.ACT);__bd.hold(true);
  for(const map of ['dojo','field']){__bd.setMap(map);__bd.adv(.3);
  for(const n of names){__bd.p.x=0;__bd.p.y=0;__bd.dummy.x=160;__bd.adv(.2);try{__bd.startAct(n);__bd.adv(2.5);}catch(e){out.push(n+':'+e.message);}
    const J=__bd.p.J;for(const k in J){if(!isFinite(J[k][0])||!isFinite(J[k][1])){out.push(n+' nonfinite '+k);break;}}}}
  // switch mid-action and back
  __bd.startAct('DASH');__bd.adv(.05);__bd.setChar('musa');__bd.adv(.5);__bd.setChar('yeon');__bd.adv(.5);
  return out;});
console.log('acts issues',r.length?r:'none');
// idle foot / blade ground check for yeon
const low=await pg.evaluate(()=>{__bd.p.x=0;__bd.adv(1);let m=-1e9;for(let i=0;i<600;i++){__bd.adv(1/60);const J=__bd.p.J;m=Math.max(m,J.st[1],J.tF[1],J.tB[1]);}return m.toFixed(2);});
console.log('lowest point over 10s idle (<=0 ok):',low);
console.log('ERR',errs.slice(0,5).join('\n'));await b.close();})();
