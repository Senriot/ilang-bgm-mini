export interface Result<T>
{
    code: number,
    message?: string,
    result?: T,
}


export interface Records<T>
{
    records: T[];
    total: number;
    size: number;
    current: number;
    orders: any[];
    searchCount: boolean;
    pages: number;
}