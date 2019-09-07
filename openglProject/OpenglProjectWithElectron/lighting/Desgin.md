
### 主进程与渲染进程

main 是主进程用于后台与 nodejs 进行交互

渲染进程主要是负责界面的信息交互。

一旦有什么 IO 流的内容需要传输，还是需要通过 main.js 与 renderer.js 之间的信息通讯机制才可以。

-----

关于 fragmentShader:
设计中使用了最基础的高光计算方式。
建议后续可以添加 Blinne Phone 或者 HalfLambert 这种计算。


----------
关于界面设计，我们使用 https://www.bilibili.com/video/av35942981/?p=38 安装 bower with bulma and font-awesome

```
npm install bower -g

bower i bulma
bower i font-awesome

```

electron-reload 帮助运行时快速刷新界面以及代码。

-------------------

在些这个的时候为了后期的遍历，我建议是创建一个 node 类，对初始化数据进行管理，并且最后的数据能够进行整合。
以及我们希望应用到 program 切换，skybox 等渲染技巧。
当然目前我们还不需要这些东西，在完成第一个 lighting map 之前。

同时我们还需要一个资源关系系统，用于 load 数据从 nodejs 的后台。
写一个监听者模式，方便传递调用吧，不要忘记回调。

希望后期增加一个选取 node 系统，可以用于展示 node 数据信息。

渲染也要有自己的进程。
如何在一帧内创建两个 cube 就需要使用两个 draw 啊。

draw 现在作为单独的渲染进程需要一个 foreach 去遍历节点。全部渲染。
而节点本身可以设置自己的 shader。
node 节点只保存物体的 path 而不去真正的获取 texture， 通过 asset 对象获取。

这就要求 asset 管理 main process 与 renderer process。

### 为了便于测试，我们优先将 lighting map 场景实现出来。

-----------
2019.9.6 
现在希望 js Program 持有一个静态的 map 存储新生的 program 对象。
但是不会写，因为 prototype 的关系， 新建一个实例，要从 prototype 中去寻找数据对象。
同时还要保证它能拿到最下层的 Map 表。

关于原型链，我们自己的理解和设计，假装 js 已知是一个完整的原型链模式。那么 function Object 两个对象的区别就在于 Object 不存在 prototype 但是实例的 Object 有一个 __proto__ 指向原型链的指针。
这个 proto 帮助 Object 在 function 创建的原型链上查找内容。

function 本身不表示原型链。
![prototypeTest](./summary/prototypeTest.png)

上图可见，Prototype 定义的 Map 对象在 a b 对象上也生效了，但是 Program.Map 本身没有对数据对象进行传入，而且 __a, b 也并不获取 Program.Map 而是获取原型链上的 Program.prototype.Map__。

顺便一提，对于 Object 或者非原始数据类型，js 一般都是引用指向。类似于 指针指向对象地址的浅拷贝，而不是深拷贝。

----------------
Node 需要自己记录 rotation position tetxture 至少三个属性