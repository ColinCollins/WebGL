const Color = require('./Color');

var Material = function (name, r, g, b, a) {
    this.name = name;
    this.color = new Color(r, g, b, a);
}

module.exports = Material;