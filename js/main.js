// ============================================
//   TERMINAL SCP - SCRIPT PRINCIPAL
//   VERSION OPTIMISÉE POUR GARRY'S MOD
// ============================================

// =========================
//   CONFIGURATION
// =========================
const LOG = document.getElementById("history");
window.TERMINAL_CONFIG = window.TERMINAL_CONFIG || { 
    color: "#00ff9c",
    maxLines: 60, // Optimisé pour GMod
    typingSpeed: 40,
    glitchInterval: 8000
};
window.TIPS = window.TIPS || ["Initialisation..."];
window.MUSIC_LIST = window.MUSIC_LIST || [];
window.MUSIC_RANDOM = window.MUSIC_RANDOM !== undefined ? window.MUSIC_RANDOM : true;
window.MUSIC_VOLUME = window.MUSIC_VOLUME || 0.15;

// =========================
//   ÉTAT GLOBAL
// =========================
const state = {
    totalFiles: 0,
    lastPercent: -1,
    tipIndex: 0,
    currentTrack: 0,
    musicEnabled: true,
    activeTypers: {},
    allowHeaderGlitch: true,
    filesProcessed: 0,
    lastLoggedPercent: -1
};

// =========================
//   ÉLÉMENTS DU DOM
// =========================
const elements = {
    log: document.getElementById("history"),
    status: document.getElementById("status"),
    percent: document.getElementById("percent"),
    title: document.getElementById("title"),
    map: document.getElementById("map"),
    steamid: document.getElementById("steamid"),
    tipText: document.getElementById("tip-text"),
    music: document.getElementById("music-player"),
    musicStatus: document.getElementById("music-status"),
    header: document.querySelector(".header")
};

// =========================
//   DÉTECTION GMOD
// =========================
const isGmod = navigator.userAgent.includes("GMod") || navigator.userAgent.includes("Valve");

// =====================================
//   INITIALISATION
// =====================================
window.onload = () => {
    // Appliquer la couleur principale
    document.body.style.setProperty("--primary-color", window.TERMINAL_CONFIG.color || "#00ff9c");

    // Log de démarrage
    addLog("> BOOT : Initialisation du Terminal de Chargement Sécurisé...");

    // Initialisation musique
    if (window.MUSIC_LIST && window.MUSIC_LIST.length > 0) {
        state.currentTrack = chooseTrack();
        playTrack(state.currentTrack);
        
        if (elements.music) {
            elements.music.addEventListener("ended", () => {
                if (window.MUSIC_RANDOM) {
                    state.currentTrack = Math.floor(Math.random() * window.MUSIC_LIST.length);
                } else {
                    state.currentTrack = (state.currentTrack + 1) % window.MUSIC_LIST.length;
                }
                playTrack(state.currentTrack);
            });
        }
    }

    if (elements.musicStatus) {
        elements.musicStatus.addEventListener("click", toggleMusic);
    }

    if (window.TIPS && window.TIPS.length > 0) {
        setTimeout(() => typeTip(window.TIPS[0]), 2000);
    }

    setInterval(randomGlitch, window.TERMINAL_CONFIG.glitchInterval);

    if (!isGmod) {
        console.log("%c[SYSTÈME] Navigateur détecté : Lancement du mode Démo...", "color: #00ff9c; font-weight: bold;");
        runAdvancedSimulation();
    } else {
        console.log("%c[SYSTÈME] GMOD détecté : En attente du serveur...", "color: #00ff9c; font-weight: bold;");
        addLog("> CLIENT GMOD DÉTECTÉ", "status");
        addLog("> EN ATTENTE DE CONNEXION AU SERVEUR...", "info");
    }
};

// =========================
//   SYSTÈME DE LOGS
// =========================
function addLog(text, type = "info") {
    if (!text || !LOG) return;

    const div = document.createElement("div");
    div.className = `log-line log-${type}`;

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
    
    requestAnimationFrame(() => {
        LOG.scrollTop = LOG.scrollHeight;
    });

    if (LOG.children.length > window.TERMINAL_CONFIG.maxLines) {
        LOG.removeChild(LOG.firstChild);
    }
}

