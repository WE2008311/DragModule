> 上一周学了闭包和模块，这一周仍然是跟着@波同学，试着封装了一个拖拽模块。过程中经历了一些曲折，最开始我是打算只用style.left的方式，但是这个需要设置position：absolute。可能对代码造成一定影响。虽然CSS的transform会影响兼容，但这里我还是使用了这个属性的translate来完成移动。

##只用style完成的代码

话不多说，直接上代码：

html和css，这里必须设置position，第一次写这段代码的时候忘了，结果尽管JS写对了，效果完全出不来....真是短路了
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>学习</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        #box{
            width: 200px;
            height: 200px;
            background: #6f6;
            font-size: 20px;
            cursor:move;
            position: absolute;
        }
    </style>

</head>
<body>
  <div id="box"></div>
  <script src="js/drag_module.js"></script>
</body>
</html>
```
####重点！！JS

```
;    //这个分号是为了防止其他的模块最后忘记加分号，导致错误。
(function() {
  
  //构造函数，属于每一个实例
  function Drag(selector) {
    this.elem = typeof selector == 'object' ? selector : document.getElementById(selector);
    //鼠标初始位置
    this.startX = 0;
    this.startY = 0;
    //元素初始位置
    this.sourceX = 0;
    this.sourceY = 0;

    this.init();
  }

  //原型，共有的
  Drag.prototype = {
    constructor: Drag,
    init: function() {
      this.setDrag();
    },

    //用于获取元素当前的位置信息
    getPosition: function() {
      var that = this;
      var pos = {};
      pos = {
        x: that.elem.offsetLeft,
        y: that.elem.offsetTop
      };
      return pos;
    },
    //用来设置当前元素的位置
    setPosition: function(pos) {
      this.elem.style.left = pos.x + 'px';
      this.elem.style.top = pos.y + 'px';
    },

    //该方法用来绑定事件
    setDrag: function() {
      var self = this;
      this.elem.addEventListener('mousedown', start, false);

      function start(event) {

        self.startX = event.pageX;
        self.startY = event.pageY;

        var pos = self.getPosition();

        self.sourceX = pos.x;
        self.sourceY = pos.y;

        document.addEventListener('mousemove', move, false);
        document.addEventListener('mouseup', end, false);
      }

      function move(event) {
        //总体思想：鼠标距浏览器距-鼠标距元素距离
        var currentX = event.pageX; //当前的鼠标x位置
        var currentY = event.pageY; //当前的鼠标y位置

        var distanceX = currentX - self.startX; //鼠标移动的距离x
        var distanceY = currentY - self.startY; //鼠标移动的距离y

        self.setPosition({
          x: self.sourceX + distanceX,
          y: self.sourceY + distanceY
        });

      }

      function end(event) {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', end);
      }
    }
  };
  
  //暴露在外
  window.Drag = Drag;
})();


new Drag('box');
```

这段代码是比较好理解的，在一开始看波大神的代码时，对于translate的运用实际上我没看太明白，因为没想到为啥要用到正则......

虽然比较简单，但是我们还是要分析一下这段代码的原理：

1.自执行函数里有一个构造函数Drag（），在构造函数里我们设置的方法和属性时每一个构造函数实例独有的，比如他们的位置信息等。而在原型里的有三个方法：分别是获取元素位置信息的getPosition（）、设置元素位置的setPosition（）和绑定事件的setDrag（），这三个因为是公用的，为了节省资源，我们就放在原型里了。

2.这段代码执行的原理是：当鼠标按下时，获取元素初始位置信息sourceX/Y、鼠标初始位置信息startX/Y；当鼠标移动完成时，获取鼠标新的位置currentX/Y，两个鼠标位置相减就能得到鼠标移动的距离distanceX/Y，这同时也是元素移动的距离，然后，我们把这个值赋给元素的style.left/top。元素的拖拽就实现了。

##transform和style的结合

> 由于技术的发展，越来越多的设备开始支持CSS3了，加上style的资源占用的更多，效率方面存在问题，所以我们考虑使用transform。

###浏览器的兼容写法
我们首先在函数Drag（）前加上私有属性：

```
var transform = getTransform();
```
在下面再加上私有方法：

```
function getTransform() {
    var transform = "",
      divStyle = document.createElement('div').style,
      transformArr = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'oTransform'],
      i = 0,
      l = transformArr.length;

    for (; i < l; i++) {
      if (transformArr[i] in divStyle) {
        return transform = transformArr[i];
      }
    }
    return transform;
  }
```
####PS：记住createElement（）这个方法，下次判断浏览器兼容时用得着！
我们还需要在getPosition（）的下面加上一个函数，用同样的形式：

```
getTranslate: function() {
      var val = {};
      var transformValue = document.defaultView.getComputedStyle(this.elem, false)[transform];
      if(transformValue=='none'){
        val={x:0,y:0};
      }else{
        var transformArr = transformValue.match(/-?\d+/g);
        val = {
          x: Number(transformArr[4]),
          y: Number(transformArr[5])
        };
      }


      return val;
    },
