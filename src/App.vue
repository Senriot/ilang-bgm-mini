<script>
import Vue from 'vue';
import {mapActions, mapState} from "vuex";
import {mqttService} from "@/common/mqtt.service";
import srvRequest from "@/common/server.api";

export default {
  mpType: 'app',
  onLaunch() {
    console.log('App Launch')
    uni.getSystemInfo({
      success: (e => {
        // #ifndef MP
        Vue.prototype.StatusBar = e.statusBarHeight;
        if (e.platform === 'android') {
          Vue.prototype.CustomBar = e.statusBarHeight + 50;
        } else {
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
  },
  onShow() {
    console.log('App Show')
    if (!this.openId) {
      uni.login({
        success: result => {
          console.log(result)
          srvRequest.post(`ilang/wx/login?jsCode=${result.code}`).then((res) => {
            console.log("登录成功", res)
            const openId = res.result.openid;
            this.saveOpenId(openId)
            mqttService.connect(openId)
          })
        },
        fail: result => {

        }
      })
    } else {
      mqttService.connect(this.openId)
    }
  },
  onHide() {
    console.log('App Hide')
  },
  computed: {
    ...mapState(['openId'])
  },
  methods: {
    ...mapActions(['saveOpenId'])
  }
}
</script>

<style lang="scss">
/*每个页面公共css */
@import "uview-ui/index.scss";
@import "colorui/main.css";
@import "colorui/icon.css";
</style>
