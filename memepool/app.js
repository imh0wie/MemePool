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
        this.header = new Header();
        this.bar = new Bar();
        this.uploadForm = new UploadForm();
    }

    render() {
        this.header.render();
        this.bar.render();
    }
}

class Header {
    constructor() {
        this.header = $$("header.hidden");
    }

    render() {
        $$(() => setTimeout(() => this.header.removeClass("hidden"), 500));
    }
}

class Bar {
    constructor() {
        this.bar = $$(".bar.hidden")
        this.uploadButton = $$(".add-button");
    }

    render() {
        $$(() => setTimeout(() => this.bar.removeClass("hidden"), 500));
        this.uploadButton.on("click", (e) => this.uploadButton.toggleClass("pressed"));
        debugger
    }
}

class UploadForm {
    constructor() {
        this.form = $$("form.hidden");
    }

    render() {
        
    }
}

