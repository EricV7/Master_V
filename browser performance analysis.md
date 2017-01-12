# 主要讲解内容：timeline工具的使用与诊断、浏览器的任务队列、页面的性能分析与优化，
## 一、浏览器加载、渲染及性能分析：
### 1、建立连接过程

#### (1) 浏览器查找域名的IP地址
#### (2) 浏览器给web服务器发送一个HTTP请求
#### (3) 服务器发送永久重定向响应
#### (4) 浏览器跟踪重定向地址
#### (5) 服务器“处理”请求
#### (6) 服务器发回一个HTML响应
***
### 2、浏览器渲染

#### 解析HTML

##### ↓ HTML代码转化成DOM
##### 构建DOM树
##### ↓ CSS代码转化成CSSOM（CSS Object Model）,结合DOM和CSSOM，生成一棵渲染树（包含每个节点的视觉信息）
##### 渲染树构建
##### ↓ 生成布局（layout），即将所有渲染树的所有节点进行平面合成
##### 渲染树布局
##### ↓ 将布局绘制（paint）在屏幕上
##### 绘制渲染树
***

### 3、开发者工具的Timeline面板
##### Timeline面板概述
* 控制栏 - 控制录制等相关信息
* 概况栏 - 页面性能概况
* 火焰图 - CPU性能的形象展现（三条虚线：蓝-DOM文本加载完毕时间；绿-最初开始绘制的时间；红-加载脚本等的事件）
* 损耗性能详情部分（后面详细介绍）{#index}
![Pics](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/imgs/timeline-annotated.png)

##### 基本使用方法：
* 录制一段页面加载过程 或 用户操作过程的记录；
* 观察概览窗口中的 FPS, CPU, and network 区域；
* 点击chart图中的事件以查看其相关细节；
* 将时间窗口聚焦某一部分，能更好地进行分析。

##### 录制tips：
* 录制时长尽可能短，降低分析难度
* 尽量避免其他操作，减少分析复杂性
* 将浏览器缓存置成disable，避免不同的录制脚本互相影响
* 关闭其他扩展程序，会对录制脚本的分析有干扰
* 截屏功能可记录关键时刻，鼠标从左移向右，可作为模拟动画的幻灯片
* 录制工具比较智能，结束时，会猜测和页面操作最相关的部分，并切换到该区域。

##### 工具栏：
* JS Profile：开启时，绘制图表展现录制过程中每个被调用的函数消耗资源情况
* Paint：开启时，会获取更多绘制相关事件的信息，选中某一绘图函数，开启paint profiler颗粒信息窗口（支持ctrl+F所搜具体事件功能）
* Memory：样式计算和布局，即重排

##### 概览窗口：
1. FPS.（每秒帧数） 绿色bar越高，FPS越高。FPS图表上的红色色块代表长帧动画，可以理解为可供优化的地方；
2. CPU.（CPU资源） 不同类别的事件消耗CPU资源的情况；
3. NET.（网络请求）资源的请求及加载时间；（越长表示获取资源时间越长，浅色部分为请求等待时间，深色部分为请求到后的加载时间）
* 其中，蓝色表示HTML文件；黄色为Scripts文件；紫色为Stylesheets文件；绿色为Media文件；灰色为其他混杂资源（可以理解为浏览器内部c++的一些工作，和前端js以及渲染关系不大，也有说是没有被DevTools感知到的活动）；空白区块：显示刷新周期（display refresh cycles）中的空闲时间段
![Pics](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/imgs/overview-annotated.jpg)

##### 5种颜色表示不同类别事件：
* 蓝色：网络通信和HTML解析
* 黄色：JavaScript执行
* 紫色：样式计算和布局，即重排
* 绿色：重绘
* 灰色：混杂的资源

##### 查看录制详情：
* 当选中火焰图中的某事件时，详情界面会展示该事件相关的额外信息；
![Pics](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/imgs/details-pane.png)

##### timeline的通用事件属性：
* Aggregated time：当事件是嵌套事件时，各类型事件的时耗
* Call Stack：含有子事件的事件 的各类型时耗
* CPU time：事件占用CPU的时耗
* Details：该事件的其他细节
* Duration(at time-stamp)：该事件及其子事件执行完的时间
* Self time：该事件（不包括其子事件）耗时
* Used Heap Size：事件执行时所占用的内存

##### Summary面板事件类型列表
类型             |  描述
-------------    | -------------
send request   |	发送请求
evaluate script	 |  评估脚本
parse html	|  html解析
recalculate style  |	重新计算显示样式
layout  |	计算布局
paint setup  |	绘制设置【准备绘制】
paint	|  绘制
composite layers |	组合层
timer fired |	触发定时器
function call |	函数调用
receive data  |	接收数据
receive response |	接受响应
finish loading | 结束加载
GC event |	浏览器垃圾回收
pevaluate script |	评估脚本
rasterize |	栅格化

##### Loading事件
事件             | 描述    
-------------    | -------------
Parse HTML       | 浏览器执行HTML解析 
Finish Loading   | 网络请求完毕事件
Receive Data     | 请求的响应数据到达事件，如果响应数据很大（拆包），可能会多次触发该事件
Receive Response | 响应头报文到达时触发    
Send Request     | 发送网络请求时触发       

##### Loading事件属性
属性             | 描述    
-------------    | -------------
Resource       | 请求资源的url 
Preview   | 请求的资源预览（仅图片）
Request Method     | 请求时发送的HTTP方法 （如Get或Post）
Status Code | HTTP响应码    
MIME Type     | 请求资源的MIME类型
Encoded Data Length     | 请求资源的字节长度

##### Scripting事件
事件             | 描述    
-------------    | -------------
Animation Frame Fired       |   事件描述一个定义好的动画帧发生并在回调处理时触发
Cancel Animation Frame      |   取消一个动画帧时触发
GC Event                    |   垃圾回收时触发
DOMContentLoaded     |     当页面中的DOM内容加载并解析完毕时触发   
Event                |     js事件(如mousedown等)
Function Call        |     创建计时器（调用setTimeout()和setInterval()）时触发
Remove Timer         |  当清除一个计时器时触发
Event     | js事件(如mousedown等)
XHR Ready State Change | 当一个异步请求为就绪状态后触发
XHR Load  | 当一个异步请求完成加载后触发

##### Scripting事件属性
事件             | 描述    
-------------    | -------------
Timer ID       |   计时器ID
Timeout        |   计时器延时
Repeats         |   计时器是否重复的标识
Function Call   |    被调用的函数

##### Rendering事件
事件             | 描述    
-------------    | -------------
Invalidate layout   | 当DOM更改导致页面布局失效时触发
Layout   | 页面布局计算执行时触发
Recalculate style   | Chrome重新计算元素样式时触发
Scroll | 内嵌的视窗滚动时触发 

##### Rendering事件属性
事件             | 描述    
-------------    | -------------
Layout invalidated   | Layout记录中的，无效布局
Nodes that need layout   | Layout记录中，页面重新前需完成布局的节点数
Layout tree size   | Layout记录中，Chrome重新布局时的所有节点数
Layout scope | 可供布局的范围值 
Elements affected | Recalculate style记录中，样式重绘影响的元素数 
Styles invalidated	 | Recalculate style记录中的,无效样式 

##### Painting事件
事件             | 描述    
-------------    | -------------
Composite Layers   | Chrome的渲染引擎完成图片层合并时触发
Image Decode   | 一个图片资源完成解码后触发
Image Resize   | 一个图片被修改尺寸后触发
Paint | 合并后的层被绘制到对应显示区域后触发

##### Painting事件属性
属性             | 描述    
-------------    | -------------
Location   | 绘制事件对象的坐标，及布局
Dimensions   | 绘制事件对象的大小
***

以下三种情况，会导致网页重新渲染。
* 修改DOM
* 修改样式表
* 用户事件（比如鼠标悬停、页面滚动、输入框键入文字、改变窗口大小等等）
##### DOM的性能问题

* 核心问题：当解析的html文件很大时，生成DOM树占用内存较大，同时遍历（不更新）元素耗时也更长。但这都不是重点，DOM的核心问题是：DOM修改导致的页面重绘、重新排版！重新排版是用户阻塞的操作，同时，如果频繁重排，CPU使用率也会猛涨！
* 重新渲染，就需要重新生成布局和重新绘制。前者叫做"重排"（reflow），后者叫做"重绘"（repaint）。
> DOM操作会导致一系列的重绘（repaint）、重新排版（reflow）操作。为了确保执行结果的准确性，所有的修改操作是按顺序同步执行的。大部分浏览器都不会在
> JavaScript的执行过程中更新DOM。相应的，这些浏览器将对对 DOM的操作放进一个队列，并在JavaScript脚本执行完毕以后按顺序一次执行完毕。也就是说，在
> JavaScript执行的过程，直到发生重新排版，用户一直被阻塞。
> 一般的浏览器中（不含IE），repaint的速度远快于reflow，所以避免reflow更重要。
* 需要注意的是，"重绘"不一定需要"重排"，比如改变某个网页元素的颜色，就只会触发"重绘"，不会触发"重排"，因为布局没有改变。但是，"重排"必然导致"重绘"，比如改变一个网页元素的位置，就会同时触发"重排"和"重绘"，因为布局改变了。
###### 解决问题的关键是：减少因DOM操作，引起的reflow。

1. 1. 在DOM外，执行尽量多的变更操作。Demo：
```
// 不好的做法
for (var i=0; i < items.length; i++){
    var item = document.createElement("li");
    item.appendChild(document.createTextNode("Option " + i);
    list.appendChild(item);
}

// 更好的做法
// 使用容器存放临时变更， 最后再一次性更新DOM
var fragment = document.createDocumentFragment();
for (var i=0; i < items.length; i++){
    var item = document.createElement("li");
    item.appendChild(document.createTextNode("Option " + i);
    fragment.appendChild(item);
}
list.appendChild(fragment);
```
2. 2. 操作DOM前，先把DOM节点删除或隐藏，因为隐藏的节点不会触发重排。Demo如下：
```
list.style.display = "none";  
for (var i=0; i < items.length; i++){  
    var item = document.createElement("li");  
    item.appendChild(document.createTextNode("Option " + i);  
    list.appendChild(item);  
}  
list.style.display = "";  
```
3. 3. 一次性，修改样式属性。Demo如下：
```
// 不好的做法
// 这种做法会触发多次重排
element.style.backgroundColor = "blue";  
element.style.color = "red";  
element.style.fontSize = "12em";

// 更好的做法是，把样式都放在一个class下
.newStyle {  
    background-color: blue;  
    color: red;  
    font-size: 12em;  
}  
element.className = "newStyle";
```
4. 4. 使用缓存，缓存临时节点。
```
// 不好的做法
document.getElementById("myDiv").style.left = document.getElementById("myDiv").offsetLeft +  
document.getElementById("myDiv").offsetWidth + "px";  
// 更好的做法
var myDiv = document.getElementById("myDiv");  
myDiv.style.left = myDiv.offsetLeft + myDiv.offsetWidth + "px";
```

***

### 4、对于性能的影响

##### 重排和重绘会不断触发，这是不可避免的。但是，它们非常耗费资源，是导致网页性能低下的根本原因。提高网页性能，就是要降低"重排"和"重绘"的频率和成本，尽量少触发重新渲染。
##### 前面提到，DOM变动和样式变动，都会触发重新渲染。但是，浏览器已经很智能了，会尽量把所有的变动集中在一起，排成一个队列，然后一次性执行，尽量避免多次重新渲染。
`div.style.color = 'blue';
div.style.marginTop = '30px';`
##### 上面代码中，div元素有两个样式变动，但是浏览器只会触发一次重排和重绘。下面代码，代码对div元素设置背景色以后，第二行要求浏览器给出该元素的位置，所以浏览器不得不立即重排。
`div.style.color = 'blue';

var margin = parseInt(div.style.marginTop);

div.style.marginTop = (margin + 10) + 'px';`

##### 一般来说，样式的写操作之后，如果有下面这些属性的读操作，都会引发浏览器立即重新渲染。
##### 从性能角度考虑，尽量不要把读操作和写操作，放在一个语句里面。
`// bad
div.style.left = div.offsetLeft + 10 + "px";

div.style.top = div.offsetTop + 10 + "px";`

`// good
var left = div.offsetLeft;
var top  = div.offsetTop;

div.style.left = left + 10 + "px";
div.style.top = top + 10 + "px";`

##### 一般的规则是：
* 样式表越简单，重排和重绘就越快。
* 重排和重绘的DOM元素层级越高，成本就越高。
* table元素的重排和重绘成本，要高于div元素

### 3、刷新率
跳转到[FPS](#index)
##### 一秒之间能够完成多少次重新渲染，这个指标就被称为"刷新率"，英文为FPS（frame per second）。60次重新渲染，就是60FPS。这意味着，一秒之内进行60次重新渲染，每次重新渲染的时间不能超过16.66毫秒。
##### 网页动画的每一帧（frame）都是一次重新渲染。每秒低于24帧的动画，人眼就能感受到停顿。一般的网页动画，需要达到每秒30帧到60帧的频率，才能比较流畅。如果能达到每秒70帧甚至80帧，就会极其流畅。

> 如果想达到60帧的刷新率，就意味着JavaScript线程每个任务的耗时，必须少于16毫秒。一个解决办法是使用Web Worker，主线程只用于UI渲染，然后跟UI渲染不相干的任务，都放在Worker线程。

*** 

### 5、像素渲染流水线
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/intro/frame-full.jpg)
- JavaScript。一般来说，我们会使用JavaScript来实现一些视觉变化的效果。比如用jQuery的animate函数做一个动画、对一个数据集进行排序、或者往页面里添加一些DOM元素等。当然，除了JavaScript，还有其他一些常用方法也可以实现视觉变化效果，比如：CSS Animations, Transitions和Web Animation API。
- 计算样式。这个过程是根据CSS选择器，比如.headline或.nav > .nav_item，对每个DOM元素匹配对应的CSS样式。这一步结束之后，就确定了每个DOM元素上该应用什么CSS样式规则。
 布局。上一步确定了每个DOM元素的样式规则，这一步就是具体计算每个DOM元素最终在屏幕上显示的大小和位置。web页面中元素的布局是相对的，因此一个元素的布局发生变化，会联动地引发其他元素的布局发生变化。比如，<body>元素的宽度的变化会影响其子元素的宽度，其子元素宽度的变化也会继续对其孙子元素产生影响。因此对于浏览器来说，布局过程是经常发生的。
- 绘制。绘制，本质上就是填充像素的过程。包括绘制文字、颜色、图像、边框和阴影等，也就是一个DOM元素所有的可视效果。一般来说，这个绘制过程是在多个层上完成的。
- 渲染层合并。由上一步可知，对页面中DOM元素的绘制是在多个层上进行的。在每个层上完成绘制过程之后，浏览器会将所有层按照合理的顺序合并成一个图层，然后显示在屏幕上。对于有位置重叠的元素的页面，这个过程尤其重要，因为一旦图层的合并顺序出错，将会导致元素显示异常。

* Note: 你可能听说过 "rasterize" 这个术语，它通常被用在绘制过程中。绘制过程本身包含两步: ：1）创建一系列draw调用；2）填充像素。 第二步的过程被称作 "rasterization" 。因此当你在DevTools中查看页面的paint记录时，你可以认为它已经包含了 rasterization。（有些浏览器会使用不同的线程来完成这两步，不过这也不是web开发者能控制的了）

#### 虽然在理论上，页面的每一帧都是经过上述的流水线处理之后渲染出来的，但并不意味着页面每一帧的渲染都需要经过上述五个步骤的处理。实际上，对视觉变化效果的一个帧的渲染，有这么三种 常用的 流水线：

1. 1. JS / CSS > 计算样式 > 布局 > 绘制 > 渲染层合并
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/intro/frame-full.jpg)
* 如果你修改一个DOM元素的”layout”属性，也就是改变了元素的样式（比如宽度、高度或者位置等），那么浏览器会检查哪些元素需要重新布局，然后对页面激发一个reflow过程完成重新布局。被reflow的元素，接下来也会激发绘制过程，最后激发渲染层合并过程，生成最后的画面。

