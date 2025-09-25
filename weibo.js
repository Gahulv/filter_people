// ==UserScript==
// @name         微博热搜明星与广告过滤器
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  过滤微博热搜中包含明星名字和广告的条目
// @author       Grok
// @match        https://s.weibo.com/top/summary?cate=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 去重的明星名字列表
    const celebrityNames = [...new Set([
        "王楚钦", "杨幂", "任嘉伦", "汤唯", "姚晨", "张大仙", "孙艺洲", "田曦薇", "龚俊",
        "迪丽热巴", "马伊琍", "可云", "崔丽丽", "赵丽颖", "肖战", "王一博", "李现",
        "杨紫", "刘亦菲", "王俊凯", "易烊千玺", "刘萧旭", "祝绪丹", "姜丹尼尔", "卢靖姗",
        "陈乔恩", "陈数", "李一桐", "乔杉", "全智贤", "内娱", "何猷启", "马嘉祺", "刘诗诗",
        "周峻纬", "鞠婧祎", "严浩翔", "王源", "张子枫", "彭昱畅", "刘耀文", "雷佳音", "乔欣",
        "时代少年团", "杨洋", "贺峻霖", "张柏芝", "林峯", "李沉舟", "沈腾", "邓超", "李乃文",
        "吴磊", "宋轶", "王嘉尔", "彩英", "孙艺珍", "华晨宇", "欧豪", "刘宇宁","伊能静"
    ])];

    // 创建正则表达式
    const regex = new RegExp(celebrityNames.map(name => name.replace(/\s+/g, '')).join('|'), 'i');

    // 过滤热搜列表
    function filterHotSearch() {
        const hotSearchItems = document.querySelectorAll('#pl_top_realtimehot tr');
        if (!hotSearchItems.length) return;

        hotSearchItems.forEach(item => {
            const titleElement = item.querySelector('td.td-02 a, a[href*="/weibo?q="]');
            const isAd = item.querySelector('a[action-type="realtimehot_ad"], .ad-icon, [class*="ad"]') !== null;

            if (titleElement) {
                const titleText = titleElement.textContent.trim().replace(/\s+/g, '');
                if (regex.test(titleText) || isAd) {
                    item.style.display = 'none';
                }
            }
        });
    }

    // 防抖函数
    let debounceTimer;
    function debounceFilter() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(filterHotSearch, 100);
    }

    // 页面加载时执行
    window.addEventListener('load', debounceFilter);

    // 监听动态加载
    const targetNode = document.querySelector('#pl_top_realtimehot');
    if (targetNode) {
        const observer = new MutationObserver(debounceFilter);
        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    }
})();