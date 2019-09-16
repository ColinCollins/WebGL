function game (canvas) {
    this.processHandle = requestAnimationFrame(mainProcess);
    this.sceneHandle = null;
    this.mainCanvas = canvas;
}

game.switchScene = function (scene) {
    if (scene && scene !== this.sceneHandle)
        this.sceneHandle = scene;

    // clear Canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

game.mainProcess = function () {
    if (!this.sceneHandle) return;

    tick();
}

// 关闭当前场景
game.closeScene = function () {
    this.sceneHandle = null;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
/* switch (component.type) {

    case ComponentType.TEXTURE:
        // foreach (textures) to set all texture
        break;
    default:
        break;

}
 */

export default game;