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

I would highly recommand new JavaScript programmers to try codes in editors and try to understand how to use `var` & `let` properly and stop here to grab a cup of coffee because the rest contents will focus on JavaScript lexical environment. However if you are curious about the mechanism of `let`, or you have been working on JavaScript for a long time, please proceed.

Reference:  
[MDN developer guide: TDZ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Temporal_dead_zone)

## TDZ towards hoisting (not OK :( )

Starting from TDZ, the statement of `let` variables do not hoist is acutally an over-simplified summary: <u>these variables hoist but throw errors when used before initialised, rather than return </u>`undefined`_, consider the following code:
```Javascript
    let x = 'foo';
    if(true) {
        console.log(x); // Uncaught ReferenceError
        let x = 'foobar';
    }
```
On execution, `x` inside the block is hoisted as the first statement in the block, this produces TDZ and the console statement in TDZ generates `ReferenceError` which seems reasonable. In fact, ES6 standard explained in [13.3.1](http://www.ecma-international.org/ecma-262/6.0/#sec-let-and-const-declarations):  

> `let` and `const` declarations define variables that are scoped to [the running execution context](http://www.ecma-international.org/ecma-262/6.0/#sec-execution-contexts)’s [LexicalEnvironment](http://www.ecma-international.org/ecma-262/6.0/#sec-execution-contexts).  

the `LexicalEnvironment` represents the scope which the variables exist.  

> The variables are created when their containing Lexical Environment is instantiated but may not be accessed in any way until the variable’s LexicalBinding is evaluated.  

This proves that `const/let` variables do hoist at the moment of their scope is created, and the duration from the initialisation of the environment to the evaluation of variables is the TDZ.

> A variable defined by a LexicalBinding with an Initializer is assigned the value of its Initializer’s AssignmentExpression when the LexicalBinding is evaluated, not when the variable is created. If a LexicalBinding in a let declaration does not have an Initializer the variable is assigned the value undefined when the LexicalBinding is evaluated.  

This is the declaration

<hr>
###### _关键词: ES6, JavaScript变量提升, 暂存死区(TDZ)_