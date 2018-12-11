
    // gl_position is a global variable in webgl system
var VSHADER_SOURCE = 
                "attribute vec4 a_Position;\n"+
                "void main() { \n"+
                "   gl_Position = a_Position;\n"+
                "   gl_PointSize = 10.0;\n"+
                "}\n";
var FSHADER_SOURCE = 
                "precision mediump float; \n" +
                "uniform vec4 u_FragColor;\n "+  // uniform 变量
                "void main() {\n"+
                "   gl_FragColor = u_FragColor;\n"+
                "}\n";

function main() {
    var canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Shader program init failed!');
    }

    var a_Position = gl.getAttribLocation(gl.program, "a_Position");
    // a_Position is a buffer CS:IP address, if return the variable < 0 means did not get the variable
    if (a_Position < 0) {
        console.warn('Can\'t find a_Position in the WebGL System');
        return;
    }


    
    // change the color 
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.warn('Can\'t find u_FragColor in the WebGL System');
        return;
    }

    // add mouse touch listener
    canvas.onmousedown = function (handle) {
        click(handle, gl, canvas, a_Position, u_FragColor);
    };



    // bit 存储单位 
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = []; // 鼠标点击位置数据
var g_colors = [];
function click(handle, gl, canvas, a_Position, u_FragColor) {
    let x = handle.clientX;
    let y = handle.clientY;
    
    var rect = handle.target.getBoundingClientRect();
    console.log("Rect: " + rect);
    // coordinate.png  {(x - x0) , - (y - y0)};
    // webgl 中心坐标 区间为 [-1, 1] 为单位坐标轴
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    g_points.push([x, y]);

    if (x >= 0.0 && y >= 0.0) {
        g_colors.push([1.0, 0.0, 0.0, 1.0]);
    }
    else if (x < 0.0 && y <= 0.0) {
        g_colors.push([0.0, 1.0, 0.0, 1.0]);
    }
    else {
        g_colors.push([0.0, 0.0, 1.0, 1.0]);
    }

    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;

    for (let i = 0; i < len; i++) {
        let rgba = g_colors[i];
        let pos = g_points[i];
        gl.vertexAttrib2f(a_Position, pos[0], pos[1]);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}