class Builder {

    static _sceneHandle = null;

    static createCamera (pos, lookAt, ) {
        // 如果当前 scene 持有 mainCamera, 那就用 clone 复制一个新的 camera 出来
        if (this._sceneHandle && this._sceneHandle.mainCamera) {
            let newCamera = Camera.clone(this._sceneHandle.mainCamera);
            // set newCamera prop
        }
    }
}

export default Builder;