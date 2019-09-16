const MAX_SCENE_COUNT = 1024;
// queue
class SceneCtrl {
    static sceneQueue = new Array(MAX_SCENE_COUNT);
    static count = 0;

    static pushScene (scene) {
        if (count + 1 > MAX_SCENE_COUNT) return;
        this.sceneQueue.push(scene);
    }

    static popScene () {
        this.sceneQueue.length--;
    }
}

export default SceneCtrl;