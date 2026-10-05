// StudentRent - Source of Truth Mock Data (Strictly following BẢN MÔ TẢ CHỨC NĂNG WEB)

// Helper to generate date strings relative to a fixed base or current month (YYYY-MM-DD)
const TODAY = new Date();
const CURRENT_YEAR = TODAY.getFullYear();
const CURRENT_MONTH = TODAY.getMonth(); // 0-indexed

function fmtDate(dayOffset) {
  const d = new Date(CURRENT_YEAR, CURRENT_MONTH, TODAY.getDate() + dayOffset);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getDateRangeArray(startStr, endStr) {
  const arr = [];
  const curr = new Date(startStr + 'T00:00:00');
  const end = new Date(endStr + 'T00:00:00');
  while (curr <= end) {
    const yyyy = curr.getFullYear();
    const mm = String(curr.getMonth() + 1).padStart(2, '0');
    const dd = String(curr.getDate()).padStart(2, '0');
    arr.push(`${yyyy}-${mm}-${dd}`);
    curr.setDate(curr.getDate() + 1);
  }
  return arr;
}

// Inline SVG Data URI Fallback Generator (prevents any broken image)
function createFallbackImage(label, bgHex = '#10B981') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgHex}" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#0F172A" stop-opacity="0.95"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#g)"/>
    <circle cx="400" cy="240" r="70" fill="rgba(255,255,255,0.15)"/>
    <text x="400" y="255" font-family="sans-serif" font-size="44" font-weight="bold" fill="#ffffff" text-anchor="middle">SR</text>
    <text x="400" y="380" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">${label}</text>
    <text x="400" y="425" font-family="sans-serif" font-size="18" fill="#A7F3D0" text-anchor="middle">StudentRent Verified Photo</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// 42 & 43. 9 DANH MỤC SẢN PHẨM & KHOẢNG GIÁ/CỌC THAM KHẢO ĐÚNG ĐẶC TẢ
const INITIAL_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Máy ảnh/Camera',
    icon: '📷',
    minPrice: 150000,
    maxPrice: 250000,
    minDeposit: 1000000,
    maxDeposit: 2000000,
    examples: 'Sony A6400, Canon R50, Flycam mini, Gimbal DJI',
    active: true
  },
  {
    id: 'cat-2',
    name: 'Đồ điện tử',
    icon: '📽️',
    minPrice: 80000,
    maxPrice: 150000,
    minDeposit: 500000,
    maxDeposit: 1200000,
    examples: 'Máy chiếu mini, Màn hình di động, Loa kéo bluetooth',
    active: true
  },
  {
    id: 'cat-3',
    name: 'Trang phục',
    icon: '👔',
    minPrice: 40000,
    maxPrice: 90000,
    minDeposit: 150000,
    maxDeposit: 300000,
    examples: 'Vest nam kỷ yếu, Áo dài ngũ thân, Đồ biểu diễn',
    active: true
  },
  {
    id: 'cat-4',
    name: 'Đồ gia dụng',
    icon: '🍳',
    minPrice: 20000,
    maxPrice: 45000,
    minDeposit: 150000,
    maxDeposit: 400000,
    examples: 'Nồi chiên không dầu, Lò vi sóng, Nồi lẩu điện',
    active: true
  },
  {
    id: 'cat-5',
    name: 'Dụng cụ học tập',
    icon: '📐',
    minPrice: 15000,
    maxPrice: 35000,
    minDeposit: 100000,
    maxDeposit: 300000,
    examples: 'Casio 580FX, Bảng vẽ Wacom, Bộ thước kỹ thuật',
    active: true
  },
  {
    id: 'cat-6',
    name: 'Xe đạp/Xe điện',
    icon: '🚲',
    minPrice: 30000,
    maxPrice: 60000,
    minDeposit: 300000,
    maxDeposit: 800000,
    examples: 'Xe địa hình, Xe đạp điện, Scooter',
    active: true
  },
  {
    id: 'cat-7',
    name: 'Dụng cụ thể thao',
    icon: '🏸',
    minPrice: 20000,
    maxPrice: 40000,
    minDeposit: 100000,
    maxDeposit: 250000,
    examples: 'Vợt Yonex, Vợt Pickleball, Bóng rổ Molten',
    active: true
  },
  {
    id: 'cat-8',
    name: 'Dụng cụ sự kiện/Dã ngoại',
    icon: '⛺',
    minPrice: 40000,
    maxPrice: 80000,
    minDeposit: 200000,
    maxDeposit: 500000,
    examples: 'Lều 4 người, Bếp ga mini, Bàn ghế gấp',
    active: true
  },
  {
    id: 'cat-9',
    name: 'Khác',
    icon: '🔦',
    minPrice: 20000,
    maxPrice: 50000,
    minDeposit: 100000,
    maxDeposit: 300000,
    examples: 'Bảng số sự kiện, Đèn pin phượt, Mascot, Bộ đàm',
    active: true
  }
];

const AREAS = ['ĐHQG', 'Bách Kinh Xây', 'Cầu Giấy'];

