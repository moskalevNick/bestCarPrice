import {Controller, Post, Req, Res} from '@nestjs/common';
import type {Request, Response} from 'express';
import {BotService} from './bot.service';
import {webhookCallback} from 'grammy';

@Controller('api/bot')
export class BotController {
    constructor(private readonly botService: BotService) {
    }

    @Post()
    async handleWebhook(@Req() req: Request, @Res() res: Response) {
        const handleUpdate = webhookCallback(this.botService.bot, 'http');

        try {
            await handleUpdate(req, res);
        } catch (error) {
            console.error('Webhook error:', error);
            res.status(500).send('Error processing update');
        }
    }
}