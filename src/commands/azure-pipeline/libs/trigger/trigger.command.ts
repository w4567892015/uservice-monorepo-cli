import { Command } from 'commander';
import { getTrigger } from './trigger.action';

export const triggerCommand = (): Command => {
  const commander = new Command('trigger [app_name]')
    .description('Get pipeline trigger to find the what libs are used in the application.')
    .action(async (name) => {
      if (name) {
        getTrigger(name);
      } else {
        commander.help();
      }
    });
  return commander;
};
