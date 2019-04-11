(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var Color = function (r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}

module.exports = Color;
},{}],2:[function(require,module,exports){
var DrawingInfo = function (vertices, normals, colors, texCoords, indices) {
    this.vertices = vertices;
    this.normals = normals;
    this.colors = colors;
    this.texCoords = texCoords;
    this.indices = indices;
}

module.exports = DrawingInfo;
},{}],3:[function(require,module,exports){
var Face = function (materialName) {
    this.materialName = materialName;
    if (materialName === null) this.materialName = '';

    this.vIndices = new Array(0);
    this.nIndices = new Array(0);
    this.tIndices = new Array(0);
}

module.exports = Face;
},{}],4:[function(require,module,exports){
const Material = require('./Material');

var MTLDoc = function () {
    this.complete = false;
    this.materials = new Array(0);
}

let prop = MTLDoc.prototype;

prop.parseNewmtl = function (sp) {
    return sp.getWord();
}

prop.parseRGB = function (sp, name) {
    let r = sp.getFloat();
    let g = sp.getFloat();
    let b = sp.getFloat();

    return new Material(name, r, g, b, 1);
}

module.exports = MTLDoc;
},{"./Material":5}],5:[function(require,module,exports){
const Color = require('./Color');

var Material = function (name, r, g, b, a) {
    this.name = name;
    this.color = new Color(r, g, b, a);
}

module.exports = Material;
},{"./Color":1}],6:[function(require,module,exports){
var Normal = function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

module.exports = Normal;
},{}],7:[function(require,module,exports){
let StringParse = require('./StringParse');
const Vertex = require('./Vertex');
const Normal = require('./Normal');
const Color = require('./Color');
const TexCoord = require('./TexCoord');
const Face = require('./Face');
const MTLDoc = require('./MTLDoc');
const OBJObject = require('./OBJObject');
const DrawingInfo = require('./DrawingInfo');

var OBJDoc = function (fileName) {
    this.fileName = fileName;
    this.mtls = new Array(0);       // mtl 列表
    this.objects = new Array(0);    // obj 列表
    this.vertices = new Array(0);   // vertex 列表
    this.normals = new Array(0);    // normal 列表
    this.texCoords = new Array(0);   // tex 列表
}

let prop = OBJDoc.prototype;
prop.getDrawingInfo = function () {
    // 创建顶点坐标，发现，颜色，索引值数组
    let numIndices = 0;
    for (let i = 0; i < this.objects.length; i++) {
        numIndices += this.objects[i].numIndices;
    }
    let numVertices = numIndices;
    let vertices = new Float32Array(numVertices * 3);
    let normals = new Float32Array(numVertices * 3);
    let colors = new Float32Array(numVertices * 4);
    let texCoords = new Float32Array(numVertices * 2);
    let indices = new Uint16Array(numIndices);
    // 设置顶点 发现和颜色
    let index_indices = 0;
    for (let i = 0; i < this.objects.length; i++) {
        let object = this.objects[i];
        for (let j = 0; j < object.faces.length; j++) {
            // 解析 face 对象
            let face = object.faces[j];
            // 在本例中是获取漫反射颜色
            let color = this.findColor(face.materialName);
            let faceNormal = face.normal;

            for (let k = 0; k < face.vIndices.length; k++) {
                indices[index_indices] = index_indices;
                // copy vertex
                let vIdx = face.vIndices[k];
                let vertex = this.vertices[vIdx];
                vertices[index_indices * 3 + 0] = vertex.x;
                vertices[index_indices * 3 + 1] = vertex.y;
                vertices[index_indices * 3 + 2] = vertex.z;
                // copy color
                colors[index_indices * 4 + 0] = color.r;
                colors[index_indices * 4 + 1] = color.g;
                colors[index_indices * 4 + 2] = color.b;
                colors[index_indices * 4 + 3] = color.a;
                // copy normal -> obj 文件中可能不包含 normal 信息，若不包含法线信息，就使用之前解析数据时自动生成的 noraml
                let nIdx = face.nIndices[k];
                if (nIdx >= 0) {
                    let normal = this.normals[nIdx];
                    normals[index_indices * 3 + 0] = normal.x;
                    normals[index_indices * 3 + 1] = normal.y;
                    normals[index_indices * 3 + 2] = normal.z;
                }
                else {
                    normals[index_indices * 3 + 0] = faceNormal.x;
                    normals[index_indices * 3 + 1] = faceNormal.y;
                    normals[index_indices * 3 + 2] = faceNormal.z;
                }
                // 传入 texCoord 数据
                let tIdx = face.tIndices[k];
                if (tIdx >= 0) {
                    let texCoord = this.texCoords[tIdx];
                    texCoords[index_indices * 2 + 0] = texCoord.x;
                    texCoords[index_indices * 2 + 1] = texCoord.y;
                }

                index_indices++;
            }
        }
    }
    return new DrawingInfo(vertices, normals, colors, texCoords, indices);
}
const mtlPath = 'E:\\GitStone\\WebGL\\res\\Iron_Man_Mark_42\\Mark_42.mtl';
// reverse
prop.parse = function (fileString, scale, reverse) {
    // Check point
    let lines = fileString.split('\r\n');
    if (lines.length <= 1) {
        lines = fileString.split('\n');
    }
    lines.push(null); // 添加结束标记
    let index = 0;
    // 逐行解析
    let line; // 接收当前文本
    let sp = new StringParse(); // 创建 StringParse 类型对象 sp
    while((line = lines[index++]) !== null) {
        sp.init(line);
        // 获取指令名称，某行的第一个单词
        let command = sp.getWord();
        if (command === null) continue;

        switch(command) {
            case '#':
                continue;
                //读取材质文件
            case 'mtllib':
                let mtl = new MTLDoc(); // create MTL instance
                this.mtls.push(mtl);
                this.getFile(mtlPath, mtl);
                continue;
            case 'o':
            case 'g':
                let object = this.parseObjectName(sp);
                this.objects.push(object);
                currentObject = object;
                continue;       // 解析下一行
                 // 读取顶点
            case 'v':
                let vertex = this.parseVertex(sp, scale);
                this.vertices.push(vertex);
                continue;
            case 'vn':
                let normal = this.parseNormal(sp);
                this.normals.push(normal);
                continue;
            case 'vt':
                let texCoord = this.parseTexCoord(sp);
                this.texCoords.push(texCoord);
                continue;
            case 'usemtl':
                currentMaterialName = this.parseUsemtl(sp);
                continue;
                // 读取表面光照
            case 'f':
                let face = this.parseFace(sp, currentMaterialName, this.vertices, reverse);
                currentObject.addFace(face);
                continue;
        }
    }

    return true;
}

prop.parseMtllib = function (sp, fileName) {
    let i = fileName.lastIndexOf("/");
    let dirPath = '';
    // 提取字符串
    if (i > 0) dirPath = fileName.substr(0, i + 1);
    return dirPath + sp.getWord();
}

prop.parseObjectName = function (sp) {
    let name = sp.getWord();
    return new OBJObject(name);
}

prop.parseNormal = function (sp) {
    let x = sp.getFloat();
    let y = sp.getFloat();
    let z = sp.getFloat();
    return new Normal(x, y, z);
}

prop.parseTexCoord = function (sp) {
    let x = sp.getFloat();
    let y = sp.getFloat();
    let z = sp.getFloat();
    return new TexCoord(x, y);
}

prop.parseUsemtl = function (sp) {
    return sp.getWord();
}

/**
 * s 4889
 * // 索引
 * f 2524/1574/3234 2525/1575/3235 2521/1569/3231
 */
prop.parseFace = function (sp, materialName, vertices, reverse) {
    let face = new Face(materialName);
    let word = '';
    while((word = sp.getWord()) !== null) {
        // parse 'f' -> 'x/x/x'
        let subWords = word.split('/');
        console.log(`parseFace: subWords: ${ subWords }`);
        if (subWords.length >= 1) {
            let vi = parseInt(subWords[0]) - 1;
            face.vIndices.push(vi);
        }

        if (subWords.length >= 3) {
            let ti = parseInt(subWords[1]) - 1;
            let ni = parseInt(subWords[2]) - 1;
            face.nIndices.push(ni);
            face.tIndices.push(ti);
        }
        else {
            face.nIndices.push(-1);
            face.tIndices.push(-1);
        }
    }
    // 重新计算 normal
    let v0 = [
        vertices[face.vIndices[0]].x,
        vertices[face.vIndices[0]].y,
        vertices[face.vIndices[0]].z
    ];

    let v1 = [
        vertices[face.vIndices[1]].x,
        vertices[face.vIndices[1]].y,
        vertices[face.vIndices[1]].z
    ];

    let v2 = [
        vertices[face.vIndices[2]].x,
        vertices[face.vIndices[2]].y,
        vertices[face.vIndices[2]].z,
    ];
    // 根据顶点求 normal
    let normal = calculateNormal(v0, v1, v2);

    if (normal === null) {
        if (face.vIndices.length > 4) {
            let v3 = [
                vertices[face.vIndices[3]].x,
                vertices[face.vIndices[3]].y,
                vertices[face.vIndices[3]].z
            ];
            normal = calculateNormal(v1, v2, v3);
        }
        if (normal === null) {
            normal = [0.0, 1.0, 0.0];
        }
    }

    if (reverse) {
        normal[0] = -normal[0];
        normal[1] = -normal[1];
        normal[2] = -normal[2];
    }

    face.normal = new Normal(normal[0], normal[1], normal[2]);

    // Devide to triangles if face contains over 3 points, 将超过 3 个顶点数量的表面分割成三角形
    if (face.vIndices.length > 3) {
        let n = face.vIndices.length - 2;
        let newVIndices = new Array(n * 3);
        let newNIndices = new Array(n * 3);
        let newTIndices = new Array(n * 2);

        for (let i = 0; i < n; i++) {
            // fv -> 顶点数据索引值
            newVIndices[i * 3 + 0] = face.vIndices[0];
            newVIndices[i * 3 + 1] = face.vIndices[i + 1];
            newVIndices[i * 3 + 2] = face.vIndices[i + 2];
            // fn -> 法线向量索引值
            newNIndices[i * 3 + 0] = face.nIndices[0];
            newNIndices[i * 3 + 1] = face.nIndices[i + 1];
            newNIndices[i * 3 + 2] = face.nIndices[i + 2];
            // ft -> uv 向量索引值
            newTIndices[i * 2 + 0] = face.tIndices[0];
            newTIndices[i * 2 + 1] = face.tIndices[i + 1];
        }

        face.vIndices = newVIndices;
        face.nIndices = newNIndices;
        face.tIndices = newTIndices;
    }

    face.numIndices = face.vIndices.length;
    return face;
}

function onReadMTLFile (fileString, mtl) {
    let lines = fileString.split('\n');
    if (lines.length <= 1) {
        lines = fileString.split('\r\n');
    }
    lines.push(null);

    let index = 0;
    // parse line
    let line;
    let name = '';
    let sp = new StringParse();
    while((line = lines[index++]) !== null) {
        sp.init(line);
        let command = sp.getWord();
        if (command === null) continue; // check null command

        switch (command) {
            case '#':
                continue;
            case 'newmtl':
                name = mtl.parseNewmtl(sp);
                continue;
            case 'Kd':
                if (name === '') continue;
                // 这里只解析了 diffuse 漫反射光源
                let material = mtl.parseRGB(sp, name);
                mtl.materials.push(material);
                name = '';
                continue;
        }
    }
    mtl.complete = true;
}

prop.isMTLComplete = function () {
    if (this.mtls.length === 0) return true;
    for (let i = 0; i < this.mtls.length; i++) {
        if (!this.mtls[i].complete) return false
    }
    return true;
}

prop.findColor = function (name) {
    for (let i = 0; i < this.mtls.length; i++) {
        for (let j = 0; j < this.mtls[i].materials.length; j++) {
            if (this.mtls[i].materials[j].name === name) {
                return this.mtls[i].materials[j].color;
            }
        }
    }
    return new Color(0.8, 0.8, 0.8, 1.0);
}

prop.parseVertex = function (sp, scale) {
    let x = sp.getFloat() * scale;
    let y = sp.getFloat() * scale;
    let z = sp.getFloat() * scale;
    return new Vertex(x, y, z);
}

// 很有可能出问题就出在异步上, 难受，同步方案似乎会有警告
prop.getFile = function (path, mtl) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status !== 404) {
                onReadMTLFile(request.responseText, mtl);
            }
            else {
                mtl.complete = true;
            }
        }
    }
    // 是否异步....
    request.open('GET', path, true);
    request.send();
}

