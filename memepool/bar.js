import Komponent from "./komponent";
import Modal from "./modal";
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
            bar: this.bar,
            searchBar: this.searchBar,
            tagStore: this.tagStore 
          };
          this.modal = new Modal(options);
          this.modal.render();
        } else {
          this.modal.update();
        }
      } else {
        this.modal.remove();
        this.modal = null;
      }
    }

    render() {
        $$(() => setTimeout(() => this.bar.removeClass("hidden"), 500));
        this.uploadButton.on("click", () => this.toggle());
        this.searchBar.on("input", (e) => this.handleInput(e));
    }
}

export default Bar;