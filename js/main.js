// =========================
//   CONFIG
// =========================

const LOG = document.getElementById("history");
window.TERMINAL_CONFIG = window.TERMINAL_CONFIG || { color: "#00ff9c" };
window.TIPS = window.TIPS || ["Initializing..."];

// =====================================
//   DETECTION & AUTO-DEMO (HYBRIDE)
// =====================================

const isGmod = navigator.userAgent.includes("GMod") || navigator.userAgent.includes("Valve");

window.onload = () => {
    // Appliquer la couleur
    document.body.style.setProperty("--main-color", window.TERMINAL_CONFIG.color || "#00ff9c");

    // Musique
    if (window.MUSIC_LIST && window.MUSIC_LIST.length > 0) {
        currentTrack = chooseTrack();
        playTrack(currentTrack);
    }

    // Demo detection
    if (!isGmod) {
        console.log("%c[SYSTEM] Navigateur détecté : Lancement du mode Démo...", "color: #00ff9c; font-weight: bold;");
        runAdvancedSimulation();
    } else {
        console.log("%c[SYSTEM] GMOD détecté : En attente du serveur...", "color: #00ff9c; font-weight: bold;");
        addLog("> CONNECTION ESTABLISHED. AWAITING DATA...", "info");
    }
};

function runAdvancedSimulation() {
    setTimeout(() => {
        // 1. Simulation des détails du serveur
        if (window.GameDetails) {
            window.GameDetails(
                "SITE-19 : SECURE FACILITY", 
                "http://scp-foundation.net", 
                "rp_site19_v4", 
                64, 
                "STEAM_0:1:52839100", 
                "SCP-RP"
            );
        }

        // 2. Simulation des changements de statut progressifs
        const steps = [
            { t: 0,    s: "Handshaking with Foundation Node..." },
            { t: 4000, s: "Verifying Level 4 Clearance..." },
            { t: 8000, s: "Bypassing Local Firewall..." },
            { t: 12000,s: "Neural link established (C.A.S.S.I.E)" },
            { t: 16000,s: "Decrypting asset manifest..." }
        ];

        steps.forEach(step => {
            setTimeout(() => {
                if (window.SetStatusChanged) window.SetStatusChanged(step.s);
            }, step.t);
        });

        // 3. Simulation des fichiers (avec pics de vitesse)
        let total = 120;
        let current = 0;
        if (window.SetFilesTotal) window.SetFilesTotal(total);

        const fileInterval = setInterval(() => {
            current++;
            
            // Simulation d'une erreur JS à 30%
            if (current === 36) {
                window.onerror("MEM_CORRUPTION: SCP-079_INTRUSION_DETECTED", "kernel.dll", 79);
            }

            const files = ["models/scp/173.mdl", "sound/alarm_01.wav", "maps/graphs/rp_site19.jgh", "materials/scifi/wall_panel.vmt"];
            const randomFile = files[Math.floor(Math.random() * files.length)];
            
            if (window.DownloadingFile) window.DownloadingFile(randomFile);
            if (window.SetFilesNeeded) window.SetFilesNeeded(total - current);

            if (current >= total) {
                clearInterval(fileInterval);
                setTimeout(() => {
                    if (window.SetStatusChanged) window.SetStatusChanged("TERMINAL READY - WELCOME DOCTOR");
                    addLog("> ACCESS GRANTED. PRESS 'ANY KEY' TO START.", "status");
                }, 1000);
            }
        }, 120); // Vitesse de croisière

    }, 1500);
}

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


    div.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-msg"></span>`;
    div.querySelector(".log-msg").textContent = text;

    LOG.appendChild(div);
    LOG.scrollTop = LOG.scrollHeight;

    if (LOG.children.length > 50) {
        LOG.removeChild(LOG.firstChild);
    }
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
let tipIndex = 0;

function typeTip(text, i = 0) {
    tipText.textContent = "> " + text.substring(0, i);

    if (i < text.length) {
        setTimeout(() => typeTip(text, i + 1), 25);
    } else {
        setTimeout(() => eraseTip(text, text.length), 2500);
    }
}

function eraseTip(text, i) {
    tipText.textContent = "> " + text.substring(0, i);

    if (i > 0) {
        setTimeout(() => eraseTip(text, i - 1), 18);
    } else {
        tipIndex = (tipIndex + 1) % window.TIPS.length;
        setTimeout(() => typeTip(window.TIPS[tipIndex]), 400);
    }
}

if (window.TIPS && window.TIPS.length > 0) {
    setTimeout(() => typeTip(window.TIPS[0]), 2000);
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
    music.volume = Math.min(1.0, Math.max(0.0, window.MUSIC_VOLUME));
    music.play().catch(() => {
        musicEnabled = false;
    });

    updateMusicStatus();
}

// Mise à jour affichage
function updateMusicStatus() {
    const track = window.MUSIC_LIST[currentTrack];

    musicStatus.textContent = `[MUSIC: ${track ? track.name : ""} ]`;
}

// Auto suivante si lecture finit (si loop OFF dans config)
music.addEventListener("ended", () => {
    currentTrack = chooseTrack();
    playTrack(currentTrack);
});

// Lancement initial
if (window.MUSIC_LIST && window.MUSIC_LIST.length > 0) {
    currentTrack = chooseTrack();
    playTrack(currentTrack);
}