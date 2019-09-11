const Program = require('../program');

function Shader (shaderName, vertexShaderSources, fragmentShaderSources) {
    let program = new Program(vertexShaderSources, fragmentShaderSources);
    Shader.Map.set(shaderName, program);
}

Shader.Map = new Map();

module.exports = Shader;