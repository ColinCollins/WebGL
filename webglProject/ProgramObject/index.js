const Data = require('./data');

const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Color;\n'+
                    'uniform mat4 u_MvpMatrix;\n'+
                    'varying vec4 v_Color;\n'+
                    'void main () {\n' +
                    'gl_Position = u_MvpMatrix * a_Position; \n'+
                    'v_Color = a_Color;\n'+
                    '}\n';
const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'varying vec4 v_Color;\n'+
                    'void main() {\n' +
                    'gl_FragColor = v_Color;\n'+
                    '}\n';

const VSHADER_SOURCE2 =
                    'attribute vec4 a_Position;\n'+
                    'attribute vec2 a_TexCoord;\n'+
                    'attribute vec4 a_Normal;\n'+
                    'uniform vec3 u_LightColor;\n'+
                    'uniform vec3 u_LightPosition;\n'+
                    'uniform vec3 u_AmbientLight;\n'+
                    'uniform mat4 u_MvpMatrix;\n'+
                    'uniform mat4 u_ModelMatrix;\n'+
                    'uniform mat4 u_NormalMatrix;\n'+
                    'varying vec4 v_Color;\n'+
                    'varying vec2 v_TexCoord;\n'+
                    'void main () {\n' +
                    'gl_Position = u_MvpMatrix * a_Position;\n'+
                    'vec3 vertexDirection = normalize(u_LightPosition - vec3(u_ModelMatrix * a_Position));\n'+
                    'vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n'+
                    'float nDotL = max(dot(vertexDirection, normal), 0.0);\n'+
                    'vec3 diffuse = u_LightColor * nDotL;\n'+
                    'v_Color = vec4(diffuse + vec3(u_AmbientLight), 1.0);\n'+
                    'v_TexCoord = a_TexCoord;\n'+
                    '}\n';

const FSHADER_SOURCE2 =
                    'precision mediump float;\n'+
                    'varying vec2 v_TexCoord;\n'+
                    'uniform sampler2D u_Sampler;\n'+
                    'varying vec4 v_Color;\n'+
                    'void main() {\n' +
                    'vec4 color = texture2D(u_Sampler, v_TexCoord);\n'+
                    'gl_FragColor = color * v_Color;\n'+
                    '}\n';

