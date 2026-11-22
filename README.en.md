# Generate commit message (dsh-commit-message)

[简体中文](README.md) · **English**

> Adds a “Generate commit message” button under the composer in DSH Web: one click sends a commit-message prompt into the active conversation, and the conversation’s agent inspects the changes and writes the message.

`@local/dsh-commit-message` is a DeepSeek Harness (DSH) web plugin split into a Host half and a Client half: the Host serves an HTTP route that reads and writes the prompt files, while the Client renders the button under the conversation composer and the prompt editor in Settings. The plugin itself does not read the Git repository, call a model, or run `git commit` — it only enqueues a customizable prompt as an ordinary user message in the active conversation.

## Features

- **One-click trigger**: A “Generate commit message” button appears under the composer. Clicking it sends the prompt in `queue` mode, so it waits for a running turn instead of interrupting it.
- **Editable prompt**: A “Generate commit message” row in Settings → General edits, saves, and restores the prompt; the button uses the saved text immediately.
- **Files are the configuration**: The shipped default lives in `default-prompt.txt`; edits are written to `custom-prompt.txt` beside it, which is gitignored.
- **Localized**: Button, settings row, status, and error copy ship in Chinese, English, Japanese, Spanish, French, German, Russian, and Portuguese. Plugin Manager titles and descriptions live in `locale/*.json`.
- **Theme-aware**: All styles use DSH theme variables (`--dsw-alias-*`) and follow the light and dark themes.
- **Safe writes**: The Host route uses DSH connection checks, caps request bodies at 64 KiB, and replaces files atomically with a temporary file plus rename.

## Usage

### Generate a commit message

1. Open the conversation whose changes you want to commit, and make sure its agent can reach the repository (for example through shell tools).
2. Click “Generate commit message” under the composer.
3. The button shows “Sending…” briefly and returns once the message is queued. The prompt then appears as a user message, and the agent inspects the changes and writes a commit message.
4. Copy the result and commit yourself, or ask the agent to commit.

The button only sends the prompt: it does not wait for or extract the agent’s reply, and it never runs git commands.

### Edit the prompt

1. Settings → General → “Generate commit message”.
2. Edit the prompt and choose “Save”; “Restore default” removes the override and returns to the shipped text.
3. A successful save shows “Saved”, and the next click uses the new prompt.

The prompt cannot be empty; text identical to the default also counts as restoring the default. The setting is plugin-wide and applies to every conversation and repository.

### Prompt precedence

| File | Role | Tracked |
| --- | --- | --- |
| `default-prompt.txt` | Default prompt shipped with the package; editable | Yes |
| `custom-prompt.txt` | User override written by Settings | No (gitignored) |

The effective prompt comes from `custom-prompt.txt` when it exists and is non-empty; otherwise it falls back to `default-prompt.txt`. The browser reads the files once when the components mount and caches the result, so edits made directly to the files appear after a page refresh, while changes saved from Settings apply immediately.

The shipped default prompt is Chinese (`根据本次修改内容生成commit message`); change it in Settings if you want the agent to produce the message in another language.

## Installation and enabling

The plugin installs as a local directory link (`link:`) and needs no build step. The `web` profile already has it installed and enabled:

```json
"@local/dsh-commit-message": "link:/home/muqi/code/dsh-commit-message"
```

To install it into a profile:

1. Open Plugins → Add plugin and choose `/home/muqi/code/dsh-commit-message`.
2. Enable “Generate commit message” in the plugin list.
3. Open a new conversation and confirm the button appears under the composer.

`dsh plugin --profile <name> add <directory>` only installs the package into the profile; enable it (add it to `dsh.profile.bundles`) in the Plugins panel.

After code changes: restart `dsh web` for `index.js`, and refresh the page for `client.js` (restart if the old module is still served). To uninstall, disable or remove the plugin in the Plugins panel.

## How it works

What happens after a click:

```
Click the button
  └─ resolvePrompt() ──GET /commit-message/prompt──► Host reads default/custom
       └─ binding.session.prompt(text, 'queue') ──► active conversation agent
            └─ inspects the changes → writes the commit message
```

Host half `index.js` exports `apply(ctx)`, injects `webServer` and `connection`, registers the exact route `/commit-message/prompt`, and reads or writes the two prompt files that sit next to `index.js`.

