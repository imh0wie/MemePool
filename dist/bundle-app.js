/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./memepool/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./memepool/app.js":
/*!*************************!*\
  !*** ./memepool/app.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _memepool__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./memepool */ "./memepool/memepool.js");


document.addEventListener("DOMContentLoaded", () => {
    const documentEl = $$(document);
    const bgBars = $$(".bg-bars").children();
    $$(function() {
        bgBars.each(bar => {
            setTimeout(() => $$(bar).removeClass("hidden"), 0);
        });
    });
    const options = {
        documentEl: documentEl,
        database: firebase.database().ref("memes")
    };
    const memepool = new _memepool__WEBPACK_IMPORTED_MODULE_0__["default"](options);
    memepool.render();
});

/***/ }),

/***/ "./memepool/bar.js":
/*!*************************!*\
  !*** ./memepool/bar.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _komponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./komponent */ "./memepool/komponent.js");
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modal */ "./memepool/modal.js");


class Bar extends _komponent__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(options) {
        super(options);
        this.database = options.database;
        this.bar = $$(".bar.hidden")
        this.uploadButton = $$(".bar .inner-bar .add-button");
        this.uploadForm = options.uploadForm;
        this.opened = false;
        this.searchBar = $$(".bar .inner-bar #search-container input");
        this.tags = [];
        this.memesContainer = options.memesContainer
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

    removeModal() {
        this.modal.remove();
        this.modal = null;
    }

    handleInput() {
      this.database.once('value', (snapshot) => {
        this.tagStore = {};
        snapshot.forEach((childSnapshot) => {
          const tags = childSnapshot.val().tags;
          tags.forEach(tag => this.tagStore[tag] ? this.tagStore[tag] += 1 : this.tagStore[tag] = 1);
        });
      });
      if (this.searchBar.val().length > 0) {
        if (!this.modal) {
          const options = {
            bar: this,
            searchBar: this.searchBar,
            memesContainer: this.memesContainer,
            tagStore: this.tagStore 
          };
          this.modal = new _modal__WEBPACK_IMPORTED_MODULE_1__["default"](options);
          this.modal.render();
        } else {
          this.modal.update();
        }
      } else {
        this.removeModal();
      }
    }

    handleSubmit() {
        this.memesContainer.removeMemes();
        setTimeout(() => {
            this.memesContainer.endLoading();
            this.memesContainer.appendMemes(this.searchBar.val());
        }, 3000);
    }

    render() {
        $$(() => setTimeout(() => this.bar.removeClass("hidden"), 500));
        this.uploadButton.on("click", () => this.toggle());
        this.searchBar.on("input", () => this.handleInput());
        this.searchBar.on("submit", () => this.handleSubmit());
    }
}

/* harmony default export */ __webpack_exports__["default"] = (Bar);

/***/ }),

/***/ "./memepool/header.js":
/*!****************************!*\
  !*** ./memepool/header.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class Header {
    constructor() {
        this.header = $$("header.hidden");
    }

    render() {
        $$(() => setTimeout(() => this.header.removeClass("hidden"), 500));
    }
}

/* harmony default export */ __webpack_exports__["default"] = (Header);

/***/ }),

/***/ "./memepool/komponent.js":
/*!*******************************!*\
  !*** ./memepool/komponent.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (Komponent);

/***/ }),

/***/ "./memepool/memepool.js":
/*!******************************!*\
  !*** ./memepool/memepool.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _header__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./header */ "./memepool/header.js");
/* harmony import */ var _bar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bar */ "./memepool/bar.js");
/* harmony import */ var _upload_form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./upload_form */ "./memepool/upload_form.js");
/* harmony import */ var _memes_container__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./memes_container */ "./memepool/memes_container.js");





class MemePool {
    constructor(options) {
        this.header = new _header__WEBPACK_IMPORTED_MODULE_0__["default"](options);
        this.uploadForm = new _upload_form__WEBPACK_IMPORTED_MODULE_2__["default"](options);
        this.memesContainer = new _memes_container__WEBPACK_IMPORTED_MODULE_3__["default"](options);
        this.bar = new _bar__WEBPACK_IMPORTED_MODULE_1__["default"](Object.assign(options, { uploadForm: this.uploadForm, memesContainer: this.memesContainer }));
    }

