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
        <view class="photo">
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
      <!-- 注意这里图片的高度，必须是偶数。否则在H5端的部分chrome版本上会触发chrome的bug，在标题栏下方会留下一条线的空隙 -->
      <u-sticky :offset-top="navbarHeight">
        <view class="cu-bar bg-white" v-if="!loading">
          <view class="action">
            <text class="text-xxl cuIcon-video text-gray "/>
            播放全部
          </view>
          <view class="action text-black text-sm" slot="right">
            <view class="cuIcon-settings margin-right-xs"></view>
            管理
          </view>
        </view>
      </u-sticky>
      <view>
        <van-cell :key="index"
                  :label="`${item.ar[0].name}-${item.al.name}`"
                  :title="item.name"
                  @click="songCellTap(item)"
                  center
                  title-class="text-df"
                  v-for="(item,index) in playInfo.tracks">
          <text slot="icon" class="cu-avatar radius text-grey bg-white sm avatar-text margin-right">{{ index + 1}}
          </text>
          <text class="cuIcon-moreandroid lg text-gray" slot="right-icon"/>
        </van-cell>
      </view>
    </view>
  </view>
</template>

<script>
import musicRequest from "@/common/music.api";

export default {
  data() {
    return {
      navBg: {
        backgroundColor: '#00000000',
      },
      isAlbum: false,
      status: 'loadmore',
      // @ts-ignore
      navbarHeight: this.CustomBar * 750 / uni.getSystemInfoSync().windowWidth,
      // 歌单中SQ音质数据
      privileges: [],
      playInfo: {
        tracks: [],
        name: "",
        coverImgUrl: null,
        description: '',
        subscribedCount: 0,
        creator: {
          avatarUrl: '',
          nickname: ''
        }
      },
    }
  },
  onLoad(query) {
    console.log("onLoad", query)
    let id = query.id;
    // type(0-歌单、1-排行榜1111、2-专辑)
    let type = query.type;
    // let id = 2853229030
    // console.log("歌单id:" + id);
    if (type == 0) {
      this.getPlaylistDetail(id);
    }
    if (type == 1) {
      this.getTopList(id);
    }
    if (type == 2) {
      console.log(id);
      this.getAlbums(id)
    }
  },
  methods: {
    getPlaylistDetail(id) {
      musicRequest.get("/playlist/detail?id=" + id).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.playInfo = res.playlist;
          this.privileges = res.privileges;
        }
      })
    },
    getTopList(id) {
      musicRequest.get("/playlist/detail?id=" + id).then(res => {
        if (res.code === 200) {
          this.playInfo = res.playlist;
          this.privileges = res.privileges;
        }
      })
    },
    getAlbums(id) {
      musicRequest.get("/album?id=" + id).then(value => {
        console.log("加载专辑信息", value)
        if (value.code === 200) {
          const album = value.album;
          this.loading = false;
          this.isAlbum = true;
          this.playInfo = {
            name: album.name,
            coverImgUrl: album.blurPicUrl,
            description: album.description,
            tracks: value.songs,
            subscribedCount: 0,
            creator: {
              avatarUrl: album.artist.picUrl,
              nickname: album.artist.name
            }
          }
        }
      })
    },
  },
}
</script>

<style scoped>
@import "_index.scss";
</style>
