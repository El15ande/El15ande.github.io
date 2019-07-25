---
layout: post
title: "JavaScript Variables Mysteries: Hoisting & Temporal Dead Zone"
date: 2019-7-24
---
<hr>
<h6>Keyword: ES6, JavaScript Hoisting, Temporal Dead Zone</h6>

## Long rest since my last blog

Recently I have worked on SaaS front-end issues (using JavaScript libraries/frameworks such as Bootstrap & Vue.js). After fixing a series of bugs caused by the 'mysterious' hoisting mechanism, I am confused with 'What should we use when we declare different types of variables/functions?' & 'How should we avoid referencing `undefined` or `ReferenceError`s?' and I decide to take a research on these questions.  
In this blog I would like to share <u>how hoisting works in JavaScript</u> & <u>What are the proper ways to use</u> `const`, `var` & `let`.

## JavaScript variable basis

It has been 4 years since ES6 introduced the definition of block-scoped (`const` & `let`) & global/function-scoped (`var`) variables, though ES6 is [STILL not supported by some compilers & browsers](http://kangax.github.io/compat-table/es6/), it is highly recommanded for JavaScript newbies to understand how to use `let` properly and how their variables/functions are hoisted. In my opinion, <u>using </u>`var`<u>s everywhere is absolutely correct (concerning unstable environments), but it is better to separate different types of constants/variables (or even functions) apart in order to </u>[improve code readability](https://github.com/airbnb/javascript#variables--const-let-group)_

As a simple reminder, there are 3 ways to declare Javascript variables:  
1.  ```Javascript
        const foo = 'bar'
    ```
    This declares an 'immutable' constant like `const` in C++ or `final` in Java. In fact, the attributes of the `const` object can be reassigned:
    ```Javascript
        const x = { foo: 'bar' };
        x.foo = 'baz';
        console.log(x.foo); // baz
    ```
    And the elements of the `const` array can be reassigned as well:
    ```Javascript
        const x = ['foo', 'bar'];
        x[1] = 'baz';
        console.log(x); // ['foo', 'baz']
    ```

2.  ```Javascript
        var foo = 'bar'
    ```
    The scope of `var` variable depends on <u>its current execution context</u>, which is function-scoped:
    ```Javascript
        funciton f() {
            var foo = 'bar';
            console.log(foo); // bar
        }
        console.log(foo); // Uncaught ReferenceError
    ```
    Or global-scoped if it is declared outside any function. It is noticable that <u>assigning a value to an undeclared variable implicitly creates it as a global variable </u>([reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var#Description))_, so `var` is necessary for every variable declarations.

3.  ```Javascript
        let foo = 'bar'
    ```
    A `let` variable is block-scoped, which limited itself in its defined block:
    ```Javascript
        function f() {
            // Function scope starts
            let foo = 'bar';
            console.log(foo); // bar
            if (1) { // If-statement scope starts
                let foo = 'baz';
                console.log(foo); // baz
            } // If-statement scope ends
            console.log(foo); // bar
        } // Function scope ends
    ```
    It is also noticable that 

<br>
<hr>
<h6>关键词: ES6, JavaScript变量提升</h6>