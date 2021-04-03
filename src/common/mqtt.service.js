import * as client from "@/common/mqtt";
import store from "@/store/Store";
import {connect} from "@/common/mqtt";


const ops = {
    keepalive: 5,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    resubscribe: true,
    username: 'ilang-wx-mini',
    connectTimeout: 30 * 1000,
    will: {
        topic: 'WillMsg',
        payload: 'Connection Closed abnormally..!',
        qos: 0,
        retain: false
    },
    rejectUnauthorized: false
};

const url = "wxs://ilang.senriot.com:8084/mqtt"

let _client;
let _deviceId;

export function mqttConnect(openId) {
    console.log("mqtt client", _client)
    ops.clientId = openId
    if (_client && _client.connected) return
    _client = connect(url, ops)
    console.log("mqtt connecting")
    _client.on("connect", (packet) => {
        console.log("mqtt连接完成", packet)
        uni.$emit("mqtt_connected", {packet})
    })
    _client.on("message", (topic, payload) => {
        console.log(`消息：topic ${topic}`)
        console.log(`消息：payload ${payload.toString()}`)
        uni.$emit("mqtt", {topic, payload})
    })
    _client.on('close', function () {
        console.log(' disconnected')
    })
    _client.on('error', function (err) {
        console.log("mqtt 错误", err)
    })
    _client.on('reconnect', () => {
        console.log("mqtt 重连")
    })

    _client.on('disconnect', cb => {
        console.log("mqtt 断开", cb)
    })
    _client.on('offline', () => {
        console.log("mqtt 断开")
    })
}

export function send(topic, msg) {
    let t = topic ? topic : `/device/player/${_deviceId}/request`

    if (_client) {
        if (typeof msg != "string") {
            msg = JSON.stringify(msg)
        }
        console.log("发送消息", t, msg)
        _client.publish(t, msg, ((error, packet) => {
            console.log(error)
            console.log(packet)
        }))
    }
}

export function subscribe(deviceId) {
    _deviceId = deviceId
    if (_client) {
        const topics = [`/device/player/${deviceId}/response`,
            `/device/bgm/getDeviceInfo/${deviceId}`,
            `/device/bgm/saveDeviceInfo/${deviceId}`,
            `/device/bgm/deviceStatus/${deviceId}`
        ]
        _client.subscribe(topics, {qos: 1}, (err, granted) => {
            if (err) {
                console.log(err)
            } else {
                console.log(granted)
            }
        })
        // const payload = {
        //     deviceId
        // }
        // send("/device/bgm/getDeviceInfo", payload)
    }
}
