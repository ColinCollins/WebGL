// 参考： https://blog.csdn.net/qq_30100043/article/details/73770421
https://bingqixuan.github.io/2018/08/15/WebGL%E6%95%99%E7%A8%8B-%E4%B8%8D%E5%B8%A6%E6%89%A9%E5%B1%95%E7%9A%84%E6%96%B9%E5%90%91%E5%85%89Shadow%20Map/

http://www.opengl-tutorial.org/cn/intermediate-tutorials/tutorial-13-normal-mapping/

opengl es 2.0 specification 
http://www.opengpu.org/forum.php?mod=viewthread&tid=2164


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

如何进行的记录，是因为在 framebuffer 下 draw 的时候已经将我们要绘制的 triangle 内容都传入了片元着色器，在开启 DEPTH_TEST 的前提下记录 zIndex 这个 z 的取值在 0~1 之间，单位内容上对应的是我们传入的 mvpMatrix 的近景面和远景面

在全景绘制下计算对应深度的 z 值
```
"void main(){\n" +
        "   vec3 shadowCoord = (v_PositionFromLight.xyz / v_PositionFromLight.w) / 2.0 + 0.5;\n" +
        // 取样获取 texture 中每个像素的属性
        "   vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);\n" +
        
        "   float depth = rgbaDepth.a;\n" +
        // 这里判断若是计算出来的深度值在对应的阴影坐标下那么就变暗
        "   float visibility = (shadowCoord.z > depth + 0.005) ? 0.5 : 1.0;\n" +
        "   gl_FragColor = vec4(v_Color.rgb * visibility, v_Color.a);\n" +
        "}\n";

```

shadowCoord 是什么？？？


使用 framebufferObject 的时候重点有两个：
1. 重新更新数据
2. **viewport 一定要准备切换，不然 framebuffer texture 尺寸就会有偏差**

siwthc program 后需要更细的 data 有哪些？
1. array_buffer 涉及 data
2. element_array_buffer 不一定，但是可能会，若是绘制的物体不同
3. uniform 数据不一定更新，因此绑定在对应的 program 是最好的
4. 按照 c++ 的写法，我们需要创建一个 program 类，用于存储可能会用到的类型在 default shader 中，1. 可以拓展一个借口用于传入特定的 shader 2. 然后增添对应的 program 属性