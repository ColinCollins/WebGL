var DrawingInfo = function (vertices, normals, colors, texCoords, indices) {
    this.vertices = vertices;
    this.normals = normals;
    this.colors = colors;
    this.texCoords = texCoords;
    this.indices = indices;
}

module.exports = DrawingInfo;