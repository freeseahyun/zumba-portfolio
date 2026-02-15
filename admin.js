// =============================================
// ZumbaFlow 관리자 대시보드 - JavaScript 로직
// localStorage를 사용해 데이터를 브라우저에 저장
// =============================================

// --- 기본 데이터 (초기 로드 시 사용) ---
const DEFAULT_INSTRUCTORS = [
    { id: 1, name: 'Sarah', specialty: 'Classic Zumba, Power Dance', bio: '10년 경력의 줌바 마스터 트레이너', phone: '010-1111-2222', email: 'sarah@zumba.com' },
    { id: 2, name: 'Mike', specialty: 'Aqua Rhythm, Aqua Beats', bio: '수중 피트니스 전문 강사', phone: '010-3333-4444', email: 'mike@zumba.com' },
    { id: 3, name: 'Jess', specialty: 'Toning, Morning Tone', bio: '바디 스컬프팅 & 토닝 전문가', phone: '010-5555-6666', email: 'jess@zumba.com' },
    { id: 4, name: 'Alex', specialty: 'Strong Nation', bio: '고강도 HIIT 트레이닝 전문', phone: '010-7777-8888', email: 'alex@zumba.com' },
];
const DEFAULT_CLASSES = [
    { id: 1, name: 'Power Dance', day: 'MON', time: '18:00', instructor: 'Sarah', location: 'Studio A', type: 'ZUMBA', color: 'primary' },
    { id: 2, name: 'Aqua Beats', day: 'MON', time: '20:00', instructor: 'Mike', location: 'Pool 1', type: 'AQUA', color: 'cyan-accent' },
    { id: 3, name: 'Toning Flow', day: 'TUE', time: '17:30', instructor: 'Jess', location: 'Studio B', type: 'TONING', color: 'lime-accent' },
    { id: 4, name: 'Power Dance', day: 'WED', time: '18:00', instructor: 'Sarah', location: 'Studio A', type: 'ZUMBA', color: 'primary' },
    { id: 5, name: 'Strong Nation', day: 'WED', time: '19:30', instructor: 'Alex', location: 'Studio A', type: 'ZUMBA', color: 'primary' },
    { id: 6, name: 'Aqua Rhythm', day: 'THU', time: '18:00', instructor: 'Mike', location: 'Pool 1', type: 'AQUA', color: 'cyan-accent' },
    { id: 7, name: 'Flash Friday', day: 'FRI', time: '17:00', instructor: 'Sarah', location: 'Studio A', type: 'ZUMBA', color: 'primary' },
    { id: 8, name: 'Morning Tone', day: 'SAT', time: '10:00', instructor: 'Jess', location: 'Studio B', type: 'TONING', color: 'lime-accent' },
];
const DEFAULT_LOCATIONS = [
    { id: 1, name: 'Studio A', address: '서울시 강남구 리듬로 123', capacity: 30, desc: '메인 댄스 스튜디오' },
    { id: 2, name: 'Studio B', address: '서울시 강남구 리듬로 123 B동', capacity: 20, desc: '토닝 전용 스튜디오' },
    { id: 3, name: 'Pool 1', address: '서울시 강남구 스플래시 웨이 456', capacity: 15, desc: '아쿠아 수업 전용 풀' },
];
const DEFAULT_SETTINGS = { siteName: 'ZumbaFlow', phone: '02-1234-5678', email: 'info@zumbaflow.com', insta: '@zumbaflow', pw: 'admin1234' };

// --- 데이터 로드/저장 헬퍼 ---
function loadData(key, fallback) {
    const d = localStorage.getItem('zf_' + key);
    return d ? JSON.parse(d) : JSON.parse(JSON.stringify(fallback));
}
function saveData(key, data) { localStorage.setItem('zf_' + key, JSON.stringify(data)); }

// 전역 상태
let instructors = loadData('instructors', DEFAULT_INSTRUCTORS);
let classes = loadData('classes', DEFAULT_CLASSES);
let locations = loadData('locations', DEFAULT_LOCATIONS);
let settings = loadData('settings', DEFAULT_SETTINGS);
let editingId = null; // 수정 중인 항목 ID
let editingType = null;

// --- 로그인/로그아웃 ---
function doLogin() {
    const id = document.getElementById('loginId').value;
    const pw = document.getElementById('loginPw').value;
    if (id === 'admin' && pw === settings.pw) {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        document.getElementById('loginError').classList.add('hidden');
        sessionStorage.setItem('zf_auth', '1');
        refreshAll();
    } else {
        document.getElementById('loginError').classList.remove('hidden');
    }
}
function doLogout() {
    sessionStorage.removeItem('zf_auth');
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('loginId').value = '';
    document.getElementById('loginPw').value = '';
}

