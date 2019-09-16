exports.inherit = function (SubType, SuperType) {
    let prototype = Object.create(SuperType);
    prototype.constructor = SubType;
    SubType.prototype = prototype;
}