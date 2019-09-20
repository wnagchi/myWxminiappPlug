# 页面中引用
 ```javascript

var animate = require('../../utils/animate.js');

```
# show(this,param,time)
## 显示 
#### *参数1：this；
#### *参数2 param：定义的动画名param 
#### 参数3 time:动画执行时间 。 默认值400ms
#### wxml中调用方法：animation='{{param}}' 
#### *使用的元素需要先用hide方法隐藏 
```
<view animation='{{param}}'></view>
``` 
```javascript
onReady:function(){
    let that=this;
    animate.hide(that,that.data.param,1);//使用的元素需要先用hide方法隐藏  
    setTimeout(function(){
        animate.hide(that,that.data.param,500);
    },500)
}
```
# hide(this,param,time)
## 隐藏 
#### *参数1：this；
#### *参数2 param：定义的动画名param 
#### 参数3 time:动画执行时间 。 默认值400ms
#### wxml中调用方法：animation='{{param}}'  
```
<view animation='{{param}}'></view>
``` 
```javascript
onReady:function(){
    let that=this;
    animate.hide(that,'pram',1);//使用的元素需要先用hide方法隐藏  
}
```
# isMove(e,direction,callback)
## 触摸方向事件 
#### *参数1 e：滑动钩子的e对象；
#### *参数2 direction：往哪个方向滑动触发('left','right','top','bottom')；
#### 参数3:回调 
```
<view bind:touchmove="isMove"></view>
``` 
```javascript
isMove:function(e){
    let that=this;
    animate.isMove(e,'left',()=>{
        //如果向左滑动则触发
    },this)
}
```
# getHeight(id,callback)
## 获取节点高度 
#### *参数1 id：节点id；
#### *参数2 callback：回调 返回目标left,right,top,bottom属性；
```
<view id='ddd'></view>
``` 
```javascript
onReady:function(){
   animate.getHeight('ddd',(res)=>{
       consonle.log(res)
   })
}
```
# getNode(name,arr,callback)
## 获取节点基本属性 
#### *参数1 name：节点名 '#ddd'/'.aaa'；
#### 参数2 arr：目前提供的基本属性有：
##### backgroundColor，color，fontSize，height，margin，padding，scrollHeight，scrollLeft，scrollTop，scrollWidth，width；如果想获取的属性这里没有可以填写在arr里
#### *参数3：返回基本属性
```
<view id='ddd'></view>
``` 
```javascript
onReady:function(){
   animate.getNode('#ddd',['border'],(res)=>{
       consonle.log(res)
   })
}
```
# getWxImg(src,callback)
## 网络图片本地化 
#### *参数1 src:图片网络路径；
#### *参数2 callback：回调 返回图片基本信息

```javascript
onReady:function(){
   animate.getWxImg('https://pic2.zhimg.com/50/v2-88fd57c6464e1a313d5c3337aba07458_hd.jpg',(res)=>{
       consonle.log(res)
   })
}
```
# strSm(str,len)
## 分割字符串 将字符串分割为字符长度为len的数组 
#### *参数1 str:需要分割的字符串；
#### 参数2 len：在长度大于多少时开始分割 默认：1

```javascript
onReady:function(){
    let str='adadaadaddad'
    let newStr=animate.strSm(str,5);
    //[adada,adadd,ad]
}
```
# fontEllipsis(str,len，end)
## 将多余文字显示为省略号
#### *参数1 str:需要处理的字符串；
#### 参数2 len：在长度大于多少之后为省略号 默认为5
#### 参数3 end:结尾显示内容 默认为‘..’

```javascript
onReady:function(){
    let str='adadaadaddad'
    let newStr=animate.fontEllipsis(str,5,'???');
    //'adada???'
}
```