2. 2. JS / CSS > 计算样式 > 绘制 > 渲染层合并
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/intro/frame-no-layout.jpg)
* 如果你修改一个DOM元素的“paint only”属性，比如背景图片、文字颜色或阴影等，这些属性不会影响页面的布局，因此浏览器会在完成样式计算之后，跳过布局过程，只做绘制和渲染层合并过程。

3. 3. JS / CSS > 计算样式 > 渲染层合并
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/intro/frame-no-layout-paint.jpg)
* 如果你修改一个DOM元素的“paint only”属性，比如背景图片、文字颜色或阴影等，这些属性不会影响页面的布局，因此浏览器会在完成样式计算之后，跳过布局过程，只做绘制和渲染层合并过程。
*** 

### 6、结合渲染流程怎么优化渲染性能呢？
* 优化JavaScript的执行效率
* 降低样式计算的范围和复杂度
* 避免大规模、复杂的布局
* 简化绘制的复杂度、减少绘制区域
* 优先使用渲染层合并属性、控制层数量
* 对用户输入事件的处理函数去抖动（移动设备）

#### 1. 1. 优化JavaScript的执行效率，具体可以做什么？
#### 页面里的动画效果大多是通过JavaScript触发的。有些是直接修改DOM元素样式属性而产生的，有些则是由数据计算而产生的，比如搜索或排序。错误的执行时机和太长的时间消耗，是常见的导致JavaScript性能低下的原因。你需要尽量减少这两方面对你的JavaScript代码带来的执行性能的影响。

