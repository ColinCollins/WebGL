const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n'+
                    'uniform vec4 u_Translation; \n'+
                    'void main() {\n'+
                    'gl_Position = a_Position + u_Translation;\n'+
                    'gl_PointSize = 10.0;\n'+
                    '}\n';

const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'uniform vec4 u_FragColor;\n'+
                    'void main() {\n'+
                    'gl_FragColor = u_FragColor; \n'+
                    '}\n';

const canvas = document.getElementById('webgl');

function main () {
    let gl = getWebGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('init shader Failed!');
        return;
    }

    let a_Position = getAttribPosition(gl);
    let u_FragColor = getUniformProp(gl, 'u_FragColor');
    // vertexAttrib2f / 3f/ 4f
    let vertexBuffer = gl.createBuffer();
    let vertices = initVertex();// RanglePoint
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 将顶点数据传入缓存区域，标记缓存数据的数据存储模式
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    // 绑定数据传出对象，传出格式，传出数据类型，
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    // 开启传输
    gl.enableVertexAttribArray(a_Position);

    gl.uniform4f(u_FragColor, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function initVertex () {
    // 顺时针
    return new Float32Array([
        0.5, 0.5,
        -0.5, 0.5,
        -0.5, -0.5,
        0.5, -0.5
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
    let obj = gl.getUniformLocation(gl.program, name);
    if (!obj) {
        console.error('Uniform init Failed.');
        return null;
    }
    return obj;
}

