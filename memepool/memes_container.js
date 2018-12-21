import Komponent from "./komponent.js";

class MemesContainer extends Komponent {
    constructor(options) {
        super(options);
        this.memesContainer = $$(".memes-container.hidden");
        this.header = $$(".memes-container header p");
        this.memes = $$(".memes-container ul");
    }

    setHeader() {

    }

    appendMemes() {
        this.database = firebase.database().ref("memes");
        this.database.on("child_added", (snapshot) => {
            const data = snapshot.val();
            this.memes.append(`<li class="hidden"><img src="${data.url}"><a href="${data.url}" class="hidden">${data.title}</a></li>`);
            const meme = $$(`.memes-container ul li`);
            // const link = $$(`.memes-container ul li a`);
            setTimeout(() => meme.removeClass("hidden"), 1100);
            // meme.on("mouseenter", () => {
            //     link.removeClass("hidden");
            // });
            // meme.on("mouseleave", () => {
            //     link.addClass("hidden");
            // });
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