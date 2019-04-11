const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Color;\n'+
                    'uniform mat4 u_ProjMatrix;\n'+
                    'uniform mat4 u_ViewMatrix;\n'+
                    'varying vec4 v_Color;\n'+
                    'void main () {\n' +
                    'gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position; \n'+
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
    let nearFar = document.getElementById('nearFar');

    let gl = getWebGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('init shader failed.');
        return;
    }

    // custom program

    // perspectiveView -> fov, aspect, near, far (fov - near - far must > 0)

    let a_Position = getAttribProp(gl, 'a_Position');
    let a_Color = getAttribProp(gl, 'a_Color');

    let u_ProjMatrix = getUniformProp(gl, 'u_ProjMatrix');
    let u_ViewMatrix = getUniformProp(gl, 'u_ViewMatrix');

    let viewMatrix = initViewMatrix();
    let projMatrix = initProjMatrix(canvas);

    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    let vertices = initVertices();
    let vertexBuffer = gl.createBuffer();
    let size = vertices.BYTES_PER_ELEMENT;

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, size * 6, 0);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, size * 6, size * 3);

    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 18);
}

function initViewMatrix () {
    return new Matrix4().setLookAt(
        0, 0, 5,
        0, 0, -100,
        0, 1, 0
    );
}

function initProjMatrix (canvas) {
    let aspect = canvas.width / canvas.height;
    return new Matrix4().setPerspective(30.0, aspect, 1, 100);
}


function initVertices () {
    return new Float32Array([
        0.75, 1.0, -4.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        0.25, -1.0, -4.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        1.25, -1.0, -4.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),

        0.75, 1.0, -2.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        0.25, -1.0, -2.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        1.25, -1.0, -2.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),

        0.75, 1.0, 0.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        0.25, -1.0, 0.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        1.25, -1.0, 0.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),

        -0.75, 1.0, -4.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        -1.25, -1.0, -4.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        -0.25, -1.0, -4.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),

        -0.75, 1.0, -2.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        -1.25, -1.0, -2.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        -0.25, -1.0, -2.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),

        -0.75, 1.0, 0.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        -1.25, -1.0, 0.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        -0.25, -1.0, 0.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2)
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