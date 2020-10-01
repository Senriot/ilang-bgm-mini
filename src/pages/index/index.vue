<template>
  <view>
    <!--    <van-sticky id="searchBar">-->
    <!--      <view class="cu-bar search bg-white" @click="openSearch">-->
    <!--        <view class="search-form round">-->
    <!--          <text class="cuIcon-search"></text>-->
    <!--          <text class="text-grey">搜索歌曲、歌单、歌星、专辑</text>-->
    <!--        </view>-->
    <!--      </view>-->
    <!--    </van-sticky>-->

    <van-tabs id="tabBar" :active="active" sticky>
      <van-tab title="音乐" id="musicTab">
        <van-sticky id="searchBar" :offset-top="searchHeight">
          <view class="cu-bar search bg-white" @click="openSearch">
            <view class="search-form round">
              <text class="cuIcon-search"></text>
              <text class="text-grey">搜索歌曲、歌单、歌星、专辑</text>
            </view>
          </view>
        </van-sticky>
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
          <view class="cu-item " v-for="(item,index) in newSongs" @click="songCellTap(item)">
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
      <van-tab title="儿童">儿童</van-tab>
      <van-tab title="国学">国学</van-tab>
      <van-tab title="戏曲">戏曲</van-tab>
      <van-tab title="故事">故事</van-tab>
      <van-tab title="相声">相声</van-tab>
    </van-tabs>
    <song-action/>
  </view>
</template>

<script lang="ts">
import Vue                             from 'vue';
import {mapActions, mapState}          from "vuex";
import {Banner, BannerRes}             from "@/model";
import {Personalized, PersonalizedRes} from "@/model/Personalized";
import {NewSong, NewSongRes}           from "@/model/NewSong";
import {Album, AlbumRes}               from "@/model/Album";
import musicRequest                    from "@/common/music.api";
import {mqttService}                   from "@/common/mqtt.service";
import SongGrid                        from "@/components/song-grid.vue";
import SongActionSheet                 from "@/components/song-action-sheet.vue";


export default Vue.extend({
  components: {SongGrid},
  data()
  {
    return {
      active      : 0,
      searchHeight: 0,
      banners     : Array<Banner>(),
      personalized: Array<Personalized>(),
      newSongs    : Array<NewSong>(),
      newest      : Array<Album>(),
      iconList    : [
        {
          icon : '/static/歌手-2@3x.png',
          color: 'cyan',
          badge: 0,
          name : '歌手',
          url  : '../artist-category/index'
        },
        {
          icon : '/static/歌单-2@3x.png',
          color: 'orange',
          badge: 0,
          name : '歌单',
          url  : '../song-sheet-list/index'
        },
        {
          icon : '/static/排行榜-2@2x.png',
          color: 'yellow',
          badge: 0,
          name : '排行榜',
          url  : '../rank/index'
        },
        {
          icon : '/static/HIFI-2@3x.png',
          color: 'olive',
          badge: 0,
          name : '无损',
          url  : '../ape-flac/ape-flac'
        },
        {
          icon : '/static/轻音-2@3x.png',
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
    ...mapState(['deviceId'])
  },
  
  onLoad(query: Record<string, string | undefined>)
  {
    uni.$on("mqtt_connected", () =>
    {
      if (this.deviceId)
      {
        mqttService.deviceId = this.deviceId
      }
    });
    const url = query.q;
    if (url)
    {
      const id = decodeURIComponent(url).split("=")[1];
      this.saveDeviceId(id)
    }
    else
    {
      this.saveDeviceId("00e099011d88")
    }

    uni.$on("close_action_sheet", () =>
    {
      this.showSheet = false
    });
    uni.$on("mqtt", result =>
    {
      console.log(result)
      const topic: string = result.topic;
      if (topic.includes("/device/bgm/getDeviceInfo"))
      {
        const obj = JSON.parse(result.payload);
        const device = obj.device;
        device.channelList = obj.channels;
        this.saveCurrentDevice(device)
      }
    });
    this.init();
  },
  onReady()
  {


  },
  methods   : {
    ...mapActions(["saveDeviceId", 'saveCurrentDevice', "setSongSheetProp"]),
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
      musicRequest.get<BannerRes>("/banner").then(value =>
      {
        if (value.code == 200)
        {
          this.banners = value.banners
        }
      })
    },

    getPersonalized()
    {
      musicRequest.get<PersonalizedRes>("/personalized?limit=6").then(value =>
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
      musicRequest.get<NewSongRes>("/personalized/newsong").then(value =>
      {
        if (value.code == 200)
          this.newSongs = value.result
      })
    },
    getNewest()
    {
      musicRequest.get<AlbumRes>("/album/newest").then(value =>
      {
        if (value.code == 200)
        {
          this.newest = value.albums
        }
      })
    },
    openSearch(e: any)
    {
      console.log("开始搜索", e)
      uni.navigateTo({
        url: `../search/index`
      })
    },
    openSongSheet(id: number, type: number)
    {
      uni.navigateTo({
        url: '../song-sheet/index?id=' + id + "&type=" + type,
      })
    },
    bannerTap(id: number, type: number)
    {
      if (type == 10)
      {
        uni.navigateTo({
          url: `../song-sheet/index?id=${id}&type=2`
        })
      }
    },
    async songCellTap(song: any)
    {
      const s: any = await musicRequest.get("/check/music", {id: song.id})
      if (s.success)
      {
        this.setSongSheetProp({
          isShow: true,
          item  : {
            ...song,
            artist: song.song.artists[0]
          }
        })
      }
      else
      {
        uni.showToast({
          title: s.message
        })
      }
      console.log(s)
      // checkSong(song.id, (succeed, msg) =>
      // {
      //   if (succeed)
      //   {
      //     this.actionSheetItem = {
      //       ...song,
      //       artist: song.song.artists[0]
      //     };
      //     this.showSheet = true
      //   }
      //   else
      //   {
      //     uni.showToast({
      //       title: msg
      //     })
      //   }
      // });

    },
    openPage(item: any)
    {
      uni.navigateTo({
        url: item.url
      })
    }
  },
  mounted()
  {
    const query = uni.createSelectorQuery().in(this);
    query.select('#musicTab').boundingClientRect(data =>
    {
      console.log("tabbar", data)
      this.searchHeight = data.top!
    }).exec();
  }
})
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
