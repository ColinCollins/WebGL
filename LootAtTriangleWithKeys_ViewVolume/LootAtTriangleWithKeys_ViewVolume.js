const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Color;\n'+
                    'uniform mat4 u_ProjMatrix; \n'+
                    'varying vec4 v_Color;\n'+
                    'uniform mat4 u_ViewMatrix;\n'+
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

    let a_Position = getAttribProp(gl, 'a_Position');
    let a_Color = getAttribProp(gl, 'a_Color');

    let u_ProjMatrix = getUniformProp(gl, 'u_ProjMatrix');
    let u_ViewMatrix = getUniformProp(gl, 'u_ViewMatrix');

    let viewMatrix = initViewMatrix();
    let projMatrix = new Matrix4();
    // near far
    let gNear = 0;
    let gFar = 2.0;
    setProjMatrix(projMatrix, gNear, gFar);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);


    let vertexBuffer = gl.createBuffer();
    let vertices = initVertices();
    let size = vertices.BYTES_PER_ELEMENT;

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * size, 0);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * size, 3 * size);

    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);

    document.onkeydown = (e) => {
        let keyId =  e.keyCode || e.which;
        switch (keyId) {
            case 37:
                // left
                gNear += 0.1;
                break;
            case 38:
                // top
                gFar += 0.1;
                break;
            case 39:
                // right
                gNear -= 0.1;
                break;
            case 40:
                // bottom
                gFar -= 0.1;
                break;
        }
        nearFar.innerHTML = `Near: ${gNear}; Far: ${gFar}`;
        setProjMatrix(projMatrix, gNear, gFar);
        draw(gl, u_ProjMatrix, projMatrix);
    }

    draw(gl, u_ProjMatrix, projMatrix);

}

function initViewMatrix () {
    return new Matrix4().setLookAt(
        0.2, 0.25, 0.2,
        0, 0, 0,
        0, 1, 0
    );
}

function setProjMatrix (matrix, near, far) {
    // left, right, bottom, top
    matrix.setOrtho(-0.5, 0.5, -0.5, 0.5, near, far);
}

function initVertices () {
    return new Float32Array([
        0.0, 0.5, -0.4.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        -0.5, -0.5, -0.4.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        0.5, -0.5, -0.4.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),

        0.5, 0.4, -0.2.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        -0.5, 0.4, -0.2.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        0.0, -0.6, -0.2.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),

        0.0, 0.5, 0.0.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        -0.5, -0.5, 0.0.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        0.5, -0.5, 0.0.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2)
    ]);
}

function draw (gl, u_ProjMatrix, projMatrix) {
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 9);
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