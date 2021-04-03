<template>
  <view>
    <song-list :list="songs" @complete="showChannelsDialog">
      <view slot="title" class="action">
        <text class="text-xxl cuIcon-video text-red"/>
        播放全部
      </view>
    </song-list>
    <van-cell>
      <u-loadmore :status="status"/>
    </van-cell>
    <channel-selector :show="showChannels" @change="showChannels = $event" :songs="selectSongs"/>
  </view>
</template>

<script>
import {mapState}      from "vuex";
import musicRequest    from "@/common/music.api";
import SongList        from "@/components/song-list";
import ChannelSelector from "@/components/channel-selector";

export default {
  components: {ChannelSelector, SongList},
  data()
  {
    return {
      more        : true,
      songs       : [],
      status      : 'loadmore',
      selectSongs : [],
      showChannels: false
    }
  },
  computed  : {
    ...mapState(["currentArtist"])
  },
  onReachBottom()
  {
    console.log("加载更多")
    if (this.more)
    {
      this.getSongs()
    }
  },
  onLoad()
  {
    this.getSongs()
  },
  mounted()
  {
  },
  methods   : {
    getSongs()
    {
      this.status = "loading"
      const offset = this.songs.length
      musicRequest.get(`/artist/songs?id=${this.currentArtist.id}&offset=${offset}`).then(value =>
      {
        console.log("获取全部歌曲", value)
        this.more = value.more;
        value.songs.forEach(item =>
        {
          item.checked = false
        })
        this.songs = this.songs.concat(value.songs)
        this.status = "loadmore"
        if (!value.more)
        {
          this.status = "nomore"
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

</style>
