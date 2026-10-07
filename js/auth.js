const USERS_KEY = "KYIV_GTA_FORUM_USERS";
const CURRENT_KEY = "KYIV_GTA_FORUM_CURRENT";


function getUsers() {

    try {

        return JSON.parse(
            localStorage.getItem(USERS_KEY) || "[]"
        );

    } catch (error) {

        console.error(error);

        return [];

    }

}


function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}


function registerUser(event) {

    event.preventDefault();

    const username =
        document.getElementById("username")
        .value
        .trim();

    const email =
        document.getElementById("email")
        .value
        .trim();

    const password =
        document.getElementById("password")
        .value;

    const password2 =
        document.getElementById("password2")
        .value;

    const msg =
        document.getElementById("msg");


    msg.className = "";
    msg.textContent = "";


    if (!username || !email || !password || !password2) {

        msg.className = "error";
        msg.textContent =
            "Заповніть всі поля.";

        return;

    }


    if (username.length < 3) {

        msg.className = "error";
        msg.textContent =
            "Нікнейм повинен містити мінімум 3 символи.";

        return;

    }


    if (password.length < 4) {

        msg.className = "error";
        msg.textContent =
            "Пароль повинен містити мінімум 4 символи.";

        return;

    }


    if (password !== password2) {

        msg.className = "error";
        msg.textContent =
            "Паролі не співпадають.";

        return;

    }


    const users = getUsers();


    const usernameExists = users.some(
        user =>
            user.username.toLowerCase() ===
            username.toLowerCase()
    );


    if (usernameExists) {

        msg.className = "error";
        msg.textContent =
            "Такий нікнейм вже зайнятий.";

        return;

    }


    const emailExists = users.some(
        user =>
            user.email.toLowerCase() ===
            email.toLowerCase()
    );


    if (emailExists) {

        msg.className = "error";
        msg.textContent =
            "Цей Email вже використовується.";

        return;

    }


    const newUser = {

        id: Date.now().toString(),

        username: username,

        email: email,

        password: password,

        rank: "Користувач",

        status: "Гравець",

        registered: Date.now(),

        posts: 0

    };


    users.push(newUser);

    saveUsers(users);


    localStorage.setItem(
        CURRENT_KEY,
        username
    );


    msg.className = "";
    msg.textContent =
        "Акаунт успішно створено!";


    setTimeout(function () {

        window.location.href =
            "profile.html";

    }, 500);

}


function loginUser(event) {

    event.preventDefault();


    const login =
        document.getElementById("login")
        .value
        .trim();

    const password =
        document.getElementById("password")
        .value;

    const msg =
        document.getElementById("msg");


    const users = getUsers();


    const user = users.find(
        u =>

        (
            u.username.toLowerCase() ===
            login.toLowerCase()

            ||

            u.email.toLowerCase() ===
            login.toLowerCase()
        )

        &&

        u.password === password
    );


    if (!user) {

        msg.className = "error";

        msg.textContent =
            "Неправильний логін або пароль.";

        return;

    }


    localStorage.setItem(
        CURRENT_KEY,
        user.username
    );


    window.location.href =
        "profile.html";

}


function logoutUser() {

    localStorage.removeItem(
        CURRENT_KEY
    );

    window.location.href =
        "index.html";

}


function getCurrentUser() {

    const username =
        localStorage.getItem(
            CURRENT_KEY
        );


    if (!username) {

        return null;

    }


    return getUsers().find(
        user =>
            user.username === username
    );

}


function renderProfile() {

    const box =
        document.getElementById(
            "profile"
        );


    if (!box) return;


    const user =
        getCurrentUser();


    if (!user) {

        window.location.href =
            "login.html";

        return;

    }


    box.innerHTML = `

        <div class="profile-card">

            <div class="avatar">

                ${escapeHTML(
                    user.username
                        .charAt(0)
                        .toUpperCase()
                )}

            </div>

            <h1>

                ${escapeHTML(
                    user.username
                )}

            </h1>

            <div class="profile-status">

                ${escapeHTML(
                    user.status
                )}

            </div>

            <div class="profile-info">

                <p>
                    <b>Ранг:</b>
                    ${escapeHTML(user.rank)}
                </p>

                <p>
                    <b>Email:</b>
                    ${escapeHTML(user.email)}
                </p>

                <p>
                    <b>Реєстрація:</b>
                    ${new Date(user.registered)
                        .toLocaleDateString("uk-UA")}
                </p>

                <p>
                    <b>Повідомлень:</b>
                    ${user.posts || 0}
                </p>

            </div>

            <button
                class="action"
                onclick="logoutUser()">

                ВИЙТИ

            </button>

        </div>

    `;

}


function escapeHTML(value) {

    return String(value).replace(
        /[&<>"']/g,
        function (char) {

            return {

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            }[char];

        }
    );

}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        const registerForm =
            document.getElementById(
                "registerForm"
            );


        if (registerForm) {

            registerForm.addEventListener(
                "submit",
                registerUser
            );

        }


        const loginForm =
            document.getElementById(
                "loginForm"
            );


        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                loginUser
            );

        }


        renderProfile();

    }
);