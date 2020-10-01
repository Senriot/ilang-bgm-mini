import Vue  from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state    : {
        hasLogin     : false,
        userinfo     : {},
        openId       : '',
        deviceId     : uni.getStorageSync("deviceId"),
        currentDevice: {},
        currentArtist: {},
        songSheetProp: {
            item  : {},
            isShow: false
        }
    },
    getters  : {
        openId       : state => state.openId,
        deviceId     : state => state.deviceId,
        currentDevice: state => state.currentDevice,
        currentArtist: state => state.currentArtist,
        songSheetProp: state => state.songSheetProp
    },
    mutations: {
        login(state, res)
        {
            state.hasLogin = true;
            state.userinfo = res;
            uni.setStorage({
                key : 'userinfo',
                data: res
            })
        },
        openId(state, id)
        {
            state.openId = id;
            uni.setStorage({
                key : 'openId',
                data: id
            })
        },
        deviceId     : (state, payload) =>
        {
            state.deviceId = payload
            uni.setStorage({
                key : 'deviceId',
                data: payload
            })
        },
        currentDevice: (state, payload) =>
        {
            state.currentDevice = payload;
            uni.setStorage({
                key : 'currentDevice',
                data: payload
            })
        },
        currentArtist: (state, payload) =>
        {
            state.currentArtist = payload
        },
        songSheetProp: (state, payload) => state.songSheetProp = payload
    },
    actions  : {
        saveUserInfo(context, value)
        {
            console.log(context)
            context.commit("login", value)
        },
        saveOpenId(context, value)
        {
            context.commit("openId", value)
        },
        saveDeviceId(context, value)
        {
            console.log('保存deviceID', value)
            context.commit("deviceId", value)
        },
        saveCurrentDevice(ctx, value)
        {
            console.log(value)
            ctx.commit("currentDevice", value)
        },
        saveCurrentArtist(ctx, value)
        {
            ctx.commit("currentArtist", value)
        },
        setSongSheetProp(ctx, value)
        {
            ctx.commit("songSheetProp", value)
        }
    }
})

export default store