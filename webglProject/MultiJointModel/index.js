const Data = require('./data');

const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Color;\n'+
                    'attribute vec4 a_Normal;\n'+
                    'uniform mat4 u_MvpMatrix;\n'+
                    'uniform mat4 u_NormalMatrix;\n'+
                    'uniform mat4 u_ModelMatrix;\n'+
                    'uniform vec3 u_LightColor;\n'+
                    'uniform vec3 u_LightPosition;\n'+
                    'uniform vec3 u_AmbientLight;\n'+
                    'varying vec4 v_Color;\n'+
                    'void main () {\n' +
                    'gl_Position = u_MvpMatrix * a_Position;\n'+
                    'vec3 vertexPosition = vec3(u_ModelMatrix * a_Position);\n'+
                    'vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n'+
                    'vec3 lightDirection = normalize(u_LightPosition - vertexPosition);\n'+
                    'float nDotL = max(dot(lightDirection, normal), 0.0);\n'+
                    'vec3 diffuse = vec3(u_LightColor * a_Color.rgb * nDotL);\n'+
                    'vec3 ambient = vec3(u_AmbientLight * a_Color.rgb);\n'+
                    'v_Color = vec4(diffuse + ambient, a_Color.a);\n'+
                    '}\n';
const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'varying vec4 v_Color;\n'+
                    'void main() {\n' +
                    'gl_FragColor = v_Color;\n'+
                    '}\n';

window.onload = main;

let ANGLE_STEP = 2.0;     // 步长
let g_arm1Angle = 45.0;   // arm 旋转角度
let g_joint1Angle = 45.0;   // joint1 当前角度
let g_joint2Angle = 0.0;  // joint2 当前角度
let g_joint3Angle = 0.0;  // joint3 当前角度

let g_modelMatrix = new Matrix4();
let g_normalMatrix = new Matrix4();
let g_mvpMatrix = new Matrix4();

function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('init shader failed.');
        return;
    }
    // custom program 这里使用 anchor 的概念会更好
    gl.enable(gl.DEPTH_TEST);

    let a_Position = getAttribProp(gl, 'a_Position');
    let a_Color = getAttribProp(gl, 'a_Color');
    let a_Normal = getAttribProp(gl, 'a_Normal');

    bindBufferData(gl, Data.initVerticesData(), a_Position);
    bindBufferData(gl, Data.initColorData(), a_Color);
    bindBufferData(gl, Data.initNormalizeData(), a_Normal);

    let u_ModelMatrix = getUniformProp(gl, 'u_ModelMatrix');
    let u_MvpMatrix = getUniformProp(gl, 'u_MvpMatrix');
    let u_NormalMatrix = getUniformProp(gl, 'u_NormalMatrix');

    let u_AmbientLight = getUniformProp(gl, 'u_AmbientLight');
    let u_LightColor = getUniformProp(gl, 'u_LightColor');
    let u_LightPosition = getUniformProp(gl, 'u_LightPosition');

    gl.uniform3fv(u_AmbientLight, new Vector3([0.4, 0.4, 0.4]).elements);
    gl.uniform3fv(u_LightColor, new Vector3([1.0, 1.0, 1.0]).elements);
    gl.uniform3fv(u_LightPosition, new Vector3([1.0, 2.0, 1.0]).elements);

    let viewProjMatrix = new Matrix4().setPerspective(40.0, canvas.clientWidth / canvas.clientHeight, 1, 100);
    viewProjMatrix.lookAt(
        10.0, 5.0, 10.0,
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0
    );

    let indexBuffer = gl.createBuffer();
    let indices = Data.initIndexData();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    document.onkeydown = function (ev) {
        keydown(ev, gl, indices.length, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
    }

    draw(gl, indices.length, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}
// 绑定 buffer
function bindBufferData (gl, data, target) {
    let dataBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(target, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(target);
}

function keydown (ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    switch (ev.keyCode) {
        case 40:
        // Down Arrow
            g_arm1Angle -= ANGLE_STEP;
            break;
        case 37:
        // Left Arrow
            g_joint1Angle -= ANGLE_STEP;
            break;
        case 38:
        // Up Arrow
            g_arm1Angle += ANGLE_STEP;
            break;
        case 39:
        // Right Arrow
            g_joint1Angle += ANGLE_STEP;
            break;
        case 81:
        // Q
            g_joint2Angle -= ANGLE_STEP;
            break;
        case 69:
        // E
            g_joint2Angle += ANGLE_STEP;
            break;
        case 90:
        // Z
            g_joint3Angle -= ANGLE_STEP;
            break;
        case 67:
        // C
            g_joint3Angle += ANGLE_STEP;
            break;
        default: return;
    }
    draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix);
}

function draw (gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, u_ModelMatrix) {
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    g_modelMatrix.setTranslate(0.0, -2.0, 0.0);
    g_modelMatrix.scale(1.5, 0.5, 1.5);
    gl.uniformMatrix4fv(u_ModelMatrix, false, g_modelMatrix.elements);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
    // Arm1
    g_modelMatrix.translate(0.5, 4.0, 0.5);
    g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0); // 绕 Y 轴旋转
    g_modelMatrix.scale(0.3, 2.0, 0.3);
    gl.uniformMatrix4fv(u_ModelMatrix, false, g_modelMatrix.elements);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
    var arm1Height = 1.5; // arm1 长度
    // Arm2 前一个 g_modelMatrix 已经将计算传入了 translate + oldMatrix
    g_modelMatrix.translate(0.0, arm1Height, 0.0); // 移动至 joint1 处
    g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0); // 绕 z 轴旋转
    g_modelMatrix.scale(1.0, 0.5, 1.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, g_modelMatrix.elements);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);

    // hands
    var joint2Height = 1.2;
    g_modelMatrix.translate(joint2Height, 0.0, 0.0);
    g_modelMatrix.rotate(g_joint2Angle, 1.0, 0.0, 0.0);
    g_modelMatrix.scale(0.3, 0.7, 1.5);
    gl.uniformMatrix4fv(u_ModelMatrix, false, g_modelMatrix.elements);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
}

function drawBox (gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);    // 模型变换矩阵
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
    // 计算法线变换矩阵并传给 u_NormalMatrix 变量
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
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