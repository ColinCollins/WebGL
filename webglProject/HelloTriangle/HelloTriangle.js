const VSHADER_SOURCE =
                    'attribute vec4 a_Position; \n'+
                    'void main () {\n'+
                    'gl_Position = a_Position; \n' +
                    'gl_PointSize = 10.0;\n' +
                    '}\n';
const FSHADER_SOURCE =
                    'precision mediump float; \n'+
                    'uniform vec4 u_FragColor;\n'+
                    'void main() {\n'+
                    'gl_FragColor = u_FragColor;\n'+
                    '}\n';


let canvas = document.getElementById('canvas');

function main () {
    let gl = getWebGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Init program  Failed.');
        return;
    }

    let a_Position = getAttribPosition(gl);
    let u_FragColor = getUniformFragColor(gl);

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // write the data into buffer, link the buffer and Vertex Shader, switch open
    var vertices = new Float32Array([
        // Points
        -0.75, 0.25,
        -0.5, 0.75,
        -0.25, 0.25,

        // Line
        0.25, 0.25,
        0.5, 0.75,
        0.75, 0.25,

        // 2Line
        -0.75, -0.75,
        -0.5, -0.25,
        -0.25, -0.75,

        // triangle
        0.25, -0.75,
        0.5, -0.25,
        0.75, -0.75,

        //coodriateX
        -1, 0,
        1, 0,

        // coodriateY
        0, 1,
        0, -1
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.clear(gl.COLOR_BUFFER_BIT);

    drawPoint(gl, u_FragColor);
    drawLine(gl, u_FragColor);
    draw2Line(gl, u_FragColor);
    drawTriangle(gl, u_FragColor);
    drawCoodriate(gl, u_FragColor);
}

function drawPoint (gl, u_FragColor) {
    gl.uniform4f(u_FragColor, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 1.0);
    gl.drawArrays(gl.POINTS, 0, 3);
}

function drawLine (gl, u_FragColor) {
    gl.uniform4f(u_FragColor, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 1.0);
    gl.drawArrays(gl.LINES, 3, 3);
}

function draw2Line (gl, u_FragColor) {
    gl.uniform4f(u_FragColor, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 1.0);
    gl.drawArrays(gl.LINE_STRIP, 6, 3);
}

function drawTriangle (gl, u_FragColor) {
    gl.uniform4f(u_FragColor, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 1.0);
    gl.drawArrays(gl.LINE_LOOP, 9, 3);
}

function drawCoodriate(gl, u_FragColor) {
    gl.uniform4f(u_FragColor, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 1.0);
    gl.drawArrays(gl.LINES, 12, 4);
}


function getAttribPosition (gl) {
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position <= 0) {
        console.log('a_Position init Failed.');
        return null;
    }
    return a_Position;
}

function getUniformFragColor (gl) {
    let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('u_FragColor init Failed.');
        return null;
    }
    return u_FragColor;
}

