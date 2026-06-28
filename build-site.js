#!/usr/bin/env node
/* Build the unified two-track site: 「Agent 玩法」+「PM × AI 提效」in one shell.
   Reads both projects' kb-data.final.json (content UNCHANGED), attaches per-track UI
   config, injects into site-template.html → index.html (self-contained, deployable). */
const fs = require('fs');
const path = require('path');
const dir = __dirname;

const AGENT_DATA = JSON.parse(fs.readFileSync('/Users/qingwenxiang/Documents/cctalk/agent-playbook-kb/kb-data.final.json', 'utf8'));
const PM_DATA = JSON.parse(fs.readFileSync('/Users/qingwenxiang/Documents/cctalk/pmresearch/kb-data.final.json', 'utf8'));

const CFG_AGENT = {
  brand: 'Agent 玩法知识库', tabLabel: 'Agent 玩法',
  nav: ['成熟度', '玩法手册', '组件 & 工具', '深度专题', '配方库', '最新动态'],
  search: '搜玩法 / 工具 / 配方…',
  statLabels: ['张玩法卡', '款组件/工具', '可复制配方', '条最新动态'],
  heroMeta: '<span>🤖 Claude Code + 通用 agent 工程</span><span>🔍 实时联网 + 对抗核查</span><span>🇨🇳 标注国内可用性</span>',
  hero: {
    kicker: '实时联网调研 · 对抗式核查 · 面向重度玩家 · 2026 最新社区经验',
    h1: '不止会写 prompt<br/>把 AI 当 <span class="g">智能体</span> 来 <span class="g">编排</span>',
    lead: '从"单线对话"升级到"搭 agent 干活"的硬核玩法库:Claude Code 的子智能体 / Skills / Hooks / MCP / Workflow 编排,通用 agent 工程模式(上下文工程、multi-agent、评测、护栏),PM 的 agent 进阶,以及社区最新前沿玩法——每张卡都带可直接复制的配置与代码、真实踩坑、真实案例链接。',
  },
  rungs: [
    ['L0', '聊天框', '只在网页/对话里偶尔问两句,AI 是个更聪明的搜索'],
    ['L1', '单次任务', '会让 agent 在仓库里跑单个任务(改 bug、写脚本),手动盯着'],
    ['L2', '固定工作流', '有自己的 CLAUDE.md / 斜杠命令 / Skills,稳定复用,会管上下文'],
    ['L3', '多 agent 编排', '用 subagent / Workflow / hooks 把活并行拆解、自动核查、串成流水线'],
    ['L4', '搭 fleet 重塑', '定时/云端/后台 agent 常驻干活,自建 MCP 接数据,带团队改工作方式'],
  ],
  ladderHue: '#8b7bff', scenarioCTA: '查看落地步骤 + 配方',
  modal: { why: '为什么这么玩 · ', subtasks: '什么时候用 · 关键判断', workflow: '怎么落地 · 工作流', tools: '相关工具 / 原语', prompts: '可复制配方 / 配置', pitfalls: '踩坑 / 反模式', cases: '真实案例 / 延伸阅读', takeoff: '进阶 · 起飞玩法' },
  deepPromptLabel: '相关配方 / 配置', trendsSoWhat: '对玩家意味着:',
  catHue: { 'agent-harness': '#8b7bff', 'orchestration-frameworks': '#4fe0c8', 'mcp-ecosystem': '#5aa9ff', 'memory-context': '#a78bfa', 'eval-observability': '#34d399', 'browser-computer': '#ff7eb6', 'background-cloud': '#fb923c', 'community-collections': '#ffb454', 'supplement-tools': '#c084fc' },
  heads: {
    overview: { eyebrow: 'The Ladder', h2: 'Agent 玩家成熟度:你现在在第几级?', p: '用 AI 不是"会不会",而是"编排得多深"。从把 AI 当聊天框,到搭起多 agent 流水线重塑工作方式——先给自己量一把尺子,再顺着后面的玩法往上爬。' },
    scenarios: { eyebrow: 'Playbook', h2: '玩法手册:32 张实战卡', p: '点开任意玩法卡:这个玩法解决什么、怎么一步步落地、相关工具与原语、可直接复制的配置 / 代码 / 配方、真实踩坑、真实案例链接,以及把它推到极限的进阶起飞玩法。覆盖 Claude Code 实战、通用 agent 工程、PM 进阶、前沿案例四大块。' },
    tools: { eyebrow: 'Arsenal', h2: '组件 & 工具库', p: '按类别 / 国内可用性 / 价格筛选。从编程 harness、编排框架、MCP 生态、记忆与评测,到浏览器/computer use、云端 agent 与社区资源集合。每款标注用处、国内可用性、国产平替、价格与 2026 最新进展。' },
    deep: { eyebrow: 'Deep Dive', h2: '深度专题', p: '成熟度阶梯、30/60/90 天上手路线、名人堂(大牛玩法)、上下文工程、multi-agent 经济学、评测、反模式、翻车合集、agent 安全。' },
    prompts: { eyebrow: 'Copy & Go', h2: '配方库:可复制的配置 / 代码 / Prompt', p: '全站可复制的配方汇总——settings.json hooks、SKILL.md、斜杠命令、CLAUDE.md 片段、Workflow 脚本骨架、Agent SDK 代码、核查/编排 prompt。点开即用,可用顶部搜索框全库过滤。' },
    trends: { eyebrow: "What's New", h2: '2026 Agent 生态最新动态', p: '知识截止日之后、与"搭 agent"强相关的重要变化(经实时检索 + 对抗核查)。' },
  },
  footer: {
    main: '本知识库由多智能体实时联网调研 + 对抗式核查生成,面向重度 Claude Code 用户与 agent 玩家。工具版本 / 价格 / 功能变动很快,落地前请以官方文档为准。生成日期:<span id="genDate"></span>',
    warn: '⚠️ 配置/代码片段以官方文档为准;凡 hooks、MCP、第三方 agent 涉及自动执行与凭证,务必先看清权限与供应链风险(详见「Agent 安全」「翻车合集」专题),敏感数据先脱敏。',
  },
};

