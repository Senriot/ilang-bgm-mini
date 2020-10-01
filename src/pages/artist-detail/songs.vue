<template>
  <view>
    <u-sticky>
      <view class="cu-bar bg-white" v-if="!loading">
        <view class="action">
          <text class="text-xxl cuIcon-video text-red"/>
          播放全部
        </view>
        <view class="action text-black text-sm" slot="right">
          <view class="cuIcon-settings margin-right-xs"></view>
          管理
        </view>
      </view>
    </u-sticky>
    <van-cell-group>
      <van-cell :title="item.name"
                title-class="text-df"
                center
                clickable
                :label="item.al.name"
                v-for="(item,index) in songs"
                :key="index">
        <text slot="icon" class="cu-avatar radius text-grey bg-white sm avatar-text margin-right">{{ index + 1}}
        </text>
        <text class="cuIcon-moreandroid lg text-gray" slot="right-icon"/>
      </van-cell>
      <van-cell>
        <u-loadmore :status="status"/>
      </van-cell>
    </van-cell-group>
  </view>
</template>

<script>
import {mapState} from "vuex";
import musicRequest from "@/common/music.api";

export default {
  data() {
    return {
      more: true,
      songs: [],
      status: 'loadmore'
    }
  },
  computed: {
    ...mapState(["currentArtist"])
  },
  onReachBottom() {
    console.log("加载更多")
    if (this.more) {
      this.getSongs()
    }
  },
  onLoad() {
    this.getSongs()
  },
  mounted() {
  },
  methods: {
    getSongs() {
      this.status = "loading"
      const offset = this.songs.length
      musicRequest.get(`/artist/songs?id=${this.currentArtist.id}&offset=${offset}`).then(value => {
        console.log("获取全部歌曲", value)
        this.more = value.more;
        this.songs = this.songs.concat(value.songs)
        this.status = "loadmore"
        if (!value.more) {
          this.status = "nomore"
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