// 44 & 45. 10 NGƯỜI DÙNG + TÀI KHOẢN DEMO
const INITIAL_USERS = [
  {
    id: 'u-1',
    name: 'Nguyễn Minh Quân',
    email: 'student@demo.com',
    eduEmail: 'quan.nm@student.edu.vn',
    password: '123456',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    school: 'ĐH Bách Khoa Hà Nội - Khoa CNTT',
    studentId: '20225108',
    phone: '0987654321',
    area: 'Bách Kinh Xây',
    bankAccount: 'MB Bank - 0987654321 - NGUYEN MINH QUAN',
    trustScore: 96,
    rating: 4.9,
    rentedOutCount: 14,
    rentedInCount: 9,
    completedTx: 23,
    verifiedStudent: true,
    isNewUser: false,
    status: 'active',
    warnings: 0,
    complaints: 0
  },
  {
    id: 'u-2',
    name: 'Trần Thảo Tiên',
    email: 'tien.tt@student.edu.vn',
    eduEmail: 'tien.tt@student.edu.vn',
    password: '123456',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    school: 'ĐH Quốc Gia Hà Nội - Trường ĐH Ngoại Ngữ',
    studentId: '21040291',
    phone: '0912345678',
    area: 'ĐHQG',
    bankAccount: 'Vietcombank - 1029384756 - TRAN THAO TIEN',
    trustScore: 98,
    rating: 5.0,
    rentedOutCount: 19,
    rentedInCount: 6,
    completedTx: 25,
    verifiedStudent: true,
    isNewUser: false,
    status: 'active',
    warnings: 0,
    complaints: 0
  },
  {
    id: 'u-3',
    name: 'Lê Hoàng Nam',
    email: 'nam.lh@student.edu.vn',
    eduEmail: 'nam.lh@student.edu.vn',
    password: '123456',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    school: 'Học viện Báo chí & Tuyên truyền',
    studentId: 'AJC41092',
    phone: '0934567890',
    area: 'Cầu Giấy',
    bankAccount: 'Techcombank - 1903485712 - LE HOANG NAM',
    trustScore: 92,
    rating: 4.8,
    rentedOutCount: 11,
    rentedInCount: 5,
    completedTx: 16,
    verifiedStudent: true,
    isNewUser: false,
    status: 'active',
    warnings: 0,
    complaints: 0
  },
  {
    id: 'u-4',
    name: 'Phạm Khánh Linh',
    email: 'linh.pk@student.edu.vn',
    eduEmail: 'linh.pk@student.edu.vn',
    password: '123456',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    school: 'ĐH Kinh tế Quốc dân - Khoa Marketing',
    studentId: '11223819',
    phone: '0978123456',
    area: 'Bách Kinh Xây',
    bankAccount: 'TPBank - 0394817263 - PHAM KHANH LINH',
    trustScore: 95,
    rating: 4.9,
    rentedOutCount: 8,
    rentedInCount: 7,
    completedTx: 15,
    verifiedStudent: true,
    isNewUser: false,
    status: 'active',
    warnings: 0,
    complaints: 0
  },
  {
    id: 'u-5',
    name: 'Vũ Đức Anh',
    email: 'ducanh.vu@student.edu.vn',
    eduEmail: 'ducanh.vu@student.edu.vn',
    password: '123456',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    school: 'ĐH Xây Dựng Hà Nội - Khoa Kiến trúc',
    studentId: '6619201',
    phone: '0965432109',
    area: 'Bách Kinh Xây',
    bankAccount: 'BIDV - 21510002938 - VU DUC ANH',
    trustScore: 89,
    rating: 4.6,
    rentedOutCount: 7,
    rentedInCount: 4,
    completedTx: 11,
    verifiedStudent: true,
    isNewUser: false,
    status: 'active',
    warnings: 0,
    complaints: 1
  },
  {
    id: 'u-6',
    name: 'Đặng Ngọc Mai',
    email: 'mai.dn@student.edu.vn',
    eduEmail: 'mai.dn@student.edu.vn',
    password: '123456',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    school: 'ĐH Sư phạm Hà Nội - KTX Cầu Giấy',
    studentId: '71560210',
    phone: '0945612378',
    area: 'Cầu Giấy',
    bankAccount: 'VPBank - 882910394 - DANG NGOC MAI',
    trustScore: 94,
    rating: 4.8,
    rentedOutCount: 10,
    rentedInCount: 8,
    completedTx: 18,
    verifiedStudent: true,
    isNewUser: false,
    status: 'active',
    warnings: 0,
    complaints: 0
  },
  {
    id: 'u-7',
    name: 'Hoàng Gia Bảo',
    email: 'bao.hg@student.edu.vn',
    eduEmail: 'bao.hg@student.edu.vn',
    password: '123456',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=250&q=80',
    school: 'ĐH Công Nghệ - ĐHQGHN',
    studentId: '22028115',
    phone: '0901239876',
    area: 'ĐHQG',
    bankAccount: 'ACB - 18273645 - HOANG GIA BAO',
    trustScore: 91,
    rating: 4.7,
    rentedOutCount: 6,
    rentedInCount: 6,
    completedTx: 12,
    verifiedStudent: true,
    isNewUser: false,
    status: 'active',
    warnings: 0,
    complaints: 0
  },
  {
    id: 'u-8',
    name: 'Bùi Phương Thảo',
    email: 'thao.bp@student.edu.vn',
    eduEmail: 'thao.bp@student.edu.vn',
    password: '123456',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    school: 'ĐH Thương Mại - Cầu Giấy',
    studentId: '23D19021',
    phone: '0923456781',
    area: 'Cầu Giấy',
    bankAccount: 'MB Bank - 0923456781 - BUI PHUONG THAO',
    trustScore: 85,
    rating: 4.5,
    rentedOutCount: 4,
    rentedInCount: 3,
    completedTx: 7,
    verifiedStudent: false,
    pendingVerify: true,
    isNewUser: false,
    status: 'active',
    warnings: 0,
    complaints: 0
  },
  {
    id: 'u-9',
    name: 'Ngô Tuấn Kiệt',
    email: 'kiet.nt@student.edu.vn',
    eduEmail: 'kiet.nt@student.edu.vn',
    password: '123456',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80',
    school: 'ĐH Kinh tế - ĐHQGHN',
    studentId: '24050112',
    phone: '0956781234',
    area: 'ĐHQG',
    bankAccount: 'VietinBank - 109827364 - NGO TUAN KIET',
    trustScore: 80,
    rating: 0,
    rentedOutCount: 0,
    rentedInCount: 0,
    completedTx: 0,
    verifiedStudent: true,
    isNewUser: true,
    status: 'active',
    warnings: 0,
    complaints: 0
  },
  {
    id: 'u-10',
    name: 'Trịnh Quốc Hưng',
    email: 'hung.tq@gmail.com',
    eduEmail: '',
    password: '123456',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=250&q=80',
    school: 'Cao đẳng Du lịch Hà Nội',
    studentId: 'CD21094',
    phone: '0988112233',
    area: 'Cầu Giấy',
    bankAccount: 'Techcombank - 9988776655 - TRINH QUOC HUNG',
    trustScore: 62,
    rating: 3.4,
    rentedOutCount: 1,
    rentedInCount: 2,
    completedTx: 2,
    verifiedStudent: false,
    isNewUser: false,
    status: 'active',
    warnings: 2,
    complaints: 2
  }
];

const ADMIN_ACCOUNT = {
  id: 'admin-1',
  name: 'Ban Quản Trị StudentRent',
  email: 'admin@demo.com',
  password: '123456',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=250&q=80'
};