function calculateNormal (p0, p1, p2) {
    let v0 = new Float32Array(3);
    let v1 = new Float32Array(3);

    for (let i = 0; i < 3; i++) {
        v0[i] = p0[i] - p1[i];
        v1[i] = p2[i] - p1[i];
    }

    let c = new Float32Array(3);
    c[0] = v0[1] * v1[2] - v0[2] * v1[1];
    c[1] = v0[2] * v1[0] - v0[0] * v1[2];
    c[2] = v0[0] * v1[1] - v0[1] * v1[0];

    let v = new Vector3(c);
    v.normalize();
    return v.elements;
}

module.exports = OBJDoc;
},{"./Color":1,"./DrawingInfo":2,"./Face":3,"./MTLDoc":4,"./Normal":6,"./OBJObject":8,"./StringParse":9,"./TexCoord":10,"./Vertex":11}],8:[function(require,module,exports){
var OBJObject = function (name) {
    this.name = name;
    this.faces = new Array(0);
    this.numIndices = 0;
}

let prop = OBJObject.prototype;

prop.addFace = function (face) {
    this.faces.push(face);
    this.numIndices += face.numIndices;
}

module.exports = OBJObject;
},{}],9:[function(require,module,exports){
var StringParse = function (str) {
    this.str;       // 将参数字符串保存下来
    this.index;
    this.init(str);
}

let prop = StringParse.prototype;

prop.init = function (str) {
    this.str = str;
    this.index = 0;
}
// 从这里看的出，传入的对象一般是 一个句子而不是一整个文本。跳过特殊字符
prop.skipDelimiters = function () {
    for (var i = this.index, len = this.str.length; i < len; i++) {
        var c = this.str.charAt(i);
        if (c === '\t' || c === ' ' || c === '(' || c === ')' || c === '"') continue;
        break;
    }
    this.index = i;
}

prop.skipToNextWord = function () {
    this.skipDelimiters();
    let n = getWordLength(this.str, this.index);
    this.index += (n + 1);
}

prop.getWord = function () {
    this.skipDelimiters();
    let n = getWordLength(this.str, this.index);
    if (n === 0) return null;
    let word = this.str.substr(this.index, n);
    this.index += (n + 1);

    return word;
}

prop.getInt = function () {
    return parseInt(this.getWord());
}

prop.getFloat = function () {
    return parseFloat(this.getWord());
}

function getWordLength (str, start) {
    let n = 0;
    for (var i = start, len = str.length; i < len; i++) {
        let c = str.charAt(i);
        if (c === '\t' || c === ' ' || c === '(' || c === ')' || c === '"') {
            break;
        }
    }
    return i - start;
}

module.exports = StringParse;
},{}],10:[function(require,module,exports){
var TexCoord = function (x, y) {
    this.x = x;
    this.y = y;
}

module.exports = TexCoord;
},{}],11:[function(require,module,exports){
var Vertex = function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

module.exports = Vertex;
},{}],12:[function(require,module,exports){
let OBJDoc = require('./OBJDoc');

const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Normal;\n'+
                    'attribute vec4 a_Color;\n'+
                    'attribute vec2 a_TexCoord;\n'+
                    'uniform mat4 u_MvpMatrix;\n'+
                    'uniform mat4 u_NormalMatrix;\n'+
                    'varying vec4 v_Color;\n'+
                    'varying vec2 v_TexCoord;\n'+
                    'void main () {\n' +
                    '   vec3 lightDirection = vec3(-0.35, 0.35, 0.87);\n'+
                    '   gl_Position = u_MvpMatrix * a_Position; \n'+
                    '   vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n'+
                    '   float nDotL = max(dot(normal, lightDirection), 0.0);\n'+
                    '   v_Color = vec4(a_Color.rgb * nDotL, a_Color.a);\n'+
                    '   v_TexCoord = a_TexCoord;\n'+
                    '}\n';
const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'varying vec2 v_TexCoord;\n'+
                    'varying vec4 v_Color;\n'+
                    'uniform sampler2D u_Sampler;\n'+
                    'void main() {\n' +
                    'vec4 color = texture2D(u_Sampler, v_TexCoord);\n'+
                    'gl_FragColor = color * v_Color;\n'+
                    '}\n';

window.onload = main;
const objPath = 'E:\\GitStone\\WebGL\\res\\Iron_Man_Mark_42\\Mark_42.obj';
const texPath = 'E:\\GitStone\\WebGL\\res\\Iron_Man_Mark_42\\maps\\42.png';

function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);
    let program = initShaders0(gl, VSHADER_SOURCE, FSHADER_SOURCE)
    gl.enable(gl.DEPTH_TEST);
    // custom program
    program.a_Position = getAttribProp(gl, 'a_Position', program);
    program.a_Normal = getAttribProp(gl, 'a_Normal', program);
    program.a_Color = getAttribProp(gl, 'a_Color', program);
    program.a_TexCoord = getAttribProp(gl, 'a_TexCoord', program);

    // uniform
    program.u_MvpMatrix = getUniformProp(gl, 'u_MvpMatrix', program);
    program.u_NormalMatrix = getUniformProp(gl, 'u_NormalMatrix', program);
    program.u_Sampler = getUniformProp(gl, 'u_Sampler', program);

    let model = initVertexBuffers(gl, program);
    if (!model) {
        console.log(`Can't ready the empty cache area`);
        return;
    }

    let viewProjMatrix = new Matrix4().setPerspective(50.0, canvas.width / canvas.height, 1, 100);
    viewProjMatrix.lookAt(
        0.0, 20.0, 20.0,
        0.0, 10.0, 0.0,
        0.0, 1.0, 0.0
    );
    // add image loading

    let image = new Image();
    image.src = texPath;
    image.onload = function () {
        initTexture(gl, program, image);
        // 处理数据, 并将数据写入缓冲区
        readOBJFile(objPath, 10, true);

        let currentAngle = 0.0;
        let tick = function () {
            currentAngle = animate(currentAngle);
            draw(gl, gl.program, currentAngle, viewProjMatrix, model);
            requestAnimationFrame(tick);
        }
        tick();
    }
}

