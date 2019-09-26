// gl is a global prop
exports.initScene = function () {
    let colorCubeHandle = Program.ShaderMap.get(ShaderType.COLOR_CUBE);
    let lightMapHandle = Program.ShaderMap.get(ShaderType.LIGHT_MAP_TEST);

    // switch program and gl prop init
    gl.enable(gl.DEPTH_TEST);

    // lightMapHandl prop init
    initCube1(lightMapHandle);
    // node position
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
    let c_modelMatrix = new Matrix4().setTranslate(lightPos.elements[0], lightPos.elements[1], lightPos.elements[2]).scale(0.5, 0.5, 0.5);
    tempMatrix = new Matrix4().set(mvpMatrix).multiply(c_modelMatrix);
    gl.uniformMatrix4fv(colorCubeHandle.u_mvpMatrix, false, tempMatrix.elements);


    // 顶点数据可以都是相同的，只是 shader 不同
    let indexBuffer = gl.createBuffer();
    let indices = Data.initIndexData();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // 切换 program 实际上就是在切 shader，而场景中可以有很多个 program
    gl.useProgram(lightMapHandle);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
    gl.useProgram(colorCubeHandle);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
}


