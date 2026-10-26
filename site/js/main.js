import { config } from "../config.js?v=e4950c0b";
import { initThemes } from "./themes.js?v=e4950c0b";
import { initMenu } from "./menu.js?v=e4950c0b";
import { initMat } from "./mat.js?v=e4950c0b";
import { initGallery } from "./gallery.js?v=e4950c0b";
import { playIntro } from "./intro.js?v=e4950c0b";
import { initAnatomy } from "./anatomy.js?v=e4950c0b";
import { initTry } from "./calm.js?v=e4950c0b";
import { initRoadmap } from "./roadmap.js?v=e4950c0b";
import { initDownload } from "./download.js?v=e4950c0b";

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
