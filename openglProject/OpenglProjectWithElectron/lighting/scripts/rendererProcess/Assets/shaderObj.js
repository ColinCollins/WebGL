const Program = require('../program');

function Shader (gl, shaderName, vertexShaderSources, fragmentShaderSources) {
    let program = new Program(gl, vertexShaderSources, fragmentShaderSources);
    Shader.Map.set(shaderName, program);
}

Shader.Map = new Map();

module.exports = Shader;