const renderer = require('./renderer');

exports.initMenuButton = function bindingButtonEvent () {
    $('#Lighting-Map').click(() => {
        LightingMap.initScene();
    });
}