// 44. 20 SẢN PHẨM ĐỦ 9 DANH MỤC, ẢNH UNSPLASH, LỊCH ĐA DẠNG
const INITIAL_PRODUCTS = [
  {
    id: 'SP-01',
    title: 'Máy ảnh Sony A6400 + Lens Kit 16-50mm Quay 4K',
    categoryId: 'cat-1',
    brand: 'Sony',
    ownerId: 'u-3',
    pricePerDay: 200000,
    weeklyPrice: 1200000,
    deposit: 1800000,
    area: 'Cầu Giấy',
    pickupPoint: 'Cổng chính Học viện Báo chí & Tuyên truyền, 36 Xuân Thủy',
    condition: 'Mới 99%',
    accessories: 'Túi đựng chống sốc, thẻ nhớ SD 64GB Extreme Pro, 2 pin Wasabi + sạc đôi, dây đeo.',
    customPolicy: 'Vui lòng không tháo lens ở môi trường bụi bẩn. Giữ nguyên tem niêm phong pin.',
    description: 'Máy ảnh mirrorless Sony A6400 lấy nét siêu nhanh, phù hợp cho các nhóm sinh viên quay đồ án truyền thông, chụp ảnh kỷ yếu, sự kiện CLB.',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Đã duyệt',
    visible: true,
    schedule: {
      // ORD-01 soft-locked dates (Vàng hổ phách)
      [fmtDate(2)]: 'soft_locked',
      [fmtDate(3)]: 'soft_locked',
      // Booked dates (Xanh dương)
      [fmtDate(6)]: 'booked',
      [fmtDate(7)]: 'booked',
      // Owner locked (Xám)
      [fmtDate(10)]: 'owner_locked'
    },
    reviews: [
      { id: 'rv-1', userId: 'u-1', userName: 'Nguyễn Minh Quân', rating: 5, comment: 'Máy nét căng, pin trâu, bạn chủ hướng dẫn nhiệt tình!', tags: ['Đúng hẹn', 'Đúng mô tả', 'Thân thiện'], date: '15/09/2026' }
    ]
  },
  {
    id: 'SP-02',
    title: 'Máy ảnh Canon EOS R50 Kit 18-45mm Trắng',
    categoryId: 'cat-1',
    brand: 'Canon',
    ownerId: 'u-2',
    pricePerDay: 180000,
    weeklyPrice: 1080000,
    deposit: 1500000,
    area: 'ĐHQG',
    pickupPoint: 'Sảnh KTX Ngoại Ngữ - ĐHQGHN, Phạm Văn Đồng',
    condition: 'Mới 99%',
    accessories: 'Thẻ nhớ 64GB, đầu đọc thẻ Type-C/Lightning chép ảnh sang iPhone ngay, 2 pin.',
    customPolicy: 'Trả máy đúng giờ để mình vệ sinh sensor cho bạn tiếp theo.',
    description: 'Canon R50 nhỏ gọn, màu ảnh hồng hào nịnh da không cần chỉnh nhiều. Rất hợp chụp ngoại cảnh, sự kiện CLB sinh viên.',
    images: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Đã duyệt',
    visible: true,
    schedule: {
      [fmtDate(4)]: 'booked',
      [fmtDate(5)]: 'booked',
      [fmtDate(9)]: 'owner_locked'
    },
    reviews: [
      { id: 'rv-2', userId: 'u-6', userName: 'Đặng Ngọc Mai', rating: 5, comment: 'Máy trắng siêu xinh, có sẵn đầu đọc thẻ copy ảnh lấy liền rất tiện.', tags: ['Đúng hẹn', 'Đúng mô tả'], date: '18/09/2026' }
    ]
  },
  {
    id: 'SP-03',
    title: 'Flycam DJI Mini 3 Fly More Combo Quay 4K HDR',
    categoryId: 'cat-1',
    brand: 'DJI',
    ownerId: 'u-1',
    pricePerDay: 250000,
    weeklyPrice: 1500000,
    deposit: 2000000,
    area: 'Bách Kinh Xây',
    pickupPoint: 'Cổng Parabol ĐH Bách Khoa Hà Nội, Giải Phóng',
    condition: 'Tốt',
    accessories: 'Tay cầm DJI RC có màn hình, 3 pin thông minh, hub sạc, túi đeo chéo, cánh dự phòng.',
    customPolicy: 'Chỉ bay ở khu vực được phép, không bay khi gió mạnh hoặc trời mưa.',
    description: 'Flycam trọng lượng nhẹ dưới 249g, quay dọc 4K thực thụ cho TikTok/Reels và quay toàn cảnh sự kiện trường học, dã ngoại.',
    images: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Đã duyệt',
    visible: true,
    schedule: {
      [fmtDate(5)]: 'booked',
      [fmtDate(11)]: 'owner_locked',
      [fmtDate(12)]: 'owner_locked'
    },
    reviews: []
  },
  {
    id: 'SP-04',
    title: 'Gimbal Chống Rung Điện Thoại DJI Osmo Mobile 6',
    categoryId: 'cat-1',
    brand: 'DJI',
    ownerId: 'u-6',
    pricePerDay: 150000,
    weeklyPrice: 850000,
    deposit: 1000000,
    area: 'Cầu Giấy',
    pickupPoint: 'Cổng chính ĐH Sư Phạm Hà Nội, 136 Xuân Thủy',
    condition: 'Mới 99%',
    accessories: 'Ngàm kẹp từ tính, chân tripod mini, cáp sạc Type-C, túi nhung.',
    customPolicy: 'Cân bằng điện thoại trên ngàm trước khi bật nguồn gimbal.',
    description: 'Gimbal chống rung 3 trục tích hợp gậy nối dài, hỗ trợ ActiveTrack 6.0 bám theo chủ thể tự động khi quay bài tập nhóm hoặc vlog.',
    images: [
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Đã duyệt',
    visible: true,
    schedule: {
      [fmtDate(8)]: 'owner_locked'
    },
    reviews: []
  },
  {
    id: 'SP-05',
    title: 'Máy Chiếu Mini Full HD Wanbo T2 Max + Chân Đỡ',
    categoryId: 'cat-2',
    brand: 'Wanbo',
    ownerId: 'u-4',
    pricePerDay: 100000,
    weeklyPrice: 600000,
    deposit: 700000,
    area: 'Bách Kinh Xây',
    pickupPoint: 'Cổng Trần Đại Nghĩa - ĐH Kinh tế Quốc dân',
    condition: 'Tốt',
    accessories: 'Điều khiển từ xa, dây nguồn, dây HDMI 2m, chân tripod cao 1.6m.',
    customPolicy: 'Không để vật cản sát khe tản nhiệt phía sau máy chiếu.',
    description: 'Máy chiếu Full HD có sẵn Android TV, YouTube, Netflix, kết nối HDMI với laptop để thuyết trình CLB hoặc xem phim cuối tuần tại phòng trọ.',
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Đã duyệt',
    visible: true,
    schedule: {
      // ORD-03 Đang thuê (Xanh dương)
      [fmtDate(-1)]: 'booked',
      [fmtDate(0)]: 'booked',
      [fmtDate(1)]: 'booked',
      [fmtDate(7)]: 'owner_locked'
    },
    reviews: [
      { id: 'rv-3', userId: 'u-2', userName: 'Trần Thảo Tiên', rating: 5, comment: 'Máy chiếu sáng rõ, loa êm, thuyết trình nhóm rất tiện!', tags: ['Đúng hẹn', 'Đúng mô tả'], date: '12/09/2026' }
    ]
  },
  {
    id: 'SP-06',
    title: 'Màn Hình Di Động ASUS ZenScreen 15.6 inch IPS Type-C',
    categoryId: 'cat-2',
    brand: 'ASUS',
    ownerId: 'u-7',
    pricePerDay: 120000,
    weeklyPrice: 700000,
    deposit: 1000000,
    area: 'ĐHQG',
    pickupPoint: 'Tòa nhà E3 Trường ĐH Công Nghệ - ĐHQGHN',
    condition: 'Mới 99%',
    accessories: 'Bao da kiêm chân đế, cáp USB-C to USB-C, cáp Mini HDMI.',
    customPolicy: 'Luôn gập bao da bảo vệ màn hình khi bỏ vào balo.',
    description: 'Màn hình phụ 15.6 inch siêu mỏng nhẹ cho sinh viên IT/Kinh tế chạy deadline, hackathon, thuyết trình đồ án.',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Đã duyệt',
    visible: true,
    schedule: {
      [fmtDate(3)]: 'booked',
      [fmtDate(4)]: 'booked'
    },
    reviews: []
  },
  {
    id: 'SP-07',
    title: 'Loa Kéo Bluetooth JBL PartyBox Kèm 2 Micro Không Dây',
    categoryId: 'cat-2',
    brand: 'JBL',
    ownerId: 'u-1',
    pricePerDay: 150000,
    weeklyPrice: 900000,
    deposit: 1200000,
    area: 'Bách Kinh Xây',
    pickupPoint: 'KTX Bách Khoa - Nhà B9, Tạ Quang Bửu',
    condition: 'Trầy xước nhẹ',
    accessories: '2 micro không dây UHF, dây sạc nguồn, túi đựng micro.',
    customPolicy: 'Không để loa ngoài trời mưa hoặc va đập mạnh khi di chuyển.',
    description: 'Loa công suất lớn, âm bass chắc khỏe, pin 8–10 tiếng chuyên phục vụ teambuilding, hội trại sinh viên, văn nghệ.',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Đã duyệt',
    visible: true,
    schedule: {
      [fmtDate(5)]: 'owner_locked',
      [fmtDate(6)]: 'owner_locked'
    },
    reviews: []
  },
  {
    id: 'SP-08',
    title: 'Bộ Vest Nam Kỷ Yếu Hàn Quốc Đen/Navy (Kèm Cà Vạt)',
    categoryId: 'cat-3',
    brand: 'Adam Store',
    ownerId: 'u-2',
    pricePerDay: 70000,
    weeklyPrice: 380000,
    deposit: 250000,
    area: 'ĐHQG',
    pickupPoint: 'KTX Mễ Trì / Sảnh ĐH Quốc Gia Xuân Thủy',
    condition: 'Mới 99%',
    accessories: 'Áo vest, quần âu đồng bộ, cà vạt lụa, túi bọc vest + móc treo.',
    customPolicy: 'Không cần giặt trước khi trả, mình đã bao gồm phí giặt hấp tiêu chuẩn.',
    description: 'Bộ vest form Hàn Quốc trẻ trung cho nam sinh viên cao 1m68–1m75, nặng 58–66kg, phù hợp chụp kỷ yếu hoặc bảo vệ khóa luận.',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Đã duyệt',
    visible: true,
    schedule: {
      [fmtDate(6)]: 'booked',
      [fmtDate(7)]: 'booked'
    },
    reviews: []
  },
  {
    id: 'SP-09',
    title: 'Áo Dài Ngũ Thân Truyền Thống Chụp Kỷ Yếu & Sự Kiện',
    categoryId: 'cat-3',
    brand: 'Việt Phục',
    ownerId: 'u-6',
    pricePerDay: 60000,
    weeklyPrice: 320000,
    deposit: 200000,
    area: 'Cầu Giấy',
    pickupPoint: 'Ngõ 130 Xuân Thủy, Cầu Giấy (Gần ĐH Quốc Gia)',
    condition: 'Mới 99%',
    accessories: 'Áo ngũ thân tơ tằm, quần trắng, khăn vấn, quạt giấy chụp hình.',
    customPolicy: 'Tránh làm dính vết bẩn khó giặt như trà sữa hoặc màu vẽ lên tà áo.',
    description: 'Áo dài ngũ thân may chuẩn phom truyền thống, chất vải thoáng mát, lên hình Hoàng Thành và Văn Miếu cực đẹp.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Đã duyệt',
    visible: true,
    schedule: {
      [fmtDate(9)]: 'booked'
    },
    reviews: [
      { id: 'rv-4', userId: 'u-1', userName: 'Nguyễn Minh Quân', rating: 5, comment: 'Áo thơm phức, phẳng phiu, đủ phụ kiện quạt và khăn vấn. Hoàn cọc tức thì!', tags: ['Đúng hẹn', 'Thân thiện', 'Đúng mô tả'], date: '20/09/2026' }
    ]
  },
  {
    id: 'SP-10',
    title: 'Set Đồ Biểu Diễn Văn Nghệ / Đồng Phục Nhảy Hiện Đại',
    categoryId: 'cat-3',
    brand: 'Local Brand',
    ownerId: 'u-8',
    pricePerDay: 45000,
    weeklyPrice: 240000,
    deposit: 150000,
    area: 'ĐHQG',
    pickupPoint: 'Cổng trường ĐH Thương Mại / ĐHQG',
    condition: 'Tốt',
    accessories: 'Áo khoác varsity + chân váy/quần cargo đồng bộ + phụ kiện dây xích.',
    customPolicy: 'Kiểm tra đủ phụ kiện đi kèm khi nhận và trả đồ.',
    description: 'Set trang phục nhảy hiện đại nổi bật trên sân khấu chào tân sinh viên, hội diễn văn nghệ liên khoa.',
    images: [
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Đã duyệt',
    visible: true,
    schedule: {},
    reviews: []
  },
  {
    id: 'SP-11',
    title: 'Nồi Chiên Không Dầu Philips HD9252 Dung Tích 4.1L',
    categoryId: 'cat-4',
    brand: 'Philips',
    ownerId: 'u-4',
    pricePerDay: 35000,
    weeklyPrice: 190000,
    deposit: 300000,
    area: 'Bách Kinh Xây',
    pickupPoint: 'Ngõ Tự Do - ĐH Kinh tế Quốc dân',
    condition: 'Tốt',
    accessories: 'Lòng nồi chống dính, vỉ nướng, xấp giấy nến lót nồi.',
    customPolicy: 'Vui lòng dùng giấy nến đi kèm và rửa sạch lòng nồi bằng khăn mềm trước khi trả.',
    description: 'Nồi chiên không dầu Philips chính hãng giúp các buổi liên hoan phòng trọ nướng gà, khoai tây, thịt nướng nhanh gọn không khói.',
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Đã duyệt',
    visible: true,
    schedule: {
      [fmtDate(8)]: 'owner_locked'
    },
    reviews: []
  },
  {
    id: 'SP-12',
    title: 'Nồi Lẩu Điện Đa Năng Sunhouse 4L Cho 4-6 Người',
    categoryId: 'cat-4',
    brand: 'Sunhouse',
    ownerId: 'u-3',
    pricePerDay: 25000,
    weeklyPrice: 140000,
    deposit: 180000,
    area: 'Cầu Giấy',
    pickupPoint: 'Chợ Nhà Xanh, Phan Văn Trường, Cầu Giấy',
    condition: 'Mới 99%',
    accessories: 'Nồi lẩu lòng rời, nắp kính cường lực, dây nguồn rời, muôi thủng.',
    customPolicy: 'Không nhúng phần đế điện vào nước khi rửa.',
    description: 'Nồi lẩu điện 1500W sôi cực nhanh, lòng nồi tháo rời dễ vệ sinh, cực hợp tụ tập ăn lẩu cuối tuần cùng hội bạn.',
    images: [
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Đã duyệt',
    visible: true,
    schedule: {
      [fmtDate(5)]: 'booked',
      [fmtDate(6)]: 'booked'
    },
    reviews: []
  },
  {
    id: 'SP-13',
    title: 'Máy Tính Khoa Học Casio fx-580VN X Chính Hãng Bitex',
    categoryId: 'cat-5',
    brand: 'Casio',
    ownerId: 'u-5',
    pricePerDay: 15000,
    weeklyPrice: 80000,
    deposit: 150000,
    area: 'Bách Kinh Xây',
    pickupPoint: 'Cổng trường ĐH Xây Dựng Hà Nội, 55 Giải Phóng',
    condition: 'Mới 99%',
    accessories: 'Nắp trượt bảo vệ zin, pin mới thay.',
    customPolicy: 'Không viết bút mực hoặc dán sticker lên thân máy.',
    description: 'Máy tính Casio fx-580VN X chính hãng được mang vào phòng thi Giải tích, Đại số, Xác suất thống kê, Vật lý đại cương.',
    images: [
      'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Đã duyệt',
    visible: true,
    schedule: {
      [fmtDate(3)]: 'booked'
    },
    reviews: []
  },
  {
    id: 'SP-14',
    title: 'Bảng Vẽ Điện Tử Wacom Intuos S Kèm Bút Cảm Ứng 4K',
    categoryId: 'cat-5',
    brand: 'Wacom',
    ownerId: 'u-7',
    pricePerDay: 35000,
    weeklyPrice: 190000,
    deposit: 300000,
    area: 'ĐHQG',
    pickupPoint: 'Thư viện ĐHQG Hà Nội, 144 Xuân Thủy',
    condition: 'Tốt',
    accessories: 'Bút Wacom Pen 4K không dùng pin, 3 ngòi dự phòng, cáp USB, túi chống sốc.',
    customPolicy: 'Bảo quản kỹ bút cảm ứng, tránh làm rơi bút xuống nền cứng.',
    description: 'Bảng vẽ đồ họa Wacom Intuos S cho sinh viên Thiết kế, Kiến trúc, Đa phương tiện làm bài tập lớn Illustrator/Photoshop.',
    images: [
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Đã duyệt',
    visible: true,
    schedule: {
      [fmtDate(10)]: 'owner_locked',
      [fmtDate(11)]: 'owner_locked'
    },
    reviews: []
  },
  {
    id: 'SP-15',
    title: 'Xe Đạp Địa Hình Thể Thao Giant ATX 720 (Khung Nhôm)',
    categoryId: 'cat-6',
    brand: 'Giant',
    ownerId: 'u-2',
    pricePerDay: 45000,
    weeklyPrice: 250000,
    deposit: 500000,
    area: 'ĐHQG',
    pickupPoint: 'Cổng KTX Ngoại Ngữ - ĐHQGHN',
    condition: 'Tốt',
    accessories: 'Khóa dây số, đèn hậu LED ban đêm, bình nước thể thao, mũ bảo hiểm.',
    customPolicy: 'Luôn khóa xe cẩn thận khi gửi ở bãi hoặc dừng đỗ.',
    description: 'Xe đạp thể thao Giant bộ đề Shimano 21 tốc độ, đạp vòng Hồ Tây cuối tuần hoặc đi học liên trường cực nhẹ nhàng.',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Đã duyệt',
    visible: true,
    schedule: {
      [fmtDate(6)]: 'booked',
      [fmtDate(7)]: 'booked'
    },
    reviews: []
  },
  {
    id: 'SP-16',
    title: 'Xe Scooter Điện Gấp Gọn Xiaomi Mi Electric Scooter 3',
    categoryId: 'cat-6',
    brand: 'Xiaomi',
    ownerId: 'u-3',
    pricePerDay: 60000,
    weeklyPrice: 350000,
    deposit: 800000,
    area: 'Cầu Giấy',
    pickupPoint: 'Công viên Cầu Giấy / ĐH Sư Phạm',
    condition: 'Mới 99%',
    accessories: 'Bộ sạc zin, khóa đĩa chống trộm, túi treo đầu xe.',
    customPolicy: 'Tải trọng tối đa 100kg, không đi dưới mưa ngập nước.',
    description: 'Scooter điện gấp gọn trong 3 giây, tốc độ 25km/h, quãng đường 30km/lần sạc, tiện di chuyển trong khuôn viên đại học lớn.',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Đã duyệt',
    visible: true,
    schedule: {},
    reviews: []
  },
  {
    id: 'SP-17',
    title: 'Vợt Cầu Lông Yonex Astrox 77 Đan Cước 10.5kg + Bao Đơn',
    categoryId: 'cat-7',
    brand: 'Yonex',
    ownerId: 'u-5',
    pricePerDay: 30000,
    weeklyPrice: 160000,
    deposit: 200000,
    area: 'Bách Kinh Xây',
    pickupPoint: 'Nhà thi đấu ĐH Bách Khoa Hà Nội',
    condition: 'Tốt',
    accessories: 'Bao nhung Yonex, quấn cán mới thay, 2 quả cầu Hải Yến.',
    customPolicy: 'Tránh va chạm vợt vào sàn cứng hoặc vợt đồng đội khi đánh đôi.',
    description: 'Vợt cầu lông Yonex công thủ toàn diện cho các bạn học môn Giáo dục thể chất hoặc giao lưu giải cầu lông sinh viên.',
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Đã duyệt',
    visible: true,
    schedule: {
      [fmtDate(4)]: 'owner_locked'
    },
    reviews: []
  },
  {
    id: 'SP-18',
    title: 'Bộ 2 Vợt Pickleball Carbon T700 + 4 Bóng Thi Đấu',
    categoryId: 'cat-7',
    brand: 'Joola',
    ownerId: 'u-6',
    pricePerDay: 35000,
    weeklyPrice: 180000,
    deposit: 250000,
    area: 'Cầu Giấy',
    pickupPoint: 'Sân Pickleball Dịch Vọng, Cầu Giấy',
    condition: 'Mới 99%',
    accessories: '2 vợt mặt nhám Carbon T700, 4 bóng 40 lỗ ngoài trời, túi đựng.',
    customPolicy: 'Kiểm tra mặt vợt và số lượng bóng khi nhận/trả.',
    description: 'Combo 2 vợt Pickleball nhẹ, trợ lực tốt và tạo xoáy cao, cực hợp cho các bạn sinh viên ra sân trải nghiệm cuối tuần.',
    images: [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Đã duyệt',
    visible: true,
    schedule: {},
    reviews: []
  },
  {
    id: 'SP-19',
    title: 'Lều Cắm Trại Tự Bung 4 Người 2 Lớp Chống Mưa Kèm Thảm',
    categoryId: 'cat-8',
    brand: 'Naturehike',
    ownerId: 'u-2',
    pricePerDay: 60000,
    weeklyPrice: 320000,
    deposit: 300000,
    area: 'ĐHQG',
    pickupPoint: 'Cổng chính ĐHQG Hà Nội, 144 Xuân Thủy',
    condition: 'Mới 99%',
    accessories: 'Lều tự bung 4 người, tấm phủ chống mưa, thảm cách nhiệt, 8 cọc ghim đất, đèn lều mini.',
    customPolicy: 'Vui lòng giũ sạch cát/lá cây bên trong lều trước khi gấp gọn vào túi.',
    description: 'Lều cắm trại tự bung trong 30 giây không cần lắp khung phức tạp, phù hợp đi cắm trại Hàm Lợn, Đồng Đò, Ba Vì.',
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Đã duyệt',
    visible: true,
    schedule: {
      // ORD-02 Đã đặt cọc (Xanh dương)
      [fmtDate(4)]: 'booked',
      [fmtDate(5)]: 'booked',
      [fmtDate(12)]: 'owner_locked'
    },
    reviews: [
      { id: 'rv-5', userId: 'u-3', userName: 'Lê Hoàng Nam', rating: 5, comment: 'Lều rộng rãi, sạch sẽ, bung ra siêu nhanh, có sẵn cả thảm cách nhiệt.', tags: ['Đúng hẹn', 'Giữ gìn đồ', 'Đúng mô tả'], date: '10/09/2026' }
    ]
  },
  {
    id: 'SP-20',
    title: 'Bộ Đàm Sự Kiện Baofeng BF-888S (Set 4 Chiếc Kèm Tai Nghe)',
    categoryId: 'cat-9',
    brand: 'Baofeng',
    ownerId: 'u-5',
    pricePerDay: 40000,
    weeklyPrice: 220000,
    deposit: 250000,
    area: 'Bách Kinh Xây',
    pickupPoint: 'KTX ĐH Xây Dựng, 72 Trần Đại Nghĩa',
    condition: 'Tốt',
    accessories: '4 thân máy bộ đàm, 4 ăng-ten, 4 tai nghe choàng tai, 4 cốc sạc bàn.',
    customPolicy: 'Giữ nguyên kẹp lưng và tai nghe, không tự ý cài lại tần số.',
    description: 'Set 4 bộ đàm liên lạc cự ly 1–2km cho ban tổ chức sự kiện CLB, ngày hội việc làm, chương trình tình nguyện.',
    images: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Đã duyệt',
    visible: true,
    schedule: {
      // ORD-07 Đã hủy -> lịch đã tự giải phóng về trống!
      [fmtDate(9)]: 'owner_locked'
    },
    reviews: []
  }
];

// Additional Admin Queue listings for F-A03 testing (Chờ duyệt, Bị ẩn, Bị báo cáo)
const INITIAL_ADMIN_EXTRA_LISTINGS = [
  {
    id: 'SP-21',
    title: 'Bếp Ga Mini Dã Ngoại Kèm Vali Nhựa Chống Gió',
    categoryId: 'cat-8',
    brand: 'NaMilux',
    ownerId: 'u-1',
    pricePerDay: 40000,
    weeklyPrice: 200000,
    deposit: 200000,
    area: 'Bách Kinh Xây',
    pickupPoint: 'Cổng Parabol ĐH Bách Khoa Hà Nội',
    condition: 'Mới 99%',
    accessories: 'Bếp ga mini, hộp nhựa xách tay, kiềng chắn gió.',
    customPolicy: 'Tháo bình ga ra khỏi bếp sau khi sử dụng xong.',
    description: 'Bếp ga du lịch NaMilux an toàn có van ngắt tự động, phục vụ dã ngoại hoặc nấu lẩu.',
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Chờ duyệt',
    visible: true,
    schedule: {},
    reviews: []
  },
  {
    id: 'SP-22',
    title: 'Đèn Pin Phượt Siêu Sáng Chống Nước IPX6 Pin Sạc',
    categoryId: 'cat-9',
    brand: 'Naturehike',
    ownerId: 'u-10',
    pricePerDay: 25000,
    weeklyPrice: 120000,
    deposit: 150000,
    area: 'Cầu Giấy',
    pickupPoint: 'Ngõ 165 Cầu Giấy',
    condition: 'Trầy xước nhẹ',
    accessories: 'Đèn pin, dây sạc USB-C, dây đeo cổ tay.',
    customPolicy: 'Không chiếu trực tiếp vào mắt.',
    description: 'Đèn pin leo núi, đi phượt đêm, có chế độ SOS khẩn cấp.',
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80'
    ],
    approvalStatus: 'Bị báo cáo',
    reportReason: 'Ảnh chụp sản phẩm hơi mờ và mô tả phụ kiện chưa rõ ràng.',
    visible: true,
    schedule: {},
    reviews: []
  }
];

// 11. 10 TRẠNG THÁI VÒNG ĐỜI ĐƠN THUÊ (F-S08)
const ORDER_STATUSES = [
  'Chờ thanh toán',
  'Đã đặt cọc',
  'Sắp nhận đồ',
  'Đang thuê',
  'Sắp đến hạn',
  'Quá hạn',
  'Đã trả đồ',
  'Hoàn tất',
  'Tranh chấp',
  'Đã hủy'
];

// 44. 7 ĐƠN HÀNG MẪU ĐÚNG TRONG TÀI LIỆU (ORD-01 -> ORD-07)
const INITIAL_ORDERS = [
  {
    id: 'ORD-01',
    productId: 'SP-01',
    productTitle: 'Máy ảnh Sony A6400 + Lens Kit 16-50mm Quay 4K',
    productImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    renterId: 'u-1',
    renterName: 'Nguyễn Minh Quân',
    ownerId: 'u-3',
    ownerName: 'Lê Hoàng Nam',
    startDate: fmtDate(2),
    endDate: fmtDate(3),
    days: 2,
    pricePerDay: 200000,
    baseRental: 400000,
    serviceFee: 40000,
    deposit: 1800000,
    totalAmount: 2240000,
    status: 'Chờ thanh toán',
    escrowStatus: 'Chờ thanh toán QR',
    countdownSeconds: 405, // 06:45 đúng theo đặc tả ORD-01
    createdAt: 'Hôm nay, 14:43',
    checkinPhotos: [],
    checkoutPhotos: [],
    renterCheckedIn: false,
    ownerCheckedIn: false,
    ownerCheckedOut: false,
    renterRated: false,
    ownerRated: false,
    dispute: null
  },
  {
    id: 'ORD-02',
    productId: 'SP-19',
    productTitle: 'Lều Cắm Trại Tự Bung 4 Người 2 Lớp Chống Mưa Kèm Thảm',
    productImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
    renterId: 'u-1',
    renterName: 'Nguyễn Minh Quân',
    ownerId: 'u-2',
    ownerName: 'Trần Thảo Tiên',
    startDate: fmtDate(4),
    endDate: fmtDate(5),
    days: 2,
    pricePerDay: 60000,
    baseRental: 120000,
    serviceFee: 12000,
    deposit: 300000, // Cọc 300.000đ trong Escrow theo đặc tả ORD-02
    totalAmount: 432000,
    status: 'Đã đặt cọc',
    escrowStatus: 'Cọc đang giữ',
    countdownSeconds: 0,
    createdAt: 'Hôm nay, 10:15',
    checkinPhotos: [],
    checkoutPhotos: [],
    renterCheckedIn: false,
    ownerCheckedIn: false,
    ownerCheckedOut: false,
    renterRated: false,
    ownerRated: false,
    dispute: null
  },
  {
    id: 'ORD-03',
    productId: 'SP-05',
    productTitle: 'Máy Chiếu Mini Full HD Wanbo T2 Max + Chân Đỡ',
    productImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    renterId: 'u-1',
    renterName: 'Nguyễn Minh Quân',
    ownerId: 'u-4',
    ownerName: 'Phạm Khánh Linh',
    startDate: fmtDate(-1),
    endDate: fmtDate(1),
    days: 3,
    pricePerDay: 100000,
    baseRental: 300000,
    serviceFee: 30000,
    deposit: 700000,
    totalAmount: 1030000,
    status: 'Đang thuê',
    escrowStatus: 'Cọc đang giữ',
    countdownSeconds: 0,
    createdAt: 'Hôm qua, 09:00',
    checkinPhotos: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80'
    ],
    checkoutPhotos: [],
    renterCheckedIn: true,
    ownerCheckedIn: true,
    ownerCheckedOut: false,
    renterRated: false,
    ownerRated: false,
    dispute: null
  },
  {
    id: 'ORD-04',
    productId: 'SP-11',
    productTitle: 'Nồi Chiên Không Dầu Philips HD9252 Dung Tích 4.1L',
    productImage: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80',
    renterId: 'u-1',
    renterName: 'Nguyễn Minh Quân',
    ownerId: 'u-4',
    ownerName: 'Phạm Khánh Linh',
    startDate: fmtDate(-3),
    endDate: fmtDate(-1),
    days: 2,
    pricePerDay: 35000,
    baseRental: 70000,
    serviceFee: 7000,
    deposit: 300000,
    totalAmount: 377000,
    status: 'Đã trả đồ',
    escrowStatus: 'Cọc chờ xử lý',
    inspectRemainingHours: '03h 18p',
    countdownSeconds: 0,
    createdAt: '3 ngày trước',
    checkinPhotos: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'
    ],
    checkoutPhotos: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=600&q=80'
    ],
    renterCheckedIn: true,
    ownerCheckedIn: true,
    ownerCheckedOut: true,
    renterRated: false,
    ownerRated: false,
    dispute: null
  },
  {
    id: 'ORD-05',
    productId: 'SP-09',
    productTitle: 'Áo Dài Ngũ Thân Truyền Thống Chụp Kỷ Yếu & Sự Kiện',
    productImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    renterId: 'u-1',
    renterName: 'Nguyễn Minh Quân',
    ownerId: 'u-6',
    ownerName: 'Đặng Ngọc Mai',
    startDate: fmtDate(-7),
    endDate: fmtDate(-6),
    days: 2,
    pricePerDay: 60000,
    baseRental: 120000,
    serviceFee: 12000,
    deposit: 200000,
    totalAmount: 332000,
    status: 'Hoàn tất',
    escrowStatus: 'Cọc đã hoàn',
    countdownSeconds: 0,
    createdAt: '7 ngày trước',
    checkinPhotos: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'
    ],
    checkoutPhotos: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80'
    ],
    renterCheckedIn: true,
    ownerCheckedIn: true,
    ownerCheckedOut: true,
    renterRated: true,
    ownerRated: true,
    ratingScore: 5,
    ratingTags: ['Đúng hẹn', 'Thân thiện', 'Giữ gìn đồ', 'Đúng mô tả'],
    ratingComment: 'Áo dài đẹp, sạch sẽ, hoàn cọc tự động siêu nhanh!',
    dispute: null
  },
  {
    id: 'ORD-06',
    productId: 'SP-07',
    productTitle: 'Loa Kéo Bluetooth JBL PartyBox Kèm 2 Micro Không Dây',
    productImage: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    renterId: 'u-10',
    renterName: 'Trịnh Quốc Hưng',
    ownerId: 'u-1',
    ownerName: 'Nguyễn Minh Quân',
    startDate: fmtDate(-5),
    endDate: fmtDate(-3),
    days: 2,
    pricePerDay: 150000,
    baseRental: 300000,
    serviceFee: 30000,
    deposit: 1200000,
    totalAmount: 1530000,
    status: 'Tranh chấp',
    escrowStatus: 'Cọc đang phong tỏa',
    countdownSeconds: 0,
    createdAt: '5 ngày trước',
    checkinPhotos: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80'
    ],
    checkoutPhotos: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80'
    ],
    renterCheckedIn: true,
    ownerCheckedIn: true,
    ownerCheckedOut: true,
    renterRated: false,
    ownerRated: false,
    dispute: {
      issueType: 'Hỏng nhẹ',
      proposedDeduction: 200000,
      ownerStatement: 'Khi nhận lại loa sau buổi trại, phần vỏ nhựa góc phải dưới bị nứt khoảng 4cm do va đập lúc chở xe máy. Đề nghị khấu trừ 200.000đ chi phí hàn vỏ thẩm mỹ.',
      renterStatement: 'Lúc chở về trời tối mình lỡ va nhẹ vào bậc thềm KTX làm nứt nhẹ góc vỏ nhựa nhưng loa vẫn hát bình thường. Mong Admin xem xét mức khấu trừ hợp lý.',
      evidencePhotos: [
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80'
      ],
      resolved: false,
      resolutionType: null,
      resolutionNote: ''
    }
  },
  {
    id: 'ORD-07',
    productId: 'SP-20',
    productTitle: 'Bộ Đàm Sự Kiện Baofeng BF-888S (Set 4 Chiếc Kèm Tai Nghe)',
    productImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    renterId: 'u-1',
    renterName: 'Nguyễn Minh Quân',
    ownerId: 'u-5',
    ownerName: 'Vũ Đức Anh',
    startDate: fmtDate(1),
    endDate: fmtDate(2),
    days: 2,
    pricePerDay: 40000,
    baseRental: 80000,
    serviceFee: 8000,
    deposit: 250000,
    totalAmount: 338000,
    status: 'Đã hủy',
    cancelReason: 'Quá hạn 10 phút soft-lock chưa quét QR thanh toán. Đã tự giải phóng lịch.',
    escrowStatus: 'Không phát sinh',
    countdownSeconds: 0,
    createdAt: 'Hôm qua, 21:10',
    checkinPhotos: [],
    checkoutPhotos: [],
    renterCheckedIn: false,
    ownerCheckedIn: false,
    ownerCheckedOut: false,
    renterRated: false,
    ownerRated: false,
    dispute: null
  }
];

