
class LightingMapProgram extends ProgramObj {

    LightingMapProgram(program) {
        this._program = program;
        this.texCount = 0;
        this.init();
    }

    init() {
        gl.useProgram(this._program);

        this._program.a_position = glMethod.getAttribProp(gl, this._program, 'a_Position');
        this._program.u_mvpMatrix = glMethod.getUniformProp(gl, this._program, 'u_MvpMatrix');
        this._program.u_color = glMethod.getUniformProp(gl, this._program, 'u_Color');

        glMethod.bindAttribData(gl, Data.initVerticesData(), this._program.a_position, gl.FLOAT, 3);
        gl.uniform3fv(this._program.u_color, new Vector3([1.0, 1.0, 1.0]).elements);
    }

    initTexture() {}
}

