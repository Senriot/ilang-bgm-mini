<template>
  <view>
    <view class="main">
      <!-- 官方榜 -->
      <view class="officialList ">
        <view class="cu-bar bg-white solid-bottom">
          <view class="action">
            <text class="cuIcon-titles text-blue"/>
            官方榜
          </view>
        </view>
        <view :data-id="item.id"
              :data-name="item.name"
              :key="index" @tap="openRankingList(item.id)"
              class="officialList_wrap"
              v-for="(item,index) in  officialList">
          <view class="officialList_img">
            <image :src="item.coverImgUrl" mode="widthFix"/>
            <view class="officialList_info">
              <view class="officialList_wrap">
                <text>{{item.updateFrequency}}</text>
              </view>
            </view>
          </view>
          <view class="officialList_desc">
            <view :key="index2"
                  v-for="(item2,index2) in item.tracks">
              <text>{{index2 + 1}}.{{item2.first}}-{{item2.second}}</text>
            </view>
          </view>
        </view>
      </view>
      <!-- 推荐榜 -->
      <view class="officialList">
        <view class="cu-bar bg-white solid-bottom margin-top">
          <view class="action">
            <text class="cuIcon-titles text-blue"/>
            推荐榜
          </view>
        </view>
        <view class="recommendationList_wrap">
          <view :data-id="item.id"
                :data-name="item.name"
                :key="index"
                @tap="openRankingList(item.id)" class="recommendationList_item"
                v-for="(item,index) in recommendationList">
            <view class="recommendationList_img">
              <image :src="item.coverImgUrl" mode="widthFix"/>
              <view class="recommendationList_info">
                <!-- 播放量 -->
                <view>
                  <text>{{item.updateFrequency}}</text>
                </view>
              </view>
            </view>
            <!-- 标题 -->
            <view class="recommendationList_titles">{{item.name}}</view>
          </view>
        </view>
      </view>
      <!-- 全球榜 -->
      <view class="officialList">
        <view class="cu-bar bg-white solid-bottom margin-top">
          <view class="action">
            <text class="cuIcon-titles text-blue"/>
            全球榜
          </view>
        </view>
        <view class="recommendationList_wrap">
          <view :data-id="item.id"
                :data-name="item.name"
                :key="index" @tap="openRankingList(item.id)"
                class="recommendationList_item"
                v-for="(item,index) in globalList">
            <view class="recommendationList_img">
              <image :src="item.coverImgUrl" mode="widthFix"/>
              <view class="recommendationList_info">
                <!-- 播放量 -->
                <view>
                  <text>{{item.updateFrequency}}</text>
                </view>
              </view>
            </view>
            <!-- 标题 -->
            <view class="recommendationList_titles">{{item.name}}</view>
          </view>
        </view>
      </view>
      <!-- 更多榜单 -->
      <view class="officialList">
        <view class="cu-bar bg-white solid-bottom margin-top">
          <view class="action">
            <text class="cuIcon-titles text-blue"/>
            更多榜单
          </view>
        </view>
        <view class="recommendationList_wrap">
          <view :data-id="item.id"
                :data-name="item.name"
                :key="index"
                @tap="openRankingList(item.id)"
                class="recommendationList_item"
                v-for="(item,index) in moreList">
            <view class="recommendationList_img">
              <image :src="item.coverImgUrl" mode="widthFix"/>
              <view class="recommendationList_info">
                <!-- 播放量 -->
                <view>
                  <text>{{item.updateFrequency}}</text>
                </view>
              </view>
            </view>
            <!-- 标题 -->
            <view class="recommendationList_titles">{{item.name}}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import musicRequest from "@/common/music.api";

export default {
  data() {
    return {
      loading: true,
      // 官方榜
      officialList: [],
      // 推荐榜
      recommendationList: [],
      // 全球榜
      globalList: [],
      // 更多榜单
      moreList: [],
    }
  },
  onLoad() {
    this.getToplistDetail()
  },
  methods: {
    openRankingList(e) {
      console.log(e)
      uni.navigateTo({
        url: '../song-sheet/index?id=' + e + "&type=1",
      })
    },
    getToplistDetail() {
      musicRequest.get("/toplist/detail").then(value => {
        if (value.code == 200) {
          const list = value.list;
          const officialList = [];
          const recommendationList = [];
          const globalList = [];
          const moreList = [];
          for (const index in list) {
            const name = list[index].name;
            if (name == "云音乐飙升榜" || name == "云音乐新歌榜" || name == "网易原创歌曲榜" || name == "云音乐热歌榜") {
              officialList.push(list[index])
            } else if (name == "江小白YOLO云音乐说唱榜" || name == "说唱TOP榜" || name == "云音乐电音榜" || name == "云音乐ACG音乐榜" || name == "云音乐欧美新歌榜" || name == "抖音排行榜") {
              recommendationList.push(list[index])
            } else if (name == "美国Billboard周榜" || name == "UK排行榜周榜" || name == "Beatport全球电子舞曲榜" || name == "日本Oricon周榜" || name == "iTunes榜" || name == "香港电台中文歌曲龙虎榜") {
              globalList.push(list[index])
            } else {
              moreList.push(list[index])
            }
          }
          this.officialList = officialList;
          this.recommendationList = recommendationList;
          this.globalList = globalList;
          this.moreList = moreList;
          this.loading = false
          // this.setData({
          // 	officialList,
          // 	recommendationList,
          // 	globalList,
          // 	moreList,
          // 	loading: false,
          // })
        }
      })
    }
  }
}
</script>

<style scoped>
@import "_index.scss";
</style>
