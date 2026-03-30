import { fileURLToPath, URL } from 'node:url';
import fs from 'node:fs';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { plugin as mdPlugin, Mode } from 'vite-plugin-markdown';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    mdPlugin({ mode: [Mode.HTML, Mode.TOC, Mode.VUE] }),
    {
      name: 'enrich-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/enrich' && req.method === 'POST') {
            const { exec } = await import('node:child_process');
            exec('npm run enrich', (error, stdout, stderr) => {
              res.setHeader('Content-Type', 'application/json');
              if (error) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: error.message, stderr }));
              } else {
                res.end(JSON.stringify({ success: true, stdout }));
              }
            });
          } else if (req.url === '/api/add-build' && req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => (body += chunk.toString()));
            req.on('end', () => {
              try {
                const { build, profession } = JSON.parse(body);
                const buildsPath = './src/data/builds.json';
                const fileContent = fs.readFileSync(buildsPath, 'utf-8');
                const buildsData = JSON.parse(fileContent);

                // Check for duplicate chatCode
                const isDuplicate = Object.values(buildsData).some((profBuilds) =>
                  Array.isArray(profBuilds) && profBuilds.some((b) => b.chatCode === build.chatCode),
                );

                if (isDuplicate) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Ce code chat est déjà utilisé par un autre build.' }));
                  return;
                }

                if (!buildsData[profession]) {
                  buildsData[profession] = [];
                }
                buildsData[profession].push(build);

                fs.writeFileSync(buildsPath, JSON.stringify(buildsData, null, 2), 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
          } else {
            next();
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});

