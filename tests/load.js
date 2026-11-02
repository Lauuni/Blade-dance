const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const pg=await b.newPage();
pg.on('pageerror',e=>console.log('ERR',e.message,e.stack&&e.stack.split('\n')[1]));await pg.goto('file://'+process.cwd()+'/index.html');await pg.waitForTimeout(500);await b.close();})();
