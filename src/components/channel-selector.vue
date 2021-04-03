<template>
  <u-modal v-model="showDialog" show-cancel-button :show-title="false" @confirm="confirm" border-radius="8">
    <view class="cu-bar bg-white solid-bottom">
      <view class="action">
      </view>
      <view class="content text-bold">
        通道选择
      </view>
      <view class="action">
        <u-checkbox v-model="checkedAll" @change="selectAll"></u-checkbox>
      </view>
    </view>

    <view class="text-center">
      <u-cell-group>
        <u-cell-item :title="item.name"
                     :arrow="false"
                     v-for="(item, index) in currentDevice.channelList"
                     v-if="item.enabled"
                     @click="toggle(item)"
                     :key="index">
          <u-checkbox
              v-model="item.checked"
              shape="circle"
              slot="right-icon"
              :name="item.name"></u-checkbox>
        </u-cell-item>
      </u-cell-group>
    </view>
  </u-modal>
</template>

<script>
import {mapState}   from "vuex";
import musicRequest from "@/common/music.api";
import songs        from "@/pages/artist-detail/songs";
import {send}       from "@/common/mqtt.service";

export default {
  name    : "channel-selector",
  props   : {
    show : {
      type   : Boolean,
      default: false
    },
    songs: {
      type   : Array,
      default: []
    }
  },
  watch   : {
    show: {
      deep: true,
      handler(v)
      {
        this.showDialog = v
      }
    },
    showDialog(newValue, oldValue)
    {
      this.$emit("change", newValue)
    }
  },
  data()
  {
    return {
      showDialog: false,
      checkedAll: false
    }
  },
  computed: {
    ...mapState(["currentDevice"])
  },
  methods : {
    selectAll(e)
    {
      this.currentDevice.channelList.forEach(value => value.checked = e.value)
    },
    toggle(item)
    {
      item.checked = !item.checked
    },
    async confirm()
    {
      if (!this.currentDevice)
      {
        uni.showModal({
          title     : "提示",
          content   : "设备未连接，请扫描设备二维码或添加设备",
          showCancel: false
        })
      }
      else if (this.currentDevice.onlineStatus != 'online')
      {
        uni.showModal({
          title     : "提示",
          content   : "设备不在线，请检查设备",
          showCancel: false
        })
      }
      else
      {
        const ids = this.songs.map(value => value.id)
        const urls = await musicRequest.post("/song/url?timestamp=" + (new Date()).valueOf(), {id: ids})
        console.log(urls)
        let req = {
          ch    : 1,
          action: "batchAddTrack",
          value : []
        }
        this.songs.forEach((value, index) =>
        {
          req.value.push({
            programId   : value.id.toString(),
            programTitle: value.name,
            programType : 1,
            playUrl     : urls.data[index].url
          })
        })
        this.currentDevice.channelList.forEach(value =>
        {
          if (value.checked)
          {
            req.ch = value.chIndex
            send(null, req)
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
