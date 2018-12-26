const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Color;\n'+
                    'varying vec4 v_Color;\n'+
                    'uniform mat4 u_ViewMatrix;\n'+
                    'void main () {\n' +
                    'gl_Position = u_ViewMatrix * a_Position; \n'+
                    'v_Color = a_Color;\n'+
                    '}\n';

const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'varying vec4 v_Color;\n'+
                    'void main() {\n' +
                    'gl_FragColor = v_Color;\n'+
                    '}\n';


function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('init shader failed.');
        return;
    }

    // custom program

    let vertices = initVertexBuffers();
    let size = vertices.BYTES_PER_ELEMENT
    let a_Position = getAttribProp(gl, 'a_Position');
    let a_Color = getAttribProp(gl, 'a_Color');

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, size * 6, 0);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, size * 6, size * 3);

    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);

    let u_ViewMatrix = getUniformProp(gl, 'u_ViewMatrix');
    let viewMatrix = new Matrix4();
    // origin, viewDir, Up
    viewMatrix.setLookAt(
        0.20, 0.40, 0.25,
        0, 0.3, 0,
        0, 1, 0
    );
    // webgl the second param must be false
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 9);
}

function initVertexBuffers () {
    return new Float32Array([
        0.0, 0.5, -0.4, 0.4, 1.0, 0.4,
        -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
        0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

        0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
        -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
        0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

        0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        0.5, -0.5, 0.0, 1.0, 0.4, 0.4
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