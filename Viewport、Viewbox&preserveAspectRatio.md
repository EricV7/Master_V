> ##本文概要：
> ### 1.svg画布
> ### 2.视窗viewport
> ### 3.“真实”坐标系viewBox
> ### 4.preserveAspectRatio

### svg画布
#### canvas是绘制SVG内容的一块空间或区域。理论上，画布在所有维度上都是无限的。所以SVG可以是任意尺寸。

---
### 视窗viewPort
#### 视窗是一块SVG可见的区域。SVG中超出视窗边界的区域会被裁切并且隐藏。
我们一旦创建视窗坐标系（使用width和height），浏览器默认创建一个完全相同的用户坐标系。

---
### “真实”坐标系viewBox
#### viewBox属性接收四个参数值，包括：
> min-x, min-y, width 和 height。
min-x 和 min-y 值决定viewBox的左上角，width和height决定视窗的宽高（不能为负）。

我们将从viewBox和viewport的宽高比相同的例子开始，所以我们还不需要深入了解preserveAspectRatio。
```html
<svg width="400" height="300" viewBox="0 0 200 150">
    <!-- SVG content drawn onto the SVG canvas -->
</svg>
```
> viewBox="0 0 200 150"到底有什么用呢？

 它声明了一个特定的区域，svg区域横跨左上角的点(0,0)到点(400,300)。
 区域被拉伸（类似缩放效果）来充满整个视窗。
 用户坐标系被映射到视窗坐标系-在这种情况下-一个用户单位等于两个视窗单位。
####类似于画图工具中的“放大镜”
当viewBox和viewport的宽高比不相同时：
```html
<svg width="400" height="300" viewBox="0 0 100 150">
    <!-- SVG content drawn onto the SVG canvas -->
</svg>
```
因此图形在视窗中的定位默认为：
 · 整个viewBox适应视窗。
 · 保持viewBox的宽高比。viewBox没有被拉伸来覆盖视窗区域。
 · viewBox在视窗中水平垂直居中。
这是默认表现。那用什么控制表现呢？如果我们想改变视窗中viewBox的位置呢？这就需要用到preserveAspectRatio属性了。

---
###preserveAspectRatio
#### preserveAspectRatio属性强制统一缩放比来保持图形的宽高比值。
如果你用不同于视窗的宽高比定义用户坐标系，如果像我们在之前的例子中看到的那样浏览器拉伸viewBox来适应视窗，宽高比的不同会导致图形在某些方向上扭曲。
> preserveAspectRatio = defer? <align> <meetOrSlice>?
#####1、defer声明是可选的，并且只有当你在<image>上添加preserveAspectRatio才被用到。用在任何其他元素上时它都会被忽略；
#####2、align参数声明是否强制统一放缩，如果是，对齐方法会在viewBox的宽高比不符合viewport的宽高比的情况下生效；
#####如果align值设为none，图形不在保持宽高比而会缩放来适应视窗，像我们在上面两个例子中看到的那样。
#####3、meetOrSlice也是可选的，默认值为meet。这个属性声明整个viewBox在视窗中是否可见。如果是，它和align参数通过一个或多个空格分隔：
> meet(默认值)，基于以下两条准则尽可能缩放元素：
  · 保持宽高比
  · 整个viewBox在视窗中可见
> slice 在保持宽高比的情况下，缩放图形直到viewBox覆盖了整个视窗区域
#####viewBox被缩放到正好覆盖视窗区域（在两个维度上），但是它不会缩放任何超出这个范围的部分。换而言之，它缩放到viewBox的宽高可以正好完全覆盖视窗。在这种情况下，如果viewBox的宽高比不适合视窗，一部分viewBox会扩展超过视窗边界（即，viewBox绘制的区域会比视窗大）。这会导致部分viewBox被切片(类似于在画图工具中，放大一个图片)
#####所以，meetOrSlice被用来声明viewBox是否会被完全包含在视窗中，或者它是否应该尽可能缩放来覆盖整个视窗，甚至意味着部分的viewBox会被“slice”

#####可以把meetOrSlice的值类比于background-size的contain和cover值;它们非常类似。meet类似于contain，slice类似于cover。

---
align参数使用9个值中的一个或者为none。任何除none之外的值都用来保持宽高比缩放图片，并且还用来在视窗中对齐viewBox。
> #####none : 如果有必要的话viewBox被拉伸或缩放来完全适应整个视窗，不管宽高比。图形也许会扭曲;
