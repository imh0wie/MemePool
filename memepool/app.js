document.addEventListener("DOMContentLoaded", () => {
    const documentEl = $$(document);
    const previewCanvas = document.getElementById("canvas");
    const previewCtx = previewCanvas.getContext("2d");
    const previewImg = document.getElementById("preview");
    const file = document.querySelector(".content form .blanks .file").files[0];
    const bgBars = $$(".bg-bars").children();
    $$(function() {
        bgBars.each(bar => {
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
        previewCanvas: previewCanvas,
        previewCtx: previewCtx,
        previewImg: previewImg,
        file: file,
    };
    memepool = new MemePool(options);
    memepool.render();
});

class MemePool {
    constructor(options) {
        this.header = new Header(options);
        this.uploadForm = new UploadForm(options);
        this.bar = new Bar(Object.assign(options, { uploadForm: this.uploadForm }));
        this.memesContainer = new MemesContainer(options);
    }

    render() {
        this.header.render();
        this.bar.render();
        this.uploadForm.ready();
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
            if (devault) setTimeout(() => $$(child).removeClass(klass), t);
            if (cb) cb(child, t);
        }
    }

    toggleChildren(el, klass, t, cb = null, devault = true) {
        el.children().each((child) => {
            if (devault) $$(child).toggleClass(klass);
            if (cb) cb(child, t);
        })
    }

    renderChildrenInOrder(el, klass, t, cb = null, devault = true) {
        const dt = t / el.children().length;
        for (let i = 0; i < el.children().length; i++) {
            const childEl = el.children()[i];
            const child = $$(childEl);
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
            const element = $$(child);
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

class Header {
    constructor() {
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
        this.uploadButton.toggleClass("pressed");
        this.uploadForm.toggleContainer();
    }

    toggle() {
        if (this.opened) {
            this.uploadForm.toggleContent();
            setTimeout(() => this.toggleForm(), 80);
            this.opened = false;
        } else {
            this.toggleForm();
            setTimeout(() => {
                this.uploadForm.toggleContent();                
            }, 250);
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
        this.titleInput = $$(".content form .blanks title");
        this.upperTextInput = $$(".content form .blanks upper-text");
        this.lowerTextInput = $$(".content form .blanks lower-text");
        this.tagsInput = $$(".content form .blanks tags");
        this.preview = $$(".content form .preview");
        this.fileInput = $$(".content form .preview input");
        this.submitButton = $$(".content form .preview button");
        this.previewCanvas = options.previewCanvas;
        this.previewCtx = options.previewCtx;
        // this.previewImg = options.previewImg;
        this.file = options.file;
        this.drawPreview = this.drawPreview.bind(this);
    }

    toggleContainer() {
        this.form.toggleClass("hidden");
    }
    
    toggleContent() {
        this.toggleChildren(this.form, "hidden", 0);
        // if (!this.reader) this.reader = new FileReader();
        // this.reader.onload = () => {
        debugger
        if (!this.img) {
            this.img = new Image(360, 480);
            // this.img.onload = function() {
            //     this.previewCtx.drawImage(this.img, 0, 0, 180, 240);
            // }
        }
        this.img.src = this.file ? this.file : "./assets/images/default_meme.png";
        debugger
        this.drawPreview();
        // };
        // reader.readAsText(this.file);
    }

    handleUpload(e) {
        this.previewCtx.clearRect(0, 0, 180, 240);
        this.file = e.currentTarget.files[0];
        const reader = new FileReader();
        debugger
        // reader.onloadend = function() {
        //     debugger
        //     this.img.src = reader.readAsDataURL(this.file);
        //     debugger
        // }.bind(this);
        reader.addEventListener("load", function() {
            debugger
            this.img.src = reader.result;
        }, false)
        debugger
        this.drawPreview();
        // reader.addEventListener("load", function() {
        //     this.previewImg.src = reader.result;
        // }, false)
        // if (this.file) {
        //     debugger
        //     reader.readAsDataURL(this.file);
        //     debugger
        // }
    }

    drawPreview() {
        // debugger        
        // this.previewImg = new Image(360, 480);
        this.previewCanvas.width = 180;
        this.previewCanvas.height = 240;
        // this.previewCtx.clearRect(0, 0, 180, 240);
        this.previewCtx.drawImage(this.img, 0, 0, 180, 240);
        debugger
        // if (this.file) {
        //     debugger
        //     if (source) this.previewImg.src = source;
        //     this.previewCtx.drawImage(this.previewImg, 0, 0);
        // } else {
        //     debugger
        //     this.previewImg = new Image();
        //     this.previewImg.src = "./assets/images/default_meme.png";
        //     debugger
        // }

    }

    ready() {
        this.titleInput.on("change", (e) => this.title = e.currentTarget.value());
        this.upperTextInput.on("change", (e) => this.upperText = e.currentTarget.value());
        this.lowerTextInput.on("change", (e) => this.lowerText = e.currentTarget.value());
        this.tagsInput.on("change", (e) => this.tags = e.currentTarget.value().split(" "));
        this.fileInput.on("change", (e) => this.handleUpload(e));
        debugger
        // this.drawPreview();
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
