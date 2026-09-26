export const WOTU_QUOTE_TEMPLATE = {
  version: "2026.09",
  source: "bao-gia-BG-NT-CHITHUY-210926-v5.pdf",
  format: "A4 portrait",
  brand: {
    company: "Công ty TNHH Sản xuất và Thiết kế nội thất WOTU",
    address: "Lô 17-18 Hoa Lư, Phường Quy Nhơn, Gia Lai.",
    taxCode: "4101612905",
    website: "wotu.vn",
    facebook: "wotudecor",
    instagram: "wotudecor",
    email: "wotu.decor@gmail.com",
    phones: ["093.377.4708", "094.443.7238"]
  },
  header: ["Số báo giá", "Ngày lập"],
  investorCard: "THÔNG TIN CHỦ ĐẦU TƯ",
  projectCard: ["Tên dự án", "Mã dự án", "Địa chỉ thi công", "Phụ trách"],
  columns: ["STT", "HẠNG MỤC", "ĐVT", "KHỐI LƯỢNG", "ĐƠN GIÁ", "THÀNH TIỀN", "HÌNH ẢNH"],
  sectionTotal: true,
  itemFields: ["name", "description", "unit", "qty", "unitPrice", "amount", "image"],
  terms: [
    "Báo giá đã bao gồm vận chuyển và lắp đặt nội thành",
    "Báo giá chưa bao gồm thuế VAT.",
    "Kiểm tra hàng hóa khiếu nại trong vòng 3 ngày",
    "Kí hợp đồng cọc trước 50% tổng đơn hàng",
    "Thời gian giao hàng từ 21 - 28 ngày làm việc kể từ ngày nhận cọc."
  ],
  footer: ["Tạm tính", "Thuế VAT", "TỔNG CỘNG", "THÔNG TIN THANH TOÁN", "ĐẠI DIỆN CÔNG TY", "CHỦ ĐẦU TƯ XÁC NHẬN"]
} as const;