    render() {
        this.header.render();
        this.bar.render();
        this.uploadForm.ready();
        this.memesContainer.render();
    }
}

/* harmony default export */ __webpack_exports__["default"] = (MemePool);

/***/ }),

/***/ "./memepool/memes_container.js":
/*!*************************************!*\
  !*** ./memepool/memes_container.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _komponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./komponent */ "./memepool/komponent.js");


class MemesContainer extends _komponent__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(options) {
        super(options);
        this.memesContainer = $$(".content .memes-container");
        this.header = $$(".content .memes-container header p");
        this.memes = $$(".content .memes-container ul");
        this.database = options.database
    }

    setHeader() {

    }

    appendMeme(data) {
        const memesItem = `<li class="hidden"><img src="${data.url}"><a href="${data.url}" download="${data.title.toLowerCase()}">${data.title}</a></li>`;
        this.memes.append(memesItem); 
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
        })
        setTimeout(() => this.meme.removeClass("hidden"), 1100);
    }

    appendMemes(tag = null) {
        this.database.on("child_added", (snapshot) => {
            const data = snapshot.val();
            if (!tag) {
                this.appendMeme(data);
            } else {
                if (data.tags.includes(tag)) {
                    this.appendMeme(data);
                };
            }
        });
    }

    removeMemes() {
        this.memes.children().each(child => child.remove());
        this.memes.append('<img src="assets/images/loading.gif" class="loading">');
        this.loadingSign = $$(".loading");
    }

    endLoading() {
        this.loadingSign.remove();
    }

    render() {
        setTimeout(() => this.memesContainer.removeClass("hidden"), 500);
        setTimeout(() => this.header.removeClass("hidden"), 1000);
        this.appendMemes();
    }
}

/* harmony default export */ __webpack_exports__["default"] = (MemesContainer);

/***/ }),

/***/ "./memepool/modal.js":
/*!***************************!*\
  !*** ./memepool/modal.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class Modal {
  constructor(options) {
    this.bar = options.bar;
    this.searchBar = options.searchBar;
    this.tagStore = options.tagStore;
    this.tags = Object.keys(this.tagStore).sort();
  }

  loadList() {
    this.listElement = document.createElement('ul');
    this.listElement.classList.add('modal', 'folded');
    this.barElement = document.querySelector('.bar');
    this.barElement.appendChild(this.listElement);
    setTimeout(() => this.listElement.classList.remove('folded'), 100);
  }

  showList() {
    setTimeout(() => {
        this.loadingSign.remove();
        this.list = $$(".bar .modal");
        this.tags.forEach((tag) => {
          if (tag.includes(this.searchBar.val())) {
            const unit = this.tagStore[tag] > 1 ? "memes" : "meme";
            this.list.append(`<li class="recommendation"><p class="tag">#${tag}</p><p class="meme-count">${this.tagStore[tag]} ${unit} found</p></li>`);
            const recommendation = $$(".bar .modal .recommendation");
            recommendation.on('click', () => this.selectRecommendation(tag))
          }
        })
    }, 2500)
  }

  selectRecommendation(tag) {
    this.searchBar.val(tag);
    this.bar.removeModal();
    this.bar.handleSubmit();
  }

  load() {
    setTimeout(() => {
        this.modal.append('<img src="assets/images/loading.gif" class="loading">');
        this.loadingSign = $$(".loading");
    }, 200)
  }

  remove() {
    this.barElement.removeChild(this.listElement);
  }

  render() {
    this.loadList();
    this.modal = $$('.bar .modal');
    this.modal.removeClass('folded');
    this.load();
    this.showList();
  }

  update() {
    this.modal.children().each(child => child.remove());
    this.load();
    this.showList();
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Modal);

/***/ }),

/***/ "./memepool/upload_form.js":
/*!*********************************!*\
  !*** ./memepool/upload_form.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _komponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./komponent */ "./memepool/komponent.js");


class UploadForm extends _komponent__WEBPACK_IMPORTED_MODULE_0__["default"] {
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

/* harmony default export */ __webpack_exports__["default"] = (UploadForm);

/***/ })

/******/ });
//# sourceMappingURL=bundle-app.js.map