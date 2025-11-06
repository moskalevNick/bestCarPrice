export const defaultCb = async (ctx) => {
    console.log("Неизвестный payload:", ctx.callbackQuery.data);
    await ctx.answerCallbackQuery(); // Всегда отвечаем, чтобы убрать анимацию загрузки
}