// StudentRent - Admin Portal (F-A01 -> F-A08) & Interactive Modals + App Mount

// ============================================================================
// ADMIN PORTAL (SECTION 20 -> 27 & SECTION 41)
// ============================================================================
function renderAdminPortalPage() {
  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard (F-A01)' },
    { id: 'users', icon: '👥', label: 'Người dùng (F-A02)' },
    { id: 'listings', icon: '📋', label: 'Tin đăng (F-A03)', badge: state.products.filter(p => p.approvalStatus === 'Chờ duyệt' || p.approvalStatus === 'Bị báo cáo').length },
    { id: 'transactions', icon: '📦', label: 'Giao dịch (F-A04)' },
    { id: 'escrow', icon: '🛡️', label: 'Escrow Pool (F-A05)' },
    { id: 'disputes', icon: '⚖️', label: 'Tranh chấp (F-A06)', badge: state.orders.filter(o => o.status === 'Tranh chấp').length },
    { id: 'categories', icon: '🗂️', label: 'Danh mục (F-A07)' },
    { id: 'reports', icon: '📈', label: 'Báo cáo (F-A08)' }
  ];

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 page-enter">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Admin Sidebar (Section 41) -->
        <aside class="lg:col-span-3 sr-card p-4 lg:sticky lg:top-20 space-y-2">
          <div class="px-3 py-2 border-b border-slate-100 mb-2">
            <span class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block">STUDENTRENT ADMIN PORTAL</span>
            <div class="font-extrabold text-slate-900 text-sm">Trung tâm Kiểm soát & Phân xử</div>
          </div>
          <div class="flex lg:flex-col gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            ${sidebarItems.map(item => `
              <button
                onclick="state.adminTab='${item.id}';renderApp()"
                class="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${state.adminTab === item.id ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'}"
              >
                <span class="flex items-center gap-2"><span>${item.icon}</span><span>${item.label}</span></span>
                ${item.badge ? `<span class="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white">${item.badge}</span>` : ''}
              </button>
            `).join('')}
          </div>
        </aside>

        <!-- Admin Main Content -->
        <div class="lg:col-span-9 space-y-6">
          ${state.adminTab === 'dashboard' ? renderAdminDashboardTab() : ''}
          ${state.adminTab === 'users' ? renderAdminUsersTab() : ''}
          ${state.adminTab === 'listings' ? renderAdminListingsTab() : ''}
          ${state.adminTab === 'transactions' ? renderAdminTransactionsTab() : ''}
          ${state.adminTab === 'escrow' ? renderAdminEscrowTab() : ''}
          ${state.adminTab === 'disputes' ? renderAdminDisputesTab() : ''}
          ${state.adminTab === 'categories' ? renderAdminCategoriesTab() : ''}
          ${state.adminTab === 'reports' ? renderAdminReportsTab() : ''}
        </div>
      </div>
    </div>
  `;
}

