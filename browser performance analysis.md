## 一、浏览器加载、渲染：
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

### 4、开发者工具的Timeline面板
##### Timeline面板概述
* 控制栏 - 控制录制等相关信息
* 概况栏 - 页面性能概况
* 火焰图 - CPU性能的形象展现（三条虚线：蓝-解析DOM文本的事件；绿-开始绘制的时间；红-加载脚本等的事件）
* 损耗性能详情部分（后面详细介绍）{#index}
![Pics](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/imgs/timeline-annotated.png)

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

##### 4种颜色表示不同类别事件：
* 蓝色：网络通信和HTML解析
* 黄色：JavaScript执行
* 紫色：样式计算和布局，即重排
* 绿色：重绘
* 灰色：混杂的资源

##### 基本使用方法：
* 录制一段页面加载过程 或 用户操作过程的记录；
* 观察概览窗口中的 FPS, CPU, and network 区域；
* 点击chart图中的事件以查看其相关细节；
* 将时间窗口聚焦某一部分，能更好地进行分析。
To make a recording of a page load, open the Timeline panel, open the page that you want to record, and then reload the page. The Timeline panel automatically records the page reload.
To make a recording of a page interaction, open the Timeline panel, then start the recording by pressing the Record button (record button) or by typing the keyboard shortcut Cmd+E (Mac) or Ctrl+E (Windows / Linux). The Record button turns red during a recording. Perform your page interactions, and then press the Record button or type the keyboard shortcut again to stop the recording.
When the recording is finished, DevTools guesses what portion of the recording is most relevant to you, and automatically zooms to that portion.

##### 录制tips：
* 录制时长尽可能短，降低分析难度
* 尽量避免其他操作，减少分析复杂性
* 将浏览器缓存置成disable，避免不同的录制脚本互相影响
* 关闭其他扩展程序，会对录制脚本的分析有干扰
* 截屏功能可记录关键时刻，鼠标从左移向右，可作为模拟动画的幻灯片
* 录制工具比较智能，结束时，会猜测和页面操作最相关的部分，并切换到该区域。

##### 查看录制详情：
* 当选中火焰图中的某事件时，详情界面会展示该事件相关的额外信息；
![Pics](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/imgs/details-pane.png)
* Summary：所有事件类型
* Aggregated time：当事件是嵌套事件时，各类型事件的时耗
* Call Stack：含有子事件的事件 的各类型时耗
* CPU time：事件占用CPU的时耗
* Details：该事件的其他细节
* Duration(at time-stamp)：该事件及其子事件执行完的时间
* Self time：该事件（不包括其子事件）耗时
* Used Heap Size：事件执行时所占用的内存

##### TimeLine中的事件汇总：

###### Loading事件
事件             | 描述    
-------------    | -------------
Parse HTML       | 浏览器执行HTML解析 
Finish Loading   | 网络请求完毕事件
Receive Data     | 请求的响应数据到达事件，如果响应数据很大（拆包），可能会多次触发该事件
Receive Response | 响应头报文到达时触发    
Send Request     | 发送网络请求时触发       

###### Scripting事件
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

###### Rendering事件
事件             | 描述    
-------------    | -------------
Invalidate layout   | 当DOM更改导致页面布局失效时触发
Layout   | 页面布局计算执行时触发
Recalculate style   | Chrome重新计算元素样式时触发
Scroll | 内嵌的视窗滚动时触发 

###### Painting事件
事件             | 描述    
-------------    | -------------
Composite Layers   | Chrome的渲染引擎完成图片层合并时触发
Image Decode   | 一个图片资源完成解码后触发
Image Resize   | 一个图片被修改尺寸后触发
Paint | 合并后的层被绘制到对应显示区域后触发

###### Painting事件
事件             | 描述    
-------------    | -------------
Location   | 绘制事件对象的坐标，及布局
Dimensions   | 绘制事件对象的大小

##### 右键功能：
* 保存、读取Timeline录制数据

***
以下三种情况，会导致网页重新渲染。
* 修改DOM
* 修改样式表
* 用户事件（比如鼠标悬停、页面滚动、输入框键入文字、改变窗口大小等等）
  
##### 重新渲染，就需要重新生成布局和重新绘制。前者叫做"重排"（reflow），后者叫做"重绘"（repaint）。
##### 需要注意的是，"重绘"不一定需要"重排"，比如改变某个网页元素的颜色，就只会触发"重绘"，不会触发"重排"，因为布局没有改变。但是，"重排"必然导致"重绘"，比如改变一个网页元素的位置，就会同时触发"重排"和"重绘"，因为布局改变了。 

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


#### 3. 3. 避免大规模、复杂的布局，具体可以做什么？






#### 4. 4. 优化JavaScript的执行效率，具体可以做什么？





#### 5. 5. 优化JavaScript的执行效率，具体可以做什么？





#### 6. 6. 优化JavaScript的执行效率，具体可以做什么？








