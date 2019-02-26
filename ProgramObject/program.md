1. program 应该是只能是切换 shader， 剩下的 arraybuffer 应该是复用的。
2. 理论上是对的了，不同的 program 使用同一个 gl， 然后公用的是同一个 array_buffer
每次切换 program, gl 会刷新 array_buffer, 所以每次绘制之前，需要重新 bind 原有的 array data.