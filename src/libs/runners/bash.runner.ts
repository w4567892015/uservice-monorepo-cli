import { AbstractRunner } from './abstract.runner';

export class BashRunner extends AbstractRunner {
  constructor() {
    super('bash');
  }
}
