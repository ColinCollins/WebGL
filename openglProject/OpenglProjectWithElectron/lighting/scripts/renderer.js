const {ipcRenderer} = require('electron');
const Program = require('./program');

main();
function main() {
    ipcRenderer.send('init-success');
}

ipcRenderer.on('load shader source', (e, sources) => {
    console.log('Program Init');
    InitScene(sources);
});

function InitScene(sources) {
    window.canvas = $('#webgl')[0];
    window.canvasWidth = canvas.width;
    window.canvasHeight = canvas.Height;

    window.gl = getWebGLContext(canvas);
    log(`Init gl: ${gl}`);

    window.proxy = new Program(gl, sources.vshaderSource, sources.fshaderSource);
    log(`Init program: ${proxy}`);

    gl.useProgram(proxy.program);
}

function getAttribProp(gl, program, name) {
    let prop = gl.getAttribLocation(program, name);
    if (prop < 0) {
        console.error('attribute prop init failed.');
        return null;
    }
    return prop;
}

function getUniformProp (gl, program, name) {
    let prop = gl.getUniformLocation(program, name);
    if(!prop) {
        console.error('uniform prop init failed.');
        return null;
    }
    return prop;
}