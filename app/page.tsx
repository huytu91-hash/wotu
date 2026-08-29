'use client';

import React, { useState } from 'react';
import LeadFormModal from '@/components/auth/LeadFormModal';
import DesignCalculator from '@/components/calculators/DesignCalculator';
import ConstructionCalculator from '@/components/calculators/ConstructionCalculator';
import { CustomerLead } from '@/types';
import { Sparkles, Building2, Paintbrush, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customer, setCustomer] = useState<CustomerLead | null>(null);
  const [activeTab, setActiveTab] = useState<'design' | 'construction'>('design');

  const handleLeadSubmit = (lead: CustomerLead) => {
    setCustomer(lead);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center relative overflow-hidden">
        {/* Hiệu ứng ánh sáng nền sang trọng */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <LeadFormModal isOpen={!isAuthenticated} onSubmit={handleLeadSubmit} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-red-600 selection:text-white pb-20">
      {/* Header thanh lịch */}
      <nav className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">
              WOTU
            </span>
            <span className="text-xs uppercase tracking-wider px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-neutral-400 rounded-full font-medium">
              Enterprise Estimator
            </span>
          </div>
          <div className="text-xs text-neutral-400 flex items-center gap-2 bg-neutral-900/60 border border-neutral-800/80 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Khách hàng: <strong className="text-white">{customer?.fullName}</strong></span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 pt-10">
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Hệ Thống Báo Giá <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-500 to-red-500">Thông Minh</span>
          </h1>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto">
            Giải pháp dự toán chi phí tự động chính xác từng hạng mục cho không gian kiến trúc và xây dựng cao cấp của bạn.
          </p>
        </div>

        {/* Tab lựa chọn kiểu dáng card lớn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
          <button
            onClick={() => setActiveTab('design')}
            className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
              activeTab === 'design'
                ? 'bg-gradient-to-br from-red-950/40 to-neutral-900 border-red-600 shadow-xl shadow-red-950/50'
                : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-3 rounded-xl ${activeTab === 'design' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                <Paintbrush className="w-5 h-5" />
              </div>
              <Sparkles className={`w-5 h-5 ${activeTab === 'design' ? 'text-red-500' : 'text-neutral-600'}`} />
            </div>
            <h3 className="font-bold text-lg text-white group-hover:text-red-400 transition-colors">Thiết Kế Kiến Trúc & Nội Thất</h3>
            <p className="text-xs text-neutral-400 mt-1">Dự toán chi phí theo m² với 3 gói từ Tiết kiệm đến Hoàn thiện.</p>
          </button>

          <button
            onClick={() => setActiveTab('construction')}
            className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
              activeTab === 'construction'
                ? 'bg-gradient-to-br from-amber-950/40 to-neutral-900 border-amber-600 shadow-xl shadow-amber-950/50'
                : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-3 rounded-xl ${activeTab === 'construction' ? 'bg-amber-600 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                <Building2 className="w-5 h-5" />
              </div>
              <Sparkles className={`w-5 h-5 ${activeTab === 'construction' ? 'text-amber-500' : 'text-neutral-600'}`} />
            </div>
            <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">Xây Dựng Trọn Gói</h3>
            <p className="text-xs text-neutral-400 mt-1">Tính toán bóc tách khối lượng móng, sàn, ban công và mái chi tiết.</p>
          </button>
        </div>

        {/* Nội dung bảng tính */}
        <div className="transition-all duration-300">
          {activeTab === 'design' ? <DesignCalculator /> : <ConstructionCalculator />}
        </div>
      </div>
    </main>
  );
}