// --- 섹션 네비게이션 ---
const TITLES = { 'dashboard-home': '대시보드', 'instructors': '강사 관리', 'classes': '수업 스케줄 관리', 'locations': '장소 관리', 'settings': '사이트 설정' };
function showSection(name) {
    document.querySelectorAll('[id^="sec-"]').forEach(s => s.classList.add('hidden'));
    const sec = document.getElementById('sec-' + name);
    if (sec) { sec.classList.remove('hidden'); sec.classList.add('fade-in'); }
    document.getElementById('pageTitle').textContent = TITLES[name] || name;
    // 사이드바 활성화
    document.querySelectorAll('#sideNav button').forEach(b => {
        b.classList.remove('nav-active');
        b.classList.add('text-slate-400', 'hover:bg-white/5');
        if (b.dataset.section === name) { b.classList.add('nav-active'); b.classList.remove('text-slate-400', 'hover:bg-white/5'); }
    });
    if (name === 'instructors') renderInstructors();
    if (name === 'classes') renderClasses();
    if (name === 'locations') renderLocations();
    if (name === 'settings') loadSettings();
    if (name === 'dashboard-home') updateStats();
}

// --- 통계 업데이트 ---
function updateStats() {
    document.getElementById('statInstructors').textContent = instructors.length;
    document.getElementById('statClasses').textContent = classes.length;
    document.getElementById('statLocations').textContent = locations.length;
}

