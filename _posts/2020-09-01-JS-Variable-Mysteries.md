---
layout: post
title: "JavaScript Variable Mysteries: Temporal Dead Zone & Hoisting (Remastered)"
date: 2020-9-1
---

###### _Keywords: ES6, Temporal Dead Zone, JS Variable Hoisting_

## Introduction

This is an updated blog based on my last year's article which briefly discusses the variable hoisting mechanism and Temporal Dead Zone (TDZ) in JS. It all starts with a code block:

```JavaScript
    console.log(x); //  undefined
    console.log(y); //  Uncaught ReferenceError: Cannot access 'y' before initialisation

    var x = 'foo';
    let y = 'bar';
```

Although `x` and `y` are (and should never be) used before they are declared and assigned, the difference between two declarations draws my attention. In this blog, I would like to re-share my understanding about JavaScript variables.

## Variable Basis

It has been 5 years since ECMAScript 2015 (better known as ES6) introduces the concept of <u>block-scoped</u> declaration `let`. Although ES6 haven't been seen as a JS programming essential, it is encouraged that different types of constants, variables and functions should be separated in order to [improve the code readability](https://github.com/airbnb/javascript#variables).

Firstly, there are 3 ways to directly declare a variable in JS:

1. `const foo = 'bar';`

    This declares an 'immutable' constant like `const` in C/C++ and `final` in Java. The address of this variable is fixed while its content is not limited, so some fixes below is acceptable (but not suggested):

    ```JavaScript
        const x = { foo: 'bar' };
        x.foo = 'baz';
        console.log(x.foo); //  'baz'

        const y = [1, 2];
        y[0] = 3;
        console.log(y); //  [3, 2]
    ```

2. `var foo = 'bar';`

    The scope of a `var` variable depends on its <u>current execution context</u>, which could be function-scoped if it is inside a function or global-scoped otherwise. It is also noticeable that assigning a value to an undeclared variable implicitly creates it as a global variable, so at least one of `const`, `var` or `let` should be used when declaring a variable.

3. `let foo = 'bar';`

    A `let` variable is block-scoped, which limits itself inside its belonging block:

    ```Javascript
        function f() {
            //  Function scope starts
            let foo = 'bar';
            console.log(foo);   //  bar
            if (1) {    //  If-statement scope starts
                let foo = 'baz';
                console.log(foo);   //  baz
            }   //  If-statement scope ends
            console.log(foo);   //  bar
        }   //  Function scope ends
    ```

Besides, a significat difference between JS and other language is <u>variable hoisting</u>. <u>Variable and function declarations are physically moved to the top of JS code</u>. As a result, the following code blocks are equal:

```JavaScript
    //  This block...
    foo = 'bar';    //  Initialisation
    console.log(foo);   //  'bar'
    var foo;    //  Declaration

    //  ...is equal to this block
    var foo;    //  Declaration hoisted
    foo = 'bar';    //  Initialisaiton
    console.log(foo);   //  'bar'
```

The hoisting mechanism may confuse many new JS programmers at the beginning as it does not follow the 'declare-initialise-use' flow in other languages. In fact, <u>JS put all variables & function declarations into the memory at the compilation stage, but does not change the code sequence (initialisation sequence)</u>. Thus, using a variable before it is initialised is still invalid:

```JavaScript
    console.log(foo);   //  undefined
    var foo;    //  Declaration hoisted at the top
    foo = 'bar';    //  Initialisation after it is used
```

## Temporal Dead Zone (TDZ)

Consider the following code in the global scope:

```Javascript
    console.log(foo1);  //   undefined
    var foo1 = 'bar';

    foo2 = 'barr';
    console.log(foo2);  //   'barr'
    var foo2;

    console.log(foo3);  //  Uncaught ReferenceError
    let foo3 = 'baz';

    console.log(foo4);  //  Uncaught ReferenceError
    let foo4;
    foo4 = 'bazz';
```

`foo1` is used before initialisation and thus should be `undefined` when it is logged. `foo2` is typical example of variable hoisting. On the other hand, `foo3` and `foo4` declare variables through `let` and they throw `ReferenceError`. <u>`let` variables are not initialised until their definition is evaluated</u>. Furthermore, consider `foo5` below:

```Javascript
    foo5 = 'foobar';
    console.log(foo5);  //  Uncaught ReferenceError
    let foo5;
```

The same `ReferenceError` indicates that <u>`let` variables are not hoisted</u>. When declaring a `let` variable, the zone between <u>the start of the block and the initialisation is processed</u> is called Temporal Dead Zone (TDZ). Variables in TDZ will always throw `ReferenceError` since it is in an uninitialised (aka temporal dead)
state. Furthermore, the existence of TDZ means that using `typeof` is not 100% safe anymore:

