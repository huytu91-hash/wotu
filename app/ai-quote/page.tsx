"use client";
import { useState } from "react";
import { applyChat, parseRequest, QuoteState, totals } from "@/lib/ai-quote-engine";
import { Bot, FileDown, RotateCcw, Send, Sparkles, History, Plus } from "lucide-react";

type Version={id:number;quote:QuoteState;label:string};
const fmt=(n:number)=>new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND",maximumFractionDigits:0}).format(n);

function WotuQuote({quote}:{quote:QuoteState}){
  const t=totals(quote);
  const groups=quote.items.reduce<Record<string,typeof quote.items>>((a,i)=>{
    (a[i.category]??=[]).push(i); return a;
  },{});
  const groupNames=Object.keys(groups);
  return <div className="wotu-paper">
    <div className="wotu-topline"/>
    <header className="wotu-header">
      <div className="wotu-brand"><div className="wotu-logo">WOTU<br/><span>DESIGN<br/>BUILD</span></div><b>Công ty TNHH Sản xuất và Thiết kế nội thất WOTU</b></div>
      <div className="wotu-title">BÁO GIÁ</div>
    </header>
    <div className="wotu-meta">
      <div><b>Địa chỉ:</b> Lô 17-18 Hoa Lư, Phường Quy Nhơn, Gia Lai.<br/><b>Mã số thuế:</b> 4101612905<br/><b>Website:</b> wotu.vn · <b>Facebook:</b> wotudecor · <b>Instagram:</b> wotudecor<br/><b>Email:</b> wotu.decor@gmail.com · <b>Phone:</b> 093.377.4708 - 094.443.7238</div>
      <div><b>Số báo giá:</b> {quote.code}<br/><b>Ngày lập:</b> {new Date().toLocaleDateString("vi-VN")}</div>
    </div>
    <div className="wotu-cards">
      <div><h4>THÔNG TIN CHỦ ĐẦU TƯ</h4><b>{quote.customer}</b></div>
      <div><h4>THÔNG TIN DỰ ÁN</h4><p><span>Tên dự án</span><b>{quote.customer}</b></p><p><span>Mã dự án</span><b>AI-QUOTE</b></p><p><span>Địa chỉ thi công</span><b>Chưa cập nhật</b></p><p><span>Phụ trách</span><b>Từ Huy Tú</b></p></div>
    </div>
    <table className="wotu-table">
      <thead><tr><th>STT</th><th>HẠNG MỤC</th><th>ĐVT</th><th>KHỐI<br/>LƯỢNG</th><th>ĐƠN GIÁ</th><th>THÀNH TIỀN</th><th>HÌNH ẢNH</th></tr></thead>
      <tbody>{groupNames.map((g,gi)=><>
        <tr className="wotu-section"><td>{["I/","II/","III/","IV/","V/","VI/","VII/","VIII/"][gi]||`${gi+1}/`}</td><td colSpan={4}>{g}</td><td>{fmt(groups[g].reduce((s,i)=>s+i.amount,0))}</td><td></td></tr>
        {groups[g].map((i,n)=><tr key={i.id}>
          <td>{String(n+1).padStart(2,"0")}</td><td><b>{i.name}</b>{i.note&&<small>{i.note}</small>}<small>Vật liệu: {i.material}<br/>Quy cách: {i.dimensions}</small></td><td>{i.unit}</td><td>{i.qty}</td><td>{fmt(i.unitPrice)}</td><td><b>{fmt(i.amount)}</b></td><td><div className="wotu-imgbox">—</div></td>
        </tr>)}
      </>)}</tbody>
    </table>
    <div className="wotu-terms"><b>ĐIỀU KHOẢN & ĐIỀU KIỆN</b><ul><li>Báo giá đã bao gồm vận chuyển và lắp đặt nội thành</li><li>Báo giá chưa bao gồm thuế VAT.</li><li>Kiểm tra hàng hóa khiếu nại trong vòng 3 ngày</li><li>Kí hợp đồng cọc trước 50% tổng đơn hàng</li><li>Thời gian giao hàng từ 21 - 28 ngày làm việc kể từ ngày nhận cọc.</li></ul></div>
    <div className="wotu-totals"><div>Tạm tính <b>{fmt(t.subtotal)}</b></div><div>Thuế VAT ({quote.vatPercent}%) <b>{fmt(t.vat)}</b></div><div className="grand">TỔNG CỘNG <b>{fmt(t.total)}</b></div></div>
    <div className="wotu-footer"><div><b>THÔNG TIN THANH TOÁN</b><p>Ngân hàng: Techcombank</p><p>Chủ tài khoản: Nguyễn Anh Quốc</p><p>Số tài khoản: 6868682406</p><p>Nội dung CK: {quote.code}</p></div><div className="sign"><b>ĐẠI DIỆN CÔNG TY WOTU</b><br/><br/><br/>CHỦ ĐẦU TƯ XÁC NHẬN</div></div>
  </div>
}

