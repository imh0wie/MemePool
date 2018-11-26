document.addEventListener("DOMContentLoaded", () => {
    const bgBars = $$(".bg-bars").children();
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
    memepool = new MemePool();
    memepool.render();
});

class MemePool {
    constructor() {
        this.header = $$("header.hidden");
        this.bar = $$(".bar.hidden");
    }

    render() {
        $$(() => setTimeout(() => this.header.removeClass("hidden"), 500));
        $$(() => setTimeout(() => this.bar.removeClass("hidden"), 500));

    }
}

