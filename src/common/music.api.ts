import {Http, transformRequestResponseOkData} from "miniprogram-request";

const musicRequest = new Http<{}>();
musicRequest.Defaults.baseURL = "https://netease-cloud-music-api-roan.vercel.app";
musicRequest.Defaults.retry = 3;
musicRequest.Listeners.onResponse.push(console.log);
musicRequest.Defaults.transformResponse = transformRequestResponseOkData;
musicRequest.Listeners.onRejected.push(res =>
{
    console.error(res);
});


export default musicRequest
