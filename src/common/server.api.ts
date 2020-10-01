import {Http, transformRequestResponseOkData} from "miniprogram-request";

const srvRequest = new Http<{}>();
srvRequest.Defaults.baseURL = "https://ilang.senriot.com/jeecg-boot/";
srvRequest.Defaults.retry = 3;
srvRequest.Listeners.onResponse.push(console.log);
srvRequest.Defaults.transformResponse = transformRequestResponseOkData;
srvRequest.Listeners.onRejected.push(res =>
{
    console.error(res);
});


export default srvRequest