document.addEventListener("DOMContentLoaded", function () {

    const current = JSON.parse(
        localStorage.getItem("KYIV_GTA_FORUM_CURRENT") || "null"
    );

    if (!current) return;

    const header = document.querySelector(".header");

    if (!header) return;

    const userBox = document.createElement("div");

    userBox.className = "user-box";

    userBox.innerHTML = `
        <button class="user-button" id="userButton">
            👤 ${current.username}
        </button>

        <div class="user-popup" id="userPopup">

            <div class="user-avatar">
                ${current.username.charAt(0).toUpperCase()}
            </div>

            <div class="user-name">
                ${current.username}
            </div>

            <div class="user-rank">
                ${current.role === "owner"
                    ? "👑 Власник"
                    : "👤 Користувач"}
            </div>

            <div class="user-info">
                <p>📧 ${current.email}</p>
                <p>📝 Повідомлень: ${current.messages || 0}</p>
                <p>🟢 Онлайн</p>
            </div>

            <div class="user-actions">

                <a href="profile.html">
                    Профіль
                </a>

                ${
                    current.role === "owner"
                    ? `<a href="admin.html">👑 Адмін-панель</a>`
                    : ""
                }

                <button onclick="logoutUserPopup()">
                    Вийти
                </button>

            </div>

        </div>
    `;

    header.appendChild(userBox);

    const button = document.getElementById("userButton");
    const popup = document.getElementById("userPopup");

    button.addEventListener("click", function (event) {
        event.stopPropagation();
        popup.classList.toggle("show");
    });

    document.addEventListener("click", function () {
        popup.classList.remove("show");
    });

    popup.addEventListener("click", function (event) {
        event.stopPropagation();
    });
});


function logoutUserPopup() {

    localStorage.removeItem("KYIV_GTA_FORUM_CURRENT");

    window.location.href = "index.html";
}
