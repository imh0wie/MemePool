import Header from "./header";
import Bar from "./bar";
import UploadForm from "./upload_form";
import MemesContainer from "./memes_container";

class MemePool {
    constructor(options) {
        this.header = new Header(options);
        this.uploadForm = new UploadForm(options);
        this.memesContainer = new MemesContainer(options);
        this.bar = new Bar(Object.assign(options, { uploadForm: this.uploadForm, memesContainer: this.memesContainer }));
    }

    render() {
        this.header.render();
        this.bar.render();
        this.uploadForm.ready();
        this.memesContainer.render();
    }
}

export default MemePool;