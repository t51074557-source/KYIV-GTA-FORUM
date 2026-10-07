const OWNER_EMAIL = "t51074557@gmail.com";
const USERS_KEY = "KYIV_GTA_FORUM_USERS";
const CURRENT_KEY = "KYIV_GTA_FORUM_CURRENT";

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function registerUser(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;
    const msg = document.getElementById("msg");

    if (password !== password2) {
        msg.textContent = "Паролі не співпадають!";
        return;
    }

    const users = getUsers();

    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        msg.textContent = "Такий користувач вже існує!";
        return;
    }

    const user = {
        username: username,
        email: email,
        password: password,
        role: "owner",
        registered: new Date().toLocaleString("uk-UA")
    };

    users.push(user);
    saveUsers(users);

    localStorage.setItem(CURRENT_KEY, JSON.stringify(user));

    msg.textContent = "Реєстрація успішна! Ти власник форуму.";

    setTimeout(() => {
        window.location.href = "profile.html";
    }, 1000);
}

function loginUser(event) {
    event.preventDefault();

    const login = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value;
    const msg = document.getElementById("msg");

    const users = getUsers();

    const user = users.find(u =>
        (u.username.toLowerCase() === login.toLowerCase() ||
         u.email.toLowerCase() === login.toLowerCase()) &&
        u.password === password
    );

    if (!user) {
        msg.textContent = "Неправильний логін або пароль!";
        return;
    }

    localStorage.setItem(CURRENT_KEY, JSON.stringify(user));

    window.location.href = "profile.html";
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(CURRENT_KEY) || "null");
}

function logoutUser() {
    localStorage.removeItem(CURRENT_KEY);
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    if (registerForm) {
        registerForm.addEventListener("submit", registerUser);
    }

    if (loginForm) {
        loginForm.addEventListener("submit", loginUser);
    }
});