const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec2 a_TexCoord;\n' +
                    'varying vec2 v_TexCoord;\n'+
                    'void main () {\n' +
                    'gl_Position = a_Position; \n'+
                    'v_TexCoord = a_TexCoord;\n'+
                    '}\n';
const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'uniform sampler2D u_Sampler;\n'+
                    'varying vec2 v_TexCoord;\n'+
                    'void main() {\n' +
                    'gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n'+
                    '}\n';

var OFFSCREEN_WIDTH = 256;
var OFFSCREEN_HEIGHT = 256;

function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('init shader failed.');
        return;
    }

    // custom program
    let cube = initVertexBuffersForCube(gl);
    let plane = initVertexBufferForPlane(gl);

    var texture = initTextures(gl);
    // 初始化帧缓冲区
    var fbo = initFramebufferObject(gl);
    // 颜色缓冲区
    var viewProjectMatrix = new Matrix4();
    viewProjectMatrix.setPerspective(30, canvas.width / canvas.height, 1.0, 100.0);
    viewProjectMatrix.lookAt(0.0, 0.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
    // 帧缓冲区
    let viewProjMatrixFBO = new Matrix4();
        viewProjMatrixFBO.setPerspective(30.0, OFFSCREEN_WIDTH/OFFSCREEN_HEIGHT, 1.0, 100.0);
        viewProjMatrixFBO.lookAt(0.0, 0.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    draw(gl, canvas, fbo, plane, cube, currentAngle, texture, viewProjectMatrix, viewProjMatrixFBO);
}

function draw (gl, canvas, fbo, plane, cube, currentAngle, texture, viewProjMatrix, viewProjMatrixFBO) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
    // background change color
    gl.clearColor(0.2, 0.2, 0.4, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    drawTextureCube(gl, gl.program, cube, angle, texture, viewProjMatrixFBO);
    // 切换 绘制目标为 颜色缓冲区
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // 设置视图窗口
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    drawTexturePlane(gl, gl.program, plane, angle,  fbo.texture, viewProjMatrix);
}

function drawTextureCube () {

}

function drawTexturePlane () {

}

function initFramebufferObject () {
    var framebuffer, texture, depthBuffer;

    // 创建帧缓冲区
    framebuffer = gl.createFramebuffer();
    // 创建纹理对象
    texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 设置 texture image 数据
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0 , gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // 保存当前纹理
    framebuffer.texture = texture;
    // 创建渲染缓冲区
    depthbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
    // 绑定对应缓冲区数据设置
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMEN, gl.RENDERBUFFER, depthBuffer);

    var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (e !== gl.FRAMEBUFFER_COMPLETE) {
        console.error('Framebuffer object is incomplete');
        return;
    }

    return framebuffer;
}

function initVertexBuffersForCube () {

}

function initVertexBufferForPlane () {

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