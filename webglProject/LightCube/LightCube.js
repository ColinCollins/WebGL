const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Color;\n'+
                    'attribute vec4  a_Normal;\n'+
                    'uniform mat4 u_ProjMatrix;\n'+
                    'uniform vec3 u_LightColor;\n'+
                    'uniform vec3 u_LightDirection;\n'+
                    'varying vec4 v_Color;\n'+
                    'void main () {\n' +
                    'gl_Position = u_ProjMatrix * a_Position; \n'+
                    // 法线归一化
                    'vec3 normal = normalize(vec3(a_Normal));\n'+
                    // cos 求值
                    'float nDotL = max(dot(u_LightDirection, normal), 0.0); \n'+
                    // 漫发射光计算
                    'vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL; \n'+
                    'v_Color = vec4(diffuse, a_Color.a);\n'+
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
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    let a_Position = getAttribProp(gl, 'a_Position');
    let a_Color = getAttribProp(gl, 'a_Color');
    // light renderring
    let a_Normal = getAttribProp(gl, 'a_Normal');
    let u_LightColor = getUniformProp(gl, 'u_LightColor');
    let u_LightDirection = getUniformProp(gl, 'u_LightDirection');

    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    var lightDirection = new Vector3([0.5, 3.0, 4.0]);
    lightDirection.normalize();
    gl.uniform3fv(u_LightDirection, lightDirection.elements);

    let u_ProjMatrix = getUniformProp(gl, 'u_ProjMatrix');
    let projMatrix = new Matrix4().setPerspective(30.0, canvas.width/ canvas.height, 1.0, 100.0);
    // origin, dir, up
    projMatrix.lookAt(
        -4.0, 3.0, 10.0,
        0.2, 0.0, -1.0,
        0.0, 1.0, 0.0
    );
    // bind view
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    // use elementArrays
    let vertices = initVertices();
    let colorDatas = initVertexColorData();
    let normalDatas = initNormalizeData();

    bindDataBuffer(gl, vertices, a_Position);
    bindDataBuffer(gl, colorDatas, a_Color);
    bindDataBuffer(gl, normalDatas, a_Normal);

    let indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,   // front
        4, 5, 6, 4, 6, 7,   // right
        8, 9, 10, 8, 10, 11,    // top
        12, 13, 14, 12, 14, 15, // left
        16, 17, 18, 16, 18, 19, // bottom
        20, 21, 22, 20, 22, 23  // back
    ]);

    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.clearColor(0, 0, 0, 1);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
}

function initNormalizeData () {
    return new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
    ]);
}

function initVertexColorData () {
    return new Float32Array([
        0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
        0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
        0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
        0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
        0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
        0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4,
    ]);
}

function initVertices () {
    return new Float32Array([
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0
    ]);
}

function bindDataBuffer (gl, data, target) {
    let newBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, newBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    gl.vertexAttribPointer(target, 3, gl.FLOAT, false, 0 , 0);
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