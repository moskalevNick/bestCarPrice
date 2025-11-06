import {Injectable, OnModuleInit, OnModuleDestroy} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Bot, Context, InlineKeyboard} from 'grammy';
import {handleNavigation, handleStart} from "./callbacks/handelNavigation";
import {aboutUs} from "./callbacks/aboutUs";
import {getTypes} from "./callbacks/getTypes"; // Добавьте этот импорт

@Injectable()
export class BotService implements OnModuleInit, OnModuleDestroy {
    public bot: Bot<Context>;

    constructor(private configService: ConfigService) {
        const token = this.configService.get<string>('TG_BOT_TOKEN');

        if (!token) {
            throw new Error('TG_BOT_TOKEN is not defined in environment variables');
        }

        this.bot = new Bot(token);
        this.setupBot();
    }

    async onModuleInit() {
        await this.bot.start();
        console.log('Bot started successfully');
    }

    async onModuleDestroy() {
        await this.bot.stop();
    }

    private setupBot() {
        this.bot.command("start", async (ctx) => {
            const inlineKeyboard = new InlineKeyboard()
                .text("Категории обьявлений", "get_types").row()
                .text("О сервисе", "about_us");

            await ctx.reply("Добро пожаловать! Выберите действие:", {
                reply_markup: inlineKeyboard,
            });
        });

        // Регистрируем все обработчики коллбэков
        this.bot.callbackQuery("get_types", getTypes); // Добавьте эту строку
        this.bot.callbackQuery(/^nav_/, handleNavigation);
        this.bot.callbackQuery("start", handleStart);
        this.bot.callbackQuery("about_us", aboutUs);

        this.bot.on('message', (ctx) => ctx.reply('Echo: ' + ctx.message.text));
    }
}