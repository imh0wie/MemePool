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
    // typeof => built-in data types (always return Object for custom data types)
    // instanceof => custom/complex data types (Array, Object)
    
$$.extend = (firstObject, ...objects) => {
    objects.forEach((object) => {
        for (let key in object) {
            firstObject[key] = object[key];
        }
    });
    return firstObject;
};

$$.ajax = (object) => {
    const defaults = {
        method: "GET",
        url: "",
        data: {},
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: () => console.log("AJAX request fired"),
        error: () => console.log("AJAX Error"),
    }
    object = $$.extend(defaults, object);
    object.method = object.method.toUpperCase();
    if (options.method === "GET") options.url += `?${querify(options.data)}`;
}

function querify(data) {
    let queryStr = "";
    for (let key in data) {
        if (data.hasOwnProperty(key)) queryStr += `${key}=${data[key]}&`;
    }
    return queryStr.slice(0, -1);
}

