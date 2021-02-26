# 无限旋转

```css
@keyframes rotate {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}
img {
    width: 100px;
    height: 100px;
    animation: rotate 1s linear infinite; /*linear 不能少*/
}
```

