> ��һ��ѧ�˱հ���ģ�飬��һ����Ȼ�Ǹ���@��ͬѧ�����ŷ�װ��һ����קģ�顣�����о�����һЩ���ۣ��ʼ���Ǵ���ֻ��style.left�ķ�ʽ�����������Ҫ����position��absolute�����ܶԴ������һ��Ӱ�졣��ȻCSS��transform��Ӱ����ݣ��������һ���ʹ����������Ե�translate������ƶ���

##ֻ��style��ɵĴ���

������˵��ֱ���ϴ��룺

html��css�������������position����һ��д��δ����ʱ�����ˣ��������JSд���ˣ�Ч����ȫ������....���Ƕ�·��
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ѧϰ</title>
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
####�ص㣡��JS

```
;    //����ֺ���Ϊ�˷�ֹ������ģ��������Ǽӷֺţ����´���
(function() {
  
  //���캯��������ÿһ��ʵ��
  function Drag(selector) {
    this.elem = typeof selector == 'object' ? selector : document.getElementById(selector);
    //����ʼλ��
    this.startX = 0;
    this.startY = 0;
    //Ԫ�س�ʼλ��
    this.sourceX = 0;
    this.sourceY = 0;

    this.init();
  }

  //ԭ�ͣ����е�
  Drag.prototype = {
    constructor: Drag,
    init: function() {
      this.setDrag();
    },

    //���ڻ�ȡԪ�ص�ǰ��λ����Ϣ
    getPosition: function() {
      var that = this;
      var pos = {};
      pos = {
        x: that.elem.offsetLeft,
        y: that.elem.offsetTop
      };
      return pos;
    },
    //�������õ�ǰԪ�ص�λ��
    setPosition: function(pos) {
      this.elem.style.left = pos.x + 'px';
      this.elem.style.top = pos.y + 'px';
    },

    //�÷����������¼�
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
        //����˼�룺�����������-����Ԫ�ؾ���
        var currentX = event.pageX; //��ǰ�����xλ��
        var currentY = event.pageY; //��ǰ�����yλ��

        var distanceX = currentX - self.startX; //����ƶ��ľ���x
        var distanceY = currentY - self.startY; //����ƶ��ľ���y

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
  
  //��¶����
  window.Drag = Drag;
})();


new Drag('box');
```

��δ����ǱȽϺ����ģ���һ��ʼ��������Ĵ���ʱ������translate������ʵ������û��̫���ף���Ϊû�뵽ΪɶҪ�õ�����......

��Ȼ�Ƚϼ򵥣��������ǻ���Ҫ����һ����δ����ԭ��

1.��ִ�к�������һ�����캯��Drag�������ڹ��캯�����������õķ���������ʱÿһ�����캯��ʵ�����еģ��������ǵ�λ����Ϣ�ȡ�����ԭ������������������ֱ��ǻ�ȡԪ��λ����Ϣ��getPosition����������Ԫ��λ�õ�setPosition�����Ͱ��¼���setDrag��������������Ϊ�ǹ��õģ�Ϊ�˽�ʡ��Դ�����Ǿͷ���ԭ�����ˡ�

2.��δ���ִ�е�ԭ���ǣ�����갴��ʱ����ȡԪ�س�ʼλ����ϢsourceX/Y������ʼλ����ϢstartX/Y��������ƶ����ʱ����ȡ����µ�λ��currentX/Y���������λ��������ܵõ�����ƶ��ľ���distanceX/Y����ͬʱҲ��Ԫ���ƶ��ľ��룬Ȼ�����ǰ����ֵ����Ԫ�ص�style.left/top��Ԫ�ص���ק��ʵ���ˡ�

##transform��style�Ľ��

> ���ڼ����ķ�չ��Խ��Խ����豸��ʼ֧��CSS3�ˣ�����style����Դռ�õĸ��࣬Ч�ʷ���������⣬�������ǿ���ʹ��transform��

###������ļ���д��
���������ں���Drag����ǰ����˽�����ԣ�

```
var transform = getTransform();
```
�������ټ���˽�з�����

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
####PS����סcreateElement��������������´��ж����������ʱ�õ��ţ�
���ǻ���Ҫ��getPosition�������������һ����������ͬ������ʽ��

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
####PS��֮����Ҫ�ж�transformValue�Ƿ�Ϊnone������Ϊ�ڳ�ʼ��״̬�ǣ�Ԫ��δ������transform���ԣ���������֮����������Ҳ���`[4][5]` �ģ�����������val����������Ϊ0��Ҳ�����Ժ���Ϊ��transform��translateX��translateY��ֵ��

����д���롣����һ������������ȡtranslate��X��Yֵ��������һ�Σ�

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
####ע������һ�δ��������޸ĵĵ����ݣ�����������������һ���жϣ�����֧��transform���Ե����������ʱ�����ǻ���transform�����޸�Ԫ�ص�ֵ����֮ǰ��getTranslate�еõ���x��y��ֵ��pos��x��y��

������һ�δ����У����ǻ�����������������ò�ͬ�ķ���ȡ����ͬ��ֵ��val��ֵ����getTranslate�����������Ǵ�Ԫ�ص�transform����ȡ�����ġ�ͬ�����������setPosition�����У�����ҲҪ����if�жϡ�

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
��һ��ûʲô�ý��ģ������ò�ͬ����ʽ��ֵ���ѡ�

��������ģ��ͷ�װ����ˡ������������ǿ����������룺

```
;
(function() {
  //˽������
  var transform = getTransform();
  //���캯��������ÿһ��ʵ��
  function Drag(selector) {
    this.elem = typeof selector == 'object' ? selector : document.getElementById(selector);
    //����ʼλ��
    this.startX = 0;
    this.startY = 0;
    //Ԫ�س�ʼλ��
    this.sourceX = 0;
    this.sourceY = 0;

    this.init();
  }

  //ԭ�ͣ����е�
  Drag.prototype = {
    constructor: Drag,
    init: function() {
      this.setDrag();
    },

    //���ڻ�ȡԪ�ص�ǰ��λ����Ϣ
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

    //��ȡtranslateֵ
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
    //�������õ�ǰԪ�ص�λ��
    setPosition: function(pos) {
      if (transform) {
        this.elem.style[transform] = 'translate(' + pos.x + 'px' + ',' + pos.y + 'px)';
      } else {
        this.elem.style.left = pos.x + 'px';
        this.elem.style.top = pos.y + 'px';
      }
    },

    //�÷����������¼�
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
        //����˼�룺�����������-����Ԫ�ؾ���
        var currentX = event.pageX; //��ǰ�����xλ��
        var currentY = event.pageY; //��ǰ�����yλ��

        var distanceX = currentX - self.startX; //����ƶ��ľ���x
        var distanceY = currentY - self.startY; //����ƶ��ľ���y

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
  //˽�з�����������ȡtransform�ļ���д��
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
  //��¶����
  window.Drag = Drag;
})();


new Drag('box');

```
