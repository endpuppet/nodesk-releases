import { config } from "../config.js?v=e3b0a3a9";
import { initTheme } from "./theme.js?v=e3b0a3a9";
import { initAccent } from "./accent.js?v=e3b0a3a9";
import { initMenu } from "./menu.js?v=e3b0a3a9";
import { initReveal } from "./reveal.js?v=e3b0a3a9";
import { initGallery } from "./gallery.js?v=e3b0a3a9";
import { playIntro } from "./intro.js?v=e3b0a3a9";
import { initTry } from "./calm.js?v=e3b0a3a9";
import { initRoadmap } from "./roadmap.js?v=e3b0a3a9";
import { initDownload } from "./download.js?v=e3b0a3a9";

window.__nd = 1;
const intro = playIntro();
initTheme();
initAccent();
initMenu();
initReveal();
initGallery(intro.gallery);
initTry();

// The roadmap renders first; the download card reads the build line from the same data.
const data = await initRoadmap(document.getElementById("roadmap-root"));
initDownload(config, data);
