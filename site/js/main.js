import { config } from "../config.js?v=9bfae49c";
import { initThemes } from "./themes.js?v=9bfae49c";
import { initMenu } from "./menu.js?v=9bfae49c";
import { initMat } from "./mat.js?v=9bfae49c";
import { initGallery } from "./gallery.js?v=9bfae49c";
import { playIntro } from "./intro.js?v=9bfae49c";
import { initAnatomy } from "./anatomy.js?v=9bfae49c";
import { initTry } from "./calm.js?v=9bfae49c";
import { initRoadmap } from "./roadmap.js?v=9bfae49c";
import { initDownload } from "./download.js?v=9bfae49c";

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
