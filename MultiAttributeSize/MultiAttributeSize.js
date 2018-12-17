const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'void main () {\n' +
                    'gl_Position = a_Position; \n'+
                    '}\n';
const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'uniform vec4 u_FragColor;\n'+
                    'void main() {\n' +
                    'gl_FragColor = u_FragColor;\n'+
                    '}\n';


function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebglContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('init shader failed.');
        return;
    }

    // custom program

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