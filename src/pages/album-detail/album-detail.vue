<template>
  <view>
    <u-navbar id="navBar"
              :back-icon-color="'#fff'"
              :border-bottom="false"
              :background="navBg">
    </u-navbar>
    <view :style="'background-image: url('+album.blurPicUrl+'?param=500y500)'"
          class='play-list-bg'
          v-if="album.blurPicUrl"/>
    <view class="main" v-if="album.blurPicUrl">
      <view class="title_wrap">
        <!-- 图片 -->
        <view class="photo" v-if="album.blurPicUrl">
          <image :src="`${album.blurPicUrl}?param=300y300`"
                 mode="widthFix"/>
        </view>
        <!-- 内容 -->
        <view class="t_content">
          <view class="content_title">{{album.name}}</view>
          <!-- 头像及个人信息 -->
          <view class="content_info">
            <view class="content_headPortrait">
              <image :src="`${album.artist.picUrl}?param=100y100`"/>
            </view>
            <view class="content_nickname">{{album.artist.name}}</view>
            <view class="iconfont icon-jiankuohaoxiyou"
                  style="color:#F5F5F5;line-height: 73rpx;font-size:35rpx;"/>
          </view>
          <view class="content_description">
            {{album.description }}
          </view>
        </view>
      </view>
      <song-list v-if="songs" :list="songs" @complete="showChannelsDialog">
        <view slot="title" class="action">
          <text class="text-xxl cuIcon-video text-red"/>
          播放全部
        </view>
      </song-list>
    </view>
  </view>
</template>

<script>
import musicRequest from "@/common/music.api";
import SongList     from "@/components/song-list";

export default {
  components: {SongList},
  data()
  {
    return {
      album: null,
      songs: null
    }
  },
  onLoad(query)
  {
    const id = query.id
    this.loadInfo(id)
  },
  methods   : {
    async loadInfo(id)
    {
      const {album, songs} = await musicRequest.get("/album?id=" + id)
      console.log(album)
      console.log(songs)
      this.album = album
      this.songs = songs
    }
  }
}
</script>

<style scoped>
@import "../song-sheet/_index.scss";
</style>
