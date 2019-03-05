(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';


class MTLFile {

  constructor(fileContents) {
    this._reset();
    this.fileContents = fileContents;
  }

  _reset() {
    this.materials = [];
    this.currentMaterial = null;
    this.lineNumber = 1;
    this.filename = '';
  }

  parse(defaultMaterialName = 'default') {
    this._reset();

    this.defaultMaterialName = defaultMaterialName;

    const lines = this.fileContents.split("\n");

    lines.forEach((line, index) => {

      this.lineNumber = (index + 1);

      const lineItems = MTLFile._stripComments(line).replace(/\s\s+/g, ' ').trim().split(' ');

      if (lineItems.length == 0 || !lineItems[0]) {
        return; // Skip blank lines
      }

      switch(lineItems[0].toLowerCase())
      {
        case 'newmtl':  // Starts a new material, assigns a name to it
          this._parseNewMTL(lineItems);
          break;

        case 'illum': // Specifies which Illumination model is to be used when rendering the current material. (eg. illum 2)
          // Abbreviations:
          //  N    Unit surface normal
          //  Ia   Itensity of the ambient light
          //  ls   # of lights
          //  Lj   Light direction (vector) of light j
          //  Ij   Light intensity (scalar) of light j

          // Illumination ModeLs:
          //  0:  Constant color   (color = Kd)

          //  1:  Diffuse illumination model (using Lambertian shading).
          //        color = KaIa + Kd { SUM j=1..ls, (N * Lj)Ij }

          //  2:  Diffuse and specular illumination model using Lambertian shading,
          //      and Blinn's interpretation of Phong's specular illumination model.

          //        color = KaIa
          //          + Kd { SUM j=1..ls, (N*Lj)Ij }
          //          + Ks { SUM j=1..ls, ((H*Hj)^Ns)Ij }
          this._parseIllum(lineItems);
          break;
        case 'ka': // (Ka) - Ambient color of material
          this._parseKa(lineItems);
          break;
        case 'kd': // (Kd) - Difffuse reflectance
          this._parseKd(lineItems);
          break;
        case 'ks': // (Ks) - Specular reflectance
          this._parseKs(lineItems);
          break;

        case 'tf': // Transmission filter
          this._parseTF(lineItems);
          break;
        case 'ns': // (Ns) - Specular Exponent
          this._parseNs(lineItems);
          break;
        case 'ni': // (Ni) -
          this._parseNi(lineItems);
          break;
        case 'd': // Controls how the current material dissolves (becomes transparent)
          this._parseD(lineItems);
          break;
        case 'tr': // Controls how transparent the current material is (inverted: Tr = 1 - d)
          this._parseTr(lineItems);
          break;
        case 'sharpness':
          this._parseSharpness(lineItems);
          break;

        case 'map_ka': //
          this._parseMapKa(lineItems);
          break;
        case 'map_kd': //
          this._parseMapKd(lineItems);
          break;
        case 'map_ks':
          this._parseMapKs(lineItems);
          break;
        case 'map_ns':
          this._parseMapNs(lineItems);
          break;
        case 'map_d':
          this._parseMapD(lineItems);
          break;

        case 'disp':
          this._parseDisp(lineItems);
          break;
        case 'decal':
          this._parseDecal(lineItems);
          break;
        case 'bump':
          this._parseBump(lineItems);
          break;

        case 'refl': // Reflection Map Statement
          this._parseRefl(lineItems);
          break;

        default:
          this._fileError(`Unrecognized statement: ${lineItems[0]}`);
      }
    });

    return this.materials;
  }

  static _stripComments(lineString) {
    let commentIndex = lineString.indexOf('#');
    if(commentIndex > -1)
      return lineString.substring(0, commentIndex);
    else
      return lineString;
  }

  _createMaterial(name) {
    const newMaterial = {
      name: name,
      illum: 0,
      Ka: {
        method: 'rgb',
        red: 0,
        green: 0,
        blue: 0
      },
      Kd: {
        method: 'rgb',
        red: 0,
        green: 0,
        blue: 0
      },
      Ks: {
        method: 'ks',
        red: 0,
        green: 0,
        blue: 0
      },
      map_Ka: {
        file: null
      },
      map_Kd: {
        file: null
      },
      map_Ks: {
        file: null
      },
      map_d: {
        file: null
      },
      dissolve: 1.0,
    };
    this.materials.push(newMaterial);
  }
  _getCurrentMaterial() {
    if (this.materials.length == 0) {
      this._createMaterial(this.defaultMaterialName);
    }
    return this.materials[this.materials.length - 1];
  }

  // newmtl material_name
  _parseNewMTL(lineItems) {
    if (lineItems.length < 2) {
      throw 'newmtl statement must specify a name for the maerial (eg, newmtl brickwall)';
    }
    this._createMaterial(lineItems[1]);
  }

  _parseIllum(lineItems) {
    if (lineItems.length < 2) {
      this._fileError('to few arguments, expected: illum <number>');
    }
    this._getCurrentMaterial().illum = parseInt(lineItems[1]);
  }

  // Ka r g b         <- currently only this syntax is supported
  // Ka spectral file.rfl factor
  // Ka xyz x y z
  _parseKa(lineItems) {
    if (lineItems.length != 4) {
      this._notImplemented('Ka statements must have exactly 3 arguments (only Ka R G B syntax is supported');
      return;
    }
    const Ka = this._getCurrentMaterial().Ka;
    const color = this._parseKStatementRGB(lineItems);
    Ka.red = color.red;
    Ka.green = color.green;
    Ka.blue = color.blue;
  }

  // Kd r g b         <- currently only this syntax is supported
  // Kd spectral file.rfl factor
  // Kd xyz x y z
  _parseKd(lineItems) {
    if (lineItems.length != 4) {
      this._notImplemented('Kd statements must have exactly 3 arguments (only Kd R G B syntax is supported');
      return;
    }
    const Kd = this._getCurrentMaterial().Kd;
    const color = this._parseKStatementRGB(lineItems);
    Kd.red = color.red;
    Kd.green = color.green;
    Kd.blue = color.blue;
  }

  // Ks r g b
  // Ks spectral file.rfl factor
  // Ks xyz x y z
  _parseKs(lineItems) {
    if (lineItems.length != 4) {
      this._notImplemented('Ks statements must have exactly 3 arguments (only Ks R G B syntax is supported');
      return;
    }
    const Ks = this._getCurrentMaterial().Ks;
    const color = this._parseKStatementRGB(lineItems);
    Ks.red = color.red;
    Ks.green = color.green;
    Ks.blue = color.blue;
  }

  // extracts the rgb values from a "Ka/Kd/Ks r g b" statement
  _parseKStatementRGB(lineItems) {
    if (lineItems.length < 4) {
      this._fileError('to few arguments, expected: Ka/Kd/Ks keyword followed by: r g b values');
    }
    if (lineItems[1].toLowerCase() == 'spectral') {
      this._notImplemented('Ka spectral <filename> <factor>');
      return;
    } else if (lineItems[1].toLowerCase() == 'xyz') {
      this._notImplemented('Ka xyz <x> <y> <z>');
      return;
    }

    return {
      red: parseFloat(lineItems[1]),
      green: parseFloat(lineItems[2]),
      blue: parseFloat(lineItems[3])
    };
  }

  _parseTF(lineItems) {
    this._notImplemented('tf');
  }

  // ns 500
  // Defines how focused the specular highlight is,
  // typically in the range of 0 to 1000.
  _parseNs(lineItems) {
    this._notImplemented('Ns');
  }

  _parseNi(lineItems) {
    this._notImplemented('Ni');
  }

  // d factor
  // Controls how much the current material dissolves (becomes transparent).
  // Materials can be transparent. This is referred to as being dissolved. 
  // Unlike real transparency, the result does not depend upon the thickness of the object. 
  // A value of 1.0 for "d" is the default and means fully opaque, as does a value of 0.0 for "Tr".
  _parseD(lineItems) {
    if (lineItems.length < 2) {
      this._fileError('to few arguments, expected: d <factor>');
    }
    this._getCurrentMaterial().dissolve = parseFloat(lineItems[1]);
  }

  // Tr factor
  // Controls how transparent the current material is (inverted: Tr = 1 - d).
  // Materials can be transparent. This is referred to as being dissolved. 
  // Unlike real transparency, the result does not depend upon the thickness of the object. 
  // A value of 1.0 for "d" is the default and means fully opaque, as does a value of 0.0 for "Tr".
  _parseTr(lineItems) {
    if (lineItems.length < 2) {
      this._fileError('to few arguments, expected: Tr <factor>');
    }
    this._getCurrentMaterial().dissolve = 1.0 - parseFloat(lineItems[1]);
  }

  _parseSharpness(lineItems) {
    this._notImplemented('sharpness');
  }

  // map_Ka [options] textureFile
  // map_Ka -s 1 1 1 -o 0 0 0 -mm 0 1 file.mpc
  _parseMapKa(lineItems) {
    // TODO parse options (lineItems[1] to lineItems[lineItems.length - 2])
    if (lineItems.length < 2) {
      this._fileError('to few arguments, expected: map_ka <textureImageFile>');
    }
    const file = lineItems[lineItems.length - 1];
    this._getCurrentMaterial().map_Ka.file = file;
  }

  // map_Kd [options] textureFile
  _parseMapKd(lineItems) {
    // TODO parse options (lineItems[1] to lineItems[lineItems.length - 2])
    if (lineItems.length < 2) {
      this._fileError('to few arguments, expected: map_Kd <textureImageFile>');
    }
    const file = lineItems[lineItems.length - 1];
    this._getCurrentMaterial().map_Kd.file = file;
  }

  // map_d [options] textureFile
  _parseMapD(lineItems) {
    // TODO parse options (lineItems[1] to lineItems[lineItems.length - 2])
    if (lineItems.length < 2) {
      this._fileError('to few arguments, expected: map_d <textureImageFile>');
    }
    const file = lineItems[lineItems.length - 1];
    this._getCurrentMaterial().map_d.file = file;
  }

  // map_Ks [options] textureFile
  _parseMapKs(lineItems) {
    // TODO parse options (lineItems[1] to lineItems[lineItems.length - 2])
    if (lineItems.length < 2) {
      this._fileError('to few arguments, expected: map_Ks <textureImageFile>');
    } else if (lineItems.length > 2) {

    }
    const file = lineItems[lineItems.length - 1];
    this._getCurrentMaterial().map_Ks.file = file;
  }

  _parseMapNs(lineItems) {
    this._notImplemented('map_Ns');
  }

  _parseDisp(lineItems) {
    this._notImplemented('disp');
  }

  _parseDecal(lineItems) {
    this._notImplemented('decal');
  }

  _parseBump(lineItems) {
    this._notImplemented('bump');
  }

  _parseRefl(lineItems) {
    this._notImplemented('bump');
  }

  _notImplemented(message) {
    console.warn(`MTL file statement not implemented: ${message}`);
  }

  _fileError(message) {
    const material = `Material: ${this._getCurrentMaterial().name}`;
    const line = `Line: ${this.lineNumber}`;
    const errorMessage = `MTL file format error (${line}  ${material}): ${message}`;
    throw errorMessage;
  }

}

module.exports = MTLFile;

},{}],2:[function(require,module,exports){
const load3D = require('./load3DModel');

const VSHADER_SOURCE =
                    'attribute vec4 a_Position;\n' +
                    'attribute vec4 a_Normal;\n'+
                    'attribute vec2 a_TexCoord;\n'+
                    'uniform vec3 u_AmbientLight;\n'+
                    'uniform vec3 u_DiffuseColor;\n'+
                    'uniform vec3 u_LightColor;\n'+
                    'uniform vec3 u_LightPosition;\n'+
                    'uniform mat4 u_MvpMatrix;\n'+
                    'uniform mat4 u_ModelMatrix;\n'+
                    'uniform mat4 u_NormalMatrix;\n'+
                    'varying vec4 v_Color;\n'+
                    'varying vec2 v_TexCoord;\n'+
                    'void main () {\n' +
                    'gl_Position = u_MvpMatrix * a_Position; \n'+
                    'vec3 vertexPosition = vec3(normalize(u_LightPosition - vec3(u_ModelMatrix * a_Position)));\n'+
                    'vec3 normal = vec3(u_NormalMatrix * a_Normal);\n'+
                    'float nDotL = max(dot(vertexPosition, normal), 0.0);\n'+
                    'vec3 diffuse = u_LightColor * u_DiffuseColor * nDotL;\n'+
                    'vec3 ambient = u_AmbientLight;\n'+
                    'v_Color = vec4(diffuse + ambient, 1.0);\n'+
                    'v_TexCoord = a_TexCoord;\n'+
                    '}\n';
const FSHADER_SOURCE =
                    'precision mediump float;\n'+
                    'varying vec4 v_Color;\n'+
                    'varying vec2 v_TexCoord;\n'+
                    'uniform sampler2D u_Sampler;\n'+
                    'void main() {\n' +
                    'vec4 textureColor = texture2D(u_Sampler, v_TexCoord);\n'+
                    'gl_FragColor = v_Color * textureColor;\n'+
                    '}\n';
window.onload = main;
function main() {
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);
    let program = initShaders0(gl, VSHADER_SOURCE, FSHADER_SOURCE);

    // custom program
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const objPath = 'E:\\GitStone\\WebGL\\res\\Iron_Man_Mark_42\\Mark 42.obj';
    const mtlPath = 'E:\\GitStone\\WebGL\\res\\Iron_Man_Mark_42\\Mark 42.mtl';
    const texPath = 'E:\\GitStone\\WebGL\\res\\Iron_Man_Mark_42\\maps\\42.png';

    let objRes = load3D.loadOBJ(objPath);
    // mtl will return a array
    let mtlRes = load3D.loadMTL(mtlPath);
    if (mtlRes.length === 1) {
        console.log(`Material res num: ${mtlRes.length}`);
    }
    let mtlProp = parseMtlRes(mtlRes);
    // let the image become a param belong to the callback method
    load3D.loadTex(texPath, callback);
    // attribute
    program.a_Position = getAttribProp(gl, 'a_Position', program);
    program.a_Normal = getAttribProp(gl, 'a_Normal', program);
    program.a_TexCoord = getAttribProp(gl, 'a_TexCoord', program);

    bindAttribData(gl, objRes.vertexData, program.a_Position, gl.FLOAT, 3);
    bindAttribData(gl, objRes.normalData, program.a_Color, gl.FLOAT, 3);
    bindAttribData(gl, objRes.textureData, program.a_TexCoord, gl.FLOAT, 2);
    // uniform
    program.u_MvpMatrix = getUniformProp(gl, 'u_MvpMatrix', program);
    program.u_ModelMatrix = getUniformProp(gl, 'u_ModelMatrix', program);
    program.u_NormalMatrix = getUniformProp(gl, 'u_NormalMatrix', program);

    let mvpMatrix = new Matrix4().setPerspective(40.0, canvas.width / canvas.height, 1, 100);
    mvpMatrix.lookAt(
        0.0, 5.0, 4.0,
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0
    );
    let angle = 10.0;
    let modelMatrix = new Matrix4().setRotate(angle, 0.0, 1.0, 0.0);
    mvpMatrix.multiply(modelMatrix);

    let normalMatrix = new Matrix4().setInverseOf(modelMatrix).transpose();
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, mvpMatrix.elements);
    gl.uniformMatrix4fv(program.u_ModelMatrix, false, modelMatrix.elements);
    gl.uniformMatrix4fv(program.u_NormalMatrix, false, normalMatrix.elements);

    program.u_LightColor = getUniformProp(gl, 'u_LightColor', program);
    program.u_LightPosition = getUniformProp(gl, 'u_LightPosition', program);
    program.u_AmbientLight = getUniformProp(gl, 'u_AmbientLight', program);
    program.u_DiffuseColor = getUniformProp(gl, 'u_DiffuseColor', program);

    gl.uniform3fv(program.u_LightPosition, new Vector3([2.0, 4.0, 2.0]).elements);
    gl.uniform3fv(program.u_LightColor, new Vector3([1.0, 1.0, 1.0]).elements);
    gl.uniform3fv(program.u_AmbientLight, mtlProp.ambient.elements);
    // 因为没有 a_Color, 所以 VSHADER_SOURCE 需要重新考虑 diffuse 和 ambient 的计算.
    gl.uniform3fv(program.u_DiffuseColor, mtlProp.diffuse.elements);

    function callback (image) {
        initTexture(gl, image, u_Sampler, gl.TEXTURE0);
        // draw obj
        draw(gl);
    }
}

