// assets/js/main.js

// --- 0. 全域變數：用來存放倒數定時器，確保不會重複執行 ---
let countdownTimer;

// --- 1. 統一入口 ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 太空天氣系統啟動... 頁面路徑:", window.location.pathname);
    
    renderNavbar();
    
    if (document.getElementById('live-image')) {
        initImagingLogic();
    }
    
    if (document.getElementById('casc-mission-list')) {
        renderCASCMissions(); 
    }
});

// --- 2. 導覽列渲染功能 ---
function renderNavbar() {
    const navPlaceholder = document.getElementById('navbar-placeholder');
    if (!navPlaceholder) return;

    const rootPath = "/index.html";
    const imagingPath = "/pages/imaging.html";
    const satellitePath = "/pages/satellite.html";
    const gpsPath = "/pages/gps.html";
    const rocketPath = "/pages/rocket.html";
    const logoImg = "https://public.readdy.ai/ai/img_res/f4897f5b-3554-4f1f-8862-12da2085430e.png";

    navPlaceholder.innerHTML = `
    <nav class="fixed top-0 left-0 w-full z-50 bg-[#060a0d]/90 backdrop-blur-md border-b border-teal-900/40 px-6 py-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center text-white">
            <a href="${rootPath}" class="flex items-center gap-2">
                <img src="${logoImg}" class="w-8 h-8">
                <span class="font-bold tracking-tight text-sm md:text-base">Space Weather Lab</span>
            </a>
            <div class="flex gap-4 md:gap-6 text-xs md:text-sm text-gray-300">
                <a href="${rootPath}" class="hover:text-teal-400 transition">首頁</a>
                <a href="${imagingPath}" class="hover:text-teal-400 transition">全天影像</a>
                <a href="${satellitePath}" class="hover:text-teal-400 transition">衛星掩星</a>
                <a href="${gpsPath}" class="hover:text-teal-400 transition">GNSS</a>
                <a href="${rocketPath}" class="hover:text-teal-400 transition">火箭資訊</a>
            </div>
        </div>
    </nav>`;
}

// --- 3. 火緊即時資料渲染功能 (對接 Google Sheet) ---
async function renderCASCMissions() {
    const list = document.getElementById('casc-mission-list');
    if (!list) return;

    const gasUrl = "https://script.google.com/macros/s/AKfycbyq7_x0XElHAgQxGQP7LEkVXtynkUbZYYsYiwSz8_z5MiLFEt_dCcwVst9OfKtEqcNi/exec";

    list.innerHTML = `<p class="text-teal-400 animate-pulse text-center py-10 font-mono">📡 正在同步 CASC 最新發射時程...</p>`;

    try {
        const response = await fetch(gasUrl);
        const data = await response.json();

        if (!data || data.length === 0) {
            list.innerHTML = "<p class='text-gray-500 text-center py-10'>目前暫無即將進行的任務。</p>";
            return;
        }

        // ✨ [新增]：如果有資料，啟動最上方的倒數計時器 (使用第一筆資料)
        setupCountdown(data[0]);

        list.innerHTML = data.map(m => {
            const isUpcoming = m['Time (時間)'].includes('Apr') || m['Time (時間)'].includes('May');
            
            return `
            <div class="bg-[#0a1212] p-5 rounded-xl border ${isUpcoming ? 'border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]' : 'border-teal-900/20'} flex justify-between items-center mb-4 hover:border-teal-400/50 transition-all group">
                <div>
                    <h3 class="font-bold text-white text-lg group-hover:text-teal-300 transition-colors">${m['Payload (載荷)']}</h3>
                    <p class="text-sm text-teal-500 font-mono mb-1">${m['Rocket (型號)']}</p>
                    <p class="text-xs text-gray-400">📍 ${m['Site (地點)']} | 🎯 ${m['Target (目標)']}</p>
                </div>
                <div class="text-right">
                    <div class="text-sm font-bold text-white mb-2">${m['Time (時間)']}</div>
                    ${getStatusBadge(m['Time (時間)'])}
                </div>
            </div>
            `;
        }).join('');

    } catch (error) {
        console.error("火箭資料抓取失敗:", error);
        list.innerHTML = "<p class='text-red-400 text-center py-10'>❌ 資料連線失敗，請檢查 API 部署狀態。</p>";
    }
}

