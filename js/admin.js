const CURRENT_KEY = "KYIV_GTA_FORUM_CURRENT";

document.addEventListener("DOMContentLoaded", function () {

    const panel = document.getElementById("adminPanel");

    const user = JSON.parse(
        localStorage.getItem(CURRENT_KEY) || "null"
    );

    if (!user) {
        panel.innerHTML = `
            <div class="form-box">
                <h2>❌ Ви не увійшли</h2>
                <a href="login.html" class="main-btn">УВІЙТИ</a>
            </div>
        `;
        return;
    }

    if (user.role !== "owner") {
        panel.innerHTML = `
            <div class="form-box">
                <h2>⛔ Доступ заборонено</h2>
                <p>Адмін-панель доступна тільки власнику.</p>
            </div>
        `;
        return;
    }

    panel.innerHTML = `
        <div class="form-box">
            <h1>👑 АДМІН-ПАНЕЛЬ KYIV GTA</h1>

            <p>👤 Користувач: <b>${user.username}</b></p>
            <p>📧 Email: <b>${user.email}</b></p>
            <p>👑 Ранг: <b>Власник</b></p>

            <hr>

            <button class="action" onclick="users()">
                👥 КОРИСТУВАЧІ
            </button>

            <button class="action" onclick="topics()">
                📝 ТЕМИ
            </button>

            <button class="action" onclick="settings()">
                ⚙️ НАЛАШТУВАННЯ
            </button>

            <button class="action" onclick="logout()">
                🚪 ВИЙТИ
            </button>
        </div>
    `;
});

function users() {
    alert("👥 Розділ користувачів");
}

function topics() {
    alert("📝 Розділ тем");
}

function settings() {
    alert("⚙️ Налаштування форуму");
}

function logout() {
    localStorage.removeItem("KYIV_GTA_FORUM_CURRENT");
    window.location.href = "index.html";
}
