// assets/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    
    // 如果是影像頁面，啟動影像更新邏輯
    if (document.getElementById('live-image')) {
        initImagingLogic();
    }
});

function renderNavbar() {
    const navPlaceholder = document.getElementById('navbar-placeholder');
    if (!navPlaceholder) return;

    // 判斷目前是否在根目錄 (index.html)
    const isRoot = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.split('/').pop() === '';
    
    // 設定相對路徑
    const pathPrefix = isRoot ? './pages/' : './';
    const rootPath = isRoot ? './index.html' : '../index.html';

    navPlaceholder.innerHTML = `
    <nav class="fixed top-0 left-0 w-full z-50 bg-[#060a0d]/90 backdrop-blur-md border-b border-teal-900/40 px-6 py-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <a href="${rootPath}" class="flex items-center gap-2">
                <img src="https://public.readdy.ai/ai/img_res/f4897f5b-3554-4f1f-8862-12da2085430e.png" class="w-8 h-8">
                <span class="font-bold tracking-tight text-sm md:text-base">Space Weather Lab</span>
            </a>
            <div class="flex gap-4 md:gap-6 text-xs md:text-sm text-gray-300">
                <a href="${rootPath}" class="hover:text-teal-400 transition">首頁</a>
                <a href="${pathPrefix}imaging.html" class="hover:text-teal-400 transition">全天影像</a>
                <a href="${pathPrefix}satellite.html" class="hover:text-teal-400 transition">衛星掩星</a>
                <a href="${pathPrefix}gps.html" class="hover:text-teal-400 transition">GNSS</a>
                <a href="${pathPrefix}rocket.html" class="hover:text-teal-400 transition">火箭資訊</a>
            </div>
        </div>
    </nav>`;
}

// 影像監測邏輯 (原本在 imaging.html 裡的 script)
function initImagingLogic() {
    const webAppUrl = "https://script.google.com/macros/s/AKfycbxHVefdwt1XABlPMrLags4BOAJop1UNZaVARvR5DnsSzbN9NiYmsusAufet3jEbwpPs/exec";
    const lulinBaseUrl = "https://www.lulin.ncu.edu.tw/static/weather/img/allsky.jpg";

    function updateLiveImage() {
        const imgElement = document.getElementById('live-image');
        const statusElement = document.getElementById('status-live');
        fetch(webAppUrl + "?t=" + new Date().getTime())
            .then(res => res.text())
            .then(base64 => {
                if (!base64.startsWith("Error")) {
                    imgElement.src = "data:image/jpeg;base64," + base64;
                    statusElement.innerText = "最後同步時間: " + getNowTime();
                    statusElement.style.color = "#2ecc71";
                }
            }).catch(() => { statusElement.innerText = "連線失敗"; });
    }

    function refreshLulinImage() {
        const img = document.getElementById('lulin-allsky');
        const status = document.getElementById('status-lulin');
        img.src = lulinBaseUrl + "?t=" + new Date().getTime();
        status.innerText = "最後同步時間: " + getNowTime();
        status.style.color = "#2ecc71";
    }

    function getNowTime() {
        const now = new Date();
        return now.getHours() + ":" + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ":" + (now.getSeconds() < 10 ? '0' : '') + now.getSeconds();
    }

    updateLiveImage();
    refreshLulinImage();
    setInterval(updateLiveImage, 10000);
    setInterval(refreshLulinImage, 30000);
}