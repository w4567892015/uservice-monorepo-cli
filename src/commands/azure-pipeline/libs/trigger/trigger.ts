import fs from 'fs-extra';
import path from 'path';

import { AZURE_PIPELINE_MESSAGES, ERROR_MESSAGE } from '../../../../libs/handler';

const libs = {};
const rootDir = process.cwd();

const readDir = (dir: string, extname = '.ts') => {
  if (!dir) throw new Error('`dir` must be specified.');
  if (!extname) throw new Error('`extname` must be specified.');
  if (fs.pathExistsSync(dir) === false) return;
  if (fs.statSync(dir).isDirectory() === false) {
    return [dir];
  }

  const protosFiles = fs.readdirSync(dir);
  let files = protosFiles
    .filter((file) => path.extname(file) === extname)
    .map((file) => `${dir}/${file}`);

  const dirs = protosFiles
    .filter((file) => path.extname(file) !== extname)
    .map((file) => `${dir}/${file}`)
    .filter((file) => fs.statSync(file).isDirectory());

  if (dirs.length > 0) {
    dirs.forEach((_dir) => {
      files = files.concat(readDir(_dir, extname));
    });
  }
  return files;
};

function findLib(dir: string) {
  const files = readDir(dir, '.ts')
    .filter((file) => !(file.endsWith('.spec.ts') || file.endsWith('.e2e-spec.ts')));

  for (let i = 0; i < files.length; i++) {
    const content = fs.readFileSync(files[i])
      .toString()
      .split('\n')
      .filter((line) => /'@libs\/.+;$/g.test(line));

    content.forEach((line) => {
      const idx = line.indexOf('@libs');
      const libPath = line.substring(idx, line.length - 2);
      const splitLibPath = libPath.split('/');
      let libName = splitLibPath[1];
      const libDirPath = path.join(rootDir, 'libs', libName);

      if (libName === 'database') {
        if (splitLibPath.length > 2) {
          libName = `${splitLibPath[1]}/src/${splitLibPath[2]}/${splitLibPath[3]}/models`;
        } else {
          return;
        }
      }

      if (libs[libName]) {
        return;
      }

      libs[libName] = {};
      findLib(libDirPath);
    });
  }
}

const run = (appName: string) => {
  const appDir = `${rootDir}/apps/${appName}`;
  if (!fs.pathExistsSync(appDir)) {
    ERROR_MESSAGE.ERROR_HANDLER(`The application "${appName}" is not found`);
  }

  findLib(appDir);

  const tmp = Object.keys(libs).map((item) => (`/libs/${item}/*`));
  const result = {
    count: tmp.length,
    branch: [
      `/apps/${appName}/*`,
      ...tmp,
      '!/**/*.md',
      '!/**/.pipeline/*',
    ],
    trigger: [
      `/apps/${appName}/*`,
      ...tmp,
    ],
  };
  return result;
};

export const show = (appName: string) => {
  const data = run(appName);
  AZURE_PIPELINE_MESSAGES.PRINT_TRIGGER(data);
};
