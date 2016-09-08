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
> min-x, min-y, width 和 height。
min-x 和 min-y 值决定viewBox的左上角，width和height决定视窗的宽高。这里要注意视窗的宽高不一定和父<svg>元素的宽高一样。

注意视窗的宽度也可以在CSS中设置为任何值。例如：设置width:100%会让SVG视窗在文档中自适应。无论viewBox的值是多少，它会映射为外层SVG元素计算出的宽度值。
我们将从viewBox和viewport的宽高比相同的例子开始，所以我们还不需要深入了解preserveAspectRatio。
```html
<svg width="800" height="600" viewBox="0 0 400 300">
    <!-- SVG content drawn onto the SVG canvas -->
</svg>
```
- [x] viewBox="0 0 400 300"到底有什么用呢？

它声明了一个特定的区域，canvas横跨左上角的点(0,0)到点(400,300)。
SVG图像被这个区域裁切。
区域被拉伸（类似缩放效果）来充满整个视窗。
用户坐标系被映射到视窗坐标系-在这种情况下-一个用户单位等于两个视窗单位。

---
#### 然而，每个时刻只有一部分网页内容是透过视窗可见的。整个SVG画布可见还是部分可见取决于canvas的尺寸以及preserveAspectRatio属性值。



---
