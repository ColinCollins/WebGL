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


function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('init shader failed.');
        return;
    }
    // custom program
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    let n = initVertices();

    let u_MvpMatrix = getUniformProp(gl, 'u_MvpMatrix');

    let mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30.0, 1, 1, 100);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

    function initVertices () {
        let vertices = new Float32Array([
            1.0, 1.0, 1.0, 1.0, 1.0, 1.0,   // 0
            -1.0, 1.0, 1.0, 1.0, 0.0, 1.0,  // 1
            -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, // 2
            1.0, -1.0, 1.0, 1.0, 1.0, 0.0,  // 3
            1.0, -1.0, -1.0, 0.0, 1.0, 0.0, // 4
            1.0, 1.0, -1.0, 0.0, 1.0, 1.0,  // 5
            -1.0, 1.0, -1.0, 0.0, 0.0, 1.0, // 6
            -1.0, -1.0, -1.0, 0.0, 0.0, 0.0 // 7
        ]);
        const indices = new Uint8Array([
            0, 1, 2, 0, 2, 3,   // front
            0, 3, 4, 0, 4, 5,   // right
            0, 5, 6, 0, 6, 1,   // top
            1, 6, 7, 1, 7, 2,   // left
            7, 4, 3, 7, 3, 2,   // bottom
            4, 7, 6, 4, 6, 5    // back
        ]);

        let vertexColorBuffer = gl.createBuffer();
        let indexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        let FSIZE = vertices.BYTES_PER_ELEMENT;

        let a_Position = getAttribProp(gl, 'a_Position');
        let a_Color = getAttribProp(gl, 'a_Color');

        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);

        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Color);
        // 绘制　Cube， 顶点索引顺序
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        return indices.length;
    }
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