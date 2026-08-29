'use client';

import React, { useState } from 'react';
import { PricingEngine } from '@/lib/pricing-engine';
import { ConstructionCalculationResult } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Hammer, CheckCircle2 } from 'lucide-react';

export default function ConstructionCalculator() {
  const [houseType, setHouseType] = useState<'nhà ống' | 'nhà 2 mặt tiền' | 'nhà villa / biệt thự' | 'nhà mái thái'>('nhà ống');
  const [roadType, setRoadType] = useState<'đường ô tô' | 'hẻm lớn' | 'hẻm nhỏ'>('đường ô tô');
  const [landArea, setLandArea] = useState<number>(100);
  const [width, setWidth] = useState<number>(5);
  const [length, setLength] = useState<number>(20);
  const [balconyLength, setBalconyLength] = useState<number>(1.2);
  const [floorsCount, setFloorsCount] = useState<number>(2);
  const [hasRoofTon, setHasRoofTon] = useState<boolean>(true);
  const [packageId, setPackageId] = useState<'c1' | 'c2' | 'c3'>('c2');
  const [result, setResult] = useState<ConstructionCalculationResult | null>(null);

  const handleCalculate = () => {
    if (landArea <= 0 || width <= 0 || length <= 0 || floorsCount <= 0) return;
    const res = PricingEngine.calculateConstruction({
      houseType,
      roadType,
      landArea,
      width,
      length,
      balconyLength,
      floorsCount,
      hasRoofTon,
      packageId,
    });
    setResult(res);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-white max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-amber-500 mb-6 flex items-center gap-2">
        <Hammer className="w-6 h-6" /> CHI PHÍ XÂY DỰNG
      </h2>

      {/* CHỌN GÓI XÂY DỰNG */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { id: 'c1', title: 'CƠ BẢN', price: '6.000.000đ/m²' },
          { id: 'c2', title: 'TRUNG BÌNH', price: '7.000.000đ/m²' },
          { id: 'c3', title: 'CAO CẤP', price: '8.000.000đ/m²' },
        ].map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => setPackageId(pkg.id as any)}
            className={`cursor-pointer p-4 rounded-xl border text-center transition-all ${
              packageId === pkg.id
                ? 'border-amber-500 bg-amber-950/20 shadow-lg shadow-amber-900/20'
                : 'border-neutral-800 bg-neutral-800/50 hover:border-neutral-700'
            }`}
          >
            <h3 className="font-bold text-sm mb-1 text-neutral-300">GÓI {pkg.title}</h3>
            <p className="text-amber-500 font-extrabold text-lg">{pkg.price}</p>
          </div>
        ))}
      </div>

      {/* INPUT THÔNG SỐ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-neutral-800/40 p-5 rounded-xl border border-neutral-700">
        <div>
          <label className="block text-xs font-medium mb-1 text-neutral-400">Diện tích đất (m²)</label>
          <input type="number" value={landArea} onChange={(e) => setLandArea(Number(e.target.value))} className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-neutral-400">Chiều ngang (m)</label>
          <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-neutral-400">Chiều dài (m)</label>
          <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-neutral-400">Độ vươn ban công (m)</label>
          <input type="number" value={balconyLength} onChange={(e) => setBalconyLength(Number(e.target.value))} className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-neutral-400">Số tầng</label>
          <input type="number" value={floorsCount} onChange={(e) => setFloorsCount(Number(e.target.value))} className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm" />
        </div>
        <div className="flex items-center mt-4 md:mt-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-neutral-300">
            <input type="checkbox" checked={hasRoofTon} onChange={(e) => setHasRoofTon(e.target.checked)} className="w-4 h-4 accent-amber-500" />
            Có lợp mái tôn (Tính 30% diện tích sàn)
          </label>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition duration-200 mb-6"
      >
        Tính toán chi phí xây dựng
      </button>

      {/* KẾT QUẢ */}
      {result && (
        <div className="bg-neutral-950 border border-amber-900/50 p-6 rounded-xl space-y-3 animate-fade-in">
          <h4 className="text-lg font-bold text-white border-b border-neutral-800 pb-2">BẢNG TÍNH KHỐI LƯỢNG & BÁO GIÁ</h4>
          <div className="flex justify-between text-neutral-300 text-sm">
            <span>Diện tích sàn cơ bản:</span><span>{result.landArea} m²</span>
          </div>
          <div className="flex justify-between text-neutral-300 text-sm">
            <span>Diện tích ban công (Hệ số 50%):</span><span>{result.balconyArea.toFixed(2)} m²</span>
          </div>
          <div className="flex justify-between text-neutral-300 text-sm">
            <span>Tổng diện tích bê tông cốt thép:</span><span>{result.floorsAreaBTCT.toFixed(2)} m²</span>
          </div>
          <div className="flex justify-between text-neutral-300 text-sm">
            <span>Diện tích mái tôn (Hệ số 30%):</span><span>{result.floorsAreaTon.toFixed(2)} m²</span>
          </div>
          <div className="border-t border-neutral-800 my-2 pt-2 flex justify-between font-bold text-amber-500">
            <span>TỔNG DIỆN TÍCH TÍNH GIÁ:</span><span>{result.totalCalculationArea.toFixed(2)} m²</span>
          </div>
          <div className="flex justify-between text-neutral-300 text-sm">
            <span>Đơn giá áp dụng:</span><span>{formatCurrency(result.packagePricePerSqm)} / m²</span>
          </div>
          <div className="border-t border-neutral-800 mt-4 pt-3 flex justify-between items-center text-lg font-bold">
            <span className="text-white">TỔNG THANH TOÁN (Dự kiến):</span>
            <span className="text-amber-500 text-2xl">{formatCurrency(result.grandTotal)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
