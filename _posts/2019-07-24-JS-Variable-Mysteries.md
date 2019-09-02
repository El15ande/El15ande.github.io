---
layout: post
title: "JavaScript Variables Mysteries: Hoisting & Temporal Dead Zone"
date: 2019-7-24
---
<hr>
###### _关键词: ES6, JavaScript变量提升, 暂存死区(TDZ)_

## 重启博客...

由于最近的工作接触了一些SaaS前端的问题(主要是JS和框架的开发和bug修复), 在修复了一些由于变量提升(hoisting)和变量域(scope)的bug之后, 我对JS中`var`, `let`和`const`的使用产生了疑惑: 如何确定`let`变量的作用域? / 应该如何使用变量以确保最模块化(modular)的JS代码? / 如何最大限度的避免`ReferenceError`和引用`undefined`? 以下的内容中将分享一些我对于JS变量的理解.

## JS常量变量基础 (浅水区)

自ES6标准引入了函数作用域(function-scoped)变量`const`和`let`已经过去了4年. 即使ES6仍不能做到100%代替ES5([兼容问题链接](http://kangax.github.io/compat-table/es6/)), 但我个人认为现在新入坑的JS程序员也应该把如何使用`let`以及hoisting的基本机制做为入门的基本知识而不仅仅只使用`var`来定义变量. 当然, 单纯的使用`var`能够保证在不稳定运行环境(比如SAFARI)的稳定性, 但随着版本的更新迭代我们更应该提升代码的安全性, 高效性和可读性, 而`let`就可以帮助我们做到这一点.

首先是一些基本的概念: JS使用的是动态类型的概念, 变量的类型由所赋的值决定. 在ES6标准中有3种变量声明方式:

1. `const`, 被`const`定义的变量本身无法修改, 可以近似看作不变的(immutable)常量, 如同C++中的`const`或者Java中的`final`. 但实际上`const`对象和数组的属性或元素是可以被改变的, 无法被改变的应是`const`指针指向的地址(不确定, 如有错误请指正):
    ```Javascript
        const x = { foo: 'bar' };
        x.foo = 'baz';
        console.log(x.foo); // -> baz

        const y = ['foo', 'bar'];
        y[1] = 'baz';
        console.log(y); // -> ['foo', 'baz']
    ```

2. `var`, 被`var`定义的变量的作用域位于<u>当前执行环境的域中</u>, 在函数中定义的被称作函数域变量(function-scoped), 其余未使用`var`关键字定义的(或赋值给未声明变量的值)和定义于全局域的被称作全局变量(global-scoped). 所以当声明变量的时候建议至少使用`const`, `var`或者`let`之一的关键字进行定义.

3. `let`, 被`let`定义的变量被称作块级作用域(block-scoped), 作用域的问题将在TDZ里讨论. 唯一需要注意的是`const`和`let`变量不会为`window`对象创建属性, 而全局级的`var`则会:
    ```Javascript
        var x = 1;
        let y = 2;
        console.log(window.x); // -> 1
        console.log(window.y); // -> undefined
    ```

除此之外, JS和其他语言还有一个不同的地方在于变量提升: JS中变量和函数的声明(declaration)会在编译时就被放入内存中, 也就是所谓'物理层面移动到代码的最顶端'. 所以在JS中, 以下的写法:
```Javascript
    foo = 'bar'; // Initialisation
    console.log(foo); // -> bar
    ...
    var foo; // Declaration
```
和:
```Javascript
    var foo; // Declaration hoisted at the top
    ...
    foo = 'bar'; // Initialisation
    console.log(foo) // -> bar
```
都是正确的. 需要注意的是所有的变量仍然遵守'赋值后使用', 所以下面这种写法:
```Javascript
    console.log(foo); // -> undefined
    var foo; // Declaration hoisted at the top
    foo = 'bar' // Initialisation after it is used
```
依旧会报错. 另一个需要注意的点是:
```Javascript
    var foo = 'bar';
```
是直接赋值(initialisation), 所以这种变量并不会被提升, 以下的写法依旧会报错:
```Javascript
    var x = 1; // Initialisation
    console.log(x + "&" + y) // -> 1&undefined
    var y = 2; // Initialisation that is not hoisted
```

## 暂存死区 (TDZ) (深水区)

假设以下代码位于全局中:
```Javascript
    console.log(foo1); // -> undefined
    var foo1 = 'bar';

    foo2 = 'barr'
    console.log(foo2); // -> 'barr'
    var foo2;

    console.log(foo3); // Uncaught ReferenceError
    let foo3 = 'baz';

    console.log(foo4); // Uncaught ReferenceError
    let foo4;
    foo4 = 'bazz';
```
`foo1`在未被赋值前就被使用, 所以会在使用时打印出`undefined`(`var`变量未被赋值时的默认值), `foo2`是之前提到的变量提升的一个很典型的例子.  
但重点在于使用`let`声明的`foo3`和`foo4`: 它们报了`ReferenceError`错, 这说明了_`let`<u>变量语句在未被执行前无法被初始化</u>. 更进一步的说:
```Javascript
    foo5 = 'foobar';
    console.log(foo5); // Uncaught ReferenceError
    let foo5;
```
`foo5`同样报错, 这便是`let`变量的特性: _`let`<u>变量不会被提升</u>. 在一个作用域中声明了`let`变量时, <u>从作用域生效到变量声明语句</u>之间的时间被称作<u>暂存死区(Temporal Dead Zone (TDZ))</u>, 在一个变量的TDZ中使用这个变量或使用`typeof`会抛出`ReferenceError`, 因为该变量处在未被声明的阶段(uninitialised state):
```Javascript
    if(true) { //TDZ starts
        // Using typeof on an undeclared variable results in undefined
        console.log(typeof x); // -> undefined

        ... // TDZ continues
        console.log(foo); // Uncaught ReferenceError

        // Using typeof on variables in TDZ results in UncaughtError
        console.log(typeof foo);// Uncaught ReferenceError

        let foo = 'bar'; // Varible initialised, TDZ ends
    }
```
TDZ的存在会让未遵守'声明-赋值-使用'流的变量抛出错误, 这也促使JS程序员们在按照正常的流程定义变量的同时保证了代码的模块化和整洁性.

到这里为止, 我建议JS新手们在chrome或者编辑器里尝试一下以上的代码, 了解`let`和`var`的机制, 然后喝杯咖啡休息一下. 因为以下有关JS语言环境的内容会打乱这些最基本的认知, 很容易把自己绕糊涂, 如果你是一名老JS程序员或者你对`let`的定义更感兴趣, 请看下一部分.

## TDZ和提升的关系 (深海)

先从TDZ开始, 对JS了解的程序员可能会认为`let`和`var`的区别在于作用域和会不会在代码执行(execution)时被提升. 但实际上根据ES6给出的定义以及一些民间的讨论, 现在流行的说法是_`let`<u>变量一样会被提升, 但不会返回值而是直接扔出错误</u>, 证据来源于以下的代码:
```Javascript
    let x = 'foo';
    if(true) {
        console.log(x); // Uncaught ReferenceError
        let x = 'foobar';
    }
```
在执行时, 内区块的`x`会被提升到内区块的顶端做为第一条语句, 提升导致了`x`处于了TDZ之中从而报错. 这同样的得到了官方文档的支持: [(ES6文档13.3.1 (英文))](http://www.ecma-international.org/ecma-262/6.0/#sec-let-and-const-declarations):

> `let` and `const` declarations define variables that are scoped to the running execution context’s LexicalEnvironment.  
> -> `let`和`const`声明定义了被限制在执行环境的LexicalEnvironment中的变量  

这之中的`LexicalEnvironment`代指该变量能被使用的语义环境.

> The variables are created when their containing Lexical Environment is instantiated but may not be accessed in any way until the variable’s LexicalBinding is evaluated.  
> -> 当该变量所在的语义环境被初始化时, 该变量也被创建, 但直到语义绑定被执行时才能被访问/使用

这个定义证明了这些变量的确会在其作用域被创建时被提升, 而从创建作用域到语句执行(即语义绑定)的这一段时间即是TDZ(无法被访问).

> A variable defined by a LexicalBinding with an Initializer is assigned the value of its Initializer’s AssignmentExpression when the LexicalBinding is evaluated, not when the variable is created.  
> -> 如果一个变量的语义绑定有初始值, 这个初始值的赋值表达式会在语义绑定执行时被赋予对应的变量(变量值可以是函数或其他变量,所以这里使用表达式一说), 而不是在该变量被创建时赋值给它.  

> If a LexicalBinding in a `let` declaration does not have an Initializer the variable is assigned the value `undefined` when the LexicalBinding is evaluated.  
> -> 如果`let`变量在语义绑定时没有初始值, 那么该变量初始值为`undefined`.  

这些定义跟语义环境无关, 但它们定义了变量的初始化行为和默认初始值: 如果一个变量被赋值, 这个值/变量只能在这条语句后被使用(比如上面的`foo1`和`foo3`), 没有赋值的变量则会被初始化为`undefined`:
```Javascript
    if(true) {
        // TDZ
        let x; // TDZ ends
        // The above equals to `let x = undefined`

        console.log(x); // -> undefined
    }
```

## 函数TDZ: 默认参数 (海沟)

TDZ在被引入之后直接被引用到了JS的许多存在域问题的地方, 其中一个例子就是函数默认参数(default parameters), 来看以下代码:
```Javascript
    function add(x = y, y = 0) {
        return x+y;
    }

    add(1,2) // -> 3

    //This equals to add(1, undefined)
    add(1) // -> 1

    add(undefined, 1) // Uncaught ReferenceError
    add() // Uncaught ReferenceError
```
`x`和`y`的值在执行时会从左到右被检验, 而`y`处在传参区的TDZ中(函数的传参区也是块级域), 从而导致`ReferenceError`, 这本身不是错误的写法, 而是实际传参时将`undefined`传向`x`时才会出现的运行错误, 同样的错误也会出现在IIFE中:
```Javascript
    (function(x = y, y = 0) {
        return x+y;
    }(1,2)); // -> 3

    (function(x = y, y = 0) {
        return x+y;
    }(undefined, 1)); // Uncaught ReferenceError
```
另一方面, 类似`let x = x`的语句也会产生TDZ从而报错:
```Javascript
    function cube(x = x) {
        return x*x*x;
    }

    cube(2); // -> 8
    cube(); // Uncaught ReferenceError

    //...or the IIFE version
    (function(x = x) {
        return x*x*x;
    }(2)) // -> 8

    (function(x = x) {
        return x*x*x;
    }()) // -> Uncaught ReferenceError
```
而会让大部分人迷惑的一点是: 即使是在全局作用域下的`let`变量也会导致TDZ错误. 这也是因为默认函数的作用域原因:
```Javascript
    let foo = 42;

    (function(x = foo, foo) {
        return x+foo;
    }(1,2)); // -> 3

    (function(x = foo, foo) {
        //foo is undefined is this scope;
        return x+foo;
    }(1)); // -> NaN

    (function(x = foo, foo) {
        return x+foo;
    }()); // Uncaught ReferenceError
```
综上所述, 对于函数的默认参数尽量避免使用变量从而产生错误, 同时也要小心可能产生的TDZ.

## 反思与总结

变量的作用域和TDZ在能够帮助程序员构建更整洁的代码的同时也可能会使得代码报错, 这也使得程序员们在构建局部变量时需要考虑更全面. 回到刚开始的问题 (长求总):  
1. `let`变量的作用域和错误问题: 保证不在TDZ中使用这个变量, 遵守先声明/赋值再使用的正常流以防止`undefined`或者`ReferenceError`.
2. 保证模块化: 如果保证整洁性就更注重`let`; 如果保证优化(有研究表明`let`相比`var`更慢, 出处不定请指正)和兼容性则使用`var`. 在ES6的前提下先确定变量的范围(是否需要export, 是否要多次使用).

导读及索引:  
[MDN开发指南: var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)  
[MDN开发指南: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)  
[MDN开发指南: hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)  
[MDN开发指南: TDZ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Temporal_dead_zone)  
[JS Rocks blog: TDZ demystified](http://jsrocks.org/2015/01/temporal-dead-zone-tdz-demystified)  
[思否blog: understanding ES6 TDZ](https://segmentfault.com/a/1190000008213835)  
[知乎专栏: 我用了两个月的时间才理解 let](https://zhuanlan.zhihu.com/p/28140450)  
[Note 6. ES6: default values of parameters](http://dmitrysoshnikov.com/ecmascript/es6-notes-default-values-of-parameters)  
[JavaScript variable lifecycle: why let is not hoisted](https://dmitripavlutin.com/variables-lifecycle-and-why-let-is-not-hoisted/)  

###### _El15ande, 深圳_
<hr>
###### _Keyword: ES6, JavaScript Hoisting, Temporal Dead Zone_

## Long rest since my last blog

Recently I have worked on SaaS front-end issues (using JavaScript libraries/frameworks such as Bootstrap & Vue.js). After fixing a series of bugs caused by the 'mysterious' hoisting mechanism, I am confused with 'What should we use when we declare different types of variables/functions?' & 'How should we avoid referencing `undefined` or `ReferenceError`s?' and I decide to take a research on these questions.  
In this blog I would like to share my understanding about JavaScript variables & TDZ.

## JavaScript variable basis (easy :) )

It has been 4 years since ES6 introduced the definition of block-scoped (`const` & `let`) & global/function-scoped (`var`) variables, though ES6 is [STILL not supported by some compilers & browsers](http://kangax.github.io/compat-table/es6/), it is highly recommanded for JavaScript newbies to understand how to use `let` properly and how their variables/functions are hoisted. In my opinion, using `var`s everywhere is absolutely correct (concerning unstable environments like SAFARI), but it is better to separate different types of constants/variables (or even functions) apart in order to [improve code readability](https://github.com/airbnb/javascript#variables--const-let-group).

As a simple reminder, there are 3 ways to declare Javascript variables:  
1. __`const foo = 'bar'`__  

    This declares an 'immutable' constant like `const` in C++ or `final` in Java. In fact, the attributes of the `const` object can be reassigned:
    ```Javascript
        const x = { foo: 'bar' };
        x.foo = 'baz';
        console.log(x.foo); // -> baz
    ```
    and the elements of the `const` array can be reassigned as well:
    ```Javascript
        const x = ['foo', 'bar'];
        x[1] = 'baz';
        console.log(x); // -> ['foo', 'baz']
    ```

2. __`var foo = 'bar'`__  

    The scope of `var` variable depends on <u>its current execution context</u>, which is function-scoped:
    ```Javascript
        funciton f() {
            var foo = 'bar';
            console.log(foo); // -> bar
        }
        console.log(foo); // -> Uncaught ReferenceError
    ```
    or global-scoped if it is declared outside any function. It is noticable that <u>assigning a value to an undeclared variable implicitly creates it as a global variable </u>([reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var#Description))_, so at least one of `const`, `var` or `let` should be used when declaraing a variable.

3. __`let foo = 'bar'`__  

    A `let` variable is block-scoped, which limited itself in its defined block:
    ```Javascript
        function f() {
            // Function scope starts
            let foo = 'bar';
            console.log(foo); // -> bar
            if (1) { // If-statement scope starts
                let foo = 'baz';
                console.log(foo); // -> baz
            } // If-statement scope ends
            console.log(foo); // -> bar
        } // Function scope ends
    ```
    it is also noticable that global `const` & `let` variables will not create properties for `window` object, while global `var` variables will.
    ```Javascript
        var x = 1;
        let y = 2;
        console.log(window.x); // -> 1
        console.log(window.y); // -> undefined
    ```
4. Hoisting: the conceptual definition of this semantic is: <u>variables & functions declarations are physically moved to the top of Javascript code</u>, so
    ```Javascript
        foo = 'bar'; // Initialisation
        console.log(foo); // -> bar
        ...
        var foo; // Declaration
    ```
    works when you run the code, because it equals to:
    ```Javascript
        var foo; // Declaration hoisted at the top
        ...
        foo = 'bar'; // Initialisation
        console.log(foo) // -> bar
    ```

The hoisting mechanism confuses many people at first (including me and my friends when we studied it) as it does not follow the 'declare-before-use' rule in other languages. In fact, <u>JavaScript put all variables & function declarations into the memory at the compilation stage, but does not change the code sequence (initialisation sequence)</u>, so using a variable before it is initialised is still invalid:  
```Javascript
    console.log(foo); // -> undefined
    var foo; // Declaration hoisted at the top
    foo = 'bar' // Initialisation after it is used
```

Notice that:
```Javascript
    var foo = 'bar';
```
is an initilisation, so this will not be hoisted, as shown in the following code:
```Javascript
    var x = 1; // Initialisation
    console.log(x + "&" + y) // -> 1&undefined
    var y = 2; // Initialisation that is not hoisted
```

Reference:  
[MDN developer guide: var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)  
[MDN developer guide: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)  
[MDN developer guide: hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)

## Temporal Dead Zone (still OK :| )

Consider the following code in the global scope:
```Javascript
    console.log(foo1); // -> undefined
    var foo1 = 'bar';

    foo2 = 'barr'
    console.log(foo2); // -> 'barr'
    var foo2;

    console.log(foo3); // Uncaught ReferenceError
    let foo3 = 'baz';

    console.log(foo4); // Uncaught ReferenceError
    let foo4;
    foo4 = 'bazz';
```
We can simply understand the code: `foo1` is used before initialisation and thus it should be `undefined` at the moment it is used, while `foo2` is a typical example of hoisting. `foo3` & `foo4` are both used before initialisation, but they throw `ReferenceError`, this indicates that _`let`\_<u>variables are not initialised until their definition is evaluated</u>. Furthermore, consider `foo5` below:
```Javascript
    foo5 = 'foobar';
    console.log(foo5); // Uncaught ReferenceError
    let foo5;
```
this indicates that _`let`\_<u>variables are not hoisted</u>. In fact, `let` variables are in Temporal Dead Zone (TDZ) <u>from the start of the block until the initialisation is processed</u>. Variables in TDZ will always throw `ReferenceError` as it is an uninitialised state, even using `typeof`:
```Javascript
    if(true) { //TDZ starts
        // Using typeof on an undeclared variable results in undefined
        console.log(typeof x); // -> undefined

        ... // TDZ continues
        console.log(foo); // Uncaught ReferenceError

        // Using typeof on variables in TDZ results in UncaughtError
        console.log(typeof foo);// Uncaught ReferenceError

        let foo = 'bar'; // Varible initialised, TDZ ends
    }
```

Due to the existance of TDZ, variables used before initialisation are going to throw `ReferenceError`s, this motivates new JavaScript programmers to follow the 'declare-initialise-use' flow to create & use variables (which produces more modular & cleaner code).

I would highly recommand new JavaScript programmers to type these codes in editors in order to understand how to use `var` & `let` properly, and stop here to grab a cup of coffee because the rest contents will focus on JavaScript lexical environment. However if you are curious about the mechanism of `let`, or you have been working on JavaScript for a long time, please proceed.

Reference:  
[MDN developer guide: TDZ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Temporal_dead_zone)

## TDZ towards hoisting (a bit hard :( )

Starting from TDZ, the statement of `let` variables do not hoist is acutally an over-simplified summary: <u>these variables hoist but throw errors when used before initialised, rather than return </u>`undefined`_, consider the following code:
```Javascript
    let x = 'foo';
    if(true) {
        console.log(x); // Uncaught ReferenceError
        let x = 'foobar';
    }
```
On execution, `x` inside the block is hoisted as the first statement in the block, this produces TDZ and the console statement in TDZ generates `ReferenceError` which seems reasonable. As ES6 standard explained in [13.3.1](http://www.ecma-international.org/ecma-262/6.0/#sec-let-and-const-declarations):  

> `let` and `const` declarations define variables that are scoped to [the running execution context](http://www.ecma-international.org/ecma-262/6.0/#sec-execution-contexts)’s [LexicalEnvironment](http://www.ecma-international.org/ecma-262/6.0/#sec-execution-contexts).  

the `LexicalEnvironment` represents the scope which the variables exist.  

> The variables are created when their containing Lexical Environment is instantiated but may not be accessed in any way until the variable’s LexicalBinding is evaluated.  

This proves that `const/let` variables do hoist at the moment of their scope is created, and the duration from the initialisation of the environment to the evaluation of variables is the TDZ (referenced as 'may not accessed in any way').

> A variable defined by a LexicalBinding with an Initializer is assigned the value of its Initializer’s AssignmentExpression when the LexicalBinding is evaluated, not when the variable is created.  

> If a LexicalBinding in a `let` declaration does not have an Initializer the variable is assigned the value `undefined` when the LexicalBinding is evaluated.  

These declarations are not related to TDZ but referencing the basic properties of JavaScript variables: if a variable is assigned a value, the value will be usable only after the assignment (not after created, like `foo1` or `foo3` above), if a variable is not assigned any values, the default value will be `undefined` (after exiting TDZ, the variables work in the same way):
```Javascript
    if(true) {
        // TDZ
        let x; // TDZ ends
        // The above equals to `let x = undefined`

        console.log(x); // -> undefined
    }
```

Reference:  
[JS Rocks blog: TDZ demystified](http://jsrocks.org/2015/01/temporal-dead-zone-tdz-demystified)  
[Segmentfault blog: understanding ES6 TDZ (Chinese)](https://segmentfault.com/a/1190000008213835)

## Function TDZ: default parameters (harder >:( )

TDZ mechanism appears in a lot of scenarios, one application is the default parameters of a function. Consider this function:
```Javascript
    function add(x = y, y = 0) {
        return x+y;
    }

    add(1,2) // -> 3

    //This equals to add(1, undefined)
    add(1) // -> 1

    add(undefined, 1) // Uncaught ReferenceError
    add() // Uncaught ReferenceError
```

The default parameters `x` & `y` are evaluated from left to right at the running stage, so `y` is in TDZ when `x` is evaluated which causes a `ReferenceError`. Please be aware that TDZ violations will not be reported by the compiler, but it will throw the error when `undefined` is passed to `x`, the similar scenatio is the IIFE version of this function:
```Javascript
    (function(x = y, y = 0) {
        return x+y;
    }(1,2)); // -> 3

    (function(x = y, y = 0) {
        return x+y;
    }(undefined, 1)); // Uncaught ReferenceError
```

Furthermore, the `let x = x` situation also causes the TDZ violation:
```Javascript
    function cube(x = x) {
        return x*x*x;
    }

    cube(2); // -> 8
    cube(); // Uncaught ReferenceError

    //...or the IIFE version
    (function(x = x) {
        return x*x*x;
    }(2)) // -> 8

    (function(x = x) {
        return x*x*x;
    }()) // -> Uncaught ReferenceError
```

An interesting scenario is, what if the default parameter is given at the outside of the scope by the `let` variable? The answer is that it also causes the TDZ violation as <u>default parameters are evaluated in an intermediate scope</u>:
```Javascript
    let foo = 42;

    (function(x = foo, foo) {
        return x+foo;
    }(1,2)); // -> 3

    (function(x = foo, foo) {
        //foo is undefined is this scope;
        return x+foo;
    }(1)); // -> NaN

    (function(x = foo, foo) {
        return x+foo;
    }()); // Uncaught ReferenceError
```

In conclusion, I suggest <u>not to bind variables as the default parameters</u> and <u>be careful of the variable scope where TDZ might exist</u>. Also, Javascript classes (`class`) will also produce TDZ, if you are interested in this topic, please proceed to [this article](http://jsrocks.org/2015/01/temporal-dead-zone-tdz-demystified).

## Introspection (ah finally)

The variables scopes & TDZ mechanism can be both helpful (providing error feedback when mixing scope) and dangerous (in cases of running stage errors), this enforces us to declare the global variables and scopes with more considerations and awareness. I was mixing `var`s and `let`s before I totally understand the scopes in JavaScript, and I would like to be more considerate of the scopes in order to write more modular and cleaner code.

Back to the starting questions (TLDR):
1. Avoiding `undefined` and errors: avoid using the variable in its TDZ, follow 'declare-assign-use' flow.
2. Making code modular: prefer `let` for clean code, prefer `var` for better performance (some says `let` costs more time than `var` to create a variable, please provide the resource if you know it :)) or compatibility. Be aware of the variable scope and choose the proper variable type under ES6 environment.

This is a simplified translation of the Chinese version above, if you have any suggestions, questions or found any bugs/grammar mistakes about this blog, please email me and I am happy to answer (or fix this blog :) )

Suggested further readings:  
[Zhihu: understand `let` in 2 months (Chinese)](https://zhuanlan.zhihu.com/p/28140450)  
[Note 6. ES6: default values of parameters](http://dmitrysoshnikov.com/ecmascript/es6-notes-default-values-of-parameters)  
[JavaScript variable lifecycle: why let is not hoisted](https://dmitripavlutin.com/variables-lifecycle-and-why-let-is-not-hoisted/)

###### _El15ande, Shenzhen_
