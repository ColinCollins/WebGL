const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute float a_PointSize;\n'+
                    'uniform vec4 u_Transition;\n'+
                    'uniform mat4 u_xformMatrix; \n'+
                    'void main () {\n' +
                    'gl_Position = u_xformMatrix * (a_Position + u_Transition); \n'+
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
    let u_Transition = getUniformProp(gl, 'u_Transition');
    let u_xformMatrix = getUniformProp(gl, 'u_xformMatrix');

    initVertextBuffer(gl, a_Position);
    initPointSizeBuffer(gl, a_PointSize);

    gl.uniform4f(u_Transition, 0 ,0, 0, 0);
    gl.uniformMatrix4fv(u_xformMatrix, false, new Matrix4().elements);
    gl.uniform4f(u_FragColor, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 3);

}

function initVertextBuffer (gl, a_Position) {
    let vertexBuffer = gl.createBuffer();
    let vertices = initVertices();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
}

function initPointSizeBuffer (gl, a_PointSize) {
    let pointSizeBuffer = gl.createBuffer();
    let pointSizes = initPointSizes();

    gl.bindBuffer(gl.ARRAY_BUFFER, pointSizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, pointSizes, gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_PointSize);
}

function initVertices () {
    return new Float32Array([
        -0.5, -0.5,
        0, 0.5,
        0.5, -0.5
    ]);
}

function initPointSizes () {
    return new Float32Array([
        10.0, 20.0, 30.0
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