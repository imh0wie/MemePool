document.addEventListener("DOMContentLoaded", () => {
    const bgBars = $$(".bg-bars").children();
    debugger
    $$(function() {
        bgBars.each(bar => {
            setTimeout(() => $$(bar).removeClass("hidden"), 0);
        });
        // setTimeout(() => {
        //     bgBars.each(bar => {
        //         debugger
        //         $$(bar).removeClass("hidden")
        //     });
        // }, 0)
    });
    // memepool = new MemePool();
    // memepool.render();
});