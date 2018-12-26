const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n'+
                    'uniform vec4 u_Translation; \n'+
                    'uniform mat4 u_xformMatrix; \n'+
                    'void main() {\n'+
                    'gl_Position = (a_Position + u_Translation) * u_xformMatrix;\n'+
                    'gl_PointSize = 10.0;\n'+
                    '}\n';

const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'uniform vec4 u_FragColor;\n'+
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
    let u_FragColor = getUniformProp(gl, 'u_FragColor');
    let u_Translation = getUniformProp(gl, 'u_Translation');
    let u_xformMatrix = getUniformProp(gl, 'u_xformMatrix');

    // vertexAttrib2f / 3f/ 4f
    let vertexBuffer = gl.createBuffer();
    let vertices = initVertex();// RanglePoint
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 将顶点数据传入缓存区域，标记缓存数据的数据存储模式
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    // 绑定数据传出对象，传出格式，传出数据类型，
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    // 开启传输
    gl.enableVertexAttribArray(a_Position);

    //let moveSystem = require('./Move')(canvas, u_Translation);
    // AffineTransform
    let transPoints = [-1.0, 0.5, 0.5];
    let tx = ty = 0.0;
    canvas.onmousedown = () => {
        gl.clear(gl.COLOR_BUFFER_BIT);
        // 这里相当于改了 anchor， 如果要改 position 还是要调整 matrix
        //gl.uniform4f(u_Translation, transPoints[0], transPoints[1], transPoints[2], 0);
        //gl.uniformMatrix4fv(u_xformMatrix, false, initMatrix(1, 0, transPoints[0], transPoints[1]));
        tx = ty = 0.5;
        gl.uniform4f(u_FragColor, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 1.0);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    gl.uniform4f(u_FragColor, Math.random().toFixed(2), Math.random().toFixed(2), Math.random().toFixed(2), 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    const angleSpeed = 2;
    let angle = 0;
    setInterval(function () {
        if (angle > 360) {
            angle = 0;
        }

        angle += angleSpeed;
        let radinas = (angle / 180) * Math.PI;
        let cos = Math.cos(radinas);
        let sin = Math.sin(radinas);
        // false -> Transpose webgl must set this value;
        gl.uniformMatrix4fv(u_xformMatrix, false, initMatrix(cos, sin, tx, ty));

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }, 20);
}

function initVertex () {
    return new Float32Array([
        -0.5, -0.5,
        0, 0.5,
        0.5, -0.5
    ]);
}

function initMatrix (cos, sin, tx = 0, ty = 0) {
    return new Float32Array([
        cos, -sin, 0.0, tx,
        sin, cos, 0.0, ty,
        0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
}

function getAttribPosition (gl) {
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.error('a_Position init Failed.');
        return null;
    }
    return a_Position;
}

function getUniformProp (gl, name) {
    let obj = gl.getUniformLocation(gl.program, name);
    if (!obj) {
        console.error('Uniform init Failed.');
        return null;
    }
    return obj;
}

