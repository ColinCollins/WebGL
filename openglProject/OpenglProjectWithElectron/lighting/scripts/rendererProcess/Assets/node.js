import { Transform } from "../DataType/transform";

class Node {

    constructor(program, scene) {
        this.indexData = null;
        this.vertexData = null;
        this.normalData = null;

        // add the component
        this.components = [];

        this.program = program;
        this.transfrom =  new Transform();
        this.components.push(this.transform);

        isActive = true;
        isDestroy = false;
        // add to schedule
        scene.nodeTree.addNewNode(this);
    }

    Destroy () {
        this.isDestroy = true;
    }
}

export default Node;