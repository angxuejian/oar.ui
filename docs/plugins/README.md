# Vite Plugin Vue Markdown

how to use?

默认与Markdown语法相同，新增`demo`语法

## demo

包裹需要展示的组件

\`\`\`demo

\<custom-component style='background-color: red;'> content \</custom-component>

\`\`\`

需要注意的是组件上的属性只能用`''`包裹，例子：

```html
<!-- good -->

<div style="background-color: red;">content</div>

<!-- 解析时 -->
<!-- "style='background-color: red;'" -->
```

```html
<!-- bad -->

<div style="background-color: red;">content</div>

<!-- 解析时 -->
<!-- "style="background-color: red;"" -->
<!-- 出现：[vite] Internal server error: Attribute name cannot contain U+0022 ("), U+0027 ('), and U+003C (<) -->
```
