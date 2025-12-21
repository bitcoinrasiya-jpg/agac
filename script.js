const tg = window.Telegram.WebApp;
tg.ready();

let balance = parseFloat(localStorage.getItem('h_balance')) || 0.0000;
let growth = parseInt(localStorage.getItem('h_growth')) || 0;
let level = parseInt(localStorage.getItem('h_level')) || 1;
let sessionAds = parseInt(localStorage.getItem('h_session_ads')) || 0;
let cooldownTime = localStorage.getItem('h_cooldown_end') || null;

const stages = ["🌱", "🌿", "☘️", "🌳", "🍎", "💰", "💎"];
const lvlConfig = { 1:{limit:200, reward:0.0002}, 7:{limit:999999, reward:0.15} }; // Nümunə

function showToast(msg) {
    const toast = document.getElementById('reward-toast');
    toast.innerText = msg; toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function startAd() {
    const btn = document.getElementById('water-btn');
    if (btn.disabled || cooldownTime) return;

    btn.disabled = true;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = "<span>Yüklənir...</span>";

    if (window.show_10180357) {
        window.show_10180357().then(() => {
            // Reklam açıldı - 16 saniyəlik ciddi sayğac başlayır
            startSecurityTimer(16, btn, originalHTML);
        }).catch(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        });
    } else {
        startSecurityTimer(3, btn, originalHTML); // Test üçün
    }
}

function startSecurityTimer(seconds, btn, originalHTML) {
    let timeLeft = seconds;
    const timerInt = setInterval(() => {
        btn.innerHTML = `<span>Gözləyin (${timeLeft}s)</span>`;
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(timerInt);
            handleReward();
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }
    }, 1000);

    // Əgər istifadəçi səhifəni yeniləsə, setInterval dayanacaq və handleReward çağırılmayacaq.
}

function handleReward() {
    const reward = (level === 7) ? 0.15 : 0.0002;
    balance += reward;
    growth += 1;
    sessionAds += 1;

    if (growth >= 200 && level < 7) { growth = 0; level++; }
    if (sessionAds >= 50) { cooldownTime = new Date().getTime() + (12*60*60*1000); sessionAds = 0; }

    save();
    updateUI();
    showToast(`+${reward} ₼ Balansınıza gəldi ✅`);
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
    document.getElementById('balance').innerText = balance.toFixed(4);
    document.getElementById('lvl-num').innerText = level;
    document.getElementById('main-tree').innerText = stages[level-1] || "🌱";
    document.getElementById('progress-bar').style.width = (growth/2) + "%";
    document.getElementById('growth-percent').innerText = `${growth} / 200 %`;
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
            let h = Math.floor(diff/3600000);
            let m = Math.floor((diff%3600000)/60000);
            let s = Math.floor((diff%60000)/1000);
            document.getElementById('timer-display').innerText = `${h}:${m}:${s}`;
            setTimeout(checkCooldown, 1000);
        } else {
            cooldownTime = null; btn.disabled = false; timerDiv.style.display = 'none';
            localStorage.removeItem('h_cooldown_end');
        }
    }
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
            img.src = user.photo_url; img.style.display = 'block';
            document.getElementById('default-avatar').style.display = 'none';
        }
    }
    updateUI();
};
