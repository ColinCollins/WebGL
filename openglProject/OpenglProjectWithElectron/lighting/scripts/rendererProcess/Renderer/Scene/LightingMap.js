// gl is a global prop
exports.initScene = function () {
    let colorCubeHandle = Program.ShaderMap.get(ShaderType.COLOR_CUBE);
    let lightMapHandle = Program.ShaderMap.get(ShaderType.LIGHT_MAP_TEST);

    // lightMapHandl prop init
    initCube1(lightMapHandle);

    // switch program and gl prop init
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
        0.0, -5.0, 50.0,
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0
    );
    gl.uniform3fv(lightMapHandle.u_viewPosition, new Vector3([0.0, 5.0, 15.0]).elements);

    // lightMapHandle
    let m_modelMatrix = new Matrix4().setTranslate(0.0, 0.0, 0.0).scale(4.0, 4.0, 4.0).rotate(60.0, 0, 1, 0);
    let normalMatrix = new Matrix4().setInverseOf(m_modelMatrix).transpose();
    let tempMatrix = new Matrix4().set(mvpMatrix).multiply(m_modelMatrix);
    gl.uniformMatrix4fv(lightMapHandle.u_mvpMatrix, false, tempMatrix.elements);
    gl.uniformMatrix4fv(lightMapHandle.u_modleMatrix, false, m_modelMatrix.elements);
    gl.uniformMatrix4fv(lightMapHandle.u_normalMatrix, false, normalMatrix.elements);

    // u_light
    var lightPos = new Vector3([-5.0, -2.0, 5.0]);
    gl.uniform3fv(lightMapHandle.u_light.position, lightPos.elements);
    gl.uniform3fv(lightMapHandle.u_light.ambient, new Vector3([0.3, 0.3, 0.3]).elements);
    gl.uniform3fv(lightMapHandle.u_light.diffuse, new Vector3([1.0, 1.0, 1.0]).elements);
    gl.uniform3fv(lightMapHandle.u_light.specular, new Vector3([1.0, 1.0, 1.0]).elements);

    // u_material
    gl.uniform3fv(lightMapHandle.u_material.ambient, new Vector3([1.0, 0.5, 0.31]).elements);
    // slider to adjust
    gl.uniform1f(lightMapHandle.u_material.shininess, 64.0);

    // colorCubeHandle prop init
    initCube2(colorCubeHandle);
    let c_modelMatrix = new Matrix4().setTranslate(lightPos.elements[0], lightPos.elements[1], lightPos.elements[2]).scale(0.5, 0.5 , 0.5);
    tempMatrix = new Matrix4().set(mvpMatrix).multiply(c_modelMatrix);
    gl.uniformMatrix4fv(colorCubeHandle.u_mvpMatrix, false, tempMatrix.elements);

    // 切换 program 实际上就是在切 shader，而场景中可以有很多个 program
    gl.useProgram(lightMapHandle);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
    gl.useProgram(colorCubeHandle);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
}

function initCube1 (lightMapHandle) {
    gl.useProgram(lightMapHandle);
    lightMapHandle.a_position = Utils.getAttribProp(gl, lightMapHandle, 'a_Position');
    lightMapHandle.a_normal = Utils.getAttribProp(gl, lightMapHandle, 'a_Normal');
    lightMapHandle.a_texCoord0 = Utils.getAttribProp(gl, lightMapHandle, 'a_TexCoord0');

    lightMapHandle.u_mvpMatrix = Utils.getUniformProp (gl, lightMapHandle, 'u_MvpMatrix');
    lightMapHandle.u_modleMatrix = Utils.getUniformProp(gl, lightMapHandle, 'u_ModelMatrix');
    lightMapHandle.u_normalMatrix = Utils.getUniformProp(gl, lightMapHandle, 'u_NormalMatrix');
    lightMapHandle.u_light = {
        position: Utils.getUniformProp(gl, lightMapHandle, "u_light.position"),
        ambient: Utils.getUniformProp(gl, lightMapHandle, 'u_light.ambient'),
        diffuse: Utils.getUniformProp(gl, lightMapHandle, 'u_light.diffuse'),
        specular: Utils.getUniformProp(gl, lightMapHandle, 'u_light.specular')
    };

    lightMapHandle.u_material = {
        ambient: Utils.getUniformProp(gl, lightMapHandle, 'u_material.ambient'),
        diffuse: Utils.getUniformProp(gl, lightMapHandle, 'u_material.diffuse'),
        specular: Utils.getUniformProp(gl, lightMapHandle, 'u_material.specular'),
        shininess: Utils.getUniformProp(gl, lightMapHandle, 'u_material.shininess')
    };

    lightMapHandle.u_viewPosition = Utils.getUniformProp(gl, lightMapHandle, 'u_ViewPosition');

    Utils.bindAttribData(gl, Data.initVerticesData(), lightMapHandle.a_position, gl.FLOAT, 3);
    Utils.bindAttribData(gl, Data.initTexCoordVertex(), lightMapHandle.a_texCoord0, gl.FLOAT, 2);
    Utils.bindAttribData(gl, Data.initNormalizeData(), lightMapHandle.a_normal, gl.FLOAT, 3);

    initTexture(gl.TEXTURE0, Texture.Map.get("container2").image, lightMapHandle.u_material.diffuse, 0);
    initTexture(gl.TEXTURE1, Texture.Map.get("container2_specular").image, lightMapHandle.u_material.specular, 1);
}

function initCube2 (colorCubeHandle) {
    gl.useProgram(colorCubeHandle);
    colorCubeHandle.a_position = Utils.getAttribProp(gl, colorCubeHandle, 'a_Position');
    colorCubeHandle.u_mvpMatrix = Utils.getUniformProp(gl, colorCubeHandle, 'u_MvpMatrix');
    colorCubeHandle.u_color = Utils.getUniformProp(gl, colorCubeHandle, 'u_Color');

    Utils.bindAttribData(gl, Data.initVerticesData(), colorCubeHandle.a_position, gl.FLOAT, 3);
    gl.uniform3fv(colorCubeHandle.u_color, new Vector3([1.0, 1.0, 1.0]).elements);
}

// ------------------------------------ 外移参数
function initTexture (texCache, image, sampler, samplerCache) {
    if (!texCache || !image || !sampler || !samplerCache) console.error('initTexture lost param');

    let texture = gl.createTexture();

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    gl.activeTexture(texCache);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // image 数据读取方式
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(sampler, samplerCache);
}

