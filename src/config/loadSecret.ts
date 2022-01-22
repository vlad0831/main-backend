import { promises } from 'fs';
import { basename, resolve } from 'path';
import { Logger } from '@nestjs/common';

const logger = new Logger('loadSecret');
const { readdir, stat, readFile } = promises;

const findFilesInDirIteratively = async (...dirList: string[]) => {
  const files: string[] = [];
  const dirInRead: string[] = [...dirList];

  while (dirInRead.length) {
    const dirPath = dirInRead.shift();
    const dirContent = await readdir(dirPath);
    const extraDir: string[] = [];
    for (const content of dirContent) {
      const contentPath = resolve(dirPath, content);
      const status = await stat(contentPath);
      if (status?.isFile()) {
        files.push(contentPath);
      } else if (status?.isDirectory()) {
        extraDir.push(contentPath);
      }
    }
    dirInRead.unshift(...extraDir);
  }

  return files;
};

const loadSecret =
  (...dirList: string[]) =>
  async () => {
    const files = await findFilesInDirIteratively(...dirList);
    const secrets: Record<string, string> = {};
    for (const file of files) {
      try {
        const value = (await readFile(file, 'utf-8')).trim();
        const key = basename(file);
        secrets[key] = value;
      } catch {
        logger.warn('cannot fetch secret from: ', file);
      }
    }

    return secrets;
  };

export default loadSecret;
