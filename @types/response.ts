import { Exercise } from './Data';
import { Languages } from '@types';

export interface Activity {
    language: Languages;
    difficulty: string;
    length: number;
    description: string;
    title: string;
    exercises: Exercise[];
    entrypoint: string;
}
