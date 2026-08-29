'use client';

import React, { useState } from 'react';
import { PricingEngine } from '@/lib/pricing-engine';
import { DesignCalculationResult } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, Calculator } from 'lucide-react';

export default function DesignCalculator() {
  const [packageId, setPackageId] = useState<'g1' | 'g2' | 'g3'>('g2');
  const [area, setArea] = useState<number>(80);
  const [result, setResult] = useState<DesignCalculationResult | null>(null);

  const handleCalculate = () => {
    if (area <= 0) return;
    const res = PricingEngine.calculateDesign({ packageId, areaSqm: area });
    setResult(res);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-white max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-red-500 mb-6 flex items-center gap-2">
        <Calculator className="w-6 h-6" /> CHI PHÍ THIẾT KẾ
      </h2>

      {/* CHỌN GÓI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          {
            id: 'g1',
            title: 'GÓI 1 – TIẾT KIỆM',
            price: '79.000đ/m²',
            items: ['2D công năng', '3D nội thất'],
          },
          {
            id: 'g2',
            title: 'GÓI 2 – CƠ BẢN',
            price: '119.000đ/m²',
            items: [
              'Toàn bộ Gói 1',
              '2D chi tiết kích thước',
              'Chỉ định vật liệu nội thất',
              '2D ổ cắm điện nước',
            ],
          },
          {
            id: 'g3',
            title: 'GÓI 3 – HOÀN THIỆN',
            price: '179.000đ/m²',
            items: [
              'Toàn bộ Gói 2',
              'Kết cấu xây dựng',
              'Hồ sơ hoàn chỉnh',
              '3D mặt đứng / mặt tiền',
            ],
          },
        ].map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => setPackageId(pkg.id as any)}
            className={`cursor-pointer p-5 rounded-xl border transition-all ${
              packageId === pkg.id
                ? 'border-red-500 bg-red-950/20 shadow-lg shadow-red-900/20'
                : 'border-neutral-800 bg-neutral-800/50 hover:border-neutral-700'
            }`}
          >
            <h3 className="font-bold text-lg mb-1">{pkg.title}</h3>
            <p className="text-red-400 font-extrabold text-xl mb-4">{pkg.price}</p>
            <ul className="space-y-2 text-xs text-neutral-300">
              {pkg.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* INPUT DIỆN TÍCH */}
      <div className="bg-neutral-800/60 p-5 rounded-xl border border-neutral-700 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium mb-1 text-neutral-300">
            Tổng diện tích sàn thiết kế (m²) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            min={1}
            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-red-500 font-bold text-lg"
          />
        </div>
        <button
          onClick={handleCalculate}
          className="w-full md:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition duration-200 mt-2 md:mt-6"
        >
          Tính toán chi phí
        </button>
      </div>

      {/* KẾT QUẢ TÍNH TOÁN */}
      {result && (
        <div className="bg-neutral-950 border border-red-900/50 p-6 rounded-xl space-y-3 animate-fade-in">
          <h4 className="text-lg font-bold text-white border-b border-neutral-800 pb-2">
            BÁO GIÁ DỰ KIẾN ({result.packageName})
          </h4>
          <div className="flex justify-between text-neutral-300 text-sm">
            <span>Đơn giá cơ bản:</span>
            <span>{formatCurrency(result.pricePerSqm)} / m²</span>
          </div>
          <div className="flex justify-between text-neutral-300 text-sm">
            <span>Tổng diện tích:</span>
            <span>{result.areaSqm} m²</span>
          </div>
          <div className="flex justify-between text-neutral-300 text-sm">
            <span>Thành tiền trước VAT:</span>
            <span className="font-semibold text-white">{formatCurrency(result.subtotal)}</span>
          </div>
          <div className="flex justify-between text-neutral-300 text-sm">
            <span>Thuế VAT (10%):</span>
            <span className="text-amber-400">+{formatCurrency(result.vatAmount)}</span>
          </div>
          <div className="border-t border-neutral-800 pt-3 flex justify-between items-center text-lg font-bold">
            <span className="text-white">TỔNG THANH TOÁN:</span>
            <span className="text-red-500 text-2xl">{formatCurrency(result.grandTotal)}</span>
          </div>
        </div>
      )}

      {/* QUY TRÌNH THIẾT KẾ WOTU */}
      <div className="mt-10 border-t border-neutral-800 pt-8">
        <h3 className="text-xl font-bold mb-6 text-center text-neutral-200">
          Quy trình thiết kế WOTU
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            '1. Tiếp nhận thông tin & ký hợp đồng. Thu tiền tạm ứng theo thỏa thuận.',
            '2. Khảo sát hiện trạng thực tế.',
            '3. Triển khai thiết kế theo gói khách đã chọn.',
            '4. Gửi bản thiết kế cho khách duyệt.',
            '5. Chỉnh sửa theo góp ý (Tối đa 3 lần chỉnh sửa).',
            '6. Bàn giao hồ sơ thiết kế hoàn chỉnh (File mềm + Bản in).',
          ].map((step, idx) => (
            <div
              key={idx}
              className="p-4 bg-neutral-800/40 border border-neutral-800 rounded-xl text-xs text-neutral-300 leading-relaxed"
            >
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
