<template>
    <view>
        <view :style = "[{height:CustomBar + 'px'}]" class = "cu-custom">
            <view :class = "[bgImage!=''?'none-bg text-white bg-img':'',bgColor]"
                  :style = "style"
                  class = "cu-bar fixed">
                <view @tap = "BackPage" class = "action" v-if = "isBack">
					<text class = "cuIcon-back text-white"/>
					<slot name = "backText"/>
                </view>
                <view :style = "[{top:StatusBar + 'px'}]" class = "content text-white">
					<slot name = "content"/>
                </view>
				<slot name = "right"/>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                StatusBar: this.StatusBar,
                CustomBar: this.CustomBar
            };
        },
        name: 'cu-custom',
        computed: {
            style() {
                const StatusBar = this.StatusBar;
                const CustomBar = this.CustomBar;
                const bgImage = this.bgImage;
                let style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
                if (this.bgImage) {
                    style = `${style}background-image:url(${bgImage});`;
                }
                return style
            }
        },
        props: {
            bgColor: {
                type: String,
                default: ''
            },
            isBack: {
                type: [Boolean, String],
                default: false
            },
            bgImage: {
                type: String,
                default: ''
            },
        },
        methods: {
            BackPage() {
                uni.navigateBack({
                    delta: 1
                });
            }
        }
    }
</script>

<style>

</style>
