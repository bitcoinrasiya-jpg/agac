// Telegram WebApp SDK başlatma
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

let balance = 0.00;
let growth = 0;
let level = 1;

// Ağaç Evrim Aşamaları
const stages = ["🌱", "🌿", "☘️", "🌳", "🍎", "💰", "💎"];

// Telegram Kullanıcı Bilgilerini Al
function initUser() {
    const user = tg.initDataUnsafe?.user;
    if (user) {
        const name = `${user.first_name} ${user.last_name || ""}`.trim();
        document.getElementById('user-full-name').innerText = name;
        
        if (user.photo_url) {
            const img = document.getElementById('user-photo');
            img.src = user.photo_url;
            img.style.display = 'block';
            document.getElementById('default-avatar').style.display = 'none';
        }
    } else {
        document.getElementById('user-full-name').innerText = "Test Kullanıcısı";
    }
}

// Reklam ve Sulama Fonksiyonu
function startAd() {
    const btn = document.querySelector('.action-btn');
    const loader = document.getElementById('loader');
    const tree = document.getElementById('main-tree');

    if (btn.disabled) return;

    btn.disabled = true;
    btn.style.opacity = "0.7";
    loader.style.width = "0%";
    
    // Reklam süresi (2 saniye simülasyon)
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        loader.style.width = progress + "%";
        if (progress >= 100) clearInterval(interval);
    }, 100);

    setTimeout(() => {
        balance += 0.05;
        growth += 25; // 4 sula = 1 seviye

        if (growth >= 100) {
            growth = 0;
            level++;
            evolveTree();
        }

        updateUI();
        btn.disabled = false;
        btn.style.opacity = "1";
        loader.style.width = "0%";
        
        // Telegram Titreşim Efekti
        tg.HapticFeedback.impactOccurred('medium');
        
        // Animasyon
        tree.style.transform = "scale(1.3) rotate(5deg)";
        setTimeout(() => tree.style.transform = "scale(1) rotate(0deg)", 300);
    }, 2200);
}

function evolveTree() {
    const tree = document.getElementById('main-tree');
    tg.HapticFeedback.notificationOccurred('success');
    
    tree.style.filter = "brightness(2) blur(5px)";
    setTimeout(() => {
        const stageIdx = Math.min(level - 1, stages.length - 1);
        tree.innerText = stages[stageIdx];
        tree.style.filter = "brightness(1) blur(0px)";
    }, 400);
}

function updateUI() {
    document.getElementById('balance').innerText = balance.toFixed(2);
    document.getElementById('withdraw-bal').innerText = balance.toFixed(2);
    document.getElementById('lvl-num').innerText = level;
    document.getElementById('progress-bar').style.width = growth + "%";
    document.getElementById('growth-percent').innerText = growth + "%";
}

function showPage(pageId, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId + '-section').classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    btn.classList.add('active');
    
    tg.HapticFeedback.selectionChanged();
}

// Başlangıçta çalıştır
window.onload = () => {
    initUser();
    updateUI();
};
