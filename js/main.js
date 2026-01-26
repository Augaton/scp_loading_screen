// ============================================
//   TERMINAL SCP - MAIN SCRIPT
//   VERSION OPTIMISÉE POUR GARRY'S MOD
// ============================================

// =========================
//   CONFIGURATION
// =========================
const LOG = document.getElementById("history");
window.TERMINAL_CONFIG = window.TERMINAL_CONFIG || { 
    color: "#00ff9c",
    maxLines: 120,
    typingSpeed: 40,
    glitchInterval: 8000
};
window.TIPS = window.TIPS || ["Initializing..."];
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
//   ÉLÉMENTS DOM CACHÉS
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
    addLog("> BOOT: Initializing Secure Load Terminal…");

    // Initialisation musique
    if (window.MUSIC_LIST && window.MUSIC_LIST.length > 0) {
        state.currentTrack = chooseTrack();
        playTrack(state.currentTrack);
        
        // Auto-switch piste quand terminée
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

    // Toggle musique au clic
    if (elements.musicStatus) {
        elements.musicStatus.addEventListener("click", toggleMusic);
    }

    // Initialisation tips
    if (window.TIPS && window.TIPS.length > 0) {
        setTimeout(() => typeTip(window.TIPS[0]), 2000);
    }

    // Glitch header périodique
    setInterval(randomGlitch, window.TERMINAL_CONFIG.glitchInterval);

    // Lancement démo ou attente GMOD
    if (!isGmod) {
        console.log("%c[SYSTEM] Navigateur détecté : Lancement du mode Démo...", "color: #00ff9c; font-weight: bold;");
        runAdvancedSimulation();
    } else {
        console.log("%c[SYSTEM] GMOD détecté : En attente du serveur...", "color: #00ff9c; font-weight: bold;");
        addLog("> GMOD CLIENT DETECTED", "status");
        addLog("> AWAITING SERVER CONNECTION...", "info");
    }
};

// =========================
//   SYSTÈME DE LOGS OPTIMISÉ
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
    
    // Auto-scroll avec animation fluide (compatible GMOD)
    requestAnimationFrame(() => {
        LOG.scrollTop = LOG.scrollHeight;
    });

    // Limite le nombre de lignes pour performance
    if (LOG.children.length > window.TERMINAL_CONFIG.maxLines) {
        LOG.removeChild(LOG.firstChild);
    }
}

