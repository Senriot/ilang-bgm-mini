import {Album} from "./Album";

export interface NewSongRes
{
    code: number,
    category: number,
    result: NewSong[]
}

export interface Artist
{
    name: string;
    id: number;
    picId: number;
    img1v1Id: number;
    briefDesc: string;
    picUrl: string;
    img1v1Url: string;
    albumSize: number;
    alias: any[];
    trans: string;
    musicSize: number;
    topicPerson: number;
}


export interface Music
{
    name?: any;
    id: number;
    size: number;
    extension: string;
    sr: number;
    dfsId: number;
    bitrate: number;
    playTime: number;
    volumeDelta: number;
}

export interface Privilege
{
    id: number;
    fee: number;
    payed: number;
    st: number;
    pl: number;
    dl: number;
    sp: number;
    cp: number;
    subp: number;
    cs: boolean;
    maxbr: number;
    fl: number;
    toast: boolean;
    flag: number;
    preSell: boolean;
}

export interface Song
{
    name: string;
    id: number;
    position: number;
    alias: string[];
    status: number;
    fee: number;
    copyrightId: number;
    disc: string;
    no: number;
    artists: Artist[];
    album: Album;
    starred: boolean;
    popularity: number;
    score: number;
    starredNum: number;
    duration: number;
    playedNum: number;
    dayPlays: number;
    hearTime: number;
    ringtone: string;
    crbt?: any;
    audition?: any;
    copyFrom: string;
    commentThreadId: string;
    rtUrl?: any;
    ftype: number;
    rtUrls: any[];
    copyright: number;
    transName?: any;
    sign?: any;
    mark: number;
    hMusic: Music;
    mMusic: Music;
    lMusic: Music;
    bMusic: Music;
    mvid: number;
    rurl?: any;
    rtype: number;
    mp3Url?: any;
    exclusive: boolean;
    privilege: Privilege;
}

export interface NewSong
{
    id: number;
    type: number;
    name: string;
    copywriter?: any;
    picUrl: string;
    canDislike: boolean;
    trackNumberUpdateTime?: any;
    song: Song;
    alg: string;
}