// --- 4. 倒數計時核心功能 ---
function setupCountdown(mission) {
    const hero = document.getElementById('countdown-hero');
    if (!hero) return;
    
    // 填寫 Hero 區塊的文字資訊
    document.getElementById('hero-payload').innerText = mission['Payload (載荷)'];
    document.getElementById('hero-rocket').innerText = mission['Rocket (型號)'];
    document.getElementById('hero-site').innerText = "📍 " + mission['Site (地點)'];
    document.getElementById('hero-orbit').innerText = "🎯 " + mission['Target (目標)'];
    hero.classList.remove('hidden');

    // 解析日期：將 "9 Apr, 3:35am" 轉換為 JS 可讀格式
    const launchDateStr = mission['Time (時間)'].replace('GMT+8', '').trim() + ", 2026";
    const launchTime = new Date(launchDateStr).getTime();

    if (isNaN(launchTime)) {
        console.warn("⚠️ 日期解析失敗，請確認時間格式:", launchDateStr);
        return;
    }

    if (countdownTimer) clearInterval(countdownTimer);

    countdownTimer = setInterval(() => {
        const now = new Date().getTime();
        const distance = launchTime - now;

        if (distance < 0) {
            clearInterval(countdownTimer);
            document.getElementById('countdown-hero').innerHTML = `<p class="text-teal-400 text-center py-6 font-bold animate-pulse">🚀 MISSION IN PROGRESS / LIFT OFF SUCCESSFUL</p>`;
            return;
        }

        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        // 更新 HTML 上的數字
        if (document.getElementById('days')) document.getElementById('days').innerText = d.toString().padStart(2, '0');
        if (document.getElementById('hours')) document.getElementById('hours').innerText = h.toString().padStart(2, '0');
        if (document.getElementById('minutes')) document.getElementById('minutes').innerText = m.toString().padStart(2, '0');
        if (document.getElementById('seconds')) document.getElementById('seconds').innerText = s.toString().padStart(2, '0');
    }, 1000);
}

// --- 5. 輔助功能：狀態標籤 ---
function getStatusBadge(time) {
    if (time.includes('Success')) {
        return '<span class="text-[10px] bg-teal-900/40 text-teal-300 border border-teal-500/30 px-2 py-1 rounded-full">任務成功</span>';
    }
    if (time.includes('Apr') || time.includes('GMT+8') || time.includes('UTC')) {
        return '<span class="text-[10px] bg-orange-900/40 text-orange-300 border border-orange-500/30 px-2 py-1 rounded-full animate-pulse">即將發射</span>';
    }
    return '<span class="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded-full">排程中</span>';
}

// --- 6. 影像更新邏輯 ---
function initImagingLogic() {
    const webAppUrl = "https://script.google.com/macros/s/AKfycbxHVefdwt1XABlPMrLags4BOAJop1UNZaVARvR5DnsSzbN9NiYmsusAufet3jEbwpPs/exec";
    
    function updateLiveImage() {
        const img = document.getElementById('live-image');
        const status = document.getElementById('status-live');
        if (!img) return;
        fetch(webAppUrl + "?t=" + new Date().getTime())
            .then(res => res.text())
            .then(base64 => {
                if (!base64.startsWith("Error")) {
                    img.src = "data:image/jpeg;base64," + base64;
                    status.innerText = "最後同步時間: " + getNowTime();
                }
            });
    }

    function getNowTime() {
        const now = new Date();
        return now.getHours() + ":" + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ":" + (now.getSeconds() < 10 ? '0' : '') + now.getSeconds();
    }

    updateLiveImage();
    setInterval(updateLiveImage, 10000);
}