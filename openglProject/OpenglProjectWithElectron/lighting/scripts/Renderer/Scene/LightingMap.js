
// keep data?


// gl is a global prop
exports.initScene = function () {
    new Program(gl, sources.vshaderSource, sources.fshaderSource, ShaderType.LIGHTING_MAP);
    new Program(gl, sources.lightVertexShaderSource, sources.lightFragmentShaderSource, ShaderType.LIGHTING_CUBE);

    let lightCubeHandle = Program.ShaderMap.get(ShaderType.LIGHTING_CUBE);
    let lightMapHandle = Program.ShaderMap.get(ShaderType.LIGHTING_MAP);
    // switch program
    gl.useProgram(lightMapHandle);

    let aspect = canvas.width / canvas.height;
    let viewAngle = 50.0;
    let near = 1;
    let far =  100;

    let a_Position = Utils.getAttribProp(gl, 'a_Position', lightMapHandle);
    let a_Normal = Utils.getAttribProp(gl, 'a_Normal', lightMapHandle);

    let u_MvpMatrix = Utils.getUniformProp (gl, 'u_MvpMatrix', ligthMapHandle);
    let u_ModleMartix = Utils.getUniformProp(gl, 'u_ModleMatrix', lightMapHandle);
    let u_Light = Utils.getUniformProp(gl, 'u_Light', lightMapHandle);


    let mvpMatrix = new Matrix4().setPerspective(viewAngle, aspect, near, far);
    // position, dir, axis
    mvpMatrix.lookAt(
        0.0, 5.0, 15.0,
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0
    );

    //
    let modelMatrix = new Martix4().setTranslate(-5.0, 0.0, 0.0);
    mvpMatrix.multiply(modelMatrix);

}