
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
const getHeight=(argument,callback)=>{

  let text = "#" + argument;
  // let thisHeight=wx.getStorageSync(argument+'getHeight');
  // console.log(thisHeight)
  // if(thisHeight){
  //   console.log('id:'+argument+'有缓存高度',thisHeight)
  //  callback({
  //    height:thisHeight.height,
  //    width:thisHeight.width,
  //    right:thisHeight.right,
  //    top:thisHeight.top,
  //  })
  // }else{
   let query = wx.createSelectorQuery();
       query.select(text).boundingClientRect()
       query.exec(function (res) {
         if (res[0] != null) {
           callback({
             height:res[0].height,
             width:res[0].width,
             right:res[0].right,
             left: res[0].left,
             top:res[0].top,
             name:argument
           })
           console.log(res)
          //  wx.setStorageSync(argument+'getHeight', res[0]);
          //  let thisHeight=wx.getStorageSync(argument+'getHeight');
          //  console.log(thisHeight)
         }else{
           callback({
             height:0,
             width:0,
             right:0,
             top:0,
             name:argument
           })
           
           console.warn('输入的ID："'+argument+'"不合法或不存在',res)
         }
       })
  // }

}

const getNode=(name,callback,arr=[])=>{
 let property=['margin', 'backgroundColor','fontSize','color','padding'].concat(arr);
//  let thisNode=wx.getStorageSync(name+'getNode');
//    if(thisNode){
//      console.log('id:'+name+'有缓存获取node',thisNode)
//      callback(thisNode)
//    }else{
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
      wx.setStorageSync(name+'getNode', res);
     }).exec()
  //  }
  
}    

