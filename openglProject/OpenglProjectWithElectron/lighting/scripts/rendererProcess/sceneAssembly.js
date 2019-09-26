// enum
window.ShaderType = require('./Renderer/ShaderType');
window.ComponentType = require('./DataType/ComponetType');
// const data
window.Data = require('./Renderer/data');

// class
import ProgramCtrl from './Program/programCtrl';
window.Program = ProgramCtrl;
// basic program object
import ProgramObj from './Program/programObj';
window.ProgramObj = ProgramObj;


window.glMethod = require('./Renderer/glMethod');
window.RawTexture = require('./Assets/rawTexture');

window.ClassUtil = require('../windowUtil/index');

require('./Renderer/Scene/index')