function parseMtlRes (mtlRes) {
    let ambient = new Vector3([mtlRes.Ka.red, mtlRes.Ka.green, mtlRes.Ka.blue]);
    let diffuse = new Vector3([mtlRes.Kd.red, mtlRes.Kd.green, mtlRes.Kd.blue]);
    let highLight = new Vector3([mtlRes.Ks.red, mtlRes.Ks.green, mtlRes.Ks.blue]);
    let mapKa = mtlRes.map_Ka ? mtlRes.map_Ka.file : null;
    let mapKd = mtlRes.map_Kd ? mtlRes.map_Kd.file : null;
    let mapKs = mtlRes.map_Ks ? mtlRes.map_Ks.file : null;
    let mapD = mtlRes.map_d ? mtlRes.map_d.file : null;
    // dissolve 溶解
    let dissolve = mtlRes.dissolve;
    return {
        ambient: ambient,
        diffuse: diffuse,
        highLight: highLight,
        mapKa: mapKa,
        mapKd: mapKd,
        mapKs: mapKs,
        mapD: mapD,
        dissolve: dissolve
    }
}

function draw (gl) {

}

function initTexture (gl, image, sampler, textureCache) {
    let texture = gl.createTexture();
    if (textureCache)
        gl.activeTexture(textureCache);
    else
        gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTUER_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(sampler, 0);
}

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
},{"./load3DModel":3}],3:[function(require,module,exports){
const read = require('read-file');
const MTLFile = require('./impl/MTLFile');
/**
 * v -> vertex -> a_Position 
 * vn -> vertexNormal -> a_Normal
 * vt -> vertexTexture(UV) -> a_TexCoord
 * f -> indices -> elementsArray correspond to the vertex protytype
 * fn -> indicesNormal
 * ft -> indicesTexture(UV)
 */
function loadOBJ (path) {
    var v = []
    var vn = []
    var vt = []
    var f = []
    var fn = []
    var ft = []
    let stream = read.sync(path);
    stream.pipe(split())
      .on("data", function(line) {
        if(line.length === 0 || line.charAt(0) === "#") {
          return;
        }
        var toks = line.split(" ")
        switch(toks[0]) {
          case "v":
            if(toks.length < 3) {
              throw new Error("parse-obj: Invalid vertex :" + line);
            }
            v.push([+toks[1], +toks[2], +toks[3]]);
          break;

          case "vn":
            if(toks.length < 3) {
              throw new Error("parse-obj: Invalid vertex normal:"+ line);
            }
            vn.push([+toks[1], +toks[2], +toks[3]]);
          break;

          case "vt":
            if(toks.length < 2) {
              throw new Error("parse-obj: Invalid vertex texture coord:" + line);
            }
            vt.push([+toks[1], +toks[2]]);
          break;

          case "f":
            var position = new Array(toks.length-1);
            var normal = new Array(toks.length-1);
            var texCoord = new Array(toks.length-1);
            for(var i=1; i<toks.length; ++i) {
              var indices = toks[i].split("/");
              position[i-1] = (indices[0]|0) - 1;
              texCoord[i-1] = indices[1] ? (indices[1]|0)-1 : -1;
              normal[i-1] = indices[2] ? (indices[2]|0)-1 : -1;
            }
            f.push(position);
            ft.push(texCoord);
            fn.push(normal);
          break;
          case "vp":
          case "s":
          case "o":
          case "g":
          case "usemtl":
          case "mtllib":
            //Ignore this crap
          break;
          default:
            throw new Error("parse-obj: Unrecognized directive: '" + toks[0] + "'");
        }
      })
      .on("error", function(err) {
        cb(err, null)
      })
      .on("end", function() {
        let obj = {
            vertexData: v,
            normalData: vn,
            textureData: vt,
            // vertex, texture, normal f-> 数据 s index 索引 num
            facePositions: f,
            faceNormals: fn,
            faceUVs: ft
        }
        return obj;
      });
}
/**
 * material:
 * Ns 高光权重
 * Ki 光学密度
 * d 透明度
 * illum 光照模型
 * Ka 环境光
 * Kd 漫反射
 * Ks 高光
 * new Matrix
 * @return materials[]
 */
function loadMTL (path) {
    let result = read.sync(path, {
        encoding: 'utf8'
    });

   let mtl = new MTLFile(result);
   return mtl.parse();
}

function loadTexture (path, callback) {
    if (!path || read.sync(path)) {
        console.warn(`Can't find image res to load`);
        return null;
    }

    if (!callback) {
        console.warn(`Suggestting you to add a callback`);
        return;
    }

    let image = new Image();
    image.onload = function () {
        callback(image);    
    }

    image.src = path;
}

module.exports = {
  loadOBJ: loadOBJ,
  loadMTL: loadMTL,
  loadTex: loadTexture
}
},{"./impl/MTLFile":1,"read-file":5}],4:[function(require,module,exports){

},{}],5:[function(require,module,exports){
/**
 * read-file <https://github.com/assemble/read-file>
 *
 * Copyright (c) 2014, 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

var fs = require('fs');

function read(fp, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  if (typeof cb !== 'function') {
    throw new TypeError('read-file async expects a callback function.');
  }

  if (typeof fp !== 'string') {
    cb(new TypeError('read-file async expects a string.'));
  }

  fs.readFile(fp, opts, function (err, buffer) {
    if (err) return cb(err);
    cb(null, normalize(buffer, opts));
  });
}

read.sync = function(fp, opts) {
  if (typeof fp !== 'string') {
    throw new TypeError('read-file sync expects a string.');
  }
  try {
    return normalize(fs.readFileSync(fp, opts), opts);
  } catch (err) {
    err.message = 'Failed to read "' + fp + '": ' + err.message;
    throw new Error(err);
  }
};

function normalize(str, opts) {
  str = stripBom(str);
  if (typeof opts === 'object' && opts.normalize === true) {
    return String(str).replace(/\r\n|\n/g, '\n');
  }
  return str;
}

function stripBom(str) {
  return typeof str === 'string' && str.charAt(0) === '\uFEFF'
    ? str.slice(1)
    : str;
}

/**
 * Expose `read`
 */

module.exports = read;
},{"fs":4}]},{},[2]);
