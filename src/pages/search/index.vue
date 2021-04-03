<template>
  <view>
    <u-navbar id="navBar">
      <u-search placeholder="输入搜索关键词"
                @clear="inpuText"
                @change="inpuText"
                v-model="searchKey"
                focus
                :show-action="false"
                @search="onSearch"></u-search>
    </u-navbar>
    <!--    <view :style="'top:'+CustomBar+'px' " class="search_header">-->
    <!--      <view class="cu-list menu" v-if="showSuggest">-->
    <!--        <view :data-key="item"-->
    <!--              :key="index"-->
    <!--              @tap="chooseKey"-->
    <!--              class="cu-item"-->
    <!--              v-for="(item,index) in searchSuggests">-->
    <!--          <view class="content">-->
    <!--            <text class="cuIcon-search text-grey sm"/>-->
    <!--            <text class="text-grey text-sm">{{item.keyword}}</text>-->
    <!--          </view>-->
    <!--        </view>-->
    <!--      </view>-->
    <!--    </view>-->
    <view class="history_wrap" v-if="!showResult">
      <view class="cu-bar bg-white solid-bottom">
        <view class="action">
          <text class="cuIcon-titles text-blue"/>
          历史记录
        </view>
        <view @click="deleteHistory" class="action">
          <text class="cuIcon-delete text-gray"/>
        </view>
      </view>
      <view class='padding-sm flex flex-wrap bg-white'>
        <view class='cu-tag round margin-sm' :key="index" v-for="(item,index) in history">{{item}}</view>
      </view>
    </view>
    <view class="hot_wrap" v-if="!showResult">
      <view class="cu-bar bg-white">
        <view class="action">
          <text class="cuIcon-titles text-blue "/>
          热搜榜
        </view>
      </view>
      <!-- 热搜item -->
      <van-cell-group>
        <van-cell :title="item.searchWord"
                  title-class="text-df"
                  center
                  clickable
                  :label="item.content"
                  @click="chooseHotItem(item)"
                  v-for="(item,index) in searchHotDetail"
                  :key="index">
          <text slot="icon"
                class="cu-avatar radius bg-white sm avatar-text margin-right"
                :class="index<3?'text-red':'text-grey'">{{ index + 1}}
          </text>
        </van-cell>
      </van-cell-group>
    </view>
    <van-tabs v-if="showResult" :color="'#5578eb'" :active="currentTab" @change="swiperChange" sticky :offset-top="navbarHeight">
      <van-tab title="单曲">
        <van-cell-group>
          <van-cell :title="item.name"
                    title-class="text-df"
                    center
                    clickable
                    :label="item.artists[0].name+'-'+item.album.name"
                    v-for="(item,index) in songs.list"
                    @click="songSelected(item)"
                    :key="index">
            <text class="cuIcon-moreandroid lg text-gray" slot="right-icon"/>
          </van-cell>
          <van-cell>
            <u-loadmore :status="songs.status"/>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="歌星">
        <van-cell-group>
          <van-cell :key="index"
                    @click="showArtistDetail(item)"
                    :title="item.name"
                    center
                    is-link
                    v-for="(item,index) in artists.list">
            <image slot="icon" class="cu-avatar round lg margin-right" :src="`${item.img1v1Url}?param=100y100`"/>
          </van-cell>
          <van-cell>
            <u-loadmore :status="artists.status"/>
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
                    v-for="(item,index) in albums.list"
                    is-link
                    :url="`../song-sheet/index?type=2&id=${item.id}`"
                    :key="index">
            <image slot="icon" class="cu-avatar radius lg margin-right" :src="`${item.picUrl}?param=100y100`"/>
          </van-cell>
          <van-cell>
            <u-loadmore :status="albums.status"/>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="歌单">
        <van-cell-group>
          <van-cell :title="item.name"
                    title-class="text-df"
                    center
                    clickable
                    :label="item.creator.nickname"
                    :value="item.trackCount +'首'"
                    v-for="(item,index) in playlists.list"
                    is-link
                    :url="`../song-sheet/index?id=${item.id}&type==0`"
                    :key="index">
            <image slot="icon" class="cu-avatar radius lg margin-right" :src="`${item.coverImgUrl}?param=100y100`"/>
          </van-cell>
          <van-cell>
            <u-loadmore :status="playlists.status"/>
          </van-cell>
        </van-cell-group>
      </van-tab>
    </van-tabs>
    <song-action/>
  </view>
