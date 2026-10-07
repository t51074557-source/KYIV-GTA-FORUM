const TOPICS_KEY = "KYIV_GTA_FORUM_TOPICS";

const cats = [
    "Новини KYIV GTA",
    "Правила проекту",
    "Адміністрація",
    "Фракції",
    "Загальний чат",
    "Пропозиції",
    "Скарги",
    "Заявки",
    "Баги та помилки",
    "Допомога по грі"
];

function topics() {
    return JSON.parse(localStorage.getItem(TOPICS_KEY) || "[]");
}

function saveTopics(t) {
    localStorage.setItem(TOPICS_KEY, JSON.stringify(t));
}

function renderForum() {
    const box = document.getElementById("categories");

    if (!box) return;

    const p = new URLSearchParams(location.search);
    const cat = p.get("category");

    if (cat) {
        return renderCategory(cat);
    }

    const t = topics();

    box.innerHTML = cats.map(c => {

        const n = t.filter(x => x.category === c).length;

        return `
            <a class="category"
               href="index.html?category=${encodeURIComponent(c)}">

                <div>
                    <h3>${esc(c)}</h3>
                    <p>Перегляд тем розділу</p>
                </div>

                <div class="count">
                    ${n} тем
                </div>

            </a>
        `;

    }).join("");
}


function renderCategory(cat) {

    const main = document.getElementById("categories");

    const arr = topics()
        .filter(x => x.category === cat)
        .sort((a, b) => b.created - a.created);

    main.innerHTML = `

        <a href="index.html">
            ← Всі розділи
        </a>

        <h2 style="margin-top:25px">
            ${esc(cat)}
        </h2>

        <div class="topic-list">

            ${
                arr.length

                ?

                arr.map(t => `

                    <a class="topic-card"
                       href="topic.html?id=${t.id}">

                        <div>

                            <h2>
                                ${esc(t.title)}
                            </h2>

                            <p>
                                ${esc(t.text.slice(0, 120))}
                            </p>

                        </div>

                        <div class="meta">

                            ${esc(t.author)}

                            <br>

                            ${new Date(t.created)
                                .toLocaleDateString("uk-UA")}

                        </div>

                    </a>

                `).join("")

                :

                `<div class="empty">
                    У цьому розділі ще немає тем.
                </div>`
            }

        </div>
    `;
}


function createTopic() {

    const u = localStorage.getItem(
        "KYIV_GTA_FORUM_CURRENT"
    );

    if (!u) {
        location.href = "login.html";
        return;
    }

    const category =
        document.getElementById("category").value;

    const title =
        document.getElementById("title").value.trim();

    const text =
        document.getElementById("text").value.trim();

    if (!title || !text) {

        const m = document.getElementById("msg");

        m.className = "error";

        m.textContent =
            "Заповніть назву та текст.";

        return;
    }

    const t = topics();

    const id = Date.now().toString();

    t.push({
        id,
        category,
        title,
        text,
        author: u,
        created: Date.now(),
        replies: []
    });

    saveTopics(t);

    location.href =
        "topic.html?id=" + id;
}


function renderTopic() {

    const box =
        document.getElementById("topic");

    if (!box) return;

    const id =
        new URLSearchParams(location.search)
        .get("id");

    const t =
        topics().find(x => x.id === id);

    if (!t) {

        box.innerHTML = `
            <div class="empty">
                Тему не знайдено.
            </div>
        `;

        return;
    }

    let h = `

        <p>

            <a href="index.html?category=${encodeURIComponent(t.category)}">

                ← ${esc(t.category)}

            </a>

        </p>

        <h1>
            ${esc(t.title)}
        </h1>

        <div class="post">

            <div class="post-head">

                <span>
                    ${esc(t.author)}
                </span>

                <span>
                    ${new Date(t.created)
                        .toLocaleString("uk-UA")}
                </span>

            </div>

            <div class="post-body">

                ${esc(t.text)}

            </div>

        </div>
    `;


    h += (t.replies || [])
        .map(r => `

            <div class="post">

                <div class="post-head">

                    <span>
                        ${esc(r.author)}
                    </span>

                    <span>
                        ${new Date(r.created)
                            .toLocaleString("uk-UA")}
                    </span>

                </div>

                <div class="post-body">

                    ${esc(r.text)}

                </div>

            </div>

        `)
        .join("");


    h += `

        <div class="form-box wide">

            <h2>
                Відповісти
            </h2>

            <textarea
                id="reply"
                placeholder="Ваше повідомлення">
            </textarea>

            <button
                class="action"
                onclick="replyTopic()">

                ВІДПОВІСТИ

            </button>

        </div>
    `;


    box.innerHTML = h;

    window.topicId = id;
}


function replyTopic() {

    const u =
        localStorage.getItem(
            "KYIV_GTA_FORUM_CURRENT"
        );

    if (!u) {

        location.href = "login.html";

        return;
    }

    const e =
        document.getElementById("reply");

    const text =
        e.value.trim();

    if (!text) return;

    const t = topics();

    const x =
        t.find(x => x.id === window.topicId);

    if (!x) return;

    x.replies = x.replies || [];

    x.replies.push({
        author: u,
        text,
        created: Date.now()
    });

    saveTopics(t);

    renderTopic();
}


function esc(s) {

    return String(s).replace(
        /[&<>"']/g,
        m => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[m])
    );
}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderForum();
        renderTopic();

    }
);