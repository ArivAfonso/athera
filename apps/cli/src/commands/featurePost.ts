import { input, select } from '@inquirer/prompts';
import chalk from 'chalk';
// import { supabase } from '../supabase';

async function featurePost() {
    const username = await input({
        message: 'Enter the post id you want to feature',
    });

    console.log(`Title: ${chalk.yellow(username)}`);
    console.log(`Author: ${chalk.yellow('John Doe')}`);
    console.log(`Content: ${chalk.yellow('This is a sample post')}`);

    console.log(chalk.green('Do you want to feature this post?'));
    const feature = await select({
        message: 'Select an option',
        choices: [
            {
                name: 'Yes',
                value: 'yes',
            },
            {
                name: 'No',
                value: 'no',
            },
        ],
    });

    if (feature === 'yes') {
        //Select a date
        console.log(chalk.green('Select a date to feature the post'));
        const date = await input({
            message: 'Enter the date',
        });

        console.log(chalk.green(`Post has been featured till ${date}`));
    } else {
        console.log(chalk.red('Post has not been featured!'));
    }
}

export default featurePost;
