> ##本文概要：
> ### 1.OpenLayers 3介绍
> ### 2.面相对象概念的介绍
> ### 3.OpenLayers 3地图组成部分

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
 * 抽象：是忽略一个主题中与当前目标无关的方面，以便更充分地注意与当前目标有关的方面。
 * 继承：继承是一种联结类的层次模型，并且允许和鼓励类的重用，它提供了一种明确表述共性的方法。
 * 封装：封装是面向对象的特征之一，是对象和类概念的主要特性。
 * 多态性：多态性是指允许不同类的对象对同一消息作出响应

---
### 地图所有组成部分
#### 地图(Map)，对应的类是ol.Map，对于开发者而言，它就是第一个入口。
#### 视图(View)，对应的类是ol.View，控制地图显示的中心位置，范围，层级等。
#### 图层(Layer)，OpenLayers 3有多种多样用于不同业务的图层，每一种图层在实现上都对应于一个类，放在包ol.layer下面。允许多个layer重叠在一起，相互之间互不干扰，是一种图形显示和管理的有效方式。应用这种方式能有效处理地图数据来源的多样性和复杂性问题。对开发者而言，它更多的表现为组织管理的类
#### 数据源(Source)，它是和图层一一对应的，OpenLayers 3也存在多种不同的数据源，每一种在实现上也对应于一个具体的类，它们都放在包ol.source下面。目前ol3也确实是这样做的，已支持多种多样在线或离线的数据源；可以是静态图或者瓦片图；也可以是栅格化的或者矢量的
#### 控件(Control)，它为用户提供了和地图交互的入口。地图上的放大缩小按钮就是其中一种。控件具备相同的一个特性，就是一直保持在地图的某个固定位置，不会随着地图移动而移动，也不会随着地图放大缩小而变化，一直处于地图的最上层。
#### 交互(Interaction)，这是所有软件都具备的一个组成部分，直观看不到，其实现类放在包ol.interaction下面，控制上层输入和底层之间的交互。

OpenLayer 3采用这样的模块化设计，不管是在实现上，还是对外提供API，都简化了整个系统。为此，在掌握某一部分后，就可以有效地处理这一部分的开发工作，从而不一定要掌握所有组成部分。
可查看例子baseMap.html。

> 视图(View)
#### 坐标系及投影
 * 笛卡尔坐标系：之前较常用。
 * WGS84：全称World Geodetic System 1984，是为GPS全球定位系统使用而建立的坐标系统。1996年，National Imagery and Mapping Agency (NIMA) 为美国国防部 (U.S.Department of Defense, DoD)做了一个新的坐标系统。这样实现了新的WGS版本WGS（G873）。其因为加入了美国海军天文台和北京站的改正，其东部方向加入了31-39cm 的改正。所有的其他坐标都有在1分米之内的修正。
 * 投影：是为了把不可展的椭球面描绘到平面上，它使用几何透视方法或数学分析的方法，将地球上的点和线投影到可展的曲面(平面、园柱面或圆锥面)上，再将此可展曲面展成平面，建立该平面上的点、线和地球椭球面上的点、线的对应关系。
 * OpenLayers 3支持两种投影（默认使用后者）：一个是EPSG:4326，等同于WGS84坐标系墨卡托投影(Mercator Projection)；另一个是EPSG:3857，等同于900913，由Mercator投影而来，经常用于web地图。
 * 默认情况下，从左向右为x正方向，从下向上为y轴正方向。
 * 有时需要进行坐标转换，要定义好投影方式：
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
 * 参考例子LinkedMap.html 、 switchMap.html 和 limitedMap.html

