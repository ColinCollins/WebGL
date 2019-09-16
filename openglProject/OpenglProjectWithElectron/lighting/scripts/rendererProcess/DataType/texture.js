import component from "./component";

const MAX_TEXTURE_COUNT = 8;

class Texture extends component {
    static type = ComponentType.TEXTURE;
    count = 0;

    constructor(name, program) {
        this.name = name;
        this.program = program;
        this.textures = new Map();
    }

    setTexture (name, rawTexture) {
        if (count + 1 > MAX_TEXTURE_COUNT) return;
        count++;
        this.textures.set(name, rawTexture);
    }
}