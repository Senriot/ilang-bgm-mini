<template>

</template>

<script>
export default {
  onLoad() {
    wx.startWifi({
      success(res) {
        console.log(res)
        wx.getConnectedWifi({
          success(wifi) {
            console.log("wifi ",wifi)
          },
          fail(r) {
            console.log("err ",r)
          }
        })
      },
      fail(res) {
        console.log(res)
      }
    })
    // wx.onWifiConnected(c => {
    //   console.log('wifi', c)
    // })
  }
}
</script>

<style scoped>

</style>
