import axios from 'axios'
import * as process from "node:process";

export const testReq = async (ctx) => {
    await ctx.answerCallbackQuery();
    try {
        const response = process.env.TEST_URL ? await axios.get(`${process.env.TEST_URL}/brands/brandTree/10297`, {
            headers: {
                "User-Agent": 'E-power'
            },
            auth: {
                username: process.env.USERNAME || '',
                password: process.env.PASSWORD || '',
            }
        }) : await axios.get('https://api.av.by/offer-types/cars/landings/filter', {
            headers: {
                "User-Agent": 'E-power'
            }
        });
        await ctx.reply(`Запрос успешен c ${process.env.TEST_URL ? 'process.env.TEST_URL' : 'default url'}! \n ${JSON.stringify(response.data)}`);
    } catch (error) {
        await ctx.reply(`Ошибка при выполнении запроса: \n ${error}`);
    }
};