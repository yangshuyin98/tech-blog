---
title: 'day03-前端Web-JavaScript'
category: heima
tags: ['Day03', '前端']
date: 2026-04-22
readTime: '15 min'
---



# 1. JS介绍

在前面的课程中，我们已经学习了HTML、CSS的基础内容，我们知道HTML负责网页的结构，而CSS负责的是网页的表现。 而要想让网页具备一定的交互效果，具有一定的动作行为，还得通过JavaScript来实现。那今天,我们就来讲解JavaScript，这门语言会让我们的页面能够和用户进行交互。



**那什么是JavaScript呢 ?**

- JavaScript（简称：JS） 是一门跨平台、面向对象的脚本语言，是用来控制网页行为的，实现人机交互效果。JavaScript 和 Java 是完全不同的语言，不论是概念还是设计。但是基础语法类似。

- 组成：

  - ECMAScript: 规定了JS基础语法核心知识，包括变量、数据类型、流程控制、函数、对象等。

  - BOM：浏览器对象模型，用于操作浏览器本身，如：页面弹窗、地址栏操作、关闭窗口等。

  - DOM：文档对象模型，用于操作HTML文档，如：改变标签内的内容、改变标签内字体样式等。

​	备注：ECMA国际（前身为欧洲计算机制造商协会），制定了标准化的脚本程序设计语言 ECMAScript，这种语言得到广泛应用。而JavaScript是遵守ECMAScript的标准的。





# 2. 引入方式

## 2.1 介绍

同样，js代码也是书写在html中的，那么html中如何引入js代码呢？主要通过下面的2种引入方式：

**第一种方式：**内部脚本，将JS代码定义在HTML页面中

- JavaScript代码必须位于&lt;script&gt;&lt;/script&gt;标签之间
- 在HTML文档中，可以在任意地方，放置任意数量的&lt;script&gt;
- 一般会把脚本置于&lt;body&gt;元素的底部，可改善显示速度

例子：

~~~html
<body>
  <!-- 页面内容 -->
  
  <script>
    alert("Hello World");
  </script>
</body>
~~~



**第二种方式：**外部脚本， 将JS代码定义在外部 JS文件中，然后引入到 HTML页面中

- 外部JS文件中，只包含JS代码，不包含<script&gt;标签
- 引入外部js的&lt;script&gt;标签，必须是双标签

例子：

~~~html
<script src="js/demo.js"></script>
~~~

`<font color='red'>`注意1：demo.js中只有js代码，没有`<script>`标签`</font>`

`<font color='red'>`注意2：通过`<script></script>`标签引入外部JS文件时，标签不能自闭合`</font>`



## 2.2 演示

接下来，我们通过VS Code来编写代码，演示html中2种引入js的方式

第一步：在VS Code中创建名为 `01.JS-引入方式.html `的文件

第二步：按照上述第一种内部脚本的方式引入js，编写如下代码：

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS-引入方式</title>
</head>
<body>

    <!-- 方式一: 内部脚本 -->
    <script>
        alert("Hello World");
    </script>
</body>
</html>
~~~



第三步：浏览器打开效果如图所示：

<img src="./\day02-前端Web-JavaScript.assets\image-20231118211849172.png" alt="image-20231118211849172" style="zoom:80%;" />  



第四步：接下来演示外部脚本，注释掉内部脚本，然后在css目录同级创建js目录，然后创建一个名为demo.js的文件：

![image-20231118212052123](./\day02-前端Web-JavaScript.assets\image-20231118212052123.png) 



第五步：在demo.js中编写如下js内容：

~~~js
alert('Hello JavaScript');
~~~



第六步：注释掉之前的内部脚本代码，添加&lt;script&gt;标签来引入外部demo.js文件,具体代码如下：

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS-引入方式</title>
</head>
<body>

    <!-- 方式一: 内部脚本 -->
    <!-- <script>
        alert("Hello World");
    </script> -->
    <script src="js/demo.js"></script>
</body>
</html>
~~~



第七步：浏览器刷新效果如图

 <img src="./\day02-前端Web-JavaScript.assets\image-20231118212145630.png" alt="image-20231118212145630" style="zoom:80%;" /> 







# 3. 基础语法

## 3.1 书写规范

掌握了js的引入方式，那么接下来我们需要学习js的书写了，首先需要掌握的是js的书写语法，语法规则如下：

- 区分大小写：与 Java 一样，变量名、函数名以及其他一切东西都是区分大小写的 。

- 每行结尾的分号可有可无 【推荐要么全都写，要么全都不写】。

- 大括号表示代码块 。

- 注释：

  - 单行注释：// 注释内容

  - 多行注释：/* 注释内容 */

    

我们需要借助js中3钟输出语句，来演示书写语法

| api                 | 描述             |
| ------------------- | ---------------- |
| window.alert(...)   | 警告框           |
| document.write(...) | 在HTML 输出内容  |
| console.log(...)    | 写入浏览器控制台 |



接下来我们就通过VS Code，来演示一些上述的3种输出语句的书写语法

第一步：在VS Code中创建名为 `02.JS-基础语法-输出语句.html`的文件

第二步：按照基本语法规则，编写3种输出语句的代码，并且添加注释，具体代码如下；

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS-基本语法-输出语句</title>
</head>
<body>
	
    <script>
        //方式一: 写入浏览器的body区域
        document.write("Hello JS (document.write)");

        //方式二: 弹出框
        window.alert("Hello JS (window.alert)");

        //方式三: 控制台
        console.log("Hello JS (console.log)")
    </script>
</body>
</html>
~~~

浏览器打开如图所示效果：

![image-20231118212945770](./\day02-前端Web-JavaScript.assets\image-20231118212945770.png) 

![image-20231118212955880](./\day02-前端Web-JavaScript.assets\image-20231118212955880.png)  

![image-20231118213054184](./\day02-前端Web-JavaScript.assets\image-20231118213054184.png) 







## 3.2 变量

### 3.2.1 let

基本的书写语法我们清楚了之后，接下来，我们再来讲解JS中的变量。在js中，变量的声明和java中还是不同的。

- JS中主要通过 `let` 关键字来声明变量的。
- JS是一门弱类型语言，变量是可以存放不同类型的值的。
- 变量名需要遵循如下规则：
  - 组成字符可以是任何字母、数字、下划线（_）或美元符号（$），且数字不能开头
  - 变量名严格区分大小写，如：name和Name是不同的变量
  - 不能使用关键字作为变量名，如：let、if、for等



变量的声明示例如下所示：

```html
<script>
    //变量
    let a = 20;
    a = "Hello";
    alert(a);
</script>
```

上述的示例中，大家会看到变量a既可以存数字，又可以存字符串。 因为JS是弱类型语言。





### 3.2.2 const

在JS中，如果声明一个场景，需要使用`const`关键字。一旦声明，常量的值就不能改变 （不可以重新赋值）。

如下所示：

```html
<body>

    <script>
        //常量
        const PI = 3.14;
        PI = 3.15;
        alert(PI);
    </script>
</body>
```

浏览器打开之后，会报如下错误：

![image-20231118214706628](./\day02-前端Web-JavaScript.assets\image-20231118214706628.png) 

该错误就表示，常量不可以被重新分配值。





### 3.2.3 注意

在早期的JS中，声明变量还可以使用 `var` 关键字来声明。例如：

```html
<body>

    <script>
         //var声明变量
		var name = "A";
		name = "B";
		alert(name);
        
         var name = "C"
         alert(name);
    </script>
</body>
```

打开浏览器运行之后，大家会发现，可以正常执行，第一次弹出 B，第二次弹出 C 。我们看到 name变量重复声明了，但是呢，如果使用var关键字，是没有问题的，可以重复声明。

**`var`声明的变量呢，还有一些其他不严谨的地方，这里就不再一一列举了，所以这个声明变量的关键字，并不严谨 【不推荐】。**





## 3.3 数据类型

虽然JS是弱数据类型的语言，但是JS中也存在数据类型，JS中的数据类型分为 ：原始数据类型 和 引用数据类型。那这部分，我们先来学习原始数据类型，主要包含以下几种类型：

