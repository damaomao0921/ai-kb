# AI 知识库(合并站):Agent 玩法 + PM × AI 提效

把两个姊妹知识库合并成**一个网站、一套样式**,内容零改动,顶部一键切换双轨:

- **🤖 Agent 玩法**(默认轨):面向重度 Claude Code 用户 / agent 玩家。32 张玩法卡 · 72 款组件工具 · 9 篇深度专题 · 12 条动态 · 103+ 可复制配方。源:`../agent-playbook-kb/`。
- **📊 PM × AI 提效**:面向中国产品经理。16 个场景 · 97 款工具 · 5 篇专题 · 11 条动态。源:`../pmresearch/`。

成品(自包含单文件,双击即开):
`file:///Users/qingwenxiang/Documents/cctalk/ai-kb-site/index.html`

> 两个源项目都没动;本站只是读取它们的数据 + 套同一外壳重新生成。

---

## 1. 怎么「user friendly」了

- **顶部双轨切换**:始终可见的分段开关(Agent 玩法 / PM 提效),点一下整站切换、平滑回到顶部。
- **可分享 / 可记忆**:切换写进 URL hash(`index.html#agent` / `index.html#pm`),直接发链接就能定位到某一轨;并用 localStorage 记住你上次看的轨。
- **跨轨搜索提示**:在一轨里搜东西,如果另一轨也有匹配,会提示「在「XXX」里还有 N 处匹配 → 切过去看」,一键带着关键词跳过去。
- **标签页标题随轨变**(便于收藏区分),移动端自适应(窄屏隐藏导航、开关只留图标)。
- 其余沿用:全站搜索、工具按类别/可用性/价格筛选、配方一键复制、卡片模态、深度专题手风琴。

---

## 2. 文件结构

| 文件 | 作用 |
| --- | --- |
| `index.html` | **最终交付物 / 待发布**。自包含单文件,内联了两轨全部数据 + UI。无外部依赖(仅联网取 Google Fonts)。 |
| `site-template.html` | 统一外壳模板。占位符 `/*__SITE__*/ {}` 处注入 `SITE`。所有渲染逻辑由 CFG(每轨配置)+ DATA(每轨数据)驱动。 |
| `build-site.js` | `node build-site.js` → 读取两个源项目的 `kb-data.final.json` + 各自 UI 配置(CFG_AGENT / CFG_PM),注入模板生成 `index.html`。 |

数据来源(只读,不修改):
- `../agent-playbook-kb/kb-data.final.json`
- `../pmresearch/kb-data.final.json`

---

## 3. 重新构建 / 改样式

```bash
cd /Users/qingwenxiang/Documents/cctalk/ai-kb-site
# 任一源项目内容更新后(在各自项目里 build 出新的 kb-data.final.json),回到这里重跑:
node build-site.js
open index.html
```

- 改**外壳样式 / 交互 / 统一文案**:编辑 `site-template.html`(CSS 在 `<style>`,逻辑在底部 `<script>`)。
- 改**某一轨的标题 / 导航 / 阶梯文案 / 模态标签 / 配色**:编辑 `build-site.js` 里的 `CFG_AGENT` / `CFG_PM`,再 `node build-site.js`。
- 改**内容(卡片 / 工具 / 专题)**:回到对应源项目(`agent-playbook-kb` / `pmresearch`)改 `kb-data.final.json` 并重建,再回这里 `node build-site.js`。

---

## 4. 发布到 web

`index.html` 是单文件静态站,放任何静态托管即可(GitHub Pages / Cloudflare Pages / Netlify…)。发布会让内容**公开可访问**。
