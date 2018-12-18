const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute float a_PointSize;\n'+
                    'void main () {\n' +
                    'gl_Position = a_Position; \n'+
                    'gl_PointSize = a_PointSize;\n'+
                    '}\n';
const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'uniform vec4 u_FragColor;\n'+
                    'void main() {\n' +
                    'gl_FragColor = u_FragColor;\n'+
                    '}\n';


function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('init shader failed.');
        return;
    }

    // custom program
    let a_Position = getAttribProp(gl, 'a_Position');
    let a_PointSize = getAttribProp(gl, 'a_PointSize');

    let u_FragColor = getUniformProp(gl, 'u_FragColor');

    let vertices = initVertices();
    // only need one buffer area.
    let vertexBuffer = gl.createBuffer();
    initVertextBuffer(gl, a_Position, vertexBuffer, vertices);
    initPointSizeBuffer(gl, a_PointSize, vertices);


    gl.uniform4f(u_FragColor, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 3);
}

function initVertextBuffer (gl, a_Position, vertexBuffer, vertices) {
    let elementSize = vertices.BYTES_PER_ELEMENT;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, elementSize * 3, 0);
    gl.enableVertexAttribArray(a_Position);
}

function initPointSizeBuffer (gl, a_PointSize, vertices) {
    let elementSize = vertices.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, elementSize * 3, elementSize * 2);
    gl.enableVertexAttribArray(a_PointSize);
}

function initVertices () {
    return new Float32Array([
        -0.5, -0.5, 10.0,
        0, 0.5, 20.0,
        0.5, -0.5, 30.0
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