| 数据类型  | 描述                                                         |
| --------- | ------------------------------------------------------------ |
| number    | 数字（整数、小数、NaN(Not a Number)）                        |
| string    | 字符串，单双引('...')、双引号("...")、反引号(\`...\`)皆可，正常使用推荐单引号 |
| boolean   | 布尔。true，false                                            |
| null      | 对象为空。 JavaScript 是大小写敏感的，因此 null、Null、NULL是完全不同的 |
| undefined | 当声明的变量未初始化时，该变量的默认值是 undefined           |



使用`typeof` 关键字可以返回变量的数据类型，接下来我们需要通过书写代码来演示js中的数据类型

第一步：在VS Code中创建名为 `04.JS-基础语法-数据类型.html` 的文件

第二步：编写如下代码，然后直接挨个观察数据类型：

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS-数据类型</title>
</head>
<body>

    <script>
        //原始数据类型
        alert(typeof 3); //number
        alert(typeof 3.14); //number

        alert(typeof "A"); //string
        alert(typeof 'Hello');//string

        alert(typeof true); //boolean
        alert(typeof false);//boolean

        alert(typeof null); //object 

        var a ;
        alert(typeof a); //undefined

    </script>
</body>
</html>
~~~





对于字符串类型的数据，除了可以使用双引号（"..."）、单引号（'...'）以外，还可以使用反引号 （\`...\`） 。 而使用反引号引起来的字符串，也称为 模板字符串。

- 模板字符串的使用场景：拼接字符串和变量。
- 模板字符串的语法：
  - \`...\` ：反引号 （英文输入模式下键盘 tab 键上方波浪线 ~ 那个键）
  - 内容拼接时，使用 ${ } 来引用变量

具体示例如下：

```html
  <script>
    let name = 'Tom';
    let age = 18;
    console.log('大家好, 我是新入职的' + name + ', 今年' + age + '岁了, 请多多关照'); //原始方式 , 手动拼接字符串
    console.log(`大家好, 我是新入职的${name}, 今年${age}岁了, 请多多关照`); //使用模板字符串方式拼接字符串
  </script>
```





## 3.4 运算符

### 3.4.1 运算符

那接下来，我们再来介绍JS中的运算符。JS中的运算规则绝大多数还是和JAVA中是一致的，具体运算符如下：

| 运算规则   | 运算符                                                       |
| ---------- | ------------------------------------------------------------ |
| 算术运算符 | + , - , * , / , % , ++ , --                                  |
| 赋值运算符 | = , += , -= , *= , /= , %=                                   |
| 比较运算符 | &gt; , < , >= , <= , != , == , ===   注意     == 会进行类型转换，=== 不会进行类型转换 |
| 逻辑运算符 | && , \|\| , !                                                |
| 三元运算符 | 条件表达式 ? true_value: false_value                         |



上述所罗列的这些运算符中，绝大部分的运算符和Java中的使用方式、含义都是一样的。那这里，我们主要介绍一下 = 、==、=== 的区别：

- = 是赋值操作
- == 会在比较时，判断左右两边的值是否相等 （会自动进行类型转换）
- === 全等，在比较时，判断左右两边的类型和值是否都相等，都相等才为true（不会进行类型转换）



接下来我们通过代码来演示JS中的运算法，主要记忆JS中和JAVA中不一致的地方

第一步：在VS Code中创建名为`05. JS-基础语法-运算符.html`的文件

第二步：编写代码

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS-运算符</title>
</head>
<body> 

    <script>
         var age = 20;
         var _age = "20";
         var $age = 20;

         alert(age == _age); //true ，只比较值
         alert(age === _age); //false ，类型不一样
         alert(age === $age); //true ，类型一样，值一样
    </script>
</body>
</html>
~~~





### 3.4.2 类型转换

在某些运算被执行时，系统内部自动将数据类型进行转换，这种转换成为 隐式转换。

- 字符串 <-> 数字：
  + +号两边只要有一个是字符串，都会把另外一个转成字符串。
  + 除了+外的算术运算符，比如：- * / 都会把字符串转为数字类型。
  + 通过parseInt(...)函数，可以将一个字符串转为数字。

- 其他类型 -> 布尔类型：
  - Number：0 和 NaN为false，其他均转为true。
  - String：空字符串为false，其他均转为true。
  - Null 和 undefined ：均转为false。



**演示1: 字符串 <-> 数字**

~~~js
//类型转换 - 字符串 <-> 数字
alert(typeof ('10' - 1)); //number
alert(typeof ('10' + 1)); //string

alert(parseInt("12")); //12
alert(parseInt("12A45")); //12
alert(parseInt("A45"));//NaN (not a number)
~~~



**演示2: 其他类型 <-> 布尔类型**

在js中，还有非常重要的一点是：0，null，undefined，""，NaN 理解成false，反之理解成true。

~~~js
// 类型转换 - 其他类型转为boolean
if(0){//false
    alert("0 转换为false");
}
if(NaN){//false
    alert("NaN 转换为false");
}
if(1){//true
    alert("除0和NaN其他数字都转为 true");
}

if(""){//false
    alert("空字符串为 false, 其他都是true");
}

if(" "){//true
    alert("空格字符串为 true");
}

if(null){//false
    alert("null 转化为false");
}
if(undefined){//false
    alert("undefined 转化为false");
}
~~~



**需要注意的是：**在JS中，0，null，undefined，""，NaN理解成false，反之都为 true。



## 3.5 流程控制语句

在JS中，当然也存在对应的流程控制语句。常见的流程控制语句如下：

- if ... else if ... else ...
- switch
- for
- while
- do ... while

而JS中的流程控制语句与JAVA中的流程控制语句的作用，执行机制都是一样的。这个呢，我们现在就不再一个一个的如研究了，后面用到的时候，我们再做说明。









# 4. 函数

在JAVA中我们为了提高代码的复用性，可以使用方法 。同样，在JavaScript中可以使用函数来完成相同的事情。JavaScript中的函数被设计为执行特定任务的代码块，方便程序的封装复用。在JS中，需要通过关键字function来定义。接下来我们学习一下JavaScript中定义函数的2种语法：

## 4.1 格式一

第一种定义格式如下：

~~~js
function 函数名(参数1,参数2..){
    要执行的代码
}
~~~

因为JavaScript是弱数据类型的语言，所以有如下几点需要注意：

- 形参不需要声明类型，并且JS中不管什么类型都是let去声明，加上也没有意义。
- 返回值也不需要声明类型，直接return即可



示例：

~~~js
function add(a, b){
    return a + b;
}
~~~

如果要调用上述的函数add，可以使用：函数名称(实际参数列表)

```js
let result = add(10,20);
alert(result);
```



我们在调用add函数时，再添加2个参数，修改代码如下：

~~~js
var result = add(10,20,30,40);
alert(result);
~~~

浏览器打开，发现没有错误，并且依然弹出30，这是为什么呢？

因为在JavaScript中，函数的调用只需要名称正确即可，参数列表不管的。如上述案例，10传递给了变量a，20传递给了变量b,而30和40没有变量接受，但是不影响函数的正常调用。



<font color='red'>注意：由于JS是弱类型语言，形参、返回值都不需要指定类型。在调用函数时，实参个数与形参个数可以不一致，但是建议一致。 </font>



## 4.2 格式二

刚才我们定义函数，是为函数指定了一个名字。 那我们也可以不为函数指定名字，那这一类的函数，我们称之为匿名函数。那接下来，方式二，就来介绍一下匿名函数的定义和调用。

**匿名函数：**是指一种没有名称的函数，由于它们没有名称，因此无法直接通过函数名来调用，而是通过变量或表达式来调用。

匿名函数定义可以通过两种方式：函数表达式 和 箭头函数。



示例一（函数表达式）：

~~~js
var add = function (a,b){
	return a + b;
}
~~~



示例二（箭头函数）：

```js
var add = (a,b) => {
	return a + b;
}
```



上述匿名函数声明好了之后，是将这个函数赋值给了add变量。 那我们就可以直接通过add函数直接调用，调用代码如下：

```js
let result = add(10,20);
alert(result);
```



也可以在定义完匿名函数之后，让该函数立即执行，这类函数我们也称为 **立即执行函数**。

```js
(function (a,b) {console.log(a + b);})(10,20);

((a,b) => {console.log(a + b);})(100,200);
```



# 5. JS对象

JavaScript中的对象有很多，主要可以分为如下3大类，我们可以打开[W3school在线学习文档](https://www.w3school.com.cn/)，来到首页，在左侧栏找到浏览器脚本下的JavaScript，如下图所示：

![1668587524509](./\day02-前端Web-JavaScript.assets\1668587524509.png)



然后进入到如下界面，点击右侧的参考书

![1668587661914](./\day02-前端Web-JavaScript.assets\1668587661914.png) 



然后进入到如下页面，此页面列举出了JavaScript中的所有对象

![1668587855863](./\day02-前端Web-JavaScript.assets\1668587855863.png)



可以大体分页3大类：

第一类：基本对象,我们主要学习Array、String和JSON

![1668587953841](./\day02-前端Web-JavaScript.assets\1668587953841.png) 

第二类：BOM对象,主要是和浏览器相关的几个对象

![1668588039871](./\day02-前端Web-JavaScript.assets\1668588039871.png) 

第三类：DOM对象，JavaScript中将html的每一个标签都封装成一个对象

![1668588141399](./\day02-前端Web-JavaScript.assets\1668588141399.png) 

我们先来学习基本对象种的Array对象



## 5.1 基本对象

### 5.1.1 Array对象

#### 5.1.1.1 语法格式

Array对象时用来定义数组的。常用语法格式有如下2种：

方式1：

~~~js
var 变量名 = new Array(元素列表); 
~~~

例如：

~~~js
var arr = new Array(1,2,3,4); //1,2,3,4 是存储在数组中的数据（元素）
~~~



方式2：

~~~js
var 变量名 = [ 元素列表 ]; 
~~~

例如：

~~~js
var arr = [1,2,3,4]; //1,2,3,4 是存储在数组中的数据（元素）
~~~



数组定义好了，那么我们该如何获取数组中的值呢？和java中一样，需要通过索引来获取数组中的值（索引从0 开始）。语法如下：

~~~js
arr[索引] = 值;
~~~



接下来，我们在VS Code中创建名为 `07. JS-对象-Array.html` 的文件，按照上述的语法定义数组，并且通过索引来获取数组中的值。

~~~html
<script>
     //定义数组
     //let arr = new Array(1,2,3,4);
     let arr = [1,2,3,4];
    
	//获取数组中的值，索引从0开始计数
     console.log(arr[0]);
     console.log(arr[1]);
</script>
~~~

浏览器控制台观察的效果如下：输出1和2

![image-20231119102658254](./\day02-前端Web-JavaScript.assets\image-20231119102658254.png)  



#### 5.1.1.2 特点

与java中不一样的是，JavaScript中数组相当于java中的集合，数组的长度是可以变化的。而且JavaScript是弱数据类型的语言，所以数组中可以存储任意数据类型的值 【总结起来：长度可变、类型可变】。

接下来我们通过代码来演示上述特点。注释掉之前的代码，添加如下代码：

~~~js
//特点: 长度可变 类型可变
let arr = [1,2,3,4];
arr[10] = 50;

console.log(arr[10]);
console.log(arr[9]);
console.log(arr[8]);
~~~

上述代码定义的arr变量中，数组的长度是4，但是我们直接再索引10的位置直接添加了数据10，并且输出索引为10的位置的元素，浏览器控制台数据结果如下：

![image-20231119102734469](./\day02-前端Web-JavaScript.assets\image-20231119102734469.png)  



因为索引8和9的位置没有值，所以输出内容undefined。 当然，我们也可以给数组添加其他类型的值，添加代码如下：注释掉之前控制台输出的代码

~~~js
//特点: 长度可变 类型可变
let arr = [1,2,3,4];
arr[10] = 50;

// console.log(arr[10]);
// console.log(arr[9]);
// console.log(arr[8]);

arr[9] = "A";
arr[8] = true;

console.log(arr);
~~~

浏览器控制台输出结果如下：

![image-20231119102830919](./\day02-前端Web-JavaScript.assets\image-20231119102830919.png)  





#### 5.1.1.3 属性和方法

Array作为一个对象，那么对象是有属性和方法的，所以接下来我们介绍一下Array对象的属性和方法

官方文档中提供了Array的很多属性和方法，但是我们只学习常用的属性和方法，如下图所示：

- 属性：

| 属性   | 描述                         |
| :----- | :--------------------------- |
| length | 设置或返回数组中元素的数量。 |



- 方法：

| **方法**  | **描述**                                                     |
| --------- | ------------------------------------------------------------ |
| forEach() | 遍历数组中的每个有值的元素，并调用一次传入的函数             |
| map()     | 遍历每个数组元素，调用函数进行处理，并将结果封装到一个新数组中 |
| push()    | 将一个或多个元素添加到数组的末尾，并返回新的长度。           |
| pop()     | 从数组移除最后一个元素，并返回该元素。                       |
| unshift() | 在数组开头添加一个或多个元素，并返回数组的新长度。           |
| shift()   | 从数组移除第一个元素，并返回该元素。                         |
| splice()  | 从数组中删除元素。                                           |



- length属性：

  length属性可以用来获取数组的长度，所以我们可以借助这个属性，来遍历数组中的元素，添加如下代码：

  ~~~js
  let arr = [1,2,3,4];
  arr[10] = 50;
  for (let i = 0; i < arr.length; i++) {
  	console.log(arr[i]);
  }
  ~~~

  浏览器控制台输出结果如图所示：

  ![image-20231119102923663](./\day02-前端Web-JavaScript.assets\image-20231119102923663.png)  





- forEach()方法

  首先我们学习forEach()方法，顾名思义，这是用来遍历的，那么遍历做什么事呢？所以这个方法的参数，需要传递一个函数，而且这个函数接受一个参数，就是遍历时数组的值。修改之前的遍历代码如下：

  ~~~js
  //e是形参，接受的是数组遍历时的值
  arr.forEach(function(e){
       console.log(e);
  })
  ~~~

  当然了，在ES6中，引入箭头函数的写法，语法类似java中lambda表达式，修改上述代码如下：

  ~~~js
  arr.forEach((e) => {
       console.log(e);
  }) 
  ~~~

​		

  		浏览器输出结果如下：注意的是，没有元素的内容是不会输出的，因为forEach只会遍历有值的元素 

​         ![image-20231119103027193](./\day02-前端Web-JavaScript.assets\image-20231119103027193.png) 



- map() 方法

  该方法是用于遍历数组中的元素，调用传入的函数对元素进行处理，并将结果封装到一个新数组中。 如下所示：

  ```js
  //map: 对arr中的每一个元素进行处理, 在原来的基础上加10, 并将其封装到一个新的数组 arr2 中.
  let arr2 = arr.map((e) => e = e+10);
  console.log(arr2);
  ```

  该方法演示完毕后，将其注释。

  

- push()方法

  push()方法是用于向数组的末尾添加元素的，其中函数的参数就是需要添加的元素。编写如下代码：向数组的末尾添加3个元素

  ~~~js
  //push: 添加元素到数组末尾
  arr.push(7,8,9);
  console.log(arr);
  ~~~

  浏览器输出结果如下：

  ![image-20231119103646371](./\day02-前端Web-JavaScript.assets\image-20231119103646371.png)  




- pop()方法

  pop()方法是用来移除数组中的最后一个元素，并返回该元素。编写如下代码：

  ```js
  //pop: 移除最后一个元素
  arr.pop();
  console.log(arr);
  ```

  浏览器输出结果如下：

  ![image-20231119104144572](./\day02-前端Web-JavaScript.assets\image-20231119104144572.png) 



- unshift() 方法

  该方法是用于在数组的开头添加元素(一个或多个)，并返回新的数组的长度。示例如下：

  ```js
  //unshift: 往数组的头部添加元素 A
  arr.unshift('A', 'B');
  console.log(arr);
  ```

  浏览器输出结果如下：

  ![image-20231119104451987](./\day02-前端Web-JavaScript.assets\image-20231119104451987.png) 



- shift() 方法

  该方法用来在数组的头部移除第一个元素，并返回该元素。示例如下：

  ```js
  arr.shift();
  console.log(arr);
  ```

  浏览器输出结果如下：

  ![image-20231119105158299](./\day02-前端Web-JavaScript.assets\image-20231119105158299.png) 



- splice()方法

  splice()方法用来数组中的元素，函数中填入2个参数。

  参数1：表示从哪个索引位置删除

  参数2：表示删除元素的个数

  如下代码表示：从索引2的位置开始删，删除2个元素

  ~~~js
  //splice: 删除元素
  arr.splice(2,2);
  console.log(arr);
  ~~~

  浏览器执行效果如下：元素3和4被删除了，元素3是索引2

   ![image-20231119105320045](./\day02-前端Web-JavaScript.assets\image-20231119105320045.png)



Array数组的完整代码如下：

~~~html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS-对象-Array</title>
</head>

<body>
    <script>
        //1. 定义数组
        //let arr = new Array(1,2,3,4);
        // let arr = [1,2,3,4];
        
        //获取数组中的值，索引从0开始计数
        // console.log(arr[0]);
        // console.log(arr[1]);

        //特点: 长度可变 类型可变
        // let arr = [1,2,3,4];
        // arr[10] = 50;
        
        // arr[9] = "A";
        // arr[8] = true;

        // console.log(arr);

        // console.log(arr[10]);
        // console.log(arr[9]);
        // console.log(arr[8]);

        //2. 数组属性 - length
        let arr = [1,2,3,4];
        arr[10] = 50;
        // for (let i = 0; i < arr.length; i++) {
        //     console.log(arr[i]);
        // }

        //3. 数组方法 - forEach , map, push , pop , unshift , shift , splice
        // arr.forEach(function(e){
        //     console.log(e);
        // })

        // let arr2 = arr.map((e) => e = e+10);
        // console.log(arr2);

        // arr.push(7,8,9);
        // console.log(arr);

        // arr.pop();
        // console.log(arr);

        // arr.unshift('A', 'B');
        // console.log(arr);

        // arr.shift();
        // console.log(arr);

        //splice: 删除元素
        arr.splice(2,2);
        console.log(arr);

    </script>
</body>

</html>
~~~





### 5.1.2 String对象

#### 5.1.2.1 语法格式

String对象的创建方式有2种：

方式1：

~~~js
var 变量名 = new String("…") ; //方式一
~~~

例如：

~~~js
var str = new String("Hello String");
~~~



方式2：

~~~js
var 变量名 = '…' ; //方式二
~~~

例如：

~~~js
var str = 'Hello String';
~~~



按照上述的格式，在VS Code中创建为名03. JS-对象-String.html的文件，编写代码如下：

~~~html
<script>
    //创建字符串对象
    //var str = new String("Hello String");
    var str = '  Hello String    ';

    console.log(str);
</script>
~~~

 



#### 5.1.2.2 属性和方法

String对象也提供了一些常用的属性和方法，如下表格所示：

属性：

| 属性   | 描述           |
| ------ | -------------- |
| length | 字符串的长度。 |

方法：

| 方法        | 描述                                     |
| ----------- | ---------------------------------------- |
| charAt()    | 返回在指定位置的字符。                   |
| indexOf()   | 检索字符串。                             |
| trim()      | 去除字符串两边的空格                     |
| substring() | 提取字符串中两个指定的索引号之间的字符。 |

- length属性：

  length属性可以用于返回字符串的长度，添加如下代码：

  ~~~js
  //length
  console.log(str.length);
  ~~~

- charAt()函数：

  charAt()函数用于返回在指定索引位置的字符，函数的参数就是索引。添加如下代码：

  ~~~js
  console.log(str.charAt(4));
  ~~~

- indexOf()函数

  indexOf()函数用于检索指定内容在字符串中的索引位置的，返回值是索引，参数是指定的内容。添加如下代码：

  ~~~js
  console.log(str.indexOf("lo"));
  ~~~

- trim()函数

  trim()函数用于去除字符串两边的空格的。添加如下代码：

  ~~~js
  var s = str.trim();
  console.log(s.length);
  ~~~

- substring()函数

  substring()函数用于截取字符串的，函数有2个参数。

  参数1：表示从那个索引位置开始截取。包含

  参数2：表示到那个索引位置结束。不包含

  ~~~js
  console.log(s.substring(0,5));
  ~~~



整体代码如下：

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS-对象-String</title>
</head>
<body>
    
</body>
<script>
    //创建字符串对象
    //var str = new String("Hello String");
    var str = "  Hello String    ";

    console.log(str);

    //length
    console.log(str.length);

    //charAt
    console.log(str.charAt(4));

    //indexOf
    console.log(str.indexOf("lo"));

    //trim
    var s = str.trim();
    console.log(s.length);

    //substring(start,end) --- 开始索引, 结束索引 (含头不含尾)
    console.log(s.substring(0,5));

</script>
</html>
~~~



浏览器执行效果如图所示：

![1668595450181](./\day02-前端Web-JavaScript.assets\1668595450181.png) 





### 5.1.3 JSON对象

#### 5.1.3.1 自定义对象

在 JavaScript 中自定义对象特别简单，其语法格式如下：

~~~js
var 对象名 = {
    属性名1: 属性值1, 
    属性名2: 属性值2,
    属性名3: 属性值3,
    方法名称: function(形参列表){}
};

~~~

我们可以通过如下语法调用属性：

~~~js
对象名.属性名
~~~

通过如下语法调用函数：

~~~js
对象名.方法名()
~~~



接下来，我们再VS Code中创建名为 `09. JS-对象-JSON.html` 的文件演示自定义对象

~~~html
<script>
    //自定义对象
    var user = {
        name: "Tom",
        age: 10,
        gender: "男",
        sing: function(){
             console.log("悠悠的唱着最炫的民族风~");
         }
    }

    console.log(user.name);
    user.eat();
<script>
~~~

浏览器控制台结果如下：

 ![image-20231119110652514](./\day02-前端Web-JavaScript.assets\image-20231119110652514.png) 



其中，上述函数定义的语法可以简化成如下格式：

~~~js
<script>
    //自定义对象
    var user = {
        name: "Tom",
        age: 10,
        gender: "男",
        sing(){
             console.log("悠悠的唱着最炫的民族风~");
         }
    }

    console.log(user.name);
    user.eat();
<script>
~~~



#### 5.1.3.2 JSON

##### 5.1.3.2.1 介绍

JSON对象：**J**ava**S**cript **O**bject **N**otation，JavaScript对象标记法。JSON是通过JavaScript标记法书写的文本。其格式如下：

~~~js
{
    "key":value,
    "key":value,
    "key":value
}
~~~

其中，**key必须使用引号并且是双引号标记，value可以是任意数据类型。**

例如我们可以直接百度搜索“json在线解析”，随便挑一个进入，然后编写内容如下：

~~~js
{
	"name": "李传播"
}
~~~



![1668596701343](./\day02-前端Web-JavaScript.assets\1668596701343.png) 

但是当我们将双引号切换成单引号，再次校验，则报错，如下图所示：

![1668596798551](./\day02-前端Web-JavaScript.assets\1668596798551.png)



而由于语法简单，层级结构鲜明，现多用于作为数据载体，在网络中进行数据传输。

![1668597176685](./\day02-前端Web-JavaScript.assets\1668597176685.png) 



##### 5.1.3.2.2 定义

接下来我们通过代码来演示json对象：注释掉之前的代码，编写代码如下：

~~~js
var userStr = '{"name":"Tom", "age":18, "addr":["北京","上海","西安"]}';
alert(userStr.name);
~~~

浏览器输出结果如下：

![image-20231119111444299](./\day02-前端Web-JavaScript.assets\image-20231119111444299.png) 

 

为什么呢？**因为上述是一个json格式的字符串，不是JS对象，所以我们需要借助JS中提供的JSON对象，来将json字符串和JS对象之间来完成转换。**：

1). JSON字符串 -> JS对象

~~~js
var obj = JSON.parse(userStr);
alert(obj.name);
~~~

此时浏览器输出结果如下：

![image-20231119111652167](./\day02-前端Web-JavaScript.assets\image-20231119111652167.png)  



2). JS对象 -> JSON字符串

~~~js
alert(JSON.stringify(obj));
~~~

浏览器输出结果如图所示：

![image-20231119111757334](./\day02-前端Web-JavaScript.assets\image-20231119111757334.png) 



整体全部代码如下：

~~~html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS-对象-JSON</title>
</head>

<body>


    <script>
        //1. 自定义JS对象
        // var user = {
        //     name: "Tom",
        //     age: 10,
        //     gender: "男",
        //     sing: function(){
        //         console.log("悠悠的唱着最炫的民族风~");
        //     }
        // }

        // console.log(user.name);
        // user.sing();

        //2. JSON对象
        var userStr = '{"name":"Tom", "age":18, "addr":["北京","上海","西安"]}';
        // alert(userStr.name);

        var obj = JSON.parse(userStr);
        alert(obj.name);
        
        alert(JSON.stringify(obj));
    </script>
</body>

</html>
~~~





## 5.2 BOM对象

接下来我们学习BOM对象，BOM的全称是Browser Object Model,翻译过来是浏览器对象模型。

也就是JavaScript将浏览器的各个组成部分封装成了对象。我们要操作浏览器的部分功能，可以通过操作BOM对象的相关属性或者函数来完成。

例如：我们想要将浏览器的地址改为`http://www.baidu.com`,我们就可以通过BOM中提供的location对象的href属性来完成，代码如下：`location.href='http://www.baidu.com'`

BOM中提供了如下5个对象：

| 对象名称  | 描述           |
| :-------- | :------------- |
| Window    | 浏览器窗口对象 |
| Navigator | 浏览器对象     |
| Screen    | 屏幕对象       |
| History   | 历史记录对象   |
| Location  | d地址栏对象    |

上述5个对象与浏览器各组成对应的关系如下图所示：

![](./\day02-前端Web-JavaScript.assets\image-20210815194911914.png) 

对于上述5个对象，我们重点学习的是Window对象、Location对象这2个。



#### 1.5.2.1 Window对象

window对象指的是浏览器窗口对象，是JavaScript的全部对象，所以对于window对象，我们可以直接使用，并且对于window对象的方法和属性，我们可以省略window.例如：我们之前学习的alert()函数其实是属于window对象的，其完整的代码如下：

~~~
window.alert('hello');
~~~

其可以省略window.  所以可以简写成

~~~
alert('hello')
~~~

所以对于window对象的属性和方法，我们都是采用简写的方式。window提供了很多属性和方法，下表列出了常用属性和方法



window对象提供了获取其他BOM对象的属性：

| 属性      | 描述                  |
| --------- | --------------------- |
| history   | 用于获取history对象   |
| location  | 用于获取location对象  |
| Navigator | 用于获取Navigator对象 |
| Screen    | 用于获取Screen对象    |

也就是说我们要使用location对象，只需要通过代码`window.location`或者简写`location`即可使用



window也提供了一些常用的方法，如下表格所示：

| 函数          | 描述                                               |
| ------------- | -------------------------------------------------- |
| alert()       | 显示带有一段消息和一个确认按钮的警告框。           |
| comfirm()     | 显示带有一段消息以及确认按钮和取消按钮的对话框。   |
| setInterval() | 按照指定的周期（以毫秒计）来调用函数或计算表达式。 |
| setTimeout()  | 在指定的毫秒数后调用函数或计算表达式。             |



接下来，我们通过VS Code中创建名为 `10. JS-对象-BOM.html` 文件来编写代码来演示上述函数：

- alert()函数：弹出警告框，函数的内容就是警告框的内容

  ~~~html
  <script>
      //window对象是全局对象，window对象的属性和方法在调用时可以省略window.
      window.alert("Hello BOM");
      alert("Hello BOM Window");
  </script> 
  ~~~

  

- confirm()函数：弹出确认框，并且提供用户2个按钮，分别是确认和取消。

  添加如下代码：

  ~~~js
  confirm("您确认删除该记录吗?");
  ~~~

  浏览器打开效果如图所示：

  ![image-20231119112325499](./\day02-前端Web-JavaScript.assets\image-20231119112325499.png) 

  但是我们怎么知道用户点击了确认还是取消呢？所以这个函数有一个返回值，当用户点击确认时，返回true，点击取消时，返回false。我们根据返回值来决定是否执行后续操作。修改代码如下：再次运行，可以查看返回值true或者false

  ~~~js
  var flag = confirm("您确认删除该记录吗?");
  alert(flag);
  ~~~

  

- setInterval(fn,毫秒值)：定时器，用于周期性的执行某个功能，并且是**循环执行**。该函数需要传递2个参数：

  fn:函数，需要周期性执行的功能代码

  毫秒值：间隔时间

  注释掉之前的代码，添加代码如下：

  ~~~js
  //定时器 - setInterval -- 周期性的执行某一个函数
  var i = 0;
  setInterval(function(){
       i++;
       console.log("定时器执行了"+i+"次");
  },2000);
  ~~~

  刷新页面，浏览器每个一段时间都会在控制台输出，结果如下：

  ![image-20231119112412254](./\day02-前端Web-JavaScript.assets\image-20231119112412254.png) 

   

- setTimeout(fn,毫秒值) ：定时器，只会在一段时间后**执行一次功能**。参数和上述setInterval一致

  注释掉之前的代码，添加代码如下：

  ~~~js
  //定时器 - setTimeout -- 延迟指定时间执行一次 
  setTimeout(function(){
  	alert("JS");
  },3000);
  ~~~

  浏览器打开，3s后弹框，关闭弹框，发现再也不会弹框了。

​		

​			

#### 1.5.2.2 Location对象

location是指代浏览器的地址栏对象，对于这个对象，我们常用的是href属性，用于获取或者设置浏览器的地址信息，添加如下代码：

~~~js
//获取浏览器地址栏信息
alert(location.href);
//设置浏览器地址栏信息
location.href = "https://www.itcast.cn";
~~~

浏览器效果如下：首先弹框展示浏览器地址栏信息，

![image-20231119112519255](./\day02-前端Web-JavaScript.assets\image-20231119112519255.png)  

然后点击确定后，因为我们设置了地址栏信息，所以浏览器跳转到传智首页



完整代码如下：

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS-对象-BOM</title>
</head>
<body>
    
</body>
<script>
    //获取
    // window.alert("Hello BOM");
    // alert("Hello BOM Window");

    //方法
    //confirm - 对话框 -- 确认: true , 取消: false
    // var flag = confirm("您确认删除该记录吗?");
    // alert(flag);

    //定时器 - setInterval -- 周期性的执行某一个函数
    // var i = 0;
    // setInterval(function(){
    //     i++;
    //     console.log("定时器执行了"+i+"次");
    // },2000);

    //定时器 - setTimeout -- 延迟指定时间执行一次 
    // setTimeout(function(){
    //     alert("JS");
    // },3000);
    
    //location
    alert(location.href);

    location.href = "https://www.itcast.cn";

</script>
</html>
~~~





## 5.3 DOM对象

### 5.3.1 DOM介绍

DOM：Document Object Model 文档对象模型。也就是 JavaScript 将 HTML 文档的各个组成部分封装为对象。

DOM 其实我们并不陌生，之前在学习 XML 就接触过，只不过 XML 文档中的标签需要我们写代码解析，而 HTML 文档是浏览器解析。封装的对象分为

- Document：整个文档对象
- Element：元素对象
- Attribute：属性对象
- Text：文本对象
- Comment：注释对象

如下图，左边是 HTML 文档内容，右边是 DOM 树

![1668796698067](./\day02-前端Web-JavaScript.assets\1668796698067.png) 

那么我们学习DOM技术有什么用呢？主要作用如下：

- 改变 HTML 元素的内容
- 改变 HTML 元素的样式（CSS）
- 对 HTML DOM 事件作出反应
- 添加和删除 HTML 元素

从而达到动态改变页面效果目的，具体我们可以查看代码中提供的 `11. JS-对象-DOM-演示.html` 来体会DOM的效果。



### 5.3.2 DOM对象

- DOM对象：浏览器根据HTML标签生成的JS对象
  - 所有的标签属性都可以在这个对象上面找到
  - 修改这个对象的属性，就会自动映射到标签身上

- DOM的核心思想：将网页的内容当做对象来处理

- document对象
  - 网页中所有内容都封装在document对象中
  - 它提供的属性和方法都是用来访问和操作网页内容的，如：document.write(…)

- DOM操作步骤:
  - 获取DOM元素对象
  - 操作DOM对象的属性或方法 (查阅文档)

​	

### 5.3.3 获取DOM对象

我们可以通过如下两种方式来获取DOM元素。

1. 根据CSS选择器来获取DOM元素，获取到匹配到的第一个元素：`document.querySelector('CSS选择器');`
2. 根据CSS选择器来获取DOM元素，获取匹配到的所有元素：`document.querySelectorAll('CSS选择器');`

​	 注意：获取到的所有元素，会封装到一个NodeList节点集合中，是一个伪数组（有长度、有索引的数组，但是没有push、pop等数组方法）



PS：在早期的JS中，我们也可以通过如下方法获取DOM元素（了解）。

| 函数                              | 描述                                     |
| --------------------------------- | ---------------------------------------- |
| document.getElementById()         | 根据id属性值获取，返回单个Element对象    |
| document.getElementsByTagName()   | 根据标签名称获取，返回Element对象数组    |
| document.getElementsByName()      | 根据name属性值获取，返回Element对象数组  |
| document.getElementsByClassName() | 根据class属性值获取，返回Element对象数组 |



接下来我们通过VS Code中创建名为 	`12. JS-对象-DOM-获取元素.html` 的文件来演示上述api，首先在准备如下页面代码：

~~~html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS-对象-DOM</title>
</head>

<body>
    <span id="sid">DOM元素1</span>
    <span class="txt">DOM元素2</span>
    <span class="txt">DOM元素3</span>

    <script>
        //根据CSS选择器获取DOM元素, 获取到匹配的第一个元素
        let s1 = document.querySelector('#sid');
        console.log(s1);
	    
        //根据CSS选择器获取DOM元素, 获取到匹配的所有元素
        let s2 = document.querySelectorAll('.txt');
        s2.forEach(s => console.log(s))
    </script>
</body>

</html>
~~~





- 操作属性

  那么获取到标签了，我们如何操作标签的属性呢？通过查询文档资料，如下图所示：

  ![1668800047162](./\day02-前端Web-JavaScript.assets\1668800047162.png) 

  得出我们可以通过div标签对象的innerHTML属性来修改标签的内容。此时我们想把页面中的**传智教育替换成传智教育666**，所以要获取2个div中的第一个，所以可以通过下标0获取数组中的第一个div，注释之前的代码，编写如下代码：

  ~~~js
  //根据CSS选择器获取DOM元素, 获取到匹配的第一个元素
  let s1 = document.querySelector('#sid');
  console.log(s1);
  s1.innerHTML = '传智教育 666'
  ~~~

  浏览器刷新页面，展示效果如下图所示：

  ![image-20231119120955178](./\day02-前端Web-JavaScript.assets\image-20231119120955178.png) 

  发现页面内容变成了传智教育666



完整代码如下：

~~~html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS-对象-DOM</title>
</head>

<body>
    <span id="sid">DOM元素1</span>
    <span class="txt">DOM元素2</span>
    <span class="txt">DOM元素3</span>

    <script>
        //根据CSS选择器获取DOM元素, 获取到匹配的第一个元素
        let s1 = document.querySelector('#sid');
        console.log(s1);
        s1.innerHTML = '传智教育 666'

        //根据CSS选择器获取DOM元素, 获取到匹配的所有元素
        let s2 = document.querySelectorAll('.txt');
        s2.forEach(s => console.log(s))
    </script>
</body>

</html>
~~~







### 5.3.4 案例

鲁迅说的好，光说不练假把式，光练不说傻把式。所以接下来我们需要通过案例来加强对于上述DOM知识的掌握。需求如下2个：

#### 5.3.4.1 需求

需求：订单支付完成后，5秒之后跳转到系统首页（www.jd.com）

效果如下所示：

![未命名项目](./\day02-前端Web-JavaScript.assets\未命名项目.gif)

 



#### 5.3.4.2 分析

- 要实现倒计时效果，那其实倒计时，就是每1秒钟，执行一次，把数字往下减1，直到数据减为0 。所以，这里我们需要用到一个定时器：setInterval(...)
- 跳转网页，其实控制的地址栏的地址，那这里我们就需要通过 location 来设置地址栏的信息 。

​	

#### 5.3.4.3 实现

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .center {
            text-align: center;
            margin-top: 50px;
        }
    </style>
</head>

<body>
    <div class="center">
        您好, 支付完成, <span id="time">5</span> 秒之后将自动跳转至 <a href="https://www.jd.com">官网</a> 首页 ~
    </div>
	
    <script>
        //1. 获取时间对应的DOM元素
        let time = document.querySelector('#time');

        //2. 开启定时器, 每秒将时间往下减一 , 如果时间>0 , 更新DOM元素的内容 ; 如果时间 < 0 , 则跳转页面 ;
        count = time.innerHTML;
        let timer = setInterval(() => {
            count--;
            if (count > 0) {
                time.innerHTML = count;
            } else {
                clearInterval(timer);
                location.href = 'https://www.jd.com';
            }
        }, 1000);
    </script>
</body>
</html>
```





# 6. JS事件

## 6.1 事件介绍

如下图所示的百度注册页面，当我们用户输入完内容，百度可以自动的提示我们用户名已经存在还是可以使用。那么百度是怎么知道我们用户名输入完了呢？这就需要用到JavaScript中的事件了。

![1668802830796](./\day02-前端Web-JavaScript.assets\1668802830796.png) 



什么是事件呢？HTML事件是发生在HTML元素上的 “事情”，例如：

- 按钮被点击
- 鼠标移到元素上
- 输入框失去焦点
- 按下键盘按键
- ........

而我们可以给这些事件绑定函数，当事件触发时，可以自动的完成对应的功能。这就是事件监听。例如：对于我们所说的百度注册页面，我们给用户名输入框的失去焦点事件绑定函数，当我们用户输入完内容，在标签外点击了鼠标，对于用户名输入框来说，失去焦点，然后执行绑定的函数，函数进行用户名内容的校验等操作。JavaScript事件是js非常重要的一部分，接下来我们进行事件的学习。那么我们对于JavaScript事件需要学习哪些内容呢？我们得知道有哪些常用事件，然后我们得学会如何给事件绑定函数。

所以主要围绕2点来学习：

- 事件监听
- 常用事件



## 6.2 事件监听 

JS事件监听的语法: 

```
事件源.addEventListener('事件类型', 要执行的函数);
```

在上述的语法中包含三个要素: 

- 事件源: 哪个dom元素触发了事件, 要获取dom元素
- 事件类型: 用什么方式触发, 比如: 鼠标单击 click, 鼠标经过 mouseover
- 要执行的函数: 要做什么事



演示：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS-事件-事件绑定</title>
</head>

<body>
    <input type="button" id="btn1" value="点我一下试试1">
    <input type="button" id="btn2" value="点我一下试试2">
        
    <script>
        document.querySelector("#btn1").addEventListener('click', ()=>{
            alert("按钮1被点击了...");
        })
    </script>
</body>
</html>
```





JavaScript对于事件的绑定还提供了另外2种方式（早期版本）：

1). 通过html标签中的事件属性进行绑定

