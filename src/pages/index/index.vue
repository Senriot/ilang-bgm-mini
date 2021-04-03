<template>
  <view class="page" style="background: white">
    <van-sticky>
      <view id="searchBar" class="cu-bar search bg-white" @click="openSearch">
        <view class="search-form round">
          <text class="cuIcon-search"></text>
          <text class="text-grey">输入搜索关键词</text>
        </view>
      </view>
    </van-sticky>
    <van-tabs id="tabBar"
              :color="'#5578eb'"
              animated
              :active="active"
              @change="tabChanged"
              swipeable
              sticky
              :offset-top="searchHeight">
      <van-tab title="音乐" id="musicTab">
        <swiper :autoplay="true"
                :circular="true"
                :indicator-dots="true"
                class="screen-swiper round-dot"
                duration="500"
                indicator-active-color="#0081ff"
                indicator-color="#8799a3"
                interval="5000">
          <swiper-item :key="index"
                       @tap="bannerTap(item.targetId,item.targetType)"
                       v-for="(item,index) in banners">
            <van-image :src="item.imageUrl"
                       fit="fill"
                       height="100%"
                       radius="5"
                       width="100%"
            />
          </swiper-item>
        </swiper>
        <van-grid column-num="5" :border="false">
          <van-grid-item :key="index" v-for="(item,index) in iconList" :text="item.name" :url="item.url" clickable>
            <image :src="item.icon" slot="icon" mode="aspectFit" style="width: 40rpx;height: 40rpx"/>
          </van-grid-item>
        </van-grid>
        <view class="cu-bar bg-white solid-bottom margin-top">
          <u-section title="歌单推荐" font-siz="38" @click="morePersonalized"></u-section>
        </view>
        <scroll-view class="main" :scroll-x="true" :scroll-with-animation="true">
          <view :key="index"
                @click="openSongSheet(item.id,0)"
                class="cu-item"
                style="display: inline-block;width: 230rpx;height:300rpx;vertical-align: top;"
                v-for="(item,index) in personalized">
            <song-grid :src="`${item.picUrl}?param=200y200`" :title="item.name"></song-grid>
          </view>
        </scroll-view>
        <view class="cu-bar bg-white solid-bottom margin-top">
          <u-section title="情景推荐"></u-section>
        </view>
        <scroll-view class="main" :scroll-x="true" :scroll-with-animation="true">
          <view :key="index"
                @click="openSongSheet(item.id,0)"
                class="cu-item"
                style="display: inline-block;width: 230rpx;height:300rpx;vertical-align: top;"
                v-for="(item,index) in personalized">
            <song-grid :src="`${item.picUrl}?param=200y200`" :title="item.name"></song-grid>
          </view>
        </scroll-view>
        <view class="cu-bar bg-white solid-bottom margin-top">
          <u-section title="新歌推荐"></u-section>
        </view>
        <view class="cu-list menu-avatar">
          <view class="cu-item " :key="index" v-for="(item,index) in newSongs" @click="songCellTap(item)">
            <image :src="`${item.picUrl}?param=100y100`" class="cu-avatar radius lg"></image>
            <view class="content">
              <view class="text-cut">{{item.name}}</view>
              <view class="text-gray text-sm flex">
                <view class="text-cut">{{item.song.artists[0].name}}</view>
              </view>
            </view>
            <view class="action">
              <text class="cuIcon-moreandroid lg text-gray"/>
            </view>
          </view>
        </view>
        <view class="cu-bar bg-white solid-bottom margin-top">
          <u-section title="最新专辑"></u-section>
        </view>
        <view class="cu-list grid col-3 no-border">
          <view :key="index"
                @click="openSongSheet(item.id,2)"
                class="cu-item"
                v-for="(item,index) in newest">
            <song-grid :src="`${item.blurPicUrl}?param=200y200`"
                       :sub-title="item.artist.name"
                       :title="item.name">
            </song-grid>
          </view>
        </view>
      </van-tab>
      <van-tab :title="item.name" :key="index" v-for="(item,index) in tabs">
        <loading v-if="item.loading"/>
        <view v-if="item.data">
          <view class="cu-bar bg-white solid-bottom">
            <u-section title="单曲" font-siz="38" @click="moreSingle(item.name,'song')"></u-section>
          </view>
          <view class="cu-list menu-avatar" v-if="item.data">
            <view class="cu-item "
                  :key="i"
                  v-for="(song,i) in item.data.song.songs"
                  @click="selectSingle(song)">
              <image :src="`${song.al.picUrl}?param=100y100`" class="cu-avatar radius lg"></image>
              <view class="content">
                <view class="text-cut">{{song.name}}</view>
                <view class="text-gray text-sm flex">
                  <view class="text-cut">{{song.ar[0].name}}</view>
                </view>
              </view>
              <view class="action">
                <text class="cuIcon-moreandroid lg text-gray"/>
              </view>
            </view>
          </view>
          <view class="cu-bar bg-white solid-bottom" v-if="item.data">
            <u-section title="歌手" font-siz="38" @click="moreSingle(item.name,'artist')"></u-section>
          </view>
          <van-cell-group>
            <van-cell :key="i"
                      @click="showArtistDetail(artist)"
                      :title="artist.name"
                      center
                      is-link
                      v-for="(artist,i) in item.data.artist.artists">
              <image slot="icon" class="cu-avatar round lg margin-right" :src="`${artist.img1v1Url}?param=100y100`"/>
            </van-cell>
          </van-cell-group>
          <view class="cu-bar bg-white solid-bottom" v-if="item.data">
            <u-section title="专辑" font-siz="38" @click="moreSingle(item.name,'album')"></u-section>
          </view>
          <view class="cu-list grid col-3 no-border">
            <view :key="i"
                  @click="openSongSheet(item.id,2)"
                  class="cu-item"
                  v-for="(album,i) in item.data.album.albums">
              <song-grid :src="`${album.blurPicUrl}?param=200y200`"
                         :sub-title="album.artist.name"
                         :title="album.name">
              </song-grid>
            </view>
          </view>
          <view class="cu-bar bg-white solid-bottom" v-if="item.data">
            <u-section title="歌单" font-siz="38" @click="moreSingle(item.name,'playlist')"></u-section>
          </view>
          <van-cell-group>
            <van-cell :title="playList.name"
                      title-class="text-df"
                      center
                      clickable
                      :label="playList.creator.nickname"
                      :value="playList.trackCount +'首'"
                      v-for="(playList,i) in item.data.playList.playLists"
                      is-link
                      :url="`../song-sheet/index?id=${playList.id}&type==0`"
                      :key="i">
              <image slot="icon"
                     class="cu-avatar radius lg margin-right"
                     :src="`${playList.coverImgUrl}?param=100y100`"/>
            </van-cell>
          </van-cell-group>
        </view>
      </van-tab>
    </van-tabs>
    <song-action/>
  </view>
