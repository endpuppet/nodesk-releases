import { config } from "../config.js?v=2e4562e2";
import { initThemes } from "./themes.js?v=2e4562e2";
import { initMenu } from "./menu.js?v=2e4562e2";
import { initMat } from "./mat.js?v=2e4562e2";
import { initGallery } from "./gallery.js?v=2e4562e2";
import { playIntro } from "./intro.js?v=2e4562e2";
import { initAnatomy } from "./anatomy.js?v=2e4562e2";
import { initTry } from "./calm.js?v=2e4562e2";
import { initRoadmap } from "./roadmap.js?v=2e4562e2";
import { initDownload } from "./download.js?v=2e4562e2";
import { initLatest } from "./latest.js?v=2e4562e2";
import { initSpy } from "./spy.js?v=2e4562e2";

window.__nd = 1;
initThemes();
const mat = initMat();
const intro = playIntro(mat);
initMenu();
initGallery(intro.gallery);
initAnatomy();
initTry();
initSpy();

// The roadmap renders first; the download card reads the build line from the same data.
const data = await initRoadmap(document.getElementById("roadmap-root"));
initLatest(document.getElementById("latest-root"), data);
initDownload(config, data);
