<template>
  <view class="img">
    <u-image id="image" border-radius="5" :src="src" width="100%" height="28vw"/>
    <view class="title">{{ title }}</view>
    <view class="sub-title" v-if="subTitle">{{ subTitle }}</view>
  </view>
</template>

<script>
export default {
  name: "song-grid",
  data(){
    return{
      imgHeight:0
    }
  },
  props: {
    src: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: null
    },
    padding: {
      type: Number,
      default: 10
    }
  }, mounted() {
  }
}
</script>

<style scoped>
.img {
  position: relative;
  width: 30vm;
  padding-left: 16rpx;
  padding-right: 16rpx;
}


.img image {
  width: 28vw;
  border-top-left-radius: 8rpx;
  border-top-right-radius: 8rpx;
  height: 28vw;
}

.title {
  text-align: left;
  font-size: 24rpx;
  display: -webkit-box;
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;
  word-wrap: break-word;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: grey
}

.sub-title {
  text-align: left;
  font-size: 22rpx;
  display: -webkit-box;
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;
  word-wrap: break-word;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  color: #8799a3;
}
</style>