const CFG_PM = {
  brand: 'PM × AI 起飞知识库', tabLabel: 'PM 提效',
  nav: ['阶梯', '场景', '工具库', '深度专题', 'Prompt 库', '最新动态'],
  search: '搜场景 / 工具 / prompt…',
  statLabels: ['个 PM 场景', '款 AI 工具', '可复制 prompt', '条最新动态'],
  heroMeta: '<span>🌐 国际 + 国产并列</span><span>🔍 实时联网核查</span><span>🇨🇳 标注国内可用性</span>',
  hero: {
    kicker: '实时联网调研 · 中国 PM 视角 · 国际 + 国产工具',
    h1: '产品经理用 AI<br/>从 <span class="g">提效</span> 到 <span class="g">起飞</span>',
    lead: '不是"试试 ChatGPT",而是一整套嵌进 PM 真实场景的工作流、可复制的 prompt、按国内可用性标注的工具清单——从用户研究、PRD、数据、原型,到竞品、增长、AI 产品与合规备案。',
  },
  rungs: [
    ['L0', '旁观', '还没真正用,或只在浏览器偶尔问两句'],
    ['L1', '提问', '把 AI 当搜索/写作助手,单点提效'],
    ['L2', '工作流', '每个场景有固定 prompt 与套路,稳定省时'],
    ['L3', '自动化', '搭 agent / 自动化把重复活串成流水线'],
    ['L4', '重塑', '用 AI 改变做产品的方式,带团队一起飞'],
  ],
  ladderHue: '#8b7bff', scenarioCTA: '查看工作流 + prompt',
  modal: { why: 'AI 带来什么 · ', subtasks: '典型子任务', workflow: 'AI 增强工作流', tools: '推荐工具', prompts: '可复制 Prompt', pitfalls: '避坑', cases: '延伸阅读', takeoff: '起飞玩法' },
  deepPromptLabel: '相关 Prompt', trendsSoWhat: '对 PM 意味着:',
  catHue: { 'llm-assistants': '#8b7bff', 'deep-research-search': '#5aa9ff', 'vibe-coding-proto': '#4fe0c8', 'design-visual': '#ff7eb6', 'ppt-diagram-video': '#ffb454', 'meeting-notes': '#22d3ee', 'docs-knowledge': '#a78bfa', 'data-bi': '#34d399', 'pm-specific': '#f472b6', 'agents-automation': '#fb923c', 'ai-eng-eval': '#60a5fa', 'supplement-tools': '#c084fc' },
  heads: {
    overview: { eyebrow: 'The Map', h2: '成熟度阶梯:你现在在第几级?', p: '用 AI 不是"会不会",而是"用到多深"。从随手提问到把工作流自动化,先给自己量一把尺子,再顺着后面的场景往上爬。' },
    scenarios: { eyebrow: 'Playbook', h2: '按场景的实战手册', p: '点开任意场景卡:里面是 AI 增强工作流、该用什么工具(标注国内可用性)、可一键复制的 prompt,以及把提效变"起飞"的进阶玩法。' },
    tools: { eyebrow: 'Arsenal', h2: '工具库', p: '按类别 / 国内可用性 / 价格筛选,共数十款。每款标注对 PM 的用处、国内可用性、国产平替、价格与 2026 最新进展。' },
    deep: { eyebrow: 'Deep Dive', h2: '深度专题', p: '几个值得读透的主题:搭自动化 Agent、提示词工程心法、数据安全与合规避坑、AI 产品经理深水区。' },
    prompts: { eyebrow: 'Copy & Go', h2: 'Prompt 库', p: '全站可复制的 prompt 汇总,带占位符,点开即用。可用顶部搜索框全库过滤。' },
    trends: { eyebrow: "What's New", h2: '2025 下半年 — 2026 最新动态', p: '知识截止日之后、与 PM 用 AI 强相关的重要变化(经实时检索核实)。' },
  },
  footer: {
    main: '本知识库由多智能体实时联网调研 + 对抗式核查生成,聚焦中国产品经理的真实场景。工具可用性 / 价格变动很快,使用前请以官网为准。生成日期:<span id="genDate"></span>',
    warn: '⚠️ 凡涉及企业敏感数据、用户隐私,务必先脱敏再喂给 AI;AI 产出一律需人工复核。详见「数据安全与避坑」专题。',
  },
};

