exports.inherit = function (SubType, SuperType) {
    let prototype = Object.create(SuperType);
    prototype.constructor = SubType;
    SubType.prototype = prototype;
}


exports.getset = function assignGetterSetter (obj, propName) {
    let priName = `_is${propName}`;
    let getName = `get${propName}`;
    let setName = `set${propName}`;

    // set private data
    Object.defineProperty(obj, priName, {
        value: undefined
    });

    // set getter / setter
    Object.defineProperty(obj, getName, {
        get function () { return this[priName];}
    });

    Object.defineProperty(obj, setName, {
        set function (value) {
            this[priName] = value;
        }
    });
}