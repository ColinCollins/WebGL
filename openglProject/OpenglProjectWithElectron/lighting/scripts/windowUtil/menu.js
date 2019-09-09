const renderer = require('../rendererProcess/renderer');

exports.initMenuButton = function bindingButtonEvent () {
    $('#Lighting-Map').click(() => {
        LightingMap.initScene();
    });
}