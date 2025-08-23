# Oar.ui

```md
oar.ui/
├── package.json # 根配置，设置 workspaces
├── pnpm-workspace.yaml # pnpm workspace 配置
├── docs/ # 文档与演示站点 (VitePress / Storybook / Docusaurus)
└── playground/ # 调试沙箱，直接引入 core 组件测试
└── packages/ # oar.ui
└── package.json
```

<!-- ```md
oar.ui/
├── package.json            # 根配置，设置 workspaces
├── pnpm-workspace.yaml     # pnpm workspace 配置
├── packages/
│   ├── core/               # UI 库核心代码
│   │   ├── src/
│   │   │   ├── components/ # 每个组件单独一个文件夹
│   │   │   │   ├── Button/
│   │   │   │   │   ├── Button.vue
│   │   │   │   │   ├── index.ts
│   │   │   │   └── Input/
│   │   │   │       ├── Input.vue
│   │   │   │       ├── index.ts
│   │   │   ├── index.ts   # 导出入口
│   │   ├── package.json   # core 包配置
│   ├── docs/              # 文档与演示站点 (VitePress / Storybook / Docusaurus)
│   │   ├── .vitepress/    # 配置
│   │   ├── components/    # 文档示例组件
│   │   ├── index.md
│   │   └── package.json
│   └── playground/        # 调试沙箱，直接引入 core 组件测试
│       ├── src/
│       └── package.json
├── tsconfig.json
└── vite.config.ts
``` -->
