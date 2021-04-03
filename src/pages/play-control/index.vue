<template>
  <view>
    <u-navbar id="navBar" :is-back="false" title="播控">
      <!--    <van-checkbox style="margin-left: 30rpx">全部</van-checkbox>-->
      <!--      <u-checkbox-group class="margin-left">-->
      <!--        <u-checkbox v-model="isAll">全部</u-checkbox>-->
      <!--      </u-checkbox-group>-->
    </u-navbar>
    <view class="kongzhi-dailog margin-top"
          :key="item.chIndex"
          v-for="(item) in currentDevice.channelList"
          v-if="item.enabled">
      <view class="kongzhi-log">
        <view class="kongzhi-top">
          <checkbox value="cb" :checked="false" style="transform:scale(0.5)"/>
          <text style="color: #333;font-size: 28rpx;margin-right: 35rpx;vertical-align: middle;">{{item.name}}</text>
          <text v-if="item.nowPlaying.programTitle" style="color: #777;font-size: 24rpx;vertical-align: middle;">
            正在播放：{{item.nowPlaying.programTitle}}
          </text>
        </view>
        <view class="kongzhi-main">
          <image src="../../static/yinliang-xiao@2x.png"></image>
          <u-slider style="width: 100%"
                    class="margin-right margin-left"
                    v-model="item.volume" @end="volumeChange(item,$event)"></u-slider>
          <image src="../../static/yinliang-da@2x.png"></image>
        </view>
        <view class="padding-top">
          <view class="cu-bar bg-white">
            <view class="action">
            </view>
            <view class="kongzhi-bottom">
              <image src="../../static/shangyiqu.svg" style="padding: 5rpx" @click="beforeSong(item)"></image>
              <image v-if="item.isPlaying" src="../../static/pause.svg"
                     style="margin: 0 50rpx;width: 80rpx;height: 80rpx"
                     @click="setup(item)"></image>
              <image v-if="!item.isPlaying" src="../../static/play.svg"
                     style="margin: 0 50rpx;width: 80rpx;height: 80rpx"
                     @click="setup(item)"></image>
              <image src="../../static/xiayiqu.svg"
                     style="padding: 5rpx;margin-right: 50rpx"
                     @click="nextSong(item)"></image>
            </view>
            <view class="action">
              <image src="../../static/ic-playlist.svg"
                     style="padding: 5rpx;text-align: right;width: 50rpx;height: 50rpx"
                     @click="showPlaylist(item)"/>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view>
      <van-popup id="popup" :show="showPlaylistPopup"
                 position="bottom"
                 closeable
                 @close="playlistClose">
        <view class="cu-bar bg-white solid-bottom">
          <view class="action">
            <text class="cuIcon-title text-blue"></text>
            {{curChannel.name}}
          </view>
          <view class="content text-bold">
            播放列表
          </view>
        </view>
        <scroll-view scroll-y="true" style="height: 600rpx;">

          <view class="cu-list menu-avatar">
            <van-swipe-cell :right-width="65" :key="index" v-for="(item,index) in 10">
              <van-cell-group>
                <van-cell :title="item.name"
                          title-class="text-df"
                          center
                          clickable
                          :label="item.al.name || item.album.name"
                          is-link
                          :key="index">
                  <image slot="icon"
                         class="cu-avatar radius lg margin-right"
                         :src="`${item.al.picUrl}?param=100y100`"/>
                </van-cell>
              </van-cell-group>
<!--              <view class="cu-item " :key="index" v-for="(item,index) in curChannel.playlist">-->
<!--                <image :src="`${item.al.picUrl}?param=100y100`" class="cu-avatar radius lg"></image>-->
<!--                <view class="content">-->
<!--                  <view class="text-cut">{{item.name}}</view>-->
<!--                  <view class="text-gray text-sm flex">-->
<!--                    <view class="text-cut">{{item.al.name || item.album.name}}</view>-->
<!--                  </view>-->
<!--                </view>-->
<!--                <view class="action">-->
<!--                  <text class="cuIcon-moreandroid lg text-gray"/>-->
<!--                </view>-->
<!--              </view>-->
              <view slot="right">删除</view>
            </van-swipe-cell>
          </view>
          <u-empty v-if="curChannel.playlist.length<=0" text="还没有歌曲" mode="list"></u-empty>
        </scroll-view>
      </van-popup>
    </view>
  </view>
</template>

<script>
import {mapState} from "vuex";
import {send}     from "@/common/mqtt.service";

export default {
  data()
  {
    return {
      isAll            : false,
      showPlaylistPopup: false,
      curChannel       : null,
      popup            : {},
    }
  },
  computed: {
    ...mapState(['currentDevice']),

  },
  methods : {
    beforeSong(item)
    {
      console.log(item)
      send(null, {
        ch    : item.chIndex,
        action: 'previous',
      })
    },
    setup(item)
    {
      send(null, {
        ch    : item.chIndex,
        action: 'playOrPause',
      })
    },
    nextSong(item)
    {
      send(null, {
        ch    : item.chIndex,
        action: 'next',
      })
    },
    showPlaylist(item)
    {
      this.curChannel = item
      this.showPlaylistPopup = true
    },
    volumeChange(ch, value)
    {
      console.log(ch)
      send(null, {
        ch    : ch.chIndex,
        action: 'volume',
        value : {
          volume: ch.volume
        }
      })
    },
    playlistClose()
    {
      this.showPlaylistPopup = false
    }
  },
  mounted()
  {
    this.popup = () => uni.createSelectorQuery().select("#popup")
    console.log(this.popup)
  }
}
</script>

<style scoped>
@import "_index.scss";
</style>
