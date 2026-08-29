'use client';

import React, { useState } from 'react';
import LeadFormModal from '@/components/auth/LeadFormModal';
import DesignCalculator from '@/components/calculators/DesignCalculator';
import ConstructionCalculator from '@/components/calculators/ConstructionCalculator';
import { CustomerLead } from '@/types';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customer, setCustomer] = useState<CustomerLead | null>(null);
  const [activeTab, setActiveTab] = useState<'design' | 'construction'>('design');

  const handleLeadSubmit = (lead: CustomerLead) => {
    setCustomer(lead);
    setIsAuthenticated(true);
    // TODO: Gửi lead vào database (Supabase) ở Phase 2
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070')] bg-cover bg-center">
        <LeadFormModal isOpen={!isAuthenticated} onSubmit={handleLeadSubmit} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500 tracking-tight">
            WOTU DỰ TOÁN
          </h1>
          <p className="text-neutral-400 mt-2 text-sm">
            Xin chào <span className="font-bold text-white">{customer?.fullName}</span>. Dưới đây là công cụ dự toán tự động.
          </p>
        </header>

        {/* TABS KẾT HỢP */}
        <div className="flex bg-neutral-900 p-1 rounded-xl mb-6 max-w-sm mx-auto">
          <button
            onClick={() => setActiveTab('design')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'design' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-500 hover:text-white'
            }`}
          >
            Báo Giá Thiết Kế
          </button>
          <button
            onClick={() => setActiveTab('construction')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'construction' ? 'bg-amber-600 text-white shadow-md' : 'text-neutral-500 hover:text-white'
            }`}
          >
            Báo Giá Xây Dựng
          </button>
        </div>

        {activeTab === 'design' ? <DesignCalculator /> : <ConstructionCalculator />}
      </div>
    </main>
  );
}
