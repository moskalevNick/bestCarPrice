import { Context } from 'grammy';

export class EchoHandler {
    static async handle(ctx: Context) {
        if (ctx.message?.text) {
            await ctx.reply(`You said: ${ctx.message.text}`);
        }
    }
}