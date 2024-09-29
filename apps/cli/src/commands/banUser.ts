import { input, select } from '@inquirer/prompts';
import chalk from 'chalk';
// import { supabase } from '../supabase';

async function banUser() {
    const username = await input({
        message: 'Enter the user id you want to ban',
    });

    const reason = await select({
        message: 'Select a reason',
        choices: [
            {
                name: 'Spam',
                value: 'spam',
            },
            {
                name: 'NSFW',
                value: 'nsfw',
            },
            {
                name: 'Harassment',
                value: 'harassment',
            },
            {
                name: 'Hate speech',
                value: 'hate_speech',
            },
            {
                name: 'Violence',
                value: 'violence',
            },
            {
                name: 'Other',
                value: 'other',
            },
        ],
    });

    // const { data, error } = await supabase.auth.admin.deleteUser(username);

    // await supabase.from('users').delete().eq('id', username);

    // await supabase
    //     .from('banned_users')
    //     .insert([{ email: data.user?.email, reason: reason }]);
    console.log(chalk.red(`User ${username} has been banned`));
}

export default banUser;
