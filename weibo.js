// ==UserScript==
// @name         微博热搜与广告过滤器
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  过滤微博热搜中包含名字和广告的条目
// @author       Grok
// @match        https://s.weibo.com/top/summary?cate=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 定义明星名字列表（可根据需要扩展）
    const celebrityNames = [
        "王楚钦",
        "杨幂",
        "任嘉伦",
        "汤唯",
        "姚晨",
        "张大仙",
        "孙艺洲",
        "田曦薇",
        "龚俊",
        "迪丽热巴",
        "马伊琍",
        "可云",
        "崔丽丽",
        "赵丽颖",
        "迪丽热巴",
        "杨幂",
        "肖战",
        "王一博",
        "李现",
        "杨紫",
        "刘亦菲",
        "王俊凯",
        "易烊千玺",
        "刘萧旭",
        "祝绪丹",
        "姜丹尼尔",
        "卢靖姗",
        "陈乔恩",
        "陈数",
        "李一桐",
        "乔杉",
        "全智贤",
        "内娱",
        "何猷启",
        "马嘉祺",
        "刘诗诗",
        "周峻纬",
        "鞠婧祎",
        "严浩翔",
        "王源",
        "张子枫",
        "彭昱畅",
        "刘耀文",
        "雷佳音",
        "乔欣",
        "时代少年团",
        "杨洋",
        "贺峻霖",
        "张柏芝",
        "林峯",
        "李沉舟",
        "沈腾",
        "邓超",
        "李乃文",
        "吴磊",
        "宋轶",
        "王嘉尔",
        "彩英",
        "孙艺珍",
        "华晨宇",
        "欧豪",
        "刘宇宁",
        "关晓彤",
        "马思纯",
        "张晚意",
        "唐嫣",
        "潘玮柏",
        "王传君",
        "胡杏儿",
        "昆凌",
        "展轩",
        "桃黑黑",
        "小黄豆",
        "成毅",
        "宋浩然",
        "安以轩",
        "陈哲远",
        "张杰",
        "谢娜",
        "辛芷蕾",
        "刘芮麟",
        "张若昀",
        "张维伊",
        "周洁琼",
        "黄子弘凡",
        "白举纲",
        "欧阳娜娜",
        "梓渝",
        "李诞",
        "李秀满",
        "克劳迪娅卡汀娜",
        "刘昊然",
        "李兰迪",
        "任豪",
        "孙红雷",
        "宋威龙",
        "邓为"
    ];

    // 创建正则表达式，匹配包含明星名字的文本
    const regex = new RegExp(celebrityNames.join('|'), 'i');

    // 过滤热搜列表的函数
    function filterHotSearch() {
        // 选择热搜列表的 DOM 元素
        const hotSearchItems = document.querySelectorAll('#pl_top_realtimehot tr');

        hotSearchItems.forEach(item => {
            // 获取热搜标题的元素
            const titleElement = item.querySelector('td.td-02 a');
            // 检查是否为广告条目
            const isAd = item.querySelector('a[action-type="realtimehot_ad"]') !== null;

            if (titleElement) {
                const titleText = titleElement.textContent.trim();
                // 隐藏包含明星名字或广告的条目
                if (regex.test(titleText) || isAd) {
                    item.style.display = 'none';
                }
            }
        });
    }

    // 页面加载时执行过滤
    window.addEventListener('load', filterHotSearch);

    // 监听动态加载内容（微博可能通过 AJAX 加载）
    const observer = new MutationObserver(filterHotSearch);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
