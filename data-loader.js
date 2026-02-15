// =============================================
// ZumbaFlow 데이터 로더 - 일반 사용자 페이지용
// 관리자가 저장한 데이터를 불러와 화면에 표시
// =============================================

const DEFAULT_INSTRUCTORS = [
    { id: 1, name: 'Sarah', specialty: 'Classic Zumba, Power Dance', bio: '10년 경력의 줌바 마스터 트레이너', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1doNQTSHcfHgLsBKZ9vWWTXMe1iSXnAcevdFEa6LeNSli5b8L6LpOZlmtYnoMaqOx21QVshBMbuEsQayLe4LHehaIjFjGoqy6F7sxHwPKRPQwuZQg2l20SvqucNbeXKlIH8OdxY-IP9i8LNZEAqeqVgeeIokahnA1Y4VrCjK8i6MZtmUUT5YMS5-RKNmDAYEVsQoUggjAL6HCGCugE-a5XR7zs1ilDDuawpJ2HwXJgzU3L11YyJp0hmfTUIQ5nCxBeMsBLpnVgw' },
    { id: 2, name: 'Mike', specialty: 'Aqua Rhythm, Aqua Beats', bio: '수중 피트니스 전문 강사', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgUF3jPt7udcLUUwZnqG9rBiW5ZuiFxrrfP2d80ieInQtLnVYnYbXCNsaCi5Rqqh8z1M1aGfCU9LoWBcvM4eab8Lr6lVrishEJHbA5D3za90DCCwNmTjoHnvHT81SCMKTLB1AMDcPWOEjeEzc7jDxwqfxMlJQg11Dxv02_l3wAHtsIqPdy3GwcW3dsK1Xf8zzXsDsfvpGoYW6MEK_hxGlnSBSKGUnFlR22RVz0VFXMsTe6uesytv9sBPfm9zuUXtG39trVsjKKng' },
    { id: 3, name: 'Jess', specialty: 'Toning, Morning Tone', bio: '바디 스컬프팅 & 토닝 전문가', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG9x3XFFX6uk7EUlSkE1ytvq-mhMteAD4XGgEoo288gT7RLHxNVscZywC8jTGdGazOPDHw_MUXjE6ag177tdVquGYFjKN_t-ZU62DeyN8JUr8nL8JGKeuGc9I4XJNN9VEoxbywcV5KnCJX_KcLqRMTMngTJ1Hsd8z3S2kKO1zlALbE2emKHah9BWs52wEmqkxxEOqeOthbAyqVOVTcyO_7UuH5p26_iE5-ZjtdQ90BL-e4Sq3qKdpN6nM2vvqLQcrOZNmOs2huRQ' },
    { id: 4, name: 'Alex', specialty: 'Strong Nation', bio: '고강도 HIIT 트레이닝 전문', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHxjKJrGxHQ2UhjpexXVSo1a4BWjUZuuLl94LcK_rMBquZ3aKth1qBjT3MT9TPAcYCgorKeuw5SUtiWbCFbIQM_jFQUudWCyCXzqppKX8BbA-cg4yxppQyOWUT66-r62vV2y5ZFZoiqJMFpMpQVHANnSdcV5wZ0q892OLsr8O5t5TI6OpDy7dA0Q8RrzQq2TuHb0yRod81J_TBnNs3ssXCsfAudq77F2ONGdm5woEfy9mpAkmt5hmjJyaKzLToi7UwI305_X-CeQ' },
];
const DEFAULT_CLASSES = [
    { id: 1, name: 'Power Dance', day: 'MON', time: '18:00', instructor: 'Sarah', location: 'Studio A', type: 'ZUMBA', color: 'primary' },
    { id: 2, name: 'Aqua Beats', day: 'MON', time: '20:00', instructor: 'Mike', location: 'Pool 1', type: 'AQUA', color: 'cyan-accent' },
    { id: 3, name: 'Toning Flow', day: 'TUE', time: '17:30', instructor: 'Jess', location: 'Studio B', type: 'TONING', color: 'lime-accent' },
    { id: 4, name: 'Power Dance', day: 'WED', time: '18:00', instructor: 'Sarah', location: 'Studio A', type: 'ZUMBA', color: 'primary' },
    { id: 5, name: 'Strong Nation', day: 'WED', time: '19:30', instructor: 'Alex', location: 'Studio A', type: 'ZUMBA', color: 'white' },
    { id: 6, name: 'Aqua Rhythm', day: 'THU', time: '18:00', instructor: 'Mike', location: 'Pool 1', type: 'AQUA', color: 'cyan-accent' },
    { id: 7, name: 'Flash Friday', day: 'FRI', time: '17:00', instructor: 'Sarah', location: 'Studio A', type: 'ZUMBA', color: 'primary' },
    { id: 8, name: 'Morning Tone', day: 'SAT', time: '10:00', instructor: 'Jess', location: 'Studio B', type: 'TONING', color: 'lime-accent' },
];
const DEFAULT_LOCATIONS = [
    { id: 1, name: 'Studio A', address: '서울시 강남구 리듬로 123', capacity: 30, desc: '메인 댄스 스튜디오' },
    { id: 2, name: 'Studio B', address: '서울시 강남구 리듬로 123 B동', capacity: 20, desc: '토닝 전용 스튜디오' },
    { id: 3, name: 'Pool 1', address: '서울시 강남구 스플래시 웨이 456', capacity: 15, desc: '아쿠아 수업 전용 풀' },
];
const DEFAULT_SETTINGS = { siteName: 'ZumbaFlow', phone: '02-1234-5678', email: 'info@zumbaflow.com', insta: '@zumbaflow' };

function loadData(key, fallback) {
    const d = localStorage.getItem('zf_' + key);
    return d ? JSON.parse(d) : JSON.parse(JSON.stringify(fallback));
}

// 전역 데이터 로드
const instructors = loadData('instructors', DEFAULT_INSTRUCTORS);
const classes = loadData('classes', DEFAULT_CLASSES);
const locations = loadData('locations', DEFAULT_LOCATIONS);
const settings = loadData('settings', DEFAULT_SETTINGS);

// DOM 로드 후 실행
window.addEventListener('DOMContentLoaded', () => {
    // 공통: 사이트 설정 적용
    applySettings();

    // 페이지별 렌더링
    if (document.getElementById('weeklySchedule')) renderSchedule();
    if (document.getElementById('instructorList')) renderInstructors();
    if (document.getElementById('locationList')) renderLocations();
});

function applySettings() {
    // 로고/사이트명
    document.querySelectorAll('.site-name').forEach(el => el.textContent = settings.siteName);
    // 연락처 정보
    document.querySelectorAll('.contact-phone').forEach(el => el.textContent = settings.phone);
    document.querySelectorAll('.contact-email').forEach(el => el.textContent = settings.email);
    // 소셜 링크
    document.querySelectorAll('.social-insta').forEach(el => el.href = `https://instagram.com/${settings.insta.replace('@', '')}`);
}

function renderSchedule() {
    const container = document.getElementById('weeklySchedule');
    if (!container) return;

    // 요일 컬럼 생성
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    let html = '';

    days.forEach(day => {
        // 해당 요일의 수업 필터링
        const dayClasses = classes.filter(c => c.day === day).sort((a, b) => a.time.localeCompare(b.time));

        let classHtml = '';
        if (dayClasses.length === 0) {
            classHtml = `
            <div class="p-4 glass-card rounded-xl border-white/20 opacity-50 border-l-4 italic">
                <h4 class="font-bold text-lg text-slate-500">Rest Day</h4>
                <p class="text-sm text-slate-500">수업 없음</p>
            </div>`;
        } else {
            classHtml = dayClasses.map(c => `
            <div class="p-4 glass-card rounded-xl border-l-4 border-${c.color} hover:bg-white/5 transition-colors cursor-pointer group">
                <span class="text-xs font-bold text-${c.color}">${formatTime(c.time)}</span>
                <h4 class="font-bold text-lg mt-1 group-hover:text-${c.color} transition-colors">${c.name}</h4>
                <p class="text-sm text-slate-400">${c.location} • ${c.instructor}</p>
            </div>`).join('');
        }

        html += `
        <div class="space-y-4">
            <div class="bebas text-2xl text-slate-500 mb-6 text-center">${day}</div>
            ${classHtml}
        </div>`;
    });

    container.innerHTML = html;
}

function renderInstructors() {
    const container = document.getElementById('instructorList');
    if (!container) return;

    container.innerHTML = instructors.map(i => `
        <div class="glass-card p-8 rounded-xl text-center group hover:-translate-y-2 transition-transform">
            <div class="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary/20 mb-6 group-hover:border-primary transition-colors">
                 <img src="${i.img || 'https://via.placeholder.com/150'}" alt="${i.name}" class="w-full h-full object-cover">
            </div>
            <h3 class="bebas text-3xl mb-2 group-hover:text-primary transition-colors">${i.name}</h3>
            <p class="text-primary font-bold text-xs uppercase tracking-widest mb-4">${i.specialty}</p>
            <p class="text-slate-400 text-sm leading-relaxed">${i.bio}</p>
        </div>
    `).join('');
}

function renderLocations() {
    const container = document.getElementById('locationList');
    if (!container) return;

    container.innerHTML = locations.map(l => `
        <div class="flex items-start space-x-4 mb-6">
            <div class="bg-lime-accent p-2 rounded-lg text-background-dark">
                <span class="material-icons">location_on</span>
            </div>
            <div>
                <h4 class="font-bold text-xl">${l.name}</h4>
                <p class="text-slate-400">${l.address}</p>
                <p class="text-slate-500 text-xs mt-1">${l.desc}</p>
            </div>
        </div>
    `).join('');
}

function formatTime(timeStr) {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
}
