class SceneCtrl {
    static sceneMap = new Map();
    static count = 0;

    static pushScene (scene) {
        this.sceneMap.set(scene.name, scene);
    }

    static getScene (sceneName) {
        if (this.isContainScene(sceneName))
           return this.sceneMap.get(sceneName);
    }

    static removeScene (sceneName) {
        if (this.isContainScene(sceneName))
            this.sceneMap.delete(sceneName);
    }

    static isContainScene () {
        if (!this.sceneMap.has(sceneName)) {
            console.warn(`Doesn't find specified scene in map`);
            return false;
        }
        return true;
    }
}

export default SceneCtrl;