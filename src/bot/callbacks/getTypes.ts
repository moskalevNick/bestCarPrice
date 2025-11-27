import {Context} from "grammy";
import {InlineKeyboard} from "grammy";
import startupConfig from '../../startup.json';
import axios from "axios";
import process from "node:process";

export const getTypes = async (ctx: Context) => {
    await ctx.answerCallbackQuery();

    const startupConfigResponse = await axios.get(`${process.env.TEST_URL}/brands/getAll`, {
        headers: {
            "User-Agent": 'E-power',
            "x-user-id": `${ctx.from?.id}`,
            "x-chat-id": `${ctx.me.id}`,
        },
        auth: {
            username: process.env.USERNAME || '',
            password: process.env.PASSWORD || '',
        }
    })

    const startupConfig = startupConfigResponse.data

    // Получаем ключи из конфига (cars, moto)
    const types = Object.keys(startupConfig);
    const keyboard = new InlineKeyboard();

    // Для каждого типа создаем кнопку
    types.forEach(type => {
        const typeData = startupConfig[type];
        const title = typeData.name || type;
        keyboard.text(title, `nav_brands_${typeData.id}`).row();
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