
对于各个缓冲区的理解实际上还是有些不到位的
比如绘制的时候 frameBuffer 这一节中
gl.bindFramebuffer(gl.RENDERBUFFER, null);
这里切换缓冲区为实际颜色缓冲
在这之前的缓冲区一直保存的数据是 framebufferObj 里面指定的对象，也就是离屏 canvas
里面包含 color buffer 和 depth buffer


根据书中案例，传入了 texture， 原理上在 draw 的时候可能需要通过绑定 texture 的数据。
实际上是一个数据替换的过程。参考 multipleTexture

gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
gl.drawArrays(gl.TRIANGLES_STRIP, 0, 4);