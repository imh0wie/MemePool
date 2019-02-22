import Komponent from "./komponent.js";

class Bar extends Komponent {
    constructor(options) {
        super(options);
        this.database = options.database;
        this.bar = $$(".bar.hidden")
        this.uploadButton = $$(".bar .inner-bar .add-button");
        this.uploadForm = options.uploadForm;
        this.opened = false;
        this.searchBar = $$(".bar .inner-bar #search-container input");
        this.tags = [];
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

    handleInput() {
      console.log(this.searchBar.val());
      this.database.once('value', (snapshot) => {
        let arr = [];
        snapshot.forEach((childSnapshot) => {
          const tags = childSnapshot.val().tags;
          arr.push(tags);
        });
        arr = [].concat.apply([], arr);
        this.tags = Array.from(new Set(arr));
        debugger
      });
    }

    render() {
        $$(() => setTimeout(() => this.bar.removeClass("hidden"), 500));
        this.uploadButton.on("click", () => this.toggle());
        this.searchBar.on("input", () => this.handleInput());
    }
}

export default Bar;