document.addEventListener("DOMContentLoaded", () => {
    const bgBars = $$(".bg-bars").children();
    $$(function() {
        bgBars.each(bar => {
            setTimeout(() => $$(bar).removeClass("hidden"), 0);
        });

        // setTimeout(() => {
        //     bgBars.each(bar => {
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
        this.uploadForm = new UploadForm();
        this.bar = new Bar({uploadForm: this.uploadForm.form});
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
    constructor(options) {
        this.bar = $$(".bar.hidden")
        this.uploadButton = $$(".add-button");
        this.uploadForm = options.uploadForm;
        this.opened = false;
    }

    toggleForm() {
        setTimeout(() => {
            this.uploadButton.toggleClass("pressed");
            this.uploadForm.toggleClass("hidden");
        }, 100);
    }

    toggle() {
        if (this.opened) {
            this.uploadForm.children().each((child) => {
                debugger
                $$(child).toggleClass("hidden");
            });
            this.toggleForm();
            this.opened = false;
        } else {
            this.toggleForm();
            setTimeout(() => {
                this.uploadForm.children().each((child) => {
                    debugger
                    $$(child).toggleClass("hidden");
                })
            }, 350);
            this.opened = true;
        }
    }

    render() {
        $$(() => setTimeout(() => this.bar.removeClass("hidden"), 500));
        this.uploadButton.on("click", () => this.toggle());
    }
}

class UploadForm {
    constructor() {
        this.form = $$("form.hidden");
    }

    render() {
        
    }
}

