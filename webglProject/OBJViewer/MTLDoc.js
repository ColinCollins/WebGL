const Material = require('./Material');

var MTLDoc = function () {
    this.complete = false;
    this.materials = new Array(0);
}

let prop = MTLDoc.prototype;

prop.parseNewmtl = function (sp) {
    return sp.getWord();
}

prop.parseRGB = function (sp, name) {
    let r = sp.getFloat();
    let g = sp.getFloat();
    let b = sp.getFloat();

    return new Material(name, r, g, b, 1);
}

module.exports = MTLDoc;