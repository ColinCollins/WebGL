const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Color;\n'+
                    'attribute vec2 a_TexCoord;\n'+
                    'varying vec4 v_Color;\n'+
                    'varying vec2 v_TexCoord;\n'+
                    'uniform mat4 u_MvpMatrix;\n'+
                    'void main () {\n' +
                    'gl_Position = u_MvpMatrix * a_Position; \n'+
                    'v_Color = a_Color;\n'+
                    'v_TexCoord = a_TexCoord;\n'+
                    '}\n';
const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'varying vec4 v_Color;\n'+
                    'uniform sampler2D u_Sampler;\n'+
                    'varying vec2 v_TexCoord;\n'+
                    'void main() {\n' +
                    'vec4 texColor = texture2D(u_Sampler, v_TexCoord);\n'+
                    'gl_FragColor = v_Color * texColor;\n'+
                    '}\n';


// https://bl.ocks.org/camargo/649e5903c4584a21a568972d4a2c16d3 参考
function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('init shader failed.');
        return;
    }

    // custom program
    let a_Position = getAttribProp(gl, 'a_Position');
    let a_Color = getAttribProp(gl, 'a_Color');
    let a_TexCoord = getAttribProp(gl, 'a_TexCoord');

    let vertices = [];
    let colorData = [];
    let uvs = [];

    initSphereData(vertices, colorData, uvs);

    let indexData = initIndexData();

    initArrayBuffer(gl, a_Position, 3, new Float32Array(vertices));
    initArrayBuffer(gl, a_Color, 3, new Float32Array(colorData));
    initArrayBuffer(gl, a_TexCoord, 2, new Float32Array(uvs));

    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);

    // let n = initVertexBuffers(gl);
    let u_Sampler = getUniformProp(gl, 'u_Sampler');
    let u_MvpMatrix = getUniformProp(gl, 'u_MvpMatrix');
    let mvpMatrix = new Matrix4().setPerspective(30.0, 1, 1, 100).lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

     // create Texture
     var image = new Image();
     image.onload = function () {
        activeTexture(gl, u_Sampler, image);
        // 不开深度检测是画不出 3d 图形的
        gl.enable(gl.DEPTH_TEST);

        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

        // drawType, array length, dataType, offset
        gl.drawElements(gl.TRIANGLES, indexData.length, gl.UNSIGNED_SHORT, 0);
     }
     image.src = 'file:///D:/GitStone/WebGL/webglProject/res/psb2.jpg';
     image.crossOrigin = 'anonymous';
     // document.body.appendChild(image);

}

//Dimensions
function initArrayBuffer (gl, target, d, data) {
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    gl.vertexAttribPointer(target, d, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(target);
}

let count = 14;
function initSphereData (vertices, colorData, uvs) {
    for (let i = 0; i <= count; i++) {
        let angle1 = Math.PI * 2 * (i / count);
        let cos = Math.cos(angle1);
        let sin = Math.sin(angle1);

        for (let j = 0; j <= count; j++) {
            let angle2 = Math.PI * (j / count);
            let cos2 = Math.cos(angle2);
            let sin2 = Math.sin(angle2);

            let x = cos * cos2;
            let y = sin;
            let z = cos * sin2;

            vertices.push(x);
            vertices.push(y);
            vertices.push(z);

            colorData.push(x);
            colorData.push(y);
            colorData.push(z);

            let u = 1 - j / count;
            let v = 1 - i / count;

            uvs.push(u);
            uvs.push(v);
        }
    }
}

function initIndexData () {
    let indexData = [];
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            let a = (i * (count + 1)) + j;
            let b = a + count + 1;
            let c = a + 1;
            let d = b + 1;

            indexData.push(a);
            indexData.push(b);
            indexData.push(c);

            indexData.push(b);
            indexData.push(d);
            indexData.push(c);
        }
    }
    // 报错原因：Uint8Array: indexData 数量并没有超出 255，那应该是 webgl 进行了 array 检测，限制了对应类型 array 的数量，Uint16Array 就能够渲染，因为检测顶点数量可以增多了
    return new Uint16Array(indexData);
}

function activeTexture (gl, u_Sampler, image) {
    let texture0 = gl.createTexture();

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture0);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // 可以指定宽高和边界
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_Sampler, 0);
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


function initVertexBuffers(gl) {
    let latitudeBands = 14;
    let longitudeBands = 14;
    let radius = 2;

    let vertexPositionData = [];
    let normalData = [];
    let textureCoordData = [];
    let indexData = [];

    // Calculate sphere vertex positions, normals, and texture coordinates.
    for (let latNumber = 0; latNumber <= latitudeBands; ++latNumber) {
      let theta = latNumber * Math.PI / latitudeBands;
      let sinTheta = Math.sin(theta);
      let cosTheta = Math.cos(theta);

      for (let longNumber = 0; longNumber <= longitudeBands; ++longNumber) {
        let phi = longNumber * 2 * Math.PI / longitudeBands;
        let sinPhi = Math.sin(phi);
        let cosPhi = Math.cos(phi);

        let x = cosPhi * sinTheta;
        let y = cosTheta;
        let z = sinPhi * sinTheta;

        let u = 1 - (longNumber / longitudeBands);
        let v = 1 - (latNumber / latitudeBands);

        vertexPositionData.push(radius * x);
        vertexPositionData.push(radius * y);
        vertexPositionData.push(radius * z);

        normalData.push(x);
        normalData.push(y);
        normalData.push(z);

        textureCoordData.push(u);
        textureCoordData.push(v);
      }
    }

    // Calculate sphere indices.
    for (let latNumber = 0; latNumber < latitudeBands; ++latNumber) {
      for (let longNumber = 0; longNumber < longitudeBands; ++longNumber) {
        let first = (latNumber * (longitudeBands + 1)) + longNumber;
        let second = first + longitudeBands + 1;

        indexData.push(first);
        indexData.push(second);
        indexData.push(first + 1);

        indexData.push(second);
        indexData.push(second + 1);
        indexData.push(first + 1);
      }
    }

    vertexPositionData = new Float32Array(vertexPositionData);
    normalData = new Float32Array(normalData);
    textureCoordData = new Float32Array(textureCoordData);
    indexData = new Uint16Array(indexData);

    // Assign position coords to attrib and enable it.
    let VertexPosition = gl.getAttribLocation(gl.program, 'a_Position');
    initArrayBuffer(gl, VertexPosition, 3, vertexPositionData)

     // Assign normal to attrib and enable it.
    let VertexNormal = gl.getAttribLocation(gl.program, 'a_Color');
    initArrayBuffer(gl, VertexNormal, 3, normalData)

    // Assign normal to attrib and enable it.
    let a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    initArrayBuffer(gl, a_TexCoord, 2, textureCoordData);

    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);

    return indexData.length
  }
