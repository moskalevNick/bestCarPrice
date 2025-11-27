import {Context, InlineKeyboard} from "grammy";
import {navigateConfig} from "./navigation.helpers";
import axios from "axios";
import process from "node:process";

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

export const handleNavigationBrands = async (ctx: any): Promise<void> => {
    const callbackData = ctx.callbackQuery.data;

    if (callbackData === "start") {
        await handleStart(ctx);
        return;
    }

    if (!callbackData.startsWith('nav_')) {
        await ctx.reply("❌ Неизвестная команда");
        return;
    }

    const id = callbackData.replace('nav_brands_', '').split('_')[0];
//TODO catch errors
    const brandRes = await axios.get(`${process.env.TEST_URL}/brands/brandTree/${id}`, {
        headers: {
            "User-Agent": 'E-power',
            "x-user-id": `${ctx.from.id}`,
            "x-chat-id": `${ctx.me.id}`,
        },
        auth: {
            username: process.env.USERNAME || '',
            password: process.env.PASSWORD || '',
        }
    })

    const models = brandRes.data.models.map(el => el.name)

    const keyboard = new InlineKeyboard();

    // Для каждой модели создаем кнопку
    models.forEach(model => {
        const typeData = brandRes.data.models.find(el => el.name === model);
        keyboard.text(model, `nav_models_${typeData.id}`).row();
    });

    keyboard.text("« Назад", `get_types`);

    if (ctx.callbackQuery?.message) {
        await ctx.editMessageText("Выберите модель транспорта:", {
            reply_markup: keyboard,
        });
    } else {
        await ctx.reply("Выберите модель транспорта:", {
            reply_markup: keyboard,
        });
    }
    // await navigateConfig(ctx, path);
};