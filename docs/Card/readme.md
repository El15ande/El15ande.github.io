# [React Framework: Card Page (Demo)](https://github.com/El15ande/El15ande.github.io/blob/master/docs/Card/Card.html)

Framework: React (JavaScript)  
Render: HTML/CSS

## Page structure

`mockData`: mocked data, the data should be JSON data from back end in reality [模拟后端JSON数据]  
`CardList_Component`: all cards rendered on the page, including all `Card_Component`s generated from data & a `NewCard_Component` [所有卡片的列表，包含所有数据产生的卡片和‘新建项目组’卡片]  
`Card_Component`: individual card, detailed structure in commment line 116 [单张卡片，卡片结构参考文件注释第116行]  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Card_Locked_SubComp`: sub-component for `isLocked` attribute [处理`isLocked`属性的亚组件]  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Card_Private_SubComp`: sub-component for `isPrivate` attribute [处理`isPrivate`属性的亚组件]  
`NewCard_Component`: card for creating a new card, function not implemented [创建新卡片的最后一张卡片，功能未实现]

## Known drawbacks

See comment line 185  
