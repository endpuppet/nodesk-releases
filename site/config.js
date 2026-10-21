// The one switch for the download card. Locked is enforced in js/download.js: while
// `downloadLocked` is anything other than the boolean `false`, no release lookup is made and no
// link is ever created. Unlock only when you are ready to hand the installer out.
export const config = Object.freeze({
  downloadLocked: true,
  releasesRepo: "endpuppet/nodesk-releases",
  downloadUrl: "",
});

export default config;
