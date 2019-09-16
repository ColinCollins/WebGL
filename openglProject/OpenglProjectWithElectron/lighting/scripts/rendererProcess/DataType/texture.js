import component from "./component";

const MAX_TEXTURE_COUNT = 8;

class Texture extends component {
    static type = ComponentType.TEXTURE;
    count = 0;

    constructor(program) {
        this.handle = program;
        this.texture = new Array(MAX_TEXTURE_COUNT);
    }

    setTexture (rawTexture) {
        count++;

    }

}