import { show } from './trigger';

import { ERROR_MESSAGE } from '../../../../libs/handler';

export const getTrigger = (appName: string) => {
  if (!appName) ERROR_MESSAGE.ERROR_HANDLER('The app name is required.');
  show(appName);
};
