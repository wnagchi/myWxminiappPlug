
let addNode={
  firstMove:{
  }
}
/*
例：
getHeight('aaa',function(e){
  console.log(e)
})
*/
let getHeight=(argument,callback)=>{

   let text = "#" + argument;
   let thisHeight=wx.getStorageSync(argument+'getHeight')
   if(thisHeight){
     console.log('id:'+argument+'有缓存高度',res)
    callback({
      height:thisHeight.height,
      width:thisHeight.width,
      right:thisHeight.right,
      top:thisHeight.top,
    })
   }else{
    let query = wx.createSelectorQuery();
        query.select(text).boundingClientRect()
        query.exec(function (res) {
          if (res[0] != null) {
            callback({
              height:res[0].height,
              width:res[0].width,
              right:res[0].right,
              top:res[0].top,
            })
            wx.setStorageSync(argument+'getHeight', res[0]);
          }else{
            callback({
              height:0,
              width:0,
              right:0,
              top:0,
            })
            
            console.warn('输入的ID："'+argument+'"不合法或不存在',res)
          }
        })
   }

}

let getNode=(name,callback,arr=[])=>{
  let property=['margin', 'backgroundColor','fontSize','color','padding'].concat(arr);;
   wx.createSelectorQuery().select(name).fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      properties: ['scrollX', 'scrollY'],
      computedStyle: property,
      context: true,
      node:true
    }, function (res) {
     callback(res)
    }).exec()
}    

let smImg=(path,weight)=>{

    wx.compressImage({
    src: 'https://desk-fd.zol-img.com.cn/t_s960x600c5/g2/M00/09/0F/ChMlWV1RFXqIfibuABb_GA-JGGAAAMhIgL96bEAFv8w682.jpg', 
    quality: 60, 
    success(res){
      console.log(res)
    },
    fail(res){
      console.log(res)
    }
  })
}

let show=(that,param,time=400)=>{

    var animation = wx.createAnimation({
      duration: time,
      timingFunction: 'ease',
    });
    //var animation = this.animation
    animation.scale(1, 1).opacity(1).step();

    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    that.setData(json)
}

let hide=(that,param,time=400)=>{
  // getHeight(param)
    var animation = wx.createAnimation({
      duration: time,
      timingFunction: 'ease',
    });

    animation.opacity(0).scale(0, 0).step()
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    that.setData(json)
}

let isMove= (argument,direction,callback)=> {
  let aX=argument.touches[0].pageX;
  let aY=argument.touches[0].pageX;
  let setRemoveMove=null;
  if(addNode.firstMove.X){
    let oldX=addNode.firstMove.X;
    let oldY=addNode.firstMove.Y;
    let toX=(aX-oldX);
    let toY=(aY-oldY);
    if (toX>30) {
      if(direction=='right'){
        callback()
      }
    }else if (toX<-30) {
      if(direction=='left'){
        callback()
      }
    }else if (toY>35) {
      if(direction=='top'){
        callback()
      }
    }else if (toY<-35) {
       if(direction=='bottom'){
        callback()
      }
    }
    clearTimeout(setRemoveMove)
    setRemoveMove=setTimeout(function(){
       delete addNode.firstMove.X;
       delete addNode.firstMove.Y;
    },500)
  }else {
    addNode.firstMove.X=aX;
    addNode.firstMove.Y=aY;
  }
//  console.log(argument)
}


let getWxImg=(src,callback)=>{
        wx.getImageInfo({
              src: src,
              success: function (res) {
                console.log(res)
                callback(res)
              },
              fail:function(res){
                console.warn('目测应该是失败了，是这个路径：',src)
                callback(res)
              }
        })
}

/*canvas用到相关功能*/
let strSm=(str,len=1,strArr=[])=>{
    if(str.length>len){
      let newSmStr=str.substr(0, len);
      strArr.push(newSmStr)
      let newStr=str.slice(len)
      return strSm(newStr,len,strArr)
    }
     strArr.push(str)
     return strArr
}