// 17. F-S14 — THÔNG BÁO (Đúng 8 loại sự kiện mô phỏng trong đặc tả)
const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'Đơn mới thanh toán',
    title: 'Đơn mới thanh toán',
    message: 'Đơn ORD-02 (Lều Cắm Trại Tự Bung 4 Người) đã được thanh toán và khóa lịch thành công.',
    time: '10 phút trước',
    read: false,
    orderId: 'ORD-02'
  },
  {
    id: 'notif-2',
    type: 'QR thành công',
    title: 'QR thành công',
    message: 'VietQR xác nhận tự động 432.000đ cho đơn ORD-02. Tiền cọc 300.000đ đã vào Escrow.',
    time: '10 phút trước',
    read: false,
    orderId: 'ORD-02'
  },
  {
    id: 'notif-3',
    type: 'Nhắc nhận đồ trước 24h',
    title: 'Nhắc nhận đồ trước 24h',
    message: 'Nhắc hẹn: Bạn có lịch nhận Lều Cắm Trại (ORD-02) tại Cổng chính ĐHQG Hà Nội vào ngày mai.',
    time: '1 giờ trước',
    read: false,
    orderId: 'ORD-02'
  },
  {
    id: 'notif-4',
    type: 'Nhắc trả đồ trước 12h',
    title: 'Nhắc trả đồ trước 12h',
    message: 'Đơn ORD-03 (Máy Chiếu Mini Wanbo) sắp đến hạn trả trong 12 giờ tới. Hãy chuẩn bị bàn giao.',
    time: '2 giờ trước',
    read: true,
    orderId: 'ORD-03'
  },
  {
    id: 'notif-5',
    type: 'Quá hạn',
    title: 'Quá hạn',
    message: 'Cảnh báo: Đơn ORD-07 đã quá hạn 10 phút thanh toán QR, hệ thống tự hủy và giải phóng lịch.',
    time: 'Hôm qua',
    read: true,
    orderId: 'ORD-07'
  },
  {
    id: 'notif-6',
    type: 'Cọc đã hoàn',
    title: 'Cọc đã hoàn',
    message: 'Escrow đã hoàn tự động 100% tiền cọc (200.000đ) của đơn ORD-05 (Áo Dài Ngũ Thân) về tài khoản MB Bank.',
    time: '3 ngày trước',
    read: true,
    orderId: 'ORD-05'
  },
  {
    id: 'notif-7',
    type: 'Có tranh chấp cần phản hồi',
    title: 'Có tranh chấp cần phản hồi',
    message: 'Đơn ORD-06 (Loa Kéo JBL PartyBox) đang ở trạng thái Tranh chấp (đề nghị khấu trừ 200.000đ). Chờ Admin phân xử.',
    time: '2 ngày trước',
    read: false,
    orderId: 'ORD-06'
  },
  {
    id: 'notif-8',
    type: 'Có đánh giá mới',
    title: 'Có đánh giá mới',
    message: 'Đặng Ngọc Mai đã đánh giá bạn 5 sao từ đơn ORD-05: "Giữ gìn đồ rất cẩn thận, đúng hẹn!".',
    time: '3 ngày trước',
    read: true,
    orderId: 'ORD-05'
  }
];

