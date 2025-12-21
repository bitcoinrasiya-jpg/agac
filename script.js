const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

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

function showToast(msg) {
    const toast = document.getElementById('reward-toast');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function startAd() {
    const btn = document.getElementById('water-btn');
    if (btn.disabled || cooldownTime) return;

    // 1. Düyməni dərhal kilitlə (Dublikat klikləri kəsir)
    btn.disabled = true;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = "<span>Reklam Yüklənir... Gözləyin</span>";

    if (window.show_10180357) {
        window.show_10180357().then(() => {
            // Reklam açıldıqdan sonra 16 saniyə sayırıq
            let timeLeft = 16;
            const timerInt = setInterval(() => {
                btn.innerHTML = `<span>Gözləyin (${timeLeft}s)</span>`;
                timeLeft--;
                
                if (timeLeft < 0) {
                    clearInterval(timerInt);
                    handleReward(); // 16 saniyə bitəndə mükafat ver
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                }
            }, 1000);
        }).catch(() => {
            // Reklam xətası olsa düyməni geri qaytar
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            alert("Reklam hazır deyil, bir az sonra yoxlayın.");
        });
    } else {
        // SDK yoxdursa test üçün 3 saniyə gözlət
        setTimeout(() => {
            handleReward();
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }, 3000);
    }
}

function handleReward() {
    const config = lvlConfig[level];
    
    // Balans və böyüməni əlavə et
    balance += config.reward;
    growth += 1;
    sessionAds += 1;

    // Səviyyə yoxlaması
    if (growth >= config.limit && level < 7) {
        growth = 0;
        level++;
        showToast("Səviyyə Artdı! 🚀");
    } else {
        showToast(`+${config.reward.toFixed(4)} ₼ Balansınıza gəldi ✅`);
    }

    // 50 reklam limiti
    if (sessionAds >= 50) {
        cooldownTime = new Date().getTime() + (12 * 60 * 60 * 1000);
        sessionAds = 0;
    }

    save();
    updateUI();
    tg.HapticFeedback.notificationOccurred('success');
}

function save() {
    localStorage.setItem('h_balance', balance);
    localStorage.setItem('h_growth', growth);
    localStorage.setItem('h_level', level);
    localStorage.setItem('h_session_ads', sessionAds);
    if (cooldownTime) localStorage.setItem('h_cooldown_end', cooldownTime);
}

function updateUI() {
    const config = lvlConfig[level];
    document.getElementById('balance').innerText = balance.toFixed(4);
    document.getElementById('lvl-num').innerText = level;
    document.getElementById('main-tree').innerText = stages[level - 1];
    
    let fill = (growth / config.limit) * 100;
    document.getElementById('progress-bar').style.width = fill + "%";
    document.getElementById('growth-percent').innerText = `${growth} / ${config.limit} %`;
    checkCooldown();
}

function checkCooldown() {
    const btn = document.getElementById('water-btn');
    const timerDiv = document.getElementById('cooldown-timer');
    if (cooldownTime) {
        let diff = cooldownTime - new Date().getTime();
        if (diff > 0) {
            btn.disabled = true;
            timerDiv.style.display = 'block';
            let h = Math.floor(diff / 3600000);
            let m = Math.floor((diff % 3600000) / 60000);
            let s = Math.floor((diff % 60000) / 1000);
            document.getElementById('timer-display').innerText = `${h}:${m}:${s}`;
            setTimeout(checkCooldown, 1000);
        } else {
            cooldownTime = null;
            btn.disabled = false;
            timerDiv.style.display = 'none';
            localStorage.removeItem('h_cooldown_end');
        }
    }
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
