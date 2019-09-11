exports.initMenuButton = function bindingButtonEvent () {
    $('#Lighting-Map').click(() => {
        LightingMapScene.initScene();
    });
}