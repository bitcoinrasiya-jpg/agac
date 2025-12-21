<!DOCTYPE html>
<html lang="az">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Hypers Ads</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
<body>
    <div class="app-shell">
        <header class="main-header">
            <div class="user-profile">
                <img src="" id="user-photo" class="avatar" style="display:none;">
                <i class="fas fa-user-circle" id="default-avatar" style="font-size: 35px; color: var(--primary);"></i>
                <span id="user-full-name" class="username">Yüklənir...</span>
            </div>
            <div class="wallet-badge">
                <span id="balance">0.00</span> ₼
            </div>
        </header>

        <main class="content-area">
            <section id="home-section" class="page active">
                <div class="tree-card">
                    <div class="level-indicator">LVL <span id="lvl-num">1</span></div>
                    <div id="main-tree" class="tree-emoji">🌱</div>
                    <div class="progress-container">
                        <div class="progress-fill" id="progress-bar"></div>
                    </div>
                </div>

                <button class="action-btn" onclick="startAd()">
                    <span>Ağacı Sula</span>
                    <div class="btn-loader" id="loader"></div>
                </button>

                <button class="mini-info-btn" onclick="toggleInfo()">
                    <i class="fas fa-question-circle"></i> Necə qazanmaq olar?
                </button>

                <div id="info-overlay" class="info-overlay">
                    <div class="info-content">
                        <h3>Qazanc Sistemi</h3>
                        <p>Reklam izləyərək ağacınızı böyüdün. Səviyyə artdıqca gəliriniz də artacaq:</p>
                        <ul>
                            <li>LVL 1-2: 0.05 ₼</li>
                            <li>LVL 3-4: 0.10 ₼</li>
                            <li>LVL 5-6: 0.25 ₼</li>
                            <li>LVL 7: 0.50 ₼</li>
                        </ul>
                        <button class="close-btn" onclick="toggleInfo()">Bağla</button>
                    </div>
                </div>
            </section>

            <section id="tasks-section" class="page"></section>
            <section id="withdraw-section" class="page"></section>
        </main>

        <nav class="bottom-nav">
            <button class="nav-item active" onclick="showPage('home', this)">
                <i class="fas fa-home"></i>
                <span>Ana Səhifə</span>
            </button>
            <button class="nav-item" onclick="showPage('tasks', this)">
                <i class="fas fa-tasks"></i>
                <span>Tapşırıqlar</span>
            </button>
            <button class="nav-item" onclick="showPage('withdraw', this)">
                <i class="fas fa-wallet"></i>
                <span>Çıxarış</span>
            </button>
        </nav>
    </div>
    <script src="script.js"></script>
</body>
</html>
