const VSHADER_SOURCE =
                    'attribute vec4 a_Position; \n'+
                    'void main() {\n' +
                    'gl_Position = a_Position;\n'+
                    'gl_PointSize = 10.0;\n'+
                    '}\n';

const FSHADER_SOURCE =
                    'precision mediump float; \n'+
                    'uniform vec4 u_FragColor;\n'+
                    'void main() {\n'+
                    'gl_FragColor = u_FragColor;\n'+
                    '}\n';

let canvas = document.getElementById('webgl');

function main () {
    let gl = getWebGLContext(canvas);

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('init shader failed.');
        return;
    }

    let a_Position = getAttribPosition(gl);
    let u_FragColor = getUniformFragColor(gl);

    // draw Rectangle;

    var vertexBuffer = gl.createBuffer();
    // special sort
    var vertices = new Float32Array([
        -0.5, 0.5,
        0.5 ,0.5,
        -0.5, -0.5,
        0.5, -0.5
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.uniform4f(u_FragColor, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function getAttribPosition (gl) {
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.error('a_Position init Failed.');
        return null;
    }
    return a_Position;
}

function getUniformFragColor (gl) {
    let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.error('u_FragColor init Failed.');
        return null;
    }
    return u_FragColor;
}