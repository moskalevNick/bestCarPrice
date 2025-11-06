// types/config.types.ts

export interface SearchParams {
    brand: string;
    model?: string;
}

export interface ModelItem {
    search_params: SearchParams;
}

export interface BrandItem {
    [modelName: string]: ModelItem[];
}

export interface Brand {
    title?: string;
    models?: {
        [modelName: string]: ModelItem[];
    };
    search_params?: SearchParams;
}

export interface Category {
    title: string;
    brands: {
        [brandName: string]: Brand | Brand[];
    };
}

export interface StartupConfig {
    [categoryName: string]: Category;
}