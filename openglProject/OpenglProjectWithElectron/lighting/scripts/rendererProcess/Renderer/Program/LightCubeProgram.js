
class LightingCubeProgram extends ProgramObj {

    lightMapHadnle = {};

    LightingMapProgram (program) {
        this._program = program;
        this.texCount = 0;
        this.init();
    }

    init () {
        gl.useProgram(this._program);
        this._program.a_position = glMethod.getAttribProp(gl, this._program, 'a_Position');
        this._program.a_normal = glMethod.getAttribProp(gl, this._program, 'a_Normal');
        this._program.a_texCoord0 = glMethod.getAttribProp(gl, this._program, 'a_TexCoord0');

        this._program.u_mvpMatrix = glMethod.getUniformProp(gl, this._program, 'u_MvpMatrix');
        this._program.u_modleMatrix = glMethod.getUniformProp(gl, this._program, 'u_ModelMatrix');
        this._program.u_normalMatrix = glMethod.getUniformProp(gl, this._program, 'u_NormalMatrix');
        this._program.u_light = {
            position: glMethod.getUniformProp(gl, this._program, "u_light.position"),
            ambient: glMethod.getUniformProp(gl, this._program, 'u_light.ambient'),
            diffuse: glMethod.getUniformProp(gl, this._program, 'u_light.diffuse'),
            specular: glMethod.getUniformProp(gl, this._program, 'u_light.specular')
        };


        this._program.u_material = {
            ambient: glMethod.getUniformProp(gl, this._program, 'u_material.ambient'),
            diffuse: glMethod.getUniformProp(gl, this._program, 'u_material.diffuse'),
            specular: glMethod.getUniformProp(gl, this._program, 'u_material.specular'),
            shininess: glMethod.getUniformProp(gl, this._program, 'u_material.shininess')
        };

        this._program.u_viewPosition = glMethod.getUniformProp(gl, this._program, 'u_ViewPosition');

        glMethod.bindAttribData(gl, Data.initVerticesData(), this._program.a_position, gl.FLOAT, 3);
        glMethod.bindAttribData(gl, Data.initTexCoordVertex(), this._program.a_texCoord0, gl.FLOAT, 2);
        glMethod.bindAttribData(gl, Data.initNormalizeData(), this._program.a_normal, gl.FLOAT, 3);
    }

    initTexture () {
        glMethod.setTexture(gl.TEXTURE0, rawTexture.Map.get("container2").image, this._program.u_material.diffuse, 0);
        glMethod.setTexture(gl.TEXTURE1, rawTexture.Map.get("container2_specular").image, this._program.u_material.specular, 1);
    }
}

