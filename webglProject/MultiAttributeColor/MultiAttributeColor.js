/**
 * varing 数据类型是控制 顶点着色器向片元着色器传递数据
 */
const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Color; \n'+
                    'varying vec4 v_Color;\n'+
                    'void main () {\n' +
                    'gl_Position = a_Position; \n'+
                    'v_Color = a_Color;\n'+
                    'gl_PointSize = 10.0; \n'+
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
    let a_Position = getAttribProp(gl, 'a_Position');
    let a_Color = getAttribProp(gl, 'a_Color');

    let vertexBuffer = gl.createBuffer();
    let vertices = initVertices();
    let element = vertices.BYTES_PER_ELEMENT;

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, element * 5, 0);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, element * 5, element * 2);
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);

    gl.clear(gl.COLOR_BUFFER_BTI);
    gl.drawArrays(gl.TRIANGLES, 0 , 3);
};

function initVertices () {
    return new Float32Array([
        -0.5, -0.5,  Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        0, 0.5,  Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        0.5, -0.5,  Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2)
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