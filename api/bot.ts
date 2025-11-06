import {VercelRequest, VercelResponse} from '@vercel/node';
import {NestFactory} from '@nestjs/core';
import {AppModule} from '../src/app.module';
import {BotService} from '../src/bot/bot.service';
import {webhookCallback} from 'grammy';

let cachedBotHandler: any = null;

async function bootstrapBot() {
    if (cachedBotHandler) {
        return cachedBotHandler;
    }

    // Создаем NestJS приложение
    const app = await NestFactory.create(AppModule);
    const botService = app.get(BotService);

    // Создаем webhook обработчик
    const handler = webhookCallback(botService.bot, 'http');

    cachedBotHandler = handler;
    return handler;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const botHandler = await bootstrapBot();
        return botHandler(req, res);
    } catch (error) {
        console.error('Error in webhook handler:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}