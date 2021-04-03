<script>
import Vue                    from 'vue';
import {mapActions, mapState} from "vuex";
import {send}                 from "@/common/mqtt.service";
import musicRequest           from "@/common/music.api";

export default {
  mpType  : 'app',
  onLaunch()
  {
    console.log('App Launch')
    uni.getSystemInfo({
      success: (e =>
      {
        // #ifndef MP
        Vue.prototype.StatusBar = e.statusBarHeight;
        if (e.platform === 'android')
        {
          Vue.prototype.CustomBar = e.statusBarHeight + 50;
        }
        else
        {
          Vue.prototype.CustomBar = e.statusBarHeight + 45;
        }
        // #endif
        // #ifdef MP-WEIXIN
        Vue.prototype.StatusBar = e.statusBarHeight;
        let custom = uni.getMenuButtonBoundingClientRect();
        Vue.prototype.Custom = custom;
        Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        // #endif
        // #ifdef MP-ALIPAY
        Vue.prototype.StatusBar = e.statusBarHeight;
        Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
        // #endif
      })
    });

    uni.$on("mqtt", result =>
    {
      console.log(result)
      const topic = result.topic;
      if (topic.includes("/device/bgm/getDeviceInfo"))
      {
        const device = JSON.parse(result.payload);
        if (device.channelList)
        {
          device.channelList.forEach((value) =>
          {
            value.checked = false
            value.nowPlaying = {}
            value.isPlaying = false
            value.playlist = []
          })
        }
        this.saveCurrentDevice(device)

        if (device.onlineStatus == 'online')
        {
          /**
           * 获取全部通道状态
           */
          send(null, {
            ch    : 0,
            action: "channelStatus"
          })
        }
      }
      else if (topic.includes("/device/player/"))
      {
        const r = JSON.parse(result.payload);
        if (r.success)
        {
          let ch = this.currentDevice.channelList.find((ch, index) => ch.chIndex == r.ch);

          switch (r.action)
          {
            case 'nowPlay':
              if (ch)
              {
                ch.nowPlaying = r.value.nowPlaying
              }
              break;
            case 'playOrPause':
              if (ch)
              {
                ch.isPlaying = r.value.isPlaying
                console.log("播放状态改变", ch)
              }
              break;
            case 'playlistChanged':
              if (ch)
              {
                ch.nowPlaying = r.value.nowPlaying
                if (r.value.playlist && r.value.playlist.length > 0)
                {
                  const ids = r.value.playlist.map((value, index) => value.programId).join(',')
                  musicRequest.get(`/song/detail?ids=${ids}`).then(result =>
                  {
                    ch.playlist = result.songs
                  })
                }
              }
              break;
            case 'channelStatus':
            {
              if (r.ch == 0)
              {
                r.value.forEach(item =>
                {
                  ch = this.currentDevice.channelList.find((ch, index) => ch.chIndex == item.chIndex);
                  if (ch)
                  {
                    ch.nowPlaying = item.nowPlaying
                    ch.volume = item.volume
                    ch.isPlaying = item.isPlaying
                    if (item.playlist && item.playlist.length > 0)
                    {
                      const ids = item.playlist.map((value, index) => value.programId).join(',')
                      musicRequest.get(`/song/detail?ids=${ids}`).then(result =>
                      {
                        ch.playlist = result.songs
                      })
                    }
                  }
                })

              }
            }
          }
        }
      }
      else if (topic.includes("/device/bgm/deviceStatus/"))
      {
        const r = JSON.parse(result.payload);
        this.currentDevice.onlineStatus = r.onlineStatus
        //设备在线时去获取设备状态
        if (r.onlineStatus == 'online')
        {
          /**
           * 获取全部通道状态
           */
          send(null, {
            ch    : 0,
            action: "channelStatus"
          })
        }
      }
    });
  },
  onShow()
  {
    console.log('App Show')
  },
  onHide()
  {
    console.log('App Hide')
  },
  computed: {
    ...mapState(['openId', 'currentDevice'])
  },
  methods : {
    ...mapActions(['saveOpenId', "saveCurrentDevice"])
  }
}
</script>

<style lang="scss">
/*每个页面公共css */
@import "uview-ui/index.scss";
@import "colorui/main.css";
@import "colorui/icon.css";


page {
  --active-color: #5578eb;
  --sidebar-active-color: #5578eb;
  --tab-active-text-color: #5578eb;
  --tabs-default-color: #5578eb;
}

.sticky-box {
  /* #ifndef APP-PLUS-NVUE */
  display: flex;
  position: -webkit-sticky;
  /* #endif */
  position: sticky;
  z-index: 99;
  flex-direction: row;
  margin: 0;
  top: 0;
}
</style>
