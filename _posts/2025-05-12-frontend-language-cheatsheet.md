---
layout: post
title: "Frontend Language Cheatsheet"
excerpt: "My cheatsheet to Dart & JavaScript/TypeScript"
---

TLDR - This is a cheatsheet of frontend programming languages, mainly **JavaScript/TypeScript and Dart**. Contents are indexed (in alphabetical order) and served in Chinese or English. If you are interested in this document, you can get started by checking the [Keywords](#keywords--关键词列表).<br>
摘要 - 本文是我对前端开发语言（主要以JavaScript/TypeScript与Dart为主）。文章的内容将以类似词典的结构(首字母排序)以中英文列出，如果您对本文感兴趣，可以从[关键词列表](#keywords--关键词列表)章节开始查看。

## PROGRESS | 施工进度

## KEYWORDS | 关键词列表

**Variables \| 变量**

#### [General] Variable Declaration | 变量声明

| Language | Declaration keyword | Description |
| :---: | :---: | --- |
|**JavaScript**|[`var`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)|Declare a global-scoped or function-scoped, re-assignable variable.<br>声明一个全局/函数域变量。|
||[`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)|Declare a block-scoped, re-assignable variable.<br>声明一个块级域变量。|
||[`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)|Declare a block-scoped constant which is not directly re-assignable; If the constant is an [object](), its properties can be updated.<br>声明一个块级域常量，常量无法重新赋值，但常量[对象]()的属性可以被更改。|
|**Dart**|[`var`](https://dart.dev/language/variables)<br>Type-as-Declaration|Declare a [non-nullable](), lexical-scoped variable.<br>声明一个[不可null]()的动态域变量。|

#### [Dart] Variable Declaration Modifiers | 变量声明修饰符

- Nullable modifier \| 可null变量 `<type>?`: Declare a [nullable]() variable.
- Late modifier \| 延迟声明变量 `late <type>`: Declare a [non-nullable] variable that is guaranteed to be initialised after its declaration, or lazy initialise a variable.
- Constant \| 常量 `final` / `const`: Declare a constant.

#### [General] Variable Types (Object as base class) | 变量类型（对象基础类）

In JavaScript/TypeScript, an [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) represents the data type that stores **a collection of properties as key-value pairs**. It has the [prototype]() of `Object.prototype` (which has the prototype of `null`) and can be **created/initialised** through three ways: the **object initialiser** `{}`, [`Object.create()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create), or the [constructor]() function of a [class]() with the [`new`]() operator.

In Dart, the [`Object`](https://api.dart.dev/stable/latest/dart-core/Object-class.html) class is the base class for all Dart objects except `null`. It can be **created/initialised** through [`var` or type-as-declaration](#general-variable-declaration--变量声明).

#### [General] Variable Types (Primitives) | 变量类型（基础类型）

| Category | JavaScript/TypeScript | Dart | Description |
| :---: | :---: | :---: | --- |
|**Boolean**|`boolean` / [`Boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)|[`bool`](https://api.dart.dev/dart-core/bool-class.html)|A Boolean value, either `true` or `false`.|
|**Number**|`number` / [`Number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)<br>`bigint` / [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)|[`int`](https://api.dart.dev/stable/latest/dart-core/int-class.html)<br>[`double`](https://api.dart.dev/stable/latest/dart-core/double-class.html)|An integer or floating point number.|
|**String**|`string` / [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)|[`String`](https://api.dart.dev/stable/latest/dart-core/String-class.html)|A textual sequence.|
|**Null**|[`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null)|[`null`](https://api.dart.dev/stable/latest/dart-core/Null-class.html)|The absence of an object.<br>(In JavaScript/TypeScript) [`typeof null == object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#typeof_null)|
|**Symbol**|`symbol` / [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)|-|A unique identifier.|
|**undefined**|[`undefined`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)|-|The absence of a value.<br>`typeof undefined == undefined`|
