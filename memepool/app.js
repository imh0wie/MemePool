import MemePool from "./memepool";

document.addEventListener("DOMContentLoaded", () => {
    const documentEl = $$(document);
    const bgBars = $$(".bg-bars").children();
    $$(function() {
        bgBars.each(bar => {
            setTimeout(() => $$(bar).removeClass("hidden"), 0);
        });
    });
    const options = {
        documentEl: documentEl,
        database: firebase.database().ref("memes")
    };
    const memepool = new MemePool(options);
    memepool.render();
});