1. -  对于动画效果的实现，避免使用setTimeout或setInterval，请使用requestAnimationFrame。
2. - 把耗时长的JavaScript代码放到Web Workers中去做。
3. - 把DOM元素的更新划分为多个小任务，分别在多个frame中去完成。
4. - 使用Chrome DevTools的Timeline和JavaScript Profiler来分析JavaScript的性能。

#### 使用requestAnimationFrame
* 很多框架和示例代码都是用setTimeout或setInterval来实现页面中的动画效果。这种实现方式的问题是，你在setTimeout或setInterval中指定的回调函数的执行时机是无法保证的。它将在这一帧动画的_某个时间点_被执行，很可能是在帧结束的时候。这就意味这我们可能失去这一帧的信息，也就是发生jank。
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/optimize-javascript-execution/settimeout.jpg)

#### 降低代码复杂度或者使用Web Workers
* JavaScript代码是运行在浏览器的主线程上的。与此同时，浏览器的主线程还负责样式计算、布局，甚至绘制（多数情况下）的工作。可以想象，如果JavaScript代码运行时间过长，就会阻塞主线程上其他的渲染工作，很可能就会导致帧丢失。
因此，你需要认真规划一下你的JavaScript程序的运行时机和运行耗时。比如，如果你要在一个动画（比如页面滚动）执行过程中运行JavaScript程序，那么理想情况是把这段JavaScript程序的运行耗时控制在3-4毫秒以内。如果长于这个时间，那么就有帧丢失的风险。另一方面，在浏览器空闲的时候，你可以有更多时间来运行JavaScript程序。
大多数情况下，你可以把纯计算工作放到Web Workers中做（如果这些计算工作不会涉及DOM元素的存取）。一般来说，JavaScript中的数据处理工作，比如排序或搜索，一般都适合这种处理方式。

