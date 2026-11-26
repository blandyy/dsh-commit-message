# 生成提交信息（dsh-commit-message）

**简体中文** · [English](README.en.md)

> 在 DSH Web 的输入框下方加一个「生成提交信息」按钮：点一下，就把「根据本次修改内容生成 commit message」这条提示词发进当前会话，由当前会话的 agent 读取改动并写出提交信息。

`@local/dsh-commit-message` 是一个 DeepSeek Harness（DSH）Web 插件，由 Host 与 Client 两半组成：Host 暴露读写提示词文件的 HTTP 路由，Client 在会话输入框下方渲染按钮、在设置页渲染提示词编辑器。插件本身不读取 Git 仓库、不调用模型、也不执行 `git commit`——它只负责把一段可自定义的提示词作为普通用户消息排进当前会话。

## 功能

- **一键触发**：输入框下方出现「生成提交信息」按钮，点击后以 `queue` 模式发送提示词；当前回合执行中时会排队，不会打断。
- **提示词可改**：设置 → 通用 中新增「生成提交信息」一行，可编辑、保存、恢复默认；保存后按钮立即使用新提示词。
- **文件即配置**：默认提示词随包分发在 `default-prompt.txt`；用户修改写入同目录的 `custom-prompt.txt`，后者已加入 `.gitignore`，不会误提交。
- **多语言**：按钮、设置行、状态与错误文案内置中、英、日、西、法、德、俄、葡 8 种语言；插件面板的标题与描述见 `locale/*.json`。
- **跟随主题**：样式全部使用 DSH 主题变量（`--dsw-alias-*`），自动适配浅色与深色主题。
- **安全写入**：Host 路由沿用 DSH 的连接校验，请求体上限 64 KiB，写文件采用「临时文件 + rename」原子替换。

## 使用

### 生成提交信息

1. 在 DSH Web 中打开要提交的会话，确认该会话的 agent 能访问仓库（例如具备 shell 工具）。
2. 点击输入框下方的「生成提交信息」。
3. 按钮短暂显示「发送中…」，消息入队后即恢复；随后会话中出现一条用户消息，agent 按提示词分析改动并给出 commit message。
4. 复制结果自行提交，或让 agent 继续执行提交。

按钮只负责发送提示词，不会等待或提取 agent 的回复，也不会自动执行 git 命令。

### 修改提示词

1. 设置 → 通用 → 「生成提交信息」。
2. 在文本框中修改提示词，点「保存」；点「恢复默认」删除自定义覆盖，回到随包默认值。
3. 保存成功后提示「已保存」，按钮下一次点击即使用新内容。

提示词不能为空；内容与默认值相同时也被视为恢复默认。该设置是插件级的，对所有会话与仓库生效。

### 提示词优先级

| 文件 | 作用 | 是否随版本库 |
| --- | --- | --- |
| `default-prompt.txt` | 随包分发的默认提示词，可直接编辑 | 是 |
| `custom-prompt.txt` | 设置页写入的用户覆盖 | 否（已 gitignore） |

生效值优先取 `custom-prompt.txt`；它缺失、为空或与默认值相同时，回落到 `default-prompt.txt`。浏览器端在组件挂载时读取一次并缓存，直接改文件后刷新页面生效；通过「保存」写入的会立即生效。

## 安装与启用

环境要求：已安装并可运行 DSH（Web 端），且本机有 `git`。插件以本地目录链接（`link:`）方式安装，无需构建，也没有额外依赖。

### 1. 克隆仓库

```bash
git clone https://github.com/blandyy/dsh-commit-message.git
cd dsh-commit-message
```

克隆目录需要保持可写，并放在固定位置：设置页保存提示词时会写入该目录下的 `custom-prompt.txt`，profile 也通过 `link:` 指向它。移动或删除目录后，插件需要在面板中重新添加。

### 2. 添加到 DSH

1. 打开 插件（Plugins）→ 添加插件（Add plugin）。
2. 选择克隆下来的目录（即上一步的 `dsh-commit-message`）。
3. 在插件列表中启用「生成提交信息」。

也可以在克隆目录中执行命令行安装，再到插件面板启用：

```bash
dsh plugin --profile web add "$PWD"
```

把 `web` 换成你的 profile 名。该命令只完成包安装，是否启用（是否加入 profile 的 `dsh.profile.bundles`）仍需在插件面板中确认。

### 3. 验证

新开一个会话，输入框下方应出现「生成提交信息」按钮；点击后，会话中会出现一条内容为提示词的用户消息。

### 更新与卸载

```bash
cd dsh-commit-message
git pull
```

改 `index.js` 需重启 `dsh web`；改 `client.js` 刷新页面即可，若仍加载旧模块则重启。卸载请在插件面板中停用或移除。

## 工作原理

按钮点击后的消息流：

```
点击按钮
  └─ resolvePrompt() ──GET /commit-message/prompt──► Host 读取 default/custom
       └─ binding.session.prompt(text, 'queue') ──► 当前会话 agent
            └─ 读取本次改动 → 输出 commit message
```

Host 半 `index.js` 导出 `apply(ctx)`，注入 `webServer` 与 `connection`，注册精确路由 `/commit-message/prompt`，读写与 `index.js` 同目录的两个提示词文件。

