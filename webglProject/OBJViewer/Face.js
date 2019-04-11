var Face = function (materialName) {
    this.materialName = materialName;
    if (materialName === null) this.materialName = '';

    this.vIndices = new Array(0);
    this.nIndices = new Array(0);
    this.tIndices = new Array(0);
}

module.exports = Face;