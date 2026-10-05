// StudentRent - Student Flows (F-S01 -> F-S16, F-G05, Step Wizard, Dashboard, Check-in/out, Escrow, Dispute, Rating, Chat)

// ============================================================================
// F-S02 & SECTION 38 — ĐĂNG ĐỒ CHO THUÊ (STEP WIZARD 4 BƯỚC)
// ============================================================================
function openPostWizard(editProductId = null) {
  if (!state.currentUser) {
    state.authModal = 'login';
    showToast('Vui lòng đăng nhập để đăng đồ cho thuê!', 'info');
    renderApp();
    return;
  }
  state.wizardStep = 1;
  if (editProductId) {
    const p = getProductById(editProductId);
    state.editingProductId = p.id;
    state.wizardData = {
      title: p.title,
      categoryId: p.categoryId,
      brand: p.brand || '',
      condition: p.condition || 'Mới 99%',
      description: p.description,
      accessories: p.accessories || '',
      images: [...p.images],
      pricePerDay: p.pricePerDay,
      weeklyPrice: p.weeklyPrice || p.pricePerDay * 6,
      deposit: p.deposit,
      area: p.area,
      pickupPoint: p.pickupPoint,
      customPolicy: p.customPolicy || '',
      schedule: JSON.parse(JSON.stringify(p.schedule || {}))
    };
  } else {
    state.editingProductId = null;
    state.wizardData = {
      title: 'Máy ảnh Fujifilm X-T30 II Kèm Lens XC 15-45mm',
      categoryId: 'cat-1',
      brand: 'Fujifilm',
      condition: 'Mới 99%',
      description: 'Máy ảnh Fujifilm giả lập màu phim cổ điển cực đẹp, đầy đủ phụ kiện thẻ nhớ 64GB và 2 pin phục vụ chụp kỷ yếu, ngoại cảnh.',
      accessories: '2 pin zin, sạc đôi, thẻ nhớ SD 64GB, dây đeo da, túi chống sốc.',
      images: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'
      ],
      pricePerDay: 200000,
      weeklyPrice: 1200000,
      deposit: 1600000,
      area: state.currentUser.area || 'Bách Kinh Xây',
      pickupPoint: 'Sảnh KTX Bách Khoa / Cổng Trần Đại Nghĩa',
      customPolicy: 'Vui lòng giữ gìn ống kính, không tự tháo ngàm lens ngoài trời bụi.',
      schedule: {}
    };
  }
  state.currentPage = 'post-item';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderApp();
}