// 18. F-S15 — NHẮN TIN NHANH (Gắn với Đơn & Món đồ, chỉ hỗ trợ trao đổi giờ/địa điểm giao nhận)
const INITIAL_CHATS = [
  {
    id: 'chat-1',
    orderId: 'ORD-02',
    productId: 'SP-19',
    productTitle: 'Lều Cắm Trại Tự Bung 4 Người 2 Lớp Chống Mưa Kèm Thảm',
    productImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=300&q=80',
    partnerId: 'u-2',
    partnerName: 'Trần Thảo Tiên',
    partnerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    partnerSchool: 'ĐH Ngoại Ngữ - ĐHQGHN',
    unread: 1,
    messages: [
      { senderId: 'u-2', text: 'Chào Quân! Hệ thống đã xác nhận đơn tự động ORD-02 rồi nhé.', time: '10:16' },
      { senderId: 'u-1', text: 'Chào Tiên, sáng ngày nhận đồ mình qua cổng chính ĐHQG lúc 8h30 nhận lều được không?', time: '10:18' },
      { senderId: 'u-2', text: 'Ok chuẩn luôn nha! 8h30 mình mang lều + thảm xuống sảnh cổng chính để chụp ảnh Check-in nhé.', time: '10:20' }
    ]
  },
  {
    id: 'chat-2',
    orderId: 'ORD-03',
    productId: 'SP-05',
    productTitle: 'Máy Chiếu Mini Full HD Wanbo T2 Max + Chân Đỡ',
    productImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80',
    partnerId: 'u-4',
    partnerName: 'Phạm Khánh Linh',
    partnerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    partnerSchool: 'ĐH Kinh tế Quốc dân',
    unread: 0,
    messages: [
      { senderId: 'u-1', text: 'Mình đã nhận máy chiếu và chụp 2 ảnh Check-in lên hệ thống rồi nhé Linh!', time: 'Hôm qua' },
      { senderId: 'u-4', text: 'Mình cũng bấm Xác nhận đã giao đồ rồi. Chúc nhóm bạn thuyết trình tốt nha!', time: 'Hôm qua' }
    ]
  },
  {
    id: 'chat-3',
    orderId: 'ORD-06',
    productId: 'SP-07',
    productTitle: 'Loa Kéo Bluetooth JBL PartyBox Kèm 2 Micro Không Dây',
    productImage: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=300&q=80',
    partnerId: 'u-10',
    partnerName: 'Trịnh Quốc Hưng',
    partnerAvatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=200&q=80',
    partnerSchool: 'Cao đẳng Du lịch Hà Nội',
    unread: 0,
    messages: [
      { senderId: 'u-1', text: 'Hưng ơi lúc trả loa góc dưới bên phải bị nứt vỏ nhựa, mình đã chụp ảnh Check-out và gửi báo cáo lên Admin phân xử nhé.', time: '2 ngày trước' },
      { senderId: 'u-10', text: 'Mình đã ghi giải trình trên đơn ORD-06 rồi, chờ Admin xử lý cọc nhé.', time: '2 ngày trước' }
    ]
  }
];

