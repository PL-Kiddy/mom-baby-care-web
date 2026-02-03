# Mom&BabyCare - Cửa hàng Sữa cho Mẹ Bầu và Em Bé

Trang web thương mại điện tử chuyên cung cấp sữa và các sản phẩm dinh dưỡng cho mẹ bầu và em bé.

## 🚀 Công nghệ sử dụng

- **React 18** - Thư viện UI
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool & Dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Material Symbols** - Icon library
- **Nunito Font** - Typography

## 📋 Yêu cầu hệ thống

- Node.js (phiên bản 16 trở lên)
- npm hoặc yarn

## 🛠️ Cài đặt

1. Di chuyển vào thư mục dự án:
```bash
cd mom-baby-care-web
```

2. Cài đặt các dependencies:
```bash
npm install
```

## 🏃 Chạy ứng dụng

### Development mode
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: `http://localhost:5173`

### Build production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## 📁 Cấu trúc dự án

```
mom-baby-care-web/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── CategoriesSection.tsx
│   │   ├── ProductsSection.tsx
│   │   ├── BlogSection.tsx
│   │   ├── NewsletterSection.tsx
│   │   └── Footer.tsx
│   ├── pages/              # Page components
│   │   └── Home.tsx
│   ├── App.tsx             # Main App component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── tailwind.config.js      # Tailwind configuration
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 🎨 Tính năng giao diện

- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Dark mode support
- ✅ Modern UI với Tailwind CSS
- ✅ Animations và transitions mượt mà
- ✅ Material Design icons
- ✅ Pastel color palette phù hợp với chủ đề mẹ và bé

## 🎭 Các thành phần chính

1. **Header** - Navigation bar với search, cart, login
2. **Hero Section** - Banner chính với call-to-action
3. **Categories** - Danh mục sản phẩm nổi bật
4. **Products** - Hiển thị sản phẩm bán chạy
5. **Blog** - Góc chia sẻ kinh nghiệm
6. **Newsletter** - Form đăng ký nhận tin
7. **Footer** - Thông tin liên hệ và links

## 🎯 Vai trò người dùng (Sẽ phát triển)

- **Guest** - Xem sản phẩm, bài viết
- **Member** - Mua hàng, tích điểm, đánh giá
- **Staff** - Quản lý đơn hàng, sản phẩm, bài viết
- **Admin** - Quản lý toàn bộ hệ thống

## 📝 License

Copyright © 2024 Mom&BabyCare. All rights reserved.
