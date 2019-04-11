const Data = require('./data');

const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Color;\n'+
                    'varying vec4 v_Color;\n'+
                    'void main () {\n' +
                    'gl_Position = a_Position; \n'+
                    'gl_PointSize = 10.0;\n'+
                    'v_Color = a_Color;\n'+
                    '}\n';
const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'uniform vec4 u_FragColor;\n'+
                    'varying vec4 v_Color;\n'+
                    'void main() {\n' +
                    'float dist = distance(gl_PointCoord, vec2(0.5, 0.5));\n'+
                    'if (dist < 0.5) {'+        // 点的半径
                    'gl_FragColor = v_Color;\n'+
                    '} else {discard;}\n'+
                    '}\n';

window.onload = main;
let datas = [];
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

    document.onmousedown = function (event) {
        catchMouseDownEvent(event, canvas, gl, a_Position, a_Color);
    }
}

function catchMouseDownEvent (event, canvas, gl, a_Position, a_Color) {
    let dataBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
    let x = event.clientX;
    let y = event.clientY;
    let rect = event.target.getBoundingClientRect();

    let pos = {
        x: ((x - rect.left) - canvas.width / 2) / (canvas.width / 2),
        y: (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2)
    };

    console.log(`pos: ${pos.x} + ${pos.y}`);

    datas.push(pos.x);
    datas.push(pos.y);
    for (let i = 0; i < 3; i++)
        datas.push(Math.random().toFixed(2));
    datas.push(1.0);
    // clear
    gl.clear(gl.COLOR_BUFFER_BIT);

    let dataArray = new Float32Array(datas);
    let size = dataArray.BYTES_PER_ELEMENT;

    gl.bufferData(gl.ARRAY_BUFFER, dataArray, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 6 * size, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 6 * size, 2 * size);
    gl.enableVertexAttribArray(a_Color);

    gl.drawArrays(gl.POINTS, 0, (dataArray.length + 1) / 6);
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