// Registers images dropped into uploads/formulas/<subjectNumber>/ in data/library.json.
// Subject numbers start at 0 (0 = first subject on the Syllabus tab). Run: node tools/scan-images.js
const fs=require("fs"),path=require("path");
const root=path.join(__dirname,"..");
const lib=path.join(root,"data/library.json");
const j=fs.existsSync(lib)?JSON.parse(fs.readFileSync(lib,"utf8")):{v:1,items:[]};
const have=new Set(j.items.map(x=>x.path));
const base=path.join(root,"uploads/formulas");
let n=0;
for(const d of fs.existsSync(base)?fs.readdirSync(base):[]){
  const dir=path.join(base,d);
  if(!fs.statSync(dir).isDirectory()||isNaN(+d))continue;
  for(const f of fs.readdirSync(dir)){
    if(!/\.(jpe?g|png|webp)$/i.test(f))continue;
    const p="uploads/formulas/"+d+"/"+f;
    if(have.has(p))continue;
    j.items.push({id:Date.now().toString(36)+(n++).toString(36),sub:+d,title:f.replace(/\.[^.]+$/,""),path:p,t:new Date().toISOString().slice(0,10)});
  }
}
fs.mkdirSync(path.dirname(lib),{recursive:true});
fs.writeFileSync(lib,JSON.stringify(j,null,1));
console.log("Added "+n+" image(s). Now run push.bat (Windows) or ./push.sh");
