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

exports.bindAttribData = function bindAttribData (gl, data, target, format, dataLength) {
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // 绑定数据到 buffer
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // 解析格式
    gl.vertexAttribPointer(target, dataLength, format, false, 0, 0);
    // 启用 buffer 数据
    gl.enableVertexAttribArray(target);
}

exports.setTexture = function initTexture (texCache, image, sampler, samplerCache) {
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


exports.draw = function indexDraw () {
    
}