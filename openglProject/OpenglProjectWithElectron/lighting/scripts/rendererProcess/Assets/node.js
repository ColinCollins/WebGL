import { Transform } from "../DataType/transform";

class Node {
    _indexData = null;
    _vertexData = null;
    _normalData = null;

    _program = null;
    _components = null;

    _isDestroy = false;

    // getset prop 注入遍历方法
    static propNames = ['name', 'active'];

    constructor(name, program, scene) {
        initProp(this);

        // add the component
        this._components = new Map();

        this._program = program;
        this.transfrom =  new Transform();
        this._components.set(Transform.type, this.transform);

        this._name = name;
        this._isActive = false;
        this._isDestroy = false;
        // add to schedule
        scene.nodeTree.addNewNode(this);
    }

    // 关联 propNames，方便 get set 设置
    static initProp (node) {
        this.propNames.forEach( prop => {
            ClassUtil.getset(node, prop);
        });
    }

    addComponent (component) {
        if (this._components.has(component.type)) {
            console.warn('The node already has a component');
            return;
        }
        component.setNode(this);
        this._components.set(component.type, component);
    }

    removeComponentImmediatly (compType) {
        this._components.delete(compType);
    }

    removeComponent (compType) {
        this._components.get(compType)._isDestroy = true;
    }

    Destroy () {
        this._isDestroy = true;
    }
}

export default Node;