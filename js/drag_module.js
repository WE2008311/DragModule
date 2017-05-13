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
