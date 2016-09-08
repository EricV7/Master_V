> ##本文概要：
> ### 1.svg画布
> ### 2.视窗viewport
> ### 3.“真实”坐标系viewBox
> ### 4.preserveAspectRatio

### svg画布
#### canvas是绘制SVG内容的一块空间或区域。理论上，画布在所有维度上都是无限的。所以SVG可以是任意尺寸。


---
### 视窗viewPort
#### 视窗是一块SVG可见的区域。（你可以把视窗当做一个窗户，透过这个窗户可以看到特定的景象，景象也许完整，也许只有一部分）。SVG中超出视窗边界的区域会被裁切并且隐藏。
我们一旦创建视窗坐标系（使用width和height），浏览器默认创建一个完全相同的用户坐标系。


---
### “真实”坐标系viewBox
#### viewBox属性接收四个参数值，包括：
> <min-x>, <min-y>, width 和 height。



---
#### 然而，每个时刻只有一部分网页内容是透过视窗可见的。整个SVG画布可见还是部分可见取决于canvas的尺寸以及preserveAspectRatio属性值。



---
