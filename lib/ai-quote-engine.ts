export type QuoteItem = {
  id: string;
  name: string;
  category: string;
  dimensions: string;
  material: string;
  qty: number;
  unit: string;
  unitPrice: number;
  amount: number;
  note?: string;
};

export type QuoteState = {
  code: string;
  customer: string;
  items: QuoteItem[];
  discountPercent: number;
  vatPercent: number;
};

const prices: Record<string, number> = {
  "MDF chống ẩm Melamine": 3200000,
  "MDF thường Melamine": 2900000,
  "Plywood": 5200000,
  "Mặt đá": 1800000,
  "Kính bếp": 850000,
  "LED": 250000,
  "Ghế": 1200000,
  "Bàn": 3500000,
};

const money = (n: number) => Math.round(n / 1000) * 1000;

function priceFor(name: string, material: string, lengthMm = 0) {
  if (name === "Bếp") {
    const base = material === "MDF chống ẩm Melamine" ? prices[material] : prices["MDF thường Melamine"];
    return money(base * Math.max(lengthMm / 3500, 0.5));
  }
  if (name === "Bàn") return material.includes("MDF") ? 3500000 : prices["Plywood"];
  if (name === "Ghế") return prices["Ghế"];
  return prices[name] ?? 1000000;
}

export function parseRequest(input: string, customer = "Khách hàng"): QuoteState {
  const text = input.toLowerCase();
  const items: QuoteItem[] = [];
  const mm = (input.match(/(?:bếp|bàn).*?(\d+(?:[.,]\d+)?)\s*m(?:\s*\d+)?/i)?.[1]);
  const kitchenLength = text.includes("bếp") ? (mm ? Number(mm.replace(",", ".")) * 1000 : 3500) : 0;
  const material = text.includes("plywood")
    ? "Plywood"
    : text.includes("mdf thường")
      ? "MDF thường Melamine"
      : "MDF chống ẩm Melamine";

  if (text.includes("bếp")) {
    const length = kitchenLength;
    const lower = priceFor("Bếp", material, length) * 0.55;
    const upper = priceFor("Bếp", material, length) * 0.28;
    items.push({id:"kitchen-lower",name:"Tủ bếp dưới",category:"Nội thất",dimensions:`${length} × cao 850mm`,material,qty:1,unit:"md",unitPrice:lower,amount:lower});
    items.push({id:"kitchen-upper",name:"Tủ bếp trên",category:"Nội thất",dimensions:`${length} × cao 800mm`,material,qty:1,unit:"md",unitPrice:upper,amount:upper});
    if (text.includes("đá")) items.push({id:"stone",name:"Mặt đá",category:"Mặt đá",dimensions:`${(length/1000).toFixed(2)} md`,material:"Đá",qty:1,unit:"md",unitPrice:prices["Mặt đá"],amount:money(prices["Mặt đá"]*length/1000)});
    if (text.includes("kính")) items.push({id:"glass",name:"Kính bếp",category:"Kính",dimensions:`${(length/1000).toFixed(2)} md`,material:"Kính",qty:1,unit:"md",unitPrice:prices["Kính bếp"],amount:money(prices["Kính bếp"]*length/1000)});
    if (text.includes("led") || text.includes("đèn")) items.push({id:"led",name:"LED",category:"Điện",dimensions:`${(length/1000).toFixed(2)} md`,material:"LED",qty:1,unit:"md",unitPrice:prices["LED"],amount:money(prices["LED"]*length/1000)});
  }
  if (text.includes("bàn")) {
    const price = priceFor("Bàn", material);
    items.push({id:"table",name:"Bàn",category:"Nội thất",dimensions:"1400 × 600 × 750mm",material,qty:1,unit:"cái",unitPrice:price,amount:price});
  }
  if (text.includes("ghế")) {
    const price = prices["Ghế"];
    items.push({id:"chair",name:"Ghế",category:"Nội thất",dimensions:"Tiêu chuẩn",material:"Theo mẫu",qty:1,unit:"cái",unitPrice:price,amount:price});
  }
  if (!items.length) {
    items.push({id:"custom",name:"Hạng mục mới",category:"Nội thất",dimensions:"Chưa xác định",material,qty:1,unit:"cái",unitPrice:0,amount:0,note:"AI cần thêm kích thước/vật liệu để tính chính xác"});
  }
  return {code:`QT-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,customer,items,discountPercent:0,vatPercent:10};
}

export function recalc(q: QuoteState): QuoteState {
  return {...q,items:q.items.map(i=>({...i,amount:money(i.qty*i.unitPrice)}))};
}

export function totals(q: QuoteState) {
  const subtotal = q.items.reduce((s,i)=>s+i.amount,0);
  const discount = money(subtotal*q.discountPercent/100);
  const taxable = subtotal-discount;
  const vat = money(taxable*q.vatPercent/100);
  return {subtotal,discount,vat,total:taxable+vat};
}

export function applyChat(q: QuoteState, message: string): {quote: QuoteState; reply: string} {
  const m=message.toLowerCase();
  let next={...q,items:q.items.map(i=>({...i}))};
  const lengthMatch=message.match(/(\d+(?:[.,]\d+)?)\s*m\b/i);
  if ((m.includes("bếp") || m.includes("cái này")) && lengthMatch) {
    const length=Number(lengthMatch[1].replace(",", "."))*1000;
    next.items=next.items.map(i=>i.name.includes("Tủ bếp")?{...i,dimensions:`${length} × ${i.name.includes("dưới")?"cao 850":"cao 800"}mm`,unitPrice:priceFor("Bếp",i.material,length)* (i.name.includes("dưới")?.55:.28)}:i);
    return {quote:recalc(next),reply:`Đã đổi chiều dài bếp thành ${length}mm và tính lại báo giá.`};
  }
  if (m.includes("plywood")) {
    next.items=next.items.map(i=>({...i,material:"Plywood",unitPrice:priceFor(i.name==="Bàn"?"Bàn":"Bếp","Plywood",3500)}));
    return {quote:recalc(next),reply:"Đã đổi vật liệu sang Plywood và tính lại."};
  }
  if (m.includes("mdf chống ẩm")) {
    next.items=next.items.map(i=>({...i,material:"MDF chống ẩm Melamine",unitPrice:priceFor(i.name==="Bàn"?"Bàn":"Bếp","MDF chống ẩm Melamine",3500)}));
    return {quote:recalc(next),reply:"Đã đổi sang MDF chống ẩm Melamine và tính lại."};
  }
  if (m.includes("thêm") && m.includes("ray")) {
    const qty=Number(message.match(/\d+/)?.[0]||1);
    next.items.push({id:`ray-${Date.now()}`,name:"Ray âm Blum",category:"Phụ kiện",dimensions:"Theo ngăn kéo",material:"Blum",qty,unit:"bộ",unitPrice:600000,amount:qty*600000});
    return {quote:recalc(next),reply:`Đã thêm ${qty} bộ ray âm Blum.`};
  }
  const discount=message.match(/(\d+(?:[.,]\d+)?)\s*%/);
  if (discount && (m.includes("giảm") || m.includes("chiết khấu"))) {
    next.discountPercent=Number(discount[1].replace(",", "."));
    return {quote:recalc(next),reply:`Đã áp dụng chiết khấu ${next.discountPercent}%.`};
  }
  if (m.includes("bỏ kính") || m.includes("xóa kính")) {
    next.items=next.items.filter(i=>!i.name.toLowerCase().includes("kính"));
    return {quote:recalc(next),reply:"Đã bỏ hạng mục kính bếp và tính lại."};
  }
  return {quote:recalc(next),reply:"Tao chưa có đủ quy tắc cho yêu cầu này. Có thể xử lý tốt hơn khi kết nối AI API và bộ đơn giá thực tế của WOTU."};
}
