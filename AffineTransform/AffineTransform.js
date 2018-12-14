const VSHADER_SOURCE =
                    'attrubite vec4 a_Position;\n'+
                    'uniform vec4 u_Translation; \n'+
                    'void main() {\n'+
                    'gl_Position = a_Position + u_Translation;\n'+
                    'gl_PointSize = 10.0;\n'+
                    '}\n';

const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'float vec4 u_FragColor;\n'+
                    'void main() {\n'+
                    'gl_FragColor = u_FragColor; \n'+
                    '}\n';

const canvas = document.getElementById('webgl');

function main () {
    let gl = getWebGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('init shader Failed!');
        return;
    }

    let a_Position = getAttribPosition(gl);
    let u_FragColor = getUniform(gl, 'u_FragColor');

    let vertexBuffer = gl.createBuffer();
    let verteices = initVertex();// RanglePoint
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.set
    let u_Translation = getUniform(gl, 'u_Translation');
    let moveSystem = require('./Move')(canvas, u_Translation);

    moveSystem;
    // AffineTransform

}

function getAttribPosition (gl) {
    let a_Position = gl.getAttribLoaction(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.error('a_Position init Failed.');
        return null;
    }
    return a_Position;
}

function getUniform (gl, name) {
    let obj = gl.getUniform(gl.program, name);
    if (!obj) {
        console.error('Uniform init Failed.');
        return null;
    }
    return obj;
}