function renderPostItemWizardPage() {
  const w = state.wizardData;
  const cat = getCategoryById(w.categoryId);
  const steps = [
    { num: 1, label: 'Bước 1: Thông tin & Ảnh (3–5 ảnh)' },
    { num: 2, label: 'Bước 2: Giá thuê & Tiền cọc' },
    { num: 3, label: 'Bước 3: Khu vực & Lịch ban đầu' },
    { num: 4, label: 'Bước 4: Preview & Đăng tin' }
  ];

  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 page-enter">
      <div class="sr-card p-6 sm:p-8 space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span class="text-xs font-extrabold uppercase text-emerald-600">F-S02 • STEP WIZARD 4 BƯỚC</span>
            <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900">${state.editingProductId ? `Chỉnh sửa bài đăng #${state.editingProductId}` : 'Đăng đồ nhàn rỗi cho thuê'}</h1>
          </div>
          <button onclick="navigateTo('dashboard', { dashboardTab: 'rented_out' })" class="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer">
            ← Quản lý bài đăng
          </button>
        </div>

        <!-- Stepper Progress Bar -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          ${steps.map(s => `
            <button
              onclick="state.wizardStep=${s.num};renderApp()"
              class="p-3 rounded-xl border text-left transition cursor-pointer ${state.wizardStep === s.num ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs' : state.wizardStep > s.num ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}"
            >
              <div class="text-xs font-extrabold">${s.label}</div>
            </button>
          `).join('')}
        </div>

        <!-- STEP 1: Tên, Danh mục, Ảnh 3-5 ảnh + Preview, Mô tả, Tình trạng (Mới 99%, Tốt, Trầy xước nhẹ) -->
        ${state.wizardStep === 1 ? `
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div class="sm:col-span-8">
                <label class="block text-xs font-bold text-slate-700 mb-1">Tên món đồ cho thuê *</label>
                <input type="text" value="${w.title}" oninput="state.wizardData.title=this.value" class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl" placeholder="VD: Máy ảnh Sony A6400 + Lens 16-50mm" />
              </div>
              <div class="sm:col-span-4">
                <label class="block text-xs font-bold text-slate-700 mb-1">Nhãn hiệu</label>
                <input type="text" value="${w.brand}" oninput="state.wizardData.brand=this.value" class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl" placeholder="VD: Sony, Canon, DJI..." />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Danh mục (9 danh mục chuẩn) *</label>
                <select onchange="handleWizardCategoryChange(this.value)" class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl">
                  ${state.categories.map(c => `<option value="${c.id}" ${w.categoryId === c.id ? 'selected' : ''}>${c.icon} ${c.name}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Tình trạng món đồ (Theo đặc tả) *</label>
                <select onchange="state.wizardData.condition=this.value;renderApp()" class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl">
                  ${['Mới 99%', 'Tốt', 'Trầy xước nhẹ'].map(cond => `<option value="${cond}" ${w.condition === cond ? 'selected' : ''}>${cond}</option>`).join('')}
                </select>
              </div>
            </div>

            <!-- Ảnh thực tế 3-5 ảnh + Preview -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-slate-800">📸 Ảnh thực tế sản phẩm (3–5 ảnh) + Preview trực tiếp</label>
                <span class="text-xs font-bold ${w.images.length >= 3 && w.images.length <= 5 ? 'text-emerald-600' : 'text-amber-600'}">Đang có ${w.images.length}/5 ảnh</span>
              </div>
              <div class="grid grid-cols-3 sm:grid-cols-5 gap-3">
                ${w.images.map((img, i) => `
                  <div class="relative rounded-xl overflow-hidden border border-slate-300 bg-white group">
                    <img src="${img}" onerror="this.src=createFallbackImage('Preview')" class="h-24 w-full object-cover" />
                    ${w.images.length > 3 ? `
                      <button onclick="state.wizardData.images.splice(${i},1);renderApp()" class="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold">✕</button>
                    ` : ''}
                  </div>
                `).join('')}
                ${w.images.length < 5 ? `
                  <button onclick="addSampleWizardPhoto()" class="h-24 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/40 hover:bg-emerald-50 text-emerald-700 text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer">
                    <span class="text-lg">＋</span>
                    <span>Thêm ảnh mẫu</span>
                  </button>
                ` : ''}
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Mô tả chi tiết *</label>
              <textarea rows="3" oninput="state.wizardData.description=this.value" class="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl">${w.description}</textarea>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Chính sách phụ kiện đi kèm</label>
              <input type="text" value="${w.accessories}" oninput="state.wizardData.accessories=this.value" class="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl" />
            </div>

            <div class="flex justify-end pt-2">
              <button onclick="state.wizardStep=2;renderApp()" class="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm cursor-pointer">
                Tiếp theo: Bước 2 (Giá & Tiền cọc) →
              </button>
            </div>
          </div>
        ` : ''}

        <!-- STEP 2: Giá/ngày, Giá ưu đãi theo tuần, Tiền cọc yêu cầu -->
        ${state.wizardStep === 2 ? `
          <div class="space-y-5">
            <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div class="font-extrabold">💡 Khoảng giá & cọc tham khảo chuẩn đặc tả cho danh mục "${cat.name}":</div>
              <div>• Giá thuê khuyến nghị: <strong>${formatVND(cat.minPrice)} – ${formatVND(cat.maxPrice)}/ngày</strong></div>
              <div>• Tiền cọc khuyến nghị: <strong>${formatVND(cat.minDeposit)} – ${formatVND(cat.maxDeposit)}</strong> (Được giữ an toàn trong Escrow)</div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Giá cho thuê / ngày (VNĐ) *</label>
                <input type="number" step="5000" value="${w.pricePerDay}" oninput="state.wizardData.pricePerDay=Number(this.value)" class="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Giá ưu đãi theo tuần (VNĐ)</label>
                <input type="number" step="10000" value="${w.weeklyPrice}" oninput="state.wizardData.weeklyPrice=Number(this.value)" class="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Tiền cọc yêu cầu (VNĐ) *</label>
                <input type="number" step="50000" value="${w.deposit}" oninput="state.wizardData.deposit=Number(this.value)" class="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
            </div>

            <div class="flex justify-between pt-4">
              <button onclick="state.wizardStep=1;renderApp()" class="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm cursor-pointer">← Quay lại Bước 1</button>
              <button onclick="state.wizardStep=3;renderApp()" class="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm cursor-pointer">Tiếp theo: Bước 3 (Lịch & Giao nhận) →</button>
            </div>
          </div>
        ` : ''}

        <!-- STEP 3: Khu vực, Điểm giao nhận, Chính sách riêng, Thiết lập lịch trống/bận ban đầu -->
        ${state.wizardStep === 3 ? `
          <div class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Khu vực / Cụm trường *</label>
                <select onchange="state.wizardData.area=this.value" class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl">
                  ${AREAS.map(a => `<option value="${a}" ${w.area === a ? 'selected' : ''}>📍 ${a}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Điểm giao nhận cụ thể *</label>
                <input type="text" value="${w.pickupPoint}" oninput="state.wizardData.pickupPoint=this.value" class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Chính sách riêng của chủ đồ</label>
              <input type="text" value="${w.customPolicy}" oninput="state.wizardData.customPolicy=this.value" class="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl" />
            </div>

            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div class="text-xs font-bold text-slate-800">📅 Thiết lập lịch trống/bận ban đầu (Click vào ngày để Khóa cá nhân màu Xám hoặc Mở trống màu Xanh lá):</div>
              ${renderInteractiveCalendar(w, 'wizard')}
            </div>

            <div class="flex justify-between pt-4">
              <button onclick="state.wizardStep=2;renderApp()" class="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm cursor-pointer">← Quay lại Bước 2</button>
              <button onclick="state.wizardStep=4;renderApp()" class="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm cursor-pointer">Tiếp theo: Bước 4 (Preview) →</button>
            </div>
          </div>
        ` : ''}

        <!-- STEP 4: Preview toàn bộ thông tin trước khi đăng + Button "Đăng tin" (vào hàng đợi duyệt Admin) + Button "Lưu nháp" -->
        ${state.wizardStep === 4 ? `
          <div class="space-y-5">
            <div class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div class="text-xs sm:text-sm font-bold text-emerald-900">
                👁️ Xem trước (Preview) toàn bộ thông tin tin đăng trước khi gửi Admin kiểm duyệt
              </div>
              <span class="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">Sẽ vào hàng đợi Chờ duyệt</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-5 p-4 rounded-2xl border border-slate-200 bg-white">
              <div class="md:col-span-5 space-y-2">
                <img src="${w.images[0]}" onerror="this.src=createFallbackImage('Preview')" class="aspect-4-3 rounded-xl border border-slate-200" />
                <div class="grid grid-cols-4 gap-2">
                  ${w.images.slice(1).map(img => `<img src="${img}" onerror="this.src=createFallbackImage('Preview')" class="h-14 w-full object-cover rounded-lg border border-slate-200" />`).join('')}
                </div>
              </div>
              <div class="md:col-span-7 space-y-2.5 text-xs sm:text-sm">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">${cat.icon} ${cat.name}</span>
                  <span class="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-xs">Tình trạng: ${w.condition}</span>
                  <span class="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-xs">📍 ${w.area}</span>
                </div>
                <h3 class="text-lg font-extrabold text-slate-900">${w.title}</h3>
                <p class="text-slate-600 text-xs leading-relaxed">${w.description}</p>
                <div class="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span class="text-[11px] text-slate-500 block">Giá/ngày</span>
                    <span class="font-extrabold text-emerald-600">${formatVND(w.pricePerDay)}</span>
                  </div>
                  <div>
                    <span class="text-[11px] text-slate-500 block">Giá/tuần</span>
                    <span class="font-bold text-slate-800">${formatVND(w.weeklyPrice)}</span>
                  </div>
                  <div>
                    <span class="text-[11px] text-slate-500 block">Tiền cọc Escrow</span>
                    <span class="font-bold text-slate-900">${formatVND(w.deposit)}</span>
                  </div>
                </div>
                <div class="text-xs text-slate-600"><strong>Phụ kiện:</strong> ${w.accessories}</div>
                <div class="text-xs text-slate-600"><strong>Điểm giao nhận:</strong> ${w.pickupPoint}</div>
                <div class="text-xs text-slate-600"><strong>Chính sách riêng:</strong> ${w.customPolicy}</div>
              </div>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button onclick="state.wizardStep=3;renderApp()" class="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm cursor-pointer">
                ← Quay lại Bước 3
              </button>
              <div class="flex items-center gap-3">
                <button onclick="submitWizardListing(true)" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm cursor-pointer">
                  💾 Lưu nháp
                </button>
                <button onclick="submitWizardListing(false)" class="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-md cursor-pointer">
                  🚀 Đăng tin (Gửi Admin duyệt)
                </button>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function handleWizardCategoryChange(catId) {
  state.wizardData.categoryId = catId;
  const cat = getCategoryById(catId);
  state.wizardData.pricePerDay = cat.minPrice;
  state.wizardData.weeklyPrice = cat.minPrice * 5;
  state.wizardData.deposit = cat.minDeposit;
  renderApp();
}

function addSampleWizardPhoto() {
  const samples = [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=800&q=80'
  ];
  if (state.wizardData.images.length < 5) {
    state.wizardData.images.push(samples[state.wizardData.images.length % samples.length]);
    renderApp();
  }
}

function submitWizardListing(isDraft = false) {
  const w = state.wizardData;
  if (!w.title.trim()) {
    showToast('Vui lòng nhập tên sản phẩm!', 'warning');
    return;
  }

  if (state.editingProductId) {
    const prod = getProductById(state.editingProductId);
    Object.assign(prod, {
      title: w.title,
      categoryId: w.categoryId,
      brand: w.brand,
      condition: w.condition,
      description: w.description,
      accessories: w.accessories,
      images: [...w.images],
      pricePerDay: Number(w.pricePerDay),
      weeklyPrice: Number(w.weeklyPrice),
      deposit: Number(w.deposit),
      area: w.area,
      pickupPoint: w.pickupPoint,
      customPolicy: w.customPolicy,
      schedule: w.schedule,
      approvalStatus: isDraft ? 'Nháp' : 'Chờ duyệt'
    });
    showToast(isDraft ? `Đã lưu nháp bài đăng #${prod.id}` : `Đã cập nhật và gửi bài #${prod.id} vào hàng đợi Admin duyệt!`, 'success');
  } else {
    const newId = `SP-${state.products.length + 1}`;
    state.products.unshift({
      id: newId,
      title: w.title,
      categoryId: w.categoryId,
      brand: w.brand || 'Chính hãng',
      ownerId: state.currentUser.id,
      pricePerDay: Number(w.pricePerDay),
      weeklyPrice: Number(w.weeklyPrice),
      deposit: Number(w.deposit),
      area: w.area,
      pickupPoint: w.pickupPoint,
      condition: w.condition,
      accessories: w.accessories,
      customPolicy: w.customPolicy,
      description: w.description,
      images: [...w.images],
      approvalStatus: isDraft ? 'Nháp' : 'Chờ duyệt',
      visible: true,
      schedule: JSON.parse(JSON.stringify(w.schedule || {})),
      reviews: []
    });
    showToast(isDraft ? `Đã lưu nháp bài đăng ${newId}!` : `Đã đăng tin ${newId}! Tin đã đi vào hàng đợi Chờ Admin duyệt.`, 'success');
  }

  navigateTo('dashboard', { dashboardTab: 'rented_out' });
}

// Manage Owner Listing Actions (Sửa, Ẩn/hiện, Xóa - F-S02)
function toggleListingVisibility(productId) {
  const prod = getProductById(productId);
  if (!prod) return;
  prod.visible = !prod.visible;
  prod.approvalStatus = prod.visible ? 'Đã duyệt' : 'Bị ẩn';
  showToast(prod.visible ? `Đã hiển thị công khai bài đăng ${prod.id}` : `Đã tạm ẩn bài đăng ${prod.id}`, 'info');
  renderApp();
}

function deleteListing(productId) {
  const idx = state.products.findIndex(p => p.id === productId);
  if (idx >= 0) {
    const id = state.products[idx].id;
    state.products.splice(idx, 1);
    showToast(`Đã xóa bài đăng ${id}`, 'info');
    renderApp();
  }
}

// ============================================================================
// F-S08 -> F-S13 & SECTION 39 — DASHBOARD CÁ NHÂN & LỊCH SỬ GIAO DỊCH
// ============================================================================
function renderStudentDashboardPage() {
  const user = state.currentUser || state.users[0];
  const myRentedInOrders = state.orders.filter(o => o.renterId === user.id || user.id === 'u-1');
  const myRentedOutOrders = state.orders.filter(o => o.ownerId === user.id || o.id === 'ORD-06' || o.id === 'ORD-04');
  const myListings = state.products.filter(p => p.ownerId === user.id);

  // Financial Summary Cards (Section 39: Doanh thu, Cọc đang ký quỹ, Đơn đang hoạt động)
  const totalRevenue = state.orders
    .filter(o => o.status === 'Hoàn tất')
    .reduce((sum, o) => sum + o.baseRental, 0) + 1450000;
  const activeEscrowDeposit = state.orders
    .filter(o => ['Đã đặt cọc', 'Sắp nhận đồ', 'Đang thuê', 'Sắp đến hạn', 'Quá hạn', 'Đã trả đồ', 'Tranh chấp'].includes(o.status))
    .reduce((sum, o) => sum + o.deposit, 0);
  const activeOrdersCount = state.orders
    .filter(o => !['Hoàn tất', 'Đã hủy'].includes(o.status)).length;

  let activeList = state.dashboardTab === 'rented_in' ? myRentedInOrders : myRentedOutOrders;
  if (state.txStatusFilter !== 'all') {
    activeList = activeList.filter(o => o.status === state.txStatusFilter);
  }
  if (state.txTimeFilter === 'today') {
    activeList = activeList.filter(o => o.createdAt.includes('Hôm nay') || o.createdAt.includes('Vừa xong'));
  } else if (state.txTimeFilter === 'week') {
    activeList = activeList.filter(o => !o.createdAt.includes('tháng'));
  }

  const managedProd = getProductById(state.ownerManageProductId) || myListings[0] || state.products[0];

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 page-enter space-y-6">
      <!-- Top Title & Quick Actions -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900">Dashboard Cá Nhân & Lịch Sử Giao Dịch</h1>
          <p class="text-xs sm:text-sm text-slate-500">Quản lý vòng đời 10 trạng thái đơn thuê, Check-in/Check-out, Hoàn cọc tự động & Khóa lịch nhanh</p>
        </div>
        <button onclick="openPostWizard()" class="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-xs cursor-pointer">
          ＋ Đăng đồ cho thuê mới
        </button>
      </div>

      <!-- 3 Thẻ tài chính (Section 39: Doanh thu, Cọc đang ký quỹ, Đơn đang hoạt động) -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="sr-card p-5 border-l-4 border-l-emerald-500">
          <div class="text-xs font-bold text-slate-500 uppercase">💰 Doanh thu cho thuê tích lũy</div>
          <div class="text-2xl font-extrabold text-emerald-600 mt-1">${formatVND(totalRevenue)}</div>
          <div class="text-[11px] text-slate-500 mt-1">Giải ngân tự động về ${user.bankAccount || 'MB Bank'}</div>
        </div>
        <div class="sr-card p-5 border-l-4 border-l-blue-500">
          <div class="text-xs font-bold text-slate-500 uppercase">🛡️ Cọc đang ký quỹ (Escrow)</div>
          <div class="text-2xl font-extrabold text-blue-600 mt-1">${formatVND(activeEscrowDeposit)}</div>
          <div class="text-[11px] text-slate-500 mt-1">Hoàn tự động 100% sau Check-out không sự cố</div>
        </div>
        <div class="sr-card p-5 border-l-4 border-l-amber-500">
          <div class="text-xs font-bold text-slate-500 uppercase">📦 Đơn đang hoạt động</div>
          <div class="text-2xl font-extrabold text-slate-900 mt-1">${activeOrdersCount} đơn</div>
          <div class="text-[11px] text-slate-500 mt-1">Theo dõi realtime 10 trạng thái F-S08</div>
        </div>
      </div>

      <!-- 2 Tabs: "Đồ tôi đã thuê" & "Đồ tôi cho thuê" (F-S13 & Section 39) -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div class="flex items-center gap-2">
          <button
            onclick="state.dashboardTab='rented_in';renderApp()"
            class="px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition cursor-pointer ${state.dashboardTab === 'rented_in' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}"
          >
            🎒 Đồ tôi đã thuê / đang thuê (${myRentedInOrders.length})
          </button>
          <button
            onclick="state.dashboardTab='rented_out';renderApp()"
            class="px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition cursor-pointer ${state.dashboardTab === 'rented_out' ? 'bg-emerald-500 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}"
          >
            🏪 Đồ tôi cho thuê (${myListings.length} bài đăng • ${myRentedOutOrders.length} đơn)
          </button>
        </div>

        <!-- Filter by 10 Statuses & Time (F-S13) -->
        <div class="flex items-center gap-2">
          <select onchange="state.txStatusFilter=this.value;renderApp()" class="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-semibold">
            <option value="all" ${state.txStatusFilter === 'all' ? 'selected' : ''}>Tất cả 10 trạng thái</option>
            ${ORDER_STATUSES.map(st => `<option value="${st}" ${state.txStatusFilter === st ? 'selected' : ''}>${st}</option>`).join('')}
          </select>
          <select onchange="state.txTimeFilter=this.value;renderApp()" class="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-semibold">
            <option value="all" ${state.txTimeFilter === 'all' ? 'selected' : ''}>Mọi thời gian</option>
            <option value="today" ${state.txTimeFilter === 'today' ? 'selected' : ''}>Hôm nay</option>
            <option value="week" ${state.txTimeFilter === 'week' ? 'selected' : ''}>7 ngày qua</option>
          </select>
        </div>
      </div>

      <!-- If Tab = "Đồ tôi cho thuê": Show Owner Listing Management + Quick Calendar Lock FIRST (Section 39) -->
      ${state.dashboardTab === 'rented_out' ? `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left: Quản lý bài đăng (Sửa, Ẩn/hiện, Xóa) -->
          <div class="lg:col-span-7 sr-card p-5 space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="font-extrabold text-slate-900 text-base">📋 Quản lý bài đăng của tôi (${myListings.length})</h2>
              <button onclick="openPostWizard()" class="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">+ Đăng bài mới</button>
            </div>
            <div class="space-y-3">
              ${myListings.map(p => `
                <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <img src="${p.images[0]}" onerror="this.src=createFallbackImage('${p.id}')" class="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div class="min-w-0">
                      <div class="flex items-center gap-1.5">
                        <span class="text-xs font-bold text-slate-500">${p.id}</span>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${p.approvalStatus === 'Đã duyệt' ? 'bg-green-100 text-green-800' : p.approvalStatus === 'Chờ duyệt' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'}">${p.approvalStatus}</span>
                      </div>
                      <div onclick="navigateTo('detail', { productId: '${p.id}' })" class="font-bold text-slate-900 text-xs sm:text-sm truncate hover:text-emerald-600 cursor-pointer">${p.title}</div>
                      <div class="text-xs text-emerald-600 font-bold">${formatVND(p.pricePerDay)}/ngày • Cọc ${formatVND(p.deposit)}</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <button onclick="state.ownerManageProductId='${p.id}';renderApp()" class="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold cursor-pointer">📅 Khóa lịch</button>
                    <button onclick="openPostWizard('${p.id}')" class="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer">Sửa</button>
                    <button onclick="toggleListingVisibility('${p.id}')" class="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer">${p.visible ? 'Ẩn' : 'Hiện'}</button>
                    <button onclick="deleteListing('${p.id}')" class="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold cursor-pointer">Xóa</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right: Khóa lịch nhanh (F-S03 Owner Calendar Management) -->
          <div class="lg:col-span-5 sr-card p-5 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-[10px] font-bold uppercase text-emerald-600">F-S03 • QUẢN LÝ LỊCH CHỦ ĐỒ</span>
                <h3 class="font-extrabold text-slate-900 text-sm">Khóa / Mở lịch nhanh: ${managedProd.id}</h3>
              </div>
              <select onchange="state.ownerManageProductId=this.value;renderApp()" class="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold">
                ${state.products.slice(0, 8).map(p => `<option value="${p.id}" ${p.id === managedProd.id ? 'selected' : ''}>${p.id} - ${p.title.slice(0, 18)}...</option>`).join('')}
              </select>
            </div>
            <p class="text-xs text-slate-500">Click vào ngày <strong>Trống (Xanh lá)</strong> để tự khóa cá nhân (chuyển <strong>Xám</strong>), hoặc click vào ngày <strong>Xám</strong> để mở lại.</p>
            ${renderInteractiveCalendar(managedProd, 'owner')}
          </div>
        </div>
      ` : ''}

      <!-- Order List with 10-State Timeline & Context Action Buttons (F-S08 -> F-S13) -->
      <div class="space-y-4">
        <h2 class="font-extrabold text-slate-900 text-base">
          ${state.dashboardTab === 'rented_in' ? '📦 Danh sách đơn Đồ tôi đã thuê / đang thuê' : '📬 Danh sách đơn khách đặt thuê đồ của tôi'}
        </h2>

        ${activeList.length === 0 ? `
          <div class="sr-card p-10 text-center text-slate-500 text-sm">
            Không có đơn hàng nào khớp với bộ lọc hiện tại.
          </div>
        ` : activeList.map(order => renderOrderRowCard(order)).join('')}
      </div>
    </div>
  `;
}

function renderOrderLifecycleTimeline(currentStatus) {
  return `
    <div class="pt-3 border-t border-slate-100">
      <div class="text-[10px] font-bold uppercase text-slate-400 mb-1.5">Timeline vòng đời 10 trạng thái đơn thuê (F-S08):</div>
      <div class="flex items-center gap-1 overflow-x-auto pb-1">
        ${ORDER_STATUSES.map((st, idx) => {
          const isCurrent = st === currentStatus;
          const currentIdx = ORDER_STATUSES.indexOf(currentStatus);
          const isPassed = currentIdx > idx && !['Tranh chấp', 'Đã hủy'].includes(st) && currentStatus !== 'Đã hủy';
          return `
            <div class="flex items-center gap-1 shrink-0">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold transition ${
                isCurrent
                  ? 'bg-emerald-500 text-white shadow-xs ring-2 ring-emerald-500/30'
                  : isPassed
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-400'
              }">
                ${idx + 1}. ${st}
              </span>
              ${idx < ORDER_STATUSES.length - 1 ? `<span class="text-slate-300 text-[10px]">→</span>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderOrderRowCard(order) {
  return `
    <div class="sr-card p-5 space-y-4">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <!-- Product & Partner Info (F-S13: Tên đồ, Ảnh, Đối tác, Thời gian, Chi phí, Trạng thái, Đánh giá) -->
        <div class="flex items-start gap-3.5 min-w-0">
          <img
            src="${order.productImage}"
            onerror="this.src=createFallbackImage('${order.productId}')"
            onclick="navigateTo('detail', { productId: '${order.productId}' })"
            class="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0 cursor-pointer"
          />
          <div class="space-y-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-slate-900 text-white text-xs font-extrabold font-mono">${order.id}</span>
              ${renderOrderStatusBadge(order.status)}
              <span class="text-xs text-slate-400">• Tạo lúc: ${order.createdAt}</span>
            </div>
            <h3 onclick="navigateTo('detail', { productId: '${order.productId}' })" class="font-extrabold text-slate-900 text-sm sm:text-base hover:text-emerald-600 cursor-pointer">${order.productTitle}</h3>
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              <span>👤 Người thuê: <strong>${order.renterName}</strong></span>
              <span>🏠 Chủ đồ: <strong>${order.ownerName}</strong></span>
              <span>📅 Thời gian: <strong>${formatDateVN(order.startDate)} → ${formatDateVN(order.endDate)} (${order.days} ngày)</strong></span>
            </div>
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs pt-0.5">
              <span>Tiền thuê gốc: <strong>${formatVND(order.baseRental)}</strong></span>
              <span>Phí DV (10%): <strong>${formatVND(order.serviceFee)}</strong></span>
              <span class="text-emerald-700 font-bold">🛡️ Cọc Escrow: ${formatVND(order.deposit)} (${order.escrowStatus})</span>
              <span class="text-slate-900 font-extrabold">Tổng TT: ${formatVND(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <!-- Contextual Action Buttons for the 10 Lifecycle States -->
        <div class="flex flex-wrap items-center gap-2 shrink-0">
          ${order.status === 'Chờ thanh toán' ? `
            <span class="px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-extrabold font-mono">
              ⏳ Còn <span id="countdown-${order.id}">${formatCountdown(order.countdownSeconds)}</span>
            </span>
            <button onclick="navigateTo('payment', { orderId: '${order.id}' })" class="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-xs cursor-pointer">
              📲 Quét QR Thanh Toán Ngay
            </button>
          ` : ''}

          ${['Đã đặt cọc', 'Sắp nhận đồ'].includes(order.status) ? `
            <button onclick="openCheckinModal('${order.id}')" class="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-xs cursor-pointer">
              📸 Check-in Nhận / Giao Đồ (F-S09)
            </button>
            ${order.status === 'Đã đặt cọc' ? `
              <button onclick="simulateOrderReminder('${order.id}', 'Sắp nhận đồ')" class="px-2.5 py-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold cursor-pointer" title="Mô phỏng nhắc trước 24h">
                🔔 Nhắc 24h (Sắp nhận đồ)
              </button>
              <button onclick="cancelOrderAfterDeposit('${order.id}')" class="px-2.5 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold cursor-pointer">
                Hủy đơn (Hoàn cọc)
              </button>
            ` : ''}
          ` : ''}

          ${['Đang thuê', 'Sắp đến hạn', 'Quá hạn'].includes(order.status) ? `
            <button onclick="openCheckoutModal('${order.id}')" class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-xs cursor-pointer">
              📸 Check-out Trả Đồ (F-S09)
            </button>
            <button onclick="openDisputeModal('${order.id}')" class="px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold cursor-pointer">
              ⚠️ Báo cáo sự cố (F-S11)
            </button>
            ${order.status === 'Đang thuê' ? `
              <button onclick="simulateOrderReminder('${order.id}', 'Sắp đến hạn')" class="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold cursor-pointer">
                🔔 Nhắc 12h (Sắp đến hạn)
              </button>
              <button onclick="simulateOrderReminder('${order.id}', 'Quá hạn')" class="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-[11px] font-semibold cursor-pointer">
                ⏰ Giả lập Quá hạn
              </button>
            ` : ''}
          ` : ''}

          ${order.status === 'Đã trả đồ' ? `
            <div class="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-200">
              ⏱️ Chờ kiểm tra 4h (${order.inspectRemainingHours || '03h 59p'})
            </div>
            <button onclick="releaseEscrowDeposit('${order.id}', 'manual')" class="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-xs cursor-pointer">
              ✅ Đồ nguyên vẹn (Hoàn cọc 100%)
            </button>
            <button onclick="releaseEscrowDeposit('${order.id}', 'auto4h')" class="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer">
              ⚡ [DEMO] Tự hoàn sau 4h
            </button>
            <button onclick="openDisputeModal('${order.id}')" class="px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold cursor-pointer">
              ⚠️ Báo cáo sự cố
            </button>
          ` : ''}

          ${order.status === 'Hoàn tất' ? `
            <button onclick="openRatingModal('${order.id}')" class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-xs cursor-pointer">
              ⭐ ${order.renterRated ? 'Xem / Cập nhật Đánh giá 5 sao' : 'Đánh giá 2 chiều (F-S12)'}
            </button>
          ` : ''}

          ${order.status === 'Tranh chấp' ? `
            <button onclick="state.adminActiveDisputeOrderId='${order.id}';navigateTo('admin', { adminTab: 'disputes' })" class="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold shadow-xs cursor-pointer">
              ⚖️ Mở màn hình Admin Phân xử (Split-screen)
            </button>
          ` : ''}

          <button onclick="openChatForOrder('${order.id}')" class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer">
            💬 Chat
          </button>
          <button onclick="state.contractModalOrderId='${order.id}';renderApp()" class="px-2.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer">
            📄 Hợp đồng
          </button>
        </div>
      </div>

      ${renderOrderLifecycleTimeline(order.status)}

      <!-- Visual Evidence Summary (Check-in / Check-out / Dispute / Rating) -->
      ${(order.checkinPhotos && order.checkinPhotos.length > 0) || order.dispute || order.ratingComment || order.cancelReason ? `
        <div class="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          ${order.checkinPhotos && order.checkinPhotos.length > 0 ? `
            <div class="md:col-span-4 flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
              <span class="font-bold text-slate-700 shrink-0">📸 Ảnh Check-in (${order.checkinPhotos.length}):</span>
              <div class="flex gap-1.5">
                ${order.checkinPhotos.map(img => `<img src="${img}" onerror="this.src=createFallbackImage('Check-in')" class="w-9 h-9 rounded-lg object-cover border border-slate-300" />`).join('')}
              </div>
            </div>
          ` : ''}
          ${order.checkoutPhotos && order.checkoutPhotos.length > 0 ? `
            <div class="md:col-span-4 flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
              <span class="font-bold text-slate-700 shrink-0">📸 Ảnh Check-out (${order.checkoutPhotos.length}):</span>
              <div class="flex gap-1.5">
                ${order.checkoutPhotos.map(img => `<img src="${img}" onerror="this.src=createFallbackImage('Check-out')" class="w-9 h-9 rounded-lg object-cover border border-slate-300" />`).join('')}
              </div>
            </div>
          ` : ''}
          ${order.dispute ? `
            <div class="md:col-span-12 p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-900">
              <div class="font-extrabold">⚠️ Báo cáo sự cố (${order.dispute.issueType}) — Đề nghị khấu trừ: ${formatVND(order.dispute.proposedDeduction)}</div>
              <div class="mt-0.5 text-orange-800"><strong>Chủ đồ:</strong> ${order.dispute.ownerStatement}</div>
              ${order.dispute.resolutionNote ? `<div class="mt-1 font-bold text-emerald-800">⚖️ Phán quyết Admin: ${order.dispute.resolutionNote}</div>` : ''}
            </div>
          ` : ''}
          ${order.ratingComment ? `
            <div class="md:col-span-12 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 flex flex-wrap items-center justify-between gap-2">
              <div><strong>⭐ Đánh giá 2 chiều (${order.ratingScore} sao):</strong> "${order.ratingComment}"</div>
              <div class="flex gap-1">${(order.ratingTags || []).map(t => `<span class="px-2 py-0.5 rounded bg-emerald-200/70 text-emerald-900 text-[10px] font-bold">#${t}</span>`).join('')}</div>
            </div>
          ` : ''}
          ${order.cancelReason ? `
            <div class="md:col-span-12 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 font-semibold">
              ℹ️ Lý do hủy: ${order.cancelReason}
            </div>
          ` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

function simulateOrderReminder(orderId, targetStatus) {
  const order = getOrderById(orderId);
  if (!order) return;
  order.status = targetStatus;
  if (targetStatus === 'Sắp nhận đồ') {
    pushNotification('Nhắc nhận đồ trước 24h', `Đơn ${order.id} (${order.productTitle}) sắp đến giờ nhận đồ trong 24h tới.`, order.id);
  } else if (targetStatus === 'Sắp đến hạn') {
    pushNotification('Nhắc trả đồ trước 12h', `Đơn ${order.id} (${order.productTitle}) còn 12h nữa đến hạn trả đồ.`, order.id);
  } else if (targetStatus === 'Quá hạn') {
    pushNotification('Quá hạn', `Đơn ${order.id} (${order.productTitle}) đã quá hạn trả đồ! Vui lòng bàn giao ngay.`, order.id);
  }
  showToast(`Đã chuyển trạng thái đơn ${order.id} sang "${targetStatus}"`, 'info');
  renderApp();
}

// ============================================================================
// F-S09 — CHECK-IN / CHECK-OUT MODALS
// ============================================================================
function openCheckinModal(orderId) {
  const order = getOrderById(orderId);
  if (order && (!order.checkinPhotos || order.checkinPhotos.length < 2)) {
    order.checkinPhotos = [
      order.productImage,
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80'
    ];
  }
  state.checkinModalOrderId = orderId;
  renderApp();
}

function confirmCheckinStep(orderId, role) {
  const order = getOrderById(orderId);
  if (!order) return;
  if (!order.checkinPhotos || order.checkinPhotos.length < 2) {
    showToast('Người thuê phải chụp/tải lên ít nhất 2 ảnh hiện trạng trước khi xác nhận!', 'warning');
    return;
  }
  if (role === 'renter') {
    order.renterCheckedIn = true;
    showToast('Người thuê đã xác nhận nhận đồ!', 'success');
  } else if (role === 'owner') {
    order.ownerCheckedIn = true;
    showToast('Chủ đồ đã xác nhận giao đồ!', 'success');
  } else if (role === 'both') {
    order.renterCheckedIn = true;
    order.ownerCheckedIn = true;
  }

  if (order.renterCheckedIn && order.ownerCheckedIn) {
    order.status = 'Đang thuê';
    state.checkinModalOrderId = null;
    showToast(`Hoàn tất Check-in! Đơn ${order.id} đã chuyển sang trạng thái "Đang thuê".`, 'success');
  }
  renderApp();
}

function openCheckoutModal(orderId) {
  const order = getOrderById(orderId);
  if (order && (!order.checkoutPhotos || order.checkoutPhotos.length < 2)) {
    order.checkoutPhotos = [
      order.productImage,
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=600&q=80'
    ];
  }
  state.checkoutModalOrderId = orderId;
  renderApp();
}

function confirmCheckoutStep(orderId) {
  const order = getOrderById(orderId);
  if (!order) return;
  if (!order.checkoutPhotos || order.checkoutPhotos.length < 2) {
    showToast('Chủ đồ cần chụp ít nhất 2 ảnh hiện trạng sau thuê!', 'warning');
    return;
  }
  order.ownerCheckedOut = true;
  order.status = 'Đã trả đồ';
  order.escrowStatus = 'Cọc chờ xử lý';
  order.inspectRemainingHours = '04h 00p';
  state.checkoutModalOrderId = null;

  state.escrowLogs.unshift({
    id: 'ESC-' + Math.floor(200 + Math.random() * 800),
    orderId: order.id,
    action: 'Đã trả đồ (Chờ kiểm tra 4h)',
    amount: order.deposit,
    type: 'pending_release',
    note: 'Đã cập nhật 2 ảnh Check-out. Tự động hoàn cọc 100% sau 4h nếu không khiếu nại.',
    time: 'Vừa xong'
  });

  showToast(`Đã xác nhận nhận lại đồ! Đơn ${order.id} chuyển sang "Đã trả đồ" (chờ kiểm tra 4h).`, 'success');
  renderApp();
}

// ============================================================================
// F-S10 — HOÀN CỌC TỰ ĐỘNG / ESCROW RELEASE
// ============================================================================
function releaseEscrowDeposit(orderId, mode = 'manual') {
  const order = getOrderById(orderId);
  if (!order) return;

  order.status = 'Hoàn tất';
  order.escrowStatus = 'Cọc đã hoàn';

  // Release calendar dates
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
    action: mode === 'auto4h' ? 'Hoàn cọc tự động sau 4h không khiếu nại' : 'Chủ đồ xác nhận Đồ nguyên vẹn — Hoàn cọc 100%',
    amount: order.deposit,
    type: 'refunded',
    note: `Hoàn 100% cọc (${formatVND(order.deposit)}) cho ${order.renterName}; Giải ngân tiền thuê gốc (${formatVND(order.baseRental)}) cho chủ đồ ${order.ownerName}.`,
    time: 'Vừa xong'
  });

  pushNotification('Cọc đã hoàn', `Escrow đã hoàn 100% tiền cọc (${formatVND(order.deposit)}) của đơn ${order.id} cho người thuê và giải ngân ${formatVND(order.baseRental)} cho chủ đồ.`, order.id);
  showToast(`Hoàn tất đơn ${order.id}! Đã hoàn 100% tiền cọc (${formatVND(order.deposit)}) & giải ngân tiền thuê.`, 'success');
  renderApp();
}

// ============================================================================
// F-S11 — BÁO CÁO SỰ CỐ / TRANH CHẤP
// ============================================================================
function openDisputeModal(orderId) {
  state.disputeModalOrderId = orderId;
  renderApp();
}

function submitDisputeReport(orderId) {
  const order = getOrderById(orderId);
  if (!order) return;
  const issueType = document.getElementById('dispute-issue-type')?.value || 'Hỏng nhẹ';
  const deduction = Number(document.getElementById('dispute-deduction')?.value || 200000);
  const statement = document.getElementById('dispute-statement')?.value || 'Sản phẩm có vết trầy/nứt nhẹ sau khi nhận lại đồ, đề nghị khấu trừ chi phí sửa chữa.';

  if (!order.checkoutPhotos || order.checkoutPhotos.length === 0) {
    order.checkoutPhotos = [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      order.productImage
    ];
  }

  order.status = 'Tranh chấp';
  order.escrowStatus = 'Cọc đang phong tỏa';
  order.dispute = {
    issueType,
    proposedDeduction: Math.min(deduction, order.deposit),
    ownerStatement: statement,
    renterStatement: 'Người thuê đã nhận thông báo sự cố và đề nghị Admin đối chiếu ảnh Check-in / Check-out công tâm.',
    evidencePhotos: [...order.checkoutPhotos],
    resolved: false,
    resolutionType: null,
    resolutionNote: ''
  };

  state.escrowLogs.unshift({
    id: 'ESC-' + Math.floor(200 + Math.random() * 800),
    orderId: order.id,
    action: `Đóng băng cọc do Tranh chấp (${issueType})`,
    amount: order.deposit,
    type: 'frozen',
    note: `Chủ đồ đề nghị khấu trừ ${formatVND(deduction)}. Đã khóa hoàn cọc tự động, chờ Admin phân xử.`,
    time: 'Vừa xong'
  });

  state.disputeModalOrderId = null;
  state.adminActiveDisputeOrderId = order.id;
  pushNotification('Có tranh chấp cần phản hồi', `Đơn ${order.id} đã chuyển sang trạng thái Tranh chấp (${issueType}). Tiền cọc ${formatVND(order.deposit)} đang bị đóng băng chờ Admin phân xử.`, order.id);
  showToast(`Đã gửi báo cáo sự cố! Đơn ${order.id} chuyển sang "Tranh chấp" & khóa hoàn cọc.`, 'warning');
  renderApp();
}

// ============================================================================
// F-S12 — ĐÁNH GIÁ 2 CHIỀU
// ============================================================================
function openRatingModal(orderId) {
  state.ratingModalOrderId = orderId;
  renderApp();
}

function submitTwoWayRating(orderId) {
  const order = getOrderById(orderId);
  if (!order) return;
  const stars = Number(document.getElementById('rating-stars')?.value || 5);
  const comment = document.getElementById('rating-comment')?.value || 'Đúng hẹn, đồ dùng chất lượng đúng mô tả, giao dịch tự động rất nhanh!';
  const checkedTags = Array.from(document.querySelectorAll('.rating-tag-cb:checked')).map(el => el.value);
  const tags = checkedTags.length > 0 ? checkedTags : ['Đúng hẹn', 'Thân thiện', 'Giữ gìn đồ', 'Đúng mô tả'];

  order.renterRated = true;
  order.ownerRated = true;
  order.ratingScore = stars;
  order.ratingComment = comment;
  order.ratingTags = tags;

  // Add review to Product & update Owner/Renter Trust Score & CompletedTx (F-S12)
  const product = getProductById(order.productId);
  if (product) {
    if (!product.reviews) product.reviews = [];
    product.reviews.unshift({
      id: 'rv-' + Date.now(),
      userId: order.renterId,
      userName: order.renterName,
      rating: stars,
      comment,
      tags,
      date: 'Hôm nay'
    });
  }

  const owner = getUserById(order.ownerId);
  if (owner) {
    owner.completedTx += 1;
    owner.trustScore = Math.min(100, (owner.trustScore || 90) + 1);
    owner.rating = Number(((owner.rating * 4 + stars) / 5).toFixed(1));
  }

  state.ratingModalOrderId = null;
  pushNotification('Có đánh giá mới', `Bạn vừa nhận được đánh giá ${stars} sao từ đơn ${order.id}. Trust Score đã được cập nhật!`, order.id);
  showToast('Đã ghi nhận đánh giá 2 chiều & cập nhật điểm uy tín (Trust Score) công khai!', 'success');
  renderApp();
}

// ============================================================================
// F-S01 — HỒ SƠ CÁ NHÂN & HỒ SƠ CÔNG KHAI
// ============================================================================
function renderProfilePage() {
  const u = state.currentUser || state.users[0];
  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 page-enter space-y-6">
      <div class="sr-card p-6 sm:p-8">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div class="flex items-center gap-4">
            <img src="${u.avatar}" onerror="this.src=createFallbackImage('U')" class="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500" />
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900">${u.name}</h1>
                ${u.verifiedStudent ? `<span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">✔ Sinh viên xác thực</span>` : ''}
                ${u.isNewUser || u.completedTx === 0 ? `<span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">🌱 Người mới</span>` : ''}
              </div>
              <p class="text-xs sm:text-sm text-slate-500 mt-1">${u.school} • MSSV: <strong>${u.studentId || '20225108'}</strong></p>
              <p class="text-xs text-emerald-600 font-semibold mt-0.5">Email xác thực: ${u.eduEmail || u.email}</p>
            </div>
          </div>
          <button onclick="quickSwitchRole('guest')" class="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold cursor-pointer">
            Đăng xuất
          </button>
        </div>

        <!-- 4 Trust Metrics (F-S01: Trust Score, Sao trung bình, Số lượt cho thuê, Số lượt đã thuê) -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <div class="text-2xl font-extrabold text-emerald-600">${u.trustScore || 95}/100</div>
            <div class="text-xs font-bold text-emerald-900 mt-0.5">🛡️ Trust Score</div>
          </div>
          <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <div class="text-2xl font-extrabold text-amber-600">★ ${u.rating || 'Mới'}</div>
            <div class="text-xs font-bold text-amber-900 mt-0.5">Sao trung bình</div>
          </div>
          <div class="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
            <div class="text-2xl font-extrabold text-blue-600">${u.rentedOutCount || 0}</div>
            <div class="text-xs font-bold text-blue-900 mt-0.5">Số lượt cho thuê</div>
          </div>
          <div class="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
            <div class="text-2xl font-extrabold text-indigo-600">${u.rentedInCount || 0}</div>
            <div class="text-xs font-bold text-indigo-900 mt-0.5">Số lượt đã thuê</div>
          </div>
        </div>

        <!-- Editable Profile Information -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Họ và tên</label>
            <input type="text" id="prof-name" value="${u.name}" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Số điện thoại liên hệ</label>
            <input type="text" id="prof-phone" value="${u.phone || '0987654321'}" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Trường / Khoa</label>
            <input type="text" id="prof-school" value="${u.school || ''}" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Khu vực / KTX</label>
            <select id="prof-area" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold">
              ${AREAS.map(a => `<option value="${a}" ${u.area === a ? 'selected' : ''}>📍 ${a}</option>`).join('')}
            </select>
          </div>
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-slate-600 mb-1">Tài khoản ngân hàng nhận tiền hoàn cọc & doanh thu cho thuê</label>
            <input type="text" id="prof-bank" value="${u.bankAccount || ''}" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold" />
          </div>
        </div>

        <div class="mt-6 flex justify-between items-center pt-4 border-t border-slate-100">
          <button onclick="openPublicProfile('u-2')" class="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">
            👁️ Xem thử hồ sơ công khai của người khác (Trần Thảo Tiên)
          </button>
          <button onclick="saveProfileChanges()" class="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm cursor-pointer">
            Lưu cập nhật hồ sơ
          </button>
        </div>
      </div>
    </div>
  `;
}

function saveProfileChanges() {
  if (!state.currentUser) return;
  state.currentUser.name = document.getElementById('prof-name')?.value || state.currentUser.name;
  state.currentUser.phone = document.getElementById('prof-phone')?.value || state.currentUser.phone;
  state.currentUser.school = document.getElementById('prof-school')?.value || state.currentUser.school;
  state.currentUser.area = document.getElementById('prof-area')?.value || state.currentUser.area;
  state.currentUser.bankAccount = document.getElementById('prof-bank')?.value || state.currentUser.bankAccount;
  showToast('Đã lưu thông tin hồ sơ cá nhân!', 'success');
  renderApp();
}

function openPublicProfile(userId) {
  state.publicProfileUserId = userId;
  renderApp();
}

// ============================================================================
// F-S15 & SECTION 40 — TRANG CHAT NHẮN TIN NHANH (2 cột Desktop / 2 màn hình Mobile + Thẻ tóm tắt đơn)
// ============================================================================
function openChatForOrder(orderId) {
  let chat = state.chats.find(c => c.orderId === orderId);
  if (!chat) {
    const order = getOrderById(orderId);
    if (order) {
      const partner = getUserById(order.ownerId);
      chat = {
        id: 'chat-' + Date.now(),
        orderId: order.id,
        productId: order.productId,
        productTitle: order.productTitle,
        productImage: order.productImage,
        partnerId: partner.id,
        partnerName: partner.name,
        partnerAvatar: partner.avatar,
        partnerSchool: partner.school,
        unread: 0,
        messages: [
          { senderId: partner.id, text: `Chào bạn! Đơn ${order.id} đã được hệ thống xác nhận tự động. Bạn muốn hẹn nhận đồ lúc mấy giờ tại điểm giao nhận?`, time: 'Vừa xong' }
        ]
      };
      state.chats.unshift(chat);
    }
  }
  if (chat) {
    state.activeChatId = chat.id;
    chat.unread = 0;
  }
  state.mobileChatView = 'room';
  navigateTo('chat');
}

function renderChatPage() {
  const activeChat = state.chats.find(c => c.id === state.activeChatId) || state.chats[0];
  const linkedOrder = activeChat ? getOrderById(activeChat.orderId) : null;

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 page-enter">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h1 class="text-xl font-extrabold text-slate-900">💬 Nhắn tin nhanh trao đổi giao nhận (F-S15)</h1>
          <p class="text-xs text-slate-500">Chat chỉ là chức năng bổ trợ để hẹn giờ & địa điểm nhận đồ sau khi đã đặt chỗ tự động</p>
        </div>
      </div>

      <!-- Desktop 2 Columns / Mobile 2 Separate Screens (Section 40) -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-5 h-[580px]">
        <!-- Column 1: Conversation List -->
        <div class="md:col-span-4 sr-card overflow-hidden flex flex-col ${state.mobileChatView === 'room' ? 'hidden md:flex' : 'flex'}">
          <div class="p-3.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider">
            Danh sách hội thoại (${state.chats.length})
          </div>
          <div class="flex-1 overflow-y-auto divide-y divide-slate-100">
            ${state.chats.map(c => {
              const ord = getOrderById(c.orderId);
              const lastMsg = c.messages[c.messages.length - 1];
              return `
                <div
                  onclick="state.activeChatId='${c.id}';state.mobileChatView='room';c.unread=0;renderApp()"
                  class="p-3.5 flex items-start gap-3 cursor-pointer transition ${c.id === activeChat.id ? 'bg-emerald-50/80 border-l-4 border-l-emerald-500' : 'hover:bg-slate-50'}"
                >
                  <img src="${c.partnerAvatar}" onerror="this.src=createFallbackImage('U')" class="w-11 h-11 rounded-xl object-cover shrink-0" />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-xs text-slate-900 truncate">${c.partnerName}</span>
                      <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">${c.orderId}</span>
                    </div>
                    <div class="text-[11px] text-emerald-700 font-semibold truncate">${c.productTitle}</div>
                    <div class="text-xs text-slate-500 truncate mt-0.5">${lastMsg ? lastMsg.text : ''}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Column 2: Chat Box with Order Summary Card at Top -->
        <div class="md:col-span-8 sr-card overflow-hidden flex flex-col ${state.mobileChatView === 'list' ? 'hidden md:flex' : 'flex'}">
          <!-- Partner Header + Mobile Back Button -->
          <div class="p-3.5 border-b border-slate-200 flex items-center justify-between bg-white">
            <div class="flex items-center gap-2.5">
              <button onclick="state.mobileChatView='list';renderApp()" class="md:hidden px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                ← Danh sách
              </button>
              <img src="${activeChat.partnerAvatar}" onerror="this.src=createFallbackImage('U')" class="w-9 h-9 rounded-xl object-cover" />
              <div>
                <div class="font-bold text-xs sm:text-sm text-slate-900">${activeChat.partnerName}</div>
                <div class="text-[11px] text-slate-500">${activeChat.partnerSchool}</div>
              </div>
            </div>
            <button onclick="openPublicProfile('${activeChat.partnerId}')" class="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">
              Xem hồ sơ
            </button>
          </div>

          <!-- MANDATORY: Thẻ tóm tắt đơn hàng ở đầu khung chat (F-S15 & Section 40) -->
          ${linkedOrder ? `
            <div class="p-3 bg-emerald-50/70 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2.5 min-w-0">
                <img src="${linkedOrder.productImage}" onerror="this.src=createFallbackImage('SP')" class="w-11 h-11 rounded-lg object-cover shrink-0" />
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-extrabold text-slate-900">Đơn #${linkedOrder.id}</span>
                    ${renderOrderStatusBadge(linkedOrder.status)}
                  </div>
                  <div class="text-xs font-bold text-slate-800 truncate">${linkedOrder.productTitle}</div>
                  <div class="text-[11px] text-slate-600">Ngày thuê: ${formatDateVN(linkedOrder.startDate)} → ${formatDateVN(linkedOrder.endDate)} • Cọc Escrow: <strong>${formatVND(linkedOrder.deposit)}</strong></div>
                </div>
              </div>
              <button onclick="navigateTo('dashboard')" class="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold shrink-0 cursor-pointer">
                Chi tiết đơn
              </button>
            </div>
          ` : ''}

          <!-- Messages Feed -->
          <div class="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60">
            ${activeChat.messages.map(m => {
              const isMe = m.senderId === 'u-1' || (state.currentUser && m.senderId === state.currentUser.id);
              return `
                <div class="flex ${isMe ? 'justify-end' : 'justify-start'}">
                  <div class="max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm ${isMe ? 'bg-emerald-500 text-white rounded-br-xs' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'}">
                    <div>${m.text}</div>
                    <div class="text-[10px] mt-1 opacity-75 text-right">${m.time}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Quick Reply Chips + Input -->
          <div class="p-3 bg-white border-t border-slate-200 space-y-2">
            <div class="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
              <button onclick="sendQuickChatMessage('Mình hẹn nhận đồ ở cổng chính trường lúc 8h30 nhé!')" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 whitespace-nowrap cursor-pointer">📍 Hẹn cổng trường 8h30</button>
              <button onclick="sendQuickChatMessage('Mình đã tới điểm hẹn rồi, chúng mình chụp 2 ảnh Check-in nhé!')" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 whitespace-nowrap cursor-pointer">📸 Đã tới điểm hẹn Check-in</button>
              <button onclick="sendQuickChatMessage('Chiều nay 17h mình qua trả đồ và chụp ảnh Check-out nha!')" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 whitespace-nowrap cursor-pointer">⏰ Hẹn 17h trả đồ Check-out</button>
            </div>
            <div class="flex gap-2">
              <input
                type="text"
                id="chat-input-box"
                onkeydown="if(event.key==='Enter'){sendChatMessage()}"
                placeholder="Nhập tin nhắn trao đổi giờ / địa điểm giao nhận..."
                class="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
              <button onclick="sendChatMessage()" class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm cursor-pointer">
                Gửi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function sendChatMessage() {
  const input = document.getElementById('chat-input-box');
  if (!input || !input.value.trim()) return;
  sendQuickChatMessage(input.value.trim());
}

function sendQuickChatMessage(text) {
  const activeChat = state.chats.find(c => c.id === state.activeChatId) || state.chats[0];
  if (!activeChat) return;
  activeChat.messages.push({
    senderId: state.currentUser ? state.currentUser.id : 'u-1',
    text,
    time: 'Vừa xong'
  });
  renderApp();
}

// ============================================================================
// F-S16 — TRANG YÊU THÍCH (WISHLIST)
// ============================================================================
function renderWishlistPage() {
  const wishedProducts = state.products.filter(p => state.wishlist.includes(p.id));
  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 page-enter space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900">❤️ Danh sách đồ yêu thích (${wishedProducts.length})</h1>
          <p class="text-xs text-slate-500">Lưu các món đồ cần thuê để đặt nhanh khi đến kỳ sự kiện / đồ án</p>
        </div>
        <button onclick="navigateTo('catalog')" class="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer">
          + Khám phá thêm
        </button>
      </div>
      ${wishedProducts.length === 0 ? `
        <div class="sr-card p-12 text-center text-slate-500 text-sm">Chưa có sản phẩm nào trong danh sách yêu thích.</div>
      ` : `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          ${wishedProducts.map(p => renderProductCard(p)).join('')}
        </div>
      `}
    </div>
  `;
}
