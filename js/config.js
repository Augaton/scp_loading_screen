// ============================================
//   CONFIGURATION TERMINAL SCP
//   VERSION AMÉLIORÉE
// ============================================

window.TERMINAL_CONFIG = {

    // Message affiché en haut du terminal
    announcement: "> SECURE CONNECTION WITH FOUNDATION NODE ESTABLISHED",

    // Couleur principale (si besoin d'ajuster dynamiquement)
    color: "#00ff9c",

    // Nombre max de lignes dans le terminal
    maxLines: 120,

    // Préfix terminal
    prefix: "> ",

    // Phrases pour l'effet glitch du header
    phrases: [
        "SCP FOUNDATION // SECURE LOAD TERMINAL",
        "ACCESSING NODE…",
        "LINK ESTABLISHED WITH CASSIE",
        "WARNING: REALITY INSTABILITY",
        "SCP-079 SIGNAL DETECTED",
        "SYSTEM HOOK: LEVEL-3 AUTH",
        "ANOMALY DETECTED // SECTOR-7",
        "CONTAINMENT BREACH PROTOCOL",
        "MEMETIC HAZARD FILTER ACTIVE"
    ],

    // Vitesse de typing (ms par caractère)
    typingSpeed: 40,

    // Intervalle de changement du header glitch (ms)
    glitchInterval: 8000

};

// ============================================
//   TIPS / ASTUCES
// ============================================
window.TIPS = [
    "Astuce : Vous pouvez rejoindre Discord pour plus d'infos.",
    "Astuce : Ne quittez pas, C.A.S.S.I.E optimise la connexion.",
    "Astuce : N'hésitez pas à inviter vos amis.",
    "Astuce : Respectez les règles du serveur pour éviter les sanctions.",
    "Info : Le loading screen est optimisé pour les connexions lentes.",
    "Info : L'installation des addons peut prendre un peu de temps.",
    "Note : La progression est calculée en temps réel."
];

// ============================================
//   SYSTÈME MUSICAL
// ============================================
window.MUSIC_LIST = [
    { name: "When Day Breaks", file: "music/music1.mp3" },
    { name: "PostMortem", file: "music/music2.mp3" },
    // { name: "Left For Good", file: "music/music3.mp3" }
];

// Lecture aléatoire ou dans l'ordre
window.MUSIC_RANDOM = true; // true = aléatoire | false = ordre séquentiel

// Volume initial (entre 0 et 1)
window.MUSIC_VOLUME = 0.15; // Augmenté à 15% pour meilleure audibilité

// Auto-play activé par défaut
window.MUSIC_AUTOPLAY = true;