`var dataSortWorker = new Worker("sort-worker.js");
dataSortWorker.postMesssage(dataToSort);
// 主线程已被释放，可继续做其他工作
dataSortWorker.addEventListener('message', function(evt) {
   var sortedData = e.data;
   // Update data on screen...
});`
* 正如前面提到的，并不是所有的JavaScript代码都适合这种方式，因为Web Workers无法访问DOM元素。如果你的JavaScript代码需要存取DOM元素，也就是说必须在主线程上运行，那么可以考虑批处理的方式：把任务细分为若干个小任务，每个小任务耗时很少，各自放在一个requestAnimationFrame中回调运行。（比如进入页面需要同时加载渲染多个动画，可考虑将耗性能的动画切分依次执行，但需确保给用户呈现好的UX/UI）

#### 了解JavaScript的“帧税”
* 对于JavaScript代码的性能分析，最好的方式就是使用Chrom的DevTools。一般来说，通过它你能获取到这些细节：
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/optimize-javascript-execution/low-js-detail.jpg)
* 如发现运行时间很长的JavaScript代码，可开启DevTools中顶部的JavaScript profiler选项（不过此项的运行本身也会消耗 一些性能）因此，确保只有在你需要查看更多运行时细节的时候才开启它。开启这个选项之后，再执行一次页面分析动作，你会看到更多细节：
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/optimize-javascript-execution/high-js-detail.jpg)

#### 避免对JavaScript代码进行微优化
* 对于一个任务，如果换一种实现方式，浏览器的执行速度可以快100倍的话，是非常酷的。比如，读取一个元素的offsetTop属性就比计算它的getBoundingClientRect()要快。但一般情况下，在每一帧中运行的JavaScript代码之中调用这些函数的次数都是有限的。因此，在这些微优化上花再大的精力，整体上JavaScript代码的性能可能也就获得若干毫秒的提升。这是不划算的。
但是，如果你是做一个游戏，或者计算密集型的web应用，那么这条建议可能不适合你。因为你很可能要在一帧中执行很多计算工作，这种情况下需要争取做一切可能的性能优化。