Client half `client.js` is loaded through `window.__ModuleLoader__.load` and registers components in two DSH slots:

| Slot | Component | Purpose |
| --- | --- | --- |
| `conversation.composer.dock` | `CommitMessageButton` | Button under the composer, `order: -1` |
| `settings.general.item` | `CommitMessageSettingsRow` | Prompt editor row in Settings → General, `order: 30` |

The components resolve the conversation with `ctx.sessions.binding(sessionId)` and enqueue the prompt with `session.prompt([{ type: 'text', text }], 'queue')`; UI copy is registered through `ctx.locale.register('dsh-commit-message', ...)`.

## HTTP API

This is the only contract between the Host and browser halves, useful for scripts and debugging.

| Method | Request | Success response |
| --- | --- | --- |
| `GET` | none | `200` with `{ "defaultPrompt": string, "customPrompt": string \| null, "prompt": string }` |
| `PUT` | `content-type: application/json`, `{ "prompt": string \| null }` | `200` with the state after the write |

- `prompt: null` or a string equal to the default restores the default by deleting `custom-prompt.txt`.
- JSON and text responses carry `cache-control: no-store` and pass through DSH connection checks.
- Other status codes: `400` invalid JSON, a non-string or empty `prompt`; `405` anything other than GET/PUT; `413` a body over 64 KiB; `415` a content type other than `application/json`; `500` a prompt file could not be read or written.

## Project layout

```
dsh-commit-message/
├── package.json          # manifest: bundle patch, client export, locale/icon exports
├── cordis.patch.yml      # inserts the id=commit-message plugin row
├── index.js              # Host half: prompt route and file IO
├── client.js             # Client half: button, settings row, styles, 8 locales
├── default-prompt.txt    # default prompt shipped with the package
├── custom-prompt.txt     # user override, created at runtime, gitignored
├── locale/*.json         # Plugin Manager titles and descriptions, 8 locales
├── icon.svg              # plugin icon
└── .gitignore
```

## Development

No build step and no runtime dependencies: the Host is plain Node ESM, and the Client is a browser module loaded by `__ModuleLoader__`.

```bash
# syntax and JSON checks
node --check index.js
node --check client.js
node -e "for (const f of require('node:fs').readdirSync('locale')) JSON.parse(require('node:fs').readFileSync('locale/' + f, 'utf8'))"

# restart the web app
dsh web
```

- Client debugging: console logs use the `[dsh-commit-message]` prefix and explain prompt load or save failures.
- Host debugging: a missing or empty `default-prompt.txt` makes `GET` return 500 with the reason as plain text; write failures are recorded in the DSH log.
- Test restore-default by hand: delete `custom-prompt.txt` and refresh the page.
- Add a UI language: add copy to a dictionary in `client.js`, register it in `dictionaries`, and add the matching `meta` title and description under `locale/`.

## FAQ

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| “This conversation is not ready yet.” | The conversation is not bound or is still initializing | Wait or switch to an existing conversation |
| “Could not read the prompt files…” | Plugin disabled, missing or empty `default-prompt.txt`, route unavailable | Enable the plugin and check both prompt files |
| “Could not send the prompt. Try again.” | The conversation refused the message or the send threw | Check the console log and that the conversation accepts messages |
| Saving in Settings reports a write failure | Plugin directory is read-only (for example a global install) | Move or reinstall the plugin in a writable directory |
| Editing `custom-prompt.txt` has no effect | The browser cached the previous read | Refresh the page |
| “Sending…” stays for a long time | The current turn is still running and the message is queued | Wait for the turn to finish |

## Known limitations

- The UI is web-only; TUI and headless clients have no button.
- The plugin does not read Git state, call a model, or run `git commit`: the conversation’s agent does all of it, so it needs a way to inspect the changes.
- Every click leaves a user message in the conversation (the prompt itself).
- The prompt is global, not per repository or per conversation.
- UI copy is compiled into `client.js`, so a new language means code changes.
- The plugin depends on DSH slot, session, and locale APIs and was built against dsh `0.2.2-rc.5`; major DSH upgrades may need adaptation.

## Version

- Plugin version: `1.0.0` (`@local/dsh-commit-message`, `private`)
- Built against: dsh `0.2.2-rc.5`, Node.js `24`

## License

No open-source license is declared; `package.json` sets `private: true`, so treat this as an internal/local plugin.
