export interface RequestMessage
{
    ch: number;
    action: string;
    value: {
        [x: string]: any
    }
}