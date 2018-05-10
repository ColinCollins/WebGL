//根据 id 获取 数据信息
function create_shader (id) {
    var shader;

    var scriptElement = document.getElementById(id);

    if (!scriptElement) {return;}

    switch(scriptELement.type){
        case 'x-shader/x-vertex':
            shader = gl.createShader(gl.VERTEX_SHADER);
            break;
        case 'x-shader/x-fragment':
            shader = gl.createShader(gl.FRAGMENT_SHADER);
            break;
        default:
            break;
    }
    //将标签中的代码分配给 着色器, scriptElement.text 标签内文本内容获取编译内容
    gl.shaderSource(shader, scriptElement.text);
    // 编译着色器
    gl.compileShader(shader);
    // 判断编译是否完成
    /* 
        shader 传入编译器
        COMPILE_STATUS 属于常量，若返回 false 表示编译失败
    */
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    }
    else {
        console.error(gl.getShaderInfoLog(shader));
    }
}

// 程序对象的生成和连接

function create_program (vs, fs) {
    var program = gl.createProgram();
    
    // 分配着色器
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);

    // 将着色器连接
    gl.linkProgram(program);

    // 判断是否 连接上了
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {

        gl.useProgram(program);
        return program;
    }
    else {
        console.error(gl.getProgramInfoLog(program));
    }
}
//VBO 是顶点数据（包含属性）缓存，VBO的个数和顶点个数是相同的。

var vertex_position = [
    0.0, 1.0, 0.0,
    1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0
];

function create_vbo (data) {
    
    // 生成缓存对象
    var vbo = gl.createBuffer();

    // 绑定缓存
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    // 向缓存中写入数据
    /* 
       bufferData 只接受 Float32Array 类型的数组数据
       gl.STATIC_DRAW 定义了缓存内容的更新频率，是个常量
    */
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    //将绑定的缓存设为无效
    /* 
        bindBuffer 一次只能绑定一个，所以我操作其他数据内容的时候要 null 来无效化上一次的留存来防止内容与预想的不一致。
        第一个参表示这次的绑定参数
        null 是为了使上一次绑定的缓存数据无效化
    */
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return vbo;
}

