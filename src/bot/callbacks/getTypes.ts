import {Context} from "grammy";
import {InlineKeyboard} from "grammy";
import startupConfig from 'startup.json';

export const getTypes = async (ctx: Context) => {
    await ctx.answerCallbackQuery();

    // Получаем ключи из конфига (cars, moto)
    const types = Object.keys(startupConfig);
    const keyboard = new InlineKeyboard();

    // Для каждого типа создаем кнопку
    types.forEach(type => {
        const typeData = (startupConfig as any)[type];
        const title = typeData.title || type;
        keyboard.text(title, `nav_${type}`).row();
    });

    // Добавляем кнопку "Назад"
    keyboard.text("« Назад", "start");

    // Используем editMessageText вместо reply, если это ответ на коллбэк
    if (ctx.callbackQuery?.message) {
        await ctx.editMessageText("Выберите категорию транспорта:", {
            reply_markup: keyboard,
        });
    } else {
        await ctx.reply("Выберите категорию транспорта:", {
            reply_markup: keyboard,
        });
    }
};