</template>

<script>
import {mapActions, mapState}          from "vuex";
import {Banner, BannerRes}             from "@/model";
import {Personalized, PersonalizedRes} from "@/model/Personalized";
import {NewSong, NewSongRes}           from "@/model/NewSong";
import {Album, AlbumRes}               from "@/model/Album";
import musicRequest                    from "@/common/music.api";
import SongGrid                        from "@/components/song-grid.vue";
import SongActionSheet                 from "@/components/song-action-sheet.vue";
import srvRequest                      from "@/common/server.api";
import {mqttConnect, send, subscribe}  from "@/common/mqtt.service";
import Loading                         from "@/components/loading";


export default {
  components: {Loading, SongGrid},
  data()
  {
    return {
      active      : 0,
      searchHeight: 0,
      banners     : [],
      personalized: [],
      newSongs    : [],
      newest      : [],
      otherData   : {},
      tabs        : [{
        name   : "儿童",
        data   : null,
        loading: true
      }, {
        name   : "国学",
        data   : null,
        loading: true
      }, {
        name   : "戏曲",
        data   : null,
        loading: true
      }, {
        name   : "故事",
        data   : null,
        loading: true
      }, {
        name   : "相声",
        data   : null,
        loading: true
      }],
      iconList    : [
        {
          icon : '../../static/artist-2@3x.png',
          color: 'cyan',
          badge: 0,
          name : '歌手',
          url  : '../artist-category/index'
        },
        {
          icon : '../../static/playlist-2@3x.png',
          color: 'orange',
          badge: 0,
          name : '歌单',
          url  : '../song-sheet-list/index'
        },
        {
          icon : '../../static/rank-2@2x.png',
          color: 'yellow',
          badge: 0,
          name : '排行榜',
          url  : '../rank/index'
        },
        {
          icon : '../../static/HIFI-2@3x.png',
          color: 'olive',
          badge: 0,
          name : '无损',
          url  : '../ape-flac/ape-flac'
        },
        {
          icon : '../../static/qingyin-2@3x.png',
          color: 'olive',
          badge: 0,
          name : '轻音',
          url  : '../ape-flac/ape-flac'
        }
      ],
      showSheet   : false,
    }
  },
  computed  : {
    ...mapState(['deviceId', "openId", "currentDevice"])
  },

  onLoad(query)
  {
    uni.$on("mqtt_connected", () =>
    {
      if (this.deviceId)
      {
        console.log("二维码扫描ID")
        subscribe(this.deviceId)
        send("/device/bgm/getDeviceInfo", {deviceId: this.deviceId})
      }
      else if (this.currentDevice.devId != undefined)
      {
        console.log("缓存id", this.currentDevice.devId)
        subscribe(this.currentDevice.devId)
        send("/device/bgm/getDeviceInfo", {deviceId: this.currentDevice.devId})
      }
    });
    console.log("启动参数", query)
    const url = query.q;
    if (url)
    {
      const mr = decodeURIComponent(url).split("/");
      console.log(mr)
      const id = mr[mr.length - 1]
      this.saveDeviceId(id)
    }
    if (!this.openId)
    {
      uni.login({
        success: result =>
        {
          console.log(result)
          srvRequest.post(`ilang/wx/login?jsCode=${result.code}`).then((res) =>
          {
            console.log("登录成功", res)
            const openId = res.result.openid;
            this.saveOpenId(openId)
            mqttConnect(openId)
          })
        },
        fail   : result =>
        {

        }
      })
    }
    else
    {
      mqttConnect(this.openId)
    }

    this.init();
  },
  onReady()
  {


  },
  methods: {
    ...mapActions(["saveDeviceId", 'saveOpenId', 'saveCurrentDevice', "setSongSheetProp", "saveCurrentArtist"]),
    // cardSwiper(e: any)
    // {
    //   this.cardCur = e.detail.current
    // },

    async init()
    {
      await uni.showLoading({title: '加载中...'});
      await this.getBanners();
      await this.getPersonalized();
      await this.getNewSongs();
      await this.getNewest();
      await uni.hideLoading()
    },

    getBanners()
    {
      musicRequest.get("/banner").then(value =>
      {
        if (value.code == 200)
        {
          this.banners = value.banners
        }
      })
    },

    getPersonalized()
    {
      musicRequest.get("/personalized?limit=6").then(value =>
      {
        if (value.code == 200)
          this.personalized = value.result
      })
    },
    morePersonalized()
    {
      uni.navigateTo({
        url: '../song-sheet-list/index'
      })
    },
    getNewSongs()
    {
      musicRequest.get("/personalized/newsong").then(value =>
      {
        if (value.code == 200)
          this.newSongs = value.result
      })
    },
    getNewest()
    {
      musicRequest.get("/album/newest").then(value =>
      {
        if (value.code == 200)
        {
          this.newest = value.albums
        }
      })
    },
    openSearch(e)
    {
      console.log("开始搜索", e)
      uni.navigateTo({
        url: `../search/index`
      })
    },
    openSongSheet(id, type)
    {
      uni.navigateTo({
        url: '../song-sheet/index?id=' + id + "&type=" + type,
      })
    },
    bannerTap(id, type)
    {
      if (type == 10)
      {
        uni.navigateTo({
          url: `../song-sheet/index?id=${id}&type=2`
        })
      }
    },
    async songCellTap(song)
    {
      const s = await musicRequest.get("/check/music", {id: song.id})
      if (s.success)
      {
        this.setSongSheetProp({
          isShow: true,
          item  : {
            ...song.song,
            al: song.song.album,
            ar: song.song.artists
          }
        })
      }
      else
      {
        uni.showToast({
          title: s.message
        })
      }
    },
    openPage(item)
    {
      uni.navigateTo({
        url: item.url
      })
    },
    async selectSingle(song)
    {
      const s = await musicRequest.get("/check/music", {id: song.id})
      if (s.success)
      {
        this.setSongSheetProp({
          isShow: true,
          item  : song
        })
      }
      else
      {
        uni.showToast({
          title: s.message
        })
      }
    },
    async tabChanged(e)
    {
      console.log(e)
      if (e.detail.index > 0)
      {
        let data = this.tabs[e.detail.index - 1].data
        console.log("其他数据", data)
        if (!data)
        {
          const res = await musicRequest.get(`/search?keywords=${e.detail.title}&type=1018`);
          this.tabs[e.detail.index - 1].data = res.result;
          this.tabs[e.detail.index - 1].loading = false
          console.log("其他数据", this.tabs)
        }
      }
    },
    showArtistDetail(e)
    {
      this.saveCurrentArtist(e)
      uni.navigateTo({
        url: `../artist-detail/index`
      })
    },
    moreSingle(tab, type)
    {
      console.log(tab, type)
      uni.navigateTo({
        url: `MoreSingle?title=${tab}&type=${type}`
      })
    }
  },
  mounted()
  {
    const query = uni.createSelectorQuery().in(this);
    query.select('#searchBar').boundingClientRect(data =>
    {
      console.log("tabbar", data)
      this.searchHeight = data.bottom
    }).exec();
  }
}
</script>

<style>
.main {
  display: flex;
  background: #fff;
  white-space: nowrap;
}

.screen-swiper {
  padding: 15rpx;
  min-height: 320rpx
}

u-section {
  width: 100%;
  margin-left: 30rpx;
  margin-right: 30rpx;
}
</style>
