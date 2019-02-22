import Komponent from "./komponent";

class MemesContainer extends Komponent {
    constructor(options) {
        super(options);
        this.memesContainer = $$(".content .memes-container");
        this.header = $$(".content .memes-container header p");
        this.memes = $$(".content .memes-container ul");
        this.database = options.database
    }

    setHeader(tag) {
        this.header.val(`#${tag}`);
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

export default MemesContainer;