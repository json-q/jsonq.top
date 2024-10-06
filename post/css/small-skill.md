# HTML CSS 开发常用技巧

## !important 失效

当给 body 样式设置 `!important` 之后，依旧不能覆盖掉内容样式

```html
<style>
  body {
    color: red !important;
  }
  .container {
    color: blue;
  }
</style>
<!-- container 显示 blue -->
<div class="container">container</div>
```

> 因为 body 设置的样式在内容部分属于<span style="color: red;">继承样式</span>。**内容的单独属性永远比继承属性优先级更高，与权重无关**

## 文本溢出省略

1. 单行省略
   ```css
   .box {
     white-space: nowrap;
     overflow: hidden;
     text-overflow: ellipsis;
   }
   ```
2. 多行省略
   ```css
   .box {
     overflow: hidden;
     text-overflow: ellipsis;
     display: -webkit-box;
     -webkit-line-clamp: 2;
     -webkit-box-orient: vertical;
   }
   ```

## 外部图片访问 403

访问某些外部网站图片时，出现访问图片被服务器拒绝 403 的情况

- `<img src="https://i1.hdslb.com/bfs/archive/048cfe5fd2799ad793c9519f64281bd7e3831ddb.png@672w_378h_1c_!web-home-common-cover.avif">`

> 可在 img 标签中添加 `referrerpolicy="no-referrer"`
