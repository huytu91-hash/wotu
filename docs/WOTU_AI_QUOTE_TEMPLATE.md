# WOTU AI Quote — Template mapping

Template source: `bao-gia-BG-NT-CHITHUY-210926-v5.pdf`.

The uploaded WOTU sample is an A4 portrait quotation with:
- blue top rule and WOTU brand/header;
- company/contact information plus quotation number/date;
- two information cards for investor and project;
- line-item table with STT, HẠNG MỤC, ĐVT, KHỐI LƯỢNG, ĐƠN GIÁ, THÀNH TIỀN, HÌNH ẢNH;
- room/section rows with section totals;
- detailed multiline material descriptions under each item;
- terms & conditions;
- subtotal, VAT and grand total;
- payment information and signature/confirmation area.

The implementation should treat this file as the visual/source-of-truth template. Pricing data and calculations remain separate from the template renderer.

## Production next step

Replace the browser-only print view with a server-side A4 PDF renderer or HTML-to-PDF renderer. Store the template definition in Supabase so WOTU can maintain versions without changing code.
