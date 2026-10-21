import { config } from "../config.js?v=1aaa7b4c";
import { initTheme } from "./theme.js?v=1aaa7b4c";
import { initAccent } from "./accent.js?v=1aaa7b4c";
import { initMenu } from "./menu.js?v=1aaa7b4c";
import { initReveal } from "./reveal.js?v=1aaa7b4c";
import { initGallery } from "./gallery.js?v=1aaa7b4c";
import { playIntro } from "./intro.js?v=1aaa7b4c";
import { initTry } from "./calm.js?v=1aaa7b4c";
import { initRoadmap } from "./roadmap.js?v=1aaa7b4c";
import { initDownload } from "./download.js?v=1aaa7b4c";

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
