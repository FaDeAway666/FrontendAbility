# Animation

- 使用@keyframes定义关键帧
- 在使用动画的元素上，设置CSS animation属性来使用

```css
@keyframes ani {
    from {
        width: 100px
    }
    to {
        width: 300px
    }
}
div {
    animation: ani 2s
}
```

animation是以下6个属性的集合：

- animation-name: 动画命名
- animation-duration：动画时长
- animation-timing-function：动画时间曲线
- animation-delay：动画开始前的延迟
- animation-iteration-count：动画的播放次数
- animation-direction：动画方向

@keyframes中可以用from，to，也可以用百分比，from相当于0%，to相当于100%，可以在关键帧中使用transition去指定动画曲线，相比timing-function，transition可以指定多种方式

# Transition

过渡动效

是以下四个属性的集合：

- transition-property：要变换的属性
- transition-duration：变换的时长
- transition-timing-function：时间曲线
- transition-delay：延迟

timing-function：来源于三次贝塞尔曲线（由两个控制点绘制），参考http://cubic-bezier.com

两个控制点P1,P2，可以延展两条控制线（绿色），两条控制线上的点连成的线段（蓝色），在参数t的作用下，取其上一点，可以绘制出红色的轨迹

![image-20210223110129446](.\images\bezier.png)

内置了几种曲线：ease、linear、ease-in，ease-out，ease-in-out

# 颜色

自然界三原色：红绿蓝（RGB)或品红/黄/青（CMYK）

W3C的颜色标准：HSL与HSV

H色相，S纯度，L亮度，V色值/明度

L和V的区别，L为0是黑色，为100是白色，V为满值时是明亮的纯色

# 绘制

几何图形：

- border
- box-shadow
- border-radius

文字：

- font
- text-decoration

位图：

- background-image



