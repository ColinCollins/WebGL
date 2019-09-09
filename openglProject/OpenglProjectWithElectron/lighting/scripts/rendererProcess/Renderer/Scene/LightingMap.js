// gl is a global prop
exports.initScene = function () {
    new Program(gl, sources.vshaderSource, sources.fshaderSource, ShaderType.LIGHTING_MAP);
    new Program(gl, sources.lightVertexShaderSource, sources.lightFragmentShaderSource, ShaderType.LIGHTING_CUBE);

    let lightCubeHandle = Program.ShaderMap.get(ShaderType.LIGHTING_CUBE);
    let lightMapHandle = Program.ShaderMap.get(ShaderType.LIGHTING_MAP);

    // lightMapHandl prop init
    initCube1(lightMapHandle);
    // lightCubeHandle prop init
    initCube2(lightCubeHandle);

    // switch program and gl prop init
    gl.useProgram(lightMapHandle);
    gl.enable(gl.DEPTH_TEST);

    // 顶点数据可以都是相同的，只是 shader 不同
    let indexBuffer = gl.createBuffer();
    let indices = Data.initIndexData();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // Camera view position and perspective
    let aspect = canvas.width / canvas.height;
    let viewAngle = 50.0;
    let near = 1;
    let far =  100;

    let mvpMatrix = new Matrix4().setPerspective(viewAngle, aspect, near, far);
    // position, dir, axis
    mvpMatrix.lookAt(
        0.0, 5.0, 15.0,
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0
    );
    gl.uniform3fv(lightMapHandle.u_viewPosition, new Vector3([0.0, 5.0, 15.0]).elements);

    // lightMapHandle
    let m_modelMatrix = new Matrix4().setTranslate(-5.0, 0.0, 0.0).scale();
    let normalMatrix = new Matrix4().setInverseOf(m_modelMatrix).transpose();
    let tempMatrix = new Matrix4().set(mvpMatrix).multiply(m_modelMatrix);
    gl.uniformMatrix4fv(lightMapHandle.u_mvpMatrix, false, tempMatrix.elements);
    gl.uniformMatrix4fv(lightMapHandle.u_modleMatrix, false, m_modelMatrix.elements);
    gl.uniformMatrix4fv(lightMapHandle.u_normalMatrix, false, normalMatrix);

    // u_light
    gl.uniform3fv(lightMapHandle.u_light.position, new Vector3([0, -2.0, 10.0]).elements);
    gl.uniform3fv(lightMapHandle.u_light.ambient, new Vector3([1.0, 1.0, 1.0]).elements);
    gl.uniform3fv(lightMapHandle.u_light.diffuse, new Vector3([1.0, 1.0, 1.0]).elements);
    gl.uniform3fv(lightMapHandle.u_light.specular, new Vector3([1.0, 1.0, 1.0]).elements);

    // u_material
    gl.uniform3fv(lightMapHandle.u_material.ambient, new Vector3([1.0, 0.5, 0.31]).elements);
    gl.uniform3fv(lightMapHandle.u_material.diffuse, new Vector3([1.0, 0.5, 0.31]).elements)
    gl.uniform3fv(lightMapHandle.u_material.specular, new Vector3([0.5, 0.5, 0.5]).elements);
    // slider to adjust
    gl.uniform1f(lightMapHandle.u_material.shininess, 32);

    let c_modelMatrix = new Matrix4().setTranslate(5.0, 2.0, -2.0);
    tempMatrix = new Matrix4().set(mvpMatrix).multiply(c_modelMatrix);
    gl.uniform3fv(lightCubeMapHandle.u_mvpMatrix, false, tempMatrix.elements);

    // 切换 program 实际上就是在切 shader，而场景中可以有很多个 program 
    gl.useProgram(lightMapHandle);
    drawCube1(gl, lightMapHandle, indices);
    gl.useProgram(lightCubeHandle);
    drawCube2(gl, lightCubeHandle, indices);
}

