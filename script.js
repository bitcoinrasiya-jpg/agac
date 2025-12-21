const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

let balance = 0.0000;
let growth = 0;
let level = 1;

// Riyazi Parametrlər
const lvlConfig = {
    1: { limit: 200, reward: 0.0002 },
    2: { limit: 300, reward: 0.0005 },
    3: { limit: 400, reward: 0.0010 },
    4: { limit: 500, reward: 0.0050 },
    5: { limit: 700, reward: 0.0100 },
    6: { limit: 1000, reward: 0.0500 },
    7: { limit: 999999, reward: 0.1500 }
};

const stages = ["🌱", "🌿", "☘️", "🌳", "🍎", "💰", "💎"];

function startAd() {
    const btn = document.querySelector('.action-btn');
    if (btn.disabled) return;

    // SDK Funksiyasını yoxla
    if (window.show_10180357) {
        btn.disabled = true;
        window.show_10180357()
            .then(() => {
                handleReward();
            })
            .catch((err) => {
                console.error("SDK Error:", err);
                btn.disabled = false;
                alert("Reklam hazır deyil. Bir az sonra yoxlayın.");
            });
    } else {
        alert("Reklam yüklənə bilmədi. İnternet bağlantınızı və ya AdBlocker-i yoxlayın.");
        // Test üçün aşağıdakı sətri aça bilərsən:
        // handleReward();
    }
}

function handleReward() {
    const loader = document.getElementById('loader');
    const btn = document.querySelector('.action-btn');
    
    let anim = 0;
    const interval = setInterval(() => {
        anim += 10;
        loader.style.width = anim + "%";
        if (anim >= 100) clearInterval(interval);
    }, 100);

    setTimeout(() => {
        const config = lvlConfig[level];
        balance += config.reward;
        growth += 1; // 1 reklam = 1%

        if (growth >= config.limit && level < 7) {
            growth = 0;
            level++;
            evolveTree();
        }

        updateUI();
        btn.disabled = false;
        loader.style.width = "0%";
        tg.HapticFeedback.impactOccurred('light');
    }, 1200);
}

function updateUI() {
    const config = lvlConfig[level];
    document.getElementById('balance').innerText = balance.toFixed(4);
    document.getElementById('lvl-num').innerText = level;
    
    let fill = (growth / config.limit) * 100;
    document.getElementById('progress-bar').style.width = fill + "%";
    document.getElementById('growth-percent').innerText = `${growth} / ${config.limit} %`;
}

function evolveTree() {
    const tree = document.getElementById('main-tree');
    tree.innerText = stages[Math.min(level - 1, stages.length - 1)];
    tg.HapticFeedback.notificationOccurred('success');
}

function toggleInfo() {
    const overlay = document.getElementById('info-overlay');
    overlay.style.display = (overlay.style.display === 'flex') ? 'none' : 'flex';
}

function showPage(pageId, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId + '-section');
    if(target) target.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    btn.classList.add('active');
}

window.onload = () => {
    const user = tg.initDataUnsafe?.user;
    if (user) document.getElementById('user-full-name').innerText = user.first_name;
    updateUI();
};
