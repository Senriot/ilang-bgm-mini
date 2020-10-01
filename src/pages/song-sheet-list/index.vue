<template>
  <van-tabs v-if="catlist"
            :active="active"
            id="tabs"
            animated
            @change="tabChanged"
            sticky
            swipeable>
    <van-tab :title="item.name" :key="index" v-for="(item,index) in catlist">
      <view class="cu-list grid" :class="['col-3','no-border']">
        <view class="cu-item" v-for="(item1,index1) in item.data.playlists" :key="index1">
          <song-grid :src="`${item1.coverImgUrl}?param=200y200`" :title="item1.name"/>
        </view>
      </view>
      <van-cell>
        <u-loadmore :status="item.status"/>
      </van-cell>
    </van-tab>
  </van-tabs>
</template>

<script lang="ts">
import Vue          from 'vue';
import musicRequest from "@/common/music.api";
import SongGrid     from "@/components/song-grid.vue";

export default Vue.extend({
  components: {SongGrid},
  data()
  {
    return {
      catlist: null,
      active : 0,
      status: 'loadmore',
    }
  },
  onLoad()
  {
    this.getCatlist()
  },
  onReachBottom()
  {
    console.log("加载更多")
    const item:any = this.catlist![this.active];
    if (item.data.more)
    {
      this.getPlaylist(this.active)
    }
  },
  methods   : {
    tabChanged(e: any)
    {
      console.log("tab改变", e);
      this.active = e.detail.index;
      const item:any = this.catlist![this.active];
      if (item.page == 0)
      {
        this.getPlaylist(this.active)
      }
    },
    getCatlist()
    {
      musicRequest.get("/playlist/hot").then((value: any) =>
      {

        if (value.code == 200)
        {

          const tags = value.tags

          for (let i = 0; i < tags.length; i++)
          {
            tags[i] = {
              page   : 0,
              loading: true,
              ...tags[i],
              status : 'loadmore',
              data   : {
                playlists: [],
                total    : 0,
                code     : 0,
                more     : true,
              }
            }

          }
          this.catlist = tags
          this.getPlaylist(0)
        }
      })
    },
    getPlaylist(_index: number)
    {
      const list = this.catlist!;
      const item: any = list[_index];
      const cat = item.name;
      const offset: number = item.page * 30;
      item.loading = true;
      item.status = 'loading'
      musicRequest.get(`/top/playlist?limit=30&cat=${cat}&offset=${offset}`).then((value: any) =>
      {
        console.log(value)
        item.status = 'loadmore'
        if (value.code == 200)
        {
          if (item.page == 0)
          {
            item.data = value;
          }
          else
          {
            item.data.playlists = item.data.playlists.concat(value.playlists)
          }
          item.page += 1;
          console.log(item.data.playlists.length);
          if (!value.more)
          {
            item.status = "nomore"
          }
          this.catlist = list
        }
      })
    },
  }
})
</script>

<style scoped>
.grid-item {
  padding: 0;
}
</style>
