const fs = require('fs');
const css = `
/* ══════════════════════════════════════════════════════════════
   EFFET VERRE GLACÉ / NEIGE (FROSTED GLASS) SUR BLEU NUIT
   ══════════════════════════════════════════════════════════════ */

.bg-\\[\\#0D1B2A\\]:not(button):not(.h-\\[2px\\]),
header.bg-\\[\\#0D1B2A\\]\\/95,
.from-\\[\\#0D1B2A\\]\\/60 {
  position: relative;
}

.bg-\\[\\#0D1B2A\\]:not(button):not(.h-\\[2px\\])::before,
header.bg-\\[\\#0D1B2A\\]\\/95::before,
.from-\\[\\#0D1B2A\\]\\/60::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: 
    radial-gradient(120% 120% at 20% 100%, rgba(255, 255, 255, 0.08) 0%, transparent 60%),
    radial-gradient(80% 80% at 85% 0%, rgba(255, 255, 255, 0.04) 0%, transparent 50%),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E");
  background-blend-mode: screen, screen, overlay;
  border-radius: inherit;
  z-index: 0;
}

.bg-\\[\\#0D1B2A\\]:not(button):not(.h-\\[2px\\]) > *,
header.bg-\\[\\#0D1B2A\\]\\/95 > *,
.from-\\[\\#0D1B2A\\]\\/60 > * {
  position: relative;
  z-index: 10;
}
`;
fs.appendFileSync('src/app/globals.css', css);
