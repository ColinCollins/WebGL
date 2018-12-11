const VSHADER_SOURCE =
                        "attribute vec4 a_Position; \n" +
                        "void main() { \n" +
                        "gl_Position = a_Position; \n" +
                        "gl_PointSize = 10;\n" +
                        "}\n";

const FSHADER_SOURCE =
                        "precision mediump float; \n" +
                        "uniform vec4 u_FragColor;\n" +
                        "void main () { \n" +
                        "gl_FragColor = u_FragColor;" +
                        "}\n";
const PXRATIO = 10;

let canvas = null;
let gl = null;
let linePoints = [];

function main () {
    init();

    let a_Position = getAttribPosition();
    let u_FragColor = getUniformFragColor();
    // use to record the line points
    canvas.onmousedown = (handle) => {
        recLinePoints(handle, a_Position, u_FragColor);
    };
}

function init() {
    canvas = document.getElementById('webgl');
    gl = getWebGLContext(canvas);
}

function getAttribPosition () {
    if (!gl) return;
    let a_Position = gl.getAttribLocation(gl.program, 'a_Positions');
    if (a_Position < 0) {
        console.error('Failed get the a_Position.');
        return null;
    }

    return a_Position;
}

function getUniformFragColor () {
    if (!gl) return;
    let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.error('Failed get the u_FragColor.');
        return null;
    }

    return u_FragColor;
}

// use the only one point to draw the line
function recLinePoints (handle, a_Position, u_FragColor) {
    // did not get the line target points
    if (linePoints.length < 2) {
        let pos = {
            x: handle.x,
            y: handle.y
        };
        // insert the new pos
        linePoints.push(pos);
        return;
    }
    else {
        // random color
        gl.uniform4f(u_FragColor, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 1.0);
        // create the buffer data area
        let vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        let origin = linePoints[0];
        let target = linePoints[1];
        let lines = new Float32Array();
        calculateLine(origin, target, lines);
        // bind buffer data
        gl.bufferData(gl.ARRAY_BUFFER, lines, gl.STATIC_DRAW);
        // normalize, stride, offset
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVexterAttribArray(a_Position);
        // clear the canvas COlOR_BUFFER_BIT
        gl.clear(gl.COLOR_BUFFER_BIT);
        // draw the line.
        gl.drawArrays(gl.POINTS, 0, line.length);
        // destroy the area.
        endDraw();
    }
}

function calculateLine (pos1, pos2, lines) {

    let tempPoint = {x: 0.0, y: 0.0};
    if (lines.length > 0) {
        tempPoint.x = lines[lines.length-1];
        tempPoint.y = lines[lines.length-2];
    }

    if (tempPoint.x === pos2.x && tempPoint.y === pos2.y) {
        console.log('Done!');
        return;
    }

    let tan = (pos1.y - pos2.y) / (pos1.x - pos2.x);
    if (tan > 0) {
        positive();
    }
    else {
        navigative();
    }

}
// add
function positive () {

}

// sub
function navigative () {

}

// transform to webgl coordinate
function trans2WebGLCoordinate (handle) {
    let x, y = 0;
    let rect = canvas.getBoundingClientRect();

    x = (handle.x - (rect.width / 2)) / rect.width;
    y = ((rect.height / 2) - handle.y) / rect.height;

    return {x: x, y: y};
}

function endDraw () {
    gl.disableVexterAttribArray(a_Position);
    // destroy the array
    linePoints.length = 0;
}