window.onload = main;
function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);
    
    let program1 = initShaders0(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    let program2 = initShaders0(gl, VSHADER_SOURCE2, FSHADER_SOURCE2);
    // custom program
    let aspect = canvas.width / canvas.height;
    let mvpMatrix = new Matrix4().setPerspective(50.0, aspect, 1, 100);
    mvpMatrix.lookAt(
        0.0, 5.0, 15.0,
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0
    );
    // cube1
    gl.useProgram(program1);
    let a_Position = getAttribProp(gl, 'a_Position', program1);
    let a_Color = getAttribProp(gl, 'a_Color', program1);

    let u_MvpMatrix = getUniformProp(gl, 'u_MvpMatrix', program1);
    let modelMatrix = new Matrix4().setRotate(40.0, 0.0, 1.0, 0.0).translate(-5.0, 0.0, 0.0);
    mvpMatrix.multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    let indexBuffer = gl.createBuffer();
    let indices = Data.initIndexData();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // cube2
    gl.useProgram(program2);
    gl.enable(gl.DEPTH_TEST);

    let a_Position2 = getAttribProp(gl, 'a_Position', program2);
    let a_TexCoord = getAttribProp(gl, 'a_TexCoord', program2);
    let a_Normal = getAttribProp(gl, 'a_Normal', program2);
    let u_LightColor = getUniformProp(gl, 'u_LightColor', program2);
    gl.uniform3fv(u_LightColor, new Vector3([1.0, 1.0, 1.0]).elements);

    let u_LightPosition = getUniformProp(gl, 'u_LightPosition', program2);
    gl.uniform3fv(u_LightPosition, new Vector3([0.0, 5.0, 5.0]).elements);

    let u_AmbientLight = getUniformProp(gl, 'u_AmbientLight', program2);
    gl.uniform3fv(u_AmbientLight, new Vector3([0.5, 0.5, 0.5]).elements);

    let u_MvpMatrix2 = getUniformProp(gl, 'u_MvpMatrix', program2);
    let u_ModelMatrix = getUniformProp(gl, 'u_ModelMatrix', program2);
    let u_NormalMatrix = getUniformProp(gl, 'u_NormalMatrix', program2);

    modelMatrix = new Matrix4().setRotate(-70.0, 0.0, 1.0, 0.0).translate(5.0, 0.0, 0.0);
    mvpMatrix.multiply(modelMatrix);

    let normalMatrix = new Matrix4();
    normalMatrix.setInverseOf(modelMatrix).transpose();

    gl.uniformMatrix4fv(u_MvpMatrix2, false, mvpMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

    let image = new Image();
    image.onload = function () {
        initTexture(gl, image, program2);
        let tick = function () {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.useProgram(program1);
            drawCube1(gl, a_Position, a_Color, indices);
            gl.useProgram(program2);
            drawCube2(gl, a_Position2, a_TexCoord, a_Normal, indices);
            window.requestAnimationFrame(tick, canvas);
        }
        tick();
    };
    image.src = 'file://E:/GitStone/WebGL/res/zibuyu.jpg';
}

function drawCube1 (gl, a_Position, a_Color, indices) {
    bindAttribData(gl, Data.initVerticesData(), a_Position, gl.FLOAT, 3);
    bindAttribData(gl, Data.initColorData(), a_Color, gl.FLOAT, 3);
    drawElement(gl, indices);
}

function drawCube2 (gl, a_Position, a_TexCoord, a_Normal, indices) {
    bindAttribData(gl, Data.initVerticesData(), a_Position, gl.FLOAT, 3);
    bindAttribData(gl, Data.initTexCoordVertex(), a_TexCoord, gl.FLOAT, 2);
    bindAttribData(gl, Data.initNormalizeData(), a_Normal, gl.FLOAT, 3);
    drawElement(gl, indices);
}

function drawElement(gl, indices) {
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
}

function initTexture (gl, image, program) {
    let texture = gl.createTexture();

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    let u_Sampler = getUniformProp(gl, 'u_Sampler', program);
    gl.uniform1i(u_Sampler, 0);
}

function initShaders0 (gl, VSHADER_SOURCE, FSHADER_SOURCE) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, VSHADER_SOURCE);
    let fragShader = loadShader(gl, gl.FRAGMENT_SHADER, FSHADER_SOURCE);
    return initProgram(gl, vertexShader, fragShader);;
}


function loadShader (gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    // 解析
    let compiled  = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        let msg = gl.getShaderInfoLog(shader);
        console.log(`shader init Error: ${msg}`);
        return;
    }
    let shaderTarget = gl.getShaderParameter(shader, gl.SHADER_TYPE);
    if (shaderTarget) console.log(`shader init: ${shaderTarget}`);
    return shader;
}

function initProgram (gl, vertexShader, fragShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragShader);

    gl.linkProgram(program);

    let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        let msg = gl.getProgramInfoLog(program);
        console.error(`init program link error: ${msg}`);
        return null;
    }

    gl.validateProgram(program);
    let validated = gl.getProgramParameter(program, gl.VALIDATE_STATUS);
    if (!validated) {
        let msg = gl.getProgramInfoLog(program);
        console.error(`int program validate error: ${msg}`);
        return null;
    }
    return program;
}

// bind Attribute data with indices
function bindAttribData (gl, data, target, format, dataLength) {
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(target, dataLength, format, false, 0, 0);
    gl.enableVertexAttribArray(target);
}

function getAttribProp (gl, name, program) {
    let prop = gl.getAttribLocation(program, name);
    if (prop < 0) {
        console.error('attribute init failed.');
        return null;
    }
    return prop;
}

function getUniformProp (gl, name, program) {
    let prop = gl.getUniformLocation(program, name);
    if(!prop) {
        console.error('uniform init failed.');
        return null;
    }
    return prop;
}