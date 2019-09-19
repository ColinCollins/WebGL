
function game (canvas) {
    this.processHandle = requestAnimationFrame(mainProcess);
    this.sceneHandle = null;
    this.mainCanvas = canvas;

    this._componentMap = new Map();
}

game.switchScene = function (scene) {
    if (this.sceneHandle) {
        onDisable(this._componentMap);
    }

    if (scene !== this.sceneHandle)
        this.sceneHandle = scene;

    // clear Canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // onAwake
    onAwake(this._componentMap);

    // onStart
    onStart(this._componentMap);
}

game.mainProcess = function () {
    if (!this.sceneHandle) return;

    preUpdate(this._componentMap);

    update(this._componentMap);

    lateUpdate(this._componentMap);

    tick();
}

game.addToComponentQueue = function (comp) {
    this.componentMap.set(comp._uniqueTag, comp)
}

// 关闭当前场景
game.closeScene = function () {
    this.sceneHandle = null;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function preUpdate (componentMap) {
    componentMap.forEach((value, key, map) => {
        value.preUpdate();
    });
}

function update (componentMap) {
    componentMap.forEach((value, key, map) => {
        value.update();
    });
}

function lateUpdate (componentMap) {
    componentMap.forEach((value, key, map) => {
        value.lateUpdate();
    });
}

function onAwake (componentMap) {
    componentMap.forEach((value, key, map) => {
        value.awake();
    });
}

function onStart (componentMap) {
    componentMap.forEach((value, key, map) => {
        value.start();
    });
}

function onDisable (componentMap) {
    componentMap.forEach((value, key, map) => {
        value.start();
    });
}

export default game;