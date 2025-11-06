import { Middleware } from 'grammy';

const userLastMessage = new Map<number, number>();

export const antispamMiddleware: Middleware = async (ctx, next) => {
    const userId = ctx.from?.id;
    const now = Date.now();

    if (userId) {
        const lastMessage = userLastMessage.get(userId);
        if (lastMessage && now - lastMessage < 1000) {
            await ctx.reply('Please wait before sending another message');
            return;
        }
        userLastMessage.set(userId, now);
    }

    await next();
};