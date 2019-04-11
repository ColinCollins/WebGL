// attribute 是与顶点着色器相关的属性
const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec2 a_TexCoord;\n'+
                    'varying vec2 v_TexCoord;\n'+
                    'void main () {\n' +
                    'gl_Position = a_Position; \n'+
                    'v_TexCoord = a_TexCoord; \n'+
                    '}\n';
// sampler .. 取样器
const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'uniform sampler2D u_Sampler; \n'+
                    'varying vec2 v_TexCoord;\n'+
                    'void main() {\n' +
                    'gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n'+
                    '}\n';

function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('init shader failed.');
        return;
    }
    // canvas height / width -> gl_FragCoord 片元着色器 canvas 窗口坐标值
    console.log(gl.drawingBufferHeight);
    console.log(gl.drawingBufferWidth);
    // custom program

    let a_Position = getAttribProp(gl, 'a_Position');
    let a_TexCoord = getAttribProp(gl, 'a_TexCoord');
    // 传入相关数据
    let vertices = initVertices();
    let vertexTexCoordBuffer = gl.createBuffer();
    let eleSize= vertices.BYTES_PER_ELEMENT;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, eleSize * 4, 0);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, eleSize * 4, eleSize * 2);

    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_TexCoord);

    gl.clear(gl.COLOR_BUFFER_BIT);

    let texture = gl.createTexture(); // 创建纹理对象
    // simpler
    let u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    var image = new Image();
    // when load finished
    image.onload = function () {
        loadTexture(gl, 4, texture, u_Sampler, image);
    }
    image.src = 'file:///E:/GitStone/WebGL/res/psb.jpg';
    // 跨域
    image.crossOrigin = 'anonymous';
    document.body.appendChild(image);
}

function initVertices () {
    // return the vertex and uv(st) coordiate vertex
    // 顶点坐标用于确定 texture 在 webgl 坐标轴上位置
    // 纹理坐标用于确定最终在 texture 上渲染的纹理数据坐标位置, 截取的 image 的数据，取值可以 大于 1 产生的是缩小的效果
    return new Float32Array([
        -0.5, 0.5, 0.0, 2.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0 , 0.0
    ]);
}

function loadTexture (gl, n, texture, u_Sampler, image) {
    // 对纹理进行 y 轴翻转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // 开启 0 号 纹理单元
    gl.activeTexture(gl.TEXTURE0);
    // 绑定纹理
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // 配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // 传递 0 号纹理给着色器
    gl.uniform1i(u_Sampler, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
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