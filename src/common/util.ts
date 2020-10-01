export const formatTime = (date: Date) =>
{
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return (
        [year, month, day].map(formatNumber).join('/') +
        ' ' +
        [hour, minute, second].map(formatNumber).join(':')
    )
};

const formatNumber = (n: number) =>
{
    const s = n.toString();
    return s[1] ? s : '0' + s
};

export const formatTimeCommit = (date: number, type: number) =>
{
    type = type || 1;
    //type 1,完成输出年月日时分秒，2对比当前时间输出日期，或时分;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hour = d.getHours();
    const minute = d.getMinutes();
    const second = d.getSeconds();
    if (type == 1)
    {
        return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
    }
    else if (type == 3)
    {
        return [year, month, day].map(formatNumber).join('-');
    }
    else
    {
        const jm = new Date,
            Fo = jm.getTime() - date;
        if (Fo <= 6e4)
            return "刚刚";
        let Qq = jm.getHours() * 36e5 + jm.getMinutes() * 6e4 + jm.getSeconds() * 1e3;
        if (day == jm.getDate())
        {
            if (Fo < 36e5)
            {
                const bOh = Math.floor(Fo / 6e4);
                return bOh + "分钟前"
            }
            return [hour, minute].map(formatNumber).join(':');
        }
        else
        {
            if (Fo < Qq + 864e5)
            {
                return "昨天" + [hour, minute].map(formatNumber).join(':');
            }
            else
            {
                const hq = jm.getFullYear(),
                    bOg = new Date(hq, 0, 1);
                Qq = jm.getTime() - bOg.getTime();
                if (Fo < Qq)
                {
                    return year + "年" + month + "月" + day + "日" + [hour, minute].map(formatNumber).join(':');
                }
                return year + "年" + month + "月" + day + "日"
            }
        }
    }
};