例如一个按钮，我们对于按钮可以绑定单机事件，可以借助标签的onclick属性，属性值指向一个函数。

~~~html
<input type="button" id="btn1" value="点我一下试试1" onclick="on()">
<script>
	function on(){
        alert('试试就试试')
    }
</script>
~~~



2). 通过DOM中Element元素的事件属性进行绑定

依据我们学习过得DOM的知识点，我们知道html中的标签被加载成element对象，所以我们也可以通过element对象的属性来操作标签的属性。

例如一个按钮，我们对于按钮可以绑定单机事件，可以通过DOM元素的属性，为其做事件绑定。

~~~html
  <body>
      <input type="button" id="btn1" value="点我一下试试1">
      
  <script>
      document.querySelector('#btn1').onclick = function(){
          alert("按钮2被点击了...");
      }
  </script>
  </body>
~~~



  整体代码如下：

  ~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS-事件-事件绑定</title>
</head>

<body>
    <input type="button" id="btn1" value="事件绑定1">
    <input type="button" id="btn2" value="事件绑定2">
    
    <script>
        document.querySelector("#btn1").addEventListener('click', ()=>{
            alert("按钮1被点击了...");
        })
		
        document.querySelector('#btn2').onclick = function(){
            alert("按钮2被点击了...");
        }
    </script>