简而言之：慎用微优化。因为一般来说它对你的web应用效果不大。
***

#### 2. 2. 降低样式计算的范围和复杂度，具体可以做什么？
* 添加或移除一个DOM元素、修改元素属性和样式类、应用动画效果等操作，都会引起DOM结构的改变，从而导致浏览器需要重新计算每个元素的样式、对页面或其一部分重新布局（多数情况下）。这就是所谓的样式计算。

1. - 降低样式选择器的复杂度；使用基于class的方式，比如BEM。（BEM代表块（Block），元素（Element），修饰符（Modifier））
2. - 减少需要执行样式计算的元素的个数。

* 计算样式的第一步是创建一套匹配的样式选择器，浏览器就是靠它们来对一个元素应用样式的。
* 第二步是根据匹配的样式选择器来获取对应的具体样式规则，计算出最终具体有哪些样式是要应用在DOM元素上的。在Blink（Chrome和Opera的渲染引擎）中，至少从现在来看，以上两步在时间消耗上是差不多的。

##### 降低样式选择器的复杂度
* 最简单的情况是，你在CSS中仅使用一个class就能对一个DOM元素指定具体样式规则：
`.title {
  /* styles */
}`
* 但是，随着项目的发展，很可能会有越来越复杂的CSS，最终你可能写出这样的样式选择器：
`.box:nth-last-child(-n+1) .title {
  /* styles */
}`
* 对于这种样式选择器，为了弄清楚究竟要不要对一个DOM元素使用这个样式，浏览器必须要确认“这个元素是不是有一个值为title的class属性？同时该元素还有一个父元素，这个父元素正好是一个值为box属性的元素的倒数第（-n+1）个子元素？”。这个确认过程看上去就觉得麻烦，真正计算起来也非常耗时间。换个方式，我们可以这样定义这个样式选择器，达到的效果一样，但效率更高：
`.final-box-title {
  /* styles */
}`

##### 减少需要执行样式计算的元素的个数
* 另一个性能问题，也是_更重要的因素_，就是元素样式发生改变时的样式计算量。
一般来说在最坏的情况下，样式计算量 = 元素个数 x 样式选择器个数。因为对每个元素最少需要检查一次所有的样式，以确认是否匹配。
* Note: 在过去，如果你修改了body元素的class属性，那么页面里所有元素都要重新计算样式。幸运的是，在某些现代的浏览器中不再这样做了。他们会对每个DOM元素维护一个独有的样式规则小集合，如果这个集合发生改变，才重新计算该元素的样式。也就是说，某个元素样式的改变不一定会导致对其他所有元素重新计算样式，得看这个元素在DOM树中的位置、具体是什么样式发生改变。

##### 评估样式计算的成本
* 使用Chrome DevTools的Timeline功能，录制一段页面操作。可看到类似如下图：
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/reduce-the-scope-and-complexity-of-style-calculations/long-running-style.jpg)
* 顶部的横线表示该页面每秒渲染的帧数，如果你看到有柱状条超过了下面的那条横线，也就是表示60fps的那条线，那就说明你的页面里有运行时间过长的帧。
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/reduce-the-scope-and-complexity-of-style-calculations/frame-selection.jpg)
* 如果页面在与用户交互的过程（比如页面滚动）中有运行时间过长的帧，那么我们就得对这些帧好好分析一下了。
如果你看到了很高的紫色柱状条，就像下图所示。那么点击那个紫色条，你会看到更多细节信息。
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/reduce-the-scope-and-complexity-of-style-calculations/style-details.jpg)
* 在细节信息中，我们可以看到一个耗时很长的样式计算事件，该事件的执行耗时超过了18毫秒。不巧的是，它正好是在页面滚动过程中发生的，因此给用户带来了一个很明显的卡顿效果。
* 再点击一下JavaScript事件，你就会看到一个JavaScript事件调用栈。在这个栈中你能准确找到是哪个JavaScript事件触发了样式改动。另外，你还能看到这个样式改动影响到的元素个数（在本示例中这个数字超过400）、样式计算耗时多久。这些信息有助于你寻找改进代码的方法。
***

#### 3. 3. 避免大规模、复杂的布局，具体可以做什么？
* 布局，就是浏览器计算DOM元素的几何信息的过程：元素大小和在页面中的位置。每个元素都有一个显式或隐式的大小信息，决定于其CSS属性的设置、或是元素本身内容的大小、抑或是其父元素的大小。在Blink/WebKit内核的浏览器和IE中，这个过程称为布局。在基于Gecko的浏览器（比如Firefox）中，这个过程称为Reflow。虽然称呼不一样，但二者在本质上是一样的。
1. - 布局通常是在整个文档范围内发生
2. - 需要布局的DOM元素的数量直接影响到性能；应该尽可能避免触发布局
3. - 分析页面布局模型的性能；新的Flexbox比旧的Flexbox和基于浮动的布局模型更高效
4. - 避免强制同步布局事件的发生；对于元素的样式属性值，要先读再写
* 与样式计算类似，布局的时间消耗主要在于
1. 1. 需要布局的DOM元素的数量
2. 2. 布局过程的复杂程度

##### 尽可能避免触发布局
* 当你修改了元素的样式属性之后，浏览器会将会检查为了使这个修改生效是否需要重新计算布局以及更新渲染树。对于DOM元素的“几何属性”的修改，比如width/height/left/top等，都需要重新计算布局。

