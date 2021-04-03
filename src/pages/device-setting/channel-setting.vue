<template>
  <view class="padding-left padding-right bg-white">
    <u-form :model="ch" ref="uForm">
      <u-form-item label="启用">
        <u-switch slot="right" v-model="ch.enabled"></u-switch>
      </u-form-item>
      <u-form-item label="位置">
        <u-input type="select"
                 :select-open="actionSheetShow"
                 v-model="ch.name"
                 placeholder="请选择通道位置"
                 @click="actionSheetShow = true"></u-input>
      </u-form-item>
    </u-form>
    <!--    <u-action-sheet :list="actionSheetList" v-model="actionSheetShow" @click="actionSheetCallback"></u-action-sheet>-->
    <van-popup :show="actionSheetShow" position="bottom" custom-style="height: 40%" @close="actionSheetShow = false">
      <van-picker
          show-toolbar
          title="标题"
          :columns="columns"
          @cancel="actionSheetShow = false"
          @confirm="actionSheetCallback"
      />
    </van-popup>
  </view>
</template>

<script>
import {mapState} from "vuex";

export default {
  data() {
    return {
      ch: {},
      actionSheetShow: false,
      columns: ['客厅', '卧室', '主卧', "次卧", '书房', '餐厅', '厨房', '门口', "洗手间", "浴室"],
      // actionSheetList: [{text: '客厅'}, {text: '卧室'}, {text: '主卧'}, {text: "次卧"}, {text: '书房'}, {text: '餐厅'}, {text: '厨房'}, {text: '门口'}, {text: "洗手间"}, {text: "浴室"}]
    }
  },
  computed: {
    ...mapState(["currentDevice"])
  },
  methods: {
    onChange(e) {
      console.log(e)
    },
    actionSheetCallback(e) {
      console.log(e)
      const {value} = e.detail
      this.ch.name = value
      this.actionSheetShow = false
    }
  },
  onLoad(query) {
    this.ch = this.currentDevice.channelList[Number.parseInt(query.ch)]
  }
}
</script>

<style scoped>
</style>
