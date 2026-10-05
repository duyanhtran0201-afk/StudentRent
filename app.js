// StudentRent - Core Application Engine & Student/Guest Views
// Strictly implements F-G01 -> F-G05 & F-S01 -> F-S16

const state = {
  currentPage: 'home', // 'home' | 'catalog' | 'detail' | 'payment' | 'post-item' | 'dashboard' | 'profile' | 'chat' | 'wishlist' | 'admin'
  currentUser: null, // null (Guest) | student object | admin object
  categories: JSON.parse(JSON.stringify(INITIAL_CATEGORIES)),
  users: JSON.parse(JSON.stringify(INITIAL_USERS)),
  products: [...JSON.parse(JSON.stringify(INITIAL_PRODUCTS)), ...JSON.parse(JSON.stringify(INITIAL_ADMIN_EXTRA_LISTINGS))],
  orders: JSON.parse(JSON.stringify(INITIAL_ORDERS)),
  notifications: JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS)),
  chats: JSON.parse(JSON.stringify(INITIAL_CHATS)),
  escrowLogs: JSON.parse(JSON.stringify(INITIAL_ESCROW_LOGS)),
  userReports: [],
  wishlist: ['SP-01', 'SP-19'],

  // Search & Filter State (F-G02, F-G03)
  filters: {
    keyword: '',
    categoryId: 'all',
    area: 'all',
    maxPrice: 250000,
    maxDeposit: 2000000,
    minRating: 0, // 0 | 3 | 4
    startDate: '',
    endDate: '',
    sortBy: 'relevant', // 'relevant' | 'price_asc' | 'price_desc' | 'rating_desc' | 'nearest'
    visibleCount: 9
  },
  mobileFilterOpen: false,

  // Product Detail & Booking Engine State (F-G04, F-S03, F-S04, F-S05, F-S06)
  selectedProductId: 'SP-01',
  selectedImageIdx: 0,
  bookingStart: fmtDate(0),
  bookingEnd: fmtDate(1),
  conflictAlert: null, // For concurrent booking conflict simulation

  // Active Payment Order (F-S07)
  activePaymentOrderId: 'ORD-01',
  paymentSuccessEffect: false,
  paymentErrorMsg: '',

  // Step Wizard 4 Steps (F-S02)
  wizardStep: 1,
  editingProductId: null,
  wizardData: {
    title: '',
    categoryId: 'cat-1',
    brand: '',
    condition: 'Mới 99%',
    description: '',
    accessories: '',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'
    ],
    pricePerDay: 180000,
    weeklyPrice: 1050000,
    deposit: 1500000,
    area: 'Bách Kinh Xây',
    pickupPoint: 'Cổng Parabol ĐH Bách Khoa Hà Nội',
    customPolicy: 'Giữ gìn đồ cẩn thận, trả đúng giờ hẹn.',
    schedule: {}
  },

  // Personal Dashboard & Transaction History (F-S13, Section 39)
  dashboardTab: 'rented_in', // 'rented_in' ("Đồ tôi đã thuê") | 'rented_out' ("Đồ tôi cho thuê")
  txStatusFilter: 'all',
  txTimeFilter: 'all',
  ownerManageProductId: 'SP-03',

  // Chat State (F-S15, Section 40)
  activeChatId: 'chat-1',
  mobileChatView: 'list', // 'list' | 'room'

  // Notifications Dropdown
  notifOpen: false,

  // Active Modals
  authModal: null, // null | 'login' | 'register' | 'otp' | 'complete_profile' | 'forgot_pw'
  pendingRegData: null,
  publicProfileUserId: null,
  checkinModalOrderId: null,
  checkoutModalOrderId: null,
  disputeModalOrderId: null,
  ratingModalOrderId: null,
  reportModal: null, // { type: 'product'|'user', targetId, targetName }
  contractModalOrderId: null,

  // Admin Portal State (Section 20-27, 41)
  adminTab: 'dashboard', // 'dashboard' | 'users' | 'listings' | 'transactions' | 'escrow' | 'disputes' | 'categories' | 'reports'
  adminUserSearch: '',
  adminUserFilter: 'all',
  adminListingFilter: 'all', // 'all' | 'Chờ duyệt' | 'Đã duyệt' | 'Bị ẩn' | 'Bị báo cáo'
  adminListingSearch: '',
  adminTxFilter: 'all',
  adminTxSearch: '',
  adminActiveDisputeOrderId: 'ORD-06',
  adminRejectModalProductId: null,
  adminUserDetailId: null,
  adminCategoryModal: null
};

// Format VND Currency
function formatVND(amount) {
  return Number(amount || 0).toLocaleString('vi-VN') + 'đ';
}

