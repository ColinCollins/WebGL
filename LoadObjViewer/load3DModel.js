const fs = require('fs');
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
    let stream = fs.readFileSync(path);
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
    let result = fs.readFileSync(path, {
        encoding: 'utf8'
    });

   let mtl = new MTLFile(result);
   return mtl.parse();
}

function loadTexture (path, callback) {
    if (!path || fs.existsSync(path)) {
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