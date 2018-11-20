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
    // Get the value of an attribute for the first element 
    // in the set of matched elements or set one or more 
    // attributes for every matched element.
}

module.exports = NodeCollection;