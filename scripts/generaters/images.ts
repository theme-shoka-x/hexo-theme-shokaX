import { readdir, readFile } from 'node:fs/promises'

hexo.extend.generator.register('images', async function (locals) {
  const theme = hexo.theme.config;
  const dir = 'source/_data/' + theme.assets + '/';

  try {
    const files = await readdir(dir);
    
    const result = await Promise.all(files.map(async (file) => {
      const fileContent = await readFile(dir + file);
      return {
        path: theme.assets + '/' + file,
        data: fileContent
      };
    }));

    return result;
  } catch (e) {
    hexo.log.error('Failed to read assets directory:', e);
    return [];
  }
});