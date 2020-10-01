import {Artist} from "./NewSong";

export interface AlbumRes
{
    code: number,
    albums: Album[]
}

export interface Album
{
    name: string;
    id: number;
    type: string;
    size: number;
    picId: number;
    blurPicUrl: string;
    companyId: number;
    pic: number;
    picUrl: string;
    publishTime: number;
    description: string;
    tags: string;
    company: string;
    briefDesc: string;
    artist: Artist;
    songs?: any;
    alias: any[];
    status: number;
    copyrightId: number;
    commentThreadId: string;
    artists: Artist[];
    paid: boolean;
    onSale: boolean;
    picId_str: string;
}