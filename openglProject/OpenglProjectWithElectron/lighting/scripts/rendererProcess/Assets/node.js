import { Transform } from "../DataType/transform";

class Node {

    constructor(program, scene) {
        this.indexData = null;
        this.vertexData = null;
        this.normalData = null;

        // add the component
        this._components = new Map();

        this.program = program;
        this.transfrom =  new Transform();
        this._components.set(Transform.type, this.transform);

        isActive = true;
        isDestroy = false;
        // add to schedule
        scene.nodeTree.addNewNode(this);
    }

    addComponent (component) {
        if (this._components.has(component.type)) {
            console.warn('The node already has a component');
            returnl;
        }
        this._components.set(component.type, component);
    }

    removeComponentImmediatly (compType) {
        this._components.delete(compType);
    }

    removeComponent (compType) {
        this._components.get(compType).isDestroy = true;
    }

    Destroy () {
        this.isDestroy = true;
    }
}

export default Node;