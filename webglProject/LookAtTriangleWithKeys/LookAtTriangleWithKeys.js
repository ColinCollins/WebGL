const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'varying vec4 v_Color;\n'+
                    'attribute vec4 a_Color;\n'+
                    'uniform mat4 u_ViewMatrix;\n'+
                    'void main () {\n' +
                    'gl_Position = u_ViewMatrix * a_Position; \n'+
                    'v_Color = a_Color;\n'+
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

    let u_ViewMatrix = getUniformProp(gl, 'u_ViewMatrix');
    let viewMatrix = initViewMatrix();
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    let verticesData = initVertexData();
    let size = verticesData.BYTES_PER_ELEMENT;

    let vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, verticesData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * size, 0);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * size, 3 * size);

    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);
    // change there is change the  translate -> stuff transform, is you want to change the view Matrix
    //  ViewMatrix * ModelMatrix * a_Position;
    document.onkeydown = (e) => {
        var keyID = e.keyCode ? e.keyCode :e.which;
        switch(keyID){
            case 65:
            case 37:
                // left
                viewMatrix.translate(-0.01, 0, 0);
                break;
            case 68:
            case 39:
                // right
                viewMatrix.translate(0.01, 0, 0);
                break;
            case 87:
            case 38:
                // up
                viewMatrix.translate(0, 0.01, 0);
                break;
            case 83:
            case 40:
                // down
                viewMatrix.translate(0, -0.01, 0);
                break;
            case 81:
                //Q Clockwise
                viewMatrix.rotate(1, 0, 1, 0);
                break;
            case 69:
                // E Counterclockwise
                viewMatrix.rotate(-1, 0, 1, 0);
                break;
        }

        console.log(e.keyCode);

        gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
        draw(gl);
    }

    draw(gl);
}
// draw webgl
function draw (gl) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 9);
}

function initViewMatrix () {
    return new Matrix4().setLookAt(
        0.20, 0.40, 0.25,
        0, 0.3, 0,
        0, 1, 0);
}

function initVertexData () {
    return new Float32Array([
        0.0, 0.5, -0.4.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        -0.5, -0.5, -0.4.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        0.5, -0.5, -0.4.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),

        0.5, 0.4, -0.2.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        -0.5, 0.4, -0.2.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        0.0, -0.6, -0.2.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),

        0.0, 0.5, 0.0.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        -0.5, -0.5, 0.0.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        0.5, -0.5, 0.0.toFixed(1), Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2)
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