function initTexture (gl, program, image) {
    let texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(program.u_Sampler, 0);
}

let g_modelMatrix = new Matrix4();
let g_mvpMatrix = new Matrix4();
let g_normalMatrix = new Matrix4();
// model
function draw (gl, program, angle,  viewProjMatrix, model) {
    // 判断数据文件 obj mtl 完全解析
    if (g_objDoc !== null && g_objDoc.isMTLComplete()) {
        g_drawingInfo = onReadComplete(gl, model, g_objDoc);
        g_objDoc = null;
    }

    if (!g_drawingInfo) return;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // 设置旋转
    g_modelMatrix.setRotate(angle, 0.0, 1.0, 0.0);
    //    g_modelMatrix.rotate(angle, 0.0, 1.0, 0.0);
    //    g_modelMatrix.rotate(angle, 0.0, 0.0, 1.0);

    // 计算 normal
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);

    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

    gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);
}

function initVertexBuffers (gl, program) {
    let o = new Object();
    o.vertexBuffer = createEmptyArrayBuffer(gl, program.a_Position, 3, gl.FLOAT);
    o.normalBuffer = createEmptyArrayBuffer(gl, program.a_Normal, 3, gl.FLOAT);
    o.colorBuffer = createEmptyArrayBuffer(gl, program.a_Color, 4, gl.FLOAT);
    o.texBuffer = createEmptyArrayBuffer(gl, program.a_TexCoord, 2, gl.FLOAT);
    o.indexBuffer = gl.createBuffer();

    return o;
}

