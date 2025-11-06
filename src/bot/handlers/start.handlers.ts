import { CommandContext } from 'grammy';

export class StartHandler {
    static async handle(ctx: CommandContext<any>) {
        await ctx.reply('Welcome! Use /help for commands list');
    }
}