// 24. F-A05 — LỊCH SỬ ĐỐI SOÁT TỰ ĐỘNG ESCROW POOL
const INITIAL_ESCROW_LOGS = [
  {
    id: 'ESC-106',
    orderId: 'ORD-02',
    action: 'Ký quỹ tiền cọc (VietQR Auto)',
    amount: 300000,
    type: 'hold',
    note: 'Tự động phong tỏa cọc từ giao dịch SR ORD-02',
    time: 'Hôm nay, 10:15'
  },
  {
    id: 'ESC-105',
    orderId: 'ORD-03',
    action: 'Ký quỹ tiền cọc (VietQR Auto)',
    amount: 700000,
    type: 'hold',
    note: 'Đang giữ cọc an toàn trong thời gian thuê máy chiếu',
    time: 'Hôm qua, 09:00'
  },
  {
    id: 'ESC-104',
    orderId: 'ORD-04',
    action: 'Chờ giải phóng cọc (4h Check-out)',
    amount: 300000,
    type: 'pending_release',
    note: 'Đã trả đồ, tự động hoàn 100% sau 4h nếu không có khiếu nại',
    time: 'Hôm nay, 11:30'
  },
  {
    id: 'ESC-103',
    orderId: 'ORD-06',
    action: 'Đóng băng cọc do Tranh chấp',
    amount: 1200000,
    type: 'frozen',
    note: 'Chủ đồ báo cáo Hỏng nhẹ (Đề nghị khấu trừ 200.000đ)',
    time: '2 ngày trước'
  },
  {
    id: 'ESC-102',
    orderId: 'ORD-05',
    action: 'Hoàn cọc tự động 100% + Giải ngân',
    amount: 200000,
    type: 'refunded',
    note: 'Hoàn 200.000đ cọc cho Nguyễn Minh Quân; Giải ngân 120.000đ cho chủ đồ',
    time: '3 ngày trước'
  }
];