```
####PS：之所以要判断transformValue是否为none，是因为在初始化状态是，元素未被设置transform属性，这样正则之后的数组是找不到`[4][5]` 的，所以我们让val的两个属性为0，也就是稍后会成为的transform的translateX和translateY的值。

继续写代码。上面一段我们用来提取translate的X、Y值。看下面一段：

```
getPosition: function() {
      var that = this;
      var pos = {};
      if(transform){
        var val=this.getTranslate();
        pos={
          x:val.x,
          y:val.y
        };
      }else{
        pos = {
          x: that.elem.offsetLeft,
          y: that.elem.offsetTop
        };
      }
      return pos;
    },
```
####注意上面一段代码我们修改的的内容，在这里我们增加了一个判断：即当支持transform属性的浏览器存在时，我们会用transform属性修改元素的值，把之前在getTranslate中得到的x、y赋值给pos的x、y。

在上面一段代码中，我们会根据浏览器的情况，用不同的方法取到相同的值，val的值来自getTranslate（），是我们从元素的transform中提取出来的。同样，在下面的setPosition（）中，我们也要设置if判断。

```
setPosition: function(pos) {
      if (transform) {
        this.elem.style[transform] = 'translate(' + pos.x + 'px' + ',' + pos.y + 'px)';
      } else {
        this.elem.style.left = pos.x + 'px';
        this.elem.style.top = pos.y + 'px';
      }
    },
```
这一段没什么好讲的，就是用不同的形式赋值而已。

到这里，这个模块就封装完毕了。接下来让我们看看完整代码：

```
;
(function() {
  //私有属性
  var transform = getTransform();
  //构造函数，属于每一个实例
  function Drag(selector) {
    this.elem = typeof selector == 'object' ? selector : document.getElementById(selector);
    //鼠标初始位置
    this.startX = 0;
    this.startY = 0;
    //元素初始位置
    this.sourceX = 0;
    this.sourceY = 0;

    this.init();
  }

  //原型，共有的
  Drag.prototype = {
    constructor: Drag,
    init: function() {
      this.setDrag();
    },

    //用于获取元素当前的位置信息
    getPosition: function() {
      var that = this;
      var pos = {};
      if(transform){
        var val=this.getTranslate();
        pos={
          x:val.x,
          y:val.y
        };
      }else{
        pos = {
          x: that.elem.offsetLeft,
          y: that.elem.offsetTop
        };
      }
      return pos;
    },

    //获取translate值
    getTranslate: function() {
      var val = {};
      var transformValue = document.defaultView.getComputedStyle(this.elem, false)[transform];
      if(transformValue=='none'){
        val={x:0,y:0};
      }else{
        var transformArr = transformValue.match(/-?\d+/g);
        val = {
          x: Number(transformArr[4]),
          y: Number(transformArr[5])
        };
      }


      return val;
    },
    //用来设置当前元素的位置
    setPosition: function(pos) {
      if (transform) {
        this.elem.style[transform] = 'translate(' + pos.x + 'px' + ',' + pos.y + 'px)';
      } else {
        this.elem.style.left = pos.x + 'px';
        this.elem.style.top = pos.y + 'px';
      }
    },

    //该方法用来绑定事件
    setDrag: function() {
      var self = this;
      this.elem.addEventListener('mousedown', start, false);

      function start(event) {

        self.startX = event.pageX;
        self.startY = event.pageY;

        var pos = self.getPosition();

        self.sourceX = pos.x;
        self.sourceY = pos.y;

        document.addEventListener('mousemove', move, false);
        document.addEventListener('mouseup', end, false);
      }

      function move(event) {
        //总体思想：鼠标距浏览器距-鼠标距元素距离
        var currentX = event.pageX; //当前的鼠标x位置
        var currentY = event.pageY; //当前的鼠标y位置

        var distanceX = currentX - self.startX; //鼠标移动的距离x
        var distanceY = currentY - self.startY; //鼠标移动的距离y

        self.setPosition({
          x: self.sourceX + distanceX,
          y: self.sourceY + distanceY
        });

      }

      function end(event) {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', end);
      }
    }
  };
  //私有方法，用来获取transform的兼容写法
  function getTransform() {
    var transform = "",
      divStyle = document.createElement('div').style,
      transformArr = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'oTransform'],
      i = 0,
      l = transformArr.length;

    for (; i < l; i++) {
      if (transformArr[i] in divStyle) {
        return transform = transformArr[i];
      }
    }
    return transform;
  }
  //暴露在外
  window.Drag = Drag;
})();


new Drag('box');

```
