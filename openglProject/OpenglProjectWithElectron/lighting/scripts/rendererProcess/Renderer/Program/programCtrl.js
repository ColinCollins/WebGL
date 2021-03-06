
class ProgramCtrl {

    static ShaderMap = new Map();

    constructor (ProgramName, VSHADER_SOURCE, FSHADER_SOURCE) {
        this.program = this.initShader(VSHADER_SOURCE, FSHADER_SOURCE);
        // string, program
        Program.ShaderMap.set(ProgramName, this.program);
    }

    static initShader (VSHADER_SOURCE, FSHADER_SOURCE) {
        let vertexShader = this.loadShader(gl.VERTEX_SHADER, VSHADER_SOURCE);
        let fragShader = this.loadShader(gl.FRAGMENT_SHADER, FSHADER_SOURCE);

        return this.initProgram(vertexShader, fragShader);
    }

    static loadShader (type, source) {
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

    static initProgram (vertexShader, fragShader) {
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
}

export default ProgramCtrl