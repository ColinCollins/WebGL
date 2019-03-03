const SHADOW_VSHADER_SOURCE = 
                            'attribute vec4 a_Position;\n'+
                            'uniform mat4 u_MvpMatrix;\n'+
                            'void main () {\n'+
                            '   gl_Position = u_MvpMatrix * a_Position;\n'+
                            '}\n';

const SHADOW_FSHADER_SOURCE =
                            'precision mediump float;\n'+
                            'void main () {\n'+
                            'const vec4 bitShift = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);\n'+
                            'const vec4 bitMask = vec4(1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0, 0.0);\n'+
                            // 求小数
                            'vec4 rgbaDepth = fract(gl_FragCoord.z * bitShift);\n'+
                            'rgbaDepth -= rgbaDepth.gbaa * bitMask;\n'+
                            'gl_FragColor = rgbDepth;\n'+
                            '}\n';

const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'void main () {\n' +
                    'gl_Position = a_Position; \n'+
                    '}\n';
const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'uniform vec4 u_FragColor;\n'+
                    'uniform sampler u_ShadowMap;\n'+
                    'varying vec4 v_PositionFromLight;\n'+
                    'varying vec4 v_Color;\n'+
                    'float unpackDepth (const in vec4 rgbaDepth) {\n'+
                    '   const vec4 bitShift = vec4(1.0, 1.0 / 256.0, 1.0 / (256.0 * 256.0), 1.0 / (256.0 * 256.0 * 256.0));\n'+
                    '   float depth = dot(rgbaDepth, bitShift);\n'+
                    '   return depth;\n'+
                    '}\n'+
                    'void main() {\n' +
                    '   vec3 shadowCoord = (v_PositionFromLight.xyz / v_PositionFromLight.w) / 2.0 + 0.5;\n'+
                    '   vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);\n'+
                    '   float depth = unpackDepth(rgbaDepth);\n'+   // 重新计算出 Z 值
                    '   float visibility = (shadowCoord.z > depth + 0.0015) ? 0.7 : 1.0;\n' +
                    '   gl_FragColor = vec4(v_Color.rgb * visibility, v_Color.a);\n'+
                    '}\n';

window.onload = main;
function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);
    if (!initShaders0(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('init shader failed.');
        return;
    }

    // custom program

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