"use client";
import { useState } from "react";
import { applyChat, parseRequest, recalc, totals, QuoteState } from "@/lib/ai-quote-engine";
import { Bot, FileDown, RotateCcw, Send, Sparkles, History, Plus } from "lucide-react";

type Version={id:number;quote:QuoteState;label:string};

const fmt=(n:number)=>new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND",maximumFractionDigits:0}).format(n);

export default function AIQuotePage(){
  const [quote,setQuote]=useState<QuoteState|null>(null);
  const [input,setInput]=useState("");
  const [chat,setChat]=useState<{role:"ai"|"user";text:string}[]>([]);
  const [versions,setVersions]=useState<Version[]>([]);
  const [customer,setCustomer]=useState("Khách hàng mới");

  function create(){
    const q=parseRequest(input,customer);
    setQuote(q); setVersions([{id:1,quote:q,label:"Bản đầu tiên"}]);
    setChat([{role:"ai",text:"Đã phân tích yêu cầu và tạo báo giá. Mày có thể sửa trực tiếp bằng câu nói tự nhiên bên phải."}]);
    setInput("");
  }
  function send(){
    if(!quote||!input.trim()) return;
    const user=input.trim();
    const r=applyChat(quote,user);
    const id=versions.length+1;
    setQuote(r.quote); setVersions(v=>[...v,{id,quote:r.quote,label:user}]);
    setChat(c=>[...c,{role:"user",text:user},{role:"ai",text:r.reply}]);
    setInput("");
  }
  function restore(v:Version){setQuote(v.quote);setChat(c=>[...c,{role:"ai",text:`Đã khôi phục phiên bản #${v.id}: ${v.label}`}]);}

  const t=quote?totals(quote):null;
  return <main className="min-h-screen bg-neutral-950 text-white">
    <header className="border-b border-neutral-800 sticky top-0 z-30 bg-neutral-950/90 backdrop-blur">
      <div className="max-w-[1400px] mx-auto px-5 py-4 flex items-center justify-between">
        <div><div className="text-2xl font-black tracking-[.2em] text-red-500">WOTU</div><div className="text-xs text-neutral-500">AI QUOTE ENGINE · MVP</div></div>
        <button onClick={()=>{setQuote(null);setChat([]);setVersions([])}} className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-sm flex gap-2 items-center"><Plus size={16}/> Báo giá mới</button>
      </div>
    </header>
    <div className="max-w-[1400px] mx-auto p-5">
      {!quote ? <section className="max-w-4xl mx-auto py-16">
        <div className="text-center mb-10"><Sparkles className="mx-auto text-red-500 mb-4" size={40}/><h1 className="text-4xl md:text-6xl font-black">WOTU AI Báo Giá</h1><p className="text-neutral-400 mt-4">Nói như nói với nhân viên báo giá. AI bóc tách rồi tính theo bộ quy tắc.</p></div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
          <label className="text-sm text-neutral-400">Tên khách hàng</label><input value={customer} onChange={e=>setCustomer(e.target.value)} className="mt-2 mb-4 w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3"/>
          <label className="text-sm text-neutral-400">Yêu cầu báo giá</label>
          <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Ví dụ: Bếp 3m5 MDF chống ẩm phủ melamine, có đá, kính và LED. Thêm 1 bàn 1m4 và 2 ghế..." className="mt-2 h-40 w-full bg-neutral-950 border border-neutral-700 rounded-xl p-4 outline-none focus:border-red-500"/>
          <button onClick={create} className="mt-4 w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 font-bold">✨ TẠO BÁO GIÁ</button>
        </div>
      </section> :
      <div className="grid lg:grid-cols-[1fr_420px] gap-5">
        <section className="bg-white text-neutral-900 rounded-2xl overflow-hidden">
          <div className="p-6 border-b"><div className="flex justify-between"><div><h1 className="text-2xl font-black">BÁO GIÁ NỘI THẤT</h1><p className="text-sm text-neutral-500">{quote.code} · {quote.customer}</p></div><div className="text-right text-xs text-neutral-500">Mẫu WOTU AI<br/>Ngày {new Date().toLocaleDateString("vi-VN")}</div></div></div>
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-neutral-100"><tr><th className="p-3 text-left">STT</th><th className="p-3 text-left">Hạng mục</th><th className="p-3 text-left">Quy cách</th><th className="p-3 text-left">Vật liệu</th><th className="p-3 text-right">SL</th><th className="p-3 text-right">Đơn giá</th><th className="p-3 text-right">Thành tiền</th></tr></thead><tbody>{quote.items.map((i,n)=><tr key={i.id} className="border-t"><td className="p-3">{n+1}</td><td className="p-3 font-semibold">{i.name}</td><td className="p-3">{i.dimensions}</td><td className="p-3">{i.material}</td><td className="p-3 text-right">{i.qty} {i.unit}</td><td className="p-3 text-right">{fmt(i.unitPrice)}</td><td className="p-3 text-right font-semibold">{fmt(i.amount)}</td></tr>)}</tbody></table></div>
          {t&&<div className="p-6 ml-auto max-w-sm space-y-2 text-sm"><div className="flex justify-between"><span>Tạm tính</span><b>{fmt(t.subtotal)}</b></div><div className="flex justify-between"><span>Chiết khấu</span><b>-{fmt(t.discount)}</b></div><div className="flex justify-between"><span>VAT {quote.vatPercent}%</span><b>{fmt(t.vat)}</b></div><div className="border-t pt-3 flex justify-between text-xl"><b>TỔNG CỘNG</b><b>{fmt(t.total)}</b></div></div>}
          <div className="p-5 border-t flex gap-3"><button onClick={()=>window.print()} className="px-4 py-2 rounded-xl bg-neutral-900 text-white flex gap-2"><FileDown size={16}/> In / PDF</button><button onClick={()=>versions[0]&&restore(versions[0])} className="px-4 py-2 rounded-xl border flex gap-2"><RotateCcw size={16}/> Bản đầu</button></div>
        </section>
        <aside className="bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col min-h-[650px]">
          <div className="p-5 border-b border-neutral-800"><div className="flex items-center gap-2 font-bold"><Bot className="text-red-500"/> AI sửa báo giá</div><p className="text-xs text-neutral-500 mt-1">Nói: “đổi cái này thành 4m”, “thêm 2 ray”, “giảm 5%”, “bỏ kính”...</p></div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">{chat.map((m,i)=><div key={i} className={`p-3 rounded-2xl text-sm ${m.role==="user"?"bg-red-600 ml-8":"bg-neutral-800 mr-8"}`}>{m.text}</div>)}</div>
          <div className="p-4 border-t border-neutral-800"><div className="flex gap-2"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Sửa báo giá bằng câu tự nhiên..." className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-3 outline-none focus:border-red-500"/><button onClick={send} className="p-3 rounded-xl bg-red-600"><Send size={18}/></button></div></div>
          <div className="p-4 border-t border-neutral-800"><div className="flex items-center gap-2 text-xs font-bold text-neutral-400 mb-2"><History size={14}/> LỊCH SỬ PHIÊN BẢN</div>{versions.slice().reverse().map(v=><button key={v.id} onClick={()=>restore(v)} className="w-full text-left text-xs p-2 rounded-lg hover:bg-neutral-800"><b>#{v.id}</b> {v.label}</button>)}</div>
        </aside>
      </div>}
    </div>
  </main>
}
