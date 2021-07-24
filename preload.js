const moment = require('./moment')

utools.onPluginReady(() => {
    console.log('插件装配完成，已准备好')
})


utools.onPluginEnter(({ code, type, payload }) => {
    console.log('用户进入插件', code, type, payload)
})


function parserTimestamp(inputTimestamp, callbackSetList) {
    let resultData = []

    console.log("input test", inputTimestamp);

    // var a = new Date(inputTimestamp * 1000);
    // let result = dateFormat("YY-mm-dd HH:MM:SS",a)
    // console.log(result);
    // 1627102189
    // 1627102258057
    // 1627102258.057
    // 2021-07-24 12:58:27
    // 2021-07-24 12:58:27.600

    let title = ""
    if (Number(inputTimestamp)) {
        // 如果全是数字，按 timestamp 解析
        console.log("is number")

        // 如果整数部分长度大于等于 10， 需要保留 10 位
        if (inputTimestamp / Math.pow(10, 10) > 0) {
            let ut = inputTimestamp / Math.pow(10, (inputTimestamp.length - 10))
            console.log(ut)
            let m = moment.unix(ut)
            if (m.isValid()) {
                title = m.format("YYYY-MM-DD HH:mm:ss.SS")
            } else {
                title = "invalid timestamp"
            }
        } else {
            let m = moment.unix(inputTimestamp)
            if (m.isValid()) {
                title = m.format("YYYY-MM-DD HH:mm:ss.SS")
            } else {
                title = "invalid timestamp"
            }
        }
    } else {
        // 如果含有其他字符，按日期来解析
        console.log("is not number")
        let m = moment(inputTimestamp)
        if (m.isValid()) {
            title = m.format("YYYY-MM-DD HH:mm:ss.SS")
        } else {
            title = "invalid date format"
        }
    }
    console.log("result data: ", title)

    resultData.push({
        title: title,
        description: "",
    })

    callbackSetList(resultData)
    return;
}

window.exports = {
    "ts": {
        mode: "list",
        args: {
            // 进入插件时调用（可选）
            enter: (action, callbackSetList) => {
                if (action.type === 'over' && action.payload) {
                    // 直接调用setSubInputValue不生效，特殊处理
                    setTimeout(function () {
                        window.utools.setSubInputValue(action.payload);
                    }, 50);
                }
                // parserTimestamp(null, callbackSetList)
            },
            // 子输入框内容变化时被调用 可选 (未设置则无搜索)
            search: (action, inputTimestamp, callbackSetList) => {
                parserTimestamp((inputTimestamp || ''), callbackSetList)
            },
            // 用户选择列表中某个条目时被调用
            select: (action, itemData, callbackSetList) => {
                console.log(action)
                console.log(itemData)

                // 复制内容到剪切板
                window.utools.copyText(itemData.title)

                window.utools.hideMainWindow()
                window.utools.outPlugin()
            },
            placeholder: "复制到剪切板"
        }
    }
}