let shinglier=(str,len=5,end='..')=>{
   let arr=str.split('');
   let newArr=[];
   for(let i=0;i<arr.length;i++){
    if(i>=len){
      newArr.push(end)
      break;
    }
    newArr.push(arr[i])
   }
   return newArr.join('');

   let newStr=str.substring(0,len+1);
   return newStr+end;
}
// canvas绘制相关功能
let ctxFont=(ctx,str,x,y,font,style,align)=>{
  ctx.setFontSize(font);
  ctx.setFillStyle(style);
  ctx.setTextAlign(align);
  ctx.fillText(str, x, y);
}
let ctxLine=(ctx,arr,color,width)=>{
  ctx.setLineWidth(width);
  ctx.setStrokeStyle(color);
  ctx.moveTo(arr[0][0],arr[0][1])
  for(let i=1,len=arr.length;i<len;i++){
    ctx.lineTo(arr[i][0], arr[i][1])
  }
  ctx.stroke()
}
let fontLen=(width,str,fontSize,margin,ctx,x,y,color,algin)=>{//该方法待优化
  let strLen=0;
  let newArr=[[]];
  let arrIndex=0;
    for(let i=0,len=str.length;i<len;i++){
      strLen=str.charCodeAt(i) > 128?strLen+1:strLen+.5;
     
      let strWidth=strLen*(fontSize);
      console.log(strWidth,strLen,str[i])
      newArr[arrIndex]+=str[i]
      if(strWidth>width){
        arrIndex++;
        newArr[arrIndex]=[];
        strLen=0;
      }
    }
    
    console.log('返回的新数组',newArr);

    for(let i=0;i<newArr.length;i++){
      
     // let new1=newArr[i].join('');
      //console.log(new1)
      ctxFont(ctx,newArr[i],x,y+i*(fontSize+margin),fontSize,color,algin)
    }
    
}
let ctxSaveImg=(ctxId,width,height,callback)=>{
  wx.canvasToTempFilePath({
    x: 0,
    y: 0,
    width: width,
    height: height,
    canvasId:ctxId,
    success: function (res) {
      callback(res)    
     // that.saveImageToPhotos(res.tempFilePath);
    },
    fail: function (res) {
      wx.showToast({
        title: '图片生成失败',
        icon: 'none',
        duration: 2000
      })
      callback(res)
    }
  })
}
let setPhoneImg=(path)=>{
  wx.saveImageToPhotosAlbum({
    filePath: path,
    success(result) {
      wx.showToast({
        title: '保存成功,去分享吧',
        icon: 'none',
        duration: 4000
      })
    },
    fail: function (res) {
      wx.showToast({
        title: '图片保存失败',
        icon: 'none',
        duration: 2000
      })
    }
  })
}

module.exports = {
  show:show,
  //显示 
  // *参数1：this对象；
  // *参数2：定义的动画名param 
  // 参数3:动画执行时间 。
  // wxml中调用方法：animation='{{param}}' 
  // *使用的元素需要先用hide方法隐藏  
  hide:hide,
  //隐藏 参数 同show
  isMove:isMove,
  //滑动事件 
  // *参数1：滑动钩子的e对象；
  // *参数2：往哪个方向滑动触发('left','right','top','bottom')；
  // *参数3：回调；

  getHeight:getHeight,
  //获取图片高度1.1增加失败返回提示 
  // *参数1：元素id；
  // *参数2：回调 返回基本参数对象height,width,right,top
  getNode:getNode,
  //获取节点信息 参数1 节点名称 参数2 返回值
  smImg:smImg,
  //压缩图片质量 未完成，还不能用 
  // 参数1：图片路径；
  // 参数2：压缩的质量大小（1-100）
  getWxImg:getWxImg,
  //网络图片本地化 
  // *参数1：图片路径，
  // *参数2：回调 返回本地化图片对象
  strSm:strSm,
  //将字符串分割成数组 
  // 参数1：需要分割的字符串，
  // 参数2：开始分割字符串的长度
  fontEllipsis:shinglier,
  //字符串长度大于多少之后为省略号或者其他 参数1：字符串，参数2：到多长开始省略，参数3:最后一位显示的字符 默认 ..
  ctxFont:ctxFont,
  //canvas绘制文字
  // 参数1：canvas对象
  // 参数2：需要绘制的文字
  // 参数3：起始坐标x
  // 参数4：起始坐标y
  // 参数5：字体大小
  // 参数6：字体颜色
  // 参数7：对其方式

  ctxLine:ctxLine,
  //canvas绘制线
  // 参数1：canvas对象
  // 参数2：坐标数组[[x,y],[x,y]]
  // 参数3：线颜色，
  // 参数4：线宽度
  ctxSaveImg:ctxSaveImg,
  //canvas保存图片
  // 参数1：canvas的id
  // 参数2：长度
  // 参数3：宽度
  // 参数4：回调 返回生成的图片对象
  setPhoneImg:setPhoneImg,
  // 保存到手机
  // 参数1：图片的路径
  fontLen:fontLen
};



