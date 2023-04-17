import { Input } from '../interfaces';

export abstract class AbstractAction {
  public abstract handle(
    input?: Input[],
    options?: Input[],
  ): Promise<void>;
}
