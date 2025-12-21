let balance = 0.00;
let growth = 0;
let level = 1;

// Təkamül Mərhələləri
const stages = [
    "🌱", // Lvl 1: Toxum
    "🌿", // Lvl 2: Cücərti
    "☘️", // Lvl 3: Balaca kol
    "🌳", // Lvl 4: Böyük ağac
    "🍎", // Lvl 5: Meyvəli ağac
    "💰", // Lvl 6: Pul ağacı
    "💎"  // Lvl 7: Brilliant ağac
];

function startAd() {
    const btn = document.querySelector('.action-btn');
    const loader = document.getElementById('loader');
    const tree = document.getElementById('main-tree');

    if (btn.disabled) return;

    // Reklam effekti başlayır
    btn.disabled = true;
    loader.style.width = "0%";
    loader.style.transition = "width 2s linear";
    
    setTimeout(() => loader.style.width = "100%", 50);

    setTimeout(() => {
        // Qazanc və İnkişaf
        balance += 0.05;
        growth += 25; // Hər 4 reklamda 1 səviyyə artır

        if (growth >= 100) {
            growth = 0;
            level++;
            triggerEvolution();
        }

        updateUI();
        
        // Düyməni sıfırla
        btn.disabled = false;
        loader.style.transition = "none";
        loader.style.width = "0%";
        
        // Balaca atlanma effekti
        tree.style.transform = "scale(1.2)";
        setTimeout(() => tree.style.transform = "scale(1)", 200);

    }, 2000);
}

function triggerEvolution() {
    const tree = document.getElementById('main-tree');
    tree.style.filter = "brightness(2) blur(5px)";
    
    setTimeout(() => {
        const stageIdx = Math.min(level - 1, stages.length - 1);
        tree.innerText = stages[stageIdx];
        tree.style.filter = "brightness(1) blur(0px)";
        
        // Telegram vibrasiyası (əgər varsa)
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
    }, 400);
}

function updateUI() {
    document.getElementById('balance').innerText = balance.toFixed(2);
    document.getElementById('withdraw-bal').innerText = balance.toFixed(2);
    document.getElementById('lvl-num').innerText = level;
    document.getElementById('progress-bar').style.width = growth + "%";
    document.getElementById('growth-percent').innerText = growth + "%";
}

function showPage(pageId, element) {
    // Səhifələri gizlə/göstər
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId + '-section').classList.add('active');

    // Menyu düymələrini yenilə
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    element.classList.add('active');
}

// İlkin başlatma
window.onload = () => {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.ready();
    }
};
