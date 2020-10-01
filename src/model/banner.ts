export interface BannerRes
{
    code: number,
    banners: Banner[]
}


export interface Banner
{
    pic: string;
    targetId: number;
    adid?: any;
    targetType: number;
    titleColor: string;
    typeTitle: string;
    url: string;
    adurlV2?: any;
    exclusive: boolean;
    monitorImpress?: any;
    monitorClick?: any;
    monitorType?: any;
    monitorImpressList: any[];
    monitorClickList: any[];
    monitorBlackList?: any;
    extMonitor?: any;
    extMonitorInfo?: any;
    adSource?: any;
    adLocation?: any;
    encodeId: string;
    program?: any;
    event?: any;
    video?: any;
    dynamicVideoData?: any;
    song?: any;
    bannerId: string;
    alg?: any;
    scm: string;
    requestId: string;
    showAdTag: boolean;
    pid?: any;
    showContext?: any;
    adDispatchJson?: any;
}