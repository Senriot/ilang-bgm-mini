<template>
  <view>
    <view class="cu-list menu-avatar">
      <view class="cu-item">
        <view :style="'background-image:url('+userinfo.avatarUrl+');'"
              class="cu-avatar round lg"></view>
        <view class="content">
          <view class="text-grey">{{userinfo.nickName}}</view>
          <view class="text-gray flex">
            <van-button type="default" open-type="getUserInfo" @getuserinfo="bindUserinfo" v-if="!hasLogin">立即登录
            </van-button>
            <!--            <view class="text-cut">-->
            <!--              立即登录-->
            <!--            </view>-->
          </view>
        </view>
      </view>
    </view>
    <view class="cu-bar bg-white solid-bottom margin-top">
      <view class="action">
        <text class="cuIcon-titles text-blue"/>
        我的设备
      </view>
    </view>
    <view class="cu-list grid col-4]">
      <view :key="index" @tap="openPage(item)" class="cu-item" v-for="(item,index) in deviceList">
        <view :class="['iconfont ic-' + item.icon,'text-' + item.color]">
        </view>
        <text>{{item.name}}</text>
      </view>
    </view>
    <view class="margin-top">
      <van-cell icon="location-o" is-link title="设置"/>
    </view>
  </view>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  data() {
    return {
      userInfo: {},
      device: {},
      deviceList: [
        {
          icon: 'singer',
          color: 'cyan',
          badge: 0,
          name: '背景音乐',
          url: '../singer-list/singer-list'
        }
      ],
    };
  },
  computed: {
    ...mapState(['userinfo', "hasLogin"]),
  },
  onLoad() {

  },
  onShow() {
  },
  methods: {
    ...mapActions(['saveUserInfo']),
    bindUserinfo(e) {
      console.log(e)
      this.saveUserInfo(e.detail.userInfo)
    }
  }
}
</script>

<style scoped>

</style>
