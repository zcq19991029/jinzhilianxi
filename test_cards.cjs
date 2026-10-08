const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=[...fs.readFileSync('index.html','utf8').matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].at(-1)[1],els={};
const el=id=>els[id]||(els[id]={value:id==='bgDirection'?'bin-dec':'',textContent:'',disabled:false,hidden:false,innerHTML:'',click(){if(!this.disabled)this.onclick?.()}});
const tiles=[8,4,2,1].map(w=>({dataset:{weight:String(w)},parentNode:{appendChild(){}},setAttribute(){},querySelector(){return{}},addEventListener(k,f){this.onclick=f},click(){this.onclick()}}));
vm.runInNewContext(code,{document:{getElementById:el,querySelectorAll:()=>tiles,addEventListener(){}},localStorage:{getItem(){return'0'},setItem(){}},Set,Number,Math,Array,String});
for(let n=0;n<16;n++){const original=el('bgTarget').textContent,target=parseInt(original,2);for(const t of tiles)if(target&Number(t.dataset.weight))t.click();if(!target){tiles[3].click();tiles[3].click()}assert.equal(Number(el('bgDecimal').value),target);assert.equal(el('bgTarget').textContent,original);assert(el('bgEquation').textContent.includes(' = '+target));el('bgCheck').click();assert.equal(el('bgFeedback').className,'bg-good')}
console.log('PASS: all 16 binary questions, clickable cards, sum and answer sync, original question preserved');
