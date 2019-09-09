function Sprite(image, name, width, height, path) {
    // this image
    this.image = image;
    this.name = name;
    // width
    this.width = width;
    // height
    this.height = height;
    // path
    this.path = path;
}

let prop = Sprite.prototype;



module.exports = Sprite;