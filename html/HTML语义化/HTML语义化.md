# 什么是HTML语义化

使用HTML5中具有语义的标签构建页面

# HTML语义化的好处

1. 利于SEO（搜索引擎优化），搜索引擎友好
2. 方便其他设备解析
3. 便于开发与维护，提升页面可读性
4. 无障碍阅读支持
5. 面向未来的HTML，未来的浏览器可能会对具有语义的页面提供更多支持

# 结构语义化

语义元素的特点：仅仅用于规范页面的结构，而不会对内容有本质影响，不像canvas，或者video这种标签

## 头部

`<header>`元素有两种用法：

- 标注内容的标题（一般不在内容中使用，除非内容中附带其他信息：作者，时间）
- 标注网页的页眉（多数使用）

可以在网页中使用多个header，根据HTML5规范，`<header>`应该显式或隐式标注某个级别的标题

## 导航栏

通常使用`<nav>`来包裹导航栏

`<nav>`也可用作一组链接的包裹元素，一个页面可以包含多个nav，但一般只有页面的主要导航使用它

```html
<!-- 案例一 -->
<nav>
  <!-- 此处是链接 -->
  <aside></aside>
  <aside></aside>
</nav>

<!-- 案例二 -->
<aside>
  <nav>
    <!-- 此处是链接 -->
  </nav>
  <section></section>
  <div></div>
</aside>
```

案例一是页面主要导航，案例二是当侧边栏包含导航和其他内容时的用法

## 附注

`<aside>`元素不仅仅是侧边栏，其表示与周围文本没有密切关系的内容。当aside用于侧栏时，表示整个网页的附加内容，一般放**广告、搜索栏、分享链接**等

`section`标签适合标记的内容区块：

- 与页面主体并列显示的小内容块
- 独立性内容，清单、表单等
- 分组内容，例如文章的分类区块

## 页脚

`footer`标签仅可以包含**版权、来源信息、法律限制、备案号**等之类的文本或者链接信息。如果想在页脚中包含其他内容，可用div

## 主要内容

`<main>`标签用来标识主体部分，可以让屏幕阅读工具识别页面的主体部分

main标签不能包含在页面其它区块的元素中，通常是`<body>`的子标签，或是全局div的子标签

## 文章

`<article>`表示一个完整的、自成一体的内容块。如新闻报道或文章。

article应包含完整的**标题、作者、发布时间、正文**

当文章中包含插图的时候，使用`<figure>`

```html
<article>
  <h1>标题</h1>
  <p>
    <!-- 内容 -->
  </p>
  <figure>
    <img src="#" alt="插图">
    <figcaption>这是一个插图</figcaption>
  </figure>
</article>
```

# 文本语义化

HTML5扩展了一些文本级语义化标签，以及一些扩展的语义标准

## 文本级语义化标签

`<time>`标注时间和日期

```html
<time datetime="2012-12-21">二〇一二年年十二月二十一日</time>
```

`<mark>`标记突出显示的文本

## 微数据

为了方便机器识别而产生的一种标记内容，用于描述特定类型的欣喜，可以丰富搜索引擎的网络摘要

```html
<div>
  我的名字是王富强，但大家叫我小强。我的个人首页是：
  <a href="http://www.example.com">www.example.com</a>
  我住在上海市富贵新村。我是工程师，目前在财富科技公司上班。
</div>

<!--使用微数据-->
<div itemscope itemtype="http://data-vocabulary.org/Person">
  我的名字是<span itemprop="name">王富强</span>，
  但大家叫我<span itemprop="nickname">小强</span>。
  我的个人首页是：
  <a href="http://www.example.com" itemprop="url">www.example.com</a>
  我住在上海市富贵新村。我是<span itemprop="title">工程师</span>，
  目前在<span itemprop="affiliation">财富科技公司</span>上班。
</div>
```

上例中的自定义属性有：

**itemscope**

定义一组名值对，称为项

**itemprop="属性名"**

添加一个数据项属性，属性名可以是一个单词或一个URL，与元素包含的文本值相关

- 对于大部分元素，属性名值就是元素标签里面的文本值（不是所有标签）。
- 对于有URL属性的元素，该值就是URL（如`<img src="">`, `<a href="">`, `<object data="">`等）。
- 对于`<time>`元素，该值就是`datetime=""`属性。
- 对于`<meta itemprop="" content="">`， 该值就是`content=""`属性。

**itemref**

允许微数据项通过指向特定ID（含有需要属性的元素）包含非后代属性

```html
<p itemscope itemref="band-members">后天我要去看<span itemprop="name">
S˙H˙E</span>的演唱会，好兴奋哈！</p>
……
<span id="band-members" itemprop="members" itemscope>S˙H˙E 的成员是
  <span itemprop="name">任家萱</span>，
  <span itemprop="name">田馥甄</span>和
  <span itemprop="name">陈嘉桦</span>.</span>
```

**itemtype**

通过设置itemtype，可以给微数据项制定一种类型，itemtype的值为一个URL，代表了微数据使用的词汇

```html
<p itemscope itemtype="http://schema.org/MusicGroup">后天我要去看<span itemprop="name">
S˙H˙E</span>的演唱会，好兴奋哈！</p>
```

微数据保证页面内容显示良好可以通过工具转化为JSON，从某种意义上讲微数据的本质就是JSON

