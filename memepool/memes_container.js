import Komponent from "./komponent";

class MemesContainer extends Komponent {
    constructor(options) {
        super(options);
        this.memesContainer = $$(".content .memes-container");
        this.header = $$(".content .memes-container header p");
        this.memes = $$(".content .memes-container ul");
        this.database = options.database
    }

    setHeader() {

    }

    appendMemes() {
        // this.database = firebase.database().ref("memes");
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

export default MemesContainer;