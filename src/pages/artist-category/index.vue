<template>
  <view>
    <van-sticky>
      <view style="width: 100%">
        <u-tabs
            name="cate_name"
            :list="areas"
            :is-scroll="false"
            :current="current"
            @change="change"></u-tabs>
        <view class="cu-bar bg-white">
          <u-subsection style="width: 100%;margin: 8rpx"
                        :list="types"
                        :current="areas[current].type"
                        @change="typeChanged"></u-subsection>
        </view>
      </view>
    </van-sticky>

    <view class="cu-list menu-avatar">
      <view :key="index"
            @tap="showArtistDetail(item)"
            class="cu-item"
            v-for="(item,index) in areas[current].artists">
        <image :src="`${item.picUrl}?param=100y100`" class="cu-avatar round lg"/>
        <view class="content">
          <view>{{item.name}}</view>
        </view>
      </view>
    </view>
    <van-cell>
      <u-loadmore :status="areas[current].status"/>
    </van-cell>


  </view>

</template>

<script>
import musicRequest from "@/common/music.api";
import {mapActions} from "vuex";

export default {
  data() {
    return {
      current: 0,
      types: [
        {
          name: '全部',
          id: -1
        },
        {
          name: '男',
          id: 1
        },
        {
          name: '女',
          id: 2
        },
        {
          name: '乐队/组合',
          id: 3
        }
      ],
      areas: [
        {
          cate_name: '全部',
          id: -1,
          type: 0,
          artists: [],
          more: true,
          status: 'loadmore',
        },
        {
          cate_name: '华语',
          id: 7,
          type: 0,
          more: true,
          artists: [],
          status: 'loadmore',
        },
        {
          cate_name: '欧美',
          id: 96,
          type: 0,
          more: true,
          artists: [],
          status: 'loadmore',
        }, {
          cate_name: '日本',
          id: 8,
          type: 0,
          more: true,
          artists: [],
          status: 'loadmore',
        },
        {
          cate_name: '韩国',
          id: 16,
          type: 0,
          more: true,
          artists: [],
          status: 'loadmore',
        },
        {
          cate_name: '其他',
          id: 0,
          type: 0,
          more: true,
          artists: [],
          status: 'loadmore',
        }
      ]
    }
  },
  onReachBottom() {
    console.log("加载更多")
    const area = this.areas[this.current]
    if (area.more) {
      this.getArtists()
    }
  },
  methods: {
    ...mapActions(["saveCurrentArtist"]),
    change(e) {
      console.log(e)
      this.current = e;
      if (this.areas[e].artists.length <= 0) {
        this.getArtists()
      }
    },
    typeChanged(e) {
      const area = this.areas[this.current]
      area.type = e;
      area.artists = []
      this.getArtists()
      console.log(e)
    },
    getArtists() {
      let area = this.areas[this.current];
      const offset = area.artists.length;
      area.status = "loading"
      musicRequest.get(`/artist/list?type=${this.types[area.type].id}&area=${area.id}&offset=${offset}`).then(value => {
        console.log(value)
        area.more = value.more;
        area.artists = area.artists.concat(value.artists)
        if (!value.more) {
          area.status = "nomore"
        }
        area.status = "loadmore"
      })
    },
    showArtistDetail(e) {
      console.log(e)
      this.saveCurrentArtist(e)
      uni.navigateTo({
        url: `../artist-detail/index`
      })
    }
  },
  onLoad() {
    this.getArtists()
  }
}
</script>

<style scoped>

</style>
