const NodeCollection = require("./node_collection");

let _ready = false;
const _callbacksOnReady = [];

document.addEventListener('DOMContentLoaded', () => {
    _ready = true;
    _callbacksOnReady.forEach(callback => callback());
});

window.$$ = (argument) => {
    switch (typeof argument) {
        case "string":
            const nodes = document.querySelectorAll(argument);
            const nodesArr = Array.from(nodes);
            return new NodeCollection(nodesArr);  
        case "object":
            if (argument instanceof HTMLElement) return new NodeCollection([argument]);
        case "function":
            _ready ? argument() : _callbacksOnReady.push(argument);
    }
};

$$.extend = (firstObject, ...objects) => {
    objects.forEach((object) => {
        for (let key in object) {
            firstObject[key] = object[key];
        }
    });
    return firstObject;
};
// typeof => built-in data types (always return Object for custom data types)
// instanceof => custom/complex data types (Array, Object)

