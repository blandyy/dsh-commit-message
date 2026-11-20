window.__ModuleLoader__.load({
  id: '@local/dsh-commit-message',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /** Host route that reads and writes the prompt files in the plugin directory. */
    const PROMPT_URL = '/commit-message/prompt';
    /** Locale namespace owned by this plugin. */
    const NS = 'dsh-commit-message';

    const zh = {
      button: '生成提交信息',
      sending: '发送中…',
      error: '发送失败，请重试。',
      noSession: '当前会话尚未就绪，请稍后再试。',
      defaultUnavailable: '无法读取提示词文件，请检查插件目录中的 default-prompt.txt 和 custom-prompt.txt。',
      settings: {
        title: '生成提交信息',
        description: '默认提示词来自 default-prompt.txt；这里的修改会写入 custom-prompt.txt，并立即用于按钮。',
        label: '提示词',
        save: '保存',
        reset: '恢复默认',
        saved: '已保存',
        empty: '提示词不能为空。',
        saveFailed: '无法写入插件目录中的 custom-prompt.txt。',
        loading: '正在读取提示词文件…',
        defaultFailed: '无法读取插件目录中的提示词文件。',
        retry: '重试',
        saving: '保存中…',
      },
    };

    const en = {
      button: 'Generate commit message',
      sending: 'Sending…',
      error: 'Could not send the prompt. Try again.',
      noSession: 'This conversation is not ready yet.',
      defaultUnavailable: 'Could not read the prompt files. Check default-prompt.txt and custom-prompt.txt in the plugin directory.',
      settings: {
        title: 'Generate commit message',
        description: 'The default prompt comes from default-prompt.txt. Edits here are written to custom-prompt.txt and used immediately by the button.',
        label: 'Prompt',
        save: 'Save',
        reset: 'Restore default',
        saved: 'Saved',
        empty: 'Enter a prompt before saving.',
        saveFailed: 'Could not write custom-prompt.txt in the plugin directory.',
        loading: 'Reading the prompt files…',
        defaultFailed: 'Could not read the prompt files in the plugin directory.',
        retry: 'Retry',
        saving: 'Saving…',
      },
    };

    const ja = {
      button: 'コミットメッセージを生成',
      sending: '送信中…',
      error: 'プロンプトを送信できませんでした。もう一度お試しください。',
      noSession: 'この会話はまだ準備できていません。',
      defaultUnavailable: 'プロンプトファイルを読み込めませんでした。プラグインディレクトリの default-prompt.txt と custom-prompt.txt を確認してください。',
      settings: {
        title: 'コミットメッセージを生成',
        description: 'デフォルトのプロンプトは default-prompt.txt から読み込まれます。ここでの変更は custom-prompt.txt に書き込まれ、すぐにボタンで使用されます。',
        label: 'プロンプト',
        save: '保存',
        reset: 'デフォルトに戻す',
        saved: '保存しました',
        empty: '保存する前にプロンプトを入力してください。',
        saveFailed: 'プラグインディレクトリの custom-prompt.txt に書き込めませんでした。',
        loading: 'プロンプトファイルを読み込み中…',
        defaultFailed: 'プラグインディレクトリのプロンプトファイルを読み込めませんでした。',
        retry: '再試行',
        saving: '保存中…',
      },
    };

    const es = {
      button: 'Generar mensaje de commit',
      sending: 'Enviando…',
      error: 'No se pudo enviar el mensaje. Inténtalo de nuevo.',
      noSession: 'Esta conversación aún no está lista.',
      defaultUnavailable: 'No se pudieron leer los archivos de mensaje. Revisa default-prompt.txt y custom-prompt.txt en el directorio del complemento.',
      settings: {
        title: 'Generar mensaje de commit',
        description: 'El mensaje predeterminado proviene de default-prompt.txt. Los cambios aquí se escriben en custom-prompt.txt y el botón los usa de inmediato.',
        label: 'Mensaje',
        save: 'Guardar',
        reset: 'Restaurar predeterminado',
        saved: 'Guardado',
        empty: 'Introduce un mensaje antes de guardar.',
        saveFailed: 'No se pudo escribir custom-prompt.txt en el directorio del complemento.',
        loading: 'Leyendo los archivos de mensaje…',
        defaultFailed: 'No se pudieron leer los archivos de mensaje en el directorio del complemento.',
        retry: 'Reintentar',
        saving: 'Guardando…',
      },
    };

    const fr = {
      button: 'Générer le message de commit',
      sending: 'Envoi…',
      error: "Impossible d'envoyer le message. Réessayez.",
      noSession: "Cette conversation n'est pas encore prête.",
      defaultUnavailable: "Impossible de lire les fichiers de message. Vérifiez default-prompt.txt et custom-prompt.txt dans le répertoire du plugin.",
      settings: {
        title: 'Générer le message de commit',
        description: 'Le message par défaut provient de default-prompt.txt. Les modifications ici sont écrites dans custom-prompt.txt et utilisées immédiatement par le bouton.',
        label: 'Message',
        save: 'Enregistrer',
        reset: 'Rétablir par défaut',
        saved: 'Enregistré',
        empty: "Saisissez un message avant d'enregistrer.",
        saveFailed: "Impossible d'écrire custom-prompt.txt dans le répertoire du plugin.",
        loading: 'Lecture des fichiers de message…',
        defaultFailed: 'Impossible de lire les fichiers de message dans le répertoire du plugin.',
        retry: 'Réessayer',
        saving: 'Enregistrement…',
      },
    };

    const de = {
      button: 'Commit-Nachricht erzeugen',
      sending: 'Wird gesendet…',
      error: 'Die Nachricht konnte nicht gesendet werden. Versuche es erneut.',
      noSession: 'Diese Unterhaltung ist noch nicht bereit.',
      defaultUnavailable: 'Die Prompt-Dateien konnten nicht gelesen werden. Prüfe default-prompt.txt und custom-prompt.txt im Plugin-Verzeichnis.',
      settings: {
        title: 'Commit-Nachricht erzeugen',
        description: 'Die Standardnachricht stammt aus default-prompt.txt. Änderungen hier werden in custom-prompt.txt geschrieben und sofort von der Schaltfläche verwendet.',
        label: 'Nachricht',
        save: 'Speichern',
        reset: 'Standard wiederherstellen',
        saved: 'Gespeichert',
        empty: 'Gib eine Nachricht ein, bevor du speicherst.',
        saveFailed: 'custom-prompt.txt im Plugin-Verzeichnis konnte nicht geschrieben werden.',
        loading: 'Prompt-Dateien werden gelesen…',
        defaultFailed: 'Die Prompt-Dateien im Plugin-Verzeichnis konnten nicht gelesen werden.',
        retry: 'Erneut versuchen',
        saving: 'Speichern…',
      },
    };

    const ru = {
      button: 'Сгенерировать сообщение коммита',
      sending: 'Отправка…',
      error: 'Не удалось отправить сообщение. Попробуйте ещё раз.',
      noSession: 'Этот диалог ещё не готов.',
      defaultUnavailable: 'Не удалось прочитать файлы промпта. Проверьте default-prompt.txt и custom-prompt.txt в каталоге плагина.',
      settings: {
        title: 'Сгенерировать сообщение коммита',
        description: 'Текст по умолчанию берётся из default-prompt.txt. Изменения здесь записываются в custom-prompt.txt и сразу используются кнопкой.',
        label: 'Текст',
        save: 'Сохранить',
        reset: 'Вернуть по умолчанию',
        saved: 'Сохранено',
        empty: 'Введите текст перед сохранением.',
        saveFailed: 'Не удалось записать custom-prompt.txt в каталог плагина.',
        loading: 'Чтение файлов промпта…',
        defaultFailed: 'Не удалось прочитать файлы промпта в каталоге плагина.',
        retry: 'Повторить',
        saving: 'Сохранение…',
      },
    };

    const pt = {
      button: 'Gerar mensagem de commit',
      sending: 'Enviando…',
      error: 'Não foi possível enviar a mensagem. Tente novamente.',
      noSession: 'Esta conversa ainda não está pronta.',
      defaultUnavailable: 'Não foi possível ler os arquivos de mensagem. Verifique default-prompt.txt e custom-prompt.txt no diretório do plugin.',
      settings: {
        title: 'Gerar mensagem de commit',
        description: 'A mensagem padrão vem de default-prompt.txt. As alterações aqui são gravadas em custom-prompt.txt e usadas imediatamente pelo botão.',
        label: 'Mensagem',
        save: 'Salvar',
        reset: 'Restaurar padrão',
        saved: 'Salvo',
        empty: 'Digite uma mensagem antes de salvar.',
        saveFailed: 'Não foi possível gravar custom-prompt.txt no diretório do plugin.',
        loading: 'Lendo os arquivos de mensagem…',
        defaultFailed: 'Não foi possível ler os arquivos de mensagem no diretório do plugin.',
        retry: 'Tentar novamente',
        saving: 'Salvando…',
      },
    };

    const dictionaries = { zh, en, ja, es, fr, de, ru, pt };

    /**
     * The locale service looks keys up flat (`dict['settings.title']`), so a
     * nested dictionary is flattened before registration.
     * @param dictionary - nested dictionary authored above.
     * @param prefix - key prefix accumulated by the recursion.
     * @param flat - output accumulator.
     * @returns flat dotted-key dictionary.
     */
    function flattenDictionary(dictionary, prefix = '', flat = {}) {
      for (const [key, value] of Object.entries(dictionary)) {
        const path = prefix === '' ? key : `${prefix}.${key}`;
        if (typeof value === 'string') flat[path] = value;
        else flattenDictionary(value, path, flat);
      }
      return flat;
    }

    /** Cached prompt state read from the plugin-directory files. */
    let promptState = { defaultPrompt: '', customPrompt: null, prompt: '' };
    let promptStatus = 'loading';
    let promptRequest;
    const promptListeners = new Set();

    /**
     * Publish the current prompt state and notify mounted components.
     * @param status - loading, ready, or error.
     * @param next - accepted prompt state; the previous state on failures.
     */
    function publishPrompt(status, next = promptState) {
      promptStatus = status;
      promptState = next;
      for (const listener of [...promptListeners]) {
        try {
          listener();
        } catch (error) {
          console.error('[dsh-commit-message] prompt listener failed', error);
        }
      }
    }

    /**
     * Validate one Host response.
     * @param value - decoded JSON.
     * @returns normalized prompt state.
     */
    function normalizePromptState(value) {
      if (value === null || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('invalid prompt response');
      }
      const { defaultPrompt, customPrompt, prompt } = value;
      if (typeof defaultPrompt !== 'string' || defaultPrompt.trim() === '') {
        throw new Error('prompt response has no defaultPrompt');
      }
      if (typeof prompt !== 'string' || prompt.trim() === '') {
        throw new Error('prompt response has no effective prompt');
      }
      if (customPrompt !== null && typeof customPrompt !== 'string') {
        throw new Error('prompt response has an invalid customPrompt');
      }
      return { defaultPrompt, customPrompt, prompt };
    }

    /**
     * Read and validate one JSON Host response.
     * @param response - fetch response.
     * @returns normalized prompt state.
     */
    async function readPromptResponse(response) {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const contentType = (response.headers.get('content-type') ?? '').toLowerCase();
      if (!contentType.startsWith('application/json')) {
        throw new Error(`unexpected content type: ${contentType || 'unknown'}`);
      }
      return normalizePromptState(await response.json());
    }

    /**
     * Read the prompt files through the Host route once and share the request.
     * A later call retries after a failure.
     * @returns the loaded state, or null on failure.
     */
    function loadPrompt() {
      if (promptStatus === 'ready') return Promise.resolve(promptState);
      if (promptRequest !== undefined) return promptRequest;
      if (promptStatus !== 'loading') publishPrompt('loading', promptState);
      promptRequest = (async () => {
        try {
          const response = await fetch(PROMPT_URL, {
            cache: 'no-store',
            credentials: 'same-origin',
          });
          const next = await readPromptResponse(response);
          publishPrompt('ready', next);
          return next;
        } catch (error) {
          console.error('[dsh-commit-message] prompt load failed', error);
          publishPrompt('error', promptState);
          return null;
        } finally {
          promptRequest = undefined;
        }
      })();
      return promptRequest;
    }

    /**
     * Persist a custom prompt through the Host route.
     * @param value - custom prompt, or null to remove the override.
     * @returns acceptance and the updated state, or a failure.
     */
    async function savePrompt(value) {
      try {
        const response = await fetch(PROMPT_URL, {
          method: 'PUT',
          cache: 'no-store',
          credentials: 'same-origin',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ prompt: value }),
        });
        const next = await readPromptResponse(response);
        publishPrompt('ready', next);
        return { ok: true, state: next };
      } catch (error) {
        console.error('[dsh-commit-message] prompt save failed', error);
        return { ok: false };
      }
    }

    /** Subscribe a component to the prompt store. */
    function usePrompt() {
      const [state, setState] = React.useState(() => ({ status: promptStatus, ...promptState }));
      React.useEffect(() => {
        let active = true;
        const update = () => {
          if (active) setState({ status: promptStatus, ...promptState });
        };
        promptListeners.add(update);
        update();
        if (promptStatus !== 'ready') void loadPrompt();
        return () => {
          active = false;
          promptListeners.delete(update);
        };
      }, []);
      return state;
    }

    /** Resolve the prompt the button sends from the plugin-directory files. */
    async function resolvePrompt() {
      if (promptStatus === 'ready' && promptState.prompt !== '') {
        return { ok: true, text: promptState.prompt };
      }
      await loadPrompt();
      if (promptStatus === 'ready' && promptState.prompt !== '') {
        return { ok: true, text: promptState.prompt };
      }
      return { ok: false, reason: 'unavailable' };
    }

    /**
     * Send one ordinary user message into the currently displayed session.
     * @param ctx - the browser plugin context.
     * @param sessionId - the scope session id supplied by the dock slot.
     * @param text - the prompt to send.
     * @returns an outcome with a machine reason on failure.
     */
    async function sendPrompt(ctx, sessionId, text) {
      try {
        const binding = ctx.sessions.binding(sessionId);
        if (binding === undefined) return { ok: false, reason: 'no-session' };
        const result = await binding.session.prompt([{ type: 'text', text }], 'queue');
        if (result.ok) return { ok: true };
        console.error('[dsh-commit-message] prompt refused', result.error);
        return { ok: false, reason: 'refused' };
      } catch (error) {
        console.error('[dsh-commit-message] prompt failed', error);
        return { ok: false, reason: 'threw' };
      }
    }

    /** A discreet composer-dock button that sends the configured prompt. */
    function CommitMessageButton({ t, sessionId, send, resolve }) {
      const [busy, setBusy] = React.useState(false);
      const [error, setError] = React.useState('');

      const onClick = async () => {
        if (busy) return;
        setBusy(true);
        setError('');
        try {
          const prompt = await resolve();
          if (!prompt.ok) {
            setError(t('defaultUnavailable'));
            return;
          }
          const outcome = await send(sessionId, prompt.text);
          if (!outcome.ok) setError(outcome.reason === 'no-session' ? t('noSession') : t('error'));
        } catch {
          setError(t('error'));
        } finally {
          setBusy(false);
        }
      };

      return h(
        'span',
        { className: 'dshcm-dock' },
        h(
          'button',
          {
            type: 'button',
            className: 'dshcm-button',
            onClick,
            disabled: busy,
            'aria-busy': busy ? 'true' : undefined,
          },
          h(
            'svg',
            { viewBox: '0 0 16 16', width: '14', height: '14', 'aria-hidden': true },
            h('path', {
              d: 'M8 1.5v3.25M8 11.25v3.25',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '1.5',
              strokeLinecap: 'round',
            }),
            h('circle', {
              cx: '8',
              cy: '8',
              r: '2.75',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '1.5',
            }),
          ),
          h('span', { className: 'dshcm-button-label' }, busy ? t('sending') : t('button')),
        ),
        error ? h('span', { className: 'dshcm-error', role: 'status' }, error) : null,
      );
    }

    /** Shared row copy for the loading, error, and editable states. */
    function PromptRowCopy({ t, description }) {
      return h(
        'div',
        { className: 'dshcm-row-copy' },
        h('div', { className: 'dshcm-row-title' }, t('settings.title')),
        h('div', { className: 'dshcm-row-description' }, description),
      );
    }

    /** The General-settings row: wait for the prompt files, then edit the custom file. */
    function CommitMessageSettingsRow({ t }) {
      const state = usePrompt();

      if (state.status === 'loading') {
        return h(
          'div',
          { className: 'dshcm-row' },
          h(PromptRowCopy, { t, description: t('settings.loading') }),
        );
      }

      if (state.status === 'error') {
        return h(
          'div',
          { className: 'dshcm-row' },
          h(PromptRowCopy, { t, description: t('settings.defaultFailed') }),
          h(
            'div',
            { className: 'dshcm-actions' },
            h(
              'button',
              { type: 'button', className: 'dshcm-reset', onClick: () => void loadPrompt() },
              t('settings.retry'),
            ),
          ),
        );
      }

      return h(CommitMessagePromptForm, { t, state });
    }

    /** The loaded form: reads the effective prompt and writes custom-prompt.txt. */
    function CommitMessagePromptForm({ t, state }) {
      const [draft, setDraft] = React.useState(state.prompt);
      const [saved, setSaved] = React.useState(state.prompt);
      const [hasOverride, setHasOverride] = React.useState(state.customPrompt !== null);
      const [busy, setBusy] = React.useState(false);
      const [status, setStatus] = React.useState('');
      const [tone, setTone] = React.useState('info');
      const dirty = draft !== saved;
      const canReset = hasOverride || draft !== state.defaultPrompt;

      const edit = (value) => {
        setDraft(value);
        setStatus('');
        setTone('info');
      };

      const applyState = (next) => {
        setDraft(next.prompt);
        setSaved(next.prompt);
        setHasOverride(next.customPrompt !== null);
      };

      const save = async () => {
        if (busy) return;
        const next = draft.trim();
        if (next === '') {
          setStatus(t('settings.empty'));
          setTone('error');
          return;
        }
        setBusy(true);
        setStatus(t('settings.saving'));
        setTone('info');
        const result = await savePrompt(next === state.defaultPrompt ? null : next);
        setBusy(false);
        if (!result.ok) {
          setStatus(t('settings.saveFailed'));
          setTone('error');
          return;
        }
        applyState(result.state);
        setStatus(t('settings.saved'));
        setTone('info');
      };

      const reset = async () => {
        if (busy) return;
        setBusy(true);
        setStatus(t('settings.saving'));
        setTone('info');
        const result = await savePrompt(null);
        setBusy(false);
        if (!result.ok) {
          setStatus(t('settings.saveFailed'));
          setTone('error');
          return;
        }
        applyState(result.state);
        setStatus(t('settings.saved'));
        setTone('info');
      };

      return h(
        'div',
        { className: 'dshcm-row' },
        h(PromptRowCopy, { t, description: t('settings.description') }),
        h('label', { className: 'dshcm-label', htmlFor: 'dshcm-prompt' }, t('settings.label')),
        h('textarea', {
          id: 'dshcm-prompt',
          className: 'dshcm-textarea',
          value: draft,
          rows: 3,
          spellCheck: false,
          disabled: busy,
          onChange: (event) => edit(event.currentTarget.value),
        }),
        h(
          'div',
          { className: 'dshcm-actions' },
          h(
            'button',
            {
              type: 'button',
              className: 'dshcm-save',
              onClick: save,
              disabled: busy || !dirty,
            },
            t('settings.save'),
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'dshcm-reset',
              onClick: reset,
              disabled: busy || !canReset,
            },
            t('settings.reset'),
          ),
          status
            ? h('span', { className: 'dshcm-status', role: 'status', 'data-tone': tone }, status)
            : null,
        ),
      );
    }

    const styles = `
      .dshcm-dock {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        vertical-align: middle;
      }
      .dshcm-button {
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        max-width: 100%;
        padding: 1px 8px;
        color: var(--dsw-alias-label-secondary);
        font: inherit;
        font-size: 12px;
        line-height: 20px;
        white-space: nowrap;
        cursor: pointer;
        background: var(--dsw-alias-bg-layer-1);
        border: 0.5px solid var(--dsw-alias-border-l1);
        border-radius: var(--dsw-radius-sm);
      }
      .dshcm-button:disabled {
        cursor: default;
        opacity: 0.55;
      }
      .dshcm-button:focus-visible {
        outline: 2px solid var(--dsw-alias-brand-primary);
        outline-offset: 2px;
      }
      .dshcm-button svg {
        flex: none;
        width: 14px;
        height: 14px;
      }
      .dshcm-button-label {
        overflow: hidden;
        text-overflow: ellipsis;
      }
      @media (hover: hover) {
        .dshcm-button:hover:not(:disabled) {
          color: var(--dsw-alias-label-primary);
          background: var(--dsw-alias-bg-layer-2);
        }
      }
      .dshcm-error {
        color: var(--dsw-alias-state-error-primary);
        font-size: 12px;
        line-height: 20px;
        white-space: nowrap;
      }
      .dshcm-row {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px 0;
        color: var(--dsw-alias-label-primary);
        font-size: 14px;
        line-height: 22px;
        border-bottom: 0.5px solid var(--dsw-alias-border-l1);
      }
      .dshcm-row-title {
        font-size: 14px;
        line-height: 20px;
      }
      .dshcm-row-description {
        margin-top: 4px;
        color: var(--dsw-alias-label-secondary);
        font-size: 12px;
        line-height: 18px;
      }
      .dshcm-label {
        color: var(--dsw-alias-label-secondary);
        font-size: 12px;
        line-height: 18px;
      }
      .dshcm-textarea {
        box-sizing: border-box;
        width: 100%;
        min-height: 72px;
        padding: 8px 10px;
        color: var(--dsw-alias-label-primary);
        font-family: inherit;
        font-size: 13px;
        line-height: 20px;
        resize: vertical;
        background: var(--dsw-alias-bg-layer-1);
        border: 0.5px solid var(--dsw-alias-border-l1);
        border-radius: var(--dsw-radius-md);
      }
      .dshcm-textarea:focus-visible {
        outline: 2px solid var(--dsw-alias-brand-primary);
        outline-offset: 1px;
      }
      .dshcm-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }
      .dshcm-save,
      .dshcm-reset {
        box-sizing: border-box;
        height: 32px;
        padding: 0 14px;
        font: inherit;
        font-size: 13px;
        line-height: 20px;
        cursor: pointer;
        border-radius: var(--dsw-radius-md);
      }
      .dshcm-save {
        color: var(--dsw-alias-label-primary-foreground);
        font-weight: 500;
        background: var(--dsw-alias-brand-primary);
        border: 0.5px solid transparent;
      }
      .dshcm-save:disabled {
        cursor: default;
        opacity: 0.45;
      }
      @media (hover: hover) {
        .dshcm-save:hover:not(:disabled) {
          opacity: 0.88;
        }
      }
      .dshcm-save:focus-visible,
      .dshcm-reset:focus-visible {
        outline: 2px solid var(--dsw-alias-brand-primary);
        outline-offset: 2px;
      }
      .dshcm-reset {
        color: var(--dsw-alias-label-secondary);
        background: transparent;
        border: 0.5px solid var(--dsw-alias-border-l1);
      }
      .dshcm-reset:disabled {
        cursor: default;
        opacity: 0.45;
      }
      @media (hover: hover) {
        .dshcm-reset:hover:not(:disabled) {
          background: var(--dsw-alias-bg-layer-2);
        }
      }
      .dshcm-status {
        color: var(--dsw-alias-label-secondary);
        font-size: 12px;
        line-height: 20px;
      }
      .dshcm-status[data-tone='error'] {
        color: var(--dsw-alias-state-error-primary);
      }
    `;

    return {
      inject: ['slots', 'locale', 'sessions'],
      apply(ctx) {
        ctx.effect(() => {
          const disposers = Object.entries(dictionaries).map(([locale, dictionary]) =>
            ctx.locale.register(NS, locale, flattenDictionary(dictionary)),
          );
          return () => {
            for (const dispose of disposers) dispose();
          };
        }, 'dsh-commit-message: dictionaries');

        ctx.effect(() => {
          const tag = document.createElement('style');
          tag.dataset.plugin = '@local/dsh-commit-message';
          tag.textContent = styles;
          document.head.appendChild(tag);
          return () => tag.remove();
        }, 'dsh-commit-message: styles');

        ctx.slots.inject('conversation.composer.dock', () =>
          ctx.slots.register(
            {
              name: 'conversation.composer.dock',
              id: 'commit-message',
              order: -1,
              locale: NS,
              inject: () => ({
                send: (sessionId, text) => sendPrompt(ctx, sessionId, text),
                resolve: () => resolvePrompt(),
              }),
            },
            CommitMessageButton,
          ),
        );

        ctx.slots.inject('settings.general.item', () =>
          ctx.slots.register(
            {
              name: 'settings.general.item',
              id: 'commit-message',
              order: 30,
              locale: NS,
            },
            CommitMessageSettingsRow,
          ),
        );
      },
    };
  },
});
