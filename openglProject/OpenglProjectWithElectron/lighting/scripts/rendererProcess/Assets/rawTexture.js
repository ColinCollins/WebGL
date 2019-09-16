function rawTexture(name, path, callback) {
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
    rawTexture.Map.set(name, this);
}

rawTexture.Map = new Map();


module.exports = rawTexture;