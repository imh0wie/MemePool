import Komponent from "./komponent";

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
        this.file = options.file;
        this.opened = false;
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
        this.toggleChildren(this.form, "removed", 0);
        this.ready();
    }

    removeLeft() {
        this.form.remove(".content form .blanks");
    }

    removeRight() {
        this.form.remove(".content form .preview");
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
        if (this.lowerText) this.lowerText.split("\n").forEach((line, i) => {
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
        const storageRef = firebase.storage().ref();
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
    }
}

export default UploadForm;