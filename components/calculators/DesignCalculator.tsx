'use client';

import React, { useState } from 'react';
import { PricingEngine } from '@/lib/pricing-engine';
import { DesignCalculationResult } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, Calculator, Sparkles, ArrowRight } from 'lucide-react';

export default function DesignCalculator() {
  const [packageId, setPackageId] = useState<'g1' | 'g2' | 'g3'>('g2');
  const [area, setArea] = useState<number>(85);
  const [result, setResult] = useState<DesignCalculationResult | null>(
    PricingEngine.calculateDesign({ packageId: 'g2', areaSqm: 85 })
  );

  const handleCalculate = (newPkg: 'g1' | 'g2' | 'g3', newArea: number) => {
    const res = PricingEngine.calculateDesign({ packageId: newPkg, areaSqm: newArea });
    setResult(res);
  };

  return (
    <div className="bg-neutral-900/80 border border-neutral-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 text-white max-w-4xl mx-auto shadow-2xl shadow-black">
      <div className="flex items-center gap-3 mb-8 border-b border-neutral-800 pb-6">
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold tracking-wide">DỰ TOÁN CHI PHÍ THIẾT KẾ</h2>
          <p className="text-xs text-neutral-400 mt-0.5">Chọn gói dịch vụ và nhập diện tích để nhận báo giá chi tiết tức thì.</p>
        </div>
      </div>

      {/* CHỌN GÓI THIẾT KẾ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            id: 'g1',
            title: 'GÓI 1 – TIẾT KIỆM',
            price: '79.000đ',
            desc: 'Phù hợp căn hộ nhỏ, cải tạo nhanh',
            items: ['2D công năng mặt bằng', '3D phối cảnh nội thất cơ bản'],
          },
          {
            id: 'g2',
            title: 'GÓI 2 – CƠ BẢN',
            price: '119.000đ',
            desc: 'Được lựa chọn nhiều nhất',
            items: ['Toàn bộ Gói 1', '2D chi tiết kích thước kỹ thuật', 'Chỉ định vật liệu, ánh sáng', 'Bản vẽ điện nước (ME)'],
          },
          {
            id: 'g3',
            title: 'GÓI 3 – HOÀN THIỆN',
            price: '179.000đ',
            desc: 'Giải pháp toàn diện cao cấp',
            items: ['Toàn bộ Gói 2', 'Hồ sơ kết cấu & kiến trúc', '3D mặt tiền/ngoại thất', 'Giám sát tác giả thiết kế'],
          },
        ].map((pkg) => {
          const isSelected = packageId === pkg.id;
          return (
            <div
              key={pkg.id}
              onClick={() => {
                setPackageId(pkg.id as any);
                handleCalculate(pkg.id as any, area);
              }}
              className={`cursor-pointer p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-red-950/30 to-neutral-900 border-red-500 shadow-xl shadow-red-950/40 ring-1 ring-red-500'
                  : 'bg-neutral-900/40 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900'
              }`}
            >
              {isSelected && (
                <span className="absolute -top-3 right-4 bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                  Đang chọn
                </span>
              )}
              <div>
                <h3 className="font-bold text-sm tracking-wide text-neutral-200 mb-1">{pkg.title}</h3>
                <div className="flex items-baseline gap-1 my-2">
                  <span className="text-2xl font-black text-red-500">{pkg.price}</span>
                  <span className="text-xs text-neutral-400">/ m²</span>
                </div>
                <p className="text-[11px] text-neutral-400 mb-4">{pkg.desc}</p>
                <ul className="space-y-2.5 text-xs text-neutral-300 border-t border-neutral-800/60 pt-4">
                  {pkg.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span className="leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT DIỆN TÍCH */}
      <div className="bg-neutral-950/60 p-5 rounded-2xl border border-neutral-800/80 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-2/3">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
            Tổng diện tích sàn thiết kế (m²) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={area}
            onChange={(e) => {
              const val = Number(e.target.value);
              setArea(val);
              handleCalculate(packageId, val);
            }}
            min={1}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700/80 rounded-xl focus:outline-none focus:border-red-500 font-bold text-xl text-white tracking-wide"
          />
        </div>
        <div className="w-full md:w-1/3 text-right hidden md:block">
          <span className="text-xs text-neutral-500 block">Hệ thống tự động tính</span>
          <span className="text-xs font-semibold text-emerald-400">Đã cập nhật kết quả</span>
        </div>
      </div>

      {/* KẾT QUẢ TÍNH TOÁN (LUÔN HIỂN THỊ SANG TRỌNG) */}
      {result && (
        <div className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border border-red-500/30 p-6 md:p-8 rounded-2xl space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
            <div>
              <span className="text-xs text-red-400 font-semibold uppercase tracking-wider">Bảng giá chi tiết</span>
              <h4 className="text-lg font-extrabold text-white mt-0.5">{result.packageName}</h4>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-400">Đơn giá: </span>
              <span className="text-sm font-bold text-white">{formatCurrency(result.pricePerSqm)}/m²</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
            <div className="bg-neutral-900/60 p-3.5 rounded-xl border border-neutral-800">
              <span className="text-xs text-neutral-400 block mb-1">Diện tích khảo sát</span>
              <span className="text-lg font-bold text-white">{result.areaSqm} m²</span>
            </div>
            <div className="bg-neutral-900/60 p-3.5 rounded-xl border border-neutral-800">
              <span className="text-xs text-neutral-400 block mb-1">Thành tiền trước thuế</span>
              <span className="text-lg font-bold text-white">{formatCurrency(result.subtotal)}</span>
            </div>
            <div className="bg-neutral-900/60 p-3.5 rounded-xl border border-neutral-800">
              <span className="text-xs text-neutral-400 block mb-1">Thuế VAT (10%)</span>
              <span className="text-lg font-bold text-amber-400">{formatCurrency(result.vatAmount)}</span>
            </div>
          </div>

          <div className="border-t border-neutral-800/80 pt-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-red-950/20 -mx-6 md:-mx-8 -mb-6 md:-mb-8 p-6 md:p-8 border-x-0 border-b-0">
            <div>
              <span className="text-xs uppercase tracking-wider text-neutral-400 block">Tổng chi phí dự kiến trọn gói</span>
              <span className="text-xs text-neutral-500">Đã bao gồm VAT và hồ sơ tiêu chuẩn WOTU</span>
            </div>
            <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400">
              {formatCurrency(result.grandTotal)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
