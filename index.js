import { randomUUID } from 'node:crypto';
import { readFile, rename, unlink, writeFile } from 'node:fs/promises';

/** Exact route the browser half reads and updates. */
const PROMPT_PATH = '/commit-message/prompt';
/** Shipped, read-only default prompt. */
const DEFAULT_PROMPT_FILE = new URL('./default-prompt.txt', import.meta.url);
/** Runtime override written by the Settings row. */
const CUSTOM_PROMPT_FILE = new URL('./custom-prompt.txt', import.meta.url);
/** Largest accepted write body; prompts are small text. */
const MAX_BODY_BYTES = 64 * 1024;

/**
 * Send one JSON response with no caching.
 * @param res - Node response.
 * @param status - HTTP status.
 * @param payload - JSON-serializable body.
 */
function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.setHeader('x-content-type-options', 'nosniff');
  res.setHeader('content-length', String(Buffer.byteLength(body)));
  res.end(body);
}

/**
 * Send one plain-text error response.
 * @param res - Node response.
 * @param status - HTTP status.
 * @param text - body.
 */
function sendText(res, status, text) {
  res.statusCode = status;
  res.setHeader('content-type', 'text/plain; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.setHeader('x-content-type-options', 'nosniff');
  res.setHeader('content-length', String(Buffer.byteLength(text)));
  res.end(text);
}

/**
 * Read one prompt file; a missing file is null, not an error.
 * @param file - file URL beside this module.
 * @returns trimmed UTF-8 text, or null when absent.
 */
async function readPromptFile(file) {
  try {
    return (await readFile(file, 'utf8')).replace(/\r\n/g, '\n').trim();
  } catch (error) {
    if (error !== null && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return null;
    throw error;
  }
}

/**
 * Collect a bounded JSON request body.
 * @param req - Node request.
 * @returns parsed JSON value.
 * @throws an Error with code too-large or invalid-json.
 */
async function readJsonBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error('body too large');
      error.code = 'too-large';
      throw error;
    }
    chunks.push(buffer);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    const error = new Error('invalid JSON body');
    error.code = 'invalid-json';
    throw error;
  }
}

/**
 * Compose the client-facing state. An empty or equal-to-default custom file is
 * treated as no override.
 * @param defaultPrompt - shipped default.
 * @param customPrompt - stored custom text, or null.
 * @returns default, custom, and effective prompts.
 */
function promptState(defaultPrompt, customPrompt) {
  const custom = customPrompt !== null && customPrompt !== '' && customPrompt !== defaultPrompt ? customPrompt : null;
  return {
    defaultPrompt,
    customPrompt: custom,
    prompt: custom ?? defaultPrompt,
  };
}

/**
 * Host half: serve the effective prompt and persist a custom override into the
 * plugin directory. The Client module renders the button and settings row.
 * @param ctx - Host plugin context.
 */
export function apply(ctx) {
  ctx.inject(['webServer', 'connection'], (child) => {
    child.effect(
      () =>
        child.webServer.register({
          kind: 'exact',
          path: PROMPT_PATH,
          handler: async (req, res) => {
            const rejection = child.connection.requestRejection(req);
            if (rejection !== undefined) {
              res.statusCode = rejection;
              res.end();
              return;
            }

            if (req.method !== 'GET' && req.method !== 'PUT') {
              res.statusCode = 405;
              res.setHeader('allow', 'GET, PUT');
              res.end();
              return;
            }

            let defaultPrompt;
            try {
              defaultPrompt = await readPromptFile(DEFAULT_PROMPT_FILE);
            } catch (error) {
              child.logger?.warn?.(`[commit-message] cannot read default-prompt.txt: ${error instanceof Error ? error.message : String(error)}`);
              sendText(res, 500, 'cannot read default-prompt.txt');
              return;
            }
            if (defaultPrompt === null || defaultPrompt === '') {
              sendText(res, 500, 'default-prompt.txt is missing or empty');
              return;
            }

            if (req.method === 'GET') {
              let customPrompt;
              try {
                customPrompt = await readPromptFile(CUSTOM_PROMPT_FILE);
              } catch (error) {
                child.logger?.warn?.(`[commit-message] cannot read custom-prompt.txt: ${error instanceof Error ? error.message : String(error)}`);
                sendText(res, 500, 'cannot read custom-prompt.txt');
                return;
              }
              sendJson(res, 200, promptState(defaultPrompt, customPrompt));
              return;
            }

            const contentType = String(req.headers['content-type'] ?? '').split(';', 1)[0]?.trim().toLowerCase();
            if (contentType !== 'application/json') {
              sendJson(res, 415, { error: 'content-type must be application/json' });
              return;
            }

            let body;
            try {
              body = await readJsonBody(req);
            } catch (error) {
              const tooLarge = error !== null && typeof error === 'object' && 'code' in error && error.code === 'too-large';
              sendJson(res, tooLarge ? 413 : 400, { error: tooLarge ? 'body too large' : 'invalid JSON body' });
              return;
            }

            if (body === null || typeof body !== 'object' || Array.isArray(body) || !Object.hasOwn(body, 'prompt')) {
              sendJson(res, 400, { error: 'prompt must be a string or null' });
              return;
            }
            const raw = body.prompt;
            if (raw !== null && typeof raw !== 'string') {
              sendJson(res, 400, { error: 'prompt must be a string or null' });
              return;
            }
            let text = raw === null ? null : raw.replace(/\r\n/g, '\n').trim();
            if (text === '') {
              sendJson(res, 400, { error: 'prompt must not be empty' });
              return;
            }
            if (text === defaultPrompt) text = null;

            try {
              if (text === null) {
                await unlink(CUSTOM_PROMPT_FILE).catch((error) => {
                  if (error !== null && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return;
                  throw error;
                });
              } else {
                const temporary = new URL(`./.custom-prompt-${randomUUID()}.tmp`, import.meta.url);
                try {
                  await writeFile(temporary, text, 'utf8');
                  await rename(temporary, CUSTOM_PROMPT_FILE);
                } catch (error) {
                  await unlink(temporary).catch(() => {});
                  throw error;
                }
              }
            } catch (error) {
              child.logger?.warn?.(`[commit-message] cannot write custom-prompt.txt: ${error instanceof Error ? error.message : String(error)}`);
              sendJson(res, 500, { error: 'cannot write custom-prompt.txt' });
              return;
            }

            sendJson(res, 200, promptState(defaultPrompt, text));
          },
        }),
      'commit-message: prompt route',
    );
  });
}