function createEmptyArrayBuffer (gl, a_attribute, num, type) {
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);

    return buffer;
}

function readOBJFile (fileName, scale, reverse) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status !== 404) {
            onReadOBJFile(request.responseText, fileName, scale, reverse);
        }
    }
    request.open('GET', fileName, true); // get 请求
    request.send();
}

let g_objDoc = null; // OBJ 文件中的文本
let g_drawingInfo = null; // 用以绘制三维模型信息

function onReadOBJFile (fileString, fileName, scale, reverse) {
    let objDoc = new OBJDoc(fileName); // 创建 OBJDoc 对象
    let result = objDoc.parse(fileString, scale, reverse);

    if (!result) {
        g_objDoc = null;
        g_drawingInfo = null;
        console.log("OBJ file parsing error.");
        return;
    }

    g_objDoc = objDoc;
}

function onReadComplete (gl, model, objDoc) {
    let drawingInfo = objDoc.getDrawingInfo();

    // 数据写入缓冲区
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.vertices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.colors, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.texCoords, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, drawingInfo.indices, gl.STATIC_DRAW);

    return drawingInfo;
}

let angle_step = 30.0;
let last = new Date();

function animate (angle) {
    let now = new Date();
    let elapse = now - last;
    last = now;
    let newAngle = angle + (angle_step * elapse) / 2000.0;
    return newAngle % 360;
}

