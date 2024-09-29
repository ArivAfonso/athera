import banUser from './banUser';
import featurePost from './featurePost';

export async function handleCommands(command: string) {
    switch (command) {
        case 'ban':
            await banUser();
            break;
        case 'feat':
            await featurePost();
            break;
        case 'pban':
            console.log('You have been permanently banned!');
            break;
        default:
            console.log('Invalid command');
            break;
    }
}