</template>

<script>
import musicRequest       from "@/common/music.api";
import {formatTimeCommit}     from "@/common/util";
import {mapActions, mapState} from "vuex";
import {checkSong}            from "@/mixin/check-song";

const {windowHeight} = uni.getSystemInfoSync();

export default {
  mixins    : [checkSong],
  computed: {
    ...mapState(['songSheetProp'])
  },
  components: {},
  data()
  {
    return {
      // @ts-ignore
      navbarHeight   : this.CustomBar,
      history        : [],
      topViewHeight  : 144,
      active         : 0,
      scroll_left    : 0,
      currentTab     : 0,
      searchKey      : "",
      inputBottom    : 0,
      showSuggest    : false,
      searchSuggests : [],
      songs          : {
        list  : [],
        count : -1,
        more  : true,
        status: 'loadmore'
      },
      artists        : {
        list  : [],
        count : -1,
        more  : true,
        status: 'loadmore'
      },
      albums         : {
        list  : [],
        count : -1,
        more  : true,
        status: 'loadmore'
      },
      playlists      : {
        list  : [],
        count : -1,
        more  : true,
        status: 'loadmore'
      },
      searchType     : [
        {
          "name": "单曲"
        },
        {
          "id"  : 100,
          "name": "歌手"
        },
        {
          "id"  : 10,
          "name": "专辑"
        },
        {
          "id"  : 1000,
          "name": "歌单"
        }
      ],
      searchHotDetail: null,
      showResult     : false,
      actionSheetItem: {},
      showSheet      : false,
      device         : {}
    }
  },
  onReachBottom()
  {
    console.log("加载更多")
    this.loadMore(null)
  },
  mounted()
  {
    const query = uni.createSelectorQuery().in(this);
    query.select('#navBar').boundingClientRect(data =>
    {
      console.log("navBar", data)
      this.navbarHeight = data.height
    }).exec();
  },
  onLoad(query)
  {
    this.device = uni.getStorageSync("device");
    uni.$on("close_action_sheet", () =>
    {
      this.showSheet = false
    });
    uni.showLoading({
      title: '加载中',
    });
    this.getSearchHotDetail()
  },
  onShow()
  {
    this.history = (uni.getStorageSync("history") || []).reverse()
  },
  methods   : {
    ...mapActions(['saveCurrentArtist']),
    inpuText(e)
    {
      // console.log(e);
      // const value = e.detail.value;
      // this.searchKey = value;
      if (this.searchKey != '')
      {
        this.showSuggest = true;
        this.searchSuggest()
      }
      else
      {
        this.showSuggest = false;
        this.showResult = false;
      }
    },
    searchSuggest()
    {
      musicRequest.get("/search/suggest", {
        keywords: this.searchKey,
        type    : "mobile"
      }).then((value) =>
      {
        if (value.code == 200)
        {
          console.log(value);
          this.searchSuggests = value.result.allMatch
        }
      })
    },
    search(key)
    {
      this.songs = {
        list  : [],
        count : -1,
        more  : true,
        status: 'loadmore'
      };
      this.artists = {
        list  : [],
        count : -1,
        more  : true,
        status: 'loadmore'
      };
      this.albums = {
        list  : [],
        count : -1,
        more  : true,
        status: 'loadmore'
      };
      this.playlists = {
        list  : [],
        count : -1,
        more  : true,
        status: 'loadmore'
      };

      switch (this.currentTab)
      {
        case 0:
          this.loadMoreSingle();
          break;
        case 1:
          this.loadArtists();
          break;
        case 2:
          this.loadAlbum();
          break;
        case 3:
          this.loadPlaylist();
          break;
      }

      if (key != '')
      {
        let history = uni.getStorageSync("history") || [];
        if (history.includes(key))
        {
          for (let i = 0; i < history.length; i++)
          {
            if (key == history[i])
            {
              history.splice(i, 1);
            }
          }
        }
        history.unshift(key);
        uni.setStorageSync("history", history);
        this.history = history
      }
    },
    onSearch(e)
    {
      this.showSuggest = false;
      this.showResult = true;
      this.search(this.searchKey);
    },
    chooseKey(e)
    {
      const key = e.currentTarget.dataset.key.keyword;
      this.showResult = true;
      this.showSuggest = false;
      this.searchKey = key;

      this.search(key)
    },
    chooseHotItem(e)
    {
      this.showResult = true;
      this.showSuggest = false;
      this.searchKey = e.searchWord;
      this.search(this.searchKey)
    },
    swiperChange(e)
    {
      console.log(e);
      this.currentTab = e.detail.index;
      switch (this.currentTab)
      {
        case 0:
          this.loadMoreSingle();
          break;
        case 1:
          this.loadArtists();
          break;
        case 2:
          this.loadAlbum();
          break;
        case 3:
          this.loadPlaylist();
          break
      }
    },
    loadMore(e)
    {
      const cTab = this.currentTab;
      switch (cTab)
      {
        case 0:
          this.loadMoreSingle();
          break;
        case 1:
          this.loadArtists();
          break;
        case 2:
          this.loadAlbum();
          break;
        case 3:
          this.loadPlaylist();
          break
      }
    },
    loadMoreSingle()
    {
      if (this.songs.more)
      {
        const searchKey = this.searchKey;
        if (searchKey == '')
          return;
        this.songs.status = "loading";
        const offset = this.songs.list.length
        musicRequest.get("/search", {
          keywords: searchKey,
          type    : 1,
          offset  : offset,
        }).then((value) =>
        {
          console.log("搜索单曲", value)
          if (value.code == 200)
          {
            const songs = value.result.songs;
            const oldSingleList = this.songs.list;
            this.songs.list = oldSingleList.concat(songs);
            this.songs.count = value.result.songCount;
            this.songs.more = value.result.hasMore
            this.songs.status = value.result.hasMore ? "loadmore" : 'nomore';
          }
        })
      }
    },
    loadArtists()
    {
      if (this.artists.more)
      {
        const searchKey = this.searchKey;
        if (searchKey == '') return;
        this.artists.status = "loading";
        const offset = this.artists.list.length
        musicRequest.get("/search", {
          keywords: this.searchKey,
          type    : 100,
          offset  : offset
        }).then((value) =>
        {
          console.log("搜索歌星", value)
          const data = value;
          if (data.code == 200)
          {
            const artists = data.result.artists;
            const oldArtists = this.artists.list;
            this.artists.list = artists ? oldArtists.concat(artists) : [];
            this.artists.count = artists ? value.result.artistCount : 0;
            this.artists.more = value.result.hasMore;
            this.artists.status = value.result.hasMore ? "loadmore" : 'nomore';
          }
        })
      }
    },
    loadAlbum()
    {
      if (this.searchKey == '')
        return;
      if (this.albums.more)
      {
        this.albums.status = "loading"
        const offset = this.albums.list.length
        musicRequest.get("/search", {
          keywords: this.searchKey,
          type    : 10,
          offset
        }).then((value) =>
        {
          if (value.code == 200)
          {
            const oldAlbumsList = this.albums.list;
            const albums = value.result.albums;
            if (albums != null)
            {
              for (let i in albums)
              {
                albums[i].publishTime = formatTimeCommit(albums[i].publishTime, 3)
              }
              this.albums = {
                list  : oldAlbumsList.concat(albums),
                count : value.result.albumCount,
                more  : value.result.hasMore,
                status: value.result.hasMore ? "loadmore" : 'nomore'
              }
            }
          }
        })
      }
    },
    loadPlaylist()
    {
      if (this.searchKey == '')
        return;
      if (this.playlists.more)
      {
        const offset = this.playlists.list.length
        musicRequest.get("/search", {
          keywords: this.searchKey,
          type    : 1000,
          offset
        }).then((value) =>
        {
          if (value.code == 200)
          {
            const oldPlayList = this.playlists.list;
            const playlists = value.result.playlists;
            if (playlists != null)
            {
              this.playlists = {
                list  : oldPlayList.concat(playlists),
                count : value.result.playlistCount,
                more  : value.result.hasMore,
                status: value.result.hasMore ? "loadmore" : 'nomore'
              }
            }
          }
        })
      }
    },
    getSearchHotDetail()
    {
      musicRequest.get("/search/hot/detail").then((value) =>
      {
        if (value.code == 200)
        {
          this.searchHotDetail = value.data;
          uni.hideLoading()
        }
      });
    },
    BackPage()
    {
      uni.navigateBack({
        delta: 1
      })
    },
    tabSelect(e)
    {
      this.currentTab = e.currentTarget.dataset.id;
    },
    deleteHistory()
    {
      uni.setStorageSync("history", []);
      this.history = []
    },
    chooseHistory(item)
    {
      console.log(item);
      this.searchKey = item;
      this.showResult = true;
      this.showSuggest = false;
      this.search(item)
    },
    showArtistDetail(item)
    {
      this.saveCurrentArtist(item)
      uni.navigateTo({
        url: `../artist-detail/index`
      })
    }
  },

}
</script>