![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/avoid-large-complex-layouts-and-layout-thrashing/big-layout.jpg)
* 我们再仔细分析一下上面的例子，会发现布局耗费的时间超过20毫秒。前面已经说过，为了保障流畅的动画效果，我们需要控制每一帧的时间消耗在16毫秒以内，而现在这个消耗显然太长了。我们还可以看到其他一些细节，比如布局树的大小（此例中为1618个节点）、需要布局的DOM节点数量。

##### 使用flexbox替代老的布局模型
* 下图显示了对页面中1300个盒对象使用浮动布局的时间消耗分析。当然这个例子有点极端，因为它只用了一种定位方式，而在大多数实际应用中会混用多种定位方式。
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/avoid-large-complex-layouts-and-layout-thrashing/layout-float.jpg)
* 下图是使用Flexbox布局方式的时间消耗图：
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/avoid-large-complex-layouts-and-layout-thrashing/layout-flex.jpg)
* 在任何情况下，不管是是否使用Flexbox，你都应该努力避免同时触发所有布局，特别在页面对性能敏感的时候（比如执行动画效果或页面滚动时）

##### 避免强制同步布局事件的发生
* 将一帧画面渲染到屏幕上的处理顺序如下所示：
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/avoid-large-complex-layouts-and-layout-thrashing/frame.jpg)
* 首先是执行JavaScript脚本，_然后_是样式计算，_然后_是布局。但是，我们还可以强制浏览器在执行JavaScript脚本之前先执行布局过程，这就是所谓的强制同步布局。
* 首先你得记住，在JavaScript脚本运行的时候，它能获取到的元素样式属性值都是上一帧画面的，都是旧的值。因此，如果你想在这一帧开始的时候，读取一个元素（暂且称其为“box”）的height属性，你可以会写出这样的JavaScript代码：
`requestAnimationFrame(logBoxHeight);

function logBoxHeight() {
  // 获取像素对象的高度
  console.log(box.offsetHeight);
}`
* 如果你在读取height属性之前，修改了box的样式，那么可能就会有问题了：
`function logBoxHeight() {

  box.classList.add('super-big');

  // Gets the height of the box in pixels
  // and logs it out.
  console.log(box.offsetHeight);
}`
* 现在，为了给你返回box的height属性值，浏览器必须_首先_应用box的属性修改（因为对其添加了super-big样式），_接着_执行布局过程。在这之后，浏览器才能返回正确的height属性值。但其实我们可以避免这个不必要且耗费昂贵的布局过程。
为了避免触发不必要的布局过程，你应该首先批量读取元素样式属性（浏览器将直接返回上一帧的样式属性值），然后再对样式属性进行写操作。

##### 避免快速连续的布局
* 还有一种情况比强制同步布局更糟：连续快速的多次执行它。我们看看这段代码：
`function resizeAllParagraphsToMatchBlockWidth() {

  // Puts the browser into a read-write-read-write cycle.
  for (var i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.width = box.offsetWidth + 'px';
  }
}`
* 这段代码对一组段落标签执行循环操作，设置<p>标签的width属性值，使其与box元素的宽度相同。看上去这段代码是OK的，但问题在于，在每次循环中，都读取了box元素的一个样式属性值，然后立即使用该值来更新<p>元素的width属性。在下一次循环中读取box元素offsetwidth属性的时候，浏览器必须先使得上一次循环中的样式更新操作生效，也就是执行布局过程，然后才能响应本次循环中的样式读取操作。也就意味着，布局过程将在_每次循环_中发生。

* 我们使用_先读后写_的原则，来修复上述代码中的问题：
`// Read.
var width = box.offsetWidth;

function resizeAllParagraphsToMatchBlockWidth() {
  for (var i = 0; i < paragraphs.length; i++) {
    // Now write.
    paragraphs[i].style.width = width + 'px';
  }
}`
***

#### 4. 4. 简化绘制的复杂度、减小绘制区域，具体可以做什么？
* 绘制，是填充像素的过程，这些像素将最终显示在用户的屏幕上。通常，这个过程是整个渲染流水线中耗时最长的一环，因此也是最需要避免发生的一环。
1. - 除了transform和opacity之外，修改任何属性都会触发绘制
2. - 一般情况下，绘制是整个渲染流水线中代价最高的环节，要尽可能避免它
3. - 通过渲染层提升和仔细规划动画渲染来减小绘制区域
4. - 使用Chrome DevTools的来分析绘制复杂度和时间消耗；尽可能降低这些指标

##### 使用Chrome DevTools来迅速定位绘制过程中的性能瓶颈
* 使用Chrome DevTools能够迅速定位出当前页面中正在进行绘制的区域。打开DevTools，按下键盘的ESC键。在弹出的面板中，选中rendering选项卡，然后选中“Show paint rectangles”：
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/simplify-paint-complexity-and-reduce-paint-areas/show-paint-rectangles.jpg)
* 打开了Chrome的这个选项之后，每当页面中有绘制发生时，屏幕上就会闪现绿色的方框。如果你看到绿色方框覆盖了整个屏幕，或者覆盖了一些你觉得不应该发生绘制的区域，那么很可能这次绘制是可以被优化的，你就需要看看这次绘制的更多细节了。
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/simplify-paint-complexity-and-reduce-paint-areas/show-paint-rectangles-green.jpg)