// ============================
//   EFFET DE SAISIE (TYPING)
// ============================
function typeText(element, text, speed = null) {
    if (!element) return;
    
    speed = speed || window.TERMINAL_CONFIG.typingSpeed;
    const id = element.id;
    
    if (state.activeTypers[id]) {
        clearTimeout(state.activeTypers[id]);
    }

    element.textContent = "";
    element.classList.add("typing");
    
    let i = 0;
    function tick() {
        if (i < text.length) {
            element.textContent += text[i];
            i++;
            state.activeTypers[id] = setTimeout(tick, speed);
        } else {
            element.classList.remove("typing");
            delete state.activeTypers[id];
        }
    }
    tick();
}

function setTyped(id, text, speed = null) {
    const el = document.getElementById(id);
    if (!el) return;
    typeText(el, text, speed);
}

// ============================
//   GLITCH DU TITRE
// ============================
function randomGlitch() {
    if (!state.allowHeaderGlitch || !elements.header) return;
    const phrases = window.TERMINAL_CONFIG.phrases;
    if (!phrases || phrases.length === 0) return;
    const pick = phrases[Math.floor(Math.random() * phrases.length)];
    elements.header.textContent = pick;
    elements.header.setAttribute("data-text", pick);
}

// ============================
//   HOOKS GMOD
// ============================

