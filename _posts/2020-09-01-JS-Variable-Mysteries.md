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

It has been 5 years since ECMAScript 2015 (better known as ES6) introduces the concept of __block-scoped__ declaration `let`. Although ES6 haven't been seen as a JS programming essential, it is encouraged that different types of constants, variables and functions should be separated in order to [improve the code readability](https://github.com/airbnb/javascript#variables--const).

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

    The scope of a `var` variable depends on its __current execution context__, which could be function-scoped if it is inside a function or global-scoped otherwise. It is also noticeable that assigning a value to an undeclared variable implicitly creates it as a global variable, so at least one of `const`, `var` or `let` should be used when declaring a variable.

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

4. Variable hoisting
    The conceptual definition of hoisting is:__variable and function declarations are physically moved to the top of JS code__. As a result, the following code blocks are equal:

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

    The hoisting mechanism may confuse many new JS programmers at the beginning as it does not follow the 'declare-assign-use' flow in other languages. In fact, __JS put all variables & function declarations into the memory at the compilation stage, but does not change the code sequence (initialisation sequence)__. Thus, using a variable before it is initialised is still invalid:

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

`foo1` is used before initialisation and thus should be `undefined` when it is logged. `foo2` is typical example of variable hoisting. On the other hand, `foo3` and `foo4` 

## TDZ & Hoisting

## TDZ inside a function

## Conclusion

## Reference

[MDN developer guide: var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)  
[MDN developer guide: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)  
[MDN developer guide: hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)