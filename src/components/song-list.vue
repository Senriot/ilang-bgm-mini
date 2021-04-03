<template>
  <view>
    <view class="cu-bar bg-white solid-bottom sticky-box" :style="{'top':offsetTop+'px'}">
      <!--      <view slot="title" class="action" v-if="!multipleChoice"></view>-->
      <slot name="title" class="action" v-if="!multipleChoice"></slot>
      <u-checkbox class="margin-left" v-if="multipleChoice" v-model="checkedAll" @change="allChange"> 全选</u-checkbox>
      <view v-if="!multipleChoice" class="action text-black text-sm" slot="right" @click="multipleChoice = true">
        <view class="cuIcon-list margin-right-xs"></view>
        多选
      </view>
      <view class="action" v-if="multipleChoice">
        <button class="cu-btn bg-red round shadow" @click="selectComplete">完 成</button>
      </view>
    </view>
    <van-cell-group>
      <van-cell :title="item.name"
                title-class="text-df"
                center
                clickable
                :label="item.al.name || item.album.name"
                v-for="(item,index) in realList"
                @click="songSelected(item)"
                :key="index">
        <text slot="icon"
              v-if="!multipleChoice"
              class="cu-avatar radius text-grey bg-white sm avatar-text margin-right">{{ index + 1}}
        </text>
        <u-checkbox slot="icon"
                    shape="circle"
                    v-if="multipleChoice"
                    v-model="item.checked "
                    :name="item.name">
        </u-checkbox>
        <text v-if="!multipleChoice" class="cuIcon-moreandroid lg text-gray" slot="right-icon"/>
      </van-cell>
    </van-cell-group>
  </view>
</template>

<script>
import musicRequest from "@/common/music.api";
import {mapState}   from "vuex";

export default {
  name    : 'song-list',
  data()
  {
    return {
      multipleChoice: false,
      checkedAll    : false,
      realList      : [],
      showDialog    : false
    }
  },
  watch   : {
    list: {
      deep: true,
      handler(val, oldVal)
      {
        this.realList = val
        console.log(val, oldVal);
      },
    }
  },
  computed: {
    ...mapState(["currentDevice", 'songSheetProp']),
    setRealList()
    {
      this.realList = this.list
    }
  },
  props   : {
    list     : {},
    offsetTop: {
      type   : Number,
      default: 0
    },
  },
  methods : {
    allChange(e)
    {
      this.realList.forEach(item =>
      {
        item.checked = e.value
      })
    },
    async songSelected(s)
    {
      console.log("选中歌曲", s)
      if (this.multipleChoice)
      {
        s.checked = !s.checked
      }
      else
      {
        const sd = await musicRequest.get(`/song/detail?ids=${s.id}`)
        musicRequest.get("/check/music", {id: s.id}).then(res =>
        {
          if (res.success)
          {
            this.songSheetProp.isShow = true
            this.songSheetProp.item = sd.songs[0]
          }
        }).catch(err =>
        {
          console.log(err)
        })
      }
    },
    selectComplete()
    {
      const songs = this.realList.filter(value => value.checked)
      console.log("选中歌曲", songs)
      if (songs.length > 0)
      {
        this.$emit("complete", songs)
        this.realList.forEach(item =>
        {
          item.checked = false
        })
      }
      this.multipleChoice = false
    }
  }
}
</script>

<style scoped>

</style>
