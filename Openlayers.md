> ##本文概要：
> ### 1.OpenLayers 3介绍
> ### 2.面相对象概念的介绍
> ### 3.地图组成部分
> ### 4.preserveAspectRatio

### OpenLayers 3介绍
#### OpenLayers 3简称ol3，它是一个开源的Web GIS引擎，使用了JavaScript、最新的HTML5技术及CSS技术，支持dom，canvas和webgl三种渲染方式。
#### 除了支持网页端，还支持移动端（目前移动端还不成熟，有待进一步完善）。在地图数据源方面，支持各种类型的瓦片地图，既支持在线的，也支持离线的。
#### 比如OSM, Bing, MapBox, Stamen, MapQuest等等；还支持各种矢量地图，比如GeoJSON，TopoJSON，KML，GML等等。随着OpenLayers 3的进一步发展，将支持更多的地图类型。
#### 不兼容OpenLayers 2。虽然从名字上看是一个升级版本，但OpenLayers 3完全是重新设计，采用全新的架构，使用方式及API都不一样，只是在功能上完全实现OpenLayers 2已有的功能

---
### OpenLayers 3代码规范
#### 采用面向对象的编程范式，类在API中随处可见，比如ol.Map，ol.View等等。
#### 采用包管理的方式管理代码，比如layer的包名为ol.layer，命名方式类似于JAVA的包名。
#### 采用驼峰式(Camel-Case)命名，变量名采用小驼峰命名，类名使用大驼峰命名。

> 一个基础地图的代码块
```html
<div id="map" style="width: 100%"></div>
    <script>
      // 创建地图
      new ol.Map({
            // 设置地图图层
            layers: [
              // 创建一个使用Open Street Map地图源的瓦片图层
              new ol.layer.Tile({source: new ol.source.OSM()})
            ],
            // 设置显示地图的视图
            view: new ol.View({
              center: [0, 0],    // 定义地图显示中心于经度0度，纬度0度处
              zoom: 2            // 并且定义地图显示层级为2
            }),
            // 让id为map的div作为地图的容器
            target: 'map'    
        });
    </script>
```

---
### 面相对象概念的介绍
#### 它包括面向对象分析和面向对象程序设计。面向对象程序设计技术的提出，主要是为了解决传统程序设计方法——结构化程序设计所不能解决的代码重用问题。

---
### 面向对象的编程方法具有四个基本特征：
 · 抽象：就是忽略一个主题中与当前目标无关的那些方面，以便更充分地注意与当前目标有关的方面。
 · 继承：继承是一种联结类的层次模型，并且允许和鼓励类的重用，它提供了一种明确表述共性的方法。
 · 封装：封装是面向对象的特征之一，是对象和类概念的主要特性。
 · 多态性：多态性是指允许不同类的对象对同一消息作出响应

---
### 地图所有组成部分
#### 地图(Map)，对应的类是ol.Map，对于开发者而言，它就是第一个入口。
#### 视图(View)，对应的类是ol.View，控制地图显示的中心位置，范围，层级等。
#### 图层(Layer)，OpenLayers 3有多种多样用于不同业务的图层，每一种图层在实现上都对应于一个类，放在包ol.layer下面。允许多个layer重叠在一起，相互之间互不干扰，是一种图形显示和管理的有效方式。应用这种方式能有效处理地图数据来源的多样性和复杂性问题。对开发者而言，它更多的表现为组织管理的类
#### 数据源(Source)，它是和图层一一对应的，OpenLayers 3也存在多种不同的数据源，每一种在实现上也对应于一个具体的类，它们都放在包ol.source下面。目前ol3也确实是这样做的，已支持多种多样在线或离线的数据源；可以是静态图或者瓦片图；也可以是栅格化的或者矢量的
#### 控件(Control)，它为用户提供了和地图交互的入口。地图上的放大缩小按钮就是其中一种。控件具备相同的一个特性，就是一直保持在地图的某个固定位置，不会随着地图移动而移动，也不会随着地图放大缩小而变化，一直处于地图的最上层。
#### 交互(Interaction)，这是所有软件都具备的一个组成部分，直观看不到，其实现类放在包ol.interaction下面，控制上层输入和底层之间的交互。

OpenLayer 3采用这样的模块化设计，不管是在实现上，还是对外提供API，都简化了整个系统。为此，在掌握某一部分后，就可以有效地处理这一部分的开发工作，从而不一定要掌握所有组成部分。

> 视图(View)
#### 坐标系及投影
 · 笛卡尔坐标系：之前较常用。
 · WGS84：全称World Geodetic System 1984，是为GPS全球定位系统使用而建立的坐标系统。1996年，National Imagery and Mapping Agency (NIMA) 为美国国防部 (U.S.Department of Defense, DoD)做了一个新的坐标系统。这样实现了新的WGS版本WGS（G873）。其因为加入了美国海军天文台和北京站的改正，其东部方向加入了31-39cm 的改正。所有的其他坐标都有在1分米之内的修正。
 · 投影：是为了把不可展的椭球面描绘到平面上，它使用几何透视方法或数学分析的方法，将地球上的点和线投影到可展的曲面(平面、园柱面或圆锥面)上，再将此可展曲面展成平面，建立该平面上的点、线和地球椭球面上的点、线的对应关系。
 · OpenLayers 3支持两种投影（默认使用后者）：一个是EPSG:4326，等同于WGS84坐标系墨卡托投影(Mercator Projection)；另一个是EPSG:3857，等同于900913，由Mercator投影而来，经常用于web地图。
 · 有时需要进行坐标转换，要定义好投影方式：
 ```html
<body>
    <div id="map" style="width: 100%"></div>
    <script>
      new ol.Map({
            layers: [
                new ol.layer.Tile({source: new ol.source.OSM()})
            ],
            view: new ol.View({
                // 设置成都为地图中心
                center: [104.06, 30.67],
                // 指定投影使用EPSG:4326
                projection: 'EPSG:4326',
                zoom: 10,
                // 限制地图缩放最大级别为14，最小级别为10
                minZoom: 10,
                maxZoom: 14
            }),
            target: 'map'
      });
    </script>
</body>
```
 
 
 它声明了一个特定的区域，svg区域横跨左上角的点(0,0)到点(400,300)。
 区域被拉伸（类似缩放效果）来充满整个视窗。
 用户坐标系被映射到视窗坐标系-在这种情况下-一个用户单位等于两个视窗单位。
#### 类似于画图工具中的“放大镜”
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
