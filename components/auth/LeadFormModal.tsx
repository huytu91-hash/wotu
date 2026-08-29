'use client';

import React, { useState } from 'react';
import { CustomerLead } from '@/types';
import { validateVNPhone } from '@/lib/utils';
import { ShieldCheck, User, Phone, MapPin } from 'lucide-react';

interface LeadFormModalProps {
  isOpen: boolean;
  onSubmit: (lead: CustomerLead) => void;
}

export default function LeadFormModal({ isOpen, onSubmit }: LeadFormModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }
    if (!validateVNPhone(phone)) {
      setError('Số điện thoại không hợp lệ (VD: 0912345678)');
      return;
    }

    setError('');
    onSubmit({
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      acceptedConsent: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl text-white">
        <div className="text-center mb-6">
          <span className="text-red-500 text-3xl font-extrabold tracking-wider">WOTU</span>
          <h2 className="text-xl font-bold mt-1">Phần mềm báo giá tự động</h2>
          <p className="text-neutral-400 text-sm mt-2">
            Xin chào quý khách đã đến với phần mềm báo giá tự động của WOTU. Vui lòng nhập thông tin để xem báo giá.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-800 text-red-300 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl focus:outline-none focus:border-red-500 text-sm text-white placeholder-neutral-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0901234567"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl focus:outline-none focus:border-red-500 text-sm text-white placeholder-neutral-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Địa chỉ xây dựng / Thiết kế <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Quận 2, TP. Hồ Chí Minh"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl focus:outline-none focus:border-red-500 text-sm text-white placeholder-neutral-500"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 pt-2 text-xs text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p>
              Thông tin của bạn được WOTU bảo mật tuyệt đối theo Chính sách bảo vệ dữ liệu cá nhân.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 font-bold rounded-xl transition duration-200 text-white mt-4 shadow-lg shadow-red-600/30"
          >
            Xem Báo Giá Tự Động
          </button>
        </form>
      </div>
    </div>
  );
}
