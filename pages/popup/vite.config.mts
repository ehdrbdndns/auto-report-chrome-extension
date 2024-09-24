import { resolve } from 'path';
import { withPageConfig } from '@extension/vite-config';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ImportMetaEnv {
  readonly VITE_GPT_SECRET_KEY: string;
}

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');

export default withPageConfig({
  resolve: {
    alias: {
      '@src': srcDir,
    },
  },
  publicDir: resolve(rootDir, 'public'),
  build: {
    outDir: resolve(rootDir, '..', '..', 'dist', 'popup'),
  },
});
