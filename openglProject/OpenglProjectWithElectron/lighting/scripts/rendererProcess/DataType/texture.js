import component from "./component";

const MAX_TEXTURE_COUNT = 8;

class Texture extends component {
    static type = ComponentType.TEXTURE;
    count = 0;

    constructor(name, program) {
        super();
        this.name = name;
        this.program = program;
        this.textures = new Map();
    }

    setTexture (name, rawTexture) {
        if (count + 1 > MAX_TEXTURE_COUNT) return;
        // count 计数放在 texture 缓存初始化完成时
        this.textures.set(name, rawTexture);
    }
}