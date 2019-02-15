# Memepool

Memepool is a photo-sharing application for users to search, customize and share memes. It is built by JavaScript and a customized JavaScript library inspired by jQuery for HTML manipulation and traversal, event handling, and AJAX. It has a simple API for developers of all levels.

## Feature Highlights
### Real-time photo database
Harnassing the power of Google Firebase's real-time database (for storing data of photos) and firestone (for storing image files), the application can show the new meme in database right after the user uploads his/her customized meme.

```javascript
// additional supporting methods (e.g. toggleContent())
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
```

## Technologies Used
+ Vanilla JavaScript
+ Google Firebase

## Future Implementations
+ Searching by tags