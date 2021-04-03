<template>
  <view>
    <u-navbar id="navBar"
              :back-icon-color="'#fff'"
              :border-bottom="false"
              :background="navBg">
    </u-navbar>
    <view :style="'background-image: url('+playInfo.coverImgUrl+'?param=500y500)'"
          class='play-list-bg'
          v-if="playInfo.coverImgUrl"/>
    <view class="main" v-if="playInfo.coverImgUrl">
      <view class="title_wrap">
        <!-- 图片 -->
        <view class="photo" v-if="playInfo.coverImgUrl">
          <image :src="`${playInfo.coverImgUrl}?param=300y300`"
                 mode="widthFix"/>
        </view>
        <!-- 内容 -->
        <view class="t_content">
          <view class="content_title">{{playInfo.name}}</view>
          <!-- 头像及个人信息 -->
          <view class="content_info">
            <view class="content_headPortrait">
              <image :src="`${playInfo.creator.avatarUrl}?param=100y100`"/>
            </view>
            <view class="content_nickname">{{playInfo.creator.nickname}}</view>
            <view class="iconfont icon-jiankuohaoxiyou"
                  style="color:#F5F5F5;line-height: 73rpx;font-size:35rpx;"/>
          </view>
          <view class="content_description">
            {{playInfo.description == null ? "" : playInfo.description}}
          </view>
        </view>
      </view>
      <song-list :list="playInfo.tracks" @complete="showChannelsDialog">
        <view slot="title" class="action">
          <text class="text-xxl cuIcon-video text-red"/>
          播放全部
        </view>
      </song-list>
    </view>
    <song-action/>
    <channel-selector :show="showChannels" @change="showChannels = $event" :songs="selectSongs"/>
  </view>
</template>

<script>
import musicRequest    from "@/common/music.api";
import SongList        from "@/components/song-list";
import ChannelSelector from "@/components/channel-selector";

export default {
  components: {ChannelSelector, SongList},
  computed  : {},
  data()
  {
    return {
      navBg       : {
        backgroundColor: '#00000000',
      },
      status      : 'loadmore',
      // @ts-ignore
      navbarHeight: this.CustomBar * 750 / uni.getSystemInfoSync().windowWidth,
      // 歌单中SQ音质数据
      playInfo    : {
        tracks         : [],
        name           : "",
        coverImgUrl    : null,
        description    : '',
        subscribedCount: 0,
        creator        : {
          avatarUrl: '',
          nickname : ''
        }
      },
      showChannels: false,
      selectSongs : [],
    }
  },
  onLoad(query)
  {
    console.log("onLoad", query)
    let id = query.id;
    let type = query.type;
    console.log("歌单id:" + id);
    switch (type)
    {
      case "0":
        this.getPlaylistDetail(id);
        break;
      case "1":
        this.getTopList(id);
        break
      case "2":
        this.getAlbums(id)
        break;
    }
  },
  methods   : {
    showChannelsDialog(e)
    {
      console.log("显示通道", e)
      if (e.length > 0)
        this.selectSongs = e
      this.showChannels = true;
    },
    async getPlaylistDetail(id)
    {
      const {playlist} = await musicRequest.get("/playlist/detail?id=" + id)
      this.playInfo = playlist;
      const ids = playlist.trackIds.map(value => value.id).join(',')
      const res = await musicRequest.post("/song/detail??timestamp=" + (new Date()).valueOf(), {ids})
      res.songs.forEach(item =>
      {
        item.checked = false
      })
      this.playInfo.tracks = res.songs
      console.log("歌单", this.playInfo)
    },
    async getTopList(id)
    {
      const {playlist} = await musicRequest.get("/playlist/detail?id=" + id)
      playlist.tracks.forEach(value => {value.checked = false})
      this.playInfo = playlist
    },
    async getAlbums(id)
    {
      const {album, songs} = await musicRequest.get("/album?id=" + id)
      songs.forEach(item =>
      {
        item.checked = false
      })
      this.playInfo = {
        name           : album.name,
        coverImgUrl    : album.blurPicUrl,
        description    : album.description,
        tracks         : songs,
        subscribedCount: 0,
        creator        : {
          avatarUrl: album.artist.picUrl,
          nickname : album.artist.name
        }
      }
    },
  },
}
</script>

<style scoped>
@import "_index.scss";
</style>
