export interface Activity {
    id: number;
    title: string;
    description: string;
    task: string;
    expectedResult: string;
    prebakedCode?: string;
    requiredCode?: string[];
}

export interface Exercise {
    id: string;
    title: string;
    slug: string;
    description: string;
    container: string;
    length: number;
    entrypoint: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    language: string;
    activities?: string[];
}
