const DOMNodeCollection = require("./dom_node_collection");

window.$$ = (argument) => {
  switch (typeof argument) {
    case "string":
      return getNodesFromDOM(argument);
  }
};
// typeof => built-in data types (always return Object for custom data types)
// instanceof => custom/complex data types (Array, Object)

function getNodesFromDOM(selector) {
    const nodes = document.querySelectorAll(selector);
    const nodesArr = Array.from(nodes);
    return new DOMNodeCollection(nodesArr);  
}

