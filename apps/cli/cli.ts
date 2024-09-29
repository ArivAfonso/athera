import chalk from 'chalk';
import { input, confirm, select, Separator } from '@inquirer/prompts';
import { handleCommands } from './src/commands/handleCommands';

async function welcome() {
    console.log(`
      ${chalk.bgBlue('HOW TO PLAY')} 
      I am a process on your computer.
      If you get any question wrong I will be ${chalk.bgRed('killed')}
      So get all the questions right...
  
    `);
}

async function inputCommand() {
    const command = await select({
        message: 'Select a command',
        choices: [
            {
                name: 'Ban User',
                value: 'ban',
            },
            {
                name: 'Feature Post',
                value: 'feat',
            },
        ],
    });

    await handleCommands(command);

    const continueAnswer = await confirm({
        message: 'Do you want to continue?',
    });
    if (!continueAnswer) {
        console.log('Goodbye!');
        process.exit(0);
    }
}

// Run it with top-level await
console.clear();
await welcome();
await inputCommand();
