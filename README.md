# AI 知识库(合并站):Agent 玩法 + PM × AI 提效

一个网站、一套「FIELD MANUAL 起飞手册」编辑杂志风设计,顶部一键切换双轨,内容零改动:

- **🤖 Agent 玩法**(默认轨):重度 Claude Code 用户 / agent 玩家。32 张玩法卡 · 72 款组件工具 · 9 篇深度专题 · 12 条动态 · 103+ 可复制配方 · 92 条已验证外链。源数据:`../agent-playbook-kb/kb-data.final.json`。
- **📊 PM × AI 提效**:中国产品经理。16 场景 · 97 工具 · 5 篇专题 · 11 条动态。源数据:`../pmresearch/kb-data.final.json`。

线上:**https://damaomao0921.github.io/ai-kb/**(`#pm` 直达 PM 轨)
本地:`file:///Users/qingwenxiang/Documents/cctalk/ai-kb-site/index.html`

> UI 采用 pmresearch 里那套 DC(React 运行时)编辑杂志设计(`design_handoff_pm_ai_kb`),两个源项目都未改动。

---

## 1. user friendly

- **顶部双轨切换**(侧栏 masthead 下):Agent 玩法 / PM 提效,点一下整站换轨、回到顶部、记住选择(localStorage)。
- **可分享**:`...#agent` / `...#pm` 直接定位某一轨(加载后归位到 `#overview`)。
- **左侧目录 + 折页导航**:总览 / 玩法手册 / 工具库 / 深度专题 / 配方库 / 最新动态,场景与专题是整页阅读 + 上一篇/下一篇。
- 全站检索、工具按类别 / 可用性 / 价格筛选、配方一键复制;移动端抽屉式侧栏。
- agent 轨的「真实案例 · 延伸阅读」外链在场景详情与深度专题页底部渲染。

---

## 2. 文件结构

| 路径 | 作用 |
| --- | --- |
| `index.html` | **最终交付物 / 已部署**。自包含单文件(内联 React + DC 运行时 + 两轨数据)。 |
| `fm/site.dc.html` | DC 模板 + 逻辑类(`TRACKS` 双轨配置、`phaseDefs` 分组、`buildScenario`/`buildTopicDetail` 等)。 |
| `fm/site-data.js` | `window.SITE_DATA = { agent, pm }`,由两个源项目的 `kb-data.final.json` 合并(内容不改)。 |
| `fm/build-standalone.js` | `node fm/build-standalone.js` → 把 React / 运行时 / 数据全部内联,输出 `../index.html`。 |
| `fm/support.js` · `fm/vendor/` · `fm/PromptCard.dc.html` | DC 运行时 + React + 子组件(来自 design_handoff)。 |
| `fm/site-template.html`(旧)· `build-site.js`(旧) | 早期暗色 vanilla 版,已被 DC 编辑版取代,保留备份。 |

---

## 3. 重新构建 + 部署

```bash
cd /Users/qingwenxiang/Documents/cctalk/ai-kb-site
# 1) 若源项目数据更新了,先刷新合并数据:
node -e 'const fs=require("fs");const a=require("../agent-playbook-kb/kb-data.final.json");const p=require("../pmresearch/kb-data.final.json");fs.writeFileSync("fm/site-data.js","window.SITE_DATA = "+JSON.stringify({agent:a,pm:p}).replace(/<\//g,"<\\/")+";\n")'
# 2) 构建单文件:
node fm/build-standalone.js
open index.html
# 3) 部署(push 后 GitHub Pages 自动重建):
git add index.html && git commit -m "update" && git push
```

改 UI / 文案 / 双轨配置:编辑 `fm/site.dc.html`(`TRACKS` 对象在底部逻辑类里),再走第 2、3 步。

---

## 4. 内容 provenance

每轨内容由 Claude Code 多智能体 Dynamic Workflows「研究 → 对抗核查 → 执笔」生成,版本/价格/事件类高风险条目经主笔二次独立 WebSearch 核实。外链全部实时核实可达。落地前以官方文档为准。
