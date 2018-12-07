document.addEventListener("DOMContentLoaded", () => {
    const documentEl = $$(document);
    const previewCanvas = document.getElementById("canvas");
    const previewCtx = previewCanvas.getContext("2d");
    const previewImg = document.getElementById("default-meme");
    const file = document.querySelector(".content form .blanks .file").files[0];
    const fileInputEl = document.querySelector(".content form .blanks input");
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
        fileInputEl: fileInputEl,
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
        this.upperTextInput = $$(".content form .blanks .upper-text");
        this.upperText = "";
        this.lowerTextInput = $$(".content form .blanks .lower-text");
        this.lowerText = "";
        this.tagsInput = $$(".content form .blanks tags");
        this.fileInput = $$(".content form .blanks input");
        this.fileInputEl = options.fileInputEl;
        this.preview = $$(".content form .preview");
        this.canvas = $$(".content form .preview canvas");
        this.defaultMeme = $$(".content form .preview img");
        this.previewButton = $$(".content form .preview .buttons-container .step.i button");
        this.submitButton = $$(".content form .preview .buttons-container .step.ii button");
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
        if (this.file) {
            this.canvas.removeClass("none");
            this.defaultMeme.addClass("none");
        } else {
            this.canvas.addClass("none");
            this.defaultMeme.removeClass("none");
        }
        this.toggleChildren(this.form, "hidden", 0);
        this.ready();
        // if (!this.reader) this.reader = new FileReader();
        // this.reader.onload = () => {
        // if (!this.img) {
            // this.img = new Image(360, 480);
            // this.img.onload = function() {
            //     this.previewCtx.drawImage(this.img, 0, 0, 180, 280);
            // }
        // }
        // this.img.src = this.file ? this.file : "./assets/images/default_meme.png";
        // debugger
        // this.drawPreview();
        // };
        // reader.readAsText(this.file);
    }

    handleUpload(e) {
        this.previewCtx.clearRect(0, 0, 180, 280);
        this.file = e.currentTarget.files[0];
        const reader = new FileReader();
        // reader.onloadend = function() {
        //     debugger
        //     this.img.src = reader.readAsDataURL(this.file);
        //     debugger
        // }.bind(this);
        reader.addEventListener("load", function() {
            this.img.src = reader.result;
        }, false)
        // this.drawPreview();
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
        this.previewCanvas.height = 280;
        this.previewCtx.clearRect(0, 0, 180, 280);
        this.previewCtx.drawImage(this.img, 0, 0, 180, 280);
        this.fontSize = this.previewCanvas.width / 9;
        debugger
        this.previewCtx.font = `${this.fontSize}px Impact`;
        this.previewCtx.fillStyle = "#fff";
        this.previewCtx.strokeStyle = "#333";
        this.previewCtx.lineWidth = this.fontSize / 15;
        this.previewCtx.textAlign = "center";

        this.previewCtx.textBaseline = "top";
        this.upperText.split("\n").forEach((line, i) => {
            this.previewCtx.fillText(line, this.previewCanvas.width / 2, i * this.fontSize, this.previewCanvas.width);
            this.previewCtx.strokeText(line, this.previewCanvas.width / 2, i * this.fontSize, this.previewCanvas.width);
        })

        this.previewCtx.textBaseline = "middle";
        this.lowerText.split("\n").forEach((line, i) => {
            this.previewCtx.fillText(line, this.previewCanvas.width / 2, this.previewCanvas.height - (this.lowerText.split("\n").length - i) * this.fontSize, this.previewCanvas.width);
            this.previewCtx.strokeText(line, this.previewCanvas.width / 2, this.previewCanvas.height - (this.lowerText.split("\n").length - i) * this.fontSize, this.previewCanvas.width);
        })
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
        this.titleInput.on("change", (e) => this.title = e.currentTarget.value.toUpperCase());
        this.upperTextInput.on("change", (e) => {
            this.upperText = e.currentTarget.value.toUpperCase();
        });
        this.lowerTextInput.on("change", (e) => this.lowerText = e.currentTarget.value.toUpperCase());
        this.tagsInput.on("change", (e) => this.tags = e.currentTarget.value.toUpperCase().split(" "));
        this.fileInput.on("change", (e) => this.handleUpload(e));
        this.previewButton.on("click", (e) => {
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = () => {
                this.img = new Image(180, 280);
                this.img.src = reader.result;
                this.canvas.removeClass("none");
                this.defaultMeme.addClass("none");
                this.drawPreview();
                this.submitButton.removeClass("disabled");
                this.submitButton.addClass("ready");
                this.fileInputEl.value = this.file.name.slice(0, -4);
                this.title = this.file.name.slice(0, -4);
                console.log(this.title);
                console.log(this.fileInputEl.value);
            }
            reader.readAsDataURL(this.file);
        })
        this.submitButton.on("click", (e) => {
            e.preventDefault();
            if (this.file) {
                console.log("Submitted!");
            } else {
                console.log("No file uploaded yet");
            }
        });
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
