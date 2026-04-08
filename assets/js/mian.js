// assets/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("📍 目前頁面路徑:", window.location.pathname);
    renderNavbar();
    
    // 偵測是否為影像觀測頁面
    if (document.getElementById('live-image')) {
        initImagingLogic();
    }
});

function renderNavbar() {
    const navPlaceholder = document.getElementById('navbar-placeholder');
    if (!navPlaceholder) {
        console.error("❌ 找不到 id='navbar-placeholder' 的標籤，請檢查 HTML！");
        return;
    }

    // --- 自動判定路徑邏輯 ---
    // 檢查網址裡是否包含 "/pages/"
    const isInsidePages = window.location.pathname.toLowerCase().includes('/pages/');
    
    // 如果在 pages 內，回首頁要 ../ ； 去分頁不用 prefix
    // 如果在根目錄，回首頁不用 prefix； 去分頁要 ./pages/
    const rootPath = isInsidePages ? '../index.html' : './index.html';
    const pagesPrefix = isInsidePages ? './' : './pages/';
    const logoImg = "https://public.readdy.ai/ai/img_res/f4897f5b-3554-4f1f-8862-12da2085430e.png";

    console.log(isInsidePages ? "📂 偵測到在 pages 資料夾內" : "🏠 偵測到在根目錄");

    navPlaceholder.innerHTML = `
    <nav class="fixed top-0 left-0 w-full z-50 bg-[#060a0d]/90 backdrop-blur-md border-b border-teal-900/40 px-6 py-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center text-white">
            <a href="${rootPath}" class="flex items-center gap-2">
                <img src="${logoImg}" class="w-8 h-8">
                <span class="font-bold tracking-tight text-sm md:text-base">Space Weather Lab</span>
            </a>
            <div class="flex gap-4 md:gap-6 text-xs md:text-sm text-gray-300">
                <a href="${rootPath}" class="hover:text-teal-400 transition">首頁</a>
                <a href="${pagesPrefix}imaging.html" class="hover:text-teal-400 transition">全天影像</a>
                <a href="${pagesPrefix}satellite.html" class="hover:text-teal-400 transition">衛星掩星</a>
                <a href="${pagesPrefix}gps.html" class="hover:text-teal-400 transition">GNSS</a>
                <a href="${pagesPrefix}rocket.html" class="hover:text-teal-400 transition">火箭資訊</a>
            </div>
        </div>
    </nav>`;
}

// 影像更新邏輯 (維持不變)
function initImagingLogic() {
    // ... 原本的影像更新代碼 ...
}