var OBJObject = function (name) {
    this.name = name;
    this.faces = new Array(0);
    this.numIndices = 0;
}

let prop = OBJObject.prototype;

prop.addFace = function (face) {
    this.faces.push(face);
    this.numIndices += face.numIndices;
}

module.exports = OBJObject;