<style>

.search_header {
  position: fixed;
  z-index: 999;
  width: 100%;
  margin: 0px;
}


.search_wrap .search {
  display: flex;
}

.form_input view {
  position: absolute;
  top: 0;
  z-index: 10;
  left: 0;
  padding: 12rpx 15rpx;
}

.form_input .sf_clear {
  right: 0;
  left: auto;
  margin-right: 30rpx;
}

.form_input input {
  border: none;
  color: #515151;
  background-color: #ececec;
  border-radius: 4rpx;
  font-size: 20rpx;
  padding: 0 60rpx;
  box-sizing: border-box;
  height: 60rpx;
  line-height: 60rpx;
  display: block;
}

.button button {
  padding: 0 20rpx;
  height: 60rpx;
  border: none;
  line-height: 60rpx;
  display: block;
  text-align: right;
  font-size: 22rpx;
  color: #fff;
}


.history_title text {
  font-size: 28rpx;
  font-weight: 600;
}


::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}


/* swiper处理 */

.swiper {
  width: 100%;
  /* height: 100vh; */
  height: calc(100vh - 248rpx);
  /* height: calc(100vh - 168.5rpx); */
  padding: 0;
}

swiper-item {
  /* line-height: 350px; *//* overflow: scroll; */
  overflow: auto;
}

