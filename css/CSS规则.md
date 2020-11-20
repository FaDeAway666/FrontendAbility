# 总论

CSS的顶层样式表由两种规则组成的规则列表构成，一种是at-rules，另一种是qualified rules

# 规则

## at-rules

@charset

用于提示css文件使用的字符编码方式，如果被使用，必须出现在最前面，这个规则只在给出语法解析阶段使用，并不影响页面的展示效果

@import

用于引入一个css文件，除了@charset规则不会被引入，@import可以引入一个css文件的全部内容（支持string，URL，media query形式）

@media

用于根据设备类型加载不同的样式，

@fontface

用于设置字体

@page

用于在打印文档时修改某些css属性，兼容性

@counter-style

@keyframes

@support

@namespace

# 选择器

类型

## 优先级

按类型递增

类型选择器和伪元素 -> 类选择器，属性选择器，伪类 -> ID选择器

**通配选择符**（universal selector）（[`*`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Universal_selectors)）**关系选择符**（combinators）（[`+`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Adjacent_sibling_combinator), [`>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Child_combinator), [`~`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/General_sibling_combinator), ['` `'](https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_combinator), [`||`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Column_combinator)）和 **否定伪类**（negation pseudo-class）（[`:not()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:not)）对优先级没有影响。（但是，在 `:not()` 内部声明的选择器会影响优先级）。

