---
layout: post
title: "JavaScript Variables Mysteries: Temporal Dead Zone & Hoisting (Remastered)"
date: 2020-9-1
---

###### _Keywords: ES6, Temporal Dead Zone, JS Variable Hoisting_

## Introduction

This is an updated blog based on my last year's article which briefly discusses the variable hoisting mechanism and Temporal Dead Zone (TDZ) in JS. It all starts with an unfinished code block shown below:

```JavaScript
    console.log(x); //  'undefined'
    console.log(y); //  Uncaught ReferenceError: Cannot access 'y' before initialisation

    var x = 'foo';
    let y = 'bar';
```

## Variable Basis

## Temporal Dead Zone (TDZ)

## TDZ & Hoisting

## TDZ inside a function

## Conclusion