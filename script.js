const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// LOCALSTORAGE İLƏ MƏLUMATLARI BƏRPA ET
let balance = parseFloat(localStorage.getItem('h_balance')) || 0.0000;
let growth = parseInt(localStorage.getItem('h_growth')) || 0;
let level = parseInt(localStorage.getItem('h_level')) || 1;
let sessionAds = parseInt(localStorage.getItem('h_session_ads')) || 0;
let cooldownTime = localStorage.getItem('h_cooldown_end') || null;

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

function saveProgress() {
    localStorage.setItem('h_balance', balance);
    localStorage.setItem('h_growth', growth);
    localStorage.setItem('h_level', level);
    localStorage.setItem('h_session_ads', sessionAds);
    if (cooldownTime) localStorage.setItem('h_cooldown_end', cooldownTime);
    else localStorage.removeItem('h_cooldown_end');
}

function startAd() {
    const btn = document.getElementById('water-btn');
    if (btn.disabled || cooldownTime) return;

    if (window.show_10180357) {
        window.show_10180357().then(() => {
            handleReward();
        }).catch(() => {
            handleReward(); // SDK xətası olsa belə proses davam etsin
        });
    } else {
        handleReward(); // Test rejimi üçün
    }
}

function handleReward() {
    const config = lvlConfig[level];
    balance += config.reward;
    growth += 1;
    sessionAds += 1;

    if (growth >= config.limit && level < 7) {
        growth = 0;
        level++;
        evolveTree();
    }

    // 50 REKLAM LİMİTİ YOXLAMASI
    if (sessionAds >= 50) {
        let now = new Date().getTime();
        cooldownTime = now + (12 * 60 * 60 * 1000); // İndiki vaxt + 12 saat
        sessionAds = 0;
    }

    saveProgress();
    updateUI();
    tg.HapticFeedback.impactOccurred('light');
}

function updateUI() {
    const config = lvlConfig[level];
    document.getElementById('balance').innerText = balance.toFixed(4);
    document.getElementById('lvl-num').innerText = level;
    document.getElementById('main-tree').innerText = stages[level - 1];
    
    let fill = (growth / config.limit) * 100;
    document.getElementById('progress-bar').style.width = fill + "%";
    document.getElementById('growth-percent').innerText = `${growth} / ${config.limit} %`;

    checkTimer();
}

function checkTimer() {
    const btn = document.getElementById('water-btn');
    const timerDiv = document.getElementById('cooldown-timer');
    const timerDisplay = document.getElementById('timer-display');

    if (cooldownTime) {
        let now = new Date().getTime();
        let remaining = cooldownTime - now;

        if (remaining > 0) {
            btn.disabled = true;
            timerDiv.style.display = 'block';
            
            let h = Math.floor(remaining / (1000 * 60 * 60));
            let m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            let s = Math.floor((remaining % (1000 * 60)) / 1000);
            
            timerDisplay.innerText = `${h}s ${m}d ${s}s`;
            setTimeout(checkTimer, 1000);
        } else {
            cooldownTime = null;
            btn.disabled = false;
            timerDiv.style.display = 'none';
            saveProgress();
        }
    }
}

function evolveTree() {
    const tree = document.getElementById('main-tree');
    tree.style.transform = "scale(1.3)";
    setTimeout(() => tree.style.transform = "scale(1)", 500);
    tg.HapticFeedback.notificationOccurred('success');
}

function toggleInfo() {
    const overlay = document.getElementById('info-overlay');
    overlay.style.display = (overlay.style.display === 'flex') ? 'none' : 'flex';
}

function showPage(pageId, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId + '-section').classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    btn.classList.add('active');
}

window.onload = () => {
    const user = tg.initDataUnsafe?.user;
    if (user) {
        document.getElementById('user-full-name').innerText = user.first_name;
        if (user.photo_url) {
            const img = document.getElementById('user-photo');
            img.src = user.photo_url;
            img.style.display = 'block';
            document.getElementById('default-avatar').style.display = 'none';
        }
    }
    updateUI();
};
