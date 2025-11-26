import axios from 'axios'

export const testReq = async (ctx) => {
    await ctx.answerCallbackQuery();

    try {
        const response = await axios.get('https://api.av.by/offer-types/cars/landings/filter', {
            headers: {
                "User-Agent": 'E-power'
            }
        });
        await ctx.reply(`Запрос успешен! \n ${JSON.stringify(response.data)}`);
    } catch (error) {
        await ctx.reply(`Ошибка при выполнении запроса: \n ${error}`);
    }
};