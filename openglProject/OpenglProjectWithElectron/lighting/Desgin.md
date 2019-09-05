
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