export default function AIQuotePage(){
  const [quote,setQuote]=useState<QuoteState|null>(null),[input,setInput]=useState(""),[customer,setCustomer]=useState("Khách hàng mới");
  const [chat,setChat]=useState<{role:"ai"|"user";text:string}[]>([]),[versions,setVersions]=useState<Version[]>([]);
  function create(){const q=parseRequest(input,customer);setQuote(q);setVersions([{id:1,quote:q,label:"Bản đầu tiên"}]);setChat([{role:"ai",text:"Đã tạo báo giá theo cấu trúc mẫu WOTU. Mày có thể sửa bằng câu tự nhiên."}]);setInput("")}
  function send(){if(!quote||!input.trim())return;const user=input.trim(),r=applyChat(quote,user),id=versions.length+1;setQuote(r.quote);setVersions(v=>[...v,{id,quote:r.quote,label:user}]);setChat(c=>[...c,{role:"user",text:user},{role:"ai",text:r.reply}]);setInput("")}
  function restore(v:Version){setQuote(v.quote);setChat(c=>[...c,{role:"ai",text:`Đã khôi phục phiên bản #${v.id}: ${v.label}`}])}
  return <main className="min-h-screen bg-neutral-950 text-white">
    <style jsx global>{`
      .wotu-paper{background:#fff;color:#1f2937;width:210mm;min-height:297mm;margin:auto;padding:12mm 10mm;font:10px Arial,sans-serif;box-sizing:border-box}.wotu-topline{height:2px;background:#1683e8;margin:-12mm -10mm 8mm}.wotu-header{display:flex;justify-content:space-between;align-items:flex-start}.wotu-brand{display:flex;gap:12px;align-items:center;color:#0877d1;font-size:12px}.wotu-logo{font-weight:900;letter-spacing:2px;line-height:.8;color:#222}.wotu-logo span{font-size:7px;letter-spacing:1px}.wotu-title{font-size:30px;font-weight:900;letter-spacing:3px;color:#d1d5db}.wotu-meta{display:flex;justify-content:space-between;gap:20px;margin:8px 0 12px;line-height:1.7;color:#667085}.wotu-meta>div:last-child{text-align:left;min-width:210px}.wotu-cards{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}.wotu-cards>div{border:1px solid #d8e0ea;border-radius:7px;padding:11px;background:#fff}.wotu-cards>div:first-child{background:#eff7ff;border-color:#cfe4fa}.wotu-cards h4{margin:0 0 9px;color:#0877d1;font-size:10px;letter-spacing:1.5px}.wotu-cards p{display:flex;justify-content:space-between;border-bottom:1px dotted #cbd5e1;margin:0;padding:3px 0}.wotu-table{width:100%;border-collapse:collapse;font-size:9px}.wotu-table th{background:#eef6ff;color:#334155;border:1px solid #dbe5f0;padding:6px 4px;text-align:left}.wotu-table th:nth-child(n+3),.wotu-table td:nth-child(n+3){text-align:center}.wotu-table td{border-bottom:1px solid #e2e8f0;padding:6px 4px;vertical-align:top}.wotu-table td:nth-child(2){text-align:left}.wotu-table small{display:block;color:#9aa5b1;font-size:8px;line-height:1.35;margin-top:2px}.wotu-section td{background:#f8fafc;font-weight:800;color:#1e293b}.wotu-section td:nth-child(6){color:#0877d1;text-align:right}.wotu-imgbox{width:42px;height:30px;border:1px solid #ddd;border-radius:2px;display:flex;align-items:center;justify-content:center;color:#aaa;margin:auto}.wotu-terms{margin-top:12px;border-top:1px solid #e5e7eb;padding-top:8px;font-size:8px;line-height:1.5}.wotu-terms ul{margin:4px 0;padding-left:18px}.wotu-totals{margin:8px 0 15px;margin-left:auto;width:270px;font-size:10px}.wotu-totals div{display:flex;justify-content:space-between;padding:3px 0}.wotu-totals .grand{font-size:13px;border-top:1px solid #222;margin-top:3px;padding-top:6px}.wotu-footer{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid #ddd;padding-top:10px;font-size:8px;line-height:1.5}.wotu-footer .sign{text-align:center}.print-paper{max-width:210mm;margin:auto}@media print{body{background:#fff!important}.no-print{display:none!important}.wotu-paper{margin:0;width:210mm;box-shadow:none}.print-paper{max-width:none}}
    `}</style>
    <header className="no-print border-b border-neutral-800 sticky top-0 z-30 bg-neutral-950/90 backdrop-blur"><div className="max-w-[1500px] mx-auto px-5 py-4 flex items-center justify-between"><div><div className="text-2xl font-black tracking-[.2em] text-red-500">WOTU</div><div className="text-xs text-neutral-500">AI QUOTE ENGINE</div></div><button onClick={()=>{setQuote(null);setChat([]);setVersions([])}} className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-sm flex gap-2 items-center"><Plus size={16}/> Báo giá mới</button></div></header>
    <div className="max-w-[1500px] mx-auto p-5">
      {!quote?<section className="no-print max-w-4xl mx-auto py-16"><div className="text-center mb-10"><Sparkles className="mx-auto text-red-500 mb-4" size={40}/><h1 className="text-5xl font-black">WOTU AI Báo Giá</h1><p className="text-neutral-400 mt-4">Nhập yêu cầu như đang nói với nhân viên báo giá.</p></div><div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6"><label className="text-sm text-neutral-400">Tên chủ đầu tư</label><input value={customer} onChange={e=>setCustomer(e.target.value)} className="mt-2 mb-4 w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3"/><label className="text-sm text-neutral-400">Yêu cầu báo giá</label><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Ví dụ: Bếp 3m5 MDF chống ẩm phủ melamine, có đá, kính và LED. Thêm 1 bàn 1m4 và 2 ghế..." className="mt-2 h-40 w-full bg-neutral-950 border border-neutral-700 rounded-xl p-4"/><button onClick={create} className="mt-4 w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 font-bold">✨ TẠO BÁO GIÁ THEO PHOM WOTU</button></div></section>:
      <div className="grid xl:grid-cols-[minmax(0,1fr)_420px] gap-5 items-start"><section className="print-paper"><WotuQuote quote={quote}/></section><aside className="no-print bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col min-h-[650px] sticky top-24"><div className="p-5 border-b border-neutral-800"><div className="flex items-center gap-2 font-bold"><Bot className="text-red-500"/> AI sửa báo giá</div><p className="text-xs text-neutral-500 mt-1">Ví dụ: “đổi bếp thành 4m”, “thêm 2 ray”, “giảm 5%”, “bỏ kính”.</p></div><div className="flex-1 p-4 space-y-3 overflow-y-auto">{chat.map((m,i)=><div key={i} className={`p-3 rounded-2xl text-sm ${m.role==="user"?"bg-red-600 ml-8":"bg-neutral-800 mr-8"}`}>{m.text}</div>)}</div><div className="p-4 border-t border-neutral-800"><div className="flex gap-2"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Sửa báo giá bằng câu tự nhiên..." className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-3"/><button onClick={send} className="p-3 rounded-xl bg-red-600"><Send size={18}/></button></div></div><div className="p-4 border-t border-neutral-800"><div className="flex items-center gap-2 text-xs font-bold text-neutral-400 mb-2"><History size={14}/> LỊCH SỬ PHIÊN BẢN</div>{versions.slice().reverse().map(v=><button key={v.id} onClick={()=>restore(v)} className="w-full text-left text-xs p-2 rounded-lg hover:bg-neutral-800"><b>#{v.id}</b> {v.label}</button>)}</div><button onClick={()=>window.print()} className="m-4 mt-0 py-3 rounded-xl bg-white text-neutral-900 font-bold flex justify-center gap-2"><FileDown size={16}/> In / PDF</button></aside></div>}
    </div>
  </main>
}