/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/jqueery.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/jqueery.js":
/*!************************!*\
  !*** ./lib/jqueery.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const NodeCollection = __webpack_require__(/*! ./node_collection */ "./lib/node_collection.js");

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
            if (argument instanceof HTMLElement || argument instanceof Document) return new NodeCollection([argument]);
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
    const defaults = { // setting default state of object with required props
        method: "GET",
        url: "",
        data: {},
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: () => console.log("AJAX request fired"),
        error: () => console.log("AJAX Error"),
    }
    object = $$.extend(defaults, object); // merging defaults and argument
    object.method = object.method.toUpperCase(); // remove case sensitivity
    if (object.method === "GET") object.url += `?${querify(object.data)}`;
    
    const xhr = new XMLHttpRequest();
    xhr.open(object.method, object.url, true); // XMLHttpRequest.open(method, url, async)
    xhr.onload = (e) => {
        if (xhr.status === 200) {
            object.success(xhr.response);
        } else {
            object.error(xhr.response);
        }
    };

    xhr.send(JSON.stringify(object.data));
}

function querify(data) {
    let queryStr = "";
    for (let key in data) {
        if (data.hasOwnProperty(key)) queryStr += `${key}=${data[key]}&`;
    }
    return queryStr.slice(0, -1);
}



/***/ }),

/***/ "./lib/node_collection.js":
/*!********************************!*\
  !*** ./lib/node_collection.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

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

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map