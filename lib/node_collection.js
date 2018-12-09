class NodeCollection {
    constructor(nodes) {
        this.nodes = nodes; // htmlEls: an array of HTML Elements
        // this.length = this.nodes.length;
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

    val() {
        return this.nodes[0].value;
    }

    empty() {
        this.html("");
    }

    append(newNodes) {
        if (this.nodes.length === 0) {
            return ;
        } else if (typeof newNodes === "object" && !(newNodes instanceof NodeCollection)) {
            newNodes = $l(newNodes);
        }

        if (typeof newNodes === "string") {
            this.each((node) => {
                node.innerHTML += newNodes;
            });
        } else if (newNodes instanceof NodeCollection) {
            this.each((node) => {
                newNodes.each((newNode) => {
                    node.appendChild(newNode.cloneNode(true));
                });
            });
        } 
        
    }

    remove(selector = null) {
        if (!selector) {
            this.each(node => node.parentNode.removeChild(node));
        } else {
            // when selector is provided
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
        let children = [];
        this.each((node) => {
            const childrenNodes = node.children;
            children = children.concat(Array.from(childrenNodes));
        });
        return new NodeCollection(children);
    }

    parent(){
        let parentNodeArr = [];
        this.nodes.forEach((node) => {
          if(!parentNodeArr.includes(node.parentNode)){
            parentNodeArr.push(node.parentNode);
          }
        });
        return new NodeCollection(parentNodeArr);
    }

    find(selector) {
        let targets = [];
        this.each((node) => {
            const nodes = node.querySelectorAll(selector);
            targets = targets.concat(Array.from(nodes));
        });
        return new NodeCollection(targets);
    }

    on(event, callback) {
        this.each((node) => {
            node.addEventListener(event, callback);
            const eventKey = `jqueeryEvents-${event}`;
            if (typeof node[eventKey] === "undefined") {
                node[eventKey] = [];
            }
            node[eventKey].push(callback);
        });
    }

    off(event) {
        this.each((node) => {
            const eventKey = `jqueeryEvents-${event}`;
            if (node[eventKey]) {
                node[eventKey].forEach((callback) => {
                    node.removeEventListener(event, callback);
                });
            }
            node[eventKey] = [];
        });
    }
}

module.exports = NodeCollection;