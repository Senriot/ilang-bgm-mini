<template>
  <view>
    <view class="padding-left padding-right bg-white">
      <u-form-item label="名称">
        <u-input v-model="currentDevice.devName"/>
      </u-form-item>
    </view>

    <u-cell-group title="设备设置">
      <u-cell-item title="远程开关" :arrow="true"></u-cell-item>
      <u-cell-item title="重新联网" :arrow="true"></u-cell-item>
      <u-cell-item title="设备地址" :arrow="true"></u-cell-item>
      <u-cell-item title="设备信息" :arrow="true"></u-cell-item>
    </u-cell-group>


    <u-cell-group title="通道管理">
      <van-grid column-num="4" square custom-class="bg-white ">
        <van-grid-item :text="item.name"
                       :url="`channel-setting?ch=${index}`"
                       icon-color="#0081ff"
                       icon="/static/laba.svg"
                       :key="index"
                       v-for="(item,index) in currentDevice.channelList"
                       clickable>
        </van-grid-item>
      </van-grid>
    </u-cell-group>
    <view class="padding">
      <van-button :loading="loading" :disabled="loading" loading-text="保存中..." @click="save" type="primary" block>保存
      </van-button>
    </view>

  </view>

</template>

<script>
import {mapState} from "vuex";
import {mqttService, send} from "@/common/mqtt.service";

export default {
  data() {
    return {
      loading: false
    }
  },
  onLoad() {
    uni.$on("mqtt", result => {
      const topic = result.topic;
      if (topic.includes("/device/bgm/saveDeviceInfo")) {
        this.loading = false
        console.log("保存结果", result.payload.toString())
        const r = JSON.parse(result.payload.toString())
        uni.showToast({
          title: r.success ? '保存成功' : r.message
        })
      }
    });
  },
  computed: {
    ...mapState(['currentDevice'])
  },
  methods: {
    showChannelSet(e) {
      uni.navigateTo({
        url: `channel-setting?ch=${e}`
      })
    },

    save() {
      this.loading = true
      send('/device/bgm/saveDeviceInfo', this.currentDevice)
    }
  }

}
</script>

<style scoped>

</style>
