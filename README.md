# MemePool

MemePool is an image-sharing application for users to search, customize and share memes. It is built by JavaScript and a customized JavaScript library inspired by jQuery and has a simple API for developers of all levels.
![memepool](assets/images/memepool_preview.png)

## Feature Highlights
### Customized library
The application is supported by a customized library which is built for HTML manipulation and traversal, event handling, and AJAX. With `$$(selector)` as the core function to select elements, the library provides developers easy-to-use methods such as `val()`, `.on(event, callback)`, `.off(event, callback)`, `.append(newNodes)`, `$$.ajax(object)` etc. 
```javascript
// jqueery.js
window.$$ = (argument) => {
    switch (typeof argument) {
        case "string":
            const nodes = document.querySelectorAll(argument);
            const nodesArr = Array.from(nodes);
            return new NodeCollection(nodesArr);  
        case "object":
            if (argument instanceof HTMLElement || argument instanceof Document) return new NodeCollection([argument]);
        case "function":
            _ready ? argument() : _callbacksOnReady.push(argument);
    }
};

$$.ajax = (object) => {
    const defaults = { // setting default state of object with required props
        method: "GET",
        url: "",
        data: {},
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: () => console.log("AJAX request fired"),
        error: () => console.log("AJAX Error"),
    }
    object = $$.extend(defaults, object); // merging defaults and argument
    object.method = object.method.toUpperCase(); // remove case sensitivity
    if (object.method === "GET") object.url += `?${querify(object.data)}`;
    
    const xhr = new XMLHttpRequest();
    xhr.open(object.method, object.url, true); // XMLHttpRequest.open(method, url, async)
    xhr.onload = (e) => {
        if (xhr.status === 200) {
            object.success(xhr.response);
        } else {
            object.error(xhr.response);
        }
    };

    xhr.send(JSON.stringify(object.data));
}
```
```javascript
// node_collection.js
class NodeCollection {
  constructor(nodes) {
    this.nodes = nodes; // an array of HTML Elements
  }
  // ...
  val(newValue) {
    if (newValue) {
        this.nodes[0].value = newValue;
    } else {
        return this.nodes.length > 0 ? this.nodes[0].value : null;
    }
  }
  // ...
  append(newNodes) {
    if (this.nodes.length === 0) {
      return ;
    } else if (typeof newNodes === "object" && !(newNodes instanceof NodeCollection)) {
      newNodes = $l(newNodes);
    }
    if (typeof newNodes === "string") {
      this.each((node) => {
        node.innerHTML += newNodes;
      });
    } else if (newNodes instanceof NodeCollection) {
      this.each((node) => {
        newNodes.each((newNode) => {
          node.appendChild(newNode.cloneNode(true));
        });
      });
    }
  }
  // ...
  on(event, callback) {
    this.each((node) => {
      node.addEventListener(event, callback);
      const eventKey = `jqueeryEvents-${event}`;
        if (typeof node[eventKey] === "undefined") {
          node[eventKey] = [];
        }
      node[eventKey].push(callback);
    });
  }

  off(event) {
    this.each((node) => {
      const eventKey = `jqueeryEvents-${event}`;
      if (node[eventKey]) {
        node[eventKey].forEach((callback) => {
          node.removeEventListener(event, callback);
        });
      }
    node[eventKey] = [];
    });
  }
}
```
### Real-time photo database
Harnassing the power of Google Firebase's Realtime Database for storing data of photos and Cloud Firestone for storing image files, the application allows users to create their own memes with personal images and share them by uploading to the database. New meme will always be shown right after the upload.

```javascript
// upload_form.js
class UploadForm {
  // additional supporting methods (e.g. toggleContent())
  handleSubmit() {
    // ...
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
        let progress = (snapshot.bytesTransferred /snapshot.totalBytes) * 100;
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
      }
    );
  }
}
```

### Meme Searching by Tag
Beside uploading self-designed memes, users can search for memes in our database by a tag. When a user is typing in the search bar, tag recommendations would be shown along with the number of memes found having the tag.

```javascript
class Bar extends Komponent {
  constructor(options) {
    super(options);
    this.database = options.database;
    // ...
    this.searchBar = $$(".bar .inner-bar #search-container input");
    this.tags = [];
    this.memesContainer = options.memesContainer
  }
  // additional supporting methods (e.g. toggleContent())
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
        this.modal = new Modal(options);
        this.modal.render();
      } else {
        this.modal.update();
      }
    } else {
      this.removeModal();
    }
  }

  handleSubmit() {
    this.memesContainer.setHeader(this.searchBar.val());
    this.memesContainer.removeMemes();
    setTimeout(() => {
      this.memesContainer.endLoading();
      this.memesContainer.appendMemes(this.searchBar.val());
    }, 3000);
  }

  render() {
    // ...
    this.searchBar.on("input", () => this.handleInput());
    this.searchBar.on("submit", () => this.handleSubmit());
  }
}
```
```javascript
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

  render() {
    this.loadList();
    this.modal = $$('.bar .modal');
    this.modal.removeClass('folded');
    this.load();
    this.showList();
  }
  // additional supporting methods (e.g. update())
}
```

## Technologies Used
+ Vanilla JavaScript
+ Google Firebase

## Technologies Used
+ Order for Tag Recommendations
+ Multiple-tag Searching
+ Sizing Control for Memes
+ Full Stack Implementation