swiper-item::-webkit-scrollbar {
  display: none;
}


.songArray_content .content_3 {
  font-size: 24rpx;
  color: rgb(190, 189, 189);
  margin-top: 10rpx;
  /* 超过省略号 */
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}


.relatedAllvideo_img image {
  width: 280rpx;
  height: 160rpx;
  border-radius: 5%;
}


.touxiang image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
}

.mingzi text {
  font-size: 30rpx;
}


.album_pic image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 10rpx;
}


.album_name text {
  font-size: 35rpx;
  /* line-height: 60rpx; */
}


.album_artists text {
  font-size: 28rpx;
}


.playlists_pic image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 10rpx;
}

.playlists_name text {
  font-size: 30rpx;
}


.playlists_artists text {
  font-size: 28rpx;
  color: #b3adad;
}

/* 电台 */

.djRadios_wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 20rpx;
  margin-left: 40rpx;
}

.djRadios_pic image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 10rpx;
}

.djRadios_name text {
  font-size: 30rpx;
}

.djRadios_artists text {
  font-size: 28rpx;
  color: #b3adad;
}

.userprofiles_touxiang image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
}

.userprofiles_follow text {
  font-size: 30rpx;
  color: red;
}


.nav-wrap {
  position: fixed;
  width: 100%;
  top: 0;
  background: #fff;
  color: #000;
  z-index: 9999999;
}

.cell-content {
  position: absolute;
  left: 146rpx;
  width: calc(100% - 96rpx - 60rpx - 120rpx - 20rpx);
  line-height: 1.6em;
}
</style>
