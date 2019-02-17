const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec2 a_TexCoord;\n'+
                    'varying vec2 v_TexCoord;\n'+
                    'void main () {\n' +
                    'gl_Position = a_Position; \n'+
                    'gl_PointSize = 10.0; \n'+
                    'v_TexCoord = a_TexCoord; \n'+
                    '}\n';

// 多纹理映射
const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'uniform sampler2D u_Sampler0;\n'+
                    'uniform sampler2D u_Sampler1;\n'+
                    'varying vec2 v_TexCoord;\n'+
                    'void main() {\n' +
                    'vec4 color0 = texture2D(u_Sampler0, v_TexCoord);\n'+
                    'vec4 color1 = texture2D(u_Sampler1, v_TexCoord);\n'+
                    'gl_FragColor = color0 * color1;\n'+
                    '}\n';


function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('init shader failed.');
        return;
    }

    // custom program
    let verticesTexCoords = initVertexBuffers();
    let a_Position = getAttribProp(gl, 'a_Position');
    let a_TexCoord = getAttribProp(gl, 'a_TexCoord');

    let u_Sampler0 = getUniformProp(gl, 'u_Sampler0');
    let u_Sampler1 = getUniformProp(gl, 'u_Sampler1');

    let size = verticesTexCoords.BYTES_PER_ELEMENT;
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
    //  prop, (vec){Numer}, type, default(webgl), offset, initOffset
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, size * 4, 0);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, size * 4, size * 2);

    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_TexCoord);

    let image1 = new Image();
    image1.onload = onComplete;
    image1.src = 'file:///E:/GitStone/WebGL/res/psb.jpg';

    let image2 = new Image();
    image2.onload = onComplete;
    image2.src = 'file:///E:/GitStone/WebGL/res/tenor.gif'

    let srcCount = 0;
    function onComplete () {
        srcCount++;
        if (srcCount > 1) {
            console.log('src load complete.');
            initTextures(gl, u_Sampler0, u_Sampler1, image1, image2);
        }
    }

}

function initTextures (gl, u_Sampler0, u_Sampler1, image1, image2) {
    var texture0 = gl.createTexture();
    var texture1 = gl.createTexture();
    // flipY
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture0);
    // 这里必须重复一次设定
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image1);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture1);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2);

    gl.uniform1i(u_Sampler0, 0);
    gl.uniform1i(u_Sampler1, 1);
    // draw
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function initVertexBuffers () {
    return new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ]);
}

function getAttribProp (gl, name) {
    let prop = gl.getAttribLocation(gl.program, name);
    if (prop < 0) {
        console.error('attribute init failed.');
        return null;
    }
    return prop;
}

function getUniformProp (gl, name) {
    let prop = gl.getUniformLocation(gl.program, name);
    if(!prop) {
        console.error('uniform init failed.');
        return null;
    }
    return prop;
}