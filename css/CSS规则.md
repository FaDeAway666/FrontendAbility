# 总论

CSS2.1规定CSS的总体结构，必须按照顺序书写

- @charset 编码方式
- @import 引入其他文件
- rules 可重复的规则，大部分都是在写这一部分
  - @media
  - @page 
  - rule

CSS的顶层样式表由两种规则组成的规则列表构成，一种是at-rules，另一种是qualified rules

CSS2.1的at-rules只有上面的四种

# 规则

## at-rules

@charset

用于提示css文件使用的字符编码方式，如果被使用，必须出现在最前面，这个规则只在给出语法解析阶段使用，并不影响页面的展示效果

@import

用于引入一个css文件，除了@charset规则不会被引入，@import可以引入一个css文件的全部内容（支持string，URL，media query形式）

@media

用于根据设备类型加载不同的样式

可用于响应式宽度，打印屏幕，retina屏幕判断

@fontface

用于设置字体

@page

用于在打印文档时修改某些css属性，兼容性，仅能修改部分和打印相关的属性，例如margin、orphans、

@counter-style（仅做了解）

用于自定义counter的样式，一个@counter-style规则定义了如何把一个计数器的值转化为字符串表示

```css
@counter-style <counter-style-name> {
    system: <counter system>
    symbols: <counter symbols>
    additive-symbols: <additive-symbols>
    negative: <negative symbol>
    prefix: <prefix>
    suffix: <suffix>
    range: <range>
    pad: <padding>
    speak-as: <speak-as>
    fallback: <counter-style-name>
}
```

常用的描述符：

[`system`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/system)

指定一个算法，用于将计数器的整数值转化为字符串表示。

[`symbols`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/symbols-descriptor)

定义一个符号，用于标记的表示。符号可以包含字符串，图片或自定义的识别码。这个符号怎样构建标记呢？这依赖于system描述符里面所定义的算法。 举个例子，如果system的值是fixed,那么symbols属性指定的固定的N个符号，将被用来表示计数器的前N个值。用完了前N个符号后，列表里剩下的值将使用fallback定义的样式来表示。

```css
@counter-style circled-alpha {
  system: fixed;
  symbols: Ⓐ Ⓑ Ⓒ Ⓓ Ⓔ Ⓕ Ⓖ Ⓗ Ⓘ Ⓙ Ⓚ Ⓛ Ⓜ Ⓝ Ⓞ Ⓟ Ⓠ Ⓡ Ⓢ Ⓣ Ⓤ Ⓥ Ⓦ Ⓧ Ⓨ Ⓩ;
  suffix: " ";
}

.items {
   list-style: circled-alpha;
}
```

会产生如下结果

Ⓐ One
Ⓑ Two
Ⓒ Three
Ⓓ Four
Ⓔ FIve
....
...
Ⓨ Twenty Five
Ⓩ Twenty Six

27 Twenty Seven
28 Twenty Eight
29 Twenty Nine
30 Thirty

@keyframes

描述css动画的中间步骤

@support

判断是否支持某CSS属性声明的at-rule

@namespace

## rules

CSS规则结构：

- 选择器

- 声明

  - key

    - properties

    - variable

      在父选择器中声明一个双减号开头的variable，就可以在子选择器中使用var()来使用这个variable

      ```css
      :root {
          --main-color: #06c;
      }
      
      #foo h1 {
          color: var(--main-color);
      }
      ```

  - value

    - function

      calc()/min()/max()

    - string/number/length/......

# 选择器

## 类型

- 简单选择器

  - `*`通用选择器
  - type  类型选择器，跟HTML标签，如果要选用非HTML的namespace中的标签，需要使用|（div svg|a）
  - . 类选择器
  - `#` id选择器
  - [attr=value] 属性选择器
  - : 伪类
  - :: 伪元素

- 复合选择器 （combined selector）

  - <简单选择器> <简单选择器> <简单选择器> ，这种写法是必须同时满足这些简单选择器，是一个与的关系
  - `*`或div必须写在最前面，伪类伪元素一定要写在最后面

- 复杂选择器

  使用连接符连接的复合选择器

  连接符种类：

  - 空格  后代选择器

    写在前面的复合选择器一定要是后面选择器的父选择器或祖先选择器

  - `>` 子元素选择器

    前面的选择器一定要是后面选择器的直接上级

  - `+` 相邻兄弟选择器

    两个选择器一定是相邻的，且具有相同的父节点

  - `~` 普通兄弟选择器

    两个选择器具有相同的父节点，是兄弟元素

`,`是不同选择器结构的连接，是‘或’的关系

## 优先级

按类型递增

类型选择器和伪元素 -> 类选择器，属性选择器，伪类 -> ID选择器

**通配选择符**（universal selector）（[`*`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Universal_selectors)）**关系选择符**（combinators）（[`+`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Adjacent_sibling_combinator), [`>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Child_combinator), [`~`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/General_sibling_combinator), ['` `'](https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_combinator), [`||`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Column_combinator)）和 **否定伪类**（negation pseudo-class）（[`:not()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:not)）对优先级没有影响。（但是，在 `:not()` 内部声明的选择器会影响优先级）。

使用计数的方法来界定优先级，去一个足够大的N，假设一个复合选择器的优先级为[0,1,2,3]

则S=`0*N^3+1*N^2+2*N+3`

## 伪类和伪元素

### 伪类

- 链接/行为
  - :any-link 匹配所有链接
  - :link :visited 匹配未访问过的链接/匹配访问过的链接
  - :hover 鼠标悬停
  - :active 激活状态，针对超链接
  - :focus 获得焦点
  - :target 链接到当前的目标，一般用于锚点
- 树结构
  - :empty 匹配树结构没有子元素时
  - :nth-child() 匹配父元素的第几个child
  - :nth-last-child() 和:nth-child()类似，顺序是从后往前
  - :first-child :last-child :only-child
- 逻辑性
  - :not() 匹配不符合一组选择器的元素
  - :where :has 实验性的伪类，浏览器兼容性不好

### 伪元素

通过选择器，向界面中添加了一个不存在的元素，这个元素在文档树中找不到

::before和::after需结合CSS的content属性来使用，设置了content属性之后就会被渲染成一个盒，参与排版与渲染

::first-line和::first-letter则是另一种机制，把一些有特定逻辑意义的文字括起来

::first-line只能修改部分的css属性，例如font，color，background等，而::first-letter可以设置float，盒模型系列（margin/padding/border）等

还有一种是counter计数器，配合counter-increment和counter-reset属性来使用