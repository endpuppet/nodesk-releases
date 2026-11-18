import { config } from "../config.js?v=d4c8611b";
import { initThemes } from "./themes.js?v=d4c8611b";
import { initMenu } from "./menu.js?v=d4c8611b";
import { initMat } from "./mat.js?v=d4c8611b";
import { initGallery } from "./gallery.js?v=d4c8611b";
import { playIntro } from "./intro.js?v=d4c8611b";
import { initAnatomy } from "./anatomy.js?v=d4c8611b";
import { initTry } from "./calm.js?v=d4c8611b";
import { initRoadmap } from "./roadmap.js?v=d4c8611b";
import { initDownload } from "./download.js?v=d4c8611b";
import { initLatest } from "./latest.js?v=d4c8611b";
import { initSpy } from "./spy.js?v=d4c8611b";

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
