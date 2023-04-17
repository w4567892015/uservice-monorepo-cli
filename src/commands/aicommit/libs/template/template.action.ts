import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

export const merge = (fileName: string, data: Object) => {
  const template = Handlebars.compile(fs.readFileSync(path.join(__dirname, `./tmpls/${fileName}.hbs`), 'utf8'));
  return template(data);
};
