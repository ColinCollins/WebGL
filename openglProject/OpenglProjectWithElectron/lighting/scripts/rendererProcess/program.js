function Program (gl, VSHADER_SOURCE, FSHADER_SOURCE, ProgramName) {
    this.program = initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    // string, program
    Program.Map.set(ProgramName, this.program);
}
// Generate a map to use.
Program.Map = new Map();

function initShader (gl, VSHADER_SOURCE, FSHADER_SOURCE) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, VSHADER_SOURCE);
    let fragShader = loadShader(gl, gl.FRAGMENT_SHADER, FSHADER_SOURCE);

    return initProgram(gl, vertexShader, fragShader);
}

function loadShader (gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource (shader, source);
    gl.compileShader(shader);

    let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        let msg = gl.getShaderInfoLog(shader);
        console.log(`Shader init Error: ${msg}`);
        return;
    }

    let shaderTarget = gl.getShaderParameter (shader, gl.SHADER_TYPE);
    if (shaderTarget) console.log(`Shader init: ${shaderTarget}`);

    return shader;
}

function initProgram (gl, vertexShader, fragShader) {
    let program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragShader);

    gl.linkProgram(program);

    let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        let msg = gl.getProgramInfoLog(program);
        console.error(`init program validate error: ${msg}`);
        return;
    }

    return program;
}

module.exports = Program;