<template>
  <view>
    <u-navbar id="navBar"
              :back-icon-color="isFixed?'#000':'#fff'"
              :title="isFixed?currentArtist.name:''"
              :border-bottom="false"
              immersive
              :background="isFixed?navBg_w:navBg">
    </u-navbar>

    <!--    <view>-->
    <view class="header"
          v-if="currentArtist.picUrl">
      <view class="header_bg" :style="'background-image: url('+currentArtist.picUrl+'?param=500y500)'">

      </view>
      <text class="header_title text-white text-shadow text-xxl">{{currentArtist.name}}</text>
    </view>
    <van-tabs
        :active="curTab"
        @change="tabChanged"
        animated
        color="#0081ff"
        id="tabs"
        sticky
        @scroll="scroll"
        :offset-top="navbarHeight"
        swipeable>
      <van-tab title="单曲">
        <view class="cu-bar bg-white solid-bottom">
          <u-section title="收藏热门 50">
            <view class="action text-black text-sm" slot="right">
              <view class="cuIcon-settings margin-right-xs"></view>
              管理
            </view>
          </u-section>
        </view>
        <van-cell-group>
          <van-cell :title="item.name"
                    title-class="text-df"
                    center
                    clickable
                    :label="item.al.name"
                    v-for="(item,index) in hotSongs"
                    :key="index">
            <text slot="icon" class="cu-avatar radius text-grey bg-white sm avatar-text margin-right">{{ index + 1}}
            </text>
            <text class="cuIcon-moreandroid lg text-gray" slot="right-icon"/>
          </van-cell>
          <van-cell center is-link url="songs">
            <view class="action text-center text-gray text-df">全部歌曲</view>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="专辑">
        <van-cell-group>
          <van-cell :title="item.name"
                    title-class="text-df"
                    center
                    clickable
                    :label="item.publishTime + '  ' + item.size + '首'"
                    v-for="(item,index) in albumsInfo.list"
                    is-link
                    :url="`../song-sheet/index?type=2&id=${item.id}`"
                    :key="index">
            <image slot="icon" class="cu-avatar radius lg margin-right" :src="`${item.picUrl}?param=100y100`"/>
          </van-cell>
        </van-cell-group>
        <van-cell>
          <u-loadmore :status="albumsInfo.status"/>
        </van-cell>
      </van-tab>
    </van-tabs>
  </view>

</template>

<script lang="ts">
import Vue                    from 'vue';
import {mapActions, mapState} from "vuex";
import musicRequest           from "@/common/music.api";
import {formatTimeCommit}     from "@/common/util";

export default Vue.extend({
  data()
  {
    return {
      curTab      : 0,
      artistId    : '',
      hotSongs    : [],
      // @ts-ignore
      navbarHeight: this.CustomBar,
      isFixed     : false,
      albumsInfo  : {
        more  : true,
        list  : [],
        status: 'loadmore'
      },
      tabs        : [
        {
          name: '歌曲'
        },
        {
          name: '专辑'
        }
      ],
      navBg       : {
        backgroundColor: '#00000000',
      },
      navBg_w     : {
        backgroundColor: '#fff',
      }
    }
  },
  onReachBottom()
  {
    console.log("加载更多")
    if (this.curTab == 1 && this.albumsInfo.more)
    {
      this.getAlbums()
    }
  },
  mounted()
  {
  },
  computed: {
    ...mapState(["currentArtist"])
  },
  onLoad(query: Record<string, string | undefined>)
  {
    this.getHotSongs();
  },
  methods : {
    ...mapActions(['saveCurrentArtist']),
    scroll(e: any)
    {
      this.isFixed = e.detail.isFixed
    },
    tabChanged(e: any)
    {
      console.log(e)
      this.curTab = e.detail.index
      if (this.curTab == 1 && this.albumsInfo.more)
      {
        this.getAlbums()
      }
    },
    getHotSongs()
    {
      musicRequest.get(`/artists?id=${this.currentArtist.id}`).then((value: any) =>
      {
        console.log("热门歌曲", value)
        this.saveCurrentArtist(value.artist)
        this.hotSongs = value.hotSongs;
      })
    },
    getAlbums()
    {
      const offset = this.albumsInfo.list.length;
      this.albumsInfo.status = 'loading'
      musicRequest.get(`/artist/album?id=${this.currentArtist.id}&offset=${offset}`).then((value: any) =>
      {
        console.log("加载专辑", value)
        this.albumsInfo.more = value.more
        const albums = value.hotAlbums
        for (let i in albums)
        {
          albums[i].publishTime = formatTimeCommit(albums[i].publishTime, 3)
        }
        this.albumsInfo.list = this.albumsInfo.list.concat(albums);
        this.albumsInfo.status = 'loadmore'
        if (!value.more)
        {
          this.albumsInfo.status = 'nomore'
        }
      })
    }
  }
})
</script>

<style scoped>
@import "_index.scss";

u-section {
  width: 100%;
  margin-left: 30rpx;
}
</style>
