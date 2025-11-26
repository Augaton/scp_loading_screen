// =========================
//   CONFIG
// =========================

const LOG = document.getElementById("history");

// =========================
//   LOG TERMINAL
// =========================

function addLog(text, type = "info") {
    if (!text) return;

    const div = document.createElement("div");
    div.className = "log-line log-" + type;

    const now = new Date();
    const time = now.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });


    div.innerHTML = `
        <span class="log-time">[${time}]</span>
        <span>${text}</span>
    `;

    LOG.appendChild(div);
    LOG.scrollTop = LOG.scrollHeight;
}

addLog("> BOOT: Initializing Secure Load Terminal…");


// ============================
//   EFFECT TYPING (OPTIMISÉ)
// ============================

// Anti-spam typing → Une seule animation à la fois par champ
const activeTypers = {};

function typeText(element, text, speed = 12) {
    const id = element.id;
    if (activeTypers[id]) clearTimeout(activeTypers[id]);

    element.textContent = "";
    let i = 0;

    function tick() {
        if (i < text.length) {
            element.textContent += text[i];
            i++;
            activeTypers[id] = setTimeout(tick, speed);
        }
    }
    tick();
}

function setTyped(id, text) {
    const el = document.getElementById(id);
    if (!el) return;
    typeText(el, text);
}


// ============================
//   GLITCH DYNAMIQUE HEADER
// ============================

let allowHeaderGlitch = true;

function randomGlitch() {
    if (!allowHeaderGlitch) return;

    const phrases = [
        "SCP FOUNDATION // SECURE LOAD TERMINAL",
        "ACCESSING NODE…",
        "LINK ESTABLISHED WITH CASSIE",
        "WARNING: REALITY INSTABILITY",
        "SCP-079 SIGNAL DETECTED",
        "SYSTEM HOOK: LEVEL-3 AUTH"
    ];

    const pick = phrases[Math.floor(Math.random() * phrases.length)];

    const header = document.querySelector(".header");
    if (!header) return;

    header.textContent = pick;
    header.setAttribute("data-text", pick);
}

setInterval(randomGlitch, 8000);


// ============================
//   CALLBACKS GMOD
// ============================

// GAME DETAILS
window.GameDetails = function(serverName, serverURL, mapName, maxPlayers, steamID, gamemode) {

    // typing pour les 3 champs uniquement (rarement appelés)
    setTyped("title", serverName || "UNKNOWN NODE");
    setTyped("map", mapName || "UNKNOWN_MAP");
    setTyped("steamid", steamID || "N/A");

    // empêcher glitch header pendant 1 seconde
    allowHeaderGlitch = false;
    setTimeout(() => allowHeaderGlitch = true, 1200);

    addLog("> INITIALIZING NODE: " + serverName);
    addLog("> MAP: " + mapName, "info");
    addLog("> STEAM ID: " + steamID, "info");
    addLog("> GAMEMODE: " + gamemode, "info");
};

// STATUS
window.SetStatusChanged = function(status) {
    // PAS de typing ici → stabilité
    document.getElementById("status").textContent = status;

    addLog("> STATUS: " + status, "status");
};


// ============================
//   PROGRESSION (OPTIMISÉE)
// ============================

let totalFiles = 0;
let lastPercent = -1;

window.SetFilesTotal = function(total) {
    totalFiles = total || 0;
    addLog("> FILES: " + totalFiles + " total.", "info");
};

window.SetFilesNeeded = function(needed) {
    if (totalFiles === 0) return;

    const done = totalFiles - needed;
    const p = Math.floor((done / totalFiles) * 100);

    // éviter spam de typing si même %
    if (p !== lastPercent) {
        setTyped("percent", p + "%");
        lastPercent = p;
    }

    addLog("> PROGRESS: " + p + "% (" + needed + " remaining)", "file");
};

// DOWNLOADING FILE NAME
window.DownloadingFile = function(fileName) {
    addLog("> DL: " + fileName, "dl");
};

// JS ERROR LOG
window.onerror = function(msg, src, line) {
    addLog("> JS ERROR: " + msg + " @ " + line, "error");
};

// =====================================
//      TIPS TYPING SUR CURSEUR
// =====================================

const tipText = document.getElementById("tip-text");
const cursor = document.getElementById("cursor");

let tipIndex2 = 0;

function typeTipSequence(text, i = 0) {
    if (i === 0) {
        tipText.textContent = "> ";
    }

    if (i < text.length) {
        tipText.textContent = "> " + text.substring(0, i + 1);
        setTimeout(() => typeTipSequence(text, i + 1), 25);
    } else {
        // Pause avant effacement
        setTimeout(() => eraseTipSequence(text), 2500);
    }
}

function eraseTipSequence(text, i = text.length) {
    if (i > 0) {
        tipText.textContent = "> " + text.substring(0, i - 1);
        setTimeout(() => eraseTipSequence(text, i - 1), 18);
    } else {
        // Passe au tip suivant
        tipIndex2 = (tipIndex2 + 1) % window.TIPS.length;
        setTimeout(() => typeTipSequence(window.TIPS[tipIndex2]), 400);
    }
}

// Démarrage automatique
if (window.TIPS && window.TIPS.length > 0) {
    setTimeout(() => typeTipSequence(window.TIPS[0]), 2000);
}

// =====================================
//       MULTI-MUSIC SYSTEM (SPACE)
// =====================================

const music = document.getElementById("music-player");
const musicStatus = document.getElementById("music-status");

let musicEnabled = true;
let currentTrack = 0;

// Sélection musique suivante
function chooseTrack() {
    if (window.MUSIC_RANDOM) {
        return Math.floor(Math.random() * window.MUSIC_LIST.length);
    } else {
        const t = currentTrack;
        currentTrack = (currentTrack + 1) % window.MUSIC_LIST.length;
        return t;
    }
}

// Lecture d'un morceau
function playTrack(index) {
    const track = window.MUSIC_LIST[index];
    if (!track) return;

    music.src = track.file;
    music.play().catch(() => {
        musicEnabled = false;
    });

    updateMusicStatus();
}

// Mise à jour affichage
function updateMusicStatus() {
    const track = window.MUSIC_LIST[currentTrack];

    if (!musicEnabled) {
        musicStatus.textContent = "[MUSIC: OFF]";
        return;
    }

    musicStatus.textContent = `[MUSIC: ON]  ${track ? track.name : ""}`;
}

// Toggle musique
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();

        if (musicEnabled) {
            music.pause();
            musicEnabled = false;
        } else {
            musicEnabled = true;
            music.play();
        }

        updateMusicStatus();
    }
});

// Auto suivante si lecture finit (si loop OFF dans config)
music.addEventListener("ended", () => {
    if (window.MUSIC_RANDOM === false) {
        currentTrack = (currentTrack + 1) % window.MUSIC_LIST.length;
    } else {
        currentTrack = chooseTrack();
    }
    playTrack(currentTrack);
});

// Lancement initial
if (window.MUSIC_LIST && window.MUSIC_LIST.length > 0) {
    currentTrack = chooseTrack();
    playTrack(currentTrack);
}

