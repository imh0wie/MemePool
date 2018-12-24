// import { MemePool } from "./memepool";

document.addEventListener("DOMContentLoaded", () => {
    const documentEl = $$(document);
    // const previewCanvas = document.getElementById("canvas");
    // const previewCtx = previewCanvas.getContext("2d");
    // const previewImg = document.getElementById("default-meme");
    // const file = document.querySelector(".content form .blanks .file").files[0];
    // const titleInputEl = document.querySelector(".content form .blanks .title");
    // const upperTextInputEl = document.querySelector(".content form .blanks .upper-text");
    // const lowerTextInputEl = document.querySelector(".content form .blanks .lower-text");
    // const tagsInputEl = document.querySelector(".content form .blanks .tags");
    // const fileInputEl = document.querySelector(".content form .blanks .file");
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
        // titleInputEl: titleInputEl,
        // upperTextInputEl: upperTextInputEl,
        // lowerTextInputEl: lowerTextInputEl,
        // tagsInputEl: tagsInputEl,
        // fileInputEl: fileInputEl,
        // previewCanvas: previewCanvas,
        // previewCtx: previewCtx,
        // previewImg: previewImg,
        // file: file,
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
        this.uploadButton = $$(".bar .inner-bar .add-button");
        this.uploadForm = options.uploadForm;
        this.opened = false;
    }

    toggleForm() {
        this.uploadButton.toggleClass("pressed");
        this.uploadForm.toggleContainer();
    }

    toggle() {
        this.file = $$(".content form .blanks .file").val();
        if (!this.file && !this.uploaded) this.opened = false;
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
        this.form = $$(".content form.hidden");
        this.left = $$(".content form .blanks");
        this.titleInputEl = document.querySelector(".content form .blanks .title");
        this.titleLabel =  $$(".content form .blanks .title-field");
        this.titleInput = $$(".content form .blanks label .title");
        this.upperTextLabel = $$(".content form .blanks .upper-text-field");
        this.upperTextInput = $$(".content form .blanks label .upper-text");
        this.lowerTextLabel = $$(".content form .blanks .lower-text-field");
        this.lowerTextInput = $$(".content form .blanks label .lower-text");
        this.tagsLabel =  $$(".content form .blanks .tags-field");
        this.tagsInput = $$(".content form .blanks label .tags");
        this.tagsButton = $$(".content form .blanks .tags-field .input-container .add-button");
        this.tagsContainer = $$(".content form .blanks label .tags-container");
        this.fileInput = $$(".content form .blanks .file");
        this.right = $$(".content form .preview");
        this.canvas = $$(".content form .preview canvas");
        this.defaultMeme = $$(".content form .preview #default-meme");
        this.buttonsContainer = $$(".content form .preview .buttons-container");
        this.previewButton = $$(".content form .preview .buttons-container .step.i button");
        this.submitButton = $$(".content form .preview .buttons-container .step.ii button");
        this.upperTextInputEl = document.querySelector(".content form .blanks .upper-text");
        this.lowerTextInputEl = document.querySelector(".content form .blanks .lower-text");
        this.tagsInputEl = document.querySelector(".content form .blanks .tags");
        this.fileInputEl = document.querySelector(".content form .blanks .file");
        this.previewCanvas = document.querySelector(".content form .preview #canvas")
        // this.previewImg = options.previewImg;
        this.file = options.file;
        this.opened = false;
        this.drawPreview = this.drawPreview.bind(this);
        // this.handleTags = this.handleTags.bind(this);
    }
    
    toggleContainer() {
        this.form.toggleClass("hidden");
    }

    // appendLeft() {
    //     this.form.append('');
        
    //     this.left.append('');
    //     // this.titleInput.on("change", (e) => this.title = e.currentTarget.value.toUpperCase());

    //     this.left.append('');
    //     // this.upperTextInput.on("change", (e) => this.upperText = e.currentTarget.value.toUpperCase());
        
    //     this.left.append('');
    //     // this.lowerTextInput.on("change", (e) => this.lowerText = e.currentTarget.value.toUpperCase());
        
    //     this.left.append('');
    //     // this.tagsButton.on("click", (e) => this.handleTags(e))
        
    //     this.left.append('');
    // }

    // appendRight() {
    //     this.form.append('');

    //     this.right.append('');

    //     this.right.append('');

    //     this.right.append('');

    //     this.buttonsContainer.append('');

    //     this.buttonsContainer.append('');
    //     debugger
    // }
    
    toggleContent() {
        // if (!this.opened) {

        // }
        if (this.file) {
            this.canvas.removeClass("none");
            this.defaultMeme.addClass("none");
        } else {
            this.canvas.addClass("none");
            this.defaultMeme.removeClass("none");
        }
        this.toggleChildren(this.form, "removed", 0);
        // if (this.opened) {
        //     debugger
        //     this.removeLeft();
        //     this.removeRight();
        // }
        // this.opened = this.opened ? false : true;
        this.ready();
    }

    removeLeft() {
        this.form.remove(".content form .blanks");
    }

    removeRight() {
        this.form.remove(".content form .preview");
    }

    handleTags(e) {
        // debugger
        e.preventDefault();
        if (!this.tags) this.tags = [];
        const tag = this.tagsInput.val().toLowerCase();
        if (!this.tagsInput.val() || this.tags.includes(tag)) return;
        this.tags.push(tag);
        this.tagsContainer.append(`<p class="tag"><span class="tag-name">#${tag}</span><span class="cross">X</span></p>`);
        this.tagsInputEl.value = "";
        this.ready();
    }

    removeTags(e, tag) {
        e.preventDefault();
        const tagName = $$(tag.parent().children().nodes[0]).html().slice(1);
        const tagNameIdx = this.tags.indexOf(tagName);
        this.tags.splice(tagNameIdx, 1); // removing tag from tags array
        tag.parent().remove();
    }

    handleUpload(e) {
        e.preventDefault();
        this.previewCtx = this.previewCanvas.getContext("2d");
        this.previewCtx.clearRect(0, 0, 180, 280);
        this.file = e.currentTarget.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", function() {
            this.img.src = reader.result;
        }, false)
        // this.uploaded = true;
    }

    handlePreview(e) {
        e.preventDefault();
        if (this.file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.img = new Image(180, 280);
                this.img.src = reader.result;
                this.canvas.removeClass("none");
                this.defaultMeme.addClass("none");
                this.drawPreview();
                this.submitButton.removeClass("disabled");
                this.submitButton.addClass("ready");
                if (!this.titleInput.val()) {
                    this.titleInputEl.value = this.file.name.slice(0, -4);
                    this.title = this.file.name.slice(0, -4);
                } else {
                    this.title = this.titleInput.val();
                }
                this.upperText = this.upperTextInput.val();
                this.lowerText = this.lowerTextInput.val();
            }
            reader.readAsDataURL(this.file);
        } else {
            console.log("No file found");
        }
    } 

    drawPreview() {
        this.previewCanvas.width = 180;
        this.previewCanvas.height = 280;
        this.previewCtx.clearRect(0, 0, 180, 280);
        this.previewCtx.drawImage(this.img, 0, 0, 180, 280);
        this.fontSize = this.previewCanvas.width / 9;
        this.previewCtx.font = `${this.fontSize}px Impact`;
        this.previewCtx.fillStyle = "#fff";
        this.previewCtx.strokeStyle = "#333";
        this.previewCtx.lineWidth = this.fontSize / 15;
        this.previewCtx.textAlign = "center";

        this.previewCtx.textBaseline = "top";
        this.upperText.split("\n").forEach((line, i) => {
            this.previewCtx.fillText(line.toUpperCase(), this.previewCanvas.width / 2, i * this.fontSize, this.previewCanvas.width);
            this.previewCtx.strokeText(line.toUpperCase(), this.previewCanvas.width / 2, i * this.fontSize, this.previewCanvas.width);
        })

        this.previewCtx.textBaseline = "middle";
        this.lowerText.split("\n").forEach((line, i) => {
            this.previewCtx.fillText(line.toUpperCase(), this.previewCanvas.width / 2, this.previewCanvas.height - (this.lowerText.split("\n").length - i) * this.fontSize, this.previewCanvas.width);
            this.previewCtx.strokeText(line.toUpperCase(), this.previewCanvas.width / 2, this.previewCanvas.height - (this.lowerText.split("\n").length - i) * this.fontSize, this.previewCanvas.width);
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.file) return;
        this.formStatus = {
            title: false,
            upperText: false,
            lowerText: false,
            tags: false,
        };
        if (!this.title || this.title.includes("\\") || this.title.includes("?") || this.title.includes("%") || this.title.includes("*")) {
            this.titleInput.addClass("input-error");
            if (!this.titleMsg) this.titleMsg = $$(".content form .blanks .title-field .msg");
            this.titleMsg.html('Invalid characters: \\ ? % *');
        } else {
            this.titleInput.removeClass("input-error");
            this.formStatus["title"] = true;
            if (this.titleMsg) this.titleMsg.html(" ");
        }
        if (!this.upperText && !this.lowerText) {
            this.upperTextInput.addClass("input-error");
            this.lowerTextInput.addClass("input-error");
            if (!this.upperTextMsg) this.upperTextMsg = $$(".content form .blanks .upper-text-field .msg");
            if (!this.lowerTextMsg) this.lowerTextMsg = $$(".content form .blanks .lower-text-field .msg");
            this.upperTextMsg.html('1 field needs to be filled.');
            this.lowerTextMsg.html('1 field needs to be filled.');
        }
        if (this.upperText) {
            this.formStatus["upperText"] = true;
            this.upperTextInput.removeClass("input-error");
            if (this.upperTextMsg) this.upperTextMsg.html(" ");
        }
        if (this.lowerText) {
            this.formStatus["lowerText"] = true;
            this.lowerTextInput.removeClass("input-error");
            if (this.lowerTextMsg) this.lowerTextMsg.html(" ");
        }
        if (!this.tags || this.tags.length === 0) {
            this.tagsInput.addClass("input-error");            
            if (!this.tagsMsg) this.tagsMsg = $$(".content form .blanks .tags-field .msg");
            this.tagsMsg.html("At least 1 tag required")
        } else {
            this.tagsInput.removeClass("input-error");
            this.formStatus["tags"] = true;
            if (this.tagsMsg) this.tagsMsg.html(" ");
        }
        const counter = 0;
        for (let key in this.formStatus) {
            if (!this.formStatus[key] && (key !== "upperText" || key !== "lowerText")) return; // title and tags required
            if (!this.formStatus[key] && key === "upperText") {
                counter += 1;
            } else if (!this.formStatus[key] && key === "lowerText" && counter > 0) {
                return;
            }
        }
        this.fileName = this.title.toLowerCase().split(" ").join("-");
        this.fileType = this.file.name.split("").reverse().slice(0, 4).reverse().join("");
        const storageRef = firebase.storage().ref(); // /memes/${this.fileName}${this.fileType}
        const memeRef = storageRef.child(`${this.fileName}${this.fileType}`);
        const uploadTask = memeRef.putString(this.previewCanvas.toDataURL(), 'data_url');
        uploadTask.on("state_changed",
            (snapshot) => {
                this.titleInputEl.value = "";
                this.upperTextInputEl.value = "";
                this.lowerTextInputEl.value = "";
                this.tagsInputEl.value = "";
                this.fileInputEl.value = "";
                this.submitButton.removeClass("ready");
                this.submitButton.addClass("disabled");
                this.tagsContainer.children().each(child => child.remove());
                this.file = "";
                this.canvas.addClass("none");
                this.defaultMeme.removeClass("none");
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case "paused":
                        console.log('Upload is paused');
                        break;
                    case "running":
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                switch (error.code) {
                    case "storage/canceled":
                        console.log("User canceled the upload")
                        break;
                    case "storage/unknown":
                        console.log("Unknown error occurred, inspect error.serverResponse");
                        break;
                }
            }, 
            () => {
                uploadTask.snapshot.ref.getDownloadURL()
                .then(
                    (downloadURL) => {
                        console.log(downloadURL);
                        this.url = downloadURL;
                    }
                ).then(
                    () => {
                        const dataRef = firebase.database().ref("memes");
                        const memeData = {
                            title: this.title,
                            tags: this.tags,
                            upperText: this.upperText,
                            lowerText: this.lowerText,
                            url: this.url,
                        };
                        dataRef.push(memeData);
                    }
                ).then(
                    () => {
                        this.toggleContent();
                        setTimeout(() => this.toggleContainer(), 150);
                    }
                );
        });
    }

    ready() {
        // debugger
        if (this.titleInput) this.titleInput.on("change", (e) => this.title = e.currentTarget.value.toUpperCase());
        if (this.upperTextInput) this.upperTextInput.on("change", (e) => this.upperText = e.currentTarget.value.toUpperCase());
        if (this.lowerTextInput) this.lowerTextInput.on("change", (e) => this.lowerText = e.currentTarget.value.toUpperCase());
        if (this.tagsButton) this.tagsButton.off('click');
        if (this.tagsButton) this.tagsButton.on("click", (e) => this.handleTags(e));
        this.tagsRemovers = $$(".content form .blanks label .tags-container .tag .cross");
        if (this.tagsRemovers) this.tagsRemovers.each((remover) => $$(remover).on("click", (e) => this.removeTags(e, $$(remover))));
        if (this.fileInput) this.fileInput.on("change", (e) => this.handleUpload(e));
        if (this.previewButton) this.previewButton.on("click", (e) => this.handlePreview(e));
        if (this.submitButton) this.submitButton.on("click", (e) => this.handleSubmit(e));
        // this.drawPreview();
    }
}