window.GameDetails = function(serverName, serverURL, mapName, maxPlayers, steamID, gamemode) {
    setTyped("title", serverName || "NŒUD INCONNU", 25);
    setTyped("map", mapName || "CARTE_INCONNUE", 25);
    setTyped("steamid", steamID || "N/A", 20);

    state.allowHeaderGlitch = false;
    setTimeout(() => state.allowHeaderGlitch = true, 1500);

    addLog("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    addLog("> CONNEXION ÉTABLIE", "status");
    addLog("> NŒUD : " + serverName, "info");
    addLog("> CARTE : " + mapName, "info");
    addLog("> ID STEAM : " + steamID, "info");
    addLog("> MODE DE JEU : " + gamemode, "info");
    addLog("> JOUEURS MAX : " + maxPlayers, "info");
    addLog("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
};

window.SetStatusChanged = function(status) {
    if (elements.status) {
        elements.status.textContent = status;
    }
    addLog("> " + status, "status");
};

window.SetFilesTotal = function(total) {
    state.totalFiles = total || 0;
    state.filesProcessed = 0;
    state.lastPercent = -1;
    state.lastLoggedPercent = -1;
    addLog("> TOTAL DE FICHIERS : " + total, "info");
};

window.SetFilesNeeded = function(needed) {
    if (state.totalFiles === 0) return;
    const done = state.totalFiles - needed;
    const p = Math.floor((done / state.totalFiles) * 100);

    if (p !== state.lastPercent && elements.percent) {
        elements.percent.textContent = p + "%";
        state.lastPercent = p;
    }

    if (p % 5 === 0 && p !== state.lastLoggedPercent && p > 0) {
        addLog(`> PROGRESSION : ${p}% (${needed} fichiers restants)`, "file");
        state.lastLoggedPercent = p;
    }

    if (p === 25 || p === 50 || p === 75) {
        addLog(`> ÉTAPE : ${p}% complété`, "status");
    }

    if (p >= 100) {
        addLog("> TÉLÉCHARGEMENT TERMINÉ", "status");
    }
};

window.DownloadingFile = function(fileName) {
    state.filesProcessed++;
    if (state.filesProcessed % 3 === 0 || state.filesProcessed <= 5) {
        addLog("> RÉCEPTION : " + fileName, "dl");
    }
};

window.onerror = function(msg, src, line) {
    addLog("> ERREUR : " + msg + " @ ligne " + line, "error");
    return true; 
};

// =====================================
//   ASTUCES (TIPS)
// =====================================
function typeTip(text, i = 0) {
    if (!elements.tipText) return;
    elements.tipText.textContent = "> " + text.substring(0, i);
    if (i < text.length) {
        setTimeout(() => typeTip(text, i + 1), 25);
    } else {
        setTimeout(() => eraseTip(text, text.length), 3000);
    }
}

function eraseTip(text, i) {
    if (!elements.tipText) return;
    elements.tipText.textContent = "> " + text.substring(0, i);
    if (i > 0) {
        setTimeout(() => eraseTip(text, i - 1), 15);
    } else {
        state.tipIndex = (state.tipIndex + 1) % window.TIPS.length;
        setTimeout(() => typeTip(window.TIPS[state.tipIndex]), 500);
    }
}

// =====================================
//   SYSTÈME MUSICAL
// =====================================
function chooseTrack() {
    if (window.MUSIC_RANDOM) {
        return Math.floor(Math.random() * window.MUSIC_LIST.length);
    } else {
        const t = state.currentTrack;
        state.currentTrack = (state.currentTrack + 1) % window.MUSIC_LIST.length;
        return t;
    }
}

function playTrack(index) {
    const track = window.MUSIC_LIST[index];
    if (!track || !elements.music) return;
    let targetVolume = parseFloat(window.MUSIC_VOLUME);
    if (targetVolume > 1) targetVolume /= 100;
    elements.music.src = track.file;
    elements.music.volume = Math.min(1.0, Math.max(0.0, targetVolume || 0));
    elements.music.play().catch((err) => {
        console.warn("[MUSIQUE] Bloqué ou fichier manquant :", track.file);
        state.musicEnabled = false;
        updateMusicStatus();
    });
    updateMusicStatus();
}

function updateMusicStatus() {
    if (!elements.musicStatus) return;
    const track = window.MUSIC_LIST[state.currentTrack];
    const status = state.musicEnabled ? "ACTIF" : "INACTIF";
    const trackName = track ? track.name : "AUCUNE PISTE";
    elements.musicStatus.textContent = `♪ ${trackName} [${status}]`;
}

function toggleMusic() {
    if (!elements.music) return;
    state.musicEnabled = !state.musicEnabled;
    if (state.musicEnabled) {
        elements.music.play().catch((err) => {
            state.musicEnabled = false;
            updateMusicStatus();
        });
    } else {
        elements.music.pause();
    }
    updateMusicStatus();
}

// =====================================
//   SIMULATION DÉMO
// =====================================
function runAdvancedSimulation() {
    setTimeout(() => {
        if (window.GameDetails) {
            window.GameDetails(
                "SITE-19 : INSTALLATION SÉCURISÉE", 
                "http://scp-foundation.net", 
                "rp_site19_v4", 
                64, 
                "STEAM_0:1:52839100", 
                "SCP-RP"
            );
        }

        const steps = [
            { t: 0,     s: "Connexion au serveur..." },
            { t: 2000,  s: "Récupération des infos..." },
            { t: 4000,  s: "Envoi des données client..." },
            { t: 6000,  s: "Téléchargement des fichiers..." },
            { t: 8000,  s: "Analyse des ressources..." }
        ];

        steps.forEach(step => {
            setTimeout(() => {
                if (window.SetStatusChanged) window.SetStatusChanged(step.s);
            }, step.t);
        });

        let total = 150;
        let current = 0;
        if (window.SetFilesTotal) window.SetFilesTotal(total);

        const fileInterval = setInterval(() => {
            current++;
            if (current === 45) {
                window.onerror("Chargement interrompu : Échec d'allocation mémoire", "awesomium_process", 173);
            }
            if (window.SetFilesNeeded) window.SetFilesNeeded(total - current);
            if (current >= total) {
                clearInterval(fileInterval);
                setTimeout(() => {
                    if (window.SetStatusChanged) window.SetStatusChanged("Chargement terminé !");
                    addLog("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                    addLog("> ACCÈS AUTORISÉ", "status");
                    addLog("> LANCEMENT DU JEU...", "info");
                    addLog("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                }, 1000);
            }
        }, 80); 
    }, 1500);
}

// =====================================
//   LOGS DE DEBUG
// =====================================
console.log("%c═══════════════════════════════════════", "color: #00ff9c");
console.log("%c TERMINAL SCP - INITIALISÉ", "color: #00ff9c; font-weight: bold");
console.log("%c CLIENT GMOD DÉTECTÉ : " + isGmod, "color: #00ff9c");
console.log("%c═══════════════════════════════════════", "color: #00ff9c");