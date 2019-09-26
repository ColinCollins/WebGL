import component from "../../DataType/component";

class ProgramObj extends component {
    // 构造函数需要传入 program
    _program = null;

    texCount = 0;

    init () {}

    On () {
        if (!gl) return;
        gl.useProgram(_program);
    }

    setTexture (image) {}
}

export default ProgramObj;