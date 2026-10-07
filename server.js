require('dotenv').config();
const http=require("http"),fs=require("fs"),path=require("path"),crypto=require("crypto");
const PORT=process.env.PORT||3000, SECRET=process.env.FLW_SECRET_KEY;
const ROOT=__dirname, ORDERS=path.join(ROOT,"orders.json");
const products={
r1tee:["Release 01 — Graphic Tee",28000],r1jog:["Release 01 — Baggy Joggers",38000],
r2long:["Release 02 — Long Sleeve",36000],r2jort:["Release 02 — Baggy Jorts",42000],
r3hood:["Release 03 — Hoodie",52000],r3jean:["Release 03 — Baggy Jeans",48000],
r4set:["Release 04 — Track Suit",85000],r5set:["Release 05 — Hoodie + Cargo Denim",90000],
r6jersey:["Release 06 — Baggy Jersey",45000],r6sock:["Release 06 — Signature Socks",12000],
r6beanie:["Release 06 — Beanie",15000],r6mask:["Release 06 — Ski Mask",18000]};
function json(res,code,data){res.writeHead(code,{"Content-Type":"application/json"});res.end(JSON.stringify(data))}
function readBody(req){return new Promise((resolve,reject)=>{let b="";req.on("data",c=>b+=c);req.on("end",()=>{try{resolve(JSON.parse(b||"{}"))}catch(e){reject(e)}})})}
async function checkout(req,res){
 if(!SECRET)return json(res,500,{error:"Payment is not configured yet. Add PAYSTACK_SECRET_KEY on the server."});
 const body=await readBody(req), c=body.customer||{}, items=Array.isArray(body.items)?body.items:[];
 if(!c.name||!c.email||!c.phone||!c.address||!c.city||!items.length)return json(res,400,{error:"Missing order details."});
 let total=0, clean=[];
 for(const item of items){const p=products[item.id];if(!p)return json(res,400,{error:"Invalid product."});if(!["S","M","L","XL","XXL"].includes(item.size))return json(res,400,{error:"Invalid size."});total+=p[1];clean.push({id:item.id,name:p[0],price:p[1],size:item.size})}
 const reference="MS_"+Date.now()+"_"+crypto.randomBytes(4).toString("hex");
 const pay=await fetch("https://api.paystack.co/transaction/initialize",{method:"POST",headers:{"Authorization":"Bearer "+SECRET,"Content-Type":"application/json"},body:JSON.stringify({email:c.email,amount:total*100,reference,metadata:{name:c.name,phone:c.phone,address:c.address,city:c.city,items:clean}})});
 const d=await pay.json();if(!pay.ok||!d.status)return json(res,502,{error:"Flutterwave could not initialize the payment.",details:d});
 let orders=[];try{orders=JSON.parse(fs.readFileSync(ORDERS,"utf8"))}catch{}
 orders.push({reference,status:"pending",customer:c,items:clean,totalNaira:total,createdAt:new Date().toISOString()});fs.writeFileSync(ORDERS,JSON.stringify(orders,null,2));
 json(res,200,{authorization_url:d.data.authorization_url,reference});
}
function serve(req,res){
 let u=new URL(req.url,"http://localhost"), file=u.pathname==="/"?"index.html":u.pathname.slice(1);
 const safe=path.join(ROOT,file);if(!safe.startsWith(ROOT)){res.writeHead(403);return res.end()}
 fs.readFile(safe,(e,data)=>{if(e){res.writeHead(404);return res.end("Not found")}let ext=path.extname(safe),type={".html":"text/html",".css":"text/css",".js":"text/javascript",".json":"application/json"}[ext]||"application/octet-stream";res.writeHead(200,{"Content-Type":type});res.end(data)})
}
const s=http.createServer(async(req,res)=>{try{if(req.method==="POST"&&req.url==="/api/checkout")return await checkout(req,res);if(req.method==="GET")return serve(req,res);res.writeHead(405);res.end()}catch(e){console.error(e);json(res,500,{error:"Server error."})}});
s.listen(PORT,()=>console.log("Motion+Swagg store running on http://localhost:"+PORT));