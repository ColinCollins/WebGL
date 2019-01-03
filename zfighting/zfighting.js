const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Color;\n'+
                    'varying vec4 v_Color;\n'+
                    'uniform mat4 u_showMatrix;\n'+
                    'void main () {\n' +
                    'gl_Position = u_showMatrix * a_Position; \n'+
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

    // custom program  没有使用 polygonOffset 一样没有 depth 的冲突报错或者警告。。。。不知道是不是 webgl 升级了所以省去了内容。
    // 多边形偏移 -> 用于解决深度冲突
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.POLYGON_OFFSET_FILL);

    let a_Position = getAttribProp(gl, 'a_Position');
    let a_Color = getAttribProp(gl, 'a_Color');

    let u_showMatrix = getUniformProp(gl, 'u_showMatrix');
    // fov aspect near far
    let aspect = canvas.width / canvas.height;
    let matrix = new Matrix4().setPerspective(30.0, aspect, 1, 100).lookAt(0,0,10, 0, 0, -100, 0, 1, 0);

    gl.uniformMatrix4fv(u_showMatrix, false, matrix.elements);

    let vertices = initVertices();
    let size = vertices.BYTES_PER_ELEMENT;

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, size * 6, 0);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, size * 6, size * 3);

    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    //gl.polygonOffset(1.0, 1.0);
    gl.drawArrays(gl.TRIANGLES, 3, 3);
}

function initVertices () {
    return new Float32Array([
        0.0, 2.5, -5.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        -2.5, -2.5, -5.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        2.5, -2.5, -5.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),

        0.0, 3.0, -5.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        -3.0, -3.0, -5.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
        3.0, -3.0, -5.0, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2),
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