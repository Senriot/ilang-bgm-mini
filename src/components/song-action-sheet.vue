<template>
  <view class="song-action-sheet">
    <van-action-sheet
        :round="false"
        :show="songSheetProp.isShow"
        @close="onClose"
        close-on-click-overlay>
      <view class="cu-list menu-avatar margin-left">
        <view class="cu-item cur" v-if="songSheetProp.item">
          <view class="cu-avatar " v-if="songSheetProp.item.picUrl">
            <van-image :src="songSheetProp.item.picUrl+'?param=100y100'" fit="contain"
                       height="96rpx"
                       radius="5"
                       width="96rpx">
            </van-image>
          </view>
          <view class="content">
            <view>
              <view class="text-cut">{{songSheetProp.item.name}}</view>
            </view>
            <view class="text-gray text-sm flex">
              <view class="text-cut"> {{songSheetProp.item.artist.name}}</view>
            </view>
          </view>
        </view>
      </view>
      <view>
        <van-cell @tap="itemTap('nowPlay')" clickable icon="play-circle-o" size="large" title="立即播放"/>
        <van-cell @tap="itemTap('addTrack')" clickable icon="clock-o" size="large" title="下首播放"/>
        <van-cell @tap="itemTap('addTrack')" clickable icon="add-o" size="large" title="添加到播放列表"/>
      </view>
    </van-action-sheet>
    <van-dialog
        :show="showDialog"
        @close="onClose"
        @confirm="confirm"
        show-cancel-button
        title="选择通道"
        use-slot>
      <van-checkbox-group :value="result" @change="onChange">
        <van-cell-group>
          <van-cell
              clickable
              icon="volume-o"
              @click="selectAll"
              title="全选">
            <van-checkbox @change="toggleAll"
                          catch:tap="noop"
                          :name="0"
                          class="all-select"
                          shape="square"
                          slot="right-icon"/>
          </van-cell>
          <van-cell
              :data-index="index"
              :key="index"
              :title="item.name"
              @click="toggle"
              clickable
              icon="volume-o"
              v-for="(item,index) in currentDevice.channelList"
              value-class="value-class">
            <van-checkbox catch:tap="noop" :class="'checkboxes-'+ index " :name="item.chIndex"
                          slot="right-icon"/>
          </van-cell>
        </van-cell-group>
        <!--                <van-checkbox :key = "index" :name = "item.ch" v-for = "(item,index) in channels">{{item.name
        }}-->
        <!--                </van-checkbox>-->
      </van-checkbox-group>
    </van-dialog>
  </view>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {mqttService} from "@/common/mqtt.service";
import musicRequest from "@/common/music.api";

export default {
  name: "song-action",
  data() {
    return {
      activeNames: -1,
      radio: "1",
      showDialog: false,
      deviceId: "",
      result: [],
      action: ''
    }
  },
  computed: {
    ...mapState(["currentDevice", "songSheetProp"])
  },
  methods: {
    ...mapActions(["setSongSheetProp"]),
    onClose() {
      this.showDialog = false;
      this.setSongSheetProp({
        isShow: false,
        item: null
      })
    },
    onChange(e) {
      if (e.detail == 0) {
        this.result = [];
        this.currentDevice.channelList.forEach(value => {
          this.result.push(value.chIndex.toString())
        });
      } else
        this.result = e.detail;
    },
    onClick(e) {
      const {name} = e.currentTarget.dataset;
      this.radio = name.toString()
    },
    itemTap(action) {
      this.action = action
      this.showDialog = true;
      // this.onClose()
    },
    hideModal() {
      this.showDialog = false;
    },
    toggle(e) {
      const {index} = e.currentTarget.dataset;
      console.log(index);
      // @ts-ignore
      const checkbox = this.selectComponent(`.checkboxes-${index}`);
      checkbox.toggle();
    },
    async getSongUrl() {
      const urlRes = await musicRequest.get("/song/url", {id: this.songSheetProp.item.id})
      if (urlRes.code == 200) {
        if (urlRes.data.length > 0) {
          const song = urlRes.data[0];
          if (song.url) {
            // const deviceId = uni.getStorageSync("deviceId");
            if (this.currentDevice) {
              for (let i = 0; i < this.result.length; i++) {
                const msg = {
                  action: this.action,
                  ch: Number.parseInt(this.result[i]),
                  value: {
                    programId: song.id.toString(),
                    programTitle: this.item.name,
                    programType: 1,
                    playUrl: song.url
                  }
                }
                mqttService.send({msg})
              }
            } else {
              uni.showModal({
                title: "提示",
                content: "请扫描设备二维码进入小程序",
              })
            }
          } else {
            uni.showModal({title: "提示", content: "该歌曲暂时不能播放"})
          }
        }

      }
    },
    confirm() {
      console.log(this.item)
      // // console.log(client)
      // var option = {
      //     "ch"     : 1, //所属通道
      //     "action" : "nowPlay", //动作名称
      //     "content": {
      //         "programId"   : "123123123", //喜⻢拉雅的节⽬ID
      //         "programTitle": "11", //节⽬标题
      //         "programType" : 1,//1:⽹易云⾳乐地址，2：本地内容 3: ⽆损⾳乐
      //         "playUrl"     : "" //播放地址 本地内容时为⽂件路径
      //     }
      // }
      // mqttClient.subscribe('/device/player/1/request', function (err: any)
      // {
      //     if (!err)
      //     {
      //         //client.publish('123', 'Hello mqtt')
      //         console.log("订阅成功")
      //     }
      // })
      if (this.result.length > 0) {
        this.getSongUrl()
      }
    },
    selectAll() {
      const checkbox = this.selectComponent(`.all-select`);
      checkbox.toggle();
      // this.result = [];
      // this.currentDevice.channelList.forEach(value => {
      //   this.result.push(value.chIndex.toString())
      // });
    },
    toggleAll(e) {
      console.log(e)
    }
  }
};
</script>
<style>
</style>
