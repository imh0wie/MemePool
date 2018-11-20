class NodeCollection {
    constructor(nodes) {
        this.nodes = nodes; // htmlEls: an array of HTML Elements
    }

    each(callback) {
        this.nodes.forEach(callback);
    }

    html(argument) {
        if (typeof argument === "string") {
            this.each((node) => node.innerHTML = argument) 
        } else {
            return this.nodes[0].innerHTML;
        }
    }

    empty() {
        this.html("");
    }

    append(newNodes) {
        //////////////////////////////////////////
        if (this.nodes.length === 0) {
            return ;
        } else if (typeof newNodes === "object" && !(newNodes instanceof NodeCollection)) {
            newNodes = $l(newNodes);
        }

        // if (newNodes instanceof NodeCollection) {
        //     // Since the same childe node cannot be appended to
        //     // multiple parents, new nodes must be duplicated.
        //     this.each((node) => {
        //         newNodes.each((newNode) => {
        //             node.appendChild(newNode.cloneNode(true));
        //         });
        //     });
        // } else 
        if (typeof newNodes === "string") {
            this.each((node) => {
                node.innerHTML += newNodes;
            });
        } 
    }

    attr(attribute, value) { 
        if (!value) {
            return this.nodes[0].getAttribute(attribute)
        } else {
            this.each(node => node.setAttribute(attribute, value.toString()))
        }
    }

    addClass(newClass) {
        if (typeof newClass === "number" || (typeof newClass === "object" && !(newClass instanceof Array))) return;
        if (newClass instanceof Array) {
            for (let i = 0; i < newClass.length; i++) {
                const el = newClass[i];
                if (el instanceof Array) {
                    return addClass(el);
                } else if (typeof el === "object") {
                    this.each(node => node.classList.add("[Object]"));
                } else {
                    this.each(node => node.classList.add(el.toString()));
                }   
            }
        } else {
            this.each((node) => node.classList.add(newClass))
        }
    }
    // Get the value of an attribute for the first element 
    // in the set of matched elements or set one or more 
    // attributes for every matched element.
    removeClass(klass) {
        if (typeof klass === "number" || (typeof klass === "object" && !(klass instanceof Array))) return;
        if (klass instanceof Array) {
            for (let i = 0; i < klass.length; i++) {
                const el = klass[i];
                if (el instanceof Array) {
                    return this.removeClass(el);
                } else if (typeof el === "object") {
                    this.each(node => node.classList.remove("[Object]"));
                } else {
                    this.each(node => node.classList.remove(el.toString()));
                }   
            }
        } else {
            this.each((node) => node.classList.remove(klass))
        }
    }

    toggleClass(klass) {
        if (typeof klass === "number" || (typeof klass === "object" && !(klass instanceof Array))) return;
        if (klass instanceof Array) {
            for (let i = 0; i < klass.length; i++) {
                const el = klass[i];
                if (el instanceof Array) {
                    return toggleClass(el);
                } else if (typeof el === "number" || typeof el === "object") {
                    continue;
                } else {
                    this.each(node => node.classList.toggle(el));
                }   
            }
        } else {
            this.each((node) => node.classList.toggle(klass))
        }
    }

    children() {
        let nodes = [];
        this.each((node) => {
            const children = node.children;
            nodes = nodes.concat(Array.from(children));
        });
        return new NodeCollection(nodes);
    }
}

module.exports = NodeCollection;