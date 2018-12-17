var VSHADER_SOURCE =
                'attribute vec4 a_Position;\n'+
                'uniform mat4 u_ModelMatrix; \n' +
                'void main () {\n' +
                'gl_Position = u_ModelMatrix * a_Position;\n'+
                '}\n';

var FSHADER_SOURCE =
                'precision mediump float;\n'+
                'uniform vec4 u_FragColor;\n'+
                'void main () {\n' +
                'gl_FragColor = u_FragColor;\n'+
                '}\n';

function main () {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('init shader failed.');
        return;
    }

    let a_Position = getAttribPosition(gl);
    let u_FragColor = getUniformProp(gl, 'u_FragColor');
    let u_ModelMatrix = getUniformProp(gl, 'u_ModelMatrix');

    // cuon-matrix.js
    let matrix = new Matrix4();
    const ANGLE = 60;
    const TX = 0.5;
    // setRotate -> (angle, x, y, z);  do not need identity
    matrix.setRotate(ANGLE, 0, 0 , 1);
    // move
    matrix.translate(TX, 0, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // 按照第一个效果，怎么修改锚点呢？
    drawTriangle(gl, a_Position, u_FragColor);
    // cuon-matrix 这个库的问题，矩阵计算分先后，所以带 set 的 API 在前，不带 set 再后. 但是直接用 不带 set 就可以啦。。。？？？
    let matrix2 = new Matrix4();
    matrix2.translate(TX, 0, 0);
    matrix2.rotate(ANGLE, 0, 0 , 1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, matrix2.elements);
    drawTriangle(gl, a_Position, u_FragColor);
}

function drawTriangle (gl, a_Position, u_FragColor) {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    let vertices = initVertex();
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.uniform4f(u_FragColor, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 1.0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function initVertex () {
    return new Float32Array([
        0.0, 0.3,
        -0.3, -0.3,
        0.3, -0.3
    ]);
}

function getAttribPosition (gl) {
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    if (a_Position < 0) {
        console.error('a_Position init Failed.');
        return null;
    }
    return a_Position;
}

function getUniformProp (gl, name) {
    let prop = gl.getUniformLocation(gl.program, name);
    if (!prop) {
        console.error('uniform porp init failed.');
        return null;
    }
    return prop;
}