```JavaScript
    if(true) {  //  TDZ starts
        //  Using typeof on an undeclared variable results in undefined
        console.log(typeof x);  //   undefined

        //  TDZ continues
        console.log(foo);   //    Uncaught ReferenceError

        //  Using typeof on variables in TDZ results in UncaughtError
        console.log(typeof foo);    //  Uncaught ReferenceError

        let foo = 'bar';    //  Varible initialised, TDZ ends after the error is thrown
    }
```

Due to the existance of TDZ, variables used before initialisation are going to throw `ReferenceError`s, this motivates programmers to follow the 'declare-initialise-use' flow to create & use variables (which produces more modular & cleaner code).

## TDZ & Hoisting

The statement of `let` variables do not hoist is acutally an over-simplified summary: <u>these `let` variables do hoist themselves but throw errors when used before initialised, rather than return `undefined`</u>:

```Javascript
    let x = 'foo';

    if(true) {
        console.log(x); //  Uncaught ReferenceError
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

These declarations are not related to TDZ but referencing the basic properties of JS variables: if a variable is assigned a value, the value will be usable only after the assignment (not after created, like `foo1` or `foo3` above); If a variable is not assigned any values, the default value will be `undefined` (after exiting TDZ, the variables work in the same way):

```Javascript
    if(true) {
        //  TDZ
        let x;  //  TDZ ends
        //  The above equals to `let x = undefined`

        console.log(x); //  undefined
    }
```

## TDZ Inside A Function

TDZ mechanism appears in a lot of scenarios, one application is the default parameters of a function:

```Javascript
    function add(x = y, y = 0) {
        return x + y;
    }

    add(1,2);   //  3

    //  This equals to add(1, undefined)
    add(1); //   1

    add(undefined, 1);   //    Uncaught ReferenceError
    add();  //  Uncaught ReferenceError
```

The default parameters `x` & `y` are evaluated from left to right at the running stage, so `y` is in TDZ when `x` is evaluated which causes a `ReferenceError`. Please be aware that TDZ violations will not be reported by the compiler, but it will throw the error when `undefined` is passed to `x`, the similar scenatio is the IIFE version of this function:

```Javascript
    (function(x = y, y = 0) {
        return x + y;
    }(1,2));    //  3

    (function(x = y, y = 0) {
        return x + y;
    }(undefined, 1));   //  Uncaught ReferenceError
```

Furthermore, the `let x = x` situation also causes the TDZ violation:

```Javascript
    function cube(x = x) {
        return x * x * x;
    }

    cube(2);    // 8
    cube(); //  Uncaught ReferenceError

    //  ...or the IIFE version
    (function(x = x) {
        return x * x * x;
    }(2));  //    8

    (function(x = x) {
        return x * x * x;
    }());   //  Uncaught ReferenceError
```

An interesting scenario is that: what if the default parameter is given at the outside of the scope by the `let` variable? The answer is that it also causes the TDZ violation as <u>default parameters are evaluated in an intermediate scope</u>:

```Javascript
    let foo = 42;

    (function(x = foo, foo) {
        return x + foo;
    }(1,2));    //  3

    (function(x = foo, foo) {
        //  foo is undefined is this scope;
        return x + foo;
    }(1));  //   NaN

    (function(x = foo, foo) {
        return x + foo;
    }());   //    Uncaught ReferenceError
```

My personal suggestion is <u>not to bind variables as the default parameters</u> and <u>be careful of the variable scope where TDZ might exist</u>. Also, JS classes will also produce TDZ, if you are interested in this topic, please proceed to [this article](http://jsrocks.org/2015/01/temporal-dead-zone-tdz-demystified).

## Reference & Related Readings

[MDN developer guide: var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)  
[MDN developer guide: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)  
[MDN developer guide: hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)  
[MDN developer guide: TDZ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Temporal_dead_zone)  
[JS Rocks blog: TDZ demystified](http://jsrocks.org/2015/01/temporal-dead-zone-tdz-demystified)  
[知乎专栏: 我用了两个月的时间才理解 let](https://zhuanlan.zhihu.com/p/28140450)  
[Note 6. ES6: default values of parameters](http://dmitrysoshnikov.com/ecmascript/es6-notes-default-values-of-parameters)  
[JavaScript variable lifecycle: why let is not hoisted](https://dmitripavlutin.com/variables-lifecycle-and-why-let-is-not-hoisted/)