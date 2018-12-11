"use strict" // 严格模式

function createShader(gl, type, source){
    var shader = gl.createShader(type);
    gl.shaderSource(shader,source);
    gl.compileShader(shader);

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS); // 获取shader
    if(success){return shader;}
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
};

function createProgram(gl, vertexShader, fragmentShader){
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if(success){
            return program;
        }
        console.log(gl.getProgramParameter(program, gl.LINK_STATUS));
        gl.deleteProgram(program);
}

function main(){

    console.log("get execute");

    var canvas = document.getElementById("c");
    var gl = canvas.getContext("webgl");
    if(!gl){return ;}
    
// Get the strings for our GLSL shaders
var vertexShaderSource = document.getElementById("2d-vertex-shader").text;
var fragmentShaderSource = document.getElementById("2d-fragment-shader").text;

//create GLSL shaders, upload the GLSL source, compile the shader
var vertexShader = createShader(gl,gl.VERTEX_SHADER,vertexShaderSource);
var fragmentShader = createShader(gl,gl.FRAGMENT_SHADER, fragmentShaderSource);

var program = createProgram(gl, vertexShader, fragmentShader);  // 创建 GLSLprogram

var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

var positionBuffer = gl.createBuffer(); // 要写入GPU的缓存流
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); //绑定写入流

var positions = [
    0.2,0.2,
    0,0.4,
    0.8,0.3
];
//都是左下角的xy coordinate

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions),gl.STATIC_DRAW); // 创建Float32 array 的position数据类型，吸入 arrayBuffer

// code above this line is initialzation code 
// code below this line is rendering code 

webglUtils.resizeCanvasToDisplaySize(gl.canvas);

gl.viewport(0,0,gl.canvas.width, gl.canvas.height); // 获取canvas 视图实时大小

gl.clearColor(0,0,0,0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);

gl.enableVertexAttribArray(positionAttributeLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

var size = 2;
var type = gl.FLOAT;
var normalize = false;
var stride = 0;
var offset = 0;
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
//size 坐标（也可以是参数参数个数）， 数据类型， 当被访问时，normalize 固定点数据值是否应该被归一化或者直接转换成固定点
//stride 步长间隔
// offset 第一个值的偏移量。

//draw
var primitiveType = gl.TRIANGLES;
var offset = 0;
var count = 3;
gl.drawArrays(primitiveType, offset, count);
}
/* var uniLocation = gl.getUniformLocation(prg, 'mvpMatrix');  
      
// 向uniformLocation中传入坐标变换矩阵  
gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);   
    相同点-》实际就是数据顶点 mvpMatrix 仿射矩阵变换过后， unifomMatrix4 进行坐标点的变化。
*/
main();