const SITE = {
  default: 'agent',
  order: ['agent', 'pm'],
  tracks: {
    agent: { cfg: CFG_AGENT, data: AGENT_DATA },
    pm: { cfg: CFG_PM, data: PM_DATA },
  },
};

const tpl = fs.readFileSync(path.join(dir, 'site-template.html'), 'utf8');
const json = JSON.stringify(SITE)
  .replace(/<\//g, '<\\/')
  .replace(new RegExp(String.fromCharCode(0x2028), 'g'), '\\u2028')
  .replace(new RegExp(String.fromCharCode(0x2029), 'g'), '\\u2029');
const out = tpl.replace('/*__SITE__*/ {}', json);
if (out === tpl) { console.error('ERROR: placeholder /*__SITE__*/ {} not found'); process.exit(1); }
fs.writeFileSync(path.join(dir, 'index.html'), out);

const sc = (d) => (d.scenarios || []).length;
const tc = (d) => (d.tools || []).reduce((a, c) => a + (c.tools || []).length, 0);
const cc = (d) => (d.crosscut || []).length;
console.log(`Built index.html (${(out.length / 1024).toFixed(0)} KB)`);
console.log(`  agent: ${sc(AGENT_DATA)} 玩法卡 / ${tc(AGENT_DATA)} 工具 / ${cc(AGENT_DATA)} 专题`);
console.log(`  pm:    ${sc(PM_DATA)} 场景 / ${tc(PM_DATA)} 工具 / ${cc(PM_DATA)} 专题`);
