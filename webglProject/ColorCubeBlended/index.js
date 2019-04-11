const Data = require('./data');

const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Color;\n'+
                    'attribute float a_Alpha;\n'+
                    'uniform mat4 u_MvpMatrix;\n'+
                    'varying vec4 v_Color;\n'+
                    'void main () {\n' +
                    'gl_Position = u_MvpMatrix * a_Position; \n'+
                    'v_Color = vec4(a_Color.rgb, a_Alpha);\n'+
                    '}\n';
const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'varying vec4 v_Color;\n'+
                    'void main() {\n' +
                    'gl_FragColor = v_Color;\n'+
                    '}\n';

window.onload = main;
function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('init shader failed.');
        return;
    }

    // custom program
    // 开启颜色混合，开启深度检测
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let a_Position = getAttribProp(gl, 'a_Position');
    let a_Color = getAttribProp(gl, 'a_Color');
    let a_Alpha = getAttribProp(gl, 'a_Alpha');

    let u_MvpMatrix = getUniformProp(gl, 'u_MvpMatrix');
    let mvpMatrix = new Matrix4().setPerspective(50.0, canvas.width / canvas.height, 1, 100);
    mvpMatrix.lookAt(
        6.0, 2.0, 3.0,
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0
    );

    let modelMatrix = new Matrix4().setTranslate(1.0, 0.0, 1.0).rotate(45.0, 0.0, 1.0, 0.0);
    mvpMatrix.multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    bindBufferData(gl, Data.initVerticesData(), a_Position);
    bindBufferData(gl, Data.initColorData(), a_Color);
    gl.vertexAttrib1f(a_Alpha, 0.4);

    let indexBuffer = gl.createBuffer();
    let indices = Data.initIndexData();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
}

function bindBufferData (gl, data, target) {
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
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