function initCube1 (lightMapHandle) {
    lightMapHandle.a_position = Utils.getAttribProp(gl, 'a_Position', lightMapHandle);
    lightMapHandle.a_normal = Utils.getAttribProp(gl, 'a_Normal', lightMapHandle);
    lightMapHandle.a_texCoord0 = Utils.getAttribProp(gl, 'a_TexCoord0', lightMapHandle);
    lightMapHandle.a_texCoord1 = Utils.getAttribProp(gl, 'a_TexCoord1', lightMapHandle);

    lightMapHandle.u_mvpMatrix = Utils.getUniformProp (gl, 'u_MvpMatrix', ligthMapHandle);
    lightMapHandle.u_modleMatrix = Utils.getUniformProp(gl, 'u_ModleMatrix', lightMapHandle);
    lightMapHandle.u_normalMatrix = Utils.getUniformProp(gl, 'u_NormalMatrix', lightMapHandle);
    lightMapHandle.u_light = {
        position: Utils.getUniformProp(gl, "u_light.position", lightMapHandle),
        ambient: Utils.getUniformProp(gl, 'u_light.ambient', lightMapHandle),
        diffuse: Utils.getUniformProp(gl, 'u_light.diffuse', lightMapHandle),
        specular: Utils.getUniformProp(gl, 'u_light.specular', lightMapHandle)
    };

    lightMapHandle.u_material = {
        ambient: Utils.getUniformProp(gl, 'u_material.ambient', lightMapHandle),
        diffuse: Utils.getUniformProp(gl, 'u_material.diffuse', lightMapHandle),
        specular: Utils.getUniformProp(gl, 'u_material.specular', lightMapHandle),
        shininess: Utils.getUniformProp(gl, 'u_material.shininess', lightMapHandle)
    };

    lightMapHandle.u_viewPosition = Utils.getUniformProp(gl, 'u_ViewPosition', lightMapHandle);
    lightMapHandle.u_samlper0 = Utils.getUniformProp(gl, 'u_Sampler0', lightMapHandle);
    lightMapHandle.u_sampler1 = Utils.getUniformProp(gl, 'u_Sampler1', ligthMapHandle);
}

function initCube2 (lightCubeHandle) {
    lightCubeHandle.a_position = Utils.getAttribProp(gl, 'a_Position', lightCubeHandle);
    lightCubeHandle.a_color = Utils.getAttribProp(gl, 'a_Color', lightCubeHandle);

    lightCubeHanlde.u_mvpMatrix = Utils.getUniformProp(gl, 'u_MvpMatrix', lightCubeHandle);
}

// lightMapHandle
function drawCube1 (gl, program, indices) {
    Utils.bindAttribData(gl, Data.initVerticesData(), program.a_position, gl.FLOAT, 3);
    Utils.bindAttribData(gl, Data.initTexCoordVertex(), program.a_texCoord0, gl.FLOAT, 2);
    Utils.bindAttribData(gl, Data.initTexCoordVertex(), program.a_texCoord1, g.FLOAT, 2);
    Utils.bindAttribData(gl, Data.initNormalData(), program.a_normal, gl.FLOAT, 3);
    drawElement(gl, indices);
}
// lightCubeHandle
function drawCube2 () {
    Utils.bindAttribData(gl, Data.initVerticesData(), program.a_position, gl.FLOAT, 3);
    Utils.bindAttribData(gl, Data.initColorData(), program.a_position, gl.FLOAT, 3);
    drawElement(gl, indices);
}

function drawElement(gl, indices) {
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
}

function initTexture (gl, texCache, image, sampler, samplerCache) {
    let texture = gl.createTexture();

    gl.pixelStorei(gl.UNPACK_FILP_Y_WEBGL, 1);

    gl.activeTexture(texCache);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    // ------------------------------------ 外移参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP.S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // image 数据读取方式
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(sampler, samplerCache);
}

