1. 3.6 新增记录需求，调整 gulpfile create package 之后调整 npm run br 的 --fold 对象为 create project 名称。

2. 3D 模型加载，纹理无法对应，目前不是很清楚到底是什么原因，很有可能是数据格式的问题。但是详细内容还不清楚要如何调整。
已经尝试了修改 texImage2D 加载数据属性和修改 drawElements 中的加载数据属性
我觉得问题应该出在 getFloat 和 getInt 上，加上这个 drawElements 的 gl.UNSIGNED_SHORT.

BYTE 是 8 位 到 1024
SHORT 是 16 位存储索引量更多

3. 绘制球体：
http://lulier.github.io/2018/06/12/webGL%E7%90%83%E4%BD%93%E6%A8%A1%E5%9E%8B/index.html 算法精讲 drawElements
https://www.web-tinker.com/article/20167.html drawArray 目测闭合效果可能会更好一些

https://en.wikipedia.org/wiki/Oak3D js webgl 3d 图形绘制开源库