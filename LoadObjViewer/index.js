const load3D = require('./load3DModel');

const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Normal;\n'+
                    'attribute vec2 a_TexCoord;\n'+
                    'uniform vec3 u_AmbientLight;\n'+
                    'uniform vec3 u_DiffuseColor;\n'+
                    'uniform vec3 u_LightColor;\n'+
                    'uniform vec3 u_LightPosition;\n'+
                    'uniform mat4 u_MvpMatrix;\n'+
                    'uniform mat4 u_ModelMatrix;\n'+
                    'uniform mat4 u_NormalMatrix;\n'+
                    'varying vec4 v_Color;\n'+
                    'varying vec2 v_TexCoord;\n'+
                    'void main () {\n' +
                    'gl_Position = u_MvpMatrix * a_Position; \n'+
                    'vec3 vertexPosition = vec3(normalize(u_LightPosition - vec3(u_ModelMatrix * a_Position)));\n'+
                    'vec3 normal = vec3(u_NormalMatrix * a_Normal);\n'+
                    'float nDotL = max(dot(vertexPosition, normal), 0.0);\n'+
                    'vec3 diffuse = u_LightColor * u_DiffuseColor * nDotL;\n'+
                    'vec3 ambient = u_AmbientLight;\n'+
                    'v_Color = vec4(diffuse + ambient, 1.0);\n'+
                    'v_TexCoord = a_TexCoord;\n'+
                    '}\n';
const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'varying vec4 v_Color;\n'+
                    'varying vec2 v_TexCoord;\n'+
                    'uniform sampler2D u_Sampler;\n'+
                    'void main() {\n' +
                    'vec4 textureColor = texture2D(u_Sampler, v_TexCoord);\n'+
                    'gl_FragColor = v_Color * textureColor;\n'+
                    '}\n';
window.onload = main;
function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);
    let program = initShaders0(gl, VSHADER_SOURCE, FSHADER_SOURCE);

    // custom program
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const objPath = 'E:\\GitStone\\WebGL\\res\\Iron_Man_Mark_42\\Mark 42.obj';
    const mtlPath = 'E:\\GitStone\\WebGL\\res\\Iron_Man_Mark_42\\Mark 42.mtl';
    const texPath = 'E:\\GitStone\\WebGL\\res\\Iron_Man_Mark_42\\maps\\42.png';

    let objRes = load3D.loadOBJ(objPath);
    // mtl will return a array
    let mtlRes = load3D.loadMTL(mtlPath);
    if (mtlRes.length === 1) {
        console.log(`Material res num: ${mtlRes.length}`);
    }
    let mtlProp = parseMtlRes(mtlRes);
    // let the image become a param belong to the callback method
    load3D.loadTex(texPath, callback);
    // attribute
    program.a_Position = getAttribProp(gl, 'a_Position', program);
    program.a_Normal = getAttribProp(gl, 'a_Normal', program);
    program.a_TexCoord = getAttribProp(gl, 'a_TexCoord', program);

    bindAttribData(gl, objRes.vertexData, program.a_Position, gl.FLOAT, 3);
    bindAttribData(gl, objRes.normalData, program.a_Color, gl.FLOAT, 3);
    bindAttribData(gl, objRes.textureData, program.a_TexCoord, gl.FLOAT, 2);
    // uniform
    program.u_MvpMatrix = getUniformProp(gl, 'u_MvpMatrix', program);
    program.u_ModelMatrix = getUniformProp(gl, 'u_ModelMatrix', program);
    program.u_NormalMatrix = getUniformProp(gl, 'u_NormalMatrix', program);

    let mvpMatrix = new Matrix4().setPerspective(40.0, canvas.width / canvas.height, 1, 100);
    mvpMatrix.lookAt(
        0.0, 5.0, 4.0,
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0
    );
    let angle = 10.0;
    let modelMatrix = new Matrix4().setRotate(angle, 0.0, 1.0, 0.0);
    mvpMatrix.multiply(modelMatrix);

    let normalMatrix = new Matrix4().setInverseOf(modelMatrix).transpose();
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, mvpMatrix.elements);
    gl.uniformMatrix4fv(program.u_ModelMatrix, false, modelMatrix.elements);
    gl.uniformMatrix4fv(program.u_NormalMatrix, false, normalMatrix.elements);

    program.u_LightColor = getUniformProp(gl, 'u_LightColor', program);
    program.u_LightPosition = getUniformProp(gl, 'u_LightPosition', program);
    program.u_AmbientLight = getUniformProp(gl, 'u_AmbientLight', program);
    program.u_DiffuseColor = getUniformProp(gl, 'u_DiffuseColor', program);

    gl.uniform3fv(program.u_LightPosition, new Vector3([2.0, 4.0, 2.0]).elements);
    gl.uniform3fv(program.u_LightColor, new Vector3([1.0, 1.0, 1.0]).elements);
    gl.uniform3fv(program.u_AmbientLight, mtlProp.ambient.elements);
    // 因为没有 a_Color, 所以 VSHADER_SOURCE 需要重新考虑 diffuse 和 ambient 的计算.
    gl.uniform3fv(program.u_DiffuseColor, mtlProp.diffuse.elements);

    function callback (image) {
        initTexture(gl, image, u_Sampler, gl.TEXTURE0);
        // draw obj
        draw(gl);
    }
}

function parseMtlRes (mtlRes) {
    let ambient = new Vector3([mtlRes.Ka.red, mtlRes.Ka.green, mtlRes.Ka.blue]);
    let diffuse = new Vector3([mtlRes.Kd.red, mtlRes.Kd.green, mtlRes.Kd.blue]);
    let highLight = new Vector3([mtlRes.Ks.red, mtlRes.Ks.green, mtlRes.Ks.blue]);
    let mapKa = mtlRes.map_Ka ? mtlRes.map_Ka.file : null;
    let mapKd = mtlRes.map_Kd ? mtlRes.map_Kd.file : null;
    let mapKs = mtlRes.map_Ks ? mtlRes.map_Ks.file : null;
    let mapD = mtlRes.map_d ? mtlRes.map_d.file : null;
    // dissolve 溶解
    let dissolve = mtlRes.dissolve;
    return {
        ambient: ambient,
        diffuse: diffuse,
        highLight: highLight,
        mapKa: mapKa,
        mapKd: mapKd,
        mapKs: mapKs,
        mapD: mapD,
        dissolve: dissolve
    }
}

function draw (gl) {

}

function initTexture (gl, image, sampler, textureCache) {
    let texture = gl.createTexture();
    if (textureCache)
        gl.activeTexture(textureCache);
    else
        gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTUER_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(sampler, 0);
}

function initShaders0 (gl, VSHADER_SOURCE, FSHADER_SOURCE) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, VSHADER_SOURCE);
    let fragShader = loadShader(gl, gl.FRAGMENT_SHADER, FSHADER_SOURCE);
    return initProgram(gl, vertexShader, fragShader);
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

    gl.useProgram(program);
    gl.program = program;

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