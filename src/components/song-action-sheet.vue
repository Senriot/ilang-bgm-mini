<template>
  <view class="song-action-sheet">
    <u-popup v-model="songSheetProp.isShow" mode="bottom" border-radius="14">
      <van-cell-group>
        <van-cell :title="songSheetProp.item.name"
                  v-if="songSheetProp.item"
                  title-class="text-df"
                  center
                  :label="`${songSheetProp.item.ar[0].name}-${songSheetProp.item.al.name}`">
          <image slot="icon"
                 class="cu-avatar radius lg margin-right"
                 :src="`${songSheetProp.item.al.picUrl}?param=100y100`"/>
        </van-cell>
        <van-cell @tap="itemTap('nowPlay')" clickable icon="play-circle-o" size="large" title="立即播放"/>
        <van-cell @tap="itemTap('addTrack')" clickable icon="clock-o" size="large" title="下首播放"/>
        <van-cell @tap="itemTap('addTrack')" clickable icon="add-o" size="large" title="添加到播放列表"/>
      </van-cell-group>
    </u-popup>
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
  </view>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {send}                 from "@/common/mqtt.service";
import musicRequest           from "@/common/music.api";

export default {
  name    : "song-action",
  data()
  {
    return {
      activeNames: -1,
      radio      : "1",
      showDialog : false,
      deviceId   : "",
      result     : [],
      action     : '',
      checkedAll : false
    }
  },
  computed: {
    ...mapState(["currentDevice", "songSheetProp"])
  },
  methods : {
    ...mapActions(["setSongSheetProp"]),
    checkboxChange(e)
    {
      console.log(e)
      this.checkedAll = this.currentDevice.channelList.every(value =>
      {
        !value.checked
      })
    },
    onClose()
    {
      this.showDialog = false;
      this.setSongSheetProp({
        isShow: false,
        item  : null
      })
    },
    onChange(e)
    {
      if (e.detail == 0)
      {
        this.result = [];
        this.currentDevice.channelList.forEach(value =>
        {
          this.result.push(value.chIndex.toString())
        });
      }
      else
        this.result = e.detail;
    },
    onClick(e)
    {
      const {name} = e.currentTarget.dataset;
      this.radio = name.toString()
    },
    itemTap(action)
    {
      if (this.checkOnlineStatus())
      {
        this.action = action
        this.showDialog = true;
        this.songSheetProp.isShow = false
      }
    },

    checkOnlineStatus()
    {
      if (this.currentDevice.onlineStatus != 'online')
      {
        uni.showModal({
          title     : "提示",
          content   : "设备不在线，请检查设备",
          showCancel: false
        })
        return false
      }
      else
      {
        return true
      }
    },
    hideModal()
    {
      this.showDialog = false;
    },
    toggle(item)
    {
      item.checked = !item.checked
    },
    async getSongUrl()
    {
      const urlRes = await musicRequest.get("/song/url", {id: this.songSheetProp.item.id})
      console.log("获取歌曲链接", urlRes)
      if (urlRes.code == 200)
      {
        if (urlRes.data.length > 0)
        {
          const song = urlRes.data[0];
          if (song.url)
          {
            // const deviceId = uni.getStorageSync("deviceId");
            if (this.currentDevice)
            {
              this.currentDevice.channelList.forEach(value =>
              {
                if (value.checked)
                {
                  const msg = {
                    action: this.action,
                    ch    : value.chIndex,
                    value : {
                      programId   : song.id.toString(),
                      programTitle: this.songSheetProp.item.name,
                      programType : 1,
                      playUrl     : song.url
                    }
                  }
                  send(null, msg)
                }
              })
            }
            else
            {
              uni.showModal({
                title  : "提示",
                content: "请扫描设备二维码进入小程序",
              })
            }
          }
          else
          {
            uni.showModal({title: "提示", content: "该歌曲暂时不能播放"})
          }
        }

      }
    },
    confirm()
    {
      this.getSongUrl()
    },
    selectAll(e)
    {
      console.log(e)
      this.currentDevice.channelList.forEach(value => value.checked = e.value)
      // const checkbox = this.selectComponent(`.all-select`);
      // checkbox.toggle();
      // this.result = [];
      // this.currentDevice.channelList.forEach(value => {
      //   this.result.push(value.chIndex.toString())
      // });
    },
    toggleAll(e)
    {
      console.log(e)
    }
  }
};
</script>
<style>
</style>