</body>
</html>
  ~~~

  

  

  > **addEventListener 与 on事件 区别:** 
  >
  > - on方式会被覆盖，addEventListener 方式可以绑定多次，拥有更多特性，推荐使用 addEventListener . 







## 6.3 常见事件

上面案例中使用到了 `onclick` 事件属性，那都有哪些事件类型供我们使用呢？下面就给大家列举一些比较常用的事件属性: 

![image-20231119125817764](./\day02-前端Web-JavaScript.assets\image-20231119125817764.png) 



示例演示：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS-事件-常见事件</title>
</head>

<body>
    <form action="" style="text-align: center;">
        <input type="text" name="username" id="username">
        <input type="text" name="age" id="age">
        <input id="b1" type="submit" value="提交">
        <input id="b2" type="button" value="单击事件">
    </form>

    <br><br><br>

    <table width="800px" border="1" cellspacing="0" align="center">
        <tr>
            <th>学号</th>
            <th>姓名</th>
            <th>分数</th>
            <th>评语</th>
        </tr>
        <tr align="center">
            <td>001</td>
            <td>张三</td>
            <td>90</td>
            <td>很优秀</td>
        </tr>
        <tr align="center" id="last">
            <td>002</td>
            <td>李四</td>
            <td>92</td>
            <td>优秀</td>
        </tr>
    </table>



    <script>
        //click: 鼠标点击事件
        document.querySelector('#b2').addEventListener('click', () => {
            console.log("我被点击了...");
        })

        //mouseenter: 鼠标移入
        document.querySelector('#last').addEventListener('mouseenter', () => {
            console.log("鼠标移入了...");
        })

        //mouseleave: 鼠标移出
        document.querySelector('#last').addEventListener('mouseleave', () => {
            console.log("鼠标移出了...");
        })

        //keydown: 某个键盘的键被按下
        document.querySelector('#username').addEventListener('keydown', () => {
            console.log("键盘被按下了...");
        })

        //keydown: 某个键盘的键被抬起
        document.querySelector('#username').addEventListener('keyup', () => {
            console.log("键盘被抬起了...");
        })

        //blur: 失去焦点事件
        document.querySelector('#age').addEventListener('blur', () => {
            console.log("失去焦点...");
        })

        //focus: 元素获得焦点
        document.querySelector('#age').addEventListener('focus', () => {
            console.log("获得焦点...");
        })

        //input: 用户输入时触发
        document.querySelector('#age').addEventListener('input', () => {
            console.log("用户输入时触发...");
        })

        //submit: 提交表单事件
        document.querySelector('form').addEventListener('submit', () => {
            alert("表单被提交了...");
        })
    </script>
