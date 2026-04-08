// assets/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 太空天氣系統啟動...");
    renderNavbar();
    
    // 自動偵測：如果頁面上有 live-image 這個 ID，就啟動影像更新功能
    if (document.getElementById('live-image')) {
        console.log("📸 偵測到影像頁面，開啟監測邏輯...");
        initImagingLogic();
    }
});

function renderNavbar() {
    const navPlaceholder = document.getElementById('navbar-placeholder');
    if (!navPlaceholder) {
        console.error("❌ 找不到 navbar-placeholder 容器");
        return;
    }

    // 關鍵判斷：檢查目前的網址路徑
    // 如果路徑包含 /pages/，代表在分頁；否則視為在根目錄
    const isInsidePages = window.location.pathname.includes('/pages/');
    
    // 設定路徑前綴
    const pathPrefix = isInsidePages ? './' : './pages/';
    const rootPath = isInsidePages ? '../index.html' : './index.html';
    const logoImg = "https://public.readdy.ai/ai/img_res/f4897f5b-3554-4f1f-8862-12da2085430e.png";

    navPlaceholder.innerHTML = `
    <nav class="fixed top-0 left-0 w-full z-50 bg-[#060a0d]/90 backdrop-blur-md border-b border-teal-900/40 px-6 py-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <a href="${rootPath}" class="flex items-center gap-2">
                <img src="${logoImg}" class="w-8 h-8">
                <span class="font-bold tracking-tight text-sm md:text-base text-white">Space Weather Lab</span>
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

// 影像監測邏輯
function initImagingLogic() {
    const webAppUrl = "https://script.google.com/macros/s/AKfycbxHVefdwt1XABlPMrLags4BOAJop1UNZaVARvR5DnsSzbN9NiYmsusAufet3jEbwpPs/exec";
    const lulinBaseUrl = "https://www.lulin.ncu.edu.tw/static/weather/img/allsky.jpg";

    function updateLiveImage() {
        const imgElement = document.getElementById('live-image');
        const statusElement = document.getElementById('status-live');
        if (!imgElement) return;

        fetch(webAppUrl + "?t=" + new Date().getTime())
            .then(res => res.text())
            .then(base64 => {
                if (!base64.startsWith("Error")) {
                    imgElement.src = "data:image/jpeg;base64," + base64;
                    statusElement.innerText = "最後同步時間: " + getNowTime();
                    statusElement.style.color = "#2ecc71";
                }
            }).catch(() => { if(statusElement) statusElement.innerText = "連線失敗"; });
    }

    function refreshLulinImage() {
        const img = document.getElementById('lulin-allsky');
        const status = document.getElementById('status-lulin');
        if (!img) return;
        img.src = lulinBaseUrl + "?t=" + new Date().getTime();
        if (status) {
            status.innerText = "最後同步時間: " + getNowTime();
            status.style.color = "#2ecc71";
        }
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