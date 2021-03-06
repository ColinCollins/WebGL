const Data = require('./data');

const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Color;\n'+
                    'uniform mat4 u_MvpMatrix;\n'+
                    'varying vec4 v_Color;\n'+
                    'void main () {\n' +
                    'gl_Position = u_MvpMatrix * a_Position; \n'+
                    'v_Color = a_Color;\n'+
                    '}\n';
const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'varying vec4 v_Color;\n'+
                    'void main() {\n' +
                    'gl_FragColor = v_Color;\n'+
                    '}\n';

window.onload = main;
function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('init shader failed.');
        return;
    }

    // custom program
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    let a_Position = getAttribProp(gl, 'a_Position');
    let a_Color = getAttribProp(gl, 'a_Color');

    let u_MvpMatrix = getUniformProp(gl, 'u_MvpMatrix');
    let mvpMatrix = new Matrix4().setPerspective(50.0, canvas.clientWidth / canvas.clientHeight, 1, 100);
    mvpMatrix.lookAt(
        1.0, 2.0, 2.0,
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0
    );
    let modelMatrix = new Matrix4().setTranslate(0.0, -1.0, 0.0).rotate(45.0, 0.0, 1.0, 0.0).scale(2.0, 2.0, 2.0);
    mvpMatrix.multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    let vertexData = initVertexBuffers();
    let size = vertexData.BYTES_PER_ELEMENT;

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, size * 7, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, size * 7, size * 3);
    gl.enableVertexAttribArray(a_Color);

    gl.drawArrays(gl.TRIANGLES, 0, (vertexData.length + 1) / 7);
}

function initVertexBuffers () {
    return new Float32Array([
        0.0, 0.5, -0.4.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 0.4,
        -0.5, -0.5, -0.4.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 0.4,
        0.5, -0.5, -0.4.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 0.4,

        0.5, 0.4, -0.2.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 0.4,
        -0.5, 0.4, -0.2.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 0.4,
        0.0, -0.6, -0.2.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 0.4,

        0.0, 0.5, 0.0.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 0.4,
        -0.5, -0.5, 0.0.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 0.4,
        0.5, -0.5, 0.0.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 0.4
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