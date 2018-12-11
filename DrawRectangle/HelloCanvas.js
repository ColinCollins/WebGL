// vertex shader source

// attribute  sq 存储限定符，记录与顶点有关的顶点数据
// uniform 记录与顶点无关的数据
var VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n'+
    'void main() {\n' +
    'gl_Position = a_Position\n'+
    'gl_PointSize = 10.0;\n'    // 绘制点占像素尺寸
    +'}\n'
// fragment shader source
var FSHADER_SOURCE = 
    'void main () {\n'+
    'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n'+
    '}\n'

function main() {
    var canvas = document.getElementById('webgl');
    
    // 从 webgl system 中获取 变量对象 -- gl.program
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // 传入 vec3 属性值到 a_position
    // webgl system 绑定数据需要对外的 API 接口。
    /* 
        vertextAttribute1f -> 绑定一个变量
        vertextAttribute2f -> 绑定两个变量
        vertextAttribute3f -> 绑定三个变量
        vertextAttribute4f -> 绑定四个变量
    */
    gl.vertexAttribute3f(a_Position, 0.0, 0.0, 0.0);
    // vertex attribute 3 value float 严格要求变量的类型 float int float32 double


}
