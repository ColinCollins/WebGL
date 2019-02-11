const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Color;\n'+
                    'attribute vec4 a_Normal;\n'+
                    'uniform vec3 u_AmbientLight;\n'+
                    'uniform vec3 u_LightColor;\n'+
                    'uniform vec3 u_LightPosition;\n'+
                    'uniform mat4 u_ModelMatrix;\n'+
                    'uniform mat4 u_MvpMatrix;\n'+
                    'uniform mat4 u_NormalMatrix;\n'+
                    'varying vec4 v_Color;\n'+
                    'void main () {\n' +
                    'gl_Position = u_MvpMatrix * a_Position; \n'+
                    'v_Color = a_Color;\n'+
                    '}\n';
const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'varying vec4 v_Color;'
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

    gl.enable(gl.DEPTH_TEST);

    let a_Position = getAttribProp(gl, 'a_Position');
    let a_Color = getAttribProp(gl, 'a_Color');
    let a_Normal = getAttribProp(gl, 'a_Normal');

    let u_LightColor = getUniformProp(gl, 'u_LightColor');
    gl.uniform3fv(u_LightColor, new Vector3([1.0, 1.0, 1.0]).elements);
    let u_LightPosition = getUniformProp(gl, 'u_LightPosition');
    gl.uniform3fv(u_LightPosition, new Vector3([1.0, 4.0, 1.0]).elements);

    let u_AmbientLight = getUniformProp(gl, 'u_AmbientLight');
    gl.uniform3fv(u_AmbientLight, new Vector3([0.4, 0.4, 0.4]).elements);

    let u_ModelMatrix = getUniformProp(gl, 'u_ModelMatrix');

    let u_MvpMatrix = getUniformProp(gl, 'u_MvpMatrix');

    let u_NormalMatrix = getUniformProp(gl, 'u_NormalMatrix');

    let mvpMatrix = new Matrix4().setPerspective(50.0, canvas.width / canvas.height, 1, 100);
    mvpMatrix.lookAt(
        5.0, 7.0, 10.0,
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0
    );

    let modelMatrix = new Matrix4().setTranslate(0.0, 2.0, 1.0).rotate(50.0, 0.0, 1.0, 0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    mvpMatrix.multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    let inverseMatrix = new Matrix4();
    inverseMatrix.setInverseOf(modelMatrix).transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, inverseMatrix.elements);
}

function bindDataBuffer (gl, data, target) {
    let createBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, createBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(target, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(target);
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