// F-A01 — Admin Dashboard
function renderAdminDashboardTab() {
  const totalUsers = state.users.length;
  const totalListings = state.products.length;
  const totalTx = state.orders.length;
  const activeTx = state.orders.filter(o => !['Hoàn tất', 'Đã hủy'].includes(o.status)).length;
  const escrowHolding = state.orders
    .filter(o => ['Đã đặt cọc', 'Sắp nhận đồ', 'Đang thuê', 'Sắp đến hạn', 'Quá hạn', 'Đã trả đồ', 'Tranh chấp'].includes(o.status))
    .reduce((s, o) => s + o.deposit, 0);
  const platformFeeRevenue = state.orders
    .filter(o => o.status !== 'Đã hủy')
    .reduce((s, o) => s + o.serviceFee, 0) + 1850000;

  return `
    <div class="space-y-6">
      <div class="sr-card p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-extrabold text-slate-900">📊 F-A01 — Admin Dashboard Tổng Quan</h1>
          <p class="text-xs text-slate-500">Giám sát người dùng, tin đăng, giao dịch, quỹ ký quỹ Escrow & doanh thu phí sàn (10%)</p>
        </div>
        <div class="flex gap-2">
          <button onclick="state.adminTab='listings';state.adminListingFilter='Chờ duyệt';renderApp()" class="px-3.5 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold cursor-pointer">
            Duyệt tin đăng (${state.products.filter(p => p.approvalStatus === 'Chờ duyệt').length})
          </button>
          <button onclick="state.adminTab='disputes';renderApp()" class="px-3.5 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold cursor-pointer">
            Phân xử tranh chấp (${state.orders.filter(o => o.status === 'Tranh chấp').length})
          </button>
        </div>
      </div>

      <!-- Số liệu & Tài chính (F-A01) -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div class="sr-card p-4">
          <div class="text-[11px] font-bold text-slate-500 uppercase">Người dùng</div>
          <div class="text-2xl font-extrabold text-slate-900 mt-1">${totalUsers}</div>
          <div class="text-[11px] text-emerald-600 font-semibold mt-0.5">${state.users.filter(u => u.verifiedStudent).length} SV xác thực</div>
        </div>
        <div class="sr-card p-4">
          <div class="text-[11px] font-bold text-slate-500 uppercase">Tin đăng</div>
          <div class="text-2xl font-extrabold text-slate-900 mt-1">${totalListings}</div>
          <div class="text-[11px] text-amber-600 font-semibold mt-0.5">${state.products.filter(p => p.approvalStatus === 'Chờ duyệt').length} chờ duyệt</div>
        </div>
        <div class="sr-card p-4">
          <div class="text-[11px] font-bold text-slate-500 uppercase">Giao dịch (Tổng / Đang chạy)</div>
          <div class="text-2xl font-extrabold text-blue-600 mt-1">${totalTx} <span class="text-sm text-slate-500">/ ${activeTx}</span></div>
          <div class="text-[11px] text-slate-500 font-semibold mt-0.5">${activeTx} đơn đang diễn ra</div>
        </div>
        <div class="sr-card p-4 border-l-4 border-l-emerald-500">
          <div class="text-[11px] font-bold text-slate-500 uppercase">Tổng cọc đang lưu ký</div>
          <div class="text-xl font-extrabold text-emerald-600 mt-1">${formatVND(escrowHolding)}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">An toàn trong Escrow Pool</div>
        </div>
        <div class="sr-card p-4 border-l-4 border-l-amber-500 col-span-2 sm:col-span-1">
          <div class="text-[11px] font-bold text-slate-500 uppercase">Doanh thu phí sàn tích lũy</div>
          <div class="text-xl font-extrabold text-amber-600 mt-1">${formatVND(platformFeeRevenue)}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">10% phí dịch vụ mỗi đơn</div>
        </div>
      </div>

      <!-- Biểu đồ: Doanh thu theo tuần/tháng & Cơ cấu danh mục thuê nhiều nhất (F-A01) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="sr-card p-5 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-extrabold text-slate-900 text-sm">📈 Biểu đồ Doanh thu phí sàn theo tuần/tháng</h3>
            <span class="text-xs font-bold text-emerald-600">+28% so với tháng trước</span>
          </div>
          <div class="grid grid-cols-4 gap-3 items-end h-44 pt-6 px-2 border-b border-slate-200">
            ${[
              { label: 'Tuần 1', val: 420000, h: '55%' },
              { label: 'Tuần 2', val: 580000, h: '72%' },
              { label: 'Tuần 3', val: 490000, h: '64%' },
              { label: 'Tuần 4', val: 740000, h: '95%' }
            ].map(bar => `
              <div class="flex flex-col items-center justify-end h-full gap-1.5">
                <span class="text-[10px] font-bold text-slate-600">${formatVND(bar.val)}</span>
                <div class="w-full max-w-[44px] rounded-t-xl bg-emerald-500 hover:bg-emerald-600 transition" style="height:${bar.h}"></div>
                <span class="text-xs font-bold text-slate-700">${bar.label}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="sr-card p-5 space-y-3">
          <h3 class="font-extrabold text-slate-900 text-sm">🥧 Cơ cấu danh mục thuê nhiều nhất</h3>
          <div class="space-y-2.5 pt-1">
            ${[
              { name: '📷 Máy ảnh/Camera', pct: 32, color: 'bg-emerald-500' },
              { name: '📽️ Đồ điện tử (Máy chiếu, Loa)', pct: 24, color: 'bg-blue-500' },
              { name: '⛺ Dụng cụ sự kiện/Dã ngoại', pct: 18, color: 'bg-amber-500' },
              { name: '👔 Trang phục kỷ yếu/biểu diễn', pct: 15, color: 'bg-indigo-500' },
              { name: '🍳 Đồ gia dụng & Học tập & Khác', pct: 11, color: 'bg-slate-500' }
            ].map(item => `
              <div>
                <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>${item.name}</span>
                  <span class="font-bold">${item.pct}%</span>
                </div>
                <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full ${item.color} rounded-full" style="width:${item.pct}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// F-A02 — Quản lý người dùng
function renderAdminUsersTab() {
  const kw = state.adminUserSearch.trim().toLowerCase();
  let list = state.users.filter(u => {
    if (kw && !u.name.toLowerCase().includes(kw) && !u.email.toLowerCase().includes(kw) && !u.school.toLowerCase().includes(kw)) return false;
    if (state.adminUserFilter === 'verified' && !u.verifiedStudent) return false;
    if (state.adminUserFilter === 'pending' && !u.pendingVerify) return false;
    if (state.adminUserFilter === 'locked' && u.status !== 'locked') return false;
    return true;
  });

  return `
    <div class="sr-card p-5 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-extrabold text-slate-900">👥 F-A02 — Quản Lý Người Dùng (${list.length})</h2>
          <p class="text-xs text-slate-500">Tìm kiếm, xem uy tín, duyệt huy hiệu Sinh viên xác thực, cảnh cáo & khóa/mở khóa tài khoản gian lận</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value="${state.adminUserSearch}"
            oninput="state.adminUserSearch=this.value;renderApp()"
            placeholder="Tìm tên, email, trường..."
            class="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
          />
          <select onchange="state.adminUserFilter=this.value;renderApp()" class="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold">
            <option value="all" ${state.adminUserFilter === 'all' ? 'selected' : ''}>Tất cả người dùng</option>
            <option value="verified" ${state.adminUserFilter === 'verified' ? 'selected' : ''}>Đã xác thực SV</option>
            <option value="pending" ${state.adminUserFilter === 'pending' ? 'selected' : ''}>Chờ duyệt tích xanh</option>
            <option value="locked" ${state.adminUserFilter === 'locked' ? 'selected' : ''}>Đang bị khóa</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-slate-200 text-slate-500 uppercase">
              <th class="py-2.5 px-2">Sinh viên</th>
              <th class="py-2.5 px-2">Trường / Khu vực</th>
              <th class="py-2.5 px-2">Uy tín & GD</th>
              <th class="py-2.5 px-2">Xác thực / Trạng thái</th>
              <th class="py-2.5 px-2 text-right">Thao tác Admin</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${list.map(u => `
              <tr class="hover:bg-slate-50/80">
                <td class="py-3 px-2">
                  <div class="flex items-center gap-2.5">
                    <img src="${u.avatar}" onerror="this.src=createFallbackImage('U')" class="w-9 h-9 rounded-xl object-cover" />
                    <div>
                      <div class="font-bold text-slate-900">${u.name}</div>
                      <div class="text-[11px] text-slate-500">${u.email} • ${u.phone}</div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-2">
                  <div class="font-semibold text-slate-800">${u.school}</div>
                  <div class="text-[11px] text-slate-500">📍 ${u.area} • MSSV: ${u.studentId}</div>
                </td>
                <td class="py-3 px-2">
                  <div class="font-bold text-emerald-600">Trust: ${u.trustScore}/100 (★${u.rating || 'Mới'})</div>
                  <div class="text-[11px] text-slate-500">${u.completedTx} GD • ${u.complaints || 0} khiếu nại • ${u.warnings || 0} cảnh cáo</div>
                </td>
                <td class="py-3 px-2 space-y-1">
                  ${u.verifiedStudent
                    ? `<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold block w-fit">✔ SV Xác thực</span>`
                    : `<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold block w-fit">⏳ Chờ duyệt SV</span>`
                  }
                  ${u.status === 'locked'
                    ? `<span class="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold block w-fit">🔒 Đã khóa</span>`
                    : `<span class="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold block w-fit">● Hoạt động</span>`
                  }
                </td>
                <td class="py-3 px-2 text-right">
                  <div class="flex flex-wrap items-center justify-end gap-1">
                    <button onclick="openPublicProfile('${u.id}')" class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer">Chi tiết</button>
                    ${!u.verifiedStudent ? `
                      <button onclick="adminVerifyStudent('${u.id}')" class="px-2 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold cursor-pointer">✔ Duyệt huy hiệu</button>
                    ` : ''}
                    <button onclick="adminWarnUser('${u.id}')" class="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold cursor-pointer">Cảnh cáo</button>
                    <button onclick="adminToggleLockUser('${u.id}')" class="px-2 py-1 rounded-lg ${u.status === 'locked' ? 'bg-blue-600 text-white' : 'bg-rose-600 text-white'} font-bold cursor-pointer">
                      ${u.status === 'locked' ? 'Mở khóa' : 'Khóa TK'}
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ${renderTablePagination(list.length)}
    </div>
  `;
}

function renderTablePagination(totalCount) {
  return `
    <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
      <span>Hiển thị <strong>1–${totalCount}</strong> trên tổng <strong>${totalCount}</strong> bản ghi</span>
      <div class="flex items-center gap-1">
        <button class="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-400">‹ Trước</button>
        <button class="px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-bold">1</button>
        <button class="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-400">Sau ›</button>
      </div>
    </div>
  `;
}

function adminVerifyStudent(userId) {
  const u = getUserById(userId);
  if (!u) return;
  u.verifiedStudent = true;
  u.pendingVerify = false;
  showToast(`Đã duyệt huy hiệu "Sinh viên xác thực" cho ${u.name}!`, 'success');
  renderApp();
}

function adminWarnUser(userId) {
  const u = getUserById(userId);
  if (!u) return;
  u.warnings = (u.warnings || 0) + 1;
  u.trustScore = Math.max(0, (u.trustScore || 80) - 5);
  showToast(`Đã gửi cảnh cáo vi phạm tới ${u.name} (Trust Score -5)`, 'warning');
  renderApp();
}

function adminToggleLockUser(userId) {
  const u = getUserById(userId);
  if (!u) return;
  u.status = u.status === 'locked' ? 'active' : 'locked';
  showToast(u.status === 'locked' ? `Đã khóa tài khoản gian lận: ${u.name}` : `Đã mở khóa tài khoản: ${u.name}`, u.status === 'locked' ? 'error' : 'success');
  renderApp();
}

// F-A03 — Quản lý tin đăng (Chờ duyệt, Đã duyệt, Bị ẩn, Bị báo cáo)
function renderAdminListingsTab() {
  const kw = state.adminListingSearch.trim().toLowerCase();
  let list = state.products.filter(p => {
    if (state.adminListingFilter !== 'all' && p.approvalStatus !== state.adminListingFilter) return false;
    if (kw && !p.title.toLowerCase().includes(kw) && !p.id.toLowerCase().includes(kw)) return false;
    return true;
  });

  return `
    <div class="sr-card p-5 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-extrabold text-slate-900">📋 F-A03 — Quản Lý & Kiểm Duyệt Tin Đăng (${list.length})</h2>
          <p class="text-xs text-slate-500">Phê duyệt tin mới lên trang chủ, từ chối kèm lý do, gỡ bài hoặc xử lý báo cáo vi phạm</p>
        </div>
        <div class="flex flex-wrap items-center gap-1.5">
          <input
            type="text"
            value="${state.adminListingSearch}"
            oninput="state.adminListingSearch=this.value;renderApp()"
            placeholder="Tìm mã SP, tên bài..."
            class="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
          />
          ${['all', 'Chờ duyệt', 'Đã duyệt', 'Bị ẩn', 'Bị báo cáo'].map(st => `
            <button
              onclick="state.adminListingFilter='${st}';renderApp()"
              class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${state.adminListingFilter === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
            >
              ${st === 'all' ? 'Tất cả' : st}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="space-y-3">
        ${list.map(p => {
          const owner = getUserById(p.ownerId);
          const cat = getCategoryById(p.categoryId);
          return `
            <div class="p-4 rounded-2xl border border-slate-200 bg-white flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-start gap-3.5 min-w-0">
                <img src="${p.images[0]}" onerror="this.src=createFallbackImage('${p.id}')" class="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200" />
                <div class="space-y-1 min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-slate-900 text-white text-xs font-bold">${p.id}</span>
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      p.approvalStatus === 'Đã duyệt' ? 'bg-green-100 text-green-800' :
                      p.approvalStatus === 'Chờ duyệt' ? 'bg-amber-100 text-amber-800' :
                      p.approvalStatus === 'Bị báo cáo' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                    }">${p.approvalStatus}</span>
                    <span class="text-xs text-slate-500">${cat.icon} ${cat.name} • 📍 ${p.area}</span>
                  </div>
                  <div onclick="navigateTo('detail', { productId: '${p.id}' })" class="font-extrabold text-slate-900 text-sm hover:text-emerald-600 cursor-pointer">${p.title}</div>
                  <div class="text-xs text-slate-600">Chủ đồ: <strong>${owner.name}</strong> • Giá: <strong class="text-emerald-600">${formatVND(p.pricePerDay)}/ngày</strong> • Cọc: <strong>${formatVND(p.deposit)}</strong></div>
                  ${p.reportReason ? `<div class="text-xs text-rose-600 font-semibold">🚩 Báo cáo: ${p.reportReason}</div>` : ''}
                  ${p.rejectReason ? `<div class="text-xs text-red-600 font-semibold">⛔ Lý do từ chối: ${p.rejectReason}</div>` : ''}
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                ${p.approvalStatus !== 'Đã duyệt' ? `
                  <button onclick="adminApproveListing('${p.id}')" class="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold cursor-pointer">
                    ✓ Phê duyệt (Hiển thị công khai)
                  </button>
                ` : ''}
                <button onclick="state.adminRejectModalProductId='${p.id}';renderApp()" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold cursor-pointer">
                  ✕ Từ chối (Nhập lý do)
                </button>
                <button onclick="adminHideListing('${p.id}')" class="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer">
                  Gỡ / Ẩn bài
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      ${renderTablePagination(list.length)}
    </div>
  `;
}

function adminApproveListing(productId) {
  const p = getProductById(productId);
  if (!p) return;
  p.approvalStatus = 'Đã duyệt';
  p.visible = true;
  p.reportReason = '';
  showToast(`Đã phê duyệt bài đăng ${p.id}! Sản phẩm đã hiển thị công khai trên trang chủ.`, 'success');
  renderApp();
}

function adminConfirmRejectListing(productId) {
  const p = getProductById(productId);
  if (!p) return;
  const reason = document.getElementById('admin-reject-reason')?.value || 'Ảnh sản phẩm không rõ nét hoặc mức giá/cọc nằm ngoài khung quy định danh mục.';
  p.approvalStatus = 'Bị ẩn';
  p.visible = false;
  p.rejectReason = reason;
  state.adminRejectModalProductId = null;
  showToast(`Đã từ chối bài đăng ${p.id} kèm lý do gửi chủ đồ.`, 'warning');
  renderApp();
}

function adminHideListing(productId) {
  const p = getProductById(productId);
  if (!p) return;
  p.approvalStatus = 'Bị ẩn';
  p.visible = false;
  showToast(`Đã gỡ / ẩn bài đăng ${p.id} khỏi danh sách công khai.`, 'info');
  renderApp();
}

// F-A04 — Quản lý giao dịch (Lọc theo đúng 10 trạng thái F-S08)
function renderAdminTransactionsTab() {
  const kw = state.adminTxSearch.trim().toLowerCase();
  let list = state.orders.filter(o => {
    if (state.adminTxFilter !== 'all' && o.status !== state.adminTxFilter) return false;
    if (kw && !o.id.toLowerCase().includes(kw) && !o.productTitle.toLowerCase().includes(kw) && !o.renterName.toLowerCase().includes(kw)) return false;
    return true;
  });

  return `
    <div class="sr-card p-5 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-extrabold text-slate-900">📦 F-A04 — Giám Sát Giao Dịch Toàn Hệ Thống (${list.length})</h2>
          <p class="text-xs text-slate-500">Tra cứu theo mã đơn, lọc theo đúng 10 trạng thái vòng đời F-S08, xem hợp đồng, giá trị & tiền cọc</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value="${state.adminTxSearch}"
            oninput="state.adminTxSearch=this.value;renderApp()"
            placeholder="Tìm mã đơn ORD-01, tên đồ..."
            class="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
          />
          <select onchange="state.adminTxFilter=this.value;renderApp()" class="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold">
            <option value="all" ${state.adminTxFilter === 'all' ? 'selected' : ''}>Tất cả 10 trạng thái F-S08</option>
            ${ORDER_STATUSES.map(st => `<option value="${st}" ${state.adminTxFilter === st ? 'selected' : ''}>${st}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-slate-200 text-slate-500 uppercase">
              <th class="py-2.5 px-2">Mã đơn</th>
              <th class="py-2.5 px-2">Sản phẩm & Thời gian</th>
              <th class="py-2.5 px-2">Người thuê / Chủ đồ</th>
              <th class="py-2.5 px-2">Giá trị & Tiền cọc</th>
              <th class="py-2.5 px-2">Trạng thái</th>
              <th class="py-2.5 px-2 text-right">Hợp đồng</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${list.map(o => `
              <tr class="hover:bg-slate-50">
                <td class="py-3 px-2 font-extrabold font-mono text-slate-900">${o.id}</td>
                <td class="py-3 px-2">
                  <div class="font-bold text-slate-900 max-w-[210px] truncate">${o.productTitle}</div>
                  <div class="text-[11px] text-slate-500">${formatDateVN(o.startDate)} → ${formatDateVN(o.endDate)} (${o.days} ngày)</div>
                </td>
                <td class="py-3 px-2">
                  <div>Thuê: <strong>${o.renterName}</strong></div>
                  <div class="text-[11px] text-slate-500">Chủ: ${o.ownerName}</div>
                </td>
                <td class="py-3 px-2">
                  <div>Thuê: <strong>${formatVND(o.baseRental)}</strong> (+Phí ${formatVND(o.serviceFee)})</div>
                  <div class="text-emerald-700 font-bold">Cọc: ${formatVND(o.deposit)}</div>
                </td>
                <td class="py-3 px-2">${renderOrderStatusBadge(o.status)}</td>
                <td class="py-3 px-2 text-right">
                  <button onclick="state.contractModalOrderId='${o.id}';renderApp()" class="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white font-bold cursor-pointer">
                    📄 Xem HĐ
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ${renderTablePagination(list.length)}
    </div>
  `;
}

// F-A05 — Escrow Pool (Cọc đang giữ, Cọc đã hoàn, Cọc đang phong tỏa, Cọc chờ xử lý + Lịch sử đối soát tự động)
function renderAdminEscrowTab() {
  const holding = state.orders.filter(o => ['Đã đặt cọc', 'Sắp nhận đồ', 'Đang thuê', 'Sắp đến hạn', 'Quá hạn'].includes(o.status)).reduce((s, o) => s + o.deposit, 0);
  const refunded = state.orders.filter(o => o.status === 'Hoàn tất').reduce((s, o) => s + o.deposit, 0) + 2400000;
  const frozen = state.orders.filter(o => o.status === 'Tranh chấp').reduce((s, o) => s + o.deposit, 0);
  const pendingRelease = state.orders.filter(o => o.status === 'Đã trả đồ').reduce((s, o) => s + o.deposit, 0);

  return `
    <div class="space-y-5">
      <div class="sr-card p-5">
        <h2 class="text-lg font-extrabold text-slate-900">🛡️ F-A05 — Quản Lý Quỹ Ký Quỹ An Toàn (Escrow Pool)</h2>
        <p class="text-xs text-slate-500">Giám sát dòng tiền cọc realtime và lịch sử đối soát tự động 24/7</p>

        <!-- 4 Fund Status Cards required by F-A05 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div class="p-4 rounded-2xl bg-blue-50 border border-blue-200">
            <div class="text-xs font-bold text-blue-800">1. Cọc đang giữ</div>
            <div class="text-xl font-extrabold text-blue-600 mt-1">${formatVND(holding)}</div>
            <div class="text-[11px] text-blue-700 mt-0.5">Đơn đã đặt cọc / đang thuê</div>
          </div>
          <div class="p-4 rounded-2xl bg-green-50 border border-green-200">
            <div class="text-xs font-bold text-green-800">2. Cọc đã hoàn</div>
            <div class="text-xl font-extrabold text-green-600 mt-1">${formatVND(refunded)}</div>
            <div class="text-[11px] text-green-700 mt-0.5">Hoàn tự động 100% cho SV</div>
          </div>
          <div class="p-4 rounded-2xl bg-orange-50 border border-orange-200">
            <div class="text-xs font-bold text-orange-800">3. Cọc đang phong tỏa</div>
            <div class="text-xl font-extrabold text-orange-600 mt-1">${formatVND(frozen)}</div>
            <div class="text-[11px] text-orange-700 mt-0.5">Đóng băng chờ Admin phân xử</div>
          </div>
          <div class="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
            <div class="text-xs font-bold text-indigo-800">4. Cọc chờ xử lý</div>
            <div class="text-xl font-extrabold text-indigo-600 mt-1">${formatVND(pendingRelease)}</div>
            <div class="text-[11px] text-indigo-700 mt-0.5">Trong 4h sau Check-out</div>
          </div>
        </div>
      </div>

      <!-- Lịch sử đối soát tự động -->
      <div class="sr-card p-5 space-y-3">
        <h3 class="font-extrabold text-slate-900 text-sm">📑 Lịch sử đối soát tự động (Automated Escrow Reconciliation Log)</h3>
        <div class="divide-y divide-slate-100 text-xs">
          ${state.escrowLogs.map(log => `
            <div class="py-3 flex flex-wrap items-center justify-between gap-2">
              <div class="space-y-0.5">
                <div class="flex items-center gap-2">
                  <span class="font-mono font-bold text-slate-500">${log.id}</span>
                  <span class="px-2 py-0.5 rounded bg-slate-900 text-white font-bold">${log.orderId}</span>
                  <span class="font-bold text-slate-900">${log.action}</span>
                </div>
                <div class="text-slate-500">${log.note}</div>
              </div>
              <div class="text-right">
                <div class="font-extrabold text-sm ${log.type === 'refunded' ? 'text-green-600' : log.type === 'frozen' ? 'text-orange-600' : 'text-blue-600'}">${formatVND(log.amount)}</div>
                <div class="text-[11px] text-slate-400">${log.time}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// F-A06 — Xử lý tranh chấp (Split-screen: Bên trái Ảnh Check-in | Bên phải Ảnh Check-out | Khung giải trình 2 bên | 3 hướng phán quyết)
function renderAdminDisputesTab() {
  const disputeOrders = state.orders.filter(o => o.status === 'Tranh chấp' || o.dispute);
  const activeOrder = getOrderById(state.adminActiveDisputeOrderId) || disputeOrders[0] || getOrderById('ORD-06');

  return `
    <div class="space-y-5">
      <div class="sr-card p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-extrabold text-slate-900">⚖️ F-A06 — Trung Tâm Phân Xử Tranh Chấp (Split-Screen Evidence)</h2>
          <p class="text-xs text-slate-500">Đối chiếu trực quan ảnh Check-in (trước thuê) & Check-out (sau thuê), giải trình hai bên và ra phán quyết giải ngân cọc</p>
        </div>
        <div class="flex gap-1.5">
          ${disputeOrders.map(o => `
            <button
              onclick="state.adminActiveDisputeOrderId='${o.id}';renderApp()"
              class="px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${activeOrder && activeOrder.id === o.id ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700'}"
            >
              ${o.id} (${o.status})
            </button>
          `).join('')}
        </div>
      </div>

      ${activeOrder ? `
        <div class="sr-card p-5 sm:p-6 space-y-6">
          <!-- Dispute Header Info -->
          <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-1 rounded bg-slate-900 text-white text-xs font-extrabold font-mono">${activeOrder.id}</span>
                ${renderOrderStatusBadge(activeOrder.status)}
                <span class="px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">Sự cố: ${activeOrder.dispute?.issueType || 'Hỏng nhẹ'}</span>
              </div>
              <h3 class="text-base sm:text-lg font-extrabold text-slate-900 mt-1">${activeOrder.productTitle}</h3>
              <p class="text-xs text-slate-500">Người thuê: <strong>${activeOrder.renterName}</strong> • Chủ đồ: <strong>${activeOrder.ownerName}</strong></p>
            </div>
            <div class="p-3 rounded-xl bg-orange-50 border border-orange-200 text-right">
              <div class="text-[11px] font-bold text-orange-800">Cọc đang đóng băng trong Escrow</div>
              <div class="text-lg font-extrabold text-orange-600">${formatVND(activeOrder.deposit)}</div>
              <div class="text-[11px] text-orange-900 font-semibold">Chủ đồ đề nghị khấu trừ: <strong>${formatVND(activeOrder.dispute?.proposedDeduction || 200000)}</strong></div>
            </div>
          </div>

          <!-- SPLIT-SCREEN: Bên trái Ảnh Check-in | Bên phải Ảnh Check-out (Section 25 & 41) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Left: Check-in Photos -->
            <div class="p-4 rounded-2xl bg-emerald-50/50 border-2 border-emerald-200 space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-extrabold">◀ BÊN TRÁI: ẢNH CHECK-IN (TRƯỚC KHI THUÊ)</span>
                <span class="text-[11px] text-emerald-800 font-semibold">Đã xác nhận 2 bên</span>
              </div>
              <div class="grid grid-cols-2 gap-2.5">
                ${(activeOrder.checkinPhotos || []).map(img => `
                  <img src="${img}" onerror="this.src=createFallbackImage('Check-in')" class="aspect-4-3 rounded-xl border border-emerald-300 shadow-xs" />
                `).join('')}
              </div>
              <p class="text-xs text-emerald-900 font-medium">Hiện trạng khi bàn giao: Nguyên vẹn, không có vết nứt vỏ.</p>
            </div>

            <!-- Right: Check-out Photos -->
            <div class="p-4 rounded-2xl bg-orange-50/60 border-2 border-orange-300 space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-1 rounded-lg bg-orange-600 text-white text-xs font-extrabold">BÊN PHẢI: ẢNH CHECK-OUT (SAU KHI TRẢ) ▶</span>
                <span class="text-[11px] text-orange-800 font-semibold">Bằng chứng báo cáo sự cố</span>
              </div>
              <div class="grid grid-cols-2 gap-2.5">
                ${(activeOrder.checkoutPhotos || []).map(img => `
                  <img src="${img}" onerror="this.src=createFallbackImage('Check-out')" class="aspect-4-3 rounded-xl border border-orange-300 shadow-xs" />
                `).join('')}
              </div>
              <p class="text-xs text-orange-900 font-medium">Hiện trạng khi nhận lại: Phát hiện vết nứt nhẹ góc dưới bên phải vỏ loa (~4cm).</p>
            </div>
          </div>

          <!-- Khung giải trình hai bên (Section 25) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div class="text-xs font-extrabold text-slate-900">🏠 Giải trình của Chủ đồ (${activeOrder.ownerName}):</div>
              <p class="text-xs text-slate-700 leading-relaxed">"${activeOrder.dispute?.ownerStatement || ''}"</p>
              <div class="text-xs font-bold text-orange-700 pt-1">Số tiền đề nghị khấu trừ: ${formatVND(activeOrder.dispute?.proposedDeduction || 200000)}</div>
            </div>
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div class="text-xs font-extrabold text-slate-900">🎒 Giải trình của Người thuê (${activeOrder.renterName}):</div>
              <p class="text-xs text-slate-700 leading-relaxed">"${activeOrder.dispute?.renterStatement || ''}"</p>
            </div>
          </div>

          <!-- Khung phán quyết của Admin: Đúng 3 hướng phán quyết trong đặc tả (Section 25) -->
          <div class="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span class="text-[11px] font-bold uppercase text-emerald-400">PHÁN QUYẾT CỦA ADMIN (F-A06)</span>
                <h4 class="font-extrabold text-base">Chọn 1 trong 3 hướng phán quyết để giải ngân tự động từ Escrow & đóng đơn:</h4>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <span>Số tiền khấu trừ (nếu chọn hướng 2):</span>
                <input
                  type="number"
                  id="admin-deduct-input"
                  value="${activeOrder.dispute?.proposedDeduction || 200000}"
                  step="50000"
                  max="${activeOrder.deposit}"
                  class="w-32 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-emerald-400 font-extrabold text-xs"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onclick="adminResolveDispute('${activeOrder.id}', 'refund_100')"
                class="p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-left transition cursor-pointer"
              >
                <div class="font-extrabold text-xs sm:text-sm">1. Hoàn 100% cho người thuê</div>
                <div class="text-[11px] text-emerald-100 mt-1">Hoàn trả toàn bộ ${formatVND(activeOrder.deposit)} cọc cho ${activeOrder.renterName}</div>
              </button>

              <button
                onclick="adminResolveDispute('${activeOrder.id}', 'partial_deduct')"
                class="p-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-left transition cursor-pointer"
              >
                <div class="font-extrabold text-xs sm:text-sm">2. Khấu trừ một phần bồi thường</div>
                <div class="text-[11px] text-slate-900 mt-1">Trích tiền bồi thường cho chủ đồ, hoàn phần cọc dư cho người thuê</div>
              </button>

              <button
                onclick="adminResolveDispute('${activeOrder.id}', 'forfeit_100')"
                class="p-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-left transition cursor-pointer"
              >
                <div class="font-extrabold text-xs sm:text-sm">3. Tịch thu toàn bộ cọc cho chủ đồ</div>
                <div class="text-[11px] text-rose-100 mt-1">Chuyển 100% cọc (${formatVND(activeOrder.deposit)}) bồi thường cho chủ đồ</div>
              </button>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function adminResolveDispute(orderId, decisionType) {
  const order = getOrderById(orderId);
  if (!order) return;
  const deductInput = Number(document.getElementById('admin-deduct-input')?.value || (order.dispute?.proposedDeduction || 200000));

  let note = '';
  if (decisionType === 'refund_100') {
    note = `Hoàn 100% tiền cọc (${formatVND(order.deposit)}) cho người thuê ${order.renterName}; Giải ngân tiền thuê gốc (${formatVND(order.baseRental)}) cho chủ đồ.`;
  } else if (decisionType === 'partial_deduct') {
    const comp = Math.min(deductInput, order.deposit);
    const refund = order.deposit - comp;
    note = `Khấu trừ ${formatVND(comp)} bồi thường cho chủ đồ ${order.ownerName}; Hoàn trả ${formatVND(refund)} cọc còn lại cho người thuê ${order.renterName}.`;
  } else if (decisionType === 'forfeit_100') {
    note = `Tịch thu toàn bộ cọc (${formatVND(order.deposit)}) bồi thường cho chủ đồ ${order.ownerName}.`;
  }

  order.status = 'Hoàn tất';
  order.escrowStatus = 'Cọc đã hoàn';
  if (order.dispute) {
    order.dispute.resolved = true;
    order.dispute.resolutionType = decisionType;
    order.dispute.resolutionNote = note;
  }

  state.escrowLogs.unshift({
    id: 'ESC-' + Math.floor(200 + Math.random() * 800),
    orderId: order.id,
    action: 'Giải ngân theo phán quyết Tranh chấp của Admin',
    amount: order.deposit,
    type: 'refunded',
    note,
    time: 'Vừa xong'
  });

  pushNotification('Cọc đã hoàn', `Admin đã phân xử đơn ${order.id}: ${note}`, order.id);
  showToast(`Đã phán quyết & giải ngân tự động đơn ${order.id}! Đơn đã đóng (Hoàn tất) và thông báo hai bên.`, 'success');
  renderApp();
}

// F-A07 — Quản lý danh mục (Thêm, Sửa, Ẩn, Xóa)
function renderAdminCategoriesTab() {
  return `
    <div class="sr-card p-5 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-extrabold text-slate-900">🗂️ F-A07 — Quản Lý Danh Mục Sản Phẩm (${state.categories.length})</h2>
          <p class="text-xs text-slate-500">Thêm, Sửa, Ẩn/Hiện hoặc Xóa danh mục cùng khung giá & tiền cọc tham khảo</p>
        </div>
        <button onclick="openCategoryModal()" class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold cursor-pointer">
          ＋ Thêm danh mục
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        ${state.categories.map(c => `
          <div class="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-3 ${!c.active ? 'opacity-60 bg-slate-50' : ''}">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-11 h-11 rounded-xl bg-emerald-50 text-2xl flex items-center justify-center shrink-0">${c.icon}</div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-extrabold text-slate-900 text-sm">${c.name}</span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${c.active ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'}">${c.active ? 'Đang hiển thị' : 'Đang ẩn'}</span>
                </div>
                <div class="text-xs text-emerald-700 font-semibold">Giá: ${formatVND(c.minPrice)}–${formatVND(c.maxPrice)}/ngày • Cọc: ${formatVND(c.minDeposit)}–${formatVND(c.maxDeposit)}</div>
                <div class="text-[11px] text-slate-500 truncate">VD: ${c.examples}</div>
              </div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button onclick="openCategoryModal('${c.id}')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer">Sửa</button>
              <button onclick="toggleCategoryActive('${c.id}')" class="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold cursor-pointer">${c.active ? 'Ẩn' : 'Hiện'}</button>
              <button onclick="deleteCategory('${c.id}')" class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold cursor-pointer">Xóa</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function openCategoryModal(catId = null) {
  if (catId) {
    const c = getCategoryById(catId);
    state.adminCategoryModal = { ...c, isEdit: true };
  } else {
    state.adminCategoryModal = {
      id: 'cat-' + (state.categories.length + 1),
      name: 'Nhạc cụ sinh viên',
      icon: '🎸',
      minPrice: 30000,
      maxPrice: 80000,
      minDeposit: 200000,
      maxDeposit: 500000,
      examples: 'Guitar Acoustic, Ukulele, Cajon',
      active: true,
      isEdit: false
    };
  }
  renderApp();
}

function saveCategoryModal() {
  const m = state.adminCategoryModal;
  if (!m) return;
  const name = document.getElementById('cat-modal-name')?.value || m.name;
  const icon = document.getElementById('cat-modal-icon')?.value || m.icon;
  const minPrice = Number(document.getElementById('cat-modal-minp')?.value || m.minPrice);
  const maxPrice = Number(document.getElementById('cat-modal-maxp')?.value || m.maxPrice);

  if (m.isEdit) {
    const c = getCategoryById(m.id);
    if (c) Object.assign(c, { name, icon, minPrice, maxPrice });
    showToast(`Đã cập nhật danh mục "${name}"`, 'success');
  } else {
    state.categories.push({ ...m, name, icon, minPrice, maxPrice });
    showToast(`Đã thêm danh mục "${name}"`, 'success');
  }
  state.adminCategoryModal = null;
  renderApp();
}

function toggleCategoryActive(catId) {
  const c = getCategoryById(catId);
  if (!c) return;
  c.active = !c.active;
  showToast(c.active ? `Đã hiển thị danh mục ${c.name}` : `Đã ẩn danh mục ${c.name}`, 'info');
  renderApp();
}

function deleteCategory(catId) {
  if (state.categories.length <= 1) return;
  const idx = state.categories.findIndex(c => c.id === catId);
  if (idx >= 0) {
    const removed = state.categories.splice(idx, 1)[0];
    showToast(`Đã xóa danh mục "${removed.name}"`, 'info');
    renderApp();
  }
}

// F-A08 — Báo cáo & Thống kê
function renderAdminReportsTab() {
  const completedCount = state.orders.filter(o => o.status === 'Hoàn tất').length;
  const disputeCount = state.orders.filter(o => o.status === 'Tranh chấp').length;
  const successRate = Math.round(((state.orders.length - 1) / state.orders.length) * 100);
  const disputeRate = Math.round((disputeCount / state.orders.length) * 100);

  return `
    <div class="space-y-5">
      <div class="sr-card p-5">
        <h2 class="text-lg font-extrabold text-slate-900">📈 F-A08 — Báo Cáo & Thống Kê Chuyên Sâu</h2>
        <p class="text-xs text-slate-500">Doanh thu theo ngày/tuần/tháng, tỷ lệ giao dịch thành công, tỷ lệ tranh chấp, danh mục & khu vực sôi động</p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div class="text-xs font-bold text-emerald-800">Doanh thu theo Ngày (Hôm nay)</div>
            <div class="text-2xl font-extrabold text-emerald-600 mt-1">285.000đ</div>
            <div class="text-[11px] text-emerald-700 mt-0.5">Từ 12 giao dịch Instant Booking</div>
          </div>
          <div class="p-4 rounded-2xl bg-blue-50 border border-blue-200">
            <div class="text-xs font-bold text-blue-800">Doanh thu theo Tuần</div>
            <div class="text-2xl font-extrabold text-blue-600 mt-1">1.940.000đ</div>
            <div class="text-[11px] text-blue-700 mt-0.5">Tăng trưởng +19% tuần này</div>
          </div>
          <div class="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
            <div class="text-xs font-bold text-indigo-800">Doanh thu theo Tháng</div>
            <div class="text-2xl font-extrabold text-indigo-600 mt-1">7.680.000đ</div>
            <div class="text-[11px] text-indigo-700 mt-0.5">Tổng GMV: 76.800.000đ</div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div class="text-xs font-bold text-slate-600">Tỷ lệ giao dịch thành công</div>
              <div class="text-2xl font-extrabold text-green-600 mt-0.5">${successRate}%</div>
              <div class="text-[11px] text-slate-500">Hoàn cọc tự động đúng hạn</div>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-green-100 text-green-700 font-extrabold flex items-center justify-center text-lg">✓</div>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div class="text-xs font-bold text-slate-600">Tỷ lệ tranh chấp</div>
              <div class="text-2xl font-extrabold text-orange-600 mt-0.5">${disputeRate}%</div>
              <div class="text-[11px] text-slate-500">100% có ảnh Check-in/Check-out đối chiếu</div>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-orange-100 text-orange-700 font-extrabold flex items-center justify-center text-lg">⚖️</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="sr-card p-5 space-y-3">
          <h3 class="font-extrabold text-slate-900 text-sm">🔥 Top Danh mục sôi động nhất</h3>
          <div class="space-y-2 text-xs">
            <div class="p-3 rounded-xl bg-slate-50 flex justify-between font-semibold"><span>1. 📷 Máy ảnh/Camera (Sony A6400, Canon R50)</span><span class="text-emerald-600 font-bold">42 đơn/tháng</span></div>
            <div class="p-3 rounded-xl bg-slate-50 flex justify-between font-semibold"><span>2. 📽️ Đồ điện tử (Máy chiếu Wanbo, Loa JBL)</span><span class="text-emerald-600 font-bold">35 đơn/tháng</span></div>
            <div class="p-3 rounded-xl bg-slate-50 flex justify-between font-semibold"><span>3. ⛺ Dụng cụ sự kiện/Dã ngoại (Lều 4 người)</span><span class="text-emerald-600 font-bold">28 đơn/tháng</span></div>
            <div class="p-3 rounded-xl bg-slate-50 flex justify-between font-semibold"><span>4. 👔 Trang phục (Vest kỷ yếu, Áo dài ngũ thân)</span><span class="text-emerald-600 font-bold">24 đơn/tháng</span></div>
          </div>
        </div>

        <div class="sr-card p-5 space-y-3">
          <h3 class="font-extrabold text-slate-900 text-sm">📍 Top Khu vực / Cụm trường sôi động nhất</h3>
          <div class="space-y-2 text-xs">
            <div class="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex justify-between font-semibold">
              <span>1. 📍 Cụm Bách Kinh Xây (Bách Khoa - KTQD - Xây Dựng)</span>
              <span class="text-emerald-700 font-extrabold">44% tổng GD</span>
            </div>
            <div class="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex justify-between font-semibold">
              <span>2. 📍 Cụm ĐHQG (Xuân Thủy - Ngoại Ngữ - Công Nghệ)</span>
              <span class="text-blue-700 font-extrabold">33% tổng GD</span>
            </div>
            <div class="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex justify-between font-semibold">
              <span>3. 📍 Cụm Cầu Giấy (Báo Chí - Sư Phạm - Thương Mại)</span>
              <span class="text-amber-800 font-extrabold">23% tổng GD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// MODALS (AUTH F-G05, PUBLIC PROFILE F-S01, CHECK-IN/OUT F-S09, DISPUTE F-S11, RATING F-S12, REPORT F-S16, CONTRACT F-A04)
// ============================================================================
function openAuthModal(mode = 'login') {
  state.authModal = mode;
  renderApp();
}

function handleLoginSubmit() {
  const email = (document.getElementById('login-email')?.value || '').trim();
  const pw = (document.getElementById('login-pw')?.value || '').trim();

  if (email === 'admin@demo.com' && pw === '123456') {
    state.currentUser = ADMIN_ACCOUNT;
    state.authModal = null;
    state.currentPage = 'admin';
    showToast('Đăng nhập thành công tài khoản Admin Demo!', 'success');
    renderApp();
    return;
  }

  const found = state.users.find(u => u.email === email || u.eduEmail === email || u.phone === email);
  if (found && found.status === 'locked') {
    showToast('Tài khoản này đã bị Admin khóa do vi phạm chính sách!', 'error');
    return;
  }

  state.currentUser = found || state.users[0];
  state.authModal = null;
  showToast(`Chào mừng ${state.currentUser.name} quay trở lại StudentRent!`, 'success');
  renderApp();
}

function handleRegisterStep1() {
  const email = (document.getElementById('reg-email')?.value || 'sinhvien.moi@student.edu.vn').trim();
  const phone = (document.getElementById('reg-phone')?.value || '0911223344').trim();
  state.pendingRegData = { email, phone };
  state.authModal = 'otp';
  showToast('Đã gửi mã OTP mô phỏng (123456) tới email/SĐT của bạn!', 'info');
  renderApp();
}

function handleVerifyOTP() {
  state.authModal = 'complete_profile';
  showToast('Xác thực OTP thành công! Vui lòng bổ sung hồ sơ sinh viên.', 'success');
  renderApp();
}

function handleCompleteProfileSubmit() {
  const name = document.getElementById('cp-name')?.value || 'Nguyễn Hải Đăng';
  const school = document.getElementById('cp-school')?.value || 'ĐH Quốc Gia Hà Nội';
  const mssv = document.getElementById('cp-mssv')?.value || '23019283';
  const phone = document.getElementById('cp-phone')?.value || (state.pendingRegData?.phone || '0911223344');
  const bank = document.getElementById('cp-bank')?.value || 'MB Bank - 0911223344 - NGUYEN HAI DANG';
  const email = state.pendingRegData?.email || 'dang.nh@student.edu.vn';
  const isEdu = email.endsWith('@student.edu.vn') || email.includes('.edu.vn');

  const newUser = {
    id: 'u-' + (state.users.length + 1),
    name,
    email,
    eduEmail: isEdu ? email : '',
    password: '123456',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    school,
    studentId: mssv,
    phone,
    area: 'ĐHQG',
    bankAccount: bank,
    trustScore: 85,
    rating: 0,
    rentedOutCount: 0,
    rentedInCount: 0,
    completedTx: 0,
    verifiedStudent: isEdu,
    isNewUser: true,
    status: 'active',
    warnings: 0,
    complaints: 0
  };
  state.users.push(newUser);
  state.currentUser = newUser;
  state.authModal = null;
  showToast(`Đăng ký hoàn tất! ${isEdu ? 'Bạn đã nhận Huy hiệu Sinh viên xác thực ✔ và ' : ''}Huy hiệu Người mới 🌱`, 'success');
  renderApp();
}

function openReportModal(type, targetId, targetName) {
  state.reportModal = { type, targetId, targetName };
  renderApp();
}

function submitReportModal() {
  const r = state.reportModal;
  if (!r) return;
  const reason = document.getElementById('report-reason-input')?.value || 'Thông tin mô tả chưa chính xác với thực tế.';
  if (r.type === 'product') {
    const p = getProductById(r.targetId);
    if (p) {
      p.approvalStatus = 'Bị báo cáo';
      p.reportReason = reason;
    }
    showToast(`Đã gửi báo cáo bài đăng #${r.targetId} tới Admin kiểm duyệt!`, 'warning');
  } else {
    const u = getUserById(r.targetId);
    if (u) u.complaints = (u.complaints || 0) + 1;
    showToast(`Đã gửi báo cáo người dùng "${r.targetName}" tới Admin!`, 'warning');
  }
  state.reportModal = null;
  renderApp();
}

function renderAllModals() {
  let html = '';

  // 1. Auth Modal (F-G05: Đăng nhập / Đăng ký / Google login mô phỏng / Quên mật khẩu / OTP / Bổ sung hồ sơ)
  if (state.authModal) {
    html += `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 mobile-drawer-backdrop">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 page-enter">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-extrabold text-slate-900 text-lg">
              ${state.authModal === 'login' ? '🔐 Đăng nhập StudentRent' :
                state.authModal === 'register' ? '🎓 Đăng ký Tài khoản Sinh viên' :
                state.authModal === 'otp' ? '📲 Xác thực mã OTP' :
                state.authModal === 'complete_profile' ? '📝 Bổ sung Hồ sơ Sinh viên' : '🔑 Khôi phục mật khẩu'}
            </h3>
            <button onclick="state.authModal=null;renderApp()" class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold cursor-pointer">✕</button>
          </div>

          ${state.authModal === 'login' ? `
            <div class="space-y-3 text-xs sm:text-sm">
              <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div class="font-bold">Tài khoản Demo chuẩn đặc tả (Mật khẩu: 123456):</div>
                <div class="flex gap-2 pt-1">
                  <button onclick="document.getElementById('login-email').value='student@demo.com';document.getElementById('login-pw').value='123456'" class="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold cursor-pointer">Điền Student Demo</button>
                  <button onclick="document.getElementById('login-email').value='admin@demo.com';document.getElementById('login-pw').value='123456'" class="px-2.5 py-1 rounded bg-slate-900 text-white font-bold cursor-pointer">Điền Admin Demo</button>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Email (@student.edu.vn) hoặc Số điện thoại</label>
                <input type="text" id="login-email" value="student@demo.com" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Mật khẩu</label>
                <input type="password" id="login-pw" value="123456" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold" />
              </div>
              <div class="flex justify-between text-xs">
                <button onclick="state.authModal='forgot_pw';renderApp()" class="text-emerald-600 font-semibold hover:underline cursor-pointer">Quên mật khẩu?</button>
                <button onclick="state.authModal='register';renderApp()" class="text-slate-700 font-bold hover:underline cursor-pointer">Chưa có tài khoản? Đăng ký</button>
              </div>
              <button onclick="handleLoginSubmit()" class="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm cursor-pointer">
                Đăng nhập ngay
              </button>
              <button onclick="quickSwitchRole('student');state.authModal=null;renderApp()" class="w-full py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer">
                <span>🌐</span><span>Đăng nhập nhanh với Google (@student.edu.vn)</span>
              </button>
            </div>
          ` : ''}

          ${state.authModal === 'register' ? `
            <div class="space-y-3 text-xs sm:text-sm">
              <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                💡 <strong>Ưu tiên email @student.edu.vn</strong> để nhận ngay tích xanh <strong>“Sinh viên xác thực”</strong> tự động!
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Email sinh viên *</label>
                <input type="email" id="reg-email" value="sv.moi@student.edu.vn" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Số điện thoại *</label>
                <input type="text" id="reg-phone" value="0911223344" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Mật khẩu *</label>
                <input type="password" value="123456" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <button onclick="handleRegisterStep1()" class="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm cursor-pointer">
                Nhận mã xác thực OTP →
              </button>
            </div>
          ` : ''}

          ${state.authModal === 'otp' ? `
            <div class="space-y-3 text-xs sm:text-sm text-center">
              <p class="text-slate-600">Mã OTP 6 số đã được gửi tới <strong>${state.pendingRegData?.email || 'email của bạn'}</strong></p>
              <input type="text" value="123456" class="w-48 mx-auto text-center tracking-widest text-xl font-extrabold px-4 py-2.5 bg-slate-50 border-2 border-emerald-500 rounded-xl block" />
              <button onclick="handleVerifyOTP()" class="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm cursor-pointer">
                Xác nhận OTP & Tiếp tục
              </button>
            </div>
          ` : ''}

          ${state.authModal === 'complete_profile' ? `
            <div class="space-y-3 text-xs">
              <p class="text-slate-500">Hoàn tất 5 thông tin bắt buộc sau đăng ký (F-G05) để nhận tiền hoàn cọc Escrow:</p>
              <div>
                <label class="font-bold text-slate-700">1. Họ và tên *</label>
                <input type="text" id="cp-name" value="Nguyễn Hải Đăng" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl mt-0.5" />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="font-bold text-slate-700">2. Trường đại học *</label>
                  <input type="text" id="cp-school" value="ĐH Quốc Gia Hà Nội" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl mt-0.5" />
                </div>
                <div>
                  <label class="font-bold text-slate-700">3. Mã số SV (MSSV) *</label>
                  <input type="text" id="cp-mssv" value="23019283" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl mt-0.5" />
                </div>
              </div>
              <div>
                <label class="font-bold text-slate-700">4. Số điện thoại *</label>
                <input type="text" id="cp-phone" value="${state.pendingRegData?.phone || '0911223344'}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl mt-0.5" />
              </div>
              <div>
                <label class="font-bold text-slate-700">5. Số tài khoản ngân hàng nhận tiền *</label>
                <input type="text" id="cp-bank" value="MB Bank - 0911223344 - NGUYEN HAI DANG" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl mt-0.5" />
              </div>
              <button onclick="handleCompleteProfileSubmit()" class="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm cursor-pointer">
                Hoàn tất đăng ký
              </button>
            </div>
          ` : ''}

          ${state.authModal === 'forgot_pw' ? `
            <div class="space-y-3 text-xs sm:text-sm">
              <p class="text-slate-600">Nhập email sinh viên để nhận mã OTP đặt lại mật khẩu:</p>
              <input type="email" value="student@demo.com" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
              <button onclick="showToast('Đã gửi link & OTP đặt lại mật khẩu thành công!', 'success');state.authModal='login';renderApp()" class="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold cursor-pointer">
                Gửi OTP khôi phục mật khẩu
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // 2. Public Profile Modal (F-S01: Xem hồ sơ công khai của người khác)
  if (state.publicProfileUserId) {
    const u = getUserById(state.publicProfileUserId);
    const userItems = state.products.filter(p => p.ownerId === u.id && p.approvalStatus === 'Đã duyệt');
    html += `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 mobile-drawer-backdrop">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 page-enter">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-extrabold text-slate-900 text-base">👤 Hồ sơ công khai thành viên</h3>
            <button onclick="state.publicProfileUserId=null;renderApp()" class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold cursor-pointer">✕</button>
          </div>
          <div class="flex items-center gap-4">
            <img src="${u.avatar}" onerror="this.src=createFallbackImage('U')" class="w-16 h-16 rounded-2xl object-cover border border-slate-200" />
            <div>
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="font-extrabold text-slate-900 text-lg">${u.name}</span>
                ${u.verifiedStudent ? `<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">✔ Sinh viên xác thực</span>` : ''}
                ${u.isNewUser || u.completedTx === 0 ? `<span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">🌱 Người mới</span>` : ''}
              </div>
              <div class="text-xs text-slate-600 mt-0.5">${u.school} • Khu vực ${u.area}</div>
            </div>
          </div>
          <div class="grid grid-cols-4 gap-2 text-center text-xs">
            <div class="p-2.5 rounded-xl bg-emerald-50"><div class="font-extrabold text-emerald-700 text-base">${u.trustScore}/100</div><div class="text-[10px] text-slate-500">Trust Score</div></div>
            <div class="p-2.5 rounded-xl bg-amber-50"><div class="font-extrabold text-amber-600 text-base">★ ${u.rating || 'Mới'}</div><div class="text-[10px] text-slate-500">Sao TB</div></div>
            <div class="p-2.5 rounded-xl bg-blue-50"><div class="font-extrabold text-blue-600 text-base">${u.rentedOutCount}</div><div class="text-[10px] text-slate-500">Cho thuê</div></div>
            <div class="p-2.5 rounded-xl bg-indigo-50"><div class="font-extrabold text-indigo-600 text-base">${u.rentedInCount}</div><div class="text-[10px] text-slate-500">Đã thuê</div></div>
          </div>
          <div class="space-y-2">
            <div class="text-xs font-bold text-slate-700">Đồ đang cho thuê (${userItems.length}):</div>
            <div class="max-h-44 overflow-y-auto space-y-2">
              ${userItems.map(p => `
                <div onclick="state.publicProfileUserId=null;navigateTo('detail',{productId:'${p.id}'})" class="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 flex items-center justify-between cursor-pointer text-xs">
                  <span class="font-bold text-slate-800 truncate">${p.title}</span>
                  <span class="font-extrabold text-emerald-600 shrink-0 ml-2">${formatVND(p.pricePerDay)}/ngày</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 3. Check-in Modal (F-S09: Người thuê chụp ít nhất 2 ảnh hiện trạng + Xác nhận đã nhận đồ; Chủ đồ Xác nhận đã giao đồ -> Đang thuê)
  if (state.checkinModalOrderId) {
    const order = getOrderById(state.checkinModalOrderId);
    html += `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 mobile-drawer-backdrop">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 page-enter">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-extrabold text-slate-900 text-base">📸 F-S09 — Check-in Bàn Giao Đồ (#${order.id})</h3>
            <button onclick="state.checkinModalOrderId=null;renderApp()" class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold cursor-pointer">✕</button>
          </div>
          <p class="text-xs text-slate-600">Người thuê bắt buộc chụp ít nhất <strong>2 ảnh hiện trạng</strong> khi nhận đồ làm bằng chứng bảo vệ cọc Escrow.</p>
          <div class="grid grid-cols-2 gap-3">
            ${(order.checkinPhotos || []).map((img, i) => `
              <div class="relative">
                <img src="${img}" onerror="this.src=createFallbackImage('Check-in')" class="aspect-4-3 rounded-xl border border-slate-200" />
                <span class="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-bold">Ảnh Check-in #${i + 1}</span>
              </div>
            `).join('')}
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <button
              onclick="confirmCheckinStep('${order.id}', 'renter')"
              class="py-2.5 px-3 rounded-xl font-bold text-xs border transition cursor-pointer ${order.renterCheckedIn ? 'bg-green-100 text-green-800 border-green-300' : 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500'}"
            >
              ${order.renterCheckedIn ? '✓ Người thuê đã xác nhận nhận đồ' : '1. Người thuê: “Xác nhận đã nhận đồ”'}
            </button>
            <button
              onclick="confirmCheckinStep('${order.id}', 'owner')"
              class="py-2.5 px-3 rounded-xl font-bold text-xs border transition cursor-pointer ${order.ownerCheckedIn ? 'bg-green-100 text-green-800 border-green-300' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'}"
            >
              ${order.ownerCheckedIn ? '✓ Chủ đồ đã xác nhận giao đồ' : '2. Chủ đồ: “Xác nhận đã giao đồ”'}
            </button>
          </div>
          <button
            onclick="confirmCheckinStep('${order.id}', 'both')"
            class="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm cursor-pointer"
          >
            ⚡ [DEMO] Xác nhận đồng thời cả 2 bên → Chuyển sang "Đang thuê"
          </button>
        </div>
      </div>
    `;
  }

  // 4. Check-out Modal (F-S09: Chủ đồ kiểm tra đồ + chụp 2 ảnh hiện trạng sau thuê + bấm "Xác nhận đã nhận lại đồ" -> Đã trả đồ)
  if (state.checkoutModalOrderId) {
    const order = getOrderById(state.checkoutModalOrderId);
    html += `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 mobile-drawer-backdrop">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 page-enter">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-extrabold text-slate-900 text-base">📸 F-S09 — Check-out Trả Đồ (#${order.id})</h3>
            <button onclick="state.checkoutModalOrderId=null;renderApp()" class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold cursor-pointer">✕</button>
          </div>
          <p class="text-xs text-slate-600">Chủ đồ kiểm tra đồ, chụp <strong>2 ảnh hiện trạng sau thuê</strong> và bấm xác nhận nhận lại đồ.</p>
          <div class="grid grid-cols-2 gap-3">
            ${(order.checkoutPhotos || []).map((img, i) => `
              <div class="relative">
                <img src="${img}" onerror="this.src=createFallbackImage('Check-out')" class="aspect-4-3 rounded-xl border border-slate-200" />
                <span class="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-bold">Ảnh Check-out #${i + 1}</span>
              </div>
            `).join('')}
          </div>
          <button
            onclick="confirmCheckoutStep('${order.id}')"
            class="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm cursor-pointer"
          >
            ✅ Xác nhận đã nhận lại đồ (Chuyển sang "Đã trả đồ")
          </button>
        </div>
      </div>
    `;
  }

  // 5. Dispute Modal (F-S11: Báo cáo sự cố / Tranh chấp: Hỏng nhẹ, Hỏng nặng, Mất đồ, Trả trễ)
  if (state.disputeModalOrderId) {
    const order = getOrderById(state.disputeModalOrderId);
    html += `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 mobile-drawer-backdrop">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 page-enter">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-extrabold text-orange-700 text-base">⚠️ F-S11 — Báo Cáo Sự Cố / Tranh Chấp (#${order.id})</h3>
            <button onclick="state.disputeModalOrderId=null;renderApp()" class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold cursor-pointer">✕</button>
          </div>
          <div class="space-y-3 text-xs sm:text-sm">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Loại sự cố (Đúng đặc tả F-S11) *</label>
              <select id="dispute-issue-type" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                <option value="Hỏng nhẹ">Hỏng nhẹ</option>
                <option value="Hỏng nặng">Hỏng nặng</option>
                <option value="Mất đồ">Mất đồ</option>
                <option value="Trả trễ">Trả trễ</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Số tiền đề nghị khấu trừ từ cọc (Tối đa ${formatVND(order.deposit)}) *</label>
              <input type="number" id="dispute-deduction" value="200000" step="50000" max="${order.deposit}" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Mô tả chi tiết tình trạng & bằng chứng *</label>
              <textarea id="dispute-statement" rows="3" class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl">Khi nhận lại đồ phát hiện vết nứt/trầy xước khác với ảnh Check-in ban đầu. Đề nghị khấu trừ chi phí khắc phục.</textarea>
            </div>
            <div class="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-800">
              📸 Đã đính kèm 2 ảnh bằng chứng Check-out. Sau khi gửi, đơn sẽ chuyển thành <strong>Tranh chấp</strong>, khóa hoàn cọc tự động và chuyển sang Admin phân xử.
            </div>
            <button onclick="submitDisputeReport('${order.id}')" class="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm cursor-pointer">
              Gửi báo cáo sự cố & Phong tỏa cọc
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // 6. Two-Way Rating Modal (F-S12: 1-5 sao, Nhận xét, Tag: Đúng hẹn, Thân thiện, Giữ gìn đồ, Đúng mô tả)
  if (state.ratingModalOrderId) {
    const order = getOrderById(state.ratingModalOrderId);
    html += `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 mobile-drawer-backdrop">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 page-enter">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-extrabold text-slate-900 text-base">⭐ F-S12 — Đánh Giá 2 Chiều (#${order.id})</h3>
            <button onclick="state.ratingModalOrderId=null;renderApp()" class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold cursor-pointer">✕</button>
          </div>
          <div class="space-y-3 text-xs sm:text-sm">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Số sao đánh giá (1–5 sao)</label>
              <select id="rating-stars" class="w-full px-3.5 py-2.5 bg-amber-50 border border-amber-200 text-amber-800 font-extrabold rounded-xl">
                <option value="5">★★★★★ — 5 Sao (Tuyệt vời)</option>
                <option value="4">★★★★☆ — 4 Sao (Tốt)</option>
                <option value="3">★★★☆☆ — 3 Sao (Bình thường)</option>
                <option value="2">★★☆☆☆ — 2 Sao (Kém)</option>
                <option value="1">★☆☆☆☆ — 1 Sao (Rất tệ)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">Chọn Tag đánh giá nhanh (Đúng đặc tả F-S12):</label>
              <div class="grid grid-cols-2 gap-2">
                ${['Đúng hẹn', 'Thân thiện', 'Giữ gìn đồ', 'Đúng mô tả'].map(tag => `
                  <label class="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer font-semibold text-xs">
                    <input type="checkbox" value="${tag}" checked class="rating-tag-cb accent-emerald-500" />
                    <span>${tag}</span>
                  </label>
                `).join('')}
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Nhận xét chi tiết</label>
              <textarea id="rating-comment" rows="3" class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl">${order.ratingComment || 'Đúng hẹn, đồ dùng sạch đẹp đúng mô tả, hoàn cọc tự động siêu nhanh!'}</textarea>
            </div>
            <button onclick="submitTwoWayRating('${order.id}')" class="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm cursor-pointer">
              Gửi đánh giá & Cập nhật Trust Score
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // 7. Report Listing / User Modal (F-S16)
  if (state.reportModal) {
    html += `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 mobile-drawer-backdrop">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 page-enter">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-extrabold text-rose-600 text-base">🚩 Báo cáo ${state.reportModal.type === 'product' ? 'vi phạm bài đăng' : 'người dùng'}</h3>
            <button onclick="state.reportModal=null;renderApp()" class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold cursor-pointer">✕</button>
          </div>
          <p class="text-xs text-slate-600">Đối tượng: <strong>${state.reportModal.targetName}</strong></p>
          <textarea id="report-reason-input" rows="3" class="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl" placeholder="Nhập lý do báo cáo vi phạm...">Hình ảnh/thông tin có dấu hiệu chưa khớp thực tế, đề nghị Admin kiểm tra.</textarea>
          <button onclick="submitReportModal()" class="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm cursor-pointer">
            Gửi báo cáo lên Admin
          </button>
        </div>
      </div>
    `;
  }

  // 8. Admin Reject Listing Reason Modal (F-A03)
  if (state.adminRejectModalProductId) {
    html += `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 mobile-drawer-backdrop">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 page-enter">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-extrabold text-slate-900 text-base">✕ Từ chối duyệt bài đăng #${state.adminRejectModalProductId}</h3>
            <button onclick="state.adminRejectModalProductId=null;renderApp()" class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold cursor-pointer">✕</button>
          </div>
          <label class="block text-xs font-bold text-slate-700">Nhập lý do từ chối gửi cho chủ đồ *</label>
          <textarea id="admin-reject-reason" rows="3" class="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl">Ảnh chụp chưa đủ 3 góc thực tế hoặc giá cọc vượt khung tham khảo của danh mục.</textarea>
          <button onclick="adminConfirmRejectListing('${state.adminRejectModalProductId}')" class="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm cursor-pointer">
            Xác nhận từ chối bài đăng
          </button>
        </div>
      </div>
    `;
  }

  // 9. Admin Category Add/Edit Modal (F-A07)
  if (state.adminCategoryModal) {
    const m = state.adminCategoryModal;
    html += `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 mobile-drawer-backdrop">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 page-enter">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-extrabold text-slate-900 text-base">${m.isEdit ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h3>
            <button onclick="state.adminCategoryModal=null;renderApp()" class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold cursor-pointer">✕</button>
          </div>
          <div class="space-y-3 text-xs">
            <div class="grid grid-cols-4 gap-2">
              <div>
                <label class="font-bold text-slate-700">Icon</label>
                <input type="text" id="cat-modal-icon" value="${m.icon}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl mt-0.5 text-center text-lg" />
              </div>
              <div class="col-span-3">
                <label class="font-bold text-slate-700">Tên danh mục</label>
                <input type="text" id="cat-modal-name" value="${m.name}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl mt-0.5 font-bold" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="font-bold text-slate-700">Giá tối thiểu/ngày</label>
                <input type="number" id="cat-modal-minp" value="${m.minPrice}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl mt-0.5" />
              </div>
              <div>
                <label class="font-bold text-slate-700">Giá tối đa/ngày</label>
                <input type="number" id="cat-modal-maxp" value="${m.maxPrice}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl mt-0.5" />
              </div>
            </div>
            <button onclick="saveCategoryModal()" class="w-full py-3 rounded-xl bg-emerald-500 text-white font-extrabold text-sm cursor-pointer">
              Lưu danh mục
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // 10. Electronic Rental Contract Modal (F-A04)
  if (state.contractModalOrderId) {
    const o = getOrderById(state.contractModalOrderId);
    if (o) {
      html += `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 mobile-drawer-backdrop">
          <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 page-enter text-xs">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 class="font-extrabold text-slate-900 text-base">📄 Hợp Đồng Thuê Đồ Tự Động #${o.id}</h3>
              <button onclick="state.contractModalOrderId=null;renderApp()" class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold cursor-pointer">✕</button>
            </div>
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 leading-relaxed">
              <div class="font-extrabold text-slate-900 text-center text-sm">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div class="text-center text-slate-500 pb-2 border-b border-slate-200">Hợp đồng điện tử tự động qua nền tảng StudentRent Escrow</div>
              <div>• <strong>Mã giao dịch:</strong> ${o.id} (${o.status})</div>
              <div>• <strong>Bên cho thuê (Owner):</strong> ${o.ownerName}</div>
              <div>• <strong>Bên thuê (Renter):</strong> ${o.renterName}</div>
              <div>• <strong>Tài sản thuê:</strong> ${o.productTitle} (Mã: ${o.productId})</div>
              <div>• <strong>Thời hạn thuê:</strong> ${formatDateVN(o.startDate)} đến ${formatDateVN(o.endDate)} (${o.days} ngày)</div>
              <div>• <strong>Tiền thuê gốc:</strong> ${formatVND(o.baseRental)} | <strong>Phí dịch vụ sàn (10%):</strong> ${formatVND(o.serviceFee)}</div>
              <div>• <strong>Tiền cọc ký quỹ Escrow:</strong> <span class="text-emerald-700 font-bold">${formatVND(o.deposit)}</span> (${o.escrowStatus})</div>
              <div>• <strong>Cam kết:</strong> Hoàn tự động 100% tiền cọc sau khi Check-out nguyên vẹn hoặc sau 4 giờ không phát sinh khiếu nại.</div>
            </div>
            <button onclick="state.contractModalOrderId=null;renderApp()" class="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold cursor-pointer">Đóng hợp đồng</button>
          </div>
        </div>
      `;
    }
  }

  return html;
}

// Footer (F-G01 & Section 34)
function renderFooter() {
  return `
    <footer class="bg-slate-900 text-slate-400 text-xs mt-16 border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="space-y-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-emerald-500 text-white font-extrabold flex items-center justify-center text-sm">SR</div>
            <span class="font-extrabold text-base text-white">Student<span class="text-emerald-400">Rent</span></span>
          </div>
          <p class="leading-relaxed">Nền tảng Cho thuê Đồ dùng Sinh viên Tự động hóa. Đặt chỗ tức thì trong 60s, không cần chờ chủ đồ duyệt, bảo vệ 100% tiền cọc qua Escrow.</p>
          <div class="text-emerald-400 font-bold">FAST • AUTOMATED • SAFE</div>
        </div>
        <div class="space-y-2">
          <div class="font-bold text-white uppercase tracking-wider">Cụm trường hỗ trợ</div>
          <div>📍 Khu vực ĐHQG (Cầu Giấy - Xuân Thủy)</div>
          <div>📍 Khu vực Bách Kinh Xây (Giải Phóng - Tạ Quang Bửu)</div>
          <div>📍 Khu vực Cầu Giấy (Báo Chí - Sư Phạm - Thương Mại)</div>
        </div>
        <div class="space-y-2">
          <div class="font-bold text-white uppercase tracking-wider">9 Danh mục chuẩn</div>
          <div class="grid grid-cols-2 gap-1">
            ${state.categories.slice(0, 8).map(c => `<button onclick="state.filters.categoryId='${c.id}';navigateTo('catalog')" class="text-left hover:text-emerald-400 truncate cursor-pointer">${c.name}</button>`).join('')}
          </div>
        </div>
        <div class="space-y-2">
          <div class="font-bold text-white uppercase tracking-wider">Tài khoản Demo Đặc tả</div>
          <div>🎓 Student: <code class="text-emerald-300">student@demo.com</code> / <code class="text-slate-300">123456</code></div>
          <div>⚡ Admin: <code class="text-emerald-300">admin@demo.com</code> / <code class="text-slate-300">123456</code></div>
          <div class="pt-2 flex gap-2">
            <button onclick="quickSwitchRole('student')" class="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold cursor-pointer">Vào Student</button>
            <button onclick="quickSwitchRole('admin')" class="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold cursor-pointer">Vào Admin</button>
          </div>
        </div>
      </div>
      <div class="border-t border-slate-800 py-4 text-center text-[11px] text-slate-500">
        © 2026 StudentRent – Nền tảng Cho thuê Đồ dùng Sinh viên Tự động hóa. Prototype chuẩn Bản Mô Tả Chức Năng Web.
      </div>
    </footer>
  `;
}

// Persist & Restore Demo State in localStorage (Section 18)
function saveDemoState() {
  try {
    const snapshot = {
      currentUser: state.currentUser,
      categories: state.categories,
      users: state.users,
      products: state.products,
      orders: state.orders,
      notifications: state.notifications,
      chats: state.chats,
      escrowLogs: state.escrowLogs,
      wishlist: state.wishlist
    };
    localStorage.setItem('studentrent_demo_state_v1', JSON.stringify(snapshot));
  } catch (e) {}
}

function loadDemoState() {
  try {
    const raw = localStorage.getItem('studentrent_demo_state_v1');
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved && Array.isArray(saved.products) && Array.isArray(saved.orders)) {
      state.currentUser = saved.currentUser !== undefined ? saved.currentUser : state.users[0];
      state.categories = saved.categories || state.categories;
      state.users = saved.users || state.users;
      state.products = saved.products;
      state.orders = saved.orders;
      state.notifications = saved.notifications || state.notifications;
      state.chats = saved.chats || state.chats;
      state.escrowLogs = saved.escrowLogs || state.escrowLogs;
      state.wishlist = saved.wishlist || state.wishlist;
    }
  } catch (e) {}
}

// Main Render Function
function renderApp() {
  const root = document.getElementById('app-root');
  if (!root) return;

  saveDemoState();

  let pageContent = '';
  switch (state.currentPage) {
    case 'home':
      pageContent = renderHomePage();
      break;
    case 'catalog':
      pageContent = renderCatalogPage();
      break;
    case 'detail':
      pageContent = renderProductDetailPage();
      break;
    case 'payment':
      pageContent = renderPaymentPage();
      break;
    case 'post-item':
      pageContent = renderPostItemWizardPage();
      break;
    case 'dashboard':
      pageContent = renderStudentDashboardPage();
      break;
    case 'profile':
      pageContent = renderProfilePage();
      break;
    case 'chat':
      pageContent = renderChatPage();
      break;
    case 'wishlist':
      pageContent = renderWishlistPage();
      break;
    case 'admin':
      pageContent = renderAdminPortalPage();
      break;
    default:
      pageContent = renderHomePage();
  }

  root.innerHTML = `
    ${renderHeader()}
    <main class="min-h-[75vh]">
      ${pageContent}
    </main>
    ${renderFooter()}
    ${renderAllModals()}
  `;
}

const VALID_PAGES = ['home', 'catalog', 'detail', 'payment', 'post-item', 'dashboard', 'profile', 'chat', 'wishlist', 'admin'];

window.addEventListener('hashchange', () => {
  const hashPage = (window.location.hash || '').replace('#', '').trim();
  if (VALID_PAGES.includes(hashPage) && hashPage !== state.currentPage) {
    navigateTo(hashPage, { fromHash: true });
  }
});

// Initialize application on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  state.currentUser = state.users[0]; // student@demo.com default if no saved state
  loadDemoState();
  const initialHash = (window.location.hash || '').replace('#', '').trim();
  if (VALID_PAGES.includes(initialHash)) {
    navigateTo(initialHash, { fromHash: true });
  } else {
    renderApp();
  }
});
