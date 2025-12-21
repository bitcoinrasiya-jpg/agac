const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

let balance = 0.00;
let growth = 0;
let level = 1;
const stages = ["🌱", "🌿", "☘️", "🌳", "🍎", "💰", "💎"];

// Telegram Məlumatlarını Yüklə
window.onload = () => {
    const user = tg.initDataUnsafe?.user;
    if (user) {
        document.getElementById('user-full-name').innerText = `${user.first_name} ${user.last_name || ""}`.trim();
        if (user.photo_url) {
            const img = document.getElementById('user-photo');
            img.src = user.photo_url;
            img.style.display = 'block';
            document.getElementById('default-avatar').style.display = 'none';
        }
    }
    updateUI();
};

// Akkordeon funksiyası
function toggleAccordion() {
    const content = document.getElementById('acc-content');
    const icon = document.getElementById('acc-icon');
    content.classList.toggle('open');
    icon.style.transform = content.classList.contains('open') ? "rotate(180deg)" : "rotate(0deg)";
    tg.HapticFeedback.selectionChanged();
}

// Reklam İzləmə və Balans
function startAd() {
    const btn = document.querySelector('.action-btn');
    const loader = document.getElementById('loader');
    if (btn.disabled) return;
    
    btn.disabled = true;
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        loader.style.width = progress + "%";
        if (progress >= 100) clearInterval(interval);
    }, 100);

    setTimeout(() => {
        let reward = 0.05;
        if (level >= 3 && level < 5) reward = 0.10;
        else if (level >= 5 && level < 7) reward = 0.25;
        else if (level >= 7) reward = 0.50;

        balance += reward;
        growth += 25; 

        if (growth >= 100) {
            growth = 0;
            if(level < 7) { level++; evolveTree(); }
        }

        updateUI();
        btn.disabled = false;
        loader.style.width = "0%";
        tg.HapticFeedback.impactOccurred('medium');
    }, 2200);
}

function evolveTree() {
    const tree = document.getElementById('main-tree');
    tree.style.filter = "brightness(2) blur(5px)";
    setTimeout(() => {
        tree.innerText = stages[Math.min(level - 1, stages.length - 1)];
        tree.style.filter = "brightness(1) blur(0px)";
        tg.HapticFeedback.notificationOccurred('success');
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
