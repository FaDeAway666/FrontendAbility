# 盒（Box）

源代码：标签 Tag

语义：元素 Element

表现：盒 Box

HTML代码中可以书写开始标签，结束标签，和自封闭标签

一对起止标签，表示一个元素

DOM树中存储的是元素和其他类型的节点（Node）

CSS选择器选中的是元素，在排版时可能产生多个盒

排版和渲染的基本单位是盒

## 盒模型

在排版的时候使用的基础单位

![image-20210222093328416](.\images\盒模型.png)

# 正常流

正常流参考的是印刷行业的默认规则

从左到右书写

同一行的文字是对齐的

一行写满了，换到下一行

正常流的排版：

- 收集盒和文字，进入一行
- 计算盒在行中的排布
- 计算行的排布

对齐规则

横向（IFC，行内级格式化上下文）

![image-20210222094536786](.\images\横向对齐.png)

纵向（BFC，块级格式化上下文）

![image-20210222094620501](.\images\纵向排版.png)

## 行级排布

基线baseline，决定了行内元素垂直排列的基准位置

line-top、line-bottom规定了一行的高度的上下限，base-line的垂直高度不能脱离这个范围

text-top和text-bottom则是决定字形的高度，字体大小不变，这两条线也不会改变，如果使用了多种字体混排，则text-top和text-bottom是由fontSize最大的字体来决定的

如果文字和盒进行混排，则会出现line-top或line-bottom偏移的问题，如果盒足够高，且以line-bottom为基准，则line-top会被撑开

如果inline-block中有文字，这个盒的基线是跟随其中文字进行变化的，所以一般这种情况，要给这个盒设定一个verticle-align

## 块级排布

float和clear：基于正常流的一种脱离正常流的元素排布方式

存在float元素的时候，原先行盒的宽度会被重新计算，也就是减去float元素所占据的宽度。

float不止影响它所在的那一行，而是其高度范围内有多少行，就会影响多少行。

如果在影响的行内又出现了一个新的float元素，新的float不会影响原先float的排列

clear属性：找一块没有浮动的位置，将设置该属性的元素移动到那个位置（right，left，both）

margin collapse

在正常流当中，同一个BFC内，当两个块级盒都具有四周的margin，上面的盒与下面的盒之间的margin会发生重叠，称为margin collapse，因为margin只需要一个块之间有规定的留白即可，而不是非要两个块之间的margin要进行叠加

## BFC

什么是Block

- Block Container：里面有BFC的
- Block-level Box：外面有BFC的
- Block Box：里外都有BFC的，是block container+block-level box

Block Container：

- block
- inline-block
- table-cell
- flex item
- grid cell
- table-caption

Block-level Box:

- display:block/inline-block
- display:flex/inline-flex
- display:table/inline-table
- display:grid/inline-grid
- ......

设立BFC

- float
- 绝对定位
- block containers
- 添加overflow属性的block box，属性值不为visible

BFC合并

- block box && overflow:visible
  - float环绕
  - 边距折叠，只会发生在一个BFC中