#### source 和 layer
 > GIS还需要加载很多其他的信息，比如街道名称，商店名称，公交站点，道路等等。那么在OpenLayers 3中，具体该如何把这些添加在地图上呢？
 > 首先需要明白的一点是，Source和Layer是一对一的关系，有一个Source，必然需要一个Layer，然后把这个Layer添加到Map上；
 > 归纳起来共三种：ol.source.Tile，ol.source.Image和ol.source.Vector: 
 * ol.source.Image 对应的是一整张图，而不像瓦片那样很多张图，从而无需切片，也可以加载一些地图，适用于一些小场景地图。
 * ol.source.Vector 对应的是矢量地图源，点，线，面等等常用的地图元素(Feature)，就囊括到这里面了。这样看来，只要这两种Source就可以搞定80%的需求了。
 * ol.source.Tile 对应的是瓦片数据源，现在网页地图服务中，绝大多数都是使用的瓦片地图，而OpenLayers 3作为一个WebGIS引擎，理所当然应该支持瓦片。相对来说ol.source.Tile 较复杂，需要支持多种瓦片数据源（按照继承关系，从左向右展开的）：
 ![avatar](http://anzhihun.coding.me/ol3-primer/img/ol.source.Tile.png)
 
 > 先了解最为复杂的ol.source.Tile，其叶子节点类有很多，大致可以分为几类：（后面讲）
 * 在线服务的Source，包括ol.source.BingMaps(使用的是微软提供的Bing在线地图数据)，ol.source.MapQuest(使用的是MapQuest提供的在线地图数据)(注: 由于MapQuest开始收费，ol v3.17.0就移除了ol.source.MapQuest)，ol.source.OSM(使用的是Open Street Map提供的在线地图数据)，ol.source.Stamen(使用的是Stamen提供的在线地图数据)。没有自己的地图服务器的情况下，可直接使用它们，加载地图底图。
 * 支持协议标准的Source，包括ol.source.TileArcGISRest，ol.source.TileWMS，ol.source.WMTS，ol.source.UTFGrid，ol.source.TileJSON。如果要使用它们，首先你得先学习对应的协议，之后必须找到支持这些协议的服务器来提供数据源，这些服务器可以是地图服务提供商提供的，也可以是自己搭建的服务器，关键是得支持这些协议。
 * ol.source.XYZ，这个需要单独提一下，因为是可以直接使用的，而且现在很多地图服务（在线的，或者自己搭建的服务器）都支持xyz方式的请求。国内在线的地图服务，高德，天地图等，都可以通过这种方式加载，本地离线瓦片地图也可以，用途广泛，且简单易学，需要掌握。

 > ol.source.Image虽然有几种不同的子类，但大多比较简单，因为不牵涉到过多的协议和服务器提供商。
 > 而ol.source.Vector就更加的简单了，但有时候其唯一的子类ol.source.Cluster在处理大量的Feature时，我们可能需要使用。 
 
 > OpenLayers 3现有的Layer类图大致如下(图中标注了每一个Layer对应的Source)：
 ![avatar](http://anzhihun.coding.me/ol3-primer/img/ol_layer_Base.png)
 > 查看例子 ImageResolutionMap.html
 * 新引入了ol.tilegrid.TileGrid，是定义瓦片网格，即瓦片坐标系。其作用在于设定每一地图层级的分辨率
 > 解密在线地图瓦片url
 * 瓦片的url解析对于想直接使用在线瓦片服务的开发者而言，根据难度，大致可以分为三种情况：
  * 第一种是最简单的，请求瓦片的url明确有xyz参数，比如高德地图和百度地图。
  * 第二种稍微难一点，xyz作为路径直接存在于url里面，没有明确的参数表明哪些是xyz，比如Open Street Map和Yahoo地图，这种情况下，地图服务器接收到请求后，就直接在服务器按照这个路径获取图片，按照这个逻辑，一般第一个参数表示是z，第二个参数为x，第三个参数为y。要想确认是否真是这样，可以写一个小程序来验证一下，如果还有问题，建议按照上面分析地图坐标系中的方法，从z比较小的情况入手来分析x，y，z的位置。
  * 第三种则最难，地图服务提供商为了防止大家直接非法使用瓦片地图，对瓦片的url进行了加密，比如现在的微软Bing中文地图和Google地图，这种情况下只有知道如何解密才能使用。
 > 加载url解密的微软Bing中文地图，查看例子 bing.html
 * 需要注意的是地图数据是非常昂贵的，几乎所有的在线地图服务都提供了响应的服务接口，强烈建议在商用项目中使用这些接口。
 > 加载离线瓦片地图（之前的例子都是离线地图）
 > 解密在线地图瓦片url（参考例子bing.html）
 > 静态地图及应用（参考例子bing.html）
 
 
 
 
 

---
未完待续