</body>

</html>
```



## 6.4 案例

### 6.4.1 表格隔行换色

需求：实现表格隔行换色效果，奇数行设置背景色为：  **#FBFBD4**，偶数行设置背景色为： **#D9D9FA** 。

效果：

![未命名项目2](./\day02-前端Web-JavaScript.assets\未命名项目2.gif)

分析：当鼠标引入表格，呈现一个颜色，离开之后颜色马上变为默认的白色了。 那这就涉及到鼠标移入事件 mouseenter、鼠标移出事件 mouseleave。

实现：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        table {
            /* 设置表格的宽度 */
            width: 60%;
            /* 将表格边框合并，消除单元格之间的间距 */
            border-collapse: collapse;
            /* 将表格边框间的距离设置为0，确保没有任何间距 */
            border-spacing: 0;
            /* 文本居中对齐 */
            text-align: center;
            /* 版心居中展示 */
            margin: auto;
            /* 距离顶部的外边距 */
            margin-top: 20px;
            /* 行高 */
            line-height: 30px;
            /* 字体 */
            font-family: 'Courier New', 华文中宋, monospace;
        }

        table,tr,th,td {
            /* 设置表格的边框 */
            border: 1px solid black;
        }

        h1 {
            /* 文本居中对齐 */
            text-align: center;
        }

        .footer_btn {
            /* 文本居中对齐 */
            text-align: center;
            margin-top: 10px;
        }
    </style>
</head>

<body>
    <h1 id="title">用户信息表</h1>

    <table>
        <tr>
            <th>编号</th>
            <th>姓名</th>
            <th>年龄</th>
            <th>性别</th>
            <th>爱好</th>
        </tr>
        <tr class="data">
            <td>1</td>
            <td>Tom</td>
            <td>18</td>
            <td>男</td>
            <td>Java , JS , HTML , Vue</td>
        </tr>
        <tr class="data">
            <td>2</td>
            <td>Cat</td>
            <td>12</td>
            <td>女</td>
            <td>Java , JS , HTML , Vue</td>
        </tr>
        <tr class="data">
            <td>3</td>
            <td>Lee</td>
            <td>21</td>
            <td>男</td>
            <td>Java , Vue</td>
        </tr>
        <tr class="data">
            <td>4</td>
            <td>Jerry</td>
            <td>19</td>
            <td>女</td>
            <td>JS , HTML , Vue</td>
        </tr>
        <tr class="data">
            <td>5</td>
            <td>Jack</td>
            <td>25</td>
            <td>男</td>
            <td>Java</td>
        </tr>
        <tr class="data">
            <td>6</td>
            <td>Jones</td>
            <td>22</td>
            <td>女</td>
            <td>HTML , Vue</td>
        </tr>
    </table>

    <script>
        //1. 获取表格中的数据行 DOM对象
        let trs = document.querySelectorAll('.data');

        //2. 判断, 如果是奇数行, 设置背景颜色为 #FBFBD4; 如果是偶数行, 设置背景颜色为: #D9D9FA
        for (let i = 0; i < trs.length; i++) {
            const tr = trs[i];
            tr.addEventListener('mouseenter', ()=> {
                if(i % 2 == 0){ //偶数
                    tr.style = "background-color: #D9D9FA";
                }else { //奇数
                    tr.style = "background-color: #FBFBD4";
                }
            })
            
            tr.addEventListener('mouseleave', ()=> {
                tr.style = "background-color: #FFFFFF";
            })
        }
    </script>
</body>

</html>
```





