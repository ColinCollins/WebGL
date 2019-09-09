exports.getAttribProp = function (gl, program, name) {
    let prop = gl.getAttribLocation(program, name);
    if (prop < 0) {
        console.error('attribute prop init failed.');
        return null;
    }
    return prop;
}

exports.getUniformProp = function getUniformProp (gl, program, name) {
    let prop = gl.getUniformLocation(program, name);
    if(!prop) {
        console.error('uniform prop init failed.');
        return null;
    }
    return prop;
}

exports.bindAttribData = function bindAttribData(gl, data, target, format, dataLength) {
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // 绑定数据到 buffer
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // 解析格式
    gl.vertexAttribPointer(target, dataLength, format, false, 0, 0);
    // 启用 buffer 数据
    gl.enableVertexAttribArray(target);
}