const smImg=(path,weight)=>{

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

const show=(that,param,time=400)=>{

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

const hide=(that,param,time=400)=>{
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

const isMove= (argument,direction,callback, distance=3)=> {
  let aX=argument.touches[0].pageX;
  let aY=argument.touches[0].pageX;
  let setRemoveMove=null;
  
  if(addNode.firstMove.X){
    let oldX=addNode.firstMove.X;
    let oldY=addNode.firstMove.Y;
    let toX=(aX-oldX);
    let toY=(aY-oldY);
    let move={
      startX:addNode.firstMove.X,
      startY:addNode.firstMove.Y,
      moveX:aX,
      moveY:aY,
      toX:Math.abs(toX),
      toY:Math.abs(toY)
    }
    if (toX>distance) {
      
      if(direction=='right'){
        callback(move)
      }
    }
    if (toX<distance) {
     
      if(direction=='left'){
        callback(move)
      }
    }
    if (toY>distance) {
     
      if(direction=='top'){
        callback(move)
      }
    }
    if (toY<distance) {
     
       if(direction=='bottom'){
        callback(move)
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


const getWxImg=(src,callback)=>{
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
const strSm=(str,len=1,strArr=[])=>{
    if(str.length>len){
      let newSmStr=str.substr(0, len);
      strArr.push(newSmStr)
      let newStr=str.slice(len)
      return strSm(newStr,len,strArr)
    }
     strArr.push(str)
     return strArr
}

const shinglier=(str,len=5,end='..')=>{
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
const fontLen=(width,str,fontSize,margin,ctx,x,y,color,algin)=>{//该方法待优化
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
const ctxSaveImg=(ctxId,width,height,callback)=>{
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
const setPhoneImg=(path)=>{
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
//实现深度克隆---对象/数组
function clone(target) {
   
    let result,
      targetType = checkedType(target);
    if (targetType === "Object") {
      result = {};
    } else if (targetType === "Array") {
      result = [];
    } else {
      return target;
    }
  
    for (let i in target) {
     
      let value = target[i];
      //判断目标结构里的每一值是否存在对象/数组
      if (checkedType(value) === "Object" || checkedType(value) === "Array") {
        //对象/数组里嵌套了对象/数组
        //继续遍历获取到value值
        result[i] = clone(value);
      } else {
        //获取到value值是基本的数据类型或者是函数。
        result[i] = value;
      }
    }
    return result;
}
  



//以下部分摘自网
// 数组拼接
const ArrayConcat = (arr, ...args) => [].concat(arr, ...args); 
// ArrayConcat([1], [1, 2, 3, [4]]) -> [1, 2, 3, [4]]

// Array difference (数组比较)
const difference = (a, b) => { const s = new Set(b); return a.filter(x => !s.has(x)); };
// difference([1,2,3], [1,2]) -> [3]

// Array includes (数组包含)
const includes = (collection, val, fromIndex=0) => collection.slice(fromIndex).indexOf(val) != -1;
// includes("30-seconds-of-code", "code") -> true
// includes([1, 2, 3, 4], [1, 2], 1) -> false

// Array intersection (数组交集)
const intersection = (a, b) => { const s = new Set(b); return a.filter(x => s.has(x)); };
// intersection([1,2,3], [4,3,2]) -> [2,3]

// Array remove (移除数组中的元素)
const remove = (arr, func) =>
  Array.isArray(arr) ? arr.filter(func).reduce((acc, val) => {
    arr.splice(arr.indexOf(val), 1); return acc.concat(val);
    }, [])
  : [];
//remove([1, 2, 3, 4], n => n % 2 == 0) -> [2, 4]

// Array union (数组合集)
const union = (a, b) => Array.from(new Set([...a, ...b]));
// union([1,2,3], [4,3,2]) -> [1,2,3,4]

// Array without (从数组中排除给定值)
const without = (arr, ...args) => arr.filter(v => args.indexOf(v) === -1);
// without([2, 1, 2, 3], 1, 2) -> [3]
// without([2, 1, 2, 3, 4, 5, 5, 5, 3, 2, 7, 7], 3, 1, 5, 2) -> [ 4, 7, 7 ]

// Array zip (创建一个分组元素数组)
const zip = (...arrays) => {
  const maxLength = Math.max.apply(null, arrays.map(a => a.length));
  return Array.from({length: maxLength}).map((_, i) => {
   return Array.from({length: arrays.length}, (_, k) => arrays[k][i]);
  })
}
//zip(['a', 'b'], [1, 2], [true, false]); -> [['a', 1, true], ['b', 2, false]]
//zip(['a'], [1, 2], [true, false]); -> [['a', 1, true], [undefined, 2, false]]

// Average of array of numbers (求数字数组的平均数)
const average = arr => arr.reduce((acc, val) => acc + val, 0) / arr.length;
// average([1,2,3]) -> 2

// Chunk array (数组分块)
const chunk = (arr, size) =>
  Array.from({length: Math.ceil(arr.length / size)}, (v, i) => arr.slice(i * size, i * size + size));
// chunk([1,2,3,4,5], 2) -> [[1,2],[3,4],[5]]

// Compact (过滤掉数组中所有假值元素)
const compact = (arr) => arr.filter(v => v);
// compact([0, 1, false, 2, '', 3, 'a', 'e'*23, NaN, 's', 34]) -> [ 1, 2, 3, 'a', 's', 34 ]

// Count occurrences of a value in array (计数数组中某个值的出现次数)
const countOccurrences = (arr, value) => arr.reduce((a, v) => v === value ? a + 1 : a + 0, 0);
// countOccurrences([1,1,2,1,2,3], 1) -> 3

// Deep flatten array (深度平铺数组)
const deepFlatten = arr => [].concat(...arr.map(v => Array.isArray(v) ? deepFlatten(v) : v));
// deepFlatten([1,[2],[[3],4],5]) -> [1,2,3,4,5]

// Drop elements in array (删除数组中的元素)
const dropElements = (arr, func) => {
  while (arr.length > 0 && !func(arr[0])) arr.shift();
  return arr;
};
// dropElements([1, 2, 3, 4], n => n >= 3) -> [3,4]

// Fill array (填充数组)
const fillArray = (arr, value, start = 0, end = arr.length) =>
  arr.map((v, i) => i >= start && i < end ? value : v);
// fillArray([1,2,3,4],'8',1,3) -> [1,'8','8',4]

// Filter out non-unique values in an array (过滤出数组中的非唯一值)
const filterNonUnique = arr => arr.filter(i => arr.indexOf(i) === arr.lastIndexOf(i));
// filterNonUnique([1,2,2,3,4,4,5]) -> [1,3,5]

// Flatten array up to depth (根据指定的 depth 平铺数组)
// 每次递归，使 depth 减 1 。使用 Array.reduce() 和 Array.concat() 来合并元素或数组。默认情况下， depth 等于 1 时停递归。省略第二个参数 depth ，只能平铺1层的深度 (单层平铺)。
const flattenDepth = (arr, depth = 1) =>
  depth != 1 ? arr.reduce((a, v) => a.concat(Array.isArray(v) ? flattenDepth(v, depth - 1) : v), [])
  : arr.reduce((a, v) => a.concat(v), []);
// flattenDepth([1,[2],[[[3],4],5]], 2) -> [1,2,[3],4,5]

// Flatten array (平铺数组)
const flatten = arr => arr.reduce((a, v) => a.concat(v), []);
// flatten([1,[2],3,4]) -> [1,2,3,4]

// Get max value from array (获取数组中的最大值)
const arrayMax = arr => Math.max(...arr);
// arrayMax([10, 1, 5]) -> 10

// Get min value from array (获取数组中的最小值)
const arrayMin = arr => Math.min(...arr);
// arrayMin([10, 1, 5]) -> 1

// Group by (数组分组)
const groupBy = (arr, func) =>
  arr.map(typeof func === 'function' ? func : val => val[func])
    .reduce((acc, val, i) => { acc[val] = (acc[val] || []).concat(arr[i]); return acc; }, {});
// groupBy([6.1, 4.2, 6.3], Math.floor) -> {4: [4.2], 6: [6.1, 6.3]}
// groupBy(['one', 'two', 'three'], 'length') -> {3: ['one', 'two'], 5: ['three']}

// Initialize array with range (初始化特定范围的数组)
const initializeArrayRange = (end, start = 0) =>
  Array.apply(null, Array(end - start)).map((v, i) => i + start);
// initializeArrayRange(5) -> [0,1,2,3,4]

// Initialize array with values (初始化特定范围和值的数组)
const initializeArray = (n, value = 0) => Array(n).fill(value);
// initializeArray(5, 2) -> [2,2,2,2,2]

// Median of array of numbers (获取数字数组的中值)
// 如果 length 是奇数，则返回中间值数字，否则返回两个中间值数值的平均值。
const median = arr => {
  const mid = Math.floor(arr.length / 2), nums = arr.sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};
// median([5,6,50,1,-5]) -> 5
// median([0,10,-2,7]) -> 3.5

// Pick(提取)
const pick = (obj, arr) =>
  arr.reduce((acc, curr) => (curr in obj && (acc[curr] = obj[curr]), acc), {});
// pick({ 'a': 1, 'b': '2', 'c': 3 }, ['a', 'c']) -> { 'a': 1, 'c': 3 }
// pick(object, ['a', 'c'])['a'] -> 1

// Shuffle array (随机排列数组)
const shuffle = arr => arr.sort(() => Math.random() - 0.5);
// shuffle([1,2,3]) -> [2,3,1]



// Chain asynchronous functions (链式调用异步函数)
// 循环遍历包含异步事件的函数数组，每次异步事件完成后调用 next 。
const chainAsync = fns => { let curr = 0; const next = () => fns[curr++](next); next(); };
/*
chainAsync([
  next => { console.log('0 seconds'); setTimeout(next, 1000); },
  next => { console.log('1 second');  setTimeout(next, 1000); },
  next => { console.log('2 seconds'); }
])
*/

// Curry (函数式编程术语：柯里化)
// 使用递归。 如果提供的参数(args)数量足够，调用传递函数 fn 。否则返回一个柯里化后的函数 fn ，期望剩下的参数。如果你想柯里化一个接受可变参数数量的函数(可变参数数量的函数，例如 Math.min() )，你可以选择将参数个数传递给第二个参数 arity。
const curry = (fn, arity = fn.length, ...args) => arity < = args.length? fn(...args): curry.bind(null, fn, arity, ...args);
// curry(Math.pow)(2)(10) -> 1024
// curry(Math.min, 3)(10)(50)(2) -> 2

// Promisify (柯里化一个 Promise 函数)
// 使用柯里化返回一个函数，这个函数返回一个调用原始函数的 Promise 。 使用 ...rest 运算符传入所有参数。
const promisify = func =>
  (...args) =>
    new Promise((resolve, reject) =>
      func(...args, (err, result) =>
        err ? reject(err) : resolve(result))
    );
// const delay = promisify((d, cb) => setTimeout(cb, d))
// delay(2000).then(() => console.log('Hi!')) -> Promise resolves after 2s

// Run promises in series (运行连续的 promises)
// 使用 Array.reduce() 通过创建 promise 链来运行连续的 promises，其中每个 promise 在 resolved 时返回下一个 promise 。
const series = ps => ps.reduce((p, next) => p.then(next), Promise.resolve());
// const delay = (d) => new Promise(r => setTimeout(r, d))
// series([() => delay(1000), () => delay(2000)]) -> executes each promise sequentially, taking a total of 3 seconds to complete

// Sleep (休眠)
// 延迟执行 async 函数的一部分，通过把它放到 sleep 状态，返回一个 Promise 。
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
/*
async function sleepyWork() {
  console.log('I\'m going to sleep for 1 second.');
  await sleep(1000);
  console.log('I woke up after 1 second.');
}
*/

// Distance between two points (两点之间的欧氏距离)
const distance = (x0, y0, x1, y1) => Math.hypot(x1 - x0, y1 - y0);
// distance(1,1, 2,3) -> 2.23606797749979

// Greatest common divisor (GCD) (最大公约数)
const gcd = (x, y) => !y ? x : gcd(y, x % y);
// gcd (8, 36) -> 4

// Percentile (百分比)
const percentile = (arr, val) => 
  100 * arr.reduce((acc,v) => acc + (v < val ? 1 : 0) + (v === val ? 0.5 : 0), 0) / arr.length;
// percentile([1,2,3,4,5,6,7,8,9,10], 6) -> 55

// Object from key-value pairs (根据键值对创建对象)
const objectFromPairs = arr => arr.reduce((a, v) => (a[v[0]] = v[1], a), {});
// objectFromPairs([['a',1],['b',2]]) -> {a: 1, b: 2}

// Object to key-value pairs (对象转化为键值对 )
const objectToPairs = obj => Object.keys(obj).map(k => [k, obj[k]]);
// objectToPairs({a: 1, b: 2}) -> [['a',1],['b',2]])


// Anagrams of string (with duplicates) (字符串的排列组合，带有重复项)
const anagrams = str => {
  if (str.length < = 2) return str.length === 2 ? [str, str[1] + str[0]] : [str];
  return str.split('').reduce((acc, letter, i) =>
    acc.concat(anagrams(str.slice(0, i) + str.slice(i + 1)).map(val => letter + val)), []);
};
// anagrams('abc') -> ['abc','acb','bac','bca','cab','cba']

// Capitalize first letter (首字母大写)
const capitalize = ([first,...rest], lowerRest = false) =>
  first.toUpperCase() + (lowerRest ? rest.join('').toLowerCase() : rest.join(''));
// capitalize('myName') -> 'MyName'
// capitalize('myName', true) -> 'Myname'

// Check for palindrome (检查回文)
const palindrome = str => {
  const s = str.toLowerCase().replace(/[\W_]/g,'');
  return s === s.split('').reverse().join('');
}
// palindrome('taco cat') -> true

// Sort characters in string (alphabetical) (按字母顺序排列字符串)
const sortCharactersInString = str =>
  str.split('').sort((a, b) => a.localeCompare(b)).join('');
// sortCharactersInString('cabbage') -> 'aabbceg'

// Measure time taken by function (计算函数执行所花费的时间)
const timeTaken = callback => {
  console.time('timeTaken');
  const r = callback();
  console.timeEnd('timeTaken');
  return r;
};
// timeTaken(() => Math.pow(2, 10)) -> 1024
// (logged): timeTaken: 0.02099609375ms

// UUID generator (UUID生成器)
const uuid = _ =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
// uuid() -> '7982fcfe-5721-4632-bede-6000885be57d'


// Validate email(邮箱验证)
const validateEmail = str =>
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str);
// validateEmail(mymail@gmail.com) -> true

// Validate number (数字验证)
const validateNumber = n => !isNaN(parseFloat(n)) && isFinite(n) && Number(n) == n;
// validateNumber('10') -> true

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



