export interface PersonalizedRes
{
    hasTaste: boolean,
    category: number,
    code: number,
    result: Personalized[]
}

export interface Personalized
{
    id: number;
    type: number;
    name: string;
    copywriter: string;
    picUrl: string;
    canDislike: boolean;
    trackNumberUpdateTime: number;
    playCount: number;
    trackCount: number;
    highQuality: boolean;
    alg: string;
}