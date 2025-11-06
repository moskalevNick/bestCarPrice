import rawStartupConfig from 'startup.json';
import {Context, InlineKeyboard} from "grammy";
import {SearchParams, StartupConfig} from "./types";

const startupConfig = rawStartupConfig as unknown as StartupConfig;

type NavigationPath = string[];

const getNestedData = (path: NavigationPath, config: StartupConfig): any => {
    let current: any = config;

    for (const key of path) {
        if (current && typeof current === 'object') {
            if (current.brands && current.brands[key]) {
                current = current.brands[key];
            } else if (current.models && current.models[key]) {
                current = current.models[key];
            } else if (current[key]) {
                current = current[key];
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    return current;
};

// Функция для получения search_params из любой структуры
const extractSearchParams = (data: any): SearchParams | null => {
    if (data && data.search_params) {
        return data.search_params;
    }

    // Если это массив, берем первый элемент
    if (Array.isArray(data) && data.length > 0) {
        return extractSearchParams(data[0]);
    }

    // Если это объект с моделями, проверяем первую модель
    if (data && data.models && typeof data.models === 'object') {
        const firstModelKey = Object.keys(data.models)[0];
        if (firstModelKey && data.models[firstModelKey] && Array.isArray(data.models[firstModelKey])) {
            return extractSearchParams(data.models[firstModelKey][0]);
        }
    }

    return null;
};

// Функция для получения дочерних элементов
const getChildItems = (data: any): string[] => {
    if (!data) return [];

    if (data.brands) {
        return Object.keys(data.brands);
    }

    if (data.models) {
        return Object.keys(data.models);
    }

    if (Array.isArray(data) && data.length > 0 && data[0].models) {
        return Object.keys(data[0].models);
    }

    return [];
};

export const navigateConfig = async (
    ctx: Context,
    path: NavigationPath = []
): Promise<void> => {
    await ctx.answerCallbackQuery?.();

    const currentData = getNestedData(path, startupConfig);

    if (!currentData) {
        await ctx.reply("❌ Данные не найдены");
        return;
    }

    // Проверяем, есть ли сразу search_params
    const searchParams = extractSearchParams(currentData);
    if (searchParams) {
        const type = path[0];
        const brand = path[1];
        const model = path[2];

        const typeStr = () => {
            return type ? `Тип: ${type}\n` : ''
        }

        const brandStr = () => {
            return brand ? `Бренд: ${brand}\n` : ''
        }

        const modelStr = () => {
            return model ? `Модель: ${model}\n` : ''
        }

        await ctx.reply(
            `✅ Найден результат:\n` +
            typeStr() +
            brandStr() +
            modelStr() +
            `query param: ${type}\n` +
            `body params: ${JSON.stringify(searchParams, null, 2)}\n`
        );
        return;
    }

    // Получаем дочерние элементы для навигации
    const childItems = getChildItems(currentData);

    if (childItems.length === 0) {
        await ctx.reply("❌ Нет доступных вариантов для выбора");
        return;
    }

    const keyboard = new InlineKeyboard();
    let message = "Выберите вариант:";

    // Настраиваем сообщение в зависимости от уровня
    if (path.length === 0) {
        message = "Выберите тип транспорта:";
        childItems.forEach(item => {
            const category = startupConfig[item];
            keyboard.text(category.title, `nav_${item}`).row();
        });
    } else if (path.length === 1) {
        const category = startupConfig[path[0]];
        message = `Выберите бренд для ${category.title}:`;
        childItems.forEach(brand => {
            keyboard.text(brand, `nav_${path.join('_')}_${brand}`).row();
        });
    } else if (path.length === 2) {
        message = `Выберите модель:`;
        childItems.forEach(model => {
            keyboard.text(model, `nav_${path.join('_')}_${model}`).row();
        });
    }

    // Добавляем кнопку "Назад"
    if (path.length > 0) {
        const backPath = path.slice(0, -1);
        const backCallback = backPath.length > 0 ? `nav_${backPath.join('_')}` : 'start';
        keyboard.text("« Назад", backCallback);
    }

    await ctx.reply(message, {
        reply_markup: keyboard,
    });
};