* 打开Timeline中的Paint，会有更多性能细节展现出来。在某一帧的记录上点击paint记录，你就会看到这一帧的绘制分析结果：
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/simplify-paint-complexity-and-reduce-paint-areas/paint-profiler-button.jpg)
* 点击paint profiler，会打开一个视图，里面会显示绘制了哪些元素、花了多长时间、以及每个具体的paint调用：
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/simplify-paint-complexity-and-reduce-paint-areas/paint-profiler.jpg)
* 这个分析器能让你了解绘制区域和绘制复杂度（体现为花费了多长时间），这两个方面正好是你可以对绘制做优化的地方（当然我们首先得努力避免绘制的发生，在无法避免的情况下才对绘制做优化）

##### 提升移动或渐变元素的绘制层
* 绘制并非总是在内存中的单层画面里完成的。实际上，浏览器在必要时将会把一帧画面绘制成多层画面，这种处理方式和思想跟图像处理软件（比如Sketch/GIMP/Photoshop）是一致的，它们都是可以在图像中的某个单个图层上做操作，最后合并所有图层得到最终的图像。
* 在页面中创建一个新的渲染层的最好方式就是使用CSS属性will-change，Chrome/Opera/Firefox都支持该属性。同时再与transform属性一起使用，就会创建一个新的组合层：
`.moving-element {
  will-change: transform;
}`
* 对于那些目前还不支持will-change属性、但支持创建渲染层的浏览器，比如Safari和Mobile Safari，你可以使用一个3D transform属性来强制浏览器创建一个新的渲染层：
`.moving-element {
  transform: translateZ(0);
}`

##### 减少绘制区域
* 有时候尽管把元素提升到了一个单独的渲染层，渲染工作依然是必须的。渲染过程中一个比较有挑战的问题是，浏览器会把两个相邻区域的渲染任务合并在一起进行，这将导致整个屏幕区域都会被绘制。比如，你的页面顶部有一个固定位置的header，而此时屏幕底部有某个区域正在发生绘制的话，整个屏幕都将会被绘制。
* Note: 在DPI较高的屏幕上，固定定位的元素会自动地被提升到一个它自有的渲染层中。但在DPI较低的设备上却并非如此，我们需要手动实现渲染层的提升。

##### 简化绘制的复杂度
* 在绘制所涉及的一些问题中，有些问题是相对更耗费昂贵的。比如，绘制一个blur效果（比如阴影）就比绘制其他效果（比如一个红色方框）更费时。然而，在CSS方面，这些问题并非都是显而易见的：background: red和box-shadow: 0, 4px, 4px, rgba(0,0,0,0.5);可能看上去在性能方面没有太大的差别，但事实却并非如此。
***

#### 5. 5. 优先使用渲染层合并属性、控制层数量，具体可以做什么？
1. - 只使用transform/opacity来实现动画效果
2. - 用will-change/translateZ属性把动画元素提升到单独的渲染层中
3. - 避免滥用渲染层提升：更多的渲染层需要更多的内存和更复杂的管理
* 在这部分内容中有两个关键点：需要管理的渲染层的数量、实现动画效果的样式属性。

##### 使用transform/opacity实现动画效果
* 从性能方面考虑，最理想的渲染流水线是没有布局和绘制环节的，只需要做渲染层的合并即可：
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/stick-to-compositor-only-properties-and-manage-layer-count/frame-no-layout-paint.jpg)
* 为了实现上述效果，你需要对元素谨慎使用会被修改的样式属性，只能使用那些仅触发渲染层合并的属性。目前，只有两个属性是满足这个条件的：transforms和opacity：
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/stick-to-compositor-only-properties-and-manage-layer-count/safe-properties.jpg)
* 上图底部的那句提示语的意思是，应用了transforms/opacity属性的元素必须_独占一个渲染层_。为了对这个元素创建一个自有的渲染层，你必须提升该元素。接下来我们来看看如何把一个元素提升到单独的渲染层中。

##### 提升动画效果中的元素
* 上文中提到过新建渲染层：
`.moving-element {
  will-change: transform;
}`

##### 管理渲染层、避免过多数量的层
`* {
  will-change: transform;
  transform: translateZ(0);
}`
* 上面这段代码意味着你想对页面中每个元素都创建一个自有的渲染层。问题是，创建一个新的渲染层并不是免费的，它得消耗额外的内存和管理资源。实际上，在内存资源有限的设备上，由于过多的渲染层来带的开销而对页面渲染性能产生的影响，甚至远远超过了它在性能改善上带来的好处。由于每个渲染层的纹理都需要上传到GPU处理，因此我们还需要考虑CPU和GPU之间的带宽问题、以及有多大内存供GPU处理这些纹理的问题。

##### 使用Chrome DevTools来了解页面中的渲染层的情况
* 在Timeline面板中开启Paint选项，开启之后，就可以对页面进行渲染性能采样了。当采样过程结束之后，你就能在frames-per-second横条上点击每一个单独的帧，看到每个帧的渲染细节：
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/stick-to-compositor-only-properties-and-manage-layer-count/frame-of-interest.jpg)
* 点击之后，你就会在视图中看到一个新的选项卡：Layers
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/stick-to-compositor-only-properties-and-manage-layer-count/layer-tab.jpg)
* 点击这个Layers选项卡，你会看到一个新的视图。在这个视图中，你可以对这一帧中的所有渲染层进行扫描、缩放等操作，同时还能看到每个渲染层被创建的原因
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/stick-to-compositor-only-properties-and-manage-layer-count/layer-view.jpg)
* 有了这个视图，你就能知道页面中到底有多少个渲染层。如果你在对页面滚动或渐变效果的性能分析中发现渲染层的合并过程耗费了太多时间（相对于4-5毫秒的预期），那么你可以从这个视图里看到页面中有多少个渲染层，它们为何被创建，从而对渲染层的数量进行优化。
***

