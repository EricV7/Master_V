#Object

##d3.keys(object)

###返回对象的属性名组成的数组，使用for...in

```javascript
var object = {"value": "hello", "id": "hello"}
d3.keys(object); // ["value", "id"]
```

##d3.values(object)

###返回对象的属性值组成的数组

```javascript
var object = {"value": "hello", "id": "hello"}
```
d3.values(object);`

##d3.entries(object)

```javascript
d3.entries({foo: 42, bar: true}); // [{key: "foo", value: 42}, {key: "bar", value: true}]`
```
#Maps

###特点

>键值都会被强制转化为字符串

##d3.map([object[, key]])

###object可以是对象、数组和map，key是一个设置键的函数

```javascript
var object = {"value": "hello", "id": "hi"}
```
d3.map(object);

d3.map([{name: "foo"}, {name: "bar"}]);

d3.map([{name: "foo"}, {name: "bar"}], function(d) { return d.name; });`

##map.has(key)

##map.get(key)

##map.set(key, value)

>没有的话创建，有的话覆盖

```javascript
var hello = {"value": "hello"}
```
var map = d3.map();

map.set(hello, hello);

map.get(hello);

map.get('[object Object]');

map.set(hello, 1);

map.get(hello);`

##map.remove(key)

###如果键值存在，则移除并且返回true，没有的话返回false

##map.clear()

###清空

##map.keys()

##map.entries()

```javascript
var hello = {"value": "hello"}
var map = d3.map();
map.set(hello, hello);
map.set(1, 1);
map.set('hi', 'hi');
map.keys();
map.entries();
```
##map.each(function)

```javascript
map.each(function(value, key, map) {console.log(value, key, map)});
```

##map.empty()

###判断是否为空

##map.size()

###返回数量

#Sets

##特点

>值会被强制转化为字符串
>实现的时候其实使用的就是Map，是键和值相同的特殊Map

##d3.set([array[, accessor]])

```javascript
var hello = {"value": "hello"}
var array = [1, "hi", false, hello];
var set = d3.set(array);`
```
###set.has(value)

###set.add(value)

###set.remove(value)

###set.clear()

###set.values()

###set.each(function)

###set.each(function(value, value, set) {console.log(value, value, set)})
###set.empty()

###set.size()

#Nests

##d3.nest()

###nest.key(key)

###nest.sortKeys(key)

###nest.sortValues(comparator)

>以上用于创建一个nest

###nest.rollup(function)

>替换叶节点

###nest.map(array)

###nest.object(array)

###nest.entries(array)
