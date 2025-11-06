import {Context, InlineKeyboard} from "grammy";
import {navigateConfig} from "./navigation.helpers";

export const handleStart = async (ctx: Context) => {
    await ctx.answerCallbackQuery();

    const inlineKeyboard = new InlineKeyboard()
        .text("Категории обьявлений", "get_types").row()
        .text("О сервисе", "about_us");

    if (ctx.callbackQuery?.message) {
        await ctx.editMessageText("Добро пожаловать! Выберите действие:", {
            reply_markup: inlineKeyboard,
        });
    } else {
        await ctx.reply("Добро пожаловать! Выберите действие:", {
            reply_markup: inlineKeyboard,
        });
    }
};

export const handleNavigation = async (ctx: any): Promise<void> => {
    const callbackData = ctx.callbackQuery.data;

    if (callbackData === "start") {
        await handleStart(ctx);
        return;
    }

    if (!callbackData.startsWith('nav_')) {
        await ctx.reply("❌ Неизвестная команда");
        return;
    }

    const path = callbackData.replace('nav_', '').split('_');
    await navigateConfig(ctx, path);
};