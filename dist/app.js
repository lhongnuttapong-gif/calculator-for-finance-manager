const calculators={
  npv:{title:'Net Present Value (NPV)',subtitle:'ประเมินมูลค่าปัจจุบันของกระแสเงินสดในอนาคตหลังหักเงินลงทุนเริ่มต้น',fields:[
    {id:'investment',label:'เงินลงทุนเริ่มต้น',type:'number',value:1000000,suffix:'฿',min:0},
    {id:'rate',label:'อัตราคิดลดต่อปี',type:'number',value:10,suffix:'%',min:-99.99,step:'0.01'},
    {id:'cashflows',label:'กระแสเงินสดแต่ละปี',type:'textarea',value:'300000, 350000, 400000, 450000',hint:'คั่นแต่ละปีด้วยเครื่องหมายจุลภาค เช่น 300000, 350000',full:true}]},
  irr:{title:'Internal Rate of Return (IRR)',subtitle:'หาอัตราผลตอบแทนที่ทำให้มูลค่าปัจจุบันสุทธิของโครงการเท่ากับศูนย์',fields:[
    {id:'cashflows',label:'กระแสเงินสดตั้งแต่ปีที่ 0',type:'textarea',value:'-1000000, 300000, 350000, 400000, 450000',hint:'ปีที่ 0 ควรเป็นเงินลงทุนติดลบ และคั่นแต่ละงวดด้วยจุลภาค',full:true}]},
  breakeven:{title:'Break-even Point',subtitle:'คำนวณยอดขายขั้นต่ำที่ทำให้รายได้รวมเท่ากับต้นทุนรวม',fields:[
    {id:'fixedCost',label:'ต้นทุนคงที่',type:'number',value:500000,suffix:'฿',min:0},{id:'price',label:'ราคาขายต่อหน่วย',type:'number',value:250,suffix:'฿',min:0},{id:'variableCost',label:'ต้นทุนผันแปรต่อหน่วย',type:'number',value:150,suffix:'฿',min:0}]},
  loan:{title:'Loan Calculation',subtitle:'ประมาณค่างวดชำระรายเดือนและดอกเบี้ยรวมตลอดอายุสินเชื่อ',fields:[
    {id:'principal',label:'วงเงินกู้',type:'number',value:3000000,suffix:'฿',min:0},{id:'annualRate',label:'อัตราดอกเบี้ยต่อปี',type:'number',value:6.5,suffix:'%',min:0,step:'0.01'},{id:'years',label:'ระยะเวลากู้',type:'number',value:10,suffix:'ปี',min:0,step:'1'}]},
  ratio:{title:'Financial Ratio',subtitle:'วิเคราะห์อัตราส่วนสำคัญเพื่อดูสภาพคล่อง โครงสร้างทุน และความสามารถทำกำไร',fields:[
    {id:'ratioType',label:'อัตราส่วนที่ต้องการ',type:'select',value:'current',full:true,options:[['current','Current Ratio'],['debtEquity','Debt to Equity'],['grossMargin','Gross Profit Margin'],['roa','Return on Assets (ROA)']]}]}
};
const ratioFields={
  current:[{id:'a',label:'สินทรัพย์หมุนเวียน',value:2500000,suffix:'฿'},{id:'b',label:'หนี้สินหมุนเวียน',value:1250000,suffix:'฿'}],
  debtEquity:[{id:'a',label:'หนี้สินรวม',value:4000000,suffix:'฿'},{id:'b',label:'ส่วนของผู้ถือหุ้น',value:5000000,suffix:'฿'}],
  grossMargin:[{id:'a',label:'กำไรขั้นต้น',value:1800000,suffix:'฿'},{id:'b',label:'รายได้จากการขาย',value:6000000,suffix:'฿'}],
  roa:[{id:'a',label:'กำไรสุทธิ',value:750000,suffix:'฿'},{id:'b',label:'สินทรัพย์รวมเฉลี่ย',value:10000000,suffix:'฿'}]
};
let activeCalc='npv';
const form=document.getElementById('calculatorForm'),fieldsEl=document.getElementById('fields'),errorBox=document.getElementById('errorBox');
const money=new Intl.NumberFormat('th-TH',{style:'currency',currency:'THB',maximumFractionDigits:2});
const number=new Intl.NumberFormat('th-TH',{maximumFractionDigits:2});

