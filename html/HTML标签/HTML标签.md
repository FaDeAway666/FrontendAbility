# HTML SGML XML

SGML 是20世纪60年代，由IBM最早使用的一种数据描述语言

XML是SGML 的一个子集

HTML在刚诞生的年代，也是使用了SGML子集的定义方式，拥有符合SGML的DTD（document type definition），后期W3C对其做了XML化的尝试，于是出现了XHTML的版本

## DTD

DTD是文档类型定义，可以用来定义合法的XML文档构建模块，使用一系列合法元素来定义文档结构。

```xml-dtd
<?xml version="1.0"?>
<!DOCTYPE note [
  <!ELEMENT note (to,from,heading,body)>
  <!ELEMENT to      (#PCDATA)>
  <!ELEMENT from    (#PCDATA)>
  <!ELEMENT heading (#PCDATA)>
  <!ELEMENT body    (#PCDATA)>
]>
<note>
  <to>George</to>
  <from>John</from>
  <heading>Reminder</heading>
  <body>Don't forget the meeting!</body>
</note>
```

*!DOCTYPE note* (第二行)定义此文档是 *note* 类型的文档。

*!ELEMENT note* (第三行)定义 *note* 元素有四个元素："to、from、heading,、body"

*!ELEMENT to* (第四行)定义 *to* 元素为 "#PCDATA" 类型

*!ELEMENT from* (第五行)定义 *from* 元素为 "#PCDATA" 类型

*!ELEMENT heading* (第六行)定义 *heading* 元素为 "#PCDATA" 类型

*!ELEMENT body* (第七行)定义 *body* 元素为 "#PCDATA" 类型



所有XML(HTML)文档均由以下几个简单模块构成：

- 元素

  元素是XML和HTML文档的主要构建模块

  HTML 元素的例子是 "body" 和 "table"。XML 元素的例子是 "note" 和 "message" 。元素可包含文本、其他元素或者是空的。空的 HTML 元素的例子是 "hr"、"br" 以及 "img"。

- 属性

  属性可提供有关元素的额外信息

  ```html
  <img src="computer.gif" />
  ```

- 实体

  实体是用于定义引用普通文本或特殊字符的快捷方式的变量。

  实体引用是对实体的引用

  实体可在内部或外部进行声明

  内部实体声明

  ```dtd
  <!ENTITY writer "Bill Gates">
  <!ENTITY copyright "Copyright W3School.com.cn">
  ```

  外部实体声明

  ```dtd
  <!ENTITY writer SYSTEM "http://www.w3school.com.cn/dtd/entities.dtd">
  <!ENTITY copyright SYSTEM "http://www.w3school.com.cn/dtd/entities.dtd">
  ```

  实体的引用

  ```xml
  <author>&writer;&copyright;</author>
  ```

  HTML几个常规实体引用

  | 实体引用 | 字符 |
  | :------- | :--- |
  | `&lt;`   | <    |
  | `&gt;`   | >    |
  | `&amp;`  | &    |
  | `&quot;` | "    |
  | `&apos;` | '    |

- PCDATA

  parsed character data 被解析的字符

  可想象成元素的开始标签与结束标签之间的文本

  这些文本是会被解析的文本，会被解析器检查实体以及标记

- CDATA

  不会被解析器解析的文本，这些文本中的标签不会当做标记来对待，实体也不会展开解析

# 元素类型

## 行内元素

行内元素默认宽度由内容撑开，不会自动换行，无法设置高度，

inline-block：可以设置高度

## 块级元素

块级元素独占一行，可以设置高度，默认宽度为100%

### iframe

iframe元素会创建包含另外一个文档的内联框架

iframe的优缺点

优点：

1. iframe能够原封不动把嵌入的网页展现出来
2. 当有多个页面需要复用一块内容的时候，可以考虑iframe
3. iframe适合用来加载第三方内容，例如广告和图标、

缺点：

1. 增加服务器的请求压力
2. 降低外部页面的加载速度

## （空）void元素

### meta

meta标签提供有关页面的元信息（meta-information）

meta位于文档的头部`<head>`元素中，不包含任何内容，总是以名称/值的形式成对传递

属性

http-equiv：将content属性关联到HTTP响应头上

可选值有content-type，expires，refresh，set-cookie等

name：将content属性关联到一个名称

可选值有

author、description、keywords、generator、viewport等

因此content属性是必选属性

### link

用于链接一个外部样式表，同样只能存在于head标签中

link与@import的区别在于：

1. link除了可以加载css样式表，还可以定义RSS（RSS是站点用来和其他站点之间共享内容的简易方式（ 也叫聚合内容））事务，而@import仅用来加载css样式
2. link引用css的时候，页面载入时同时加载，@import需要在页面完全加载以后加载，且需要在引用@import的css文件加载完毕后才加载
3. link无兼容性问题，@import在css2.1时提出，低版本浏览器不支持

## DOCTYPE

DOCTYPE标签是一种标准通用标记语言（SGML）的文档类型声明，用于告诉SGML解析器用什么样的DTD（文档定义类型）来解析文档

如果DOCTYPE不存在或形式不正确，会导致HTML文档以混杂模式呈现

标准模式以浏览器支持的最高标准运行，混杂模式则使用向后兼容的方式呈现HTML文档，用来兼容旧版本浏览器

HTML5不基于SGML，因此HTML5只需要写`<!DOCTYPE HTML>`来规范浏览器行为