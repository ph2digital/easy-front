// src/types/index.ts
export interface Campaign {
    id: string;
    userId: string;
    name: string;
    status: 'active' | 'paused' | 'completed';
    mode: 'automatic' | 'guided' | 'manual';
    budget: number;
}

export interface User {
    id: string;
    email: string;
    name: string;
}
