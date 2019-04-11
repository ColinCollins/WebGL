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