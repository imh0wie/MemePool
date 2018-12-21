import { Komponent } from "./komponent";

class UploadForm extends Komponent {
    constructor(options) {
        super(options);
        this.form = $$(".content form.hidden");
        this.loadingBarContainer = $$(".content form .loading-bar");
        this.loadingBar = $$(".content form .loading-bar .bar");
        this.loadingProgress = $$(".content form .loading-bar .progress");
        this.titleInput = $$(".content form .blanks label .title");
        this.upperTextInput = $$(".content form .blanks label .upper-text");
        this.lowerTextInput = $$(".content form .blanks label .lower-text");
        this.tagsInput = $$(".content form .blanks label .tags");
        this.tagsButton = $$(".content form .blanks label .input-container .add-button");
        this.tagsContainer = $$(".content form .blanks label .tags-container");
        this.fileInput = $$(".content form .blanks .file");
        this.preview = $$(".content form .preview");
        this.canvas = $$(".content form .preview canvas");
        this.defaultMeme = $$(".content form .preview img");
        this.previewButton = $$(".content form .preview .buttons-container .step.i button");
        this.submitButton = $$(".content form .preview .buttons-container .step.ii button");
        this.titleInputEl = options.titleInputEl;
        this.upperTextInputEl = options.upperTextInputEl;
        this.lowerTextInputEl = options.lowerTextInputEl;
        this.tagsInputEl = options.tagsInputEl;
        this.fileInputEl = options.fileInputEl;
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
    }

    handleTags(e) {
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
        this.tags.splice(tagNameIdx, 1);
        tag.parent().remove();
    }

    handleUpload(e) {
        this.previewCtx.clearRect(0, 0, 180, 280);
        this.file = e.currentTarget.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", function() {
            this.img.src = reader.result;
        }, false)
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
                        // this.loadingBarContainer.toggleClass("standby");
                        // this.loadingBar.attr("css", { width: `${Math.round(progress * 200)}px`, });
                        // this.loadingProgress.html(`${Math.round(progress)}%`);
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
                        // this.loadingBarContainer.toggleClass("standby");
                        // this.loadingBar.attr("css", { width: "0px"});
                        // this.loadingProgress.html("0%");
                        this.toggleContent();
                        setTimeout(() => this.toggleContainer(), 150);
                    }
                );
        });
    }

    ready() {
        this.titleInput.on("change", (e) => this.title = e.currentTarget.value.toUpperCase());
        this.upperTextInput.on("change", (e) => this.upperText = e.currentTarget.value.toUpperCase());
        this.lowerTextInput.on("change", (e) => this.lowerText = e.currentTarget.value.toUpperCase());
        this.tagsButton.off('click');
        this.tagsButton.on("click", (e) => this.handleTags(e));
        this.tagsRemovers = $$(".content form .blanks label .tags-container .tag .cross");
        this.tagsRemovers.each((remover) => $$(remover).on("click", (e) => this.removeTags(e, $$(remover))));
        this.fileInput.on("change", (e) => this.handleUpload(e));
        this.previewButton.on("click", (e) => this.handlePreview(e));
        this.submitButton.on("click", (e) => this.handleSubmit(e));
        // this.drawPreview();
    }
}

export default UploadForm;