function formatDateVN(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatCountdown(sec) {
  const s = Math.max(0, Math.floor(sec));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function getCategoryById(catId) {
  return state.categories.find(c => c.id === catId) || state.categories[0];
}

function getUserById(userId) {
  return state.users.find(u => u.id === userId) || state.users[0];
}

function getProductById(prodId) {
  return state.products.find(p => p.id === prodId) || state.products[0];
}

function getOrderById(ordId) {
  return state.orders.find(o => o.id === ordId);
}

// Toast Notification Helper
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const colors = {
    success: 'bg-emerald-600 text-white border-emerald-700',
    warning: 'bg-amber-500 text-white border-amber-600',
    error: 'bg-red-600 text-white border-red-700',
    info: 'bg-slate-900 text-white border-slate-800'
  };
  const toast = document.createElement('div');
  toast.className = `px-4 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-2.5 page-enter ${colors[type] || colors.info}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

// Add System Notification (Strictly 8 allowed types in F-S14)
function pushNotification(type, message, orderId = '') {
  state.notifications.unshift({
    id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 100),
    type,
    title: type,
    message,
    time: 'Vừa xong',
    read: false,
    orderId
  });
}

// Status Badge Generator matching Section 11 & Section 33
function renderOrderStatusBadge(status) {
  const map = {
    'Chờ thanh toán': { bg: '#FEF3C7', text: '#B45309', dot: '#F59E0B' },
    'Đã đặt cọc': { bg: '#DBEAFE', text: '#1D4ED8', dot: '#3B82F6' },
    'Sắp nhận đồ': { bg: '#E0F2FE', text: '#0369A1', dot: '#3B82F6' },
    'Đang thuê': { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
    'Sắp đến hạn': { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
    'Quá hạn': { bg: '#FEE2E2', text: '#B91C1C', dot: '#EF4444' },
    'Đã trả đồ': { bg: '#E0E7FF', text: '#3730A3', dot: '#3B82F6' },
    'Hoàn tất': { bg: '#DCFCE7', text: '#15803D', dot: '#22C55E' },
    'Tranh chấp': { bg: '#FFEDD5', text: '#C2410C', dot: '#F97316' },
    'Đã hủy': { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' }
  };
  const st = map[status] || { bg: '#F1F5F9', text: '#475569', dot: '#94A3B8' };
  return `<span class="badge-status" style="background:${st.bg};color:${st.text}">
    <span style="width:7px;height:7px;border-radius:50%;background:${st.dot};display:inline-block"></span>
    ${status}
  </span>`;
}

// Global 1-second Countdown Timer for Soft-lock 10 minutes (F-S05 & F-S07)
setInterval(() => {
  let needsUpdate = false;
  state.orders.forEach(order => {
    if (order.status === 'Chờ thanh toán' && order.countdownSeconds > 0) {
      order.countdownSeconds -= 1;
      if (order.countdownSeconds <= 0) {
        // Auto-cancel booking and release calendar (Case 4 / Luồng phụ 5)
        expireSoftLockOrder(order.id);
        needsUpdate = true;
      } else {
        // Update live DOM countdown if visible
        const timerEl = document.getElementById(`countdown-${order.id}`);
        if (timerEl) {
          timerEl.textContent = formatCountdown(order.countdownSeconds);
        }
      }
    }
  });
  if (needsUpdate) {
    renderApp();
  }
}, 1000);

function expireSoftLockOrder(orderId) {
  const order = getOrderById(orderId);
  if (!order || order.status !== 'Chờ thanh toán') return;
  order.status = 'Đã hủy';
  order.countdownSeconds = 0;
  order.escrowStatus = 'Không phát sinh';
  order.cancelReason = 'Quá hạn 10 phút soft-lock chưa thanh toán QR. Đã tự giải phóng lịch.';
  // Release soft-locked dates back to available (Green)
  const product = getProductById(order.productId);
  if (product && product.schedule) {
    const dates = getDateRangeArray(order.startDate, order.endDate);
    dates.forEach(d => {
      if (product.schedule[d] === 'soft_locked') {
        delete product.schedule[d];
      }
    });
  }
  pushNotification('Quá hạn', `Đơn ${order.id} (${order.productTitle}) đã hết 10 phút giữ chỗ chưa thanh toán nên tự động hủy và mở lại lịch trống.`, order.id);
  showToast(`Đơn ${order.id} hết 10 phút giữ chỗ! Đã tự hủy và giải phóng lịch.`, 'warning');
}

// Navigation Controller
function navigateTo(page, options = {}) {
  state.notifOpen = false;
  if (options.productId) {
    state.selectedProductId = options.productId;
    state.selectedImageIdx = 0;
    state.conflictAlert = null;
    // Pick default available 2 days on product
    const prod = getProductById(options.productId);
    const availPair = findFirstAvailableRange(prod, 2);
    state.bookingStart = availPair.start;
    state.bookingEnd = availPair.end;
  }
  if (options.orderId) {
    state.activePaymentOrderId = options.orderId;
    state.paymentSuccessEffect = false;
    state.paymentErrorMsg = '';
  }
  if (options.dashboardTab) {
    state.dashboardTab = options.dashboardTab;
  }
  if (options.categoryId) {
    state.filters.categoryId = options.categoryId;
  }
  if (options.adminTab) {
    state.adminTab = options.adminTab;
  }

  // Auth guard for protected student routes
  if (['post-item', 'dashboard', 'profile', 'chat', 'wishlist'].includes(page) && !state.currentUser) {
    state.authModal = 'login';
    showToast('Vui lòng đăng nhập để sử dụng chức năng này', 'info');
    renderApp();
    return;
  }

  if (page === 'admin' && (!state.currentUser || state.currentUser.role !== 'admin')) {
    // Switch to Admin Demo automatically or prompt login
    state.currentUser = ADMIN_ACCOUNT;
    showToast('Đã chuyển sang quyền Admin Demo (admin@demo.com)', 'info');
  }

  state.currentPage = page;
  if (!options.fromHash) {
    try {
      history.replaceState(null, '', '#' + page);
    } catch (e) {}
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderApp();
}

function resetDemoData() {
  try {
    localStorage.removeItem('studentrent_demo_state_v1');
  } catch (e) {}
  state.categories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
  state.users = JSON.parse(JSON.stringify(INITIAL_USERS));
  state.products = [...JSON.parse(JSON.stringify(INITIAL_PRODUCTS)), ...JSON.parse(JSON.stringify(INITIAL_ADMIN_EXTRA_LISTINGS))];
  state.orders = JSON.parse(JSON.stringify(INITIAL_ORDERS));
  state.notifications = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
  state.chats = JSON.parse(JSON.stringify(INITIAL_CHATS));
  state.escrowLogs = JSON.parse(JSON.stringify(INITIAL_ESCROW_LOGS));
  state.wishlist = ['SP-01', 'SP-19'];
  state.paymentSuccessEffect = false;
  state.paymentErrorMsg = '';
  showToast('Đã khôi phục dữ liệu mẫu ban đầu (20 SP, 10 Users, 7 Đơn ORD-01 → ORD-07)!', 'info');
  renderApp();
}

function findFirstAvailableRange(product, numDays = 2) {
  for (let offset = 0; offset <= 20; offset++) {
    const start = fmtDate(offset);
    const end = fmtDate(offset + numDays - 1);
    const range = getDateRangeArray(start, end);
    const allFree = range.every(d => !product.schedule || !product.schedule[d]);
    if (allFree) return { start, end };
  }
  return { start: fmtDate(0), end: fmtDate(1) };
}

function isProductAvailableInRange(product, startStr, endStr) {
  if (!startStr || !endStr) return true;
  if (startStr > endStr) return false;
  const dates = getDateRangeArray(startStr, endStr);
  return dates.every(d => !product.schedule || !product.schedule[d]);
}

// Quick Demo Account Switcher
function quickSwitchRole(roleType) {
  if (roleType === 'guest') {
    state.currentUser = null;
    if (['admin', 'dashboard', 'post-item', 'profile', 'chat'].includes(state.currentPage)) {
      state.currentPage = 'home';
    }
    showToast('Đã chuyển sang chế độ Khách (Guest)', 'info');
  } else if (roleType === 'student') {
    state.currentUser = state.users[0]; // student@demo.com (Nguyễn Minh Quân)
    if (state.currentPage === 'admin') state.currentPage = 'home';
    showToast('Đã đăng nhập Student Demo: student@demo.com', 'success');
  } else if (roleType === 'renter2') {
    state.currentUser = state.users[1]; // Trần Thảo Tiên
    if (state.currentPage === 'admin') state.currentPage = 'home';
    showToast('Đã đăng nhập Student: tien.tt@student.edu.vn', 'success');
  } else if (roleType === 'admin') {
    state.currentUser = ADMIN_ACCOUNT;
    state.currentPage = 'admin';
    showToast('Đã đăng nhập Admin Demo: admin@demo.com', 'success');
  }
  renderApp();
}

// ============================================================================
// HEADER & DEMO SWITCHER BAR (F-G01, F-S14, Section 34)
// ============================================================================
function renderHeader() {
  const unreadNotifs = state.notifications.filter(n => !n.read).length;
  const unreadChats = state.chats.reduce((acc, c) => acc + (c.unread || 0), 0);
  const isStudent = state.currentUser && state.currentUser.role === 'student';
  const isAdmin = state.currentUser && state.currentUser.role === 'admin';

  return `
    <!-- Demo Control Bar for Evaluators -->
    <div class="bg-slate-900 text-slate-200 text-xs py-1.5 px-3 border-b border-slate-800">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">PROTOTYPE DEMO</span>
          <span class="hidden sm:inline text-slate-400">FAST (<60s) • AUTOMATED (No Manual Approval) • SAFE (Escrow)</span>
        </div>
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-slate-400 mr-1">Chuyển nhanh vai trò:</span>
          <button onclick="quickSwitchRole('guest')" class="px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${!state.currentUser ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
            Khách (Guest)
          </button>
          <button onclick="quickSwitchRole('student')" class="px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${isStudent && state.currentUser.id === 'u-1' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
            Student (student@demo.com)
          </button>
          <button onclick="quickSwitchRole('admin')" class="px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${isAdmin ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
            Admin (admin@demo.com)
          </button>
          <button onclick="resetDemoData()" class="px-2 py-1 rounded-md font-medium bg-slate-800 text-amber-300 hover:bg-slate-700 transition cursor-pointer" title="Khôi phục dữ liệu mẫu ban đầu">
            🔄 Reset mẫu
          </button>
        </div>
      </div>
    </div>

    <!-- Main Sticky Header (Section 34) -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <!-- Logo -->
        <div class="flex items-center gap-6">
          <button onclick="navigateTo('home')" class="flex items-center gap-2.5 text-left group cursor-pointer">
            <div class="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-extrabold text-lg shadow-sm group-hover:bg-emerald-600 transition">
              SR
            </div>
            <div>
              <div class="font-extrabold text-lg leading-none text-slate-900 tracking-tight">Student<span class="text-emerald-500">Rent</span></div>
              <div class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Instant Student Rental</div>
            </div>
          </button>

          <!-- Desktop Nav Links -->
          <nav class="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-600">
            <button onclick="navigateTo('home')" class="px-3 py-2 rounded-lg hover:text-emerald-600 hover:bg-emerald-50/60 transition ${state.currentPage === 'home' ? 'text-emerald-600 bg-emerald-50' : ''}">Trang chủ</button>
            <button onclick="navigateTo('catalog')" class="px-3 py-2 rounded-lg hover:text-emerald-600 hover:bg-emerald-50/60 transition ${state.currentPage === 'catalog' ? 'text-emerald-600 bg-emerald-50' : ''}">Khám phá đồ thuê</button>
            ${state.currentUser ? `
              <button onclick="navigateTo('dashboard')" class="px-3 py-2 rounded-lg hover:text-emerald-600 hover:bg-emerald-50/60 transition ${state.currentPage === 'dashboard' ? 'text-emerald-600 bg-emerald-50' : ''}">Đơn thuê & Quản lý</button>
              <button onclick="navigateTo('chat')" class="px-3 py-2 rounded-lg hover:text-emerald-600 hover:bg-emerald-50/60 transition flex items-center gap-1.5 ${state.currentPage === 'chat' ? 'text-emerald-600 bg-emerald-50' : ''}">
                <span>Chat giao nhận</span>
                ${unreadChats > 0 ? `<span class="px-1.5 py-0.2 bg-emerald-500 text-white text-[11px] rounded-full">${unreadChats}</span>` : ''}
              </button>
            ` : ''}
            ${isAdmin ? `
              <button onclick="navigateTo('admin')" class="px-3 py-2 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 transition font-bold">⚡ Admin Portal</button>
            ` : ''}
          </nav>
        </div>

        <!-- Quick Header Search (F-G01 / Section 34) -->
        <div class="hidden md:flex flex-1 max-w-xs lg:max-w-sm relative">
          <input
            type="text"
            value="${state.filters.keyword}"
            oninput="state.filters.keyword = this.value"
            onkeydown="if(event.key==='Enter'){navigateTo('catalog')}"
            placeholder="Tìm tên đồ, mã SP, Sony, lều, ĐHQG..."
            class="w-full pl-9 pr-16 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-500 transition"
          />
          <span class="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
          <button onclick="navigateTo('catalog')" class="absolute right-1.5 top-1.5 px-2.5 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition">
            Tìm
          </button>
        </div>

        <!-- Right Actions: "Đăng đồ cho thuê", Wishlist, Bell, Avatar/Login -->
        <div class="flex items-center gap-2 sm:gap-3">
          <button
            onclick="openPostWizard()"
            class="px-3 sm:px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>＋</span>
            <span>Đăng đồ cho thuê</span>
          </button>

          <!-- Wishlist Button (F-S16) -->
          <button
            onclick="navigateTo('wishlist')"
            title="Danh sách yêu thích"
            class="relative p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
          >
            <span>❤️</span>
            ${state.wishlist.length > 0 ? `<span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">${state.wishlist.length}</span>` : ''}
          </button>

          <!-- Notification Bell (F-S14) -->
          <div class="relative">
            <button
              onclick="toggleNotifDropdown()"
              title="Thông báo hệ thống"
              class="relative p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
            >
              <span>🔔</span>
              ${unreadNotifs > 0 ? `<span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">${unreadNotifs}</span>` : ''}
            </button>

            ${state.notifOpen ? renderNotificationDropdown() : ''}
          </div>

          <!-- Avatar or Login/Register -->
          ${state.currentUser ? `
            <div class="flex items-center gap-2 pl-1">
              <button
                onclick="navigateTo('${isAdmin ? 'admin' : 'profile'}')"
                class="flex items-center gap-2 p-1 pr-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50 transition cursor-pointer"
              >
                <img src="${state.currentUser.avatar}" onerror="this.src=createFallbackImage('User')" alt="Avatar" class="w-7 h-7 rounded-lg object-cover" />
                <div class="hidden sm:block text-left">
                  <div class="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">${state.currentUser.name}</div>
                  <div class="text-[10px] text-emerald-600 font-semibold">${isAdmin ? 'Quản trị viên' : `Uy tín ${state.currentUser.trustScore || 95}đ`}</div>
                </div>
              </button>
            </div>
          ` : `
            <div class="flex items-center gap-1.5">
              <button onclick="openAuthModal('login')" class="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer">
                Đăng nhập
              </button>
              <button onclick="openAuthModal('register')" class="hidden sm:inline-flex px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer">
                Đăng ký
              </button>
            </div>
          `}
        </div>
      </div>

      <!-- Mobile Bottom / Sub-nav Bar for Responsive Navigation -->
      <div class="lg:hidden flex items-center justify-around border-t border-slate-100 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600">
        <button onclick="navigateTo('home')" class="py-1 px-2 rounded-lg ${state.currentPage === 'home' ? 'text-emerald-600 font-bold' : ''}">🏠 Trang chủ</button>
        <button onclick="navigateTo('catalog')" class="py-1 px-2 rounded-lg ${state.currentPage === 'catalog' ? 'text-emerald-600 font-bold' : ''}">🔍 Tìm đồ</button>
        <button onclick="navigateTo('dashboard')" class="py-1 px-2 rounded-lg ${state.currentPage === 'dashboard' ? 'text-emerald-600 font-bold' : ''}">📦 Đơn thuê</button>
        <button onclick="navigateTo('chat')" class="py-1 px-2 rounded-lg ${state.currentPage === 'chat' ? 'text-emerald-600 font-bold' : ''}">💬 Chat ${unreadChats > 0 ? `(${unreadChats})` : ''}</button>
        ${isAdmin ? `<button onclick="navigateTo('admin')" class="py-1 px-2 rounded-lg text-amber-600 font-bold">⚡ Admin</button>` : `<button onclick="navigateTo('profile')" class="py-1 px-2 rounded-lg ${state.currentPage === 'profile' ? 'text-emerald-600 font-bold' : ''}">👤 Hồ sơ</button>`}
      </div>
    </header>
  `;
}

// F-S14 Notification Dropdown
function renderNotificationDropdown() {
  return `
    <div class="fixed sm:absolute right-3 sm:right-0 left-3 sm:left-auto mt-2 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden page-enter">
      <div class="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
        <div class="font-bold text-sm flex items-center gap-2">
          <span>🔔 Thông báo hệ thống</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-500 text-white">${state.notifications.filter(n => !n.read).length} mới</span>
        </div>
        <button onclick="markAllNotifsRead()" class="text-xs text-emerald-400 hover:underline">Đánh dấu đã đọc</button>
      </div>
      <div class="max-h-96 overflow-y-auto divide-y divide-slate-100">
        ${state.notifications.map(n => `
          <div onclick="handleNotifClick('${n.id}', '${n.orderId}')" class="p-3.5 hover:bg-slate-50 transition cursor-pointer flex gap-3 ${!n.read ? 'bg-emerald-50/40' : ''}">
            <div class="w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-emerald-500' : 'bg-slate-300'}"></div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-bold text-slate-900">${n.title}</span>
                <span class="text-[11px] text-slate-400 shrink-0">${n.time}</span>
              </div>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">${n.message}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function toggleNotifDropdown() {
  state.notifOpen = !state.notifOpen;
  renderApp();
}

function markAllNotifsRead() {
  state.notifications.forEach(n => n.read = true);
  renderApp();
}

function handleNotifClick(notifId, orderId) {
  const n = state.notifications.find(x => x.id === notifId);
  if (n) n.read = true;
  state.notifOpen = false;
  if (orderId) {
    const ord = getOrderById(orderId);
    if (ord && ord.status === 'Chờ thanh toán') {
      navigateTo('payment', { orderId });
      return;
    }
    navigateTo('dashboard');
  } else {
    renderApp();
  }
}

// ============================================================================
// F-G01 & SECTION 34 — TRANG CHỦ (HOME PAGE)
// ============================================================================
function renderHomePage() {
  const approvedProducts = state.products.filter(p => p.approvalStatus === 'Đã duyệt' && p.visible).slice(0, 8);

  return `
    <div class="page-enter">
      <!-- Hero Banner with Slogan & 3-field Search -->
      <section class="relative bg-slate-900 text-white overflow-hidden py-12 sm:py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div class="grid lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-7 space-y-5">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <span>⚡ FAST • AUTOMATED • SAFE</span>
                <span>• Không chờ chủ đồ duyệt đơn</span>
              </div>
              <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Thuê Đồ Dùng Sinh Viên <span class="text-emerald-400">Tự Động Hóa</span> Trong 60 Giây
              </h1>
              <p class="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                Xem lịch trống trực tiếp trên Interactive Calendar, đặt chỗ tức thì (Instant Booking), thanh toán VietQR tự động và bảo vệ 100% tiền cọc qua tài khoản ký quỹ <strong class="text-white">Escrow</strong>.
              </p>

              <!-- 3-Field Hero Search Box (Section 34) -->
              <div class="bg-white p-3 sm:p-4 rounded-2xl shadow-xl text-slate-900 mt-4">
                <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <!-- Field 1: Keyword / Brand / Code -->
                  <div class="sm:col-span-5">
                    <label class="block text-[11px] font-bold uppercase text-slate-400 mb-1">Tên đồ / Nhãn hiệu / Mã SP</label>
                    <input
                      type="text"
                      id="hero-keyword"
                      value="${state.filters.keyword}"
                      oninput="state.filters.keyword = this.value"
                      placeholder="VD: Sony A6400, Lều, Máy chiếu, SP-01..."
                      class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <!-- Field 2: Category -->
                  <div class="sm:col-span-4">
                    <label class="block text-[11px] font-bold uppercase text-slate-400 mb-1">Danh mục đồ dùng</label>
                    <select
                      id="hero-category"
                      onchange="state.filters.categoryId = this.value"
                      class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    >
                      <option value="all" ${state.filters.categoryId === 'all' ? 'selected' : ''}>Tất cả 9 danh mục</option>
                      ${state.categories.filter(c => c.active).map(c => `
                        <option value="${c.id}" ${state.filters.categoryId === c.id ? 'selected' : ''}>${c.icon} ${c.name}</option>
                      `).join('')}
                    </select>
                  </div>
                  <!-- Field 3: Area / Campus -->
                  <div class="sm:col-span-3">
                    <label class="block text-[11px] font-bold uppercase text-slate-400 mb-1">Khu vực / Trường</label>
                    <select
                      id="hero-area"
                      onchange="state.filters.area = this.value"
                      class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    >
                      <option value="all" ${state.filters.area === 'all' ? 'selected' : ''}>Tất cả khu vực</option>
                      ${AREAS.map(a => `<option value="${a}" ${state.filters.area === a ? 'selected' : ''}>📍 ${a}</option>`).join('')}
                    </select>
                  </div>
                </div>
                <div class="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div class="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                    <span class="font-semibold">Gợi ý nhanh:</span>
                    <button onclick="quickHeroSearch('Sony', 'all', 'all')" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 transition">Sony A6400</button>
                    <button onclick="quickHeroSearch('', 'cat-8', 'ĐHQG')" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 transition">Lều trại ĐHQG</button>
                    <button onclick="quickHeroSearch('Máy chiếu', 'cat-2', 'Bách Kinh Xây')" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 transition">Máy chiếu Bách Kinh Xây</button>
                  </div>
                  <button
                    onclick="navigateTo('catalog')"
                    class="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-sm transition cursor-pointer"
                  >
                    🔍 Tìm & Xem lịch trống ngay
                  </button>
                </div>
              </div>
            </div>

            <!-- Right Hero Visual Card: Live Instant Booking Demo Preview -->
            <div class="lg:col-span-5">
              <div class="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Trải nghiệm Đặt Chỗ Tức Thì</span>
                  <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Soft-lock 10:00</span>
                </div>
                <div class="grid grid-cols-3 gap-2 text-center text-xs">
                  <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-700">
                    <div class="text-emerald-400 font-extrabold text-lg">&lt; 60s</div>
                    <div class="text-slate-400 mt-0.5">Hoàn tất đặt đồ</div>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-700">
                    <div class="text-emerald-400 font-extrabold text-lg">0 Phút</div>
                    <div class="text-slate-400 mt-0.5">Chờ chủ duyệt</div>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-700">
                    <div class="text-emerald-400 font-extrabold text-lg">100%</div>
                    <div class="text-slate-400 mt-0.5">Bảo vệ tiền cọc</div>
                  </div>
                </div>
                <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2 text-xs">
                  <div class="font-bold text-slate-200">Quy ước 4 trạng thái lịch toàn hệ thống:</div>
                  <div class="grid grid-cols-2 gap-2">
                    <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-green-500 inline-block"></span><span>Xanh lá: Trống</span></div>
                    <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-amber-500 inline-block"></span><span>Vàng: Soft-lock 10p</span></div>
                    <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-blue-500 inline-block"></span><span>Xanh dương: Đã đặt</span></div>
                    <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-slate-400 inline-block"></span><span>Xám: Chủ tự khóa</span></div>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button onclick="navigateTo('detail', { productId: 'SP-02' })" class="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer">
                    ⚡ Thử Đặt Đồ Tự Động Ngay
                  </button>
                  <button onclick="navigateTo('payment', { orderId: 'ORD-01' })" class="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer">
                    Xem QR ORD-01
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Danh mục nổi bật (9 Danh mục chuẩn đặc tả) -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div class="flex items-end justify-between mb-6">
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900">Danh mục đồ dùng sinh viên</h2>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">Đúng 9 danh mục chuẩn với mức giá thuê và tiền cọc minh bạch</p>
          </div>
          <button onclick="state.filters.categoryId='all';navigateTo('catalog')" class="text-sm font-bold text-emerald-600 hover:underline cursor-pointer">
            Xem tất cả →
          </button>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
          ${state.categories.filter(c => c.active).map(cat => `
            <button
              onclick="state.filters.categoryId='${cat.id}';navigateTo('catalog')"
              class="sr-card sr-card-hover p-3.5 text-center flex flex-col items-center justify-center gap-2 cursor-pointer"
            >
              <div class="w-11 h-11 rounded-xl bg-emerald-50 text-2xl flex items-center justify-center">${cat.icon}</div>
              <div class="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">${cat.name}</div>
              <div class="text-[10px] text-emerald-600 font-semibold">Từ ${formatVND(cat.minPrice)}</div>
            </button>
          `).join('')}
        </div>
      </section>

      <!-- Lưới sản phẩm nổi bật / gần trường -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900">Đồ dùng nổi bật gần cụm trường</h2>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">Sẵn sàng đặt tức thì tại ĐHQG, Bách Kinh Xây, Cầu Giấy</p>
          </div>
          <div class="flex items-center gap-1.5">
            <button onclick="state.filters.area='all';renderApp()" class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${state.filters.area === 'all' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}">Tất cả</button>
            ${AREAS.map(a => `
              <button onclick="state.filters.area='${a}';navigateTo('catalog')" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition cursor-pointer">📍 ${a}</button>
            `).join('')}
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          ${approvedProducts.map(p => renderProductCard(p)).join('')}
        </div>

        <div class="text-center mt-8">
          <button onclick="navigateTo('catalog')" class="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition cursor-pointer">
            Xem toàn bộ 20 sản phẩm có sẵn →
          </button>
        </div>
      </section>

      <!-- Hướng dẫn "Cách hoạt động" 4 bước (F-G01 & Section 34) -->
      <section class="bg-white border-y border-slate-200 py-12 mt-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
          <div class="text-center max-w-2xl mx-auto mb-10">
            <span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase">Quy trình tự động hóa 100%</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">Cách hoạt động chỉ trong 4 bước</h2>
            <p class="text-sm text-slate-500 mt-1">Không cần nhắn tin hỏi lịch trống, không cần chờ chủ đồ duyệt thủ công</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div class="sr-card p-5 relative">
              <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white font-extrabold flex items-center justify-center text-base mb-3">1</div>
              <h3 class="font-bold text-slate-900 text-base">Xem lịch & Chọn ngày</h3>
              <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">Xem trực tiếp ngày trống (màu xanh lá) trên Interactive Calendar và chọn dải ngày cần thuê. Pricing Engine tự động tính phí minh bạch.</p>
            </div>
            <div class="sr-card p-5 relative">
              <div class="w-10 h-10 rounded-xl bg-amber-500 text-white font-extrabold flex items-center justify-center text-base mb-3">2</div>
              <h3 class="font-bold text-slate-900 text-base">Soft-lock 10p & Quét VietQR</h3>
              <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">Hệ thống tự khóa tạm lịch 10 phút (vàng hổ phách) chống đặt trùng. Quét mã VietQR động với cú pháp <code class="bg-slate-100 px-1 rounded">SR [Mã đơn]</code>.</p>
            </div>
            <div class="sr-card p-5 relative">
              <div class="w-10 h-10 rounded-xl bg-blue-500 text-white font-extrabold flex items-center justify-center text-base mb-3">3</div>
              <h3 class="font-bold text-slate-900 text-base">Check-in & Nhận đồ</h3>
              <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">Đơn tự động xác nhận ngay sau khi thanh toán! Khi gặp nhận đồ, chụp tối thiểu 2 ảnh hiện trạng Check-in lên hệ thống.</p>
            </div>
            <div class="sr-card p-5 relative">
              <div class="w-10 h-10 rounded-xl bg-green-500 text-white font-extrabold flex items-center justify-center text-base mb-3">4</div>
              <h3 class="font-bold text-slate-900 text-base">Check-out & Hoàn cọc 100%</h3>
              <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">Trả đồ kèm 2 ảnh Check-out. Nếu đồ nguyên vẹn (hoặc sau 4h không khiếu nại), Escrow tự động hoàn 100% tiền cọc về ngân hàng.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Khối Cam Kết An Toàn Cọc (Escrow Safe Commitment - F-G01 & Section 34) -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div class="grid lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-8 space-y-4">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                🛡️ CAM KẾT AN TOÀN TIỀN CỌC (ESCROW PROTECTION)
              </div>
              <h2 class="text-2xl sm:text-3xl font-extrabold">Tiền cọc không chuyển trực tiếp cho cá nhân — Được bảo vệ 100% bởi StudentRent Escrow</h2>
              <div class="grid sm:grid-cols-3 gap-4 pt-2">
                <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div class="font-bold text-emerald-400 text-sm">🔒 Ký quỹ độc lập</div>
                  <p class="text-xs text-slate-300 mt-1 leading-relaxed">Tiền cọc được giữ trong quỹ Escrow đến khi kết thúc đơn, loại bỏ hoàn toàn rủi ro quỵt cọc hay giữ cọc vô lý.</p>
                </div>
                <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div class="font-bold text-emerald-400 text-sm">📸 Bằng chứng ảnh số</div>
                  <p class="text-xs text-slate-300 mt-1 leading-relaxed">Bắt buộc chụp ảnh hiện trạng khi Check-in và Check-out để bảo vệ cả người thuê lẫn chủ đồ.</p>
                </div>
                <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div class="font-bold text-emerald-400 text-sm">⚖️ Tự động hoàn sau 4h</div>
                  <p class="text-xs text-slate-300 mt-1 leading-relaxed">Sau khi trả đồ 4 giờ mà không có báo cáo sự cố, hệ thống tự động giải phóng 100% tiền cọc cho người thuê.</p>
                </div>
              </div>
            </div>
            <div class="lg:col-span-4 bg-white/10 border border-white/15 rounded-2xl p-5 space-y-3">
              <div class="text-xs font-bold uppercase text-emerald-300">Công thức tính phí chuẩn (F-S06)</div>
              <div class="space-y-2 text-xs">
                <div class="flex justify-between py-1.5 border-b border-white/10">
                  <span class="text-slate-300">Tiền thuê gốc:</span>
                  <span class="font-bold">Số ngày × Đơn giá/ngày</span>
                </div>
                <div class="flex justify-between py-1.5 border-b border-white/10">
                  <span class="text-slate-300">Phí dịch vụ (không hoàn):</span>
                  <span class="font-bold text-amber-300">10% × Tiền thuê gốc</span>
                </div>
                <div class="flex justify-between py-1.5 border-b border-white/10">
                  <span class="text-slate-300">Tiền cọc an toàn:</span>
                  <span class="font-bold text-emerald-400">Hoàn 100% khi nguyên vẹn</span>
                </div>
              </div>
              <button onclick="navigateTo('catalog')" class="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition cursor-pointer">
                Khám phá & Đặt thuê ngay
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function quickHeroSearch(keyword, categoryId, area) {
  state.filters.keyword = keyword;
  state.filters.categoryId = categoryId;
  state.filters.area = area;
  navigateTo('catalog');
}

// Product Card Component (Section 35: Ảnh tỷ lệ 4:3, Tên, Huy hiệu lịch, Giá, Cọc, Sao, Nút yêu thích)
function renderProductCard(product) {
  const owner = getUserById(product.ownerId);
  const cat = getCategoryById(product.categoryId);
  const isWished = state.wishlist.includes(product.id);
  const todayStr = fmtDate(0);
  const todayState = product.schedule && product.schedule[todayStr];

  let scheduleBadge = `<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-500/95 text-white shadow-xs">● Trống hôm nay</span>`;
  if (todayState === 'soft_locked') {
    scheduleBadge = `<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/95 text-white shadow-xs">⏳ Đang giữ chỗ 10p</span>`;
  } else if (todayState === 'booked') {
    scheduleBadge = `<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-600/95 text-white shadow-xs">📅 Đã đặt hôm nay</span>`;
  } else if (todayState === 'owner_locked') {
    scheduleBadge = `<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-600/95 text-white shadow-xs">🔒 Tạm khóa hôm nay</span>`;
  }

  return `
    <div class="sr-card sr-card-hover overflow-hidden flex flex-col justify-between group">
      <div>
        <!-- Image 4:3 + Badges -->
        <div class="relative overflow-hidden bg-slate-100">
          <img
            src="${product.images[0]}"
            onerror="this.src=createFallbackImage('${product.id}')"
            alt="${product.title}"
            onclick="navigateTo('detail', { productId: '${product.id}' })"
            class="aspect-4-3 group-hover:scale-105 transition duration-300 cursor-pointer"
          />
          <div class="absolute top-2.5 left-2.5 flex flex-col gap-1">
            ${scheduleBadge}
          </div>
          <button
            onclick="toggleWishlist('${product.id}', event)"
            title="Yêu thích"
            class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center text-sm transition cursor-pointer"
          >
            ${isWished ? '❤️' : '🤍'}
          </button>
          <div class="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px]">
            <span class="px-2 py-0.5 rounded-md bg-slate-900/80 text-white font-semibold backdrop-blur-xs">📍 ${product.area}</span>
            <span class="px-2 py-0.5 rounded-md bg-white/90 text-slate-800 font-bold">${product.id}</span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-4">
          <div class="flex items-center justify-between text-[11px] text-slate-500 font-semibold mb-1">
            <span>${cat.icon} ${cat.name}</span>
            <span>Tình trạng: <strong class="text-slate-700">${product.condition}</strong></span>
          </div>
          <h3
            onclick="navigateTo('detail', { productId: '${product.id}' })"
            class="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 hover:text-emerald-600 transition cursor-pointer min-h-[2.5rem]"
          >
            ${product.title}
          </h3>

          <!-- Price & Deposit -->
          <div class="mt-3 pt-3 border-t border-slate-100 flex items-baseline justify-between">
            <div>
              <span class="text-emerald-600 font-extrabold text-base sm:text-lg">${formatVND(product.pricePerDay)}</span>
              <span class="text-xs text-slate-500 font-medium">/ngày</span>
            </div>
            <div class="text-right">
              <span class="text-[11px] text-slate-500 block">Cọc Escrow:</span>
              <span class="text-xs font-bold text-slate-800">${formatVND(product.deposit)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Owner Rating & CTA -->
      <div class="px-4 pb-4 pt-2 flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/50">
        <div onclick="openPublicProfile('${owner.id}')" class="flex items-center gap-2 cursor-pointer hover:opacity-80 min-w-0">
          <img src="${owner.avatar}" onerror="this.src=createFallbackImage('U')" class="w-6 h-6 rounded-full object-cover shrink-0" />
          <div class="truncate">
            <div class="text-xs font-bold text-slate-800 truncate flex items-center gap-1">
              <span>${owner.name}</span>
              ${owner.verifiedStudent ? '<span title="Sinh viên xác thực" class="text-emerald-500">✔</span>' : ''}
            </div>
            <div class="text-[11px] text-amber-600 font-semibold">★ ${owner.rating || 'Mới'} (${owner.completedTx} GD)</div>
          </div>
        </div>
        <button
          onclick="navigateTo('detail', { productId: '${product.id}' })"
          class="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shrink-0 transition cursor-pointer"
        >
          Đặt ngay
        </button>
      </div>
    </div>
  `;
}

function toggleWishlist(productId, event) {
  if (event) event.stopPropagation();
  const idx = state.wishlist.indexOf(productId);
  if (idx >= 0) {
    state.wishlist.splice(idx, 1);
    showToast('Đã xóa khỏi danh sách yêu thích', 'info');
  } else {
    state.wishlist.push(productId);
    showToast('Đã lưu vào danh sách yêu thích ❤️', 'success');
  }
  renderApp();
}

// ============================================================================
// F-G02, F-G03 & SECTION 35 — TRANG DANH SÁCH SẢN PHẨM (CATALOG / SEARCH / FILTER)
// ============================================================================
function getFilteredProducts() {
  const f = state.filters;
  const kw = (f.keyword || '').trim().toLowerCase();

  let list = state.products.filter(p => p.approvalStatus === 'Đã duyệt' && p.visible);

  // F-G02: Tìm theo Tên, Từ khóa, Nhãn hiệu, Mã sản phẩm, Danh mục, Khu vực/trường
  if (kw) {
    list = list.filter(p => {
      const cat = getCategoryById(p.categoryId);
      return (
        p.title.toLowerCase().includes(kw) ||
        p.description.toLowerCase().includes(kw) ||
        (p.brand && p.brand.toLowerCase().includes(kw)) ||
        p.id.toLowerCase().includes(kw) ||
        cat.name.toLowerCase().includes(kw) ||
        p.area.toLowerCase().includes(kw)
      );
    });
  }

  // Filter by Category
  if (f.categoryId !== 'all') {
    list = list.filter(p => p.categoryId === f.categoryId);
  }

  // Filter by Area / Campus
  if (f.area !== 'all') {
    list = list.filter(p => p.area === f.area);
  }

  // Filter by Max Price Slider
  if (f.maxPrice) {
    list = list.filter(p => p.pricePerDay <= Number(f.maxPrice));
  }

  // Filter by Max Deposit
  if (f.maxDeposit) {
    list = list.filter(p => p.deposit <= Number(f.maxDeposit));
  }

  // Filter by Owner Star Rating (>=3 or >=4)
  if (f.minRating > 0) {
    list = list.filter(p => {
      const owner = getUserById(p.ownerId);
      return (owner.rating || 0) >= f.minRating;
    });
  }

  // Filter by Date Range Picker: ONLY show items available across the ENTIRE selected date range!
  if (f.startDate && f.endDate && f.startDate <= f.endDate) {
    list = list.filter(p => isProductAvailableInRange(p, f.startDate, f.endDate));
  }

  // Sort (Phù hợp nhất, Giá tăng dần, Giá giảm dần, Đánh giá cao nhất, Gần nhất)
  if (f.sortBy === 'price_asc') {
    list.sort((a, b) => a.pricePerDay - b.pricePerDay);
  } else if (f.sortBy === 'price_desc') {
    list.sort((a, b) => b.pricePerDay - a.pricePerDay);
  } else if (f.sortBy === 'rating_desc') {
    list.sort((a, b) => (getUserById(b.ownerId).rating || 0) - (getUserById(a.ownerId).rating || 0));
  } else if (f.sortBy === 'nearest') {
    const preferredArea = (state.currentUser && state.currentUser.area) || 'Bách Kinh Xây';
    list.sort((a, b) => (a.area === preferredArea ? -1 : 1) - (b.area === preferredArea ? -1 : 1));
  }

  return list;
}

function renderFilterSidebarContent() {
  const f = state.filters;
  return `
    <div class="space-y-5">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 class="font-extrabold text-slate-900 text-base">Bộ lọc tìm kiếm</h3>
        <button onclick="resetFilters()" class="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">Đặt lại</button>
      </div>

      <!-- Từ khóa / Mã SP / Nhãn hiệu -->
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1.5">Tên / Nhãn hiệu / Mã SP</label>
        <input
          type="text"
          value="${f.keyword}"
          oninput="state.filters.keyword=this.value;renderApp()"
          placeholder="Sony, Canon, Lều, SP-01..."
          class="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
        />
      </div>

      <!-- Danh mục -->
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1.5">Danh mục (9 danh mục)</label>
        <select
          onchange="state.filters.categoryId=this.value;renderApp()"
          class="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
        >
          <option value="all" ${f.categoryId === 'all' ? 'selected' : ''}>Tất cả danh mục</option>
          ${state.categories.filter(c => c.active).map(c => `
            <option value="${c.id}" ${f.categoryId === c.id ? 'selected' : ''}>${c.icon} ${c.name}</option>
          `).join('')}
        </select>
      </div>

      <!-- Khu vực / KTX / Trường -->
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1.5">Khu vực / KTX / Trường</label>
        <div class="grid grid-cols-2 gap-1.5">
          <button onclick="state.filters.area='all';renderApp()" class="px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${f.area === 'all' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-50 text-slate-700 border-slate-200'}">Tất cả</button>
          ${AREAS.map(a => `
            <button onclick="state.filters.area='${a}';renderApp()" class="px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${f.area === a ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-50 text-slate-700 border-slate-200'}">📍 ${a}</button>
          `).join('')}
        </div>
      </div>

      <!-- Khoảng ngày cần thuê (Date Range Picker - lọc đồ trống toàn bộ dải ngày) -->
      <div class="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
        <div class="text-xs font-bold text-emerald-900 flex items-center gap-1">
          <span>📅 Khoảng ngày cần thuê</span>
        </div>
        <p class="text-[11px] text-emerald-700">Chỉ hiển thị đồ còn trống toàn bộ dải ngày chọn</p>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[10px] font-bold text-slate-600">Từ ngày</label>
            <input type="date" value="${f.startDate}" onchange="state.filters.startDate=this.value;if(!state.filters.endDate || state.filters.endDate < this.value){state.filters.endDate=this.value;}renderApp()" class="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-600">Đến ngày</label>
            <input type="date" value="${f.endDate}" onchange="state.filters.endDate=this.value;renderApp()" class="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg" />
          </div>
        </div>
        ${f.startDate && f.endDate ? `
          <button onclick="state.filters.startDate='';state.filters.endDate='';renderApp()" class="text-[11px] text-emerald-700 font-bold underline cursor-pointer">Xóa lọc ngày</button>
        ` : ''}
      </div>

      <!-- Khoảng giá thuê bằng Slider -->
      <div>
        <div class="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
          <span>Giá thuê tối đa/ngày</span>
          <span class="text-emerald-600">${formatVND(f.maxPrice)}</span>
        </div>
        <input
          type="range"
          min="15000"
          max="250000"
          step="5000"
          value="${f.maxPrice}"
          oninput="state.filters.maxPrice=Number(this.value);renderApp()"
          class="sr-slider"
        />
        <div class="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>15.000đ</span>
          <span>250.000đ</span>
        </div>
      </div>

      <!-- Khoảng tiền cọc -->
      <div>
        <div class="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
          <span>Tiền cọc tối đa</span>
          <span class="text-emerald-600">${formatVND(f.maxDeposit)}</span>
        </div>
        <input
          type="range"
          min="100000"
          max="2000000"
          step="50000"
          value="${f.maxDeposit}"
          oninput="state.filters.maxDeposit=Number(this.value);renderApp()"
          class="sr-slider"
        />
        <div class="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>100.000đ</span>
          <span>2.000.000đ</span>
        </div>
      </div>

      <!-- Số sao chủ đồ: >=3 hoặc >=4 -->
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1.5">Số sao chủ đồ</label>
        <div class="grid grid-cols-3 gap-1.5">
          <button onclick="state.filters.minRating=0;renderApp()" class="py-1.5 px-2 rounded-lg text-xs font-semibold border cursor-pointer ${f.minRating === 0 ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'}">Tất cả</button>
          <button onclick="state.filters.minRating=3;renderApp()" class="py-1.5 px-2 rounded-lg text-xs font-semibold border cursor-pointer ${f.minRating === 3 ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 text-slate-700 border-slate-200'}">★ ≥ 3 sao</button>
          <button onclick="state.filters.minRating=4;renderApp()" class="py-1.5 px-2 rounded-lg text-xs font-semibold border cursor-pointer ${f.minRating === 4 ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 text-slate-700 border-slate-200'}">★ ≥ 4 sao</button>
        </div>
      </div>
    </div>
  `;
}

function resetFilters() {
  state.filters = {
    keyword: '',
    categoryId: 'all',
    area: 'all',
    maxPrice: 250000,
    maxDeposit: 2000000,
    minRating: 0,
    startDate: '',
    endDate: '',
    sortBy: 'relevant',
    visibleCount: 9
  };
  renderApp();
}

function renderCatalogPage() {
  const filtered = getFilteredProducts();
  const visibleItems = filtered.slice(0, state.filters.visibleCount);

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 page-enter">
      <!-- Top Bar: Title, Mobile Filter Drawer Trigger, Sort Dropdown -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900">Danh sách đồ cho thuê (${filtered.length} kết quả)</h1>
          <p class="text-xs text-slate-500 mt-0.5">Tất cả sản phẩm đều hỗ trợ Đặt chỗ tức thì (Instant Booking) & VietQR</p>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <!-- Mobile Filter Button (Drawer Trigger - Section 35) -->
          <button
            onclick="state.mobileFilterOpen=true;renderApp()"
            class="lg:hidden px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <span>🎛️ Bộ lọc</span>
          </button>

          <!-- Sort Dropdown (F-G03) -->
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-slate-500 hidden sm:inline">Sắp xếp:</span>
            <select
              onchange="state.filters.sortBy=this.value;renderApp()"
              class="px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              <option value="relevant" ${state.filters.sortBy === 'relevant' ? 'selected' : ''}>Phù hợp nhất</option>
              <option value="price_asc" ${state.filters.sortBy === 'price_asc' ? 'selected' : ''}>Giá tăng dần</option>
              <option value="price_desc" ${state.filters.sortBy === 'price_desc' ? 'selected' : ''}>Giá giảm dần</option>
              <option value="rating_desc" ${state.filters.sortBy === 'rating_desc' ? 'selected' : ''}>Đánh giá cao nhất</option>
              <option value="nearest" ${state.filters.sortBy === 'nearest' ? 'selected' : ''}>Gần nhất</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Main Layout: Desktop Left Sidebar + Right Product Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Desktop Filter Sidebar -->
        <aside class="hidden lg:block lg:col-span-3 sr-card p-5 sticky top-20">
          ${renderFilterSidebarContent()}
        </aside>

        <!-- Product Grid -->
        <div class="lg:col-span-9">
          ${filtered.length === 0 ? `
            <div class="sr-card p-12 text-center space-y-3">
              <div class="text-4xl">🔍</div>
              <h3 class="font-bold text-slate-900 text-lg">Không tìm thấy món đồ phù hợp với bộ lọc</h3>
              <p class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">Thử mở rộng khoảng giá thuê, đổi dải ngày hoặc nhấn Đặt lại bộ lọc để xem toàn bộ 20 món đồ.</p>
              <button onclick="resetFilters()" class="px-5 py-2.5 bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-emerald-600 transition cursor-pointer">
                Đặt lại bộ lọc
              </button>
            </div>
          ` : `
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              ${visibleItems.map(p => renderProductCard(p)).join('')}
            </div>

            <!-- Pagination / Load More (Section 35) -->
            ${filtered.length > visibleItems.length ? `
              <div class="text-center mt-8">
                <button
                  onclick="state.filters.visibleCount += 6; renderApp()"
                  class="px-6 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-emerald-500 text-slate-800 font-bold text-sm shadow-xs transition cursor-pointer"
                >
                  Xem thêm (${filtered.length - visibleItems.length} sản phẩm) ↓
                </button>
              </div>
            ` : ''}
          `}
        </div>
      </div>

      <!-- Mobile Filter Drawer (Section 35) -->
      ${state.mobileFilterOpen ? `
        <div class="fixed inset-0 z-50 lg:hidden flex">
          <div onclick="state.mobileFilterOpen=false;renderApp()" class="fixed inset-0 mobile-drawer-backdrop"></div>
          <div class="relative w-80 max-w-[85vw] bg-white h-full overflow-y-auto p-5 z-10 shadow-2xl ml-auto flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                <span class="font-extrabold text-base text-slate-900">🎛️ Bộ lọc sản phẩm</span>
                <button onclick="state.mobileFilterOpen=false;renderApp()" class="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold">✕</button>
              </div>
              ${renderFilterSidebarContent()}
            </div>
            <div class="pt-4 mt-6 border-t border-slate-200 sticky bottom-0 bg-white">
              <button onclick="state.mobileFilterOpen=false;renderApp()" class="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm">
                Áp dụng (${filtered.length} kết quả)
              </button>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// ============================================================================
// F-G04, F-S03, F-S04, F-S05, F-S06 & SECTION 36 — TRANG CHI TIẾT SẢN PHẨM & BOOKING ENGINE
// ============================================================================
function renderInteractiveCalendar(product, mode = 'booking') {
  // Renders 14-day interactive calendar starting from yesterday (-1) to +19 days (21 days = 3 weeks grid)
  const cells = [];
  const selectedRange = (mode === 'booking' && state.bookingStart && state.bookingEnd && state.bookingStart <= state.bookingEnd)
    ? getDateRangeArray(state.bookingStart, state.bookingEnd)
    : [];

  for (let offset = -1; offset < 20; offset++) {
    const dateStr = fmtDate(offset);
    const parts = dateStr.split('-');
    const dayLabel = `${parts[2]}/${parts[1]}`;
    const isPast = offset < 0;
    const status = product.schedule ? product.schedule[dateStr] : null;
    const isSelectedEdge = mode === 'booking' && (dateStr === state.bookingStart || dateStr === state.bookingEnd);
    const isInRange = mode === 'booking' && selectedRange.includes(dateStr);

    let cls = 'cal-available';
    let subText = 'Trống';

    if (isPast) {
      cls = 'cal-past';
      subText = 'Qua';
    } else if (status === 'soft_locked') {
      cls = 'cal-softlock';
      subText = 'Giữ 10p';
    } else if (status === 'booked') {
      cls = 'cal-booked';
      subText = 'Đã đặt';
    } else if (status === 'owner_locked') {
      cls = 'cal-locked';
      subText = 'Khóa';
    } else if (isSelectedEdge) {
      cls = 'cal-selected';
      subText = 'Chọn';
    } else if (isInRange) {
      cls = 'cal-in-range';
      subText = 'Thuê';
    }

    const clickHandler = isPast
      ? ''
      : mode === 'booking'
        ? `onclick="handleBookingCalendarClick('${product.id}', '${dateStr}')"`
        : mode === 'owner'
          ? `onclick="handleOwnerCalendarToggle('${product.id}', '${dateStr}')"`
          : `onclick="handleWizardCalendarToggle('${dateStr}')"`;

    cells.push(`
      <div ${clickHandler} class="cal-day ${cls}" title="Ngày ${formatDateVN(dateStr)}: ${subText}">
        <span>${parts[2]}</span>
        <span class="text-[9px] font-medium opacity-85 leading-none mt-0.5">${subText}</span>
      </div>
    `);
  }

  return `
    <div class="space-y-2.5 ${mode !== 'booking' ? 'cal-owner-mode' : ''}">
      <!-- Legend 4 colors strictly matching Section 7 (F-S03) -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] font-semibold">
        <div class="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-50 text-green-800 border border-green-200">
          <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span><span>Xanh lá: Trống</span>
        </div>
        <div class="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span>Vàng: Giữ chỗ 10p</span>
        </div>
        <div class="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span><span>Xanh dương: Đã đặt</span>
        </div>
        <div class="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-300">
          <span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span><span>Xám: Chủ tự khóa</span>
        </div>
      </div>

      <!-- 21-Day Interactive Grid -->
      <div class="cal-grid pt-1">
        ${cells.join('')}
      </div>
    </div>
  `;
}

function handleBookingCalendarClick(productId, dateStr) {
  const product = getProductById(productId);
  const status = product.schedule ? product.schedule[dateStr] : null;
  state.conflictAlert = null;

  if (status === 'soft_locked') {
    showToast('Ngày này đang được giữ chỗ Soft-lock 10 phút bởi người khác!', 'warning');
    return;
  }
  if (status === 'booked') {
    showToast('Ngày này đã được đặt và thanh toán. Không thể đặt đè!', 'error');
    return;
  }
  if (status === 'owner_locked') {
    showToast('Ngày này đã được chủ đồ tự khóa cá nhân!', 'warning');
    return;
  }

  // Range selection logic
  if (!state.bookingStart || (state.bookingStart && state.bookingEnd && state.bookingStart !== state.bookingEnd) || dateStr < state.bookingStart) {
    state.bookingStart = dateStr;
    state.bookingEnd = dateStr;
  } else {
    // Check if any date between bookingStart and dateStr is unavailable (prevent double-booking)
    const range = getDateRangeArray(state.bookingStart, dateStr);
    const blocked = range.find(d => product.schedule && product.schedule[d]);
    if (blocked) {
      showToast(`Khoảng ngày chứa ngày ${formatDateVN(blocked)} không còn trống! Đã chọn lại ngày bắt đầu.`, 'warning');
      state.bookingStart = dateStr;
      state.bookingEnd = dateStr;
    } else {
      state.bookingEnd = dateStr;
    }
  }
  renderApp();
}

// Owner Toggle Calendar Day (F-S03: Click mở ngày trống / Click khóa ngày trống cá nhân)
function handleOwnerCalendarToggle(productId, dateStr) {
  const product = getProductById(productId);
  if (!product.schedule) product.schedule = {};
  const curr = product.schedule[dateStr];
  if (curr === 'booked' || curr === 'soft_locked') {
    showToast('Không thể khóa/mở ngày đang có khách giữ chỗ hoặc đã đặt!', 'error');
    return;
  }
  if (curr === 'owner_locked') {
    delete product.schedule[dateStr];
    showToast(`Đã mở trống lại ngày ${formatDateVN(dateStr)} (Xanh lá)`, 'success');
  } else {
    product.schedule[dateStr] = 'owner_locked';
    showToast(`Đã khóa cá nhân ngày ${formatDateVN(dateStr)} (Xám)`, 'info');
  }
  renderApp();
}

function handleWizardCalendarToggle(dateStr) {
  if (!state.wizardData.schedule) state.wizardData.schedule = {};
  if (state.wizardData.schedule[dateStr] === 'owner_locked') {
    delete state.wizardData.schedule[dateStr];
  } else {
    state.wizardData.schedule[dateStr] = 'owner_locked';
  }
  renderApp();
}

// Simulate Concurrent Slot Conflict (Section 32 - Luồng phụ 7: Xung đột giữ chỗ đồng thời)
function simulateConcurrentConflict(productId) {
  const product = getProductById(productId);
  if (!product.schedule) product.schedule = {};
  product.schedule[state.bookingStart] = 'soft_locked';
  const suggested = findFirstAvailableRange(product, 2);
  state.conflictAlert = {
    lockedDate: state.bookingStart,
    suggestedStart: suggested.start,
    suggestedEnd: suggested.end
  };
  showToast('Slot vừa bị giữ bởi người dùng gửi trước! Hệ thống đã gợi ý ngày trống khác.', 'warning');
  renderApp();
}

function applySuggestedDates(start, end) {
  state.bookingStart = start;
  state.bookingEnd = end;
  state.conflictAlert = null;
  showToast('Đã chọn khoảng ngày gợi ý mới!', 'success');
  renderApp();
}

// F-S04 + F-S05 + F-S06: Start Instant Booking & 10-Minute Soft-Lock
function handleStartInstantBooking(productId) {
  const product = getProductById(productId);

  // Guest check (F-G04: Nếu Guest bấm nút booking -> yêu cầu đăng nhập)
  if (!state.currentUser) {
    state.authModal = 'login';
    showToast('Vui lòng đăng nhập để Giữ chỗ & Thanh toán!', 'info');
    renderApp();
    return;
  }

  // Case 6 / Luồng phụ 8: Người dùng không thể đặt đồ của chính mình
  if (state.currentUser.id === product.ownerId) {
    showToast('Không cho phép: Bạn không thể đặt thuê sản phẩm của chính mình!', 'error');
    return;
  }

  // Validate date range
  if (!state.bookingStart || !state.bookingEnd || state.bookingStart > state.bookingEnd) {
    showToast('Vui lòng chọn ngày bắt đầu và ngày kết thúc hợp lệ!', 'warning');
    return;
  }

  const dates = getDateRangeArray(state.bookingStart, state.bookingEnd);
  const conflictDay = dates.find(d => product.schedule && product.schedule[d]);
  if (conflictDay) {
    const suggestion = findFirstAvailableRange(product, dates.length);
    state.conflictAlert = {
      lockedDate: conflictDay,
      suggestedStart: suggestion.start,
      suggestedEnd: suggestion.end
    };
    showToast('Slot vừa bị giữ hoặc không còn trống! Vui lòng chọn ngày gợi ý khác.', 'error');
    renderApp();
    return;
  }

  // Pricing Engine Formula (F-S06)
  // Tiền thuê gốc = Số ngày thuê × Đơn giá/ngày
  // Phí dịch vụ = 10% × Tiền thuê gốc
  // Tổng thanh toán = Tiền thuê gốc + Phí dịch vụ + Tiền cọc an toàn
  const days = dates.length;
  const baseRental = days * product.pricePerDay;
  const serviceFee = Math.round(baseRental * 0.10);
  const deposit = product.deposit;
  const totalAmount = baseRental + serviceFee + deposit;

  // Apply Soft-Lock 10 minutes (600 seconds) -> Calendar turns Amber (#F59E0B)
  if (!product.schedule) product.schedule = {};
  dates.forEach(d => {
    product.schedule[d] = 'soft_locked';
  });

  const owner = getUserById(product.ownerId);
  const newOrderId = `ORD-0${state.orders.length + 1}`;
  const newOrder = {
    id: newOrderId,
    productId: product.id,
    productTitle: product.title,
    productImage: product.images[0],
    renterId: state.currentUser.id,
    renterName: state.currentUser.name,
    ownerId: owner.id,
    ownerName: owner.name,
    startDate: state.bookingStart,
    endDate: state.bookingEnd,
    days,
    pricePerDay: product.pricePerDay,
    baseRental,
    serviceFee,
    deposit,
    totalAmount,
    status: 'Chờ thanh toán',
    escrowStatus: 'Chờ thanh toán QR',
    countdownSeconds: 600, // 10:00 soft-lock
    createdAt: 'Vừa xong',
    checkinPhotos: [],
    checkoutPhotos: [],
    renterCheckedIn: false,
    ownerCheckedIn: false,
    ownerCheckedOut: false,
    renterRated: false,
    ownerRated: false,
    dispute: null
  };

  state.orders.unshift(newOrder);
  showToast(`Đã giữ chỗ Soft-lock 10 phút cho đơn ${newOrderId}!`, 'success');
  navigateTo('payment', { orderId: newOrderId });
}

function renderProductDetailPage() {
  const product = getProductById(state.selectedProductId);
  const owner = getUserById(product.ownerId);
  const cat = getCategoryById(product.categoryId);
  const isOwnerSelf = state.currentUser && state.currentUser.id === product.ownerId;

  // Pricing Engine calculation (F-S06)
  const validDates = state.bookingStart && state.bookingEnd && state.bookingStart <= state.bookingEnd
    ? getDateRangeArray(state.bookingStart, state.bookingEnd)
    : [fmtDate(0)];
  const days = validDates.length;
  const baseRental = days * product.pricePerDay;
  const serviceFee = Math.round(baseRental * 0.10);
  const deposit = product.deposit;
  const totalAmount = baseRental + serviceFee + deposit;
  const isRangeAvailable = isProductAvailableInRange(product, state.bookingStart, state.bookingEnd);

  // Similar items at bottom of page (F-G04 & Section 36)
  const similarItems = state.products
    .filter(p => p.id !== product.id && p.approvalStatus === 'Đã duyệt' && p.visible && (p.categoryId === product.categoryId || p.area === product.area))
    .slice(0, 4);

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 page-enter">
      <!-- Breadcrumb -->
      <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-4">
        <div class="flex items-center gap-1.5">
          <button onclick="navigateTo('home')" class="hover:text-emerald-600 cursor-pointer">Trang chủ</button>
          <span>/</span>
          <button onclick="state.filters.categoryId='${cat.id}';navigateTo('catalog')" class="hover:text-emerald-600 cursor-pointer">${cat.name}</button>
          <span>/</span>
          <span class="text-slate-800 font-semibold truncate max-w-[220px]">${product.title}</span>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="toggleWishlist('${product.id}', event)" class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer">
            ${state.wishlist.includes(product.id) ? '❤️ Đã lưu yêu thích' : '🤍 Lưu yêu thích'}
          </button>
          <button onclick="openReportModal('product', '${product.id}', '${product.title.replace(/'/g, '')}')" class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-rose-600 font-semibold hover:bg-rose-50 cursor-pointer">
            🚩 Báo cáo bài đăng
          </button>
        </div>
      </div>

      <!-- Main 2-Column Layout (Section 36) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Left Column: Image Gallery + Product Info + Owner Card + Reviews -->
        <div class="lg:col-span-7 space-y-6">
          <!-- Gallery -->
          <div class="sr-card p-3 sm:p-4">
            <div class="relative rounded-xl overflow-hidden bg-slate-100">
              <img
                src="${product.images[state.selectedImageIdx] || product.images[0]}"
                onerror="this.src=createFallbackImage('${product.id}')"
                alt="${product.title}"
                class="aspect-4-3 rounded-xl"
              />
              <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-bold">
                Mã SP: ${product.id} • 📍 ${product.area}
              </span>
            </div>
            <div class="grid grid-cols-3 gap-2.5 mt-3">
              ${product.images.map((img, idx) => `
                <button
                  onclick="state.selectedImageIdx=${idx};renderApp()"
                  class="rounded-xl overflow-hidden border-2 transition cursor-pointer ${state.selectedImageIdx === idx ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-transparent opacity-75 hover:opacity-100'}"
                >
                  <img src="${img}" onerror="this.src=createFallbackImage('${product.id}')" class="h-20 w-full object-cover" />
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Product Details, Condition, Accessories Policy (F-G04) -->
          <div class="sr-card p-5 sm:p-6 space-y-4">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold">${cat.icon} ${cat.name}</span>
              <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">Tình trạng: ${product.condition}</span>
              <span class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">Nhãn hiệu: ${product.brand || 'Chính hãng'}</span>
            </div>

            <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">${product.title}</h1>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div>
                <div class="text-[11px] text-slate-500 font-semibold">Đơn giá thuê</div>
                <div class="text-lg font-extrabold text-emerald-600">${formatVND(product.pricePerDay)}<span class="text-xs font-normal text-slate-500">/ngày</span></div>
              </div>
              <div>
                <div class="text-[11px] text-slate-500 font-semibold">Giá ưu đãi theo tuần</div>
                <div class="text-base font-bold text-slate-800">${formatVND(product.weeklyPrice || product.pricePerDay * 6)}<span class="text-xs font-normal text-slate-500">/tuần</span></div>
              </div>
              <div class="col-span-2 sm:col-span-1">
                <div class="text-[11px] text-slate-500 font-semibold">Tiền cọc an toàn (Escrow)</div>
                <div class="text-base font-bold text-slate-900">${formatVND(product.deposit)}</div>
              </div>
            </div>

            <div class="space-y-3 text-sm text-slate-700">
              <div>
                <h3 class="font-bold text-slate-900 text-sm mb-1">📝 Mô tả thực tế</h3>
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${product.description}</p>
              </div>
              <div class="grid sm:grid-cols-2 gap-3 pt-2">
                <div class="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <div class="font-bold text-xs text-emerald-900 mb-1">🎒 Chính sách phụ kiện đi kèm</div>
                  <p class="text-xs text-slate-600 leading-relaxed">${product.accessories}</p>
                </div>
                <div class="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100">
                  <div class="font-bold text-xs text-amber-900 mb-1">📍 Điểm giao nhận & Lưu ý</div>
                  <p class="text-xs text-slate-700 font-semibold">${product.pickupPoint}</p>
                  <p class="text-xs text-slate-600 mt-1">${product.customPolicy}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Owner Info Card (F-G04 & F-S01) -->
          <div class="sr-card p-5 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3.5">
              <img src="${owner.avatar}" onerror="this.src=createFallbackImage('Owner')" class="w-14 h-14 rounded-2xl object-cover border border-slate-200" />
              <div>
                <div class="flex flex-wrap items-center gap-1.5">
                  <span class="font-extrabold text-slate-900 text-base">${owner.name}</span>
                  ${owner.verifiedStudent ? `<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">✔ Sinh viên xác thực</span>` : ''}
                  ${owner.isNewUser ? `<span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold">🌱 Người mới</span>` : ''}
                </div>
                <div class="text-xs text-slate-500 mt-0.5">${owner.school} • Khu vực ${owner.area}</div>
                <div class="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-semibold">
                  <span class="text-emerald-600">🛡️ Trust Score: ${owner.trustScore}/100</span>
                  <span class="text-amber-600">★ ${owner.rating || '5.0'} sao</span>
                  <span class="text-slate-700">✅ ${owner.completedTx} giao dịch thành công</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="openPublicProfile('${owner.id}')" class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer">
                Xem hồ sơ công khai
              </button>
              <button onclick="openReportModal('user', '${owner.id}', '${owner.name}')" class="px-3 py-2 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 text-xs font-semibold transition cursor-pointer" title="Báo cáo người dùng">
                🚩
              </button>
            </div>
          </div>

          <!-- Reviews Section (Section 36) -->
          <div class="sr-card p-5 space-y-4">
            <h3 class="font-extrabold text-slate-900 text-base">⭐ Đánh giá thực tế từ sinh viên đã thuê (${product.reviews ? product.reviews.length : 0})</h3>
            ${!product.reviews || product.reviews.length === 0 ? `
              <p class="text-xs text-slate-500 py-2">Sản phẩm chưa có đánh giá nào. Hãy là người đầu tiên thuê và đánh giá 2 chiều!</p>
            ` : `
              <div class="space-y-3">
                ${product.reviews.map(rv => `
                  <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-xs text-slate-900">${rv.userName}</span>
                      <span class="text-xs text-amber-500 font-bold">${'★'.repeat(rv.rating)} (${rv.date})</span>
                    </div>
                    <p class="text-xs text-slate-700">${rv.comment}</p>
                    <div class="flex flex-wrap gap-1.5 pt-1">
                      ${(rv.tags || []).map(t => `<span class="px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 text-[10px] font-bold"># ${t}</span>`).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>

        <!-- Right Sticky Column: INSTANT BOOKING ENGINE (F-S03, F-S04, F-S05, F-S06 & Section 36) -->
        <div class="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <div class="sr-card p-4 sm:p-6 border-2 border-emerald-500/30 shadow-lg space-y-5 overflow-hidden">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span class="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 block">INSTANT BOOKING ENGINE</span>
                <h2 class="text-base sm:text-lg font-extrabold text-slate-900">Lịch Khả Dụng & Đặt Chỗ Tức Thì</h2>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold shrink-0">Tự động 100%</span>
            </div>

            <!-- Interactive Calendar (F-S03) -->
            <div>
              <div class="flex flex-wrap items-center justify-between gap-1 mb-2">
                <label class="text-xs font-bold text-slate-700">1. Click chọn ngày trên Interactive Calendar:</label>
                <button onclick="simulateConcurrentConflict('${product.id}')" class="text-[11px] text-amber-600 hover:underline font-semibold cursor-pointer" title="Test Luồng phụ 7: Xung đột giữ chỗ đồng thời">
                  [Test xung đột giữ chỗ]
                </button>
              </div>
              ${renderInteractiveCalendar(product, 'booking')}
            </div>

            <!-- Conflict Alert (Luồng phụ 7: "Slot vừa bị giữ" và gợi ý ngày khác) -->
            ${state.conflictAlert ? `
              <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-2">
                <div class="font-extrabold text-amber-800 flex items-center gap-1.5">
                  <span>⚠️ Slot vừa bị giữ!</span>
                </div>
                <p>Ngày <strong>${formatDateVN(state.conflictAlert.lockedDate)}</strong> vừa được người dùng khác giữ chỗ trước vài giây.</p>
                <button
                  onclick="applySuggestedDates('${state.conflictAlert.suggestedStart}', '${state.conflictAlert.suggestedEnd}')"
                  class="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer"
                >
                  ✨ Chọn ngày trống gợi ý: ${formatDateVN(state.conflictAlert.suggestedStart)} → ${formatDateVN(state.conflictAlert.suggestedEnd)}
                </button>
              </div>
            ` : ''}

            <!-- Date Pickers Sync -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">Ngày bắt đầu nhận</label>
                <input
                  type="date"
                  value="${state.bookingStart}"
                  onchange="state.bookingStart=this.value;if(state.bookingEnd<this.value)state.bookingEnd=this.value;renderApp()"
                  class="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">Ngày kết thúc trả</label>
                <input
                  type="date"
                  value="${state.bookingEnd}"
                  onchange="state.bookingEnd=this.value;renderApp()"
                  class="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
              </div>
            </div>

            <!-- Availability Check Status -->
            <div class="px-3.5 py-2.5 rounded-xl text-xs font-bold flex flex-wrap items-center justify-between gap-1 ${isRangeAvailable ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}">
              <span>${isRangeAvailable ? `✅ Khoảng ngày khả dụng (${days} ngày thuê)` : '❌ Có ngày bận/đang giữ chỗ trong khoảng đã chọn'}</span>
              <span class="shrink-0">${formatDateVN(state.bookingStart)} → ${formatDateVN(state.bookingEnd)}</span>
            </div>

            <!-- PRICING ENGINE (F-S06) -->
            <div class="p-4 rounded-2xl bg-slate-900 text-white space-y-2.5">
              <div class="text-xs font-bold uppercase tracking-wider text-emerald-400">2. Chi tiết thanh toán (Pricing Engine)</div>
              <div class="flex items-start justify-between gap-2 text-xs sm:text-sm">
                <span class="text-slate-300">Tiền thuê gốc (${days} ngày × ${formatVND(product.pricePerDay)}):</span>
                <span class="font-bold shrink-0">${formatVND(baseRental)}</span>
              </div>
              <div class="flex items-start justify-between gap-2 text-xs sm:text-sm">
                <div>
                  <span class="text-slate-300">Phí dịch vụ (10% × Tiền thuê gốc):</span>
                  <span class="block text-[10px] text-amber-300 font-semibold">* Phí dịch vụ: không hoàn</span>
                </div>
                <span class="font-bold text-amber-300 shrink-0">${formatVND(serviceFee)}</span>
              </div>
              <div class="flex items-start justify-between gap-2 text-xs sm:text-sm">
                <div>
                  <span class="text-slate-300">Tiền cọc an toàn (Escrow):</span>
                  <span class="block text-[10px] text-emerald-400 font-semibold">* Tiền cọc: hoàn 100% nếu đồ nguyên vẹn</span>
                </div>
                <span class="font-bold text-emerald-400 shrink-0">${formatVND(deposit)}</span>
              </div>
              <div class="pt-2.5 border-t border-slate-700 flex items-baseline justify-between gap-2">
                <span class="text-sm font-extrabold">Tổng thanh toán:</span>
                <span class="text-lg sm:text-xl font-extrabold text-emerald-400 shrink-0">${formatVND(totalAmount)}</span>
              </div>
            </div>

            <!-- CTA Button: GIỮ CHỖ & THANH TOÁN QR (F-G04, F-S04, Section 36) -->
            ${isOwnerSelf ? `
              <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold text-center">
                ⚠️ Đây là sản phẩm của chính bạn. Bạn không thể tự đặt thuê đồ của mình.
              </div>
            ` : ''}
            <button
              onclick="handleStartInstantBooking('${product.id}')"
              ${!isRangeAvailable ? 'disabled' : ''}
              class="w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm sm:text-base shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${!isRangeAvailable || isOwnerSelf ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}"
            >
              <span>⚡ GIỮ CHỖ & THANH TOÁN QR</span>
            </button>

            <div class="text-[11px] text-slate-500 text-center leading-relaxed">
              Bấm nút trên để kích hoạt <strong>Soft-lock 10 phút</strong> (lịch chuyển vàng hổ phách) và nhận mã <strong>VietQR động</strong>. Đơn tự động xác nhận ngay sau khi quét QR, không chờ chủ duyệt!
            </div>
          </div>
        </div>
      </div>

      <!-- Đồ tương tự (F-G04 & Section 36) -->
      <section class="mt-12 pt-8 border-t border-slate-200">
        <h2 class="text-xl font-extrabold text-slate-900 mb-5">Đồ tương tự cùng danh mục / khu vực</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          ${similarItems.map(p => renderProductCard(p)).join('')}
        </div>
      </section>
    </div>
  `;
}

// ============================================================================
// F-S07 & SECTION 37 — TRANG THANH TOÁN VIETQR ĐỘNG
// ============================================================================
function renderPaymentPage() {
  const order = getOrderById(state.activePaymentOrderId) || state.orders[0];
  if (!order) return `<div class="p-10 text-center">Không tìm thấy đơn hàng</div>`;

  const isPaid = order.status !== 'Chờ thanh toán' && order.status !== 'Đã hủy';
  const isCancelled = order.status === 'Đã hủy';

  return `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 page-enter">
      <div class="sr-card p-4 sm:p-8 space-y-6 overflow-hidden">
        <!-- Top Status Header -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span class="text-xs font-bold uppercase text-emerald-600">CỔNG THANH TOÁN TỰ ĐỘNG VIETQR & ESCROW</span>
            <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">Thanh toán đơn thuê #${order.id}</h1>
          </div>
          <div>
            ${renderOrderStatusBadge(order.status)}
          </div>
        </div>

        ${isPaid || state.paymentSuccessEffect ? `
          <!-- Payment Success State (F-S07: Trạng thái "Thanh toán thành công!", lịch xanh dương, cọc vào Escrow) -->
          <div class="p-5 sm:p-8 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-center space-y-4 checkmark-circle">
            <div class="w-16 h-16 rounded-full bg-emerald-500 text-white text-3xl font-extrabold flex items-center justify-center mx-auto shadow-md">
              ✓
            </div>
            <h2 class="text-2xl font-extrabold text-emerald-900">Thanh toán thành công!</h2>
            <p class="text-sm text-emerald-800 max-w-lg mx-auto">
              Đơn <strong>${order.id}</strong> đã chuyển sang trạng thái <strong>“Đã đặt cọc”</strong> tự động mà không cần chủ đồ duyệt thủ công!
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-xl mx-auto pt-2">
              <div class="p-3 rounded-xl bg-white border border-emerald-200">
                <div class="text-[11px] text-slate-500 font-semibold">Trạng thái Lịch</div>
                <div class="text-xs font-extrabold text-blue-600 mt-0.5">🔵 Đã khóa cứng (Xanh dương)</div>
              </div>
              <div class="p-3 rounded-xl bg-white border border-emerald-200">
                <div class="text-[11px] text-slate-500 font-semibold">Quỹ bảo vệ Escrow</div>
                <div class="text-xs font-extrabold text-emerald-600 mt-0.5">🛡️ Đã giữ cọc ${formatVND(order.deposit)}</div>
              </div>
              <div class="p-3 rounded-xl bg-white border border-emerald-200">
                <div class="text-[11px] text-slate-500 font-semibold">Trạng thái đơn</div>
                <div class="text-xs font-extrabold text-slate-900 mt-0.5">✅ Đã đặt cọc</div>
              </div>
            </div>
            <div class="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button onclick="navigateTo('dashboard', { dashboardTab: 'rented_in' })" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer">
                📦 Xem đơn & Thực hiện Check-in nhận đồ
              </button>
              <button onclick="navigateTo('detail', { productId: '${order.productId}' })" class="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-sm cursor-pointer">
                📅 Kiểm tra lịch Xanh dương trên sản phẩm
              </button>
              <button onclick="openChatForOrder('${order.id}')" class="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm cursor-pointer">
                💬 Chat hẹn giờ giao nhận
              </button>
            </div>
          </div>
        ` : isCancelled ? `
          <!-- Cancelled / Expired State -->
          <div class="p-6 rounded-2xl bg-red-50 border border-red-200 text-center space-y-3">
            <div class="text-3xl">⛔</div>
            <h2 class="text-xl font-extrabold text-red-800">Đơn giữ chỗ đã bị hủy</h2>
            <p class="text-xs sm:text-sm text-red-700">${order.cancelReason || 'Hết thời gian 10 phút giữ chỗ hoặc bạn đã chủ động hủy trước thanh toán. Lịch sản phẩm đã được giải phóng về màu xanh lá.'}</p>
            <button onclick="navigateTo('detail', { productId: '${order.productId}' })" class="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs sm:text-sm cursor-pointer">
              Quay lại chọn ngày đặt lại
            </button>
          </div>
        ` : `
          <!-- Waiting for VietQR Scan State (Section 10 & Section 37) -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <!-- Center/Left: Large Mock VietQR Card -->
            <div class="md:col-span-6 flex flex-col items-center p-4 sm:p-5 rounded-2xl bg-slate-900 text-white text-center space-y-3">
              <div class="flex flex-wrap items-center justify-center gap-1.5 text-xs font-extrabold tracking-wider text-emerald-400">
                <span>VIETQR NAPAS 247</span>
                <span>•</span>
                <span>STUDENTRENT ESCROW</span>
              </div>

              <!-- Simulated VietQR SVG Graphic -->
              <div class="bg-white p-3.5 sm:p-4 rounded-2xl shadow-lg w-52 h-52 sm:w-56 sm:h-56 flex flex-col items-center justify-center relative">
                <svg viewBox="0 0 120 120" class="w-40 h-40 sm:w-44 sm:h-44">
                  <rect width="120" height="120" fill="#ffffff"/>
                  <!-- QR Finder Patterns -->
                  <rect x="8" y="8" width="28" height="28" fill="none" stroke="#0F172A" stroke-width="4"/>
                  <rect x="14" y="14" width="16" height="16" fill="#0F172A"/>
                  <rect x="84" y="8" width="28" height="28" fill="none" stroke="#0F172A" stroke-width="4"/>
                  <rect x="90" y="14" width="16" height="16" fill="#0F172A"/>
                  <rect x="8" y="84" width="28" height="28" fill="none" stroke="#0F172A" stroke-width="4"/>
                  <rect x="14" y="90" width="16" height="16" fill="#0F172A"/>
                  <!-- QR Data Matrix Simulation -->
                  <rect x="44" y="10" width="6" height="6" fill="#0F172A"/>
                  <rect x="56" y="10" width="12" height="6" fill="#0F172A"/>
                  <rect x="44" y="22" width="12" height="6" fill="#0F172A"/>
                  <rect x="68" y="22" width="8" height="12" fill="#0F172A"/>
                  <rect x="10" y="44" width="12" height="6" fill="#0F172A"/>
                  <rect x="28" y="44" width="8" height="12" fill="#0F172A"/>
                  <rect x="44" y="44" width="32" height="32" rx="6" fill="#10B981"/>
                  <text x="60" y="65" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">SR</text>
                  <rect x="84" y="44" width="10" height="6" fill="#0F172A"/>
                  <rect x="100" y="48" width="12" height="8" fill="#0F172A"/>
                  <rect x="10" y="64" width="18" height="6" fill="#0F172A"/>
                  <rect x="84" y="64" width="24" height="6" fill="#0F172A"/>
                  <rect x="44" y="84" width="10" height="10" fill="#0F172A"/>
                  <rect x="62" y="84" width="16" height="6" fill="#0F172A"/>
                  <rect x="84" y="84" width="12" height="12" fill="#0F172A"/>
                  <rect x="102" y="94" width="10" height="18" fill="#0F172A"/>
                  <rect x="48" y="102" width="28" height="10" fill="#0F172A"/>
                </svg>
                <div class="text-[10px] font-bold text-slate-500 mt-1">Quét bằng App Ngân hàng / MoMo</div>
              </div>

              <!-- Countdown Timer 10:00 (F-S07) -->
              <div class="w-full p-3 rounded-xl bg-amber-500/20 border border-amber-400/40 flex flex-wrap items-center justify-between gap-2">
                <span class="text-xs font-semibold text-amber-200">⏳ Thời gian giữ chỗ Soft-lock:</span>
                <span id="countdown-${order.id}" class="text-lg font-extrabold text-amber-300 font-mono">${formatCountdown(order.countdownSeconds)}</span>
              </div>

              <!-- Status Indicator -->
              <div class="flex items-center gap-2 text-xs font-bold text-amber-300">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                <span>Đang chờ thanh toán...</span>
              </div>
            </div>

            <!-- Right: Payment Details & DEMO Simulation Buttons -->
            <div class="md:col-span-6 space-y-4">
              <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs sm:text-sm">
                <div class="flex flex-wrap justify-between gap-1 py-1 border-b border-slate-200/70">
                  <span class="text-slate-500">Tên tài khoản thụ hưởng:</span>
                  <span class="font-bold text-slate-900 text-right">QUY KY QUY STUDENTRENT ESCROW</span>
                </div>
                <div class="flex flex-wrap justify-between gap-1 py-1 border-b border-slate-200/70">
                  <span class="text-slate-500">Ngân hàng:</span>
                  <span class="font-bold text-slate-900 text-right">MB Bank - CN Hà Nội</span>
                </div>
                <div class="flex flex-wrap justify-between gap-1 py-1 border-b border-slate-200/70">
                  <span class="text-slate-500">Sản phẩm thuê:</span>
                  <span class="font-bold text-slate-900 text-right max-w-[200px] truncate">${order.productTitle}</span>
                </div>
                <div class="flex flex-wrap justify-between gap-1 py-1 border-b border-slate-200/70">
                  <span class="text-slate-500">Thời gian thuê:</span>
                  <span class="font-bold text-slate-900 text-right">${formatDateVN(order.startDate)} → ${formatDateVN(order.endDate)} (${order.days} ngày)</span>
                </div>
                <div class="flex flex-wrap justify-between gap-1 py-1 border-b border-slate-200/70">
                  <span class="text-slate-500">Tiền thuê + Phí DV (10%):</span>
                  <span class="font-semibold text-slate-800 text-right">${formatVND(order.baseRental)} + ${formatVND(order.serviceFee)}</span>
                </div>
                <div class="flex flex-wrap justify-between gap-1 py-1 border-b border-slate-200/70">
                  <span class="text-slate-500">Tiền cọc ký quỹ Escrow:</span>
                  <span class="font-bold text-emerald-600 text-right">${formatVND(order.deposit)}</span>
                </div>
                <div class="flex flex-wrap justify-between gap-1 py-1.5 border-b border-slate-200">
                  <span class="text-slate-700 font-bold">Số tiền chuyển khoản:</span>
                  <span class="text-lg font-extrabold text-emerald-600">${formatVND(order.totalAmount)}</span>
                </div>
                <div class="flex flex-wrap justify-between items-center gap-2 pt-1">
                  <span class="text-slate-700 font-bold">Nội dung chuyển khoản:</span>
                  <span class="px-3 py-1 rounded-lg bg-amber-100 text-amber-900 font-extrabold font-mono text-sm">SR ${order.id}</span>
                </div>
              </div>

              ${state.paymentErrorMsg ? `
                <div class="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  ⚠️ ${state.paymentErrorMsg}
                </div>
              ` : ''}

              <!-- Primary DEMO Button required by F-S07 -->
              <button
                onclick="simulatePaymentSuccess('${order.id}')"
                class="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm sm:text-base shadow-lg transition cursor-pointer"
              >
                [DEMO] Giả lập thanh toán thành công
              </button>

              <!-- Secondary Demo Controls for Edge Cases (Section 32 - Luồng phụ 3, 4, 5) -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <button
                  onclick="simulatePaymentFailure('${order.id}')"
                  class="py-2 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold cursor-pointer"
                >
                  ⚡ [DEMO] Lỗi kết nối QR
                </button>
                <button
                  onclick="expireSoftLockOrder('${order.id}');renderApp()"
                  class="py-2 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold cursor-pointer"
                >
                  ⏱️ [DEMO] Tua hết 10p
                </button>
                <button
                  onclick="cancelOrderBeforePayment('${order.id}')"
                  class="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer"
                >
                  ✕ Khách hủy giữ chỗ
                </button>
              </div>
            </div>
          </div>
        `}
      </div>
    </div>
  `;
}

// F-S07: Simulate VietQR Payment Success
function simulatePaymentSuccess(orderId) {
  const order = getOrderById(orderId);
  if (!order) return;

  order.status = 'Đã đặt cọc';
  order.escrowStatus = 'Cọc đang giữ';
  order.countdownSeconds = 0;
  state.paymentSuccessEffect = true;
  state.paymentErrorMsg = '';

  // Lock calendar dates in Blue (#3B82F6 - 'booked')
  const product = getProductById(order.productId);
  if (product) {
    if (!product.schedule) product.schedule = {};
    const dates = getDateRangeArray(order.startDate, order.endDate);
    dates.forEach(d => {
      product.schedule[d] = 'booked';
    });
  }

  // Record in Escrow Pool (F-A05)
  state.escrowLogs.unshift({
    id: 'ESC-' + Math.floor(200 + Math.random() * 800),
    orderId: order.id,
    action: 'Ký quỹ tiền cọc (VietQR Auto)',
    amount: order.deposit,
    type: 'hold',
    note: `Tự động xác nhận từ giao dịch SR ${order.id}. Không cần chủ đồ duyệt.`,
    time: 'Vừa xong'
  });

  // Push notifications (F-S14)
  pushNotification('QR thành công', `Thanh toán thành công ${formatVND(order.totalAmount)} cho đơn ${order.id}. Cọc ${formatVND(order.deposit)} đã vào Escrow.`, order.id);
  pushNotification('Đơn mới thanh toán', `Đơn ${order.id} (${order.productTitle}) đã chuyển sang Đã đặt cọc và khóa lịch xanh dương.`, order.id);

  showToast('Thanh toán thành công! Đơn đã xác nhận tự động & cọc vào Escrow.', 'success');
  renderApp();
}

// Luồng phụ 3: QR thất bại / lỗi kết nối -> không xác nhận đơn
function simulatePaymentFailure(orderId) {
  state.paymentErrorMsg = 'Kết nối cổng VietQR bị gián đoạn hoặc chưa nhận được giao dịch. Đơn chưa được xác nhận, lịch vẫn đang được giữ chỗ Soft-lock cho bạn. Vui lòng thử quét lại!';
  showToast('Giả lập lỗi kết nối QR: Đơn chưa xác nhận, vui lòng thử lại!', 'warning');
  renderApp();
}

// Luồng phụ 4: Khách hủy trước thanh toán -> hủy booking & giải phóng lịch
function cancelOrderBeforePayment(orderId) {
  const order = getOrderById(orderId);
  if (!order) return;
  order.status = 'Đã hủy';
  order.countdownSeconds = 0;
  order.escrowStatus = 'Không phát sinh';
  order.cancelReason = 'Khách chủ động hủy giữ chỗ trước khi thanh toán. Lịch đã giải phóng.';

  const product = getProductById(order.productId);
  if (product && product.schedule) {
    const dates = getDateRangeArray(order.startDate, order.endDate);
    dates.forEach(d => {
      if (product.schedule[d] === 'soft_locked') delete product.schedule[d];
    });
  }
  showToast(`Đã hủy giữ chỗ đơn ${order.id} và giải phóng lịch trống!`, 'info');
  renderApp();
}

// Luồng phụ 6: Hủy sau khi đã đặt cọc -> xử lý theo chính sách hoàn hủy mô phỏng
function cancelOrderAfterDeposit(orderId) {
  const order = getOrderById(orderId);
  if (!order || order.status !== 'Đã đặt cọc') return;
  order.status = 'Đã hủy';
  order.escrowStatus = 'Cọc đã hoàn';
  order.cancelReason = 'Khách hủy đơn sau khi đặt cọc (trước 24h nhận đồ): Hoàn 100% tiền cọc + tiền thuê gốc từ Escrow (phí dịch vụ 10% không hoàn).';

  const product = getProductById(order.productId);
  if (product && product.schedule) {
    const dates = getDateRangeArray(order.startDate, order.endDate);
    dates.forEach(d => {
      if (product.schedule[d] === 'booked') delete product.schedule[d];
    });
  }

  state.escrowLogs.unshift({
    id: 'ESC-' + Math.floor(200 + Math.random() * 800),
    orderId: order.id,
    action: 'Hoàn cọc do hủy đơn trước 24h',
    amount: order.deposit,
    type: 'refunded',
    note: `Hoàn trả 100% tiền cọc (${formatVND(order.deposit)}) cho người thuê và mở lại lịch trống.`,
    time: 'Vừa xong'
  });

  pushNotification('Cọc đã hoàn', `Đơn ${order.id} đã hủy theo chính sách. Escrow đã hoàn trả ${formatVND(order.deposit)} tiền cọc.`, order.id);
  showToast(`Đã hủy đơn ${order.id} & hoàn trả 100% tiền cọc từ Escrow!`, 'info');
  renderApp();
}