#### 6. 6. 对用户输入事件的处理去抖动，具体可以做什么？
1. - 避免使用运行时间过长的输入事件处理函数，它们会阻塞页面的滚动
2. - 避免在输入事件处理函数中修改样式属性
3. - 对输入事件处理函数去抖动，存储事件对象的值，然后在requestAnimationFrame回调函数中修改样式属性

##### 避免使用运行时间过长的输入事件处理函数
* 在理想情况下，当用户在设备屏幕上触摸了页面上某个位置时，页面的渲染层合并线程将接收到这个触摸事件并作出响应，比如移动页面元素。这个响应过程是不需要浏览器主线程的参与的，也就是说，不会导致JavaScript、布局和绘制过程的发生
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/debounce-your-input-handlers/compositor-scroll.jpg)

* 但是，如果你对这个被触摸的元素绑定了输入事件处理函数，比如touchstart、touchmove或者touchend，那么渲染层合并线程必须等待这些被绑定的处理函数的执行完毕之后才能被执行。因为你可能在这些处理函数中调用了类似preventDefault()的函数，这将会阻止输入事件（touch/scroll等）的默认处理函数的运行。事实上，即便你没有在事件处理函数中调用preventDefault()，渲染层合并线程也依然会等待，也就是用户的滚动页面操作被阻塞了，表现出的行为就是滚动出现延迟或者卡顿（帧丢失）
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/debounce-your-input-handlers/ontouchmove.jpg)
* 简而言之，你必须确保对用户输入事件绑定的任何处理函数都能够快速执行完毕，以便腾出时间来让渲染层合并线程来完成它的工作

##### 避免在输入事件处理函数中修改样式属性
* 输入事件处理函数，比如scroll/touch事件的处理，都会在requestAnimationFrame之前被调用执行。
* 因此，如果你在上述输入事件的处理函数中做了修改样式属性的操作，那么这些操作会被浏览器暂存起来。然后在调用requestAnimationFrame的时候，如果你在一开始做了读取样式属性的操作，那么根据“避免大规模、复杂的布局”中所述，你将会触发浏览器的强制同步布局过程！
![Pics](https://developers.google.com/web/fundamentals/performance/rendering/images/debounce-your-input-handlers/frame-with-input.jpg)

##### 对滚动事件处理函数去抖动
* 有一个方法能同时解决上面的两个问题：对样式修改操作去抖动，控制其仅在下一次requestAnimationFrame中发生：
`function onScroll (evt) {

  // Store the scroll value for laterz.
  lastScrollY = window.scrollY;

  // Prevent multiple rAF callbacks.
  if (scheduledAnimationFrame)
    return;

  scheduledAnimationFrame = true;
  requestAnimationFrame(readAndUpdatePage);
}

window.addEventListener('scroll', onScroll);`
* 这么做还有一个额外的好处，就是能使你的事件处理函数变得轻量。这很关键，因为它能使包含复杂计算代码的页面也能快速响应scroll/touch事件！
***

### 7、录制过程中截屏
* 选中Screenshots后录制，概览窗口下方会展现截屏短片，鼠标移上会有放大展示。鼠标从左移到右，可模仿记录过程的动画。
***

### 8、Profile JavaScript
* 选中JS Profile后录制，图表中会记录每个js函数的调用耗时详情
***

### 9、Profile painting
* 选中Paint后录制，会对paint的事件有更深入的详情展示。当点击一个paint事件时，在Details栏 会出现一个paint profiler新tab标签，以颗粒状展示更多详情。
![Pics](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/imgs/paint-profiler.png)
***

### 10、Rendering settings
* 打开DevTools菜单，按esc开启或关闭该栏。选择More tools > Rendering settings进入rendering settings页面，对诊断paint问题有所帮助。
![Pics](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/imgs/rendering-settings.png)
***

### 11、Search records
* 当想聚焦多种事件中的一种时，可Ctrl+F搜索，例如搜HTML。搜索只作用于选取的这个时间段。
***

### 12、Zoom in on a Timeline section
* 点击概览区域，可聚焦某一时间段的性能展现，其他图会跟随联动。
***

### 13、Save and load recordings
* 可供保存和读取Timeline数据
***

## 二、Web性能测试工具：
#### 基于网页分析工具：
* 1. 阿里测
* 2. 百度应用性能检测中心
* 3. Web PageTest

#### 基于浏览器分析工具：
* 1. Chrome自带工具F12
* 2. Firebug（是firefox中最为经典的开发工具插件）
* 3. Page Speed（google）

#### 评分等级指标：
* 1. 确保少量的HTTP请求（合并JS，CSS图片等）
* 2. 使用内容分发CDN
* 3. 设置过期的HTTP Header.设置Expires Header可以将脚本, 样式表, 图片, Flash等缓存在浏览器的Cache中。
* 4. 使用gzip压缩
* 5. 将CSS放置html头部
* 6. 将JavaScript放置底部
* 7. Avoid CSS expressions
* 8. 使用外部引用JavaScript与CSS
* 9. 减少DNS解析
* 10. 压缩JavaScript和CSS
* 11. 避免URL重定向。URL redirects are made using HTTP status codes 301 and 302. They tell the browser to go to another location.
* 12. 删除重复JavaScript和CSS
* 13. 设置ETags