### 6.4.2 表单校验

**1). 需求：**完成用户注册的表单校验操作，要求做到以下两点。

1. 在表单项中输入完成，鼠标离开焦点时，进行表单项内容的校验，如果内容格式不正确，显示提示信息。

2. 在表单提交时，校验整个表单内容，如果内容格式有一项不正确，弹出提示信息，阻止表单数据提交。



**2). 效果：**

![未命名项目3](./\day02-前端Web-JavaScript.assets\未命名项目3-17003812871834-17003812906406.gif)



**3). 分析：**

1. JS的事件监听：离焦事件 blur，表单提交事件 submit

2. DOM对象操作 



**4). 实现：**

```html
<!DOCTYPE html>
<html>

<head>
    <title>表单</title>
    <style>
        label {
            display: inline-block;
            width: 80px;
            text-align: right;
            margin-right: 10px;
        }

        input {
            width: 250px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 10px;
        }

        .btn {
            width: 150px;
        }

        .tip {
            color: #ff0000;
            font-size: 12px;
        }
    </style>
</head>

<body>
    <div>
        <h1>用户注册</h1>
        <form>
            <label for="username">用户名：</label>
            <input type="text" id="username" name="username" placeholder="用户名不能为空且长度在4-16个字符">
            <span class="tip" id="name_msg"></span> <br>

            <label for="phone">手机号：</label>
            <input type="text" id="phone" name="phone" placeholder="手机号不能为空且长度为11位">
            <span class="tip" id="phone_msg"></span>
            <br>

            <input type="submit" value="提交" class="btn">
            <input type="reset" value="重置" class="btn">
        </form>
    </div>


    <script>
        //1. 校验用户名 - 失去焦点时校验 - blur
        function checkUsername(){ //true, 合法; false, 不合法;
            let flag = true;
            let usernameValue = document.querySelector('#username').value;
            let errMsg = "";
            if(usernameValue.length < 4 || usernameValue.length > 16){
                errMsg = "用户名不合法";
                flag = false;
            }
            document.querySelector('#name_msg').innerHTML = errMsg;
            return flag;
        }
        document.querySelector('#username').addEventListener('blur', checkUsername);


        //2. 校验手机号
        function checkPhone(){ //true, 合法; false, 不合法;
            let flag = true;
            let phoneValue = document.querySelector('#phone').value;
            let errMsg = "";
            if(phoneValue.length != 11 ){
                errMsg = "手机号不合法";
                flag = false;
            }
            document.querySelector('#phone_msg').innerHTML = errMsg;
            return flag;
        }
        document.querySelector('#phone').addEventListener('blur', checkPhone)


        //3. 表单提交的时候 - 校验整个表单 - submit
        document.querySelector('form').addEventListener('submit', function(event){
            //判断用户名及手机号是否合法, 如果不合法, 提示错误信息;
            if(!checkUsername() || !checkPhone()){
                alert('表单数据不合法');
                
                //组织表单默认的提交事件
                event.preventDefault();//组织事件的默认行为
            }
        })
    </script>
</body>

</html>
```



