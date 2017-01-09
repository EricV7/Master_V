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
### 3、刷新率

##### 一秒之间能够完成多少次重新渲染，这个指标就被称为"刷新率"，英文为FPS（frame per second）。60次重新渲染，就是60FPS。这意味着，一秒之内进行60次重新渲染，每次重新渲染的时间不能超过16.66毫秒。
##### 网页动画的每一帧（frame）都是一次重新渲染。每秒低于24帧的动画，人眼就能感受到停顿。一般的网页动画，需要达到每秒30帧到60帧的频率，才能比较流畅。如果能达到每秒70帧甚至80帧，就会极其流畅。

> 如果想达到60帧的刷新率，就意味着JavaScript线程每个任务的耗时，必须少于16毫秒。一个解决办法是使用Web Worker，主线程只用于UI渲染，然后跟UI渲染不相干的任务，都放在Worker线程。

***
### 4、开发者工具的Timeline面板
##### Timeline面板概述
* 控制栏 - 控制录制等相关信息
* 概况栏 - 页面性能概况
* 火焰图 - CPU性能的形象展现（三条虚线：蓝-解析DOM文本的事件；绿-开始绘制的时间；红-加载脚本等的事件）
* 损耗性能详情部分（后面详细介绍）
![Pics](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/imgs/timeline-annotated.png)

##### 工具栏：
* JS Profile：开启时，绘制图表展现录制过程中每个被调用的函数消耗资源情况
* Paint：开启时，会获取更多绘制相关事件的信息，选中某一绘图函数，开启paint profiler颗粒信息窗口（支持ctrl+F所搜具体事件功能）
* Memory：样式计算和布局，即重排

##### 概览窗口：
1. FPS.（每秒帧数） 绿色bar越高，FPS越高。FPS图表上的红色色块代表长帧动画，可以理解为可供优化的地方；
2. CPU.（CPU资源） 不同类别的事件消耗CPU资源的情况；
3. NET.（网络请求）资源的请求及加载时间；
* 其中，蓝色表示HTML文件；黄色为Scripts文件；紫色为Stylesheets文件；绿色为Media文件；灰色为其他混杂资源（可以理解为浏览器内部c++的一些工作，和前端js以及渲染关系不大，也有说是没有被DevTools感知到的活动）；空白区块：显示刷新周期（display refresh cycles）中的空闲时间段
![Pics](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/imgs/overview-annotated.jpg)

##### 4种颜色表示不同类别事件：
* 蓝色：网络通信和HTML解析
* 黄色：JavaScript执行
* 紫色：样式计算和布局，即重排
* 绿色：重绘

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
Event     | js事件(如mousedown等)
Event     | js事件(如mousedown等)
XHR Ready State Change | 当一个异步请求为就绪状态后触发
XHR Load  | 当一个异步请求完成加载后触发

###### Rendering事件
事件             | 描述    
-------------    | -------------
Invalidate layout   | 当DOM更改导致页面布局失效时触发
Layout   | 页面布局计算执行时触发
Recalculate styleChrome   | 重新计算元素样式时触发
Scroll | 内嵌的视窗滚动时触发 

###### Painting事件
事件             | 描述    
-------------    | -------------
Composite Layers   | Chrome的渲染引擎完成图片层合并时触发
Image Decode   | 一个图片资源完成解码后触发
Image Resize   | 一个图片被修改尺寸后触发
Paint | 合并后的层被绘制到对应显示区域后触发

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

### 5、对于性能的影响





