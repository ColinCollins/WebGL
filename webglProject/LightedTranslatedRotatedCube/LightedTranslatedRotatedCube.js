const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Color;\n'+
                    'attribute vec4 a_Normal;\n'+
                    'uniform mat4 u_MvpMatrix;\n'+
                    'uniform mat4 u_NormalMatrix;\n'+
                    'uniform vec3 u_LightColor;\n'+
                    'uniform vec3 u_LightDirection;\n'+
                    'uniform vec3 u_AmbientLight;\n'+
                    'varying vec4 v_Color;\n'+
                    'void main () {\n' +
                    'vec3 normal = normalize(vec3( u_NormalMatrix * a_Normal));\n'+
                    'float nDotL = max(dot(u_LightDirection, normal), 0.0);\n'+ // cos
                    'vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;\n'+
                    'vec3 ambient = u_AmbientLight * a_Color.rgb;\n'+
                    'v_Color = vec4(diffuse + ambient, a_Color.a);\n'+
                    'gl_Position = u_MvpMatrix * a_Position; \n'+
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

    gl.enable(gl.DEPTH_TEST);

    let a_Position = getAttribProp(gl, 'a_Position');
    let a_Color = getAttribProp(gl, 'a_Color');
    let a_Normal = getAttribProp(gl, 'a_Normal');
    // data
    let vertices = initVecticesData();
    let colorData = initColorData();
    let normalData = initNormalData();
    let indices = initIndicesData();
    // 环境光
    let u_AmbientLight = getUniformProp(gl, 'u_AmbientLight');
    let u_LightColor = getUniformProp(gl, 'u_LightColor');
    let u_LightDirection = getUniformProp(gl, 'u_LightDirection');

    gl.uniform3fv(u_AmbientLight, new Vector3([0.3, 0.2, 0.2]).elements);
    gl.uniform3fv(u_LightColor, new Vector3([1.0, 1.0, 1.0]).elements);
    gl.uniform3fv(u_LightDirection, new Vector3([-0.5, 3.0, 4.0]).normalize().elements);

    let u_NormalMatrix = getUniformProp(gl, 'u_NormalMatrix');
    let u_MvpMatrix = getUniformProp(gl, 'u_MvpMatrix');
    let matrix = new Matrix4().setPerspective(50.0, canvas.width/ canvas.height, 1.0, 100.0);
    matrix.lookAt(
        5.0, 4.0, 10.0,
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0
    );

    // rotate By z-coord
    let modelMatrix = new Matrix4().setTranslate(0, 1, 0).rotate(50, 0, 0, 1);
    matrix.multiply(modelMatrix);

    let normalMatrix = new Matrix4().setInverseOf(modelMatrix).transpose();// 倒置逆矩阵

    gl.uniformMatrix4fv(u_MvpMatrix, false, matrix.elements);
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

    bindDataBuffer(gl, vertices, a_Position);
    bindDataBuffer(gl, colorData, a_Color);
    bindDataBuffer(gl, normalData, a_Normal);

    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);

}

function bindDataBuffer (gl, data, target) {
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    gl.vertexAttribPointer(target, 3, gl.FLOAT, false, 0 ,0);
    gl.enableVertexAttribArray(target);
}

function initIndicesData () {
    return new Uint8Array([
        0, 1, 2, 0, 2, 3,   // front
        4, 5, 6, 4, 6, 7,   // right
        8, 9, 10, 8, 10, 11,    // top
        12, 13, 14, 12, 14, 15, // left
        16, 17, 18, 16, 18, 19, // bottom
        20, 21, 22, 20, 22, 23  // back
    ]);
}

function initVecticesData () {
    return new Float32Array([
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0
    ]);
}
function initColorData () {
    return new Float32Array([
        1.0, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
        0.4, 1.0, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 1.0,
        0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 1.0, 0.4, 1.0, 0.4, 0.4, 0.4,
        0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 1.0, 0.4,
        0.4, 0.4, 0.4, 1.0, 1.0, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
        0.4, 0.4, 0.4, 0.0, 0.4, 0.4, 0.4, 0.4, 1.0, 0.4, 0.4, 0.4,
    ]);
}
function initNormalData () {
    return new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
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