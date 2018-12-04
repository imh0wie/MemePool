document.addEventListener("DOMContentLoaded", () => {
    const documentEl = $$(document);
    const bgBars = $$(".bg-bars").children();
    $$(function() {
        bgBars.each(bar => {
            debugger
            setTimeout(() => $$(bar).removeClass("hidden"), 0);
            // setTimeout(() => bar.classList.contains("hidden-height") ? $$(bar).removeClass("hidden-height") : $$(bar).removeClass("hidden-height"), 0);
            // setTimeout(() => {
            //     if (bar.classList.contains("hidden-width")) {
            //         $$(bar).removeClass("hidden-width");
            //     } else {
            //         $$(bar).removeClass("hidden-height");
            //     }
            // }, 0);
        });
    });
    const options = {
        documentEl: documentEl,
    };
    memepool = new MemePool(options);
    memepool.render();
});

class MemePool {
    constructor(options) {
        this.header = new Header(options);
        this.uploadForm = new UploadForm(options);
        this.bar = new Bar(Object.assign(options, {uploadForm: this.uploadForm.form}));
        this.memesContainer = new MemesContainer(options);
    }

    render() {
        this.header.render();
        this.bar.render();
        this.memesContainer.render();
    }
}

class Komponent {
    constructor(options) {
        this.documentEl = options.documentEl;
    }
    renderChildren(el, klass, t, cb = null, devault = true) {
        for (let i = 0; i < el.children().length; i++) {
            const child = el.children()[i];
            if (devault) setTimeout(() => $(child).removeClass(klass), t);
            if (cb) cb(child, t);
        }
    }

    renderChildrenInOrder(el, klass, t, cb = null, devault = true) {
        const dt = t / el.children().length;
        for (let i = 0; i < el.children().length; i++) {
            const childEl = el.children()[i];
            const child = $(childEl);
            if (devault) setTimeout(() => child.removeClass(klass), t);
            // if (cb) cb(child, t / child.children().length);
            if (cb) cb(child, t);
            t += dt;
        }
    }
    // for one-level destructuring
    // (e.g. <li><i class"fa fas=something></i> Something</li>)

    renderChildrenInOrderEvenly(el, klass, t, cb = null, devault = true) {
        const dt = t / el.children().length;
        for (let i = 0; i < el.children().length; i++) {
            const child = el.children()[i];
            const element = $(child);
            // if ($(child).hasClass("hidden")) {
            if (element.children().length > 0) {
                if (devault) () => element.removeClass(klass);
                this.renderChildrenInOrderEvenly(element, t, cb, devault);
                t += dt / element.children().length;
            } else {
                if (devault) setTimeout(() => element.removeClass(klass), t);
                if (cb) cb(element);
                t += dt;
            }
        }
    }
}

class Header extends Komponent {
    constructor(options) {
        super(options);
        this.header = $$("header.hidden");
    }

    render() {
        $$(() => setTimeout(() => this.header.removeClass("hidden"), 500));
    }
}

class Bar extends Komponent {
    constructor(options) {
        super(options);
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
                $$(child).toggleClass("hidden");
            });
            this.toggleForm();
            this.opened = false;
        } else {
            this.toggleForm();
            setTimeout(() => {
                this.uploadForm.children().each((child) => {
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

class UploadForm extends Komponent {
    constructor(options) {
        super(options);
        this.form = $$("form.hidden");
    }

    render() {
        
    }
}

class MemesContainer extends Komponent {
    constructor(options) {
        super(options);
        this.memesContainer = $$(".memes-container.hidden");
    }

    render() {
        $$(() => setTimeout(() => this.memesContainer.removeClass("hidden"), 500));        
        this.memesContainer.children().each((child) => {
            const node = $$(child);
            node.removeClass("hidden");
            setTimeout(() => {
                node.children().each((child) => $$(child).removeClass("hidden"))
            }, 1000);
        })
    }
}
