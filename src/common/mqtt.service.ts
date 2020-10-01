import {connect, MqttClient} from "mqtt";
import {RequestMessage}      from "@/model/RequestMessage";
import {IClientOptions}      from "mqtt/types/lib/client";

export class MqttService
{

    get url(): string
    {
        return this._url;
    }

    set url(value: string)
    {
        this._url = value;
    }

    get clientId(): string
    {
        return this._clientId;
    }

    set clientId(value: string)
    {
        this._clientId = value;
    }

    private _clientId = ""
    private _deviceId = ""
    private _url = "wx://ilang.senriot.com:8083/mqtt"

    private _client?: MqttClient | undefined

    get client(): MqttClient | undefined
    {
        return this._client;
    }

    set deviceId(value: string)
    {
        this._deviceId = value;
        if (this.client)
        {
            this.client.subscribe([`/device/player/${value}/response`, `/device/bgm/getDeviceInfo/${value}`], {qos: 1}, (err, granted) =>
            {
                if (err)
                {
                    console.log(err)
                }
                else
                {
                    console.log(granted)
                }
            })
            const payload = {
                deviceId: value
            }
            this.sendMessage("/device/bgm/getDeviceInfo", JSON.stringify(payload))
        }

    }

    constructor()
    {

    }

    connect(clientId: string)
    {
        if (clientId == this._clientId && this.client && this.client.connected)
            return

        const options: IClientOptions = {
            keepalive         : 30,
            clientId          : clientId,
            protocolId        : 'MQTT',
            protocolVersion   : 4,
            clean             : true,
            reconnectPeriod   : 1000,
            resubscribe       : true,
            connectTimeout    : 30 * 1000,
            will              : {
                topic  : 'WillMsg',
                payload: 'Connection Closed abnormally..!',
                qos    : 0,
                retain : false
            },
            rejectUnauthorized: false
        };

        this._clientId = clientId
        this._client = connect(this.url, options)
        console.log("连接mqtt")
        this._client.on("connect", (packet: any) =>
        {
            console.log("mqtt连接完成", packet)
            uni.$emit("mqtt_connected", {packet})
        })
        // this._client.subscribe([`/device/player/${clientId}/response`, `/device/bgm/getDeviceInfo/${clientId}`], {qos: 1}, (err, granted) =>
        // {
        //     if (err)
        //     {
        //         console.log(err)
        //     }
        //     else
        //     {
        //         console.log(granted)
        //     }
        // })
        this._client.on("message", (topic, payload) =>
        {
            // console.log(`消息：topic ${topic}`)
            // console.log(`消息：payload ${payload.toString()}`)
            uni.$emit("mqtt", {topic, payload})
        })
    }

    send({topic, msg}: { topic?: string, msg: RequestMessage })
    {
        let t = topic ? topic : `/device/player/${this._clientId}/request`

        if (this._client)
        {
            console.log(JSON.stringify(msg))
            this._client.publish(t, JSON.stringify(msg), ((error, packet) =>
            {
                console.log(error)
                console.log(packet)
            }))
        }
    }

    sendMessage(topic: string, payload: string)
    {
        if (this._client)
        {
            this._client.publish(topic, payload, error =>
            {
                console.log(error)
            })
        }
    }

    disConnect(): boolean | undefined
    {
        if (this._client)
            return this._client.disconnected
    }
}

export const mqttService = new MqttService()