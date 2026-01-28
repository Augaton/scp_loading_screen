// ============================================
//   CONFIGURATION TERMINAL SCP
//   VERSION AMÉLIORÉE
// ============================================

window.TERMINAL_CONFIG = {

    // Message affiché en haut du terminal
    announcement: "> CONNEXION SÉCURISÉE AVEC LE NŒUD DE L'INTRANET SHILARI-Z ÉTABLIE",

    // Couleur principale (si besoin d'ajuster dynamiquement)
    color: "#00ff9c",

    // Nombre max de lignes dans le terminal
    maxLines: 10,

    // Préfix terminal
    prefix: "> ",

    // Phrases pour l'effet glitch du header
    phrases: [
        "FONDATION SCP // TERMINAL DE CHARGEMENT SÉCURISÉ",
        "ACCÈS AU NŒUD EN COURS...",
        "LIAISON ÉTABLIE AVEC C.A.S.S.I.E.",
        "ATTENTION : INSTABILITÉ DE LA RÉALITÉ",
        "SIGNAL DE SCP-079 DÉTECTÉ",
        "ACCÈS SYSTÈME : AUTHENTIFICATION NIVEAU 3",
        "ANOMALIE DÉTECTÉE // SECTEUR-7",
        "PROTOCOLE DE BRÈCHE DE CONFINEMENT",
        "FILTRE À RISQUES MÉMÉTIQUES ACTIF"
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