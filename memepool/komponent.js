class Komponent {
    constructor(options) {
        this.documentEl = options.documentEl;
    }
    
    renderChildren(el, klass, t, cb = null, devault = true) {
        for (let i = 0; i < el.children().length; i++) {
            const child = el.children()[i];
            if (devault) setTimeout(() => $$(child).removeClass(klass), t);
            if (cb) cb(child, t);
        }
    }

    toggleChildren(el, klass, t, cb = null, devault = true) {
        el.children().each((child) => {
            if (devault) $$(child).toggleClass(klass);
            if (cb) cb(child, t);
        })
    }

    renderChildrenInOrder(el, klass, t, cb = null, devault = true) {
        const dt = t / el.children().length;
        for (let i = 0; i < el.children().length; i++) {
            const childEl = el.children()[i];
            const child = $$(childEl);
            if (devault) setTimeout(() => child.removeClass(klass), t);
            if (cb) cb(child, t);
            t += dt;
        }
    }
    // for one-level destructuring
    // (e.g. <li><i class"fa fas=something></i> Something</li>)

    renderChildrenInOrderEvenly(el, klass, t, cb = null, devault = true) {
        const dt = t / el.children().length;
        for (let i = 0; i < el.children().length; i++) {
            const child = el.children()[i];
            const element = $$(child);
            if (element.children().length > 0) {
                if (devault) () => element.removeClass(klass);
                this.renderChildrenInOrderEvenly(element, t, cb, devault);
                t += dt / element.children().length;
            } else {
                if (devault) setTimeout(() => element.removeClass(klass), t);
                if (cb) cb(element);
                t += dt;
            }
        }
    }
}

export default Komponent;