// ============================
//   EFFET TYPING OPTIMISÉ
// ============================
function typeText(element, text, speed = null) {
    if (!element) return;
    
    speed = speed || window.TERMINAL_CONFIG.typingSpeed;
    const id = element.id;
    
    // Annuler typing précédent
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
//   GLITCH DYNAMIQUE HEADER
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
//   CALLBACKS GMOD (HOOKS)
// ============================

/**
 * GMOD HOOK: GameDetails
 * Appelé au début du chargement avec les infos du serveur
 */
window.GameDetails = function(serverName, serverURL, mapName, maxPlayers, steamID, gamemode) {
    console.log("[GMOD] GameDetails appelé:", { serverName, mapName, steamID, gamemode });
    
    // Typing pour les 3 champs (appelé UNE FOIS au début)
    setTyped("title", serverName || "UNKNOWN NODE", 25);
    setTyped("map", mapName || "UNKNOWN_MAP", 25);
    setTyped("steamid", steamID || "N/A", 20);

    // Empêcher glitch header pendant le typing
    state.allowHeaderGlitch = false;
    setTimeout(() => state.allowHeaderGlitch = true, 1500);

    // Logs
    addLog("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    addLog("> CONNECTION ESTABLISHED", "status");
    addLog("> NODE: " + serverName, "info");
    addLog("> MAP: " + mapName, "info");
    addLog("> STEAM ID: " + steamID, "info");
    addLog("> GAMEMODE: " + gamemode, "info");
    addLog("> MAX PLAYERS: " + maxPlayers, "info");
    addLog("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
};

/**
 * GMOD HOOK: SetStatusChanged
 * Appelé à chaque changement de statut
 */
window.SetStatusChanged = function(status) {
    console.log("[GMOD] SetStatusChanged:", status);
    
    // Mise à jour DIRECTE sans typing (pour réactivité)
    if (elements.status) {
        elements.status.textContent = status;
    }
    addLog("> " + status, "status");
};

/**
 * GMOD HOOK: SetFilesTotal
 * Appelé au début pour définir le total de fichiers
 */
window.SetFilesTotal = function(total) {
    console.log("[GMOD] SetFilesTotal:", total);
    
    state.totalFiles = total || 0;
    state.filesProcessed = 0;
    state.lastPercent = -1;
    state.lastLoggedPercent = -1;
    
    addLog("> TOTAL FILES: " + total, "info");
};

/**
 * GMOD HOOK: SetFilesNeeded
 * Appelé pour chaque fichier téléchargé
 * needed = nombre de fichiers restants
 */
window.SetFilesNeeded = function(needed) {
    if (state.totalFiles === 0) return;

    const done = state.totalFiles - needed;
    const p = Math.floor((done / state.totalFiles) * 100);

    // Mise à jour du pourcentage (sans typing pour réactivité)
    if (p !== state.lastPercent && elements.percent) {
        elements.percent.textContent = p + "%";
        state.lastPercent = p;
    }

    // Log uniquement tous les 5% pour ne pas spammer
    if (p % 5 === 0 && p !== state.lastLoggedPercent && p > 0) {
        addLog(`> PROGRESS: ${p}% (${needed} files remaining)`, "file");
        state.lastLoggedPercent = p;
    }

    // Log spécial pour certains jalons
    if (p === 25 || p === 50 || p === 75) {
        addLog(`> MILESTONE: ${p}% complete`, "status");
    }

    // Log de fin
    if (p >= 100) {
        addLog("> DOWNLOAD COMPLETE", "status");
    }
};

/**
 * GMOD HOOK: DownloadingFile
 * Appelé pour chaque fichier en cours de téléchargement
 */
window.DownloadingFile = function(fileName) {
    // Ne log que 1 fichier sur 3 pour éviter le spam
    state.filesProcessed++;
    if (state.filesProcessed % 3 === 0 || state.filesProcessed <= 5) {
        addLog("> DL: " + fileName, "dl");
    }
};

/**
 * GMOD HOOK: onerror
 * Capture les erreurs JavaScript
 */
window.onerror = function(msg, src, line) {
    console.error("[JS ERROR]", msg, src, line);
    addLog("> ERROR: " + msg + " @ line " + line, "error");
    return true; // Empêche l'affichage dans la console GMOD
};

// =====================================
//   TIPS TYPING SUR CURSEUR
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

    // Conversion et sécurité volume
    let targetVolume = parseFloat(window.MUSIC_VOLUME);
    if (targetVolume > 1) targetVolume /= 100;

    elements.music.src = track.file;
    elements.music.volume = Math.min(1.0, Math.max(0.0, targetVolume || 0));

    // Tentative de lecture
    elements.music.play().catch((err) => {
        console.warn("[MUSIC] Bloqué par le navigateur ou fichier manquant:", track.file);
        state.musicEnabled = false;
        updateMusicStatus();
    });

    updateMusicStatus();
}

function updateMusicStatus() {
    if (!elements.musicStatus) return;
    
    const track = window.MUSIC_LIST[state.currentTrack];
    const status = state.musicEnabled ? "ON" : "OFF";
    const trackName = track ? track.name : "NO TRACK";
    
    elements.musicStatus.textContent = `♪ ${trackName} [${status}]`;
}

function toggleMusic() {
    if (!elements.music) return;
    
    state.musicEnabled = !state.musicEnabled;
    
    if (state.musicEnabled) {
        elements.music.play().catch((err) => {
            console.warn("[MUSIC] Impossible de lire:", err);
            state.musicEnabled = false;
            updateMusicStatus();
        });
    } else {
        elements.music.pause();
    }
    
    updateMusicStatus();
    console.log("[MUSIC]", state.musicEnabled ? "ENABLED" : "DISABLED");
}

// =====================================
//   SIMULATION DÉMO (POUR TEST HORS GMOD)
// =====================================
function runAdvancedSimulation() {
    setTimeout(() => {
        // 1. Simulation GameDetails
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

        // 2. Changements de statut progressifs
        const steps = [
            { t: 0,     s: "Connecting to server..." },
            { t: 2000,  s: "Retrieving server info..." },
            { t: 4000,  s: "Sending client info..." },
            { t: 6000,  s: "Downloading files..." },
            { t: 8000,  s: "Parsing game resources..." }
        ];

        steps.forEach(step => {
            setTimeout(() => {
                if (window.SetStatusChanged) window.SetStatusChanged(step.s);
            }, step.t);
        });

        // 3. Simulation fichiers
        let total = 150;
        let current = 0;
        if (window.SetFilesTotal) window.SetFilesTotal(total);

        const files = [
            "models/scp/173.mdl",
            "sound/alarm/breach.wav",
            "maps/rp_site19_v4.bsp",
            "materials/metal/wall_panel.vmt",
            "lua/autorun/scp_init.lua",
            "particles/breach_effect.pcf",
            "models/weapons/w_keycard.mdl",
            "sound/ambient/facility.mp3",
            "materials/glass/bulletproof.vmt",
            "models/props/door_heavy.mdl"
        ];

        const fileInterval = setInterval(() => {
            current++;
            
            // Simulation d'une erreur à 30%
            if (current === 45) {
                window.onerror("Loading interrupted: Memory allocation failed", "awesomium_process", 173);
            }

            const randomFile = files[Math.floor(Math.random() * files.length)];
            
            if (window.DownloadingFile) window.DownloadingFile(randomFile);
            if (window.SetFilesNeeded) window.SetFilesNeeded(total - current);

            if (current >= total) {
                clearInterval(fileInterval);
                setTimeout(() => {
                    if (window.SetStatusChanged) {
                        window.SetStatusChanged("Loading complete!");
                    }
                    addLog("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                    addLog("> ACCESS GRANTED", "status");
                    addLog("> LOADING GAME...", "info");
                    addLog("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                }, 1000);
            }
        }, 80); // Vitesse réaliste

    }, 1500);
}

// =====================================
//   LOGS DE DEBUG POUR GMOD
// =====================================
console.log("%c═══════════════════════════════════════", "color: #00ff9c");
console.log("%c SCP LOADING TERMINAL - INITIALIZED", "color: #00ff9c; font-weight: bold");
console.log("%c GMOD DETECTED: " + isGmod, "color: #00ff9c");
console.log("%c═══════════════════════════════════════", "color: #00ff9c");