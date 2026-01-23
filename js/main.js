// ============================================
//   TERMINAL SCP - MAIN SCRIPT
//   VERSION AMÉLIORÉE ET OPTIMISÉE
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
    allowHeaderGlitch: true
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
                state.currentTrack = chooseTrack();
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
        addLog("> CONNECTION ESTABLISHED. AWAITING DATA...", "info");
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
    
    // Auto-scroll avec animation fluide
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

    const phrases = window.TERMINAL_CONFIG.phrases || ["SCP FOUNDATION"];
    const pick = phrases[Math.floor(Math.random() * phrases.length)];

    elements.header.textContent = pick;
    elements.header.setAttribute("data-text", pick);
}

// ============================
//   CALLBACKS GMOD
// ============================

// GAME DETAILS
window.GameDetails = function(serverName, serverURL, mapName, maxPlayers, steamID, gamemode) {
    // Typing pour les 3 champs (rarement appelés)
    setTyped("title", serverName || "UNKNOWN NODE", 30);
    setTyped("map", mapName || "UNKNOWN_MAP", 30);
    setTyped("steamid", steamID || "N/A", 25);

    // Empêcher glitch header pendant 1.2s
    state.allowHeaderGlitch = false;
    setTimeout(() => state.allowHeaderGlitch = true, 1200);

    addLog("> INITIALIZING NODE: " + serverName);
    addLog("> MAP: " + mapName, "info");
    addLog("> STEAM ID: " + steamID, "info");
    addLog("> GAMEMODE: " + gamemode, "info");
};

// STATUS CHANGED
window.SetStatusChanged = function(status) {
    // PAS de typing ici → stabilité et rapidité
    if (elements.status) {
        elements.status.textContent = status;
    }
    addLog("> STATUS: " + status, "status");
};

// ============================
//   PROGRESSION OPTIMISÉE
// ============================
window.SetFilesTotal = function(total) {
    state.totalFiles = total || 0;
    addLog("> FILES: " + total + " total.", "info");
};

window.SetFilesNeeded = function(needed) {
    if (state.totalFiles === 0) return;

    const done = state.totalFiles - needed;
    const p = Math.floor((done / state.totalFiles) * 100);

    // Éviter spam de typing si même %
    if (p !== state.lastPercent && elements.percent) {
        elements.percent.textContent = p + "%";
        state.lastPercent = p;
    }

    // Log uniquement tous les 10%
    if (p % 10 === 0 && p !== state.lastPercent) {
        addLog("> PROGRESS: " + p + "% (" + needed + " remaining)", "file");
    }
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
//   TIPS TYPING SUR CURSEUR
// =====================================
function typeTip(text, i = 0) {
    if (!elements.tipText) return;
    
    elements.tipText.textContent = "> " + text.substring(0, i);

    if (i < text.length) {
        setTimeout(() => typeTip(text, i + 1), 25);
    } else {
        setTimeout(() => eraseTip(text, text.length), 2500);
    }
}

function eraseTip(text, i) {
    if (!elements.tipText) return;
    
    elements.tipText.textContent = "> " + text.substring(0, i);

    if (i > 0) {
        setTimeout(() => eraseTip(text, i - 1), 18);
    } else {
        state.tipIndex = (state.tipIndex + 1) % window.TIPS.length;
        setTimeout(() => typeTip(window.TIPS[state.tipIndex]), 400);
    }
}

// =====================================
//   SYSTÈME MUSICAL AMÉLIORÉ
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

    elements.music.src = track.file;
    elements.music.volume = Math.min(1.0, Math.max(0.0, window.MUSIC_VOLUME));
    
    elements.music.play().catch((err) => {
        console.warn("Audio autoplay bloqué:", err);
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
            console.warn("Impossible de lire la musique:", err);
            state.musicEnabled = false;
            updateMusicStatus();
        });
    } else {
        elements.music.pause();
    }
    
    updateMusicStatus();
    addLog(`> MUSIC: ${state.musicEnabled ? 'ENABLED' : 'DISABLED'}`, "info");
}

// =====================================
//   SIMULATION DÉMO AVANCÉE
// =====================================
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
            { t: 0,     s: "Handshaking with Foundation Node..." },
            { t: 3000,  s: "Verifying Level 4 Clearance..." },
            { t: 6000,  s: "Bypassing Local Firewall..." },
            { t: 9000,  s: "Neural link established (C.A.S.S.I.E)" },
            { t: 12000, s: "Decrypting asset manifest..." },
            { t: 15000, s: "Loading anomalous materials..." }
        ];

        steps.forEach(step => {
            setTimeout(() => {
                if (window.SetStatusChanged) window.SetStatusChanged(step.s);
            }, step.t);
        });

        // 3. Simulation des fichiers (avec variation de vitesse)
        let total = 120;
        let current = 0;
        if (window.SetFilesTotal) window.SetFilesTotal(total);

        const files = [
            "models/scp/173.mdl",
            "sound/alarm_01.wav",
            "maps/graphs/rp_site19.jgh",
            "materials/scifi/wall_panel.vmt",
            "lua/autorun/scp_init.lua",
            "particles/containment_breach.pcf",
            "models/weapons/w_keycard.mdl",
            "sound/scp/breath_heavy.wav",
            "materials/glass/bulletproof.vmt"
        ];

        const fileInterval = setInterval(() => {
            current++;
            
            // Simulation d'une erreur JS à 30%
            if (current === 36) {
                window.onerror("MEM_CORRUPTION: SCP-079_INTRUSION_DETECTED", "kernel.dll", 79);
            }

            const randomFile = files[Math.floor(Math.random() * files.length)];
            
            if (window.DownloadingFile) window.DownloadingFile(randomFile);
            if (window.SetFilesNeeded) window.SetFilesNeeded(total - current);

            if (current >= total) {
                clearInterval(fileInterval);
                setTimeout(() => {
                    if (window.SetStatusChanged) {
                        window.SetStatusChanged("TERMINAL READY - WELCOME DOCTOR");
                    }
                    addLog("> ACCESS GRANTED. SYSTEM OPERATIONAL.", "status");
                    addLog("> PRESS ANY KEY TO CONTINUE...", "info");
                }, 1000);
            }
        }, 100); // Vitesse de croisière

    }, 1500);
}