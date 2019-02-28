// 参考： https://blog.csdn.net/qq_30100043/article/details/73770421

1. shadow map 阴影贴图
2. shadow mapping 阴影映射
3. depth map 深度贴图

首先我们需要两个着色器， 一个用来计算光源到物体的距离
一个用来绘制场景。

使用一张 texture map 将结果传入场景绘制着色器中，这张 texture 被称为 shader map, 通过这个方法实现的阴影叫做阴影映射。

- 一. 视点移动到光源位置
- 二. 记录当前面对的片元的 z 值
- 三. 将视点移动到原来位置，绘制场景，计算在第一个着色器的坐标系下，计算阴影内容。

这里我们需要一个帧缓冲区用于绘制阴影内容然后作为 texture 附到 plane 上

## gl_FragCoord
它表示当前屏幕空间的坐标(0, 0) 在左下角
同时 gl_FragCoord 还有一个实际深度 gl_FragCoord.z 用于存储当前屏幕前所有像素的实际空间深度。
需要开启 深度测试的时候才能进行记录 z