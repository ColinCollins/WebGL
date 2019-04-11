const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Color;\n'+
                    'uniform mat4 u_ProjMatrix;\n'+
                    'uniform mat4 u_ViewMatrix;\n'+
                    'uniform mat4 u_ModelMatrix;\n'+
                    'varying vec4 v_Color;\n'+
                    'void main () {\n' +
                    'gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position; \n'+
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
    // open the depth test-> depth buffer
    gl.enable(gl.DEPTH_TEST);

    let a_Position = getAttribProp(gl, 'a_Position');
    let a_Color = getAttribProp(gl, 'a_Color');

    let u_ProjMatrix = getUniformProp(gl, 'u_ProjMatrix');
    let u_ViewMatrix = getUniformProp(gl, 'u_ViewMatrix');
    let u_ModelMatrix = getUniformProp(gl, 'u_ModelMatrix');
    let aspect = canvas.width / canvas.height;

    let projMatrix = new Matrix4().setPerspective(30.0, aspect, 1, 100);
    let viewMatrix = new Matrix4().setLookAt(
        0, 0, 5,
        0, 0, -100,
        0, 1, 0
    );

    let modelMatrix =  new Matrix4().setIdentity();

    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    let vertices = initVertices();
    let size = vertices.BYTES_PER_ELEMENT;

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 传入一次数据，绘制多次
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STREAM_DRAW);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, size * 6, 0);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, size * 6, size * 3);

    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);

    gl.clear(gl.DEPATH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    // This time we need draw twice triangles
    gl.drawArrays(gl.TRIANGLES, 0, 9);

    modelMatrix.setTranslate(-0.5, 0, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.clear(gl.DEPATH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 9);
}

function initVertices () {
    return new Float32Array([
        0.75, 1.0, 0.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        0.25, -1.0, 0.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        1.25, -1.0, 0.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),

        0.75, 1.0, -4.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        0.25, -1.0, -4.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        1.25, -1.0, -4.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),

        0.75, 1.0, -2.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        0.25, -1.0, -2.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        1.25, -1.0, -2.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
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