function fieldMarkup(f){
  const full=f.full?' full':'';
  if(f.type==='textarea')return `<div class="field${full}"><label for="${f.id}">${f.label}<span class="hint">${f.hint||''}</span></label><textarea id="${f.id}" name="${f.id}">${f.value}</textarea></div>`;
  if(f.type==='select')return `<div class="field${full}"><label for="${f.id}">${f.label}</label><select id="${f.id}" name="${f.id}">${f.options.map(o=>`<option value="${o[0]}" ${o[0]===f.value?'selected':''}>${o[1]}</option>`).join('')}</select></div>`;
  return `<div class="field${full}"><label for="${f.id}">${f.label}</label><div class="input-wrap"><input class="${f.suffix?'has-suffix':''}" id="${f.id}" name="${f.id}" type="number" inputmode="decimal" value="${f.value}" ${f.min!==undefined?`min="${f.min}"`:''} step="${f.step||'any'}" />${f.suffix?`<span class="suffix">${f.suffix}</span>`:''}</div></div>`;
}
function renderFields(){
  const config=calculators[activeCalc];
  document.getElementById('pageTitle').textContent=config.title;document.getElementById('pageSubtitle').textContent=config.subtitle;
  fieldsEl.innerHTML=config.fields.map(fieldMarkup).join('');
  if(activeCalc==='ratio'){document.getElementById('ratioType').addEventListener('change',renderRatioInputs);renderRatioInputs();}
  errorBox.classList.remove('show');calculate();
}
function renderRatioInputs(){
  fieldsEl.querySelectorAll('[data-ratio-input]').forEach(el=>el.remove());
  const selected=document.getElementById('ratioType').value;
  fieldsEl.insertAdjacentHTML('beforeend',ratioFields[selected].map(f=>`<div class="field" data-ratio-input><label for="${f.id}">${f.label}</label><div class="input-wrap"><input class="has-suffix" id="${f.id}" name="${f.id}" type="number" inputmode="decimal" min="0" step="any" value="${f.value}" /><span class="suffix">${f.suffix}</span></div></div>`).join(''));
  calculate();
}
function numeric(id,label){const el=document.getElementById(id),value=el?Number(el.value):NaN;if(!Number.isFinite(value)||el.value.trim()==='')throw new Error(`กรุณากรอก “${label}” ให้เป็นตัวเลขที่ถูกต้อง`);return value;}
function cashflows(id){const raw=document.getElementById(id).value.trim();if(!raw)throw new Error('กรุณากรอกกระแสเงินสดอย่างน้อย 1 งวด');const values=raw.split(',').map(v=>Number(v.trim()));if(values.some(v=>!Number.isFinite(v)))throw new Error('กระแสเงินสดต้องเป็นตัวเลขและคั่นแต่ละงวดด้วยเครื่องหมายจุลภาค');return values;}
function findIrr(values){
  const npvAt=r=>values.reduce((sum,cf,i)=>sum+cf/Math.pow(1+r,i),0);let low=-.9999,high=10,fLow=npvAt(low),fHigh=npvAt(high);
  if(fLow*fHigh>0)throw new Error('ไม่สามารถหา IRR จากชุดกระแสเงินสดนี้ได้ กรุณาตรวจสอบว่ามีทั้งเงินสดรับและเงินสดจ่าย');
  for(let i=0;i<200;i++){const mid=(low+high)/2,fMid=npvAt(mid);if(Math.abs(fMid)<1e-8)return mid;if(fLow*fMid<=0){high=mid;fHigh=fMid}else{low=mid;fLow=fMid}}
  return (low+high)/2;
}
function result(label,value,secondary,status,formula,interpretation){
  document.getElementById('resultLabel').textContent=label;document.getElementById('resultValue').textContent=value;document.getElementById('resultSecondary').textContent=secondary;document.getElementById('statusChip').textContent=status;document.getElementById('formulaText').textContent=formula;document.getElementById('interpretation').textContent=interpretation;
}
function calculate(){
  errorBox.classList.remove('show');
  try{
    if(activeCalc==='npv'){
      const investment=numeric('investment','เงินลงทุนเริ่มต้น'),rate=numeric('rate','อัตราคิดลด')/100;if(investment<0||rate<=-1)throw new Error('เงินลงทุนต้องไม่ติดลบ และอัตราคิดลดต้องมากกว่า -100%');
      const flows=cashflows('cashflows'),value=flows.reduce((sum,cf,i)=>sum+cf/Math.pow(1+rate,i+1),0)-investment;
      result('มูลค่าปัจจุบันสุทธิ',money.format(value),`จากเงินลงทุนเริ่มต้น ${money.format(investment)}`,value>=0?'โครงการสร้างมูลค่าเพิ่ม':'ควรทบทวนความคุ้มค่า','NPV = Σ [CFₜ ÷ (1 + r)ᵗ] − Initial Investment',value>=0?'NPV เป็นบวก แสดงว่าผลตอบแทนที่คาดว่าจะได้รับสูงกว่าต้นทุนเงินทุนตามอัตราคิดลดที่กำหนด':'NPV เป็นลบ แสดงว่าผลตอบแทนที่คาดไว้อาจยังไม่ครอบคลุมต้นทุนเงินทุนตามอัตราคิดลดที่กำหนด');
    }else if(activeCalc==='irr'){
      const flows=cashflows('cashflows');if(!flows.some(v=>v<0)||!flows.some(v=>v>0))throw new Error('การคำนวณ IRR ต้องมีกระแสเงินสดทั้งค่าติดลบและค่าบวก');const value=findIrr(flows)*100;
      result('อัตราผลตอบแทนภายใน',`${number.format(value)}%`,`คำนวณจากกระแสเงินสด ${flows.length} งวด`,'ใช้เปรียบเทียบกับต้นทุนเงินทุน','0 = Σ [CFₜ ÷ (1 + IRR)ᵗ]','IRR คืออัตราผลตอบแทนที่ทำให้ NPV เท่ากับศูนย์ หาก IRR สูงกว่าต้นทุนเงินทุนหรืออัตราผลตอบแทนขั้นต่ำ โครงการมีแนวโน้มน่าสนใจ');
    }else if(activeCalc==='breakeven'){
      const fixed=numeric('fixedCost','ต้นทุนคงที่'),price=numeric('price','ราคาขายต่อหน่วย'),variable=numeric('variableCost','ต้นทุนผันแปรต่อหน่วย');if(fixed<0||price<=0||variable<0)throw new Error('ต้นทุนต้องไม่ติดลบ และราคาขายต้องมากกว่าศูนย์');if(price<=variable)throw new Error('ราคาขายต่อหน่วยต้องสูงกว่าต้นทุนผันแปรต่อหน่วย');
      const units=fixed/(price-variable),sales=Math.ceil(units)*price;result('จุดคุ้มทุน',`${number.format(Math.ceil(units))} หน่วย`,`คิดเป็นยอดขายประมาณ ${money.format(sales)}`,'ยอดขายขั้นต่ำเพื่อไม่ขาดทุน','Break-even Units = Fixed Cost ÷ (Price − Variable Cost)',`ธุรกิจต้องขายอย่างน้อย ${number.format(Math.ceil(units))} หน่วย จึงจะมีรายได้ครอบคลุมต้นทุนคงที่และต้นทุนผันแปรทั้งหมด`);
    }else if(activeCalc==='loan'){
      const principal=numeric('principal','วงเงินกู้'),annualRate=numeric('annualRate','อัตราดอกเบี้ย'),years=numeric('years','ระยะเวลากู้');if(principal<=0||annualRate<0||years<=0)throw new Error('วงเงินกู้และระยะเวลาต้องมากกว่าศูนย์ และอัตราดอกเบี้ยต้องไม่ติดลบ');
      const n=Math.round(years*12),r=annualRate/100/12,payment=r===0?principal/n:principal*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1),total=payment*n,interest=total-principal;
      result('ค่างวดต่อเดือน',money.format(payment),`ดอกเบี้ยรวมประมาณ ${money.format(interest)}`,`${number.format(n)} งวด · ยอดชำระรวม ${money.format(total)}`,'PMT = P × [r(1 + r)ⁿ] ÷ [(1 + r)ⁿ − 1]',`ต้องชำระประมาณ ${money.format(payment)} ต่อเดือนตลอด ${number.format(n)} งวด โดยสมมติว่าอัตราดอกเบี้ยคงที่และชำระตรงเวลาทุกงวด`);
    }else{
      const type=document.getElementById('ratioType').value,a=numeric('a',ratioFields[type][0].label),b=numeric('b',ratioFields[type][1].label);if(a<0||b<=0)throw new Error('ตัวตั้งต้องไม่ติดลบ และตัวหารต้องมากกว่าศูนย์');const ratio=a/b;
      const configs={
        current:['Current Ratio',`${number.format(ratio)} เท่า`,'สภาพคล่องระยะสั้น','Current Ratio = Current Assets ÷ Current Liabilities',ratio>=1?'กิจการมีสินทรัพย์หมุนเวียนเพียงพอครอบคลุมหนี้สินหมุนเวียนในเชิงตัวเลข ควรพิจารณาคุณภาพของสินทรัพย์ร่วมด้วย':'สินทรัพย์หมุนเวียนต่ำกว่าหนี้สินหมุนเวียน อาจมีความเสี่ยงด้านสภาพคล่องระยะสั้น'],
        debtEquity:['Debt to Equity',`${number.format(ratio)} เท่า`,'โครงสร้างเงินทุน','D/E = Total Liabilities ÷ Shareholders’ Equity',`ทุกส่วนของทุน 1 บาท รองรับหนี้สินประมาณ ${number.format(ratio)} บาท ควรเปรียบเทียบกับค่าเฉลี่ยของอุตสาหกรรม`],
        grossMargin:['Gross Profit Margin',`${number.format(ratio*100)}%`,'ความสามารถทำกำไรขั้นต้น','Gross Margin = Gross Profit ÷ Revenue × 100',`กิจการมีกำไรขั้นต้น ${number.format(ratio*100)} บาทต่อรายได้ทุก 100 บาท ก่อนหักค่าใช้จ่ายดำเนินงาน ดอกเบี้ย และภาษี`],
        roa:['Return on Assets',`${number.format(ratio*100)}%`,'ประสิทธิภาพการใช้สินทรัพย์','ROA = Net Profit ÷ Average Total Assets × 100',`สินทรัพย์เฉลี่ยทุก 100 บาทสร้างกำไรสุทธิประมาณ ${number.format(ratio*100)} บาท ควรเทียบกับผลย้อนหลังและธุรกิจในกลุ่มเดียวกัน`]
      },c=configs[type];result(c[0],c[1],`คำนวณจากฐาน ${money.format(b)}`,c[2],c[3],c[4]);
    }
    return {calculator:activeCalc,value:document.getElementById('resultValue').textContent,status:document.getElementById('statusChip').textContent};
  }catch(error){errorBox.textContent=error.message;errorBox.classList.add('show');return {calculator:activeCalc,error:error.message};}
}
document.querySelectorAll('.nav-item').forEach(button=>button.addEventListener('click',()=>{activeCalc=button.dataset.calc;document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b===button));renderFields();}));
form.addEventListener('submit',event=>{event.preventDefault();calculate();});document.getElementById('resetButton').addEventListener('click',renderFields);
function registerWebMCP(){
  const context=document.modelContext;if(!context?.registerTool)return;
  try{void Promise.resolve(context.registerTool({name:'calculate_financial_metric',title:'คำนวณตัวเลขทางการเงิน',description:'เลือกเครื่องคิดเลข กรอกข้อมูลในหน้าจอ และคำนวณผลลัพธ์ที่แสดงอยู่',inputSchema:{type:'object',properties:{calculator:{type:'string',enum:['npv','irr','breakeven','loan','ratio']},values:{type:'object'}},required:['calculator','values'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!calculators[input.calculator]||!input.values||typeof input.values!=='object')throw new Error('ข้อมูลการคำนวณไม่ถูกต้อง');activeCalc=input.calculator;document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.calc===activeCalc));renderFields();Object.entries(input.values).forEach(([id,value])=>{const el=document.getElementById(id);if(el){el.value=String(value);if(id==='ratioType')renderRatioInputs();}});return calculate();}})).catch(()=>{});}catch(_){}
}
renderFields();registerWebMCP();
