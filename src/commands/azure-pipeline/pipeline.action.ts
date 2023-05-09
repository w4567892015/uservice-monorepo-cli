import { Input } from '../interfaces';
import { AbstractAction } from '../abstract/abstract.action';

import { ERROR_MESSAGE } from '../../libs/handler';

const itemsFinder = (name: string, items: Input[]) => items.find((item) => item.name === name);

export class PipelineAction extends AbstractAction {
  public async handle(inputs: Input[]): Promise<void> {
    const appName = itemsFinder('name', inputs).value as string;
    if (!appName) ERROR_MESSAGE.ERROR_HANDLER('The app name is required.');

    console.info('done.');
  }
}
