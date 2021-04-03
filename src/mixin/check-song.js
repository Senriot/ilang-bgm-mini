import musicRequest from "@/common/music.api";

export const checkSong = {
    data() {
        return {
            multipleChoice: false,
            checkedAll: false
        }
    },
    methods: {
        checkboxChange(e) {
            console.log(e)
        },
        async songSelected(s) {
            console.log("选中歌曲", s)
            if (this.multipleChoice) {
                s.checked = !s.checked
            } else {
                const sd = await musicRequest.get(`/song/detail?ids=${s.id}`)
                musicRequest.get("/check/music", {id: s.id}).then(res => {
                    if (res.success) {
                        this.songSheetProp.isShow = true
                        this.songSheetProp.item = sd.songs[0]
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
}