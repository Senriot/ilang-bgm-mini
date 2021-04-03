<template>
  <view id="root">
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
      <view class="header_title">
        <text class="text-white text-shadow text-xxl">{{currentArtist.name}}</text>
        <text class="text-shadow briefDesc text-sm">{{currentArtist.briefDesc}}</text>
      </view>

    </view>
    <van-tabs
        :active="curTab"
        :color="'#5578eb'"
        @change="tabChanged"
        animated
        color="#0081ff"
        id="tabs"
        sticky
        @scroll="scroll"
        :offset-top="navbarHeight"
        swipeable>
      <van-tab title="单曲" id="tab">
        <song-list :list="hotSongs" @complete="showChannelsDialog">
          <view slot="title" class="action text-black text-bold">
            收藏热门 50
          </view>
        </song-list>
        <van-cell center is-link url="songs">
          <view class="action text-center text-gray text-df">全部歌曲</view>
        </van-cell>
        <!--        </van-cell-group>-->
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
    <song-action/>
    <channel-selector :show="showChannels" @change="showChannels = $event" :songs="selectSongs"/>
  </view>

</template>

<script>
import {mapActions, mapState} from "vuex";
import musicRequest           from "@/common/music.api";
import {formatTimeCommit}     from "@/common/util";
import SongList               from "@/components/song-list";
import ChannelSelector        from "@/components/channel-selector";

export default {
  components: {ChannelSelector, SongList},
  data()
  {
    return {
      curTab       : 0,
      artistId     : '',
      hotSongs     : [],
      // @ts-ignore
      navbarHeight : this.CustomBar,
      toolBarHeight: 0,
      isFixed      : false,
      albumsInfo   : {
        more  : true,
        list  : [],
        status: 'loadmore'
      },
      tabs         : [
        {
          name: '歌曲'
        },
        {
          name: '专辑'
        }
      ],
      navBg        : {
        backgroundColor: '#00000000',
      },
      navBg_w      : {
        backgroundColor: '#fff',
      },
      showChannels : false,
      selectSongs  : []
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
    // const query = uni.createSelectorQuery().in(this);
    // query.select('#tab').boundingClientRect(data => {
    //   console.log("tabs", data)
    //   this.toolBarHeight = data.top
    // }).exec();
  },
  computed  : {
    ...mapState(["currentArtist"])
  },
  onLoad(query)
  {
    this.getHotSongs();
  },
  methods   : {
    ...mapActions(['saveCurrentArtist']),
    scroll(e)
    {
      this.isFixed = e.detail.isFixed
    },
    tabChanged(e)
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
      musicRequest.get(`/artists?id=${this.currentArtist.id}`).then((value) =>
      {
        console.log("热门歌曲", value)
        this.saveCurrentArtist(value.artist)
        value.hotSongs.forEach(item =>
        {
          item.checked = false
        })
        this.hotSongs = value.hotSongs;
      })
    },
    getAlbums()
    {
      const offset = this.albumsInfo.list.length;
      this.albumsInfo.status = 'loading'
      musicRequest.get(`/artist/album?id=${this.currentArtist.id}&offset=${offset}`).then((value) =>
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
    },
    showChannelsDialog(e)
    {
      if (e.length > 0)
        this.selectSongs = e
      this.showChannels = true;
    },
  }
}
</script>

<style scoped>
@import "_index.scss";

u-section {
  width: 100%;
  margin-left: 30rpx;
}
</style>
