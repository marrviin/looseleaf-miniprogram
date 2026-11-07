# Button 手绘按钮

对齐上游 looseleaf 的 `button` 组件(见 `src/lib/ink/recipes/button-ink.ts`)。

## 引入

```json
{
  "usingComponents": {
    "ll-button": "looseleaf-miniprogram/components/button/button"
  }
}
```

## 示例

```xml
<ll-button>默认</ll-button>
<ll-button variant="outline">描边</ll-button>
<ll-button variant="destructive">删除</ll-button>
<ll-button shape="pill" seed="3">胶囊 · 第 3 种抖动</ll-button>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
|---|---|---|---|
| variant | 风格:`default` / `destructive` / `outline` / `secondary` / `ghost` / `link` | String | `default` |
| size | 尺寸:`default` / `xs` / `sm` / `lg` / `icon` | String | `default` |
| shape | 形状:`default` / `pill` | String | `default` |
| disabled | 禁用 | Boolean | `false` |
| loading | 加载中 | Boolean | `false` |
| openType | 微信开放能力,透传原生 button | String | — |
| seed | 墨迹抖动种子(数字或字符串) | String/Number | — |
| customStyle | 自定义内联样式 | String | — |

### 外部样式类

| 类名 | 说明 |
|---|---|
| ll-class | 根节点 |

### 事件

| 事件 | 说明 |
|---|---|
| bind:tap | 点击(禁用/加载中不触发) |
| bind:getuserinfo / bind:contact / bind:error | openType 对应回调透传 |

> TODO(M1):按压态切换烘焙的 ink 图层(rest → pressed),并接入真实墨迹描边。
