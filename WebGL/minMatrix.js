//生成 matIV 对象
var m = new matIV();
// 矩阵初始化
var Matrix = m.identity(m.create());

m.translate(Matrix, [1.0, 0.0, 0.0], Matrix);
/* 
//执行变换的顺序 建议应该按照: scale > rotate > translate 三个部分
// OpenGL 使用顺序正好相反

matIV.lookAt 视图变换矩阵，
matIV.perspective 投影变化矩阵

坐标变换矩阵一般使用多模型， mvpMatrix-> p > v > m 实际相乘顺序

*/

var mMatrix = m.identity(m.create());
var vMatrix = m.identity(m.create());
var pMatrix = m.identity(m.create());
var mvpMatrix = m.identity(m.create());

m.multiply(pMatrix, vMatrix, mvpMatrix); // pv相乘
m.multiply(mvpMatrix, mMatrix, mvpMatrix);