class MemesContainer extends Komponent {
    constructor(options) {
        super(options);
        this.memesContainer = $$(".content .memes-container");
        this.header = $$(".content .memes-container header p");
        this.memes = $$(".content .memes-container ul");
    }

    setHeader() {

    }

    appendMemes() {
        this.database = firebase.database().ref("memes");
        let i = 0;
        this.database.on("child_added", (snapshot) => {
            const data = snapshot.val();
            // const file = new File([data.url], data.title.toLowerCase().split(" ").join());
            const memesItem = `<li class="hidden" id="m${i}"><img src="${data.url}"><a href="${data.url}" download="${data.title.toLowerCase()}" id="a${i}">${data.title}</a></li>`;
            this.memes.append(memesItem); // <a href="${data.url}" class="hidden">Download</a>
            // this.memes.append(`<li class="hidden"><img src="${data.url}"><form method="get" action="${data.url}"><button type="submit">${data.title}</button></form></li>`); // <a href="${data.url}" class="hidden">Download</a>
            this.meme = $$(".content .memes-container ul li");
            this.memeTitle = $$(".content .memes-container ul li a");
            this.memeTitle.on("click", () => {
                const xhr = new XMLHttpRequest();
                xhr.repsonseType = "blob";
                xhr.onload = (event) => {
                    const blob = xhr.response;
                }
                xhr.open("GET", data.url);
                xhr.send();
            }) // check (no internet)
            setTimeout(() => this.meme.removeClass("hidden"), 1100);
            // this.memeTitle.removeClass("hidden");
            // this.meme.removeClass("hidden");
            i++;
        });
    }

    render() {
        setTimeout(() => this.memesContainer.removeClass("hidden"), 500);
        setTimeout(() => this.header.removeClass("hidden"), 1000);
        this.appendMemes();
        // this.memesContainer.children().each((komponent) => {
        //     const node = $$(komponent);
        //     // node.removeClass("hidden");
        //     setTimeout(() => {
        //         node.children().each(child => $$(child).removeClass("hidden"))
        //     }, 1000);
        // })

    }
}