Client 半 `client.js` 通过 `window.__ModuleLoader__.load` 加载，向两个 DSH 插槽注册组件：

| 插槽 | 组件 | 说明 |
| --- | --- | --- |
| `conversation.composer.dock` | `CommitMessageButton` | 输入框下方的按钮，`order: -1` |
| `settings.general.item` | `CommitMessageSettingsRow` | 设置 → 通用 中的提示词编辑行，`order: 30` |

组件通过 `ctx.sessions.binding(sessionId)` 找到当前会话，再调用 `session.prompt([{ type: 'text', text }], 'queue')` 入队发送；界面文案通过 `ctx.locale.register('dsh-commit-message', ...)` 注册。

## HTTP 接口

这是 Host 与浏览器半之间唯一的约定，便于脚本调用或调试。

| 方法 | 请求 | 成功响应 |
| --- | --- | --- |
| `GET` | 无 | `200`，`{ "defaultPrompt": string, "customPrompt": string \| null, "prompt": string }` |
| `PUT` | `content-type: application/json`，`{ "prompt": string \| null }` | `200`，返回写入后的状态 |

- `prompt: null` 或与默认值相同的字符串表示恢复默认：删除 `custom-prompt.txt`。
- JSON 与纯文本响应均带 `cache-control: no-store`，并受 DSH 连接校验保护。
- 其它状态码：`400` 无效 JSON、`prompt` 非字符串或为空字符串；`405` 非 GET/PUT；`413` 请求体超过 64 KiB；`415` content-type 不是 `application/json`；`500` 读写提示词文件失败。

## 目录结构

```
dsh-commit-message/
├── package.json          # 清单：bundle patch、client 出口、locale/icon 出口
├── cordis.patch.yml      # 向 profile 插入 id=commit-message 的插件行
├── index.js              # Host 半：提示词路由与文件读写
├── client.js             # 浏览器半：按钮、设置行、样式与 8 语言文案
├── default-prompt.txt    # 默认提示词（随包分发）
├── custom-prompt.txt     # 用户覆盖（运行期生成，已 gitignore）
├── locale/*.json         # 插件面板标题与描述，8 种语言
├── icon.svg              # 插件图标
└── .gitignore
```

## 开发

无构建步骤、无运行时依赖：Host 是普通 Node ESM，Client 是 `__ModuleLoader__` 加载的浏览器模块。

```bash
# 语法与 JSON 检查
node --check index.js
node --check client.js
node -e "for (const f of require('node:fs').readdirSync('locale')) JSON.parse(require('node:fs').readFileSync('locale/' + f, 'utf8'))"

# 重启 Web 端
dsh web
```

- 调试客户端：浏览器控制台日志前缀为 `[dsh-commit-message]`，提示词加载或保存失败会打印原因。
- 调试 Host 路由：`default-prompt.txt` 缺失或为空时，`GET` 返回 500 与纯文本原因；写文件失败会记录到 DSH 日志。
- 手工测试恢复默认：删除 `custom-prompt.txt` 后刷新页面。
- 新增界面语言：在 `client.js` 的字典表中补充文案并注册到 `dictionaries`，同时在 `locale/` 增加对应的 `meta` 标题与描述。

## 常见问题

| 现象 | 可能原因 | 处理 |
| --- | --- | --- |
| 提示「当前会话尚未就绪，请稍后再试。」 | 会话尚未绑定或正在初始化 | 稍等或切换到已有会话再点 |
| 提示「无法读取提示词文件…」 | 插件未启用、`default-prompt.txt` 缺失或为空、路由不可用 | 确认插件已启用并检查两个提示词文件 |
| 提示「发送失败，请重试。」 | 会话拒绝接收或发送过程异常 | 查看控制台日志，确认该会话可以正常发消息 |
| 设置页保存时提示无法写入 | 插件目录只读（例如全局安装） | 把插件复制或重新安装到可写目录后重试 |
| 改完 `custom-prompt.txt` 按钮没变化 | 浏览器端缓存了上次读取结果 | 刷新页面 |
| 点击后长时间显示「发送中…」 | 当前回合未结束，消息在队列中 | 等待当前回合完成即可 |

## 已知限制

- 仅 Web 端提供界面；TUI、headless 等客户端没有此按钮。
- 不读取 Git 状态、不调用模型、不执行 `git commit`：生成完全由当前会话的 agent 完成，agent 需要具备查看本次改动的手段。
- 每次点击都会在会话中留下一条用户消息（即提示词本身）。
- 提示词是全局配置，不区分仓库或会话。
- 界面文案内置在 `client.js`，新增语言需要改代码。
- 依赖 DSH 的插槽、会话与 locale API，在 dsh `0.2.2-rc.5` 上开发；DSH 大版本升级后可能需要适配。

## 版本

- 插件版本：`1.0.0`（`@local/dsh-commit-message`，`private`）
- 开发环境：dsh `0.2.2-rc.5`，Node.js `24`

## 许可证

仓库未声明开源许可证，`package.json` 标记为 `private: true`，按内部/本地插件使用。
