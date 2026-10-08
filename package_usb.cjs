process.on('uncaughtException',e=>{console.log(e.stack);process.exitCode=1});
const fs=require('fs'),path=require('path');
const out=path.resolve('U盘分享版');fs.mkdirSync(out,{recursive:true});
let html=fs.readFileSync('dist/index.html','utf8');
// Portable edition never attempts to contact a compiler bridge or remote service.
html=html.replace(/const bridge=await fetch\("http:\/\/127\.0\.0\.1:8766\/compile",\{[\s\S]*?body:JSON\.stringify\(\{source\}\)\}\);/,'throw new Error("U盘版使用浏览器教学仿真");');
html=html.replace('版本 v36','版本 v36 · U盘离线版');
html=html.replace(/\$\("#tx1CompileStatus"\)\.textContent="浏览器教学仿真通过：未连接本机 Keil C51；如需真实编译请启动 Keil 桥接器。";/,'$("#tx1CompileStatus").textContent="U盘版浏览器教学仿真通过。此功能不生成真实 HEX，实物编译下载请使用 Keil。";');
html=html.replace("showPage('learn');","showPage('arena');");
const missing=[];for(const m of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)){const ref=m[1];if(/^(?:data:|https?:|#)/.test(ref)||ref.includes('${'))continue;if(!fs.existsSync(path.join('dist',ref)))missing.push(ref)}
if(missing.length)throw Error('Missing resources: '+missing.join(','));
for(const m of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))new Function(m[1]);
if(/fetch\(/.test(html))throw Error('Unexpected network request in USB edition');
fs.writeFileSync(path.join(out,'index.html'),html);fs.cpSync('dist/assets',path.join(out,'assets'),{recursive:true});fs.copyFileSync('dist/夜夜班校徽.png',path.join(out,'夜夜班校徽.png'));
const mime={'.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const embedded=html.replace(/(?:src|href)=["']([^"']+)["']/g,(attr,ref)=>{const p=path.join('dist',ref);if(!mime[path.extname(ref)]||!fs.existsSync(p))return attr;return attr.replace(ref,'data:'+mime[path.extname(ref)]+';base64,'+fs.readFileSync(p).toString('base64'))});
fs.writeFileSync('夜夜班进制练习-U盘单文件版-v36.html',embedded);
fs.writeFileSync(path.join(out,'开始使用.html'),'<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=index.html"><title>开始使用</title><a href="index.html">点击打开 8421 拼数小花园</a></html>');
fs.writeFileSync(path.join(out,'学生使用说明.txt'),'夜夜班进制转换练习 · U盘离线分享版 v36\r\n\r\n1. 请先解压整个文件夹，不要在压缩包里直接运行。\r\n2. 双击“开始使用.html”或“index.html”，用 Edge、Chrome 等浏览器打开。\r\n3. 无需安装、登录或联网。默认进入8421拼数小游戏，顶部可切换其他教学页面。\r\n4. 十进制题目为0～15；点击8、4、2、1拼数，选中为1，未选中为0。\r\n5. 所有模式不限时；提示后本题不计花朵。\r\n6. 累计花朵保存在这台电脑的当前浏览器，换电脑/浏览器不会带走进度。浏览器禁用本地存储时仍能游玩，但进度不保存。\r\n7. assets 文件夹与校徽必须和index.html一起保留。也可把整个文件夹复制到电脑再打开。\r\n8. 代码/开发板模块属于教学仿真，U盘版不连接本机编译服务、不生成真实HEX。真实开发板编译下载请使用Keil/STC-ISP。\r\n');
console.log(JSON.stringify({directory:out,missingResources:missing,networkRequests:0,scripts:'syntax passed'},null,2));