// #region InitShader
function initShaders0 (gl, VSHADER_SOURCE, FSHADER_SOURCE) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, VSHADER_SOURCE);
    let fragShader = loadShader(gl, gl.FRAGMENT_SHADER, FSHADER_SOURCE);
    return initProgram(gl, vertexShader, fragShader);
}


function loadShader (gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    // 解析
    let compiled  = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        let msg = gl.getShaderInfoLog(shader);
        console.log(`shader init Error: ${msg}`);
        return;
    }
    let shaderTarget = gl.getShaderParameter(shader, gl.SHADER_TYPE);
    if (shaderTarget) console.log(`shader init: ${shaderTarget}`);
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
        console.error(`init program link error: ${msg}`);
        return null;
    }

    gl.validateProgram(program);
    let validated = gl.getProgramParameter(program, gl.VALIDATE_STATUS);
    if (!validated) {
        let msg = gl.getProgramInfoLog(program);
        console.error(`int program validate error: ${msg}`);
        return null;
    }

    gl.useProgram(program);
    gl.program = program;

    return program;
}

// #endregion

// bind Attribute data with indices
function bindAttribData (gl, data, target, format, dataLength) {
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(target, dataLength, format, false, 0, 0);
    gl.enableVertexAttribArray(target);
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
},{"./OBJDoc":7}]},{},[12]);
