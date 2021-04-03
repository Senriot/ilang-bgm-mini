export interface Device
{
    id: string;
    devId: string;
    devName: string;
    productId: string;
    activeDate?: any;
    city: string;
    address: string;
    firmwareVersion?: any;
    onlineDate?: any;
    onlineStatus?: any;
    status: string;
    expireDate: string;
    remark?: any;
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string;
    sysOrgCode: string;
    channelList: Array<DeviceChannel>
}

export interface DeviceChannel
{
    id: string;
    deviceId: string;
    chIndex: number;
    name: string;
    // playId?: any;
    // playName?: any;
    // playType?: number;
    status: string;
    createBy: string;
    createTime: string;
    volume: number;
    updateBy?: any;
    updateTime?: any;
    sysOrgCode: string;
    checked: boolean,
    enabled: boolean,
    nowPlaying?: object,
    isPlaying: boolean
}