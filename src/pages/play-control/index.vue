<template>
  <view>
    <u-navbar id="navBar" :is-back="false" title="播控">
      <!--    <van-checkbox style="margin-left: 30rpx">全部</van-checkbox>-->
      <u-checkbox-group class="margin-left">
        <u-checkbox v-model="isAll">全部</u-checkbox>
      </u-checkbox-group>
    </u-navbar>
    <view class="kongzhi-dailog margin-top" :key="item.chIndex" v-for="(item) in currentDevice.channelList">
      <view class="kongzhi-log">
        <view class="kongzhi-top">
          <checkbox value="cb" :checked="false" style="transform:scale(0.5)"/>
          <text style="color: #333;font-size: 28rpx;margin-right: 35rpx;vertical-align: middle;">{{item.name}}</text>
          <text v-if="item.playName" style="color: #777;font-size: 24rpx;vertical-align: middle;">
            正在播放：{{item.playName}}
          </text>
        </view>
        <view class="kongzhi-main">
          <image src="/static/音量小@2x.png"></image>
          <u-slider style="width: 100%" class="margin-right margin-left" v-model="item.volume"></u-slider>
          <!--          <slider style="width: 100% "-->
          <!--                  :value="item.volume"-->
          <!--                  block-size="12"-->
          <!--                  activeColor="#1da1f2"-->
          <!--                  @change="volumeChange($event,item)"-->
          <!--                  step="5"/>-->
          <image src="/static/音量大@2x.png"></image>
        </view>
        <view class="kongzhi-bottom">
          <image src="/static/btn1.png" @click="beforeSong(item)"></image>
          <image src="/static/btn3.png" style="margin: 0 60rpx;" @click="setup(item)"></image>
          <image src="/static/btn2.png" @click="nextSong(item)"></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {mapState} from "vuex";

export default {
  data() {
    return {
      isAll: false
    }
  },
  computed: {
    ...mapState(['currentDevice'])
  }
}
</script>

<style scoped>
@import "_index.scss";
</style>
