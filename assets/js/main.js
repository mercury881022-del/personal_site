// assets/js/main.js

// --- 1. 統一入口：當頁面載入完成後執行 ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 太空天氣系統啟動... 頁面路徑:", window.location.pathname);
    
    // 渲染導覽列
    renderNavbar();
    
    // 偵測：如果有影像監測容器，啟動影像邏輯
    if (document.getElementById('live-image')) {
        initImagingLogic();
    }
    
    // 偵測：如果有火箭清單容器，啟動火箭渲染
    if (document.getElementById('casc-mission-list')) {
        // 你可以選擇執行 renderCASCMissions() [用寫死的資料] 
        // 或是執行 fetchRocketData() [用 API 自動抓取]
        renderCASCMissions(); 
    }
});

// --- 2. 導覽列渲染功能 ---
function renderNavbar() {
    const navPlaceholder = document.getElementById('navbar-placeholder');
    if (!navPlaceholder) return;

    // 使用絕對路徑，確保 Vercel 上路徑不會出錯
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

// --- 3. 火箭資料渲染功能 (使用寫死資料) ---
const cascMissions = [
    { name: "長征八號 (Long March 8)", payload: "未知載荷", date: "2026-04-07", site: "文昌", status: "success" },
    { name: "長征六號改 (Long March 6A)", payload: "未知載荷", date: "2026-04-08", site: "太原", status: "upcoming" },
    { name: "神舟二十三號", payload: "載人飛船", date: "2026-06", site: "酒泉", status: "pending" },
    { name: "嫦娥七號", payload: "探測器", date: "2026", site: "文昌", status: "pending" }
];

function renderCASCMissions() {
    const list = document.getElementById('casc-mission-list');
    if (!list) return;

    list.innerHTML = cascMissions.map(m => `
        <div class="bg-[#0a1212] p-5 rounded-xl border ${m.status === 'upcoming' ? 'border-orange-500/50' : 'border-teal-900/40'} flex justify-between items-center mb-4">
            <div>
                <h3 class="font-bold text-white text-lg">${m.name}</h3>
                <p class="text-xs text-gray-400">載荷：${m.payload} | 地點：${m.site}</p>
            </div>
            <div class="text-right">
                <div class="text-sm font-mono text-gray-300 mb-2">${m.date}</div>
                ${getStatusBadge(m.status)}
            </div>
        </div>
    `).join('');
}

// --- 4. 自動抓取 API (進階預留) ---
async function fetchRocketData() {
    const list = document.getElementById('casc-mission-list');
    try {
        const response = await fetch('https://lldev.thespacedevs.com/2.2.0/launch/upcoming/?search=CASC');
        const data = await response.json();
        // 如果想切換成 API，這裡需要另外寫渲染 logic (renderUI)
        console.log("API 資料抓取成功", data);
    } catch (error) {
        console.error("抓取失敗:", error);
    }
}

// --- 5. 輔助功能：狀態標籤 ---
function getStatusBadge(status) {
    if (status === 'success') return '<span class="text-[10px] bg-teal-900/40 text-teal-300 border border-teal-500/30 px-2 py-1 rounded-full">發射成功</span>';
    if (status === 'upcoming') return '<span class="text-[10px] bg-orange-900/40 text-orange-300 border border-orange-500/30 px-2 py-1 rounded-full animate-pulse">即將發射</span>';
    return '<span class="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded-full">準備中</span>';
}

// --- 6. 影像更新邏輯 ---
function initImagingLogic() {
    const webAppUrl = "https://script.google.com/macros/s/AKfycbxHVefdwt1XABlPMrLags4BOAJop1UNZaVARvR5DnsSzbN9NiYmsusAufet3jEbwpPs/exec";
    const lulinBaseUrl = "https://www.lulin.ncu.edu.tw/static/weather/img/allsky.jpg";

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