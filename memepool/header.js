class Header {
    constructor() {
        this.header = $$("header.hidden");
    }

    render() {
        $$(() => setTimeout(() => this.header.removeClass("hidden"), 500));
    }
}

export default Header;