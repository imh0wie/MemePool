class Modal {
  constructor(options) {
    this.bar = options.bar;
    this.searchBar = options.searchBar;
    this.tagStore = options.tagStore;
    this.tags = Object.keys(this.tagStore).sort();
    // this.keyword = this.searchBar.val();
  }

  loadList() {
    this.listElement = document.createElement('ul');
    this.listElement.classList.add('modal', 'folded');
    this.barElement = document.querySelector('.bar');
    this.barElement.appendChild(this.listElement);
    setTimeout(() => this.listElement.classList.remove('folded'), 100);
  }

  remove() {
    this.barElement.removeChild(this.listElement);
  }

  render() {
    this.loadList();
    this.modal = $$('.bar .modal');
    this.modal.removeClass('folded');
    setTimeout(() => {
        this.modal.append('<img src="assets/images/loading.gif" class="loading">');
        this.loadingSign = $$(".loading");
    }, 200)
    setTimeout(() => {
      this.loadingSign.remove();
      this.list = $$(".bar .modal");
      debugger
      this.tags.forEach((tag) => {
        debugger
        if (tag.includes(this.searchBar.val())) {
          debugger
          const unit = this.tagStore[tag] > 1 ? "memes" : "meme";
          this.list.append(`<li class="recommendation"><p class="tag">#${tag}</p><p class="meme-count">${this.tagStore[tag]} ${unit} found</p></li>`)
        }
      })
    }, 2500)
  }

  update() {

  }
}

export default Modal;