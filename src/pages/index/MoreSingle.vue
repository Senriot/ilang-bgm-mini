<template>
  <view>


    <van-tabs :color="'#5578eb'" :active="currentTab" @change="swiperChange" sticky>
      <van-tab title="单曲">
        <!--      <van-cell-group>-->
        <!--        <van-cell :title="item.name"-->
        <!--                  title-class="text-df"-->
        <!--                  center-->
        <!--                  clickable-->
        <!--                  :label="item.artists[0].name+'-'+item.album.name"-->
        <!--                  v-for="(item,index) in songs.list"-->
        <!--                  @click="songSelected(item)"-->
        <!--                  :key="index">-->
        <!--          <text class="cuIcon-moreandroid lg text-gray" slot="right-icon"/>-->
        <!--        </van-cell>-->
        <!--        <van-cell>-->
        <!--          <u-loadmore :status="songs.status"/>-->
        <!--        </van-cell>-->
        <!--      </van-cell-group>-->
        <song-list :list="songs.list" @complete="showChannelsDialog">
          <view slot="title" class="action">
            <text class="text-xxl cuIcon-video text-red"/>
            播放全部
          </view>
        </song-list>
        <van-cell>
          <u-loadmore :status="songs.status"/>
        </van-cell>
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
    <channel-selector :show="showChannels" @change="showChannels = $event" :songs="selectSongs"/>
  </view>
</template>

<script>
import musicRequest       from "@/common/music.api";
import {formatTimeCommit} from "@/common/util";
import ChannelSelector    from "@/components/channel-selector";
import SongList           from "@/components/song-list";

export default {
  components: {SongList, ChannelSelector},
  data()
  {
    return {
      title       : "",
      currentTab  : -1,
      selectSongs : [],
      showChannels: false,
      songs       : {
        list  : [],
        count : -1,
        more  : true,
        status: 'loadmore'
      },
      artists     : {
        list  : [],
        count : -1,
        more  : true,
        status: 'loadmore'
      },
      albums      : {
        list  : [],
        count : -1,
        more  : true,
        status: 'loadmore'
      },
      playlists   : {
        list  : [],
        count : -1,
        more  : true,
        status: 'loadmore'
      },
    }
  },
  onLoad(query)
  {
    console.log(query)
    this.title = query.title
    const type = query.type
    switch (type)
    {
      case "song":
        this.loadMoreSingle()
        this.currentTab = 0;
        break;
      case "artist":
        this.loadArtists()
        this.currentTab = 1;
        break;
      case "album":
        this.loadAlbum()
        this.currentTab = 2;
        break;
      case "playlist":
        this.loadPlaylist()
        this.currentTab = 3;
        break;
    }
  },
  onReachBottom()
  {
    console.log("加载更多")
    this.loadMore(null)
  },
  methods   : {
    loadMoreSingle()
    {
      if (this.songs.more)
      {
        this.songs.status = "loading";
        const offset = this.songs.list.length
        musicRequest.get("/search", {
          keywords: this.title,
          type    : 1,
          offset  : offset,
        }).then((value) =>
        {
          console.log("搜索单曲", value)
          if (value.code == 200)
          {
            const songs = value.result.songs;
            songs.forEach(value =>
            {
              value.checked = false
            })
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
        this.artists.status = "loading";
        const offset = this.artists.list.length
        musicRequest.get("/search", {
          keywords: this.title,
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
      if (this.albums.more)
      {
        this.albums.status = "loading"
        const offset = this.albums.list.length
        musicRequest.get("/search", {
          keywords: this.title,
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
      if (this.playlists.more)
      {
        const offset = this.playlists.list.length
        musicRequest.get("/search", {
          keywords: this.title,
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
    swiperChange(e)
    {
      this.currentTab = e.detail.index
      switch (e.detail.index)
      {
        case 0:
          this.loadMoreSingle()
          break;
        case 1:
          this.loadArtists()
          break;
        case 2:
          this.loadAlbum()
          break;
        case 3:
          this.loadPlaylist()
          break;
      }
    },
    loadMore(e)
    {
      const cTab = this.currentTab;
      console.log("当前tar", cTab)
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
    showChannelsDialog(e)
    {
      if (e.length > 0)
        this.selectSongs = e
      this.showChannels = true;
    }
  }
}
</script>

<style scoped>

</style>
