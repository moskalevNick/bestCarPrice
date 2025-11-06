import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {BotService} from './bot/bot.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // В разработке запускаем long-polling
    if (process.env.NODE_ENV === 'development') {
        const botService = app.get(BotService);
        await botService.bot.start();
        console.log('Bot started in development mode (long-polling)');
    }

    await app.listen(3000);
}

bootstrap();