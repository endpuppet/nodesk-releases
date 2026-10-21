import { config } from "../config.js?v=a15f6c46";
import { initThemes } from "./themes.js?v=a15f6c46";
import { initMenu } from "./menu.js?v=a15f6c46";
import { initMat } from "./mat.js?v=a15f6c46";
import { initGallery } from "./gallery.js?v=a15f6c46";
import { playIntro } from "./intro.js?v=a15f6c46";
import { initAnatomy } from "./anatomy.js?v=a15f6c46";
import { initTry } from "./calm.js?v=a15f6c46";
import { initRoadmap } from "./roadmap.js?v=a15f6c46";
import { initDownload } from "./download.js?v=a15f6c46";

window.__nd = 1;
initThemes();
const mat = initMat();
const intro = playIntro(mat);
initMenu();
initGallery(intro.gallery);
initAnatomy();
initTry();

// The roadmap renders first; the download card reads the build line from the same data.
const data = await initRoadmap(document.getElementById("roadmap-root"));
initDownload(config, data);
