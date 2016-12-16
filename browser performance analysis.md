## 一、浏览器加载过程：
### 1、建立连接过程

#### (1) 浏览器查找域名的IP地址
#### (2) 浏览器给web服务器发送一个HTTP请求
#### (3) 服务器发送永久重定向响应
#### (4) 浏览器跟踪重定向地址
#### (5) 服务器“处理”请求
#### (6) 服务器发回一个HTML响应
### 2、浏览器渲染

#### 解析HTML
↓ HTML代码转化成DOM
构建DOM树
↓ CSS代码转化成CSSOM（CSS Object Model）,结合DOM和CSSOM，生成一棵渲染树（包含每个节点的视觉信息）
渲染树构建
↓ 生成布局（layout），即将所有渲染树的所有节点进行平面合成
渲染树布局
↓ 将布局绘制（paint）在屏幕上
绘制渲染树

以下三种情况，会导致网页重新渲染。
> 修改DOM
  修改样式表
  用户事件（比如鼠标悬停、页面滚动、输入框键入文字、改变窗口大小等等）
  
重新渲染，就需要重新生成布局和重新绘制。前者叫做"重排"（reflow），后者叫做"重绘"（repaint）。
需要注意的是，"重绘"不一定需要"重排"，比如改变某个网页元素的颜色，就只会触发"重绘"，不会触发"重排"，因为布局没有改变。但是，"重排"必然导致"重绘"，比如改变一个网页元素的位置，就会同时触发"重排"和"重绘"，因为布局改变了。  