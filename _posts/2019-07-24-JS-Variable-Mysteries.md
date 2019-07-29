---
layout: post
title: "JavaScript Variables Mysteries: Hoisting & Temporal Dead Zone"
date: 2019-7-24
---
<hr>
###### _Keyword: ES6, JavaScript Hoisting, Temporal Dead Zone_

## Long rest since my last blog

Recently I have worked on SaaS front-end issues (using JavaScript libraries/frameworks such as Bootstrap & Vue.js). After fixing a series of bugs caused by the 'mysterious' hoisting mechanism, I am confused with 'What should we use when we declare different types of variables/functions?' & 'How should we avoid referencing `undefined` or `ReferenceError`s?' and I decide to take a research on these questions.  
In this blog I would like to share how hoisting works in JavaScript & what are the proper ways to use `const`, `var` & `let`.

## JavaScript variable basis (easy :) )

It has been 4 years since ES6 introduced the definition of block-scoped (`const` & `let`) & global/function-scoped (`var`) variables, though ES6 is [STILL not supported by some compilers & browsers](http://kangax.github.io/compat-table/es6/), it is highly recommanded for JavaScript newbies to understand how to use `let` properly and how their variables/functions are hoisted. In my opinion, using `var`s everywhere is absolutely correct (concerning unstable environments), but it is better to separate different types of constants/variables (or even functions) apart in order to [improve code readability](https://github.com/airbnb/javascript#variables--const-let-group).

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

This is a simplified translation of the Chinese version below, if you have any suggestions, questions or found any bugs/grammar mistakes about this blog, please email me and I am happy to answer (or fix this blog :) )

Suggested further readings:  
[Zhihu: understand `let` in 2 months (Chinese)](https://zhuanlan.zhihu.com/p/28140450)  
[Note 6. ES6: default values of parameters](http://dmitrysoshnikov.com/ecmascript/es6-notes-default-values-of-parameters)  
[JavaScript variable lifecycle: why let is not hoisted](https://dmitripavlutin.com/variables-lifecycle-and-why-let-is-not-hoisted/)

<hr>
###### _关键词: ES6, JavaScript变量提升, 暂存死区(TDZ)_

## 重启博客...

由于最近的工作接触了一些SaaS前端的问题(主要是JS和框架的开发和bug修复), 在修复了一些由于变量提升(hoisting)和变量域(scope)的bug之后, 我对JS中`var`, `let`和`const`的使用产生了疑惑: 如何确定变量的作用域? / 应该如何使用变量以确保最模块化(modular)的JS代码? / 如何最大限度的避免`ReferenceError`和引用`undefined`? 以下的内容中将分享一些我对于JS变量的理解.

## JS常量变量基础

## 暂存死区 (TDZ)

## TDZ与Hoisting

## 函数TDZ: 默认参数

## 反思与总结