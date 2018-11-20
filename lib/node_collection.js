class NodeCollection {
    constructor(nodes) {
        this.nodes = nodes; // htmlEls: an array of HTML Elements
    }

    each(callback) {
        this.nodes.forEach(callback);
    }
}

module.exports = NodeCollection;