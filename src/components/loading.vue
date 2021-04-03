<template>
    <view class = "cntloading">
        {{text}}
        <view>
            <text class = "cl1"/>
            <text class = "cl2"/>
            <text class = "cl3"/>
        </view>
    </view>
</template>

<script>
    export default {
        name: "loading",
        props: {
            text: {
                type: String,
                default: '加载中...'
            }
        }
    }
</script>

<style scoped>
    @keyframes cnloading
    {
        0%
        {
            transform: translateY(0upx)
        }
        50%
        {
            transform: translateY(20upx)
        }
        100%
        {
            transform: translateY(0upx)
        }
    }

    .cntloading
    {
        padding:    30upx 0;
        text-align: center;
        color:      #888;
        font-size:  26upx;
    }

    .cntloading view
    {
        display:        inline-block;
        vertical-align: baseline;
        height:         30upx;
        overflow:       hidden;
        margin-left:    10upx;
    }

    .cntloading text
    {
        width:            5upx;
        height:           30upx;
        /* background-color: #d33a31; */
        background-color: #3c9;
        position:         relative;
        display:          inline-block;
        margin-right:     6upx;
        border-radius:    3upx;
        animation:        cnloading .9s linear infinite;
        transform-origin: center bottom;
    }

    .cntloading .cl2
    {
        animation-delay: -.6s
    }

    .cntloading .cl3
    {
        animation-delay: -.3s
    }
</style>