// --- 모달 ---
function openModal(type, id) {
    editingType = type;
    editingId = id || null;
    const modal = document.getElementById('modal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    const isEdit = !!id;

    if (type === 'instructor') {
        const item = isEdit ? instructors.find(i => i.id === id) : {};
        title.textContent = isEdit ? '강사 수정' : '강사 추가';
        body.innerHTML = `
            <div class="space-y-4">
                <div><label class="text-sm text-slate-400 block mb-1">이름 *</label><input id="mName" value="${item.name || ''}" class="w-full px-4 py-3 rounded-lg text-sm" /></div>
                <div><label class="text-sm text-slate-400 block mb-1">전문 분야</label><input id="mSpecialty" value="${item.specialty || ''}" class="w-full px-4 py-3 rounded-lg text-sm" /></div>
                <div><label class="text-sm text-slate-400 block mb-1">소개</label><textarea id="mBio" rows="3" class="w-full px-4 py-3 rounded-lg text-sm">${item.bio || ''}</textarea></div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="text-sm text-slate-400 block mb-1">연락처</label><input id="mPhone" value="${item.phone || ''}" class="w-full px-4 py-3 rounded-lg text-sm" /></div>
                    <div><label class="text-sm text-slate-400 block mb-1">이메일</label><input id="mEmail" value="${item.email || ''}" class="w-full px-4 py-3 rounded-lg text-sm" /></div>
                </div>
                <button onclick="saveItem('instructor')" class="w-full bg-primary text-white py-3 rounded-full font-bold mt-4 hover:scale-105 transition-transform">${isEdit ? '수정 완료' : '추가하기'}</button>
            </div>`;
    } else if (type === 'class') {
        const item = isEdit ? classes.find(i => i.id === id) : {};
        const instrOpts = instructors.map(i => `<option value="${i.name}" ${item.instructor === i.name ? 'selected' : ''}>${i.name}</option>`).join('');
        const locOpts = locations.map(l => `<option value="${l.name}" ${item.location === l.name ? 'selected' : ''}>${l.name}</option>`).join('');
        const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        const dayOpts = days.map(d => `<option value="${d}" ${item.day === d ? 'selected' : ''}>${d}</option>`).join('');
        const types = [['ZUMBA', 'primary'], ['AQUA', 'cyan-accent'], ['TONING', 'lime-accent']];
        const typeOpts = types.map(t => `<option value="${t[0]}" ${item.type === t[0] ? 'selected' : ''}>${t[0]}</option>`).join('');
        title.textContent = isEdit ? '수업 수정' : '수업 추가';
        body.innerHTML = `
            <div class="space-y-4">
                <div><label class="text-sm text-slate-400 block mb-1">수업명 *</label><input id="mName" value="${item.name || ''}" class="w-full px-4 py-3 rounded-lg text-sm" /></div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="text-sm text-slate-400 block mb-1">요일</label><select id="mDay" class="w-full px-4 py-3 rounded-lg text-sm">${dayOpts}</select></div>
                    <div><label class="text-sm text-slate-400 block mb-1">시간</label><input id="mTime" type="time" value="${item.time || '18:00'}" class="w-full px-4 py-3 rounded-lg text-sm" /></div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="text-sm text-slate-400 block mb-1">강사</label><select id="mInstructor" class="w-full px-4 py-3 rounded-lg text-sm">${instrOpts}</select></div>
                    <div><label class="text-sm text-slate-400 block mb-1">장소</label><select id="mLocation" class="w-full px-4 py-3 rounded-lg text-sm">${locOpts}</select></div>
                </div>
                <div><label class="text-sm text-slate-400 block mb-1">유형</label><select id="mType" class="w-full px-4 py-3 rounded-lg text-sm">${typeOpts}</select></div>
                <button onclick="saveItem('class')" class="w-full bg-cyan-accent text-background-dark py-3 rounded-full font-bold mt-4 hover:scale-105 transition-transform">${isEdit ? '수정 완료' : '추가하기'}</button>
            </div>`;
    } else if (type === 'location') {
        const item = isEdit ? locations.find(i => i.id === id) : {};
        title.textContent = isEdit ? '장소 수정' : '장소 추가';
        body.innerHTML = `
            <div class="space-y-4">
                <div><label class="text-sm text-slate-400 block mb-1">장소명 *</label><input id="mName" value="${item.name || ''}" class="w-full px-4 py-3 rounded-lg text-sm" /></div>
                <div><label class="text-sm text-slate-400 block mb-1">주소</label><input id="mAddress" value="${item.address || ''}" class="w-full px-4 py-3 rounded-lg text-sm" /></div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="text-sm text-slate-400 block mb-1">수용인원</label><input id="mCapacity" type="number" value="${item.capacity || 20}" class="w-full px-4 py-3 rounded-lg text-sm" /></div>
                    <div><label class="text-sm text-slate-400 block mb-1">설명</label><input id="mDesc" value="${item.desc || ''}" class="w-full px-4 py-3 rounded-lg text-sm" /></div>
                </div>
                <button onclick="saveItem('location')" class="w-full bg-lime-accent text-background-dark py-3 rounded-full font-bold mt-4 hover:scale-105 transition-transform">${isEdit ? '수정 완료' : '추가하기'}</button>
            </div>`;
    }
    modal.classList.remove('hidden');
}
function closeModal() { document.getElementById('modal').classList.add('hidden'); editingId = null; editingType = null; }

// --- 항목 저장 (추가/수정) ---
function saveItem(type) {
    const name = document.getElementById('mName')?.value?.trim();
    if (!name) { alert('이름(수업명)을 입력해주세요.'); return; }

    if (type === 'instructor') {
        const item = { name, specialty: document.getElementById('mSpecialty').value, bio: document.getElementById('mBio').value, phone: document.getElementById('mPhone').value, email: document.getElementById('mEmail').value };
        if (editingId) { const idx = instructors.findIndex(i => i.id === editingId); if (idx >= 0) instructors[idx] = { ...instructors[idx], ...item }; }
        else { item.id = Date.now(); instructors.push(item); }
        saveData('instructors', instructors); renderInstructors();
    } else if (type === 'class') {
        const typeVal = document.getElementById('mType').value;
        const colorMap = { ZUMBA: 'primary', AQUA: 'cyan-accent', TONING: 'lime-accent' };
        const item = { name, day: document.getElementById('mDay').value, time: document.getElementById('mTime').value, instructor: document.getElementById('mInstructor').value, location: document.getElementById('mLocation').value, type: typeVal, color: colorMap[typeVal] || 'primary' };
        if (editingId) { const idx = classes.findIndex(i => i.id === editingId); if (idx >= 0) classes[idx] = { ...classes[idx], ...item }; }
        else { item.id = Date.now(); classes.push(item); }
        saveData('classes', classes); renderClasses();
    } else if (type === 'location') {
        const item = { name, address: document.getElementById('mAddress').value, capacity: parseInt(document.getElementById('mCapacity').value) || 20, desc: document.getElementById('mDesc').value };
        if (editingId) { const idx = locations.findIndex(i => i.id === editingId); if (idx >= 0) locations[idx] = { ...locations[idx], ...item }; }
        else { item.id = Date.now(); locations.push(item); }
        saveData('locations', locations); renderLocations();
    }
    closeModal(); updateStats();
}

// --- 항목 삭제 ---
function deleteItem(type, id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    if (type === 'instructor') { instructors = instructors.filter(i => i.id !== id); saveData('instructors', instructors); renderInstructors(); }
    else if (type === 'class') { classes = classes.filter(i => i.id !== id); saveData('classes', classes); renderClasses(); }
    else if (type === 'location') { locations = locations.filter(i => i.id !== id); saveData('locations', locations); renderLocations(); }
    updateStats();
}

// --- 렌더링: 강사 목록 ---
function renderInstructors() {
    const el = document.getElementById('instructorList');
    if (!instructors.length) { el.innerHTML = '<p class="text-slate-500 text-center py-8">등록된 강사가 없습니다.</p>'; return; }
    el.innerHTML = instructors.map(i => `
        <div class="glass-card p-6 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors">
            <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center"><span class="material-icons text-primary">person</span></div>
                <div>
                    <h4 class="font-bold text-lg">${i.name}</h4>
                    <p class="text-slate-400 text-sm">${i.specialty || ''}</p>
                    <p class="text-slate-500 text-xs mt-1">${i.bio || ''}</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button onclick="openModal('instructor',${i.id})" class="p-2 rounded-lg hover:bg-white/10 transition-colors"><span class="material-icons text-slate-400 text-sm">edit</span></button>
                <button onclick="deleteItem('instructor',${i.id})" class="p-2 rounded-lg hover:bg-red-500/20 transition-colors"><span class="material-icons text-red-400 text-sm">delete</span></button>
            </div>
        </div>`).join('');
}

// --- 렌더링: 수업 목록 ---
function renderClasses() {
    const el = document.getElementById('classList');
    if (!classes.length) { el.innerHTML = '<p class="text-slate-500 text-center py-8">등록된 수업이 없습니다.</p>'; return; }
    // 요일 순서로 정렬
    const dayOrder = { MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6, SUN: 7 };
    const sorted = [...classes].sort((a, b) => (dayOrder[a.day] || 8) - (dayOrder[b.day] || 8) || a.time.localeCompare(b.time));
    el.innerHTML = sorted.map(c => {
        const borderColor = c.color === 'primary' ? 'border-l-primary' : c.color === 'cyan-accent' ? 'border-l-cyan-accent' : 'border-l-lime-accent';
        const textColor = c.color === 'primary' ? 'text-primary' : c.color === 'cyan-accent' ? 'text-cyan-accent' : 'text-lime-accent';
        return `
        <div class="glass-card p-5 rounded-xl border-l-4 ${borderColor} flex items-center justify-between hover:bg-white/5 transition-colors">
            <div class="flex items-center space-x-6">
                <div class="text-center min-w-[60px]"><span class="bebas text-xl text-slate-300">${c.day}</span><br/><span class="${textColor} font-bold text-sm">${c.time}</span></div>
                <div>
                    <h4 class="font-bold text-lg">${c.name} <span class="text-xs px-2 py-0.5 rounded-full bg-white/10 ${textColor} ml-2">${c.type}</span></h4>
                    <p class="text-slate-400 text-sm">${c.location} · ${c.instructor}</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button onclick="openModal('class',${c.id})" class="p-2 rounded-lg hover:bg-white/10 transition-colors"><span class="material-icons text-slate-400 text-sm">edit</span></button>
                <button onclick="deleteItem('class',${c.id})" class="p-2 rounded-lg hover:bg-red-500/20 transition-colors"><span class="material-icons text-red-400 text-sm">delete</span></button>
            </div>
        </div>`;
    }).join('');
}

// --- 렌더링: 장소 목록 ---
function renderLocations() {
    const el = document.getElementById('locationList');
    if (!locations.length) { el.innerHTML = '<p class="text-slate-500 text-center py-8">등록된 장소가 없습니다.</p>'; return; }
    el.innerHTML = locations.map(l => `
        <div class="glass-card p-6 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors">
            <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-lime-accent/20 rounded-full flex items-center justify-center"><span class="material-icons text-lime-accent">location_on</span></div>
                <div>
                    <h4 class="font-bold text-lg">${l.name}</h4>
                    <p class="text-slate-400 text-sm">${l.address || ''}</p>
                    <p class="text-slate-500 text-xs mt-1">수용인원: ${l.capacity}명 · ${l.desc || ''}</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button onclick="openModal('location',${l.id})" class="p-2 rounded-lg hover:bg-white/10 transition-colors"><span class="material-icons text-slate-400 text-sm">edit</span></button>
                <button onclick="deleteItem('location',${l.id})" class="p-2 rounded-lg hover:bg-red-500/20 transition-colors"><span class="material-icons text-red-400 text-sm">delete</span></button>
            </div>
        </div>`).join('');
}

// --- 사이트 설정 ---
function loadSettings() {
    document.getElementById('setSiteName').value = settings.siteName || '';
    document.getElementById('setPhone').value = settings.phone || '';
    document.getElementById('setEmail').value = settings.email || '';
    document.getElementById('setInsta').value = settings.insta || '';
    document.getElementById('setNewPw').value = '';
}
function saveSettings() {
    settings.siteName = document.getElementById('setSiteName').value;
    settings.phone = document.getElementById('setPhone').value;
    settings.email = document.getElementById('setEmail').value;
    settings.insta = document.getElementById('setInsta').value;
    const newPw = document.getElementById('setNewPw').value.trim();
    if (newPw) settings.pw = newPw;
    saveData('settings', settings);
    alert('설정이 저장되었습니다!');
}

// --- 전체 새로고침 ---
function refreshAll() { updateStats(); }

// --- 페이지 로드 시 자동 로그인 체크 ---
window.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('zf_auth') === '1') {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        refreshAll();
    }
});
