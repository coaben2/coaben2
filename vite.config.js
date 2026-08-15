import { fileURLToPath, URL } from 'node:url';
import fs from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { plugin as mdPlugin, Mode } from 'vite-plugin-markdown';

const BUILDS_FILE_PATH = fileURLToPath(new URL('./src/data/builds.json', import.meta.url));
const ENRICH_SCRIPT_PATH = fileURLToPath(new URL('./src/stores/enrichBuilds.js', import.meta.url));
const execFileAsync = promisify(execFile);

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

async function runEnrichBuildsScript() {
  const { stdout, stderr } = await execFileAsync(process.execPath, [ENRICH_SCRIPT_PATH], {
    cwd: fileURLToPath(new URL('.', import.meta.url)),
    timeout: 180000,
    maxBuffer: 1024 * 1024 * 8,
  });

  return {
    stdout: (stdout || '').trim(),
    stderr: (stderr || '').trim(),
  };
}

function devBuildApiPlugin() {
  return {
    name: 'dev-build-api',
    configureServer(server) {
      server.middlewares.use('/api/add-build', async (req, res) => {
        if (req.method !== 'POST') {
          sendJson(res, 405, { success: false, error: 'Method not allowed' });
          return;
        }

        try {
          const raw = await readRequestBody(req);
          const parsed = JSON.parse(raw || '{}');
          const build = parsed?.build;
          const profession = parsed?.profession;

          if (!build || typeof build !== 'object') {
            sendJson(res, 400, { success: false, error: 'Payload build manquant ou invalide.' });
            return;
          }

          if (!profession || typeof profession !== 'string') {
            sendJson(res, 400, { success: false, error: 'Profession manquante ou invalide.' });
            return;
          }

          const fileContent = await fs.readFile(BUILDS_FILE_PATH, 'utf8');
          const data = JSON.parse(fileContent || '{}');

          if (!Array.isArray(data[profession])) {
            data[profession] = [];
          }

          const existingIndex = data[profession].findIndex((entry) => entry?.id === build.id);
          if (existingIndex >= 0) {
            data[profession][existingIndex] = { ...build };
          } else {
            data[profession].push({ ...build });
          }

          await fs.writeFile(BUILDS_FILE_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
          sendJson(res, 200, { success: true, updated: existingIndex >= 0 });
        } catch (error) {
          sendJson(res, 500, { success: false, error: error?.message || 'Erreur serveur inconnue.' });
        }
      });

      server.middlewares.use('/api/enrich', async (req, res) => {
        if (req.method !== 'POST') {
          sendJson(res, 405, { success: false, error: 'Method not allowed' });
          return;
        }

        try {
          const result = await runEnrichBuildsScript();
          sendJson(res, 200, {
            success: true,
            message: 'Enrichment complete',
            stdout: result.stdout,
            stderr: result.stderr,
          });
        } catch (error) {
          const stdout = error?.stdout ? String(error.stdout).trim() : '';
          const stderr = error?.stderr ? String(error.stderr).trim() : '';
          sendJson(res, 500, {
            success: false,
            error: error?.message || 'Erreur enrich inconnue.',
            stdout,
            stderr,
          });
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const basePath = env.VITE_BASE_PATH || '/';

  return {
    base: basePath,
    plugins: [
      vue(),
      mdPlugin({ mode: [Mode.HTML, Mode.TOC, Mode.VUE] }),
      devBuildApiPlugin(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  };
});