注意：JavaScript中，可以通过事件对象event中的preventDefault() 方法来阻止事件的默认行为，比如阻止表单提交。



虽然表单校验功能，我们基于DOM操作已经完成了，成功的校验了用户名和密码的长度，长度不符合条件，直接提示错误信息，并不允许表单提交，看似非常完美。但是大家可以想一想，对于手机号，是只要11位就可以了吗？ 如果出现如下的手机号，是合法的手机号吗？

- 12209120990
- 11009120990
- 1220912abcd

我们发现，上述的字符串，长度都是11位，但是却不是合法的手机号 。因为手机号，是需要符合特定规则的，比如全部都是数字，而且第一位，必须是1，第二位，可以是 3/4/5/6/7/8/9 ，然后后面是9位数字。

那我们应该如何来校验类似于手机号这种，特定规则的字符串呢？ 那此时呢，就需要通过正则表达式，来校验了，那接下来，我们就来学习正则表达式。







## 6.5 正则表达式

- 介绍：正则表达式（Regular Expression，也简称为正则），定义了字符串组成的规则。

- 作用：通常用来验证数据格式、查找替换文本 等。

- 定义：

  - 正则表达式字面量 （注意不要加引号）

    ```js
    const reg1 = /abc/;
    ```

  - 创建正则对象RegExp

    ```js
    const reg2 = new RegExp('abc');
    ```

- 方法：

  test(str)：判断指定字符串是否符合规则，符合返回true；不符合返回false。

- 语法：

  1. 普通字符：大多数的字符仅能描述它们本身，这些字符称作普通字符，比如字母和数字。

  2. 特殊字符：是一些具有特殊含义的字符，可以极大提高了灵活性和强大的匹配功能。

  3. 量词：表示要匹配的字符或表达式的数量。

| **符号** | **含义**                                                    |
| -------- | ----------------------------------------------------------- |
| ^        | 表示以谁开始                                                |
| $        | 表示以谁结束                                                |
| []       | 表示某个范围内的单个字符，如：[0-9]单个数字字符             |
| .        | 表示任意单个字符，除了换行和行结束符                        |
| \w       | 代表单词字符：字母、数字、下划线（\_），相当于[A-Za-z0-9\_] |
| \d       | 代表数字字符：相当于[0-9]                                   |
| \s       | 代表空格（包括换行符、制表符、空格等）                      |

| **符号** | **含义**               |
| -------- | ---------------------- |
| ?        | 零个或一个             |
| *        | 零个或多个             |
| +        | 一个或多个（至少一个） |
| {n}      | n个                    |
| {m,}     | 至少m个                |
| {m,n}    | 至少m个，最多n个       |



示例：

```html
  <script>
    let str1 = 'hello World';
    let str2 = '二哈很二o';
    let str3 = 'er哈就是很二o';
    let str4 = '二哈就是很二';

    console.log(/\w+/.test(str1)); //true
    console.log(/\w+/.test(str2)); //true
    console.log(/\w+/.test(str3)); //true
    console.log(/\w+/.test(str4)); //false

    const reg1 = /abc/;
    const reg2 = new RegExp('abc');
    console.log(reg1.test('my name is : abc')); //true
    console.log(reg2.test('my name is : abc')); //true
  </script>
```





基本的正则表达式的语法，我们已经掌握了，那接下来，我们就需要通过正则表达式来校验表单中用户名、手机号了。 具体代码如下：

