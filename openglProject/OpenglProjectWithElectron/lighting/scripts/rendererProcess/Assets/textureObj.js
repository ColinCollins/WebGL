function Texture(name, path, callback) {

    let image = new Image();
    image.src = path;
    image.onload = () => {
        callback();
        this.isLoaded = true;
    };

    // this image
    this.image = image;
    this.name = name;
    // path
    this.path = path;
    Texture.Map.set(name, this);
}

Texture.Map = new Map();

let prop = Texture.prototype;


module.exports = Texture;