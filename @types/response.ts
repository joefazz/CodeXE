import { Activity } from './Data';
import { Languages } from '@types';

export interface Exercise {
    language: Languages;
    difficulty: string;
    length: number;
    description: string;
    title: string;
    container: string;
    activities: Activity[];
    entrypoint: string;
}