```html
<!DOCTYPE html>
<html>

<head>
    <title>表单</title>
    <style>
        label {
            display: inline-block;
            width: 80px;
            text-align: right;
            margin-right: 10px;
        }

        input {
            width: 250px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 10px;
        }

        .btn {
            width: 150px;
        }

        .tip {
            color: #ff0000;
            font-size: 12px;
        }
    </style>
</head>

<body>
    <div>
        <h1>用户注册</h1>
        <form>
            <label for="username">用户名：</label>
            <input type="text" id="username" name="username" placeholder="用户名不能为空且长度在4-16个字符">
            <span class="tip" id="name_msg"></span> <br>

            <label for="phone">手机号：</label>
            <input type="text" id="phone" name="phone" placeholder="手机号不能为空且长度为11位">
            <span class="tip" id="phone_msg"></span>
            <br>

            <input type="submit" value="提交" class="btn">
            <input type="reset" value="重置" class="btn">
        </form>
    </div>


    <script>
        //在鼠标离开焦点时, 校验输入框内容的长度 .
        //校验用户名
        function checkUsername(){ //true, 合法; false, 不合法;
            let flag = true;
            let usernameValue = document.querySelector('#username').value;
            let errMsg = "";
            if(!/^\w{4,16}$/.test(usernameValue)){
                errMsg = "用户名不合法";
                flag = false;
            }
            document.querySelector('#name_msg').innerHTML = errMsg;
            return flag;
        }
        document.querySelector('#username').addEventListener('blur', checkUsername)


        //校验密码
         function checkPhone(){ //true, 合法; false, 不合法;
            let flag = true;
            let phoneValue = document.querySelector('#phone').value;
            let errMsg = "";
            if(!/^1[3-9]\d{9}$/.test(phoneValue)){
                errMsg = "手机号不合法";
                flag = false;
            }
            document.querySelector('#phone_msg').innerHTML = errMsg;
            return flag;
        }
        document.querySelector('#phone').addEventListener('blur', checkPhone)


        //在表单提交时, 判断是否所有的输入框输入的值合法 .
        document.querySelector('form').addEventListener('submit', (e)=> {
            if(!checkUsername() || !checkPhone()){
                alert('表单校验失败, 不能提交表单')
                e.preventDefault();
            }
        })

    </script>
</body>

</html>
```









# 7. JS模块化

**所谓JS模块化，指的是JS提供的一种，将JavaScript程序拆分位若干个可按需导入的单独模块的机制。** 

比如，我们前面实现的表单校验的案例，我们是可以把JS代码单独的抽取到一个js文件中，然后在html中引入对应的js文件即可，这样做，便于管理、提升代码的复用性。具体操作如下：



A. 定义一个js文件，命名位 `check.js`

```js
//在鼠标离开焦点时, 校验输入框内容的长度 .
//校验用户名
function checkUsername(){ //true, 合法; false, 不合法;
    let flag = true;
    let usernameValue = document.querySelector('#username').value;
    let errMsg = "";
    if(!/^\w{4,16}$/.test(usernameValue)){
        errMsg = "用户名不合法";
        flag = false;
    }
    document.querySelector('#name_msg').innerHTML = errMsg;
    return flag;
}
document.querySelector('#username').addEventListener('blur', checkUsername)


//校验密码
function checkPhone(){ //true, 合法; false, 不合法;
    let flag = true;
    let phoneValue = document.querySelector('#phone').value;
    let errMsg = "";
    if(!/^1[3-9]\d{9}$/.test(phoneValue)){
        errMsg = "手机号不合法";
        flag = false;
    }
    document.querySelector('#phone_msg').innerHTML = errMsg;
    return flag;
}
document.querySelector('#phone').addEventListener('blur', checkPhone)


//在表单提交时, 判断是否所有的输入框输入的值合法 .
document.querySelector('form').addEventListener('submit', (e)=> {
    if(!checkUsername() || !checkPhone()){
        alert('表单校验失败, 不能提交表单')
        e.preventDefault();
    }
})
```



B. 在html文件中，如果需要用到上述的JS代码，直接在 script 标签中引入该js即可。

```html
<!DOCTYPE html>
<html>

<head>
    <title>表单</title>
    <style>
        label {
            display: inline-block;
            width: 80px;
            text-align: right;
            margin-right: 10px;
        }

        input {
            width: 250px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 10px;
        }

        .btn {
            width: 150px;
        }

        .tip {
            color: #ff0000;
            font-size: 12px;
        }
    </style>
</head>

<body>
    <div>
        <h1>用户注册</h1>
        <form>
            <label for="username">用户名：</label>
            <input type="text" id="username" name="username" placeholder="用户名不能为空且长度在4-16个字符">
            <span class="tip" id="name_msg"></span> <br>

            <label for="phone">手机号：</label>
            <input type="text" id="phone" name="phone" placeholder="手机号不能为空且长度为11位">
            <span class="tip" id="phone_msg"></span>
            <br>

            <input type="submit" value="提交" class="btn">
            <input type="reset" value="重置" class="btn">
        </form>
    </div>


    <script src="./js/check.js"></script>
</body>

</html>
```



OK，那这是在html中，引入JS文件，可以直接使用 `<script src=".."></script>` 来引入。 那如果是在一个js文件中，我需要用到另外一个js文件中的方法呢。 那此时该如何实现呢 ？



那在JS中，就给我们提供了模块化导入、导出的操作，我们可以通过 `export` 关键字，来导出模块。 然后在别的需要用到的地方，通过 `import` 关键字导入模块。

如下所示：

A. `checkFn.js` 中定义是校验方法

在变量前面加上 `export` 代表，我们要将该变量、函数、对象导出为一个模块。别的js中要想使用，就可以  `import` 导入了。

```js
export function checkUsername(){ //true, 合法; false, 不合法;
  let flag = true;
  let usernameValue = document.querySelector('#username').value;
  let errMsg = "";
  if(!/^\w{4,16}$/.test(usernameValue)){
      errMsg = "用户名不合法";
      flag = false;
  }
  document.querySelector('#name_msg').innerHTML = errMsg;
  return flag;
}


export function checkPhone(){ //true, 合法; false, 不合法;
  let flag = true;
  let phoneValue = document.querySelector('#phone').value;
  let errMsg = "";
  if(!/^1[3-9]\d{9}$/.test(phoneValue)){
      errMsg = "手机号不合法";
      flag = false;
  }
  document.querySelector('#phone_msg').innerHTML = errMsg;
  return flag;
}
```



B. `check.js` 中定义的是校验的事件监听

那在check.js中需要用到 checkUsername、checkPhone函数，就可以通过 `import` 关键字将其导入进来。

```js
import {checkUsername, checkPhone} from './checkFn.js'

//1. 校验用户名 - 失去焦点时校验 - blur
document.querySelector('#username').addEventListener('blur', checkUsername)

//2. 校验手机号
document.querySelector('#phone').addEventListener('blur', checkPhone)

//3. 表单提交的时候 - 校验整个表单 - submit
document.querySelector('form').addEventListener('submit', function(event){
    //判断用户名及手机号是否合法, 如果不合法, 提示错误信息;
    if(!checkUsername() || !checkPhone()){
        alert('表单数据不合法');
        
        //组织表单默认的提交事件
        event.preventDefault();//组织事件的默认行为
    }
})
```



C. `xxx.html` 中就是html的基础代码样式

注意：如果我们使用到了 `export`, `import` 这种模块化的js，那在通过 `<script src="..."></script>` 在引入JS文件时，必须指定 `type="module"` 属性，表名我们使用的是模块化的JS。 如下所示：

```html
<!DOCTYPE html>
<html>

<head>
    <title>表单</title>
    <style>
        label {
            display: inline-block;
            width: 80px;
            text-align: right;
            margin-right: 10px;
        }

        input {
            width: 250px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 10px;
        }

        .btn {
            width: 150px;
        }

        .tip {
            color: #ff0000;
            font-size: 12px;
        }
    </style>
</head>

<body>
    <div>
        <h1>用户注册</h1>
        <form>
            <label for="username">用户名：</label>
            <input type="text" id="username" name="username" placeholder="用户名不能为空且长度在4-16个字符">
            <span class="tip" id="name_msg"></span> <br>

            <label for="phone">手机号：</label>
            <input type="text" id="phone" name="phone" placeholder="手机号不能为空且长度为11位">
            <span class="tip" id="phone_msg"></span>
            <br>

            <input type="submit" value="提交" class="btn">
            <input type="reset" value="重置" class="btn">
        </form>
    </div>

	<!-- 模块化JS引入方式，需要指定type="module" -->
    <script type="module" src="./js/check.js"></script>
</body>

</html>
```



**注意：如果使用模块的js，使用了 `export`，`import` ，要保证我们的代码，一定是在服务器端运行，而不是在磁盘中直接打开。 所以运行的时候，在VSCode中已经要右键选择 "Open with Live Server"。**



