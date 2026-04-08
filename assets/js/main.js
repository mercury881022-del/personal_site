// assets/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("📍 目前頁面路徑:", window.location.pathname);
    renderNavbar();
    
    if (document.getElementById('live-image')) {
        initImagingLogic();
    }
});

function renderNavbar() {
    const navPlaceholder = document.getElementById('navbar-placeholder');
    if (!navPlaceholder) return;

    // 判斷是否在 pages 資料夾內（不論是本地還是 Vercel）
    const isInsidePages = window.location.pathname.toLowerCase().includes('/pages/');
    
    // 使用「絕對路徑」(/ 開頭)，這樣不論你在哪一層，連結都不會連錯
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

// assets/js/main.js 內容更新

const cascMissions = [
    {
        name: "長征八號 (Long March 8)",
        payload: "未知載荷 (Unknown Payload)",
        date: "2026-04-07",
        site: "文昌航天發射場",
        status: "success", // 剛完成
        type: "應用發射"
    },
    {
        name: "長征六號改 (Long March 6A)",
        payload: "未知載荷 (Unknown Payload)",
        date: "2026-04-08",
        site: "太原衛星發射中心",
        status: "upcoming", // 即將進行
        type: "應用發射"
    },
    {
        name: "長征二號 F/G (Shenzhou 23)",
        payload: "神舟二十三號載人飛船",
        date: "2026-06 (預計)",
        site: "酒泉衛星發射中心",
        status: "pending",
        type: "載人任務"
    },
    {
        name: "長征五號 (Chang'e 7)",
        payload: "嫦娥七號探測器",
        date: "2026 (年度重點)",
        site: "文昌航天發射場",
        status: "pending",
        type: "深空探測"
    }
];

// 在 DOMContentLoaded 裡調用渲染
document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    if (document.getElementById('casc-mission-list')) {
        renderCASCMissions();
    }
});

// assets/js/main.js 

async function fetchRocketData() {
    const list = document.getElementById('casc-mission-list');
    
    try {
        // 呼叫國際公用的發射資料 API (範例：The Space Devs)
        // 這裡設定搜尋：CASC (中國航天科技集團)
        const response = await fetch('https://lldev.thespacedevs.com/2.2.0/launch/upcoming/?search=CASC');
        const data = await response.json();
        
        const missions = data.results.map(m => ({
            name: m.name,
            payload: m.mission ? m.mission.name : "未知酬載",
            date: new Date(m.net).toLocaleDateString(),
            site: m.pad.location.name,
            status: "upcoming"
        }));

        renderUI(missions); // 把抓到的資料餵給你的畫頁面
    } catch (error) {
        console.error("抓取失敗:", error);
        list.innerHTML = "<p class='text-red-400'>無法即時更新，請檢查網路連線。</p>";
    }
}

function getStatusBadge(status) {
    if (status === 'success') return '<span class="text-[10px] bg-teal-900/40 text-teal-300 border border-teal-500/30 px-2 py-1 rounded-full">發射成功</span>';
    if (status === 'upcoming') return '<span class="text-[10px] bg-orange-900/40 text-orange-300 border border-orange-500/30 px-2 py-1 rounded-full animate-pulse">即將發射</span>';
    return '<span class="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded-full">準備中</span>';
}
// 影像更新邏輯 (維持不變)
function initImagingLogic() {
    // ... 原本的影像更新代碼 ...
}