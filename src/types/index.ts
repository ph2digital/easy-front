// src/types/index.ts
export interface Campaign {
    clicks: number;
    impressions: number;
    startDate: string;
    endDate: string;
    objective: string;
    specialAdCategories: any;
    ads: any;
    id: string;
    userId: string;
    spend: any; // Define spend as any
    name: string;
    status: 'active' | 'paused' | 'completed';
    mode: 'automatic' | 'guided' | 'manual';
    budget: any; // Define budget as any
    platform: any; // Define platform as any
    ctr: any; // Define ctr as any
    cpc: any; // Define cpc as any
    cpm: any; // Define cpm as any
    reach: any; // Define reach as any
    frequency: any; // Define frequency as any
    adsets: any[];
}

export interface User {
    id: string;
    email: string;
    name: string;
}

export interface Adset {
    id: string;
    name: string;
    status: string;
    dailyBudget: string;
    startDate: string;
    endDate: string;
    ads: Ad[];
}

export interface Ad {
    id: string;
    name: string;
    status: string;
    createdTime: string;
    updatedTime: string;
}
