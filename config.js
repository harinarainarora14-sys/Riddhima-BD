/**
 * ✨ EDIT THIS FILE to customize the birthday greeting! ✨
 *
 * This is the ONLY file you need to modify.
 * No need to touch HTML, CSS, or any other JavaScript files.
 *
 * AVAILABLE SECTION TYPES:
 *   "greeting"      → Opening greeting with recipient's name
 *   "announcement"  → Birthday announcement text
 *   "chatbox"       → Chat message with typing animation
 *   "ideas"         → Sequential text reveals, one by one
 *   "quote"         → Styled quote card with optional author
 *   "countdown"     → Animated 3-2-1 countdown
 *   "stars"         → Twinkling stars background
 *   "fireworks"     → Colorful firework sparks burst
 *   "balloons"      → Floating balloon animation
 *   "profile"       → Profile photo with birthday wish
 *   "confetti"      → Confetti burst animation
 *   "closing"       → Closing message with replay button
 *   "video"         → YouTube (unlisted) video card. Pauses music while
 *                     playing, resumes it after, and shows a Rewatch
 *                     button once it ends (youtubeId, title, caption)
 *
 * HOW TO USE:
 *   REMOVE a section  → Delete its object from the sections array
 *   DUPLICATE          → Copy-paste any section object
 *   REORDER            → Move the section object up/down in the array
 *   EDIT TEXT          → Change the string values
 */

const CONFIG = {
  // ── Recipient Info ────────────────────────────────────────────
  name: "Riddhima",
  photo: "./img/riddhima.png",    // Riddhima's photo
  music: "./music/song.mp3",      // Place your music in the music/ folder

  // ── Theme Colors ──────────────────────────────────────────────
  // A toggle button lets the viewer switch between dark & light mode.
  colors: {
    primary: "#f472b6",           // Main accent color (rose pink)
    accent: "#60a5fa",            // Secondary accent color (sky blue)
    dark: {
      background: "#0f172a",      // Slate 900
      text: "#f1f5f9",            // Slate 100
    },
    light: {
      background: "#fafaf9",      // Stone 50
      text: "#1e293b",            // Slate 800
    },
  },

  // ── Default Color Mode ────────────────────────────────────────
  // Options: "dark" or "light"
  defaultMode: "dark",

  // ── Sections ──────────────────────────────────────────────────
  // Add, remove, duplicate, or reorder as you wish!
  sections: [
    {
      type: "greeting",
      title: "Hi",
      subtitle: "We really love you btw!",
    },
    {
      type: "countdown",
      from: 3,                    // Countdown from this number
      goText: "🎉",              // Text shown after countdown ends
    },
    {
      type: "announcement",
      text: "It's your birthday!! :D",
    },
    {
      type: "chatbox",
      message:
        "Happiest 18th birthday, Riddhima!! We hope you achieve everything you have been working hard for :)",
      buttonText: "Send",
    },
    {
      type: "ideas",
      lines: [
        "That's what we were going to do.",
        "But then we stopped.",
        "We realised, we wanted to do something <strong>special</strong>.",
        "Because,",
        "Riddhima, you are Special <span>:)</span>",
      ],
      bigLetters: "SO",
    },
    {
      type: "quote",
      text: "The more you praise and celebrate your life, the more there is in life to celebrate.",
      author: "Oprah Winfrey",
    },
    {
      type: "stars",
      count: 40,
    },
    {
      type: "balloons",
      count: 25,
    },
    {
      type: "profile",
      wishTitle: "Happy Birthday, Riddhima!",
      wishText: "Hope this year brings you everything you're hoping for, and then some ✨",
    },
    {
      type: "fireworks",
      count: 24,
    },
    {
      type: "confetti",
      count: 9,
    },
    {
      type: "video",
      title: "One more thing...",
      // Paste the ID from your UNLISTED YouTube video's URL.
      // e.g. for https://youtu.be/dQw4w9WgXcQ the ID is just "dQw4w9WgXcQ"
      youtubeId: "1FDJ_2YmZFA",
      caption: "made this just for you :)",
      holdAfterEnd: 5,   // Seconds to keep the Rewatch button on screen after the video ends
    },
    {
      type: "closing",
      text: "Okay, now come back and tell us if you liked it.",
      replayText: "Or click, if you want to watch it again.",
    },
  ],
};
