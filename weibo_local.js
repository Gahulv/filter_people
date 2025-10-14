// ==UserScript==
// @name         微博热搜明星与广告过滤器
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  过滤微博热搜中包含明星名字和广告的条目，从远程JSON读取名单
// @author       Grok
// @match        https://s.weibo.com/top/summary?cate=*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // 默认名人列表
    let celebrityNames = [
        "王楚钦", "杨幂", "任嘉伦", "汤唯", "姚晨"
    ];

    // 从远程JSON加载名单
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://raw.githubusercontent.com/yourusername/your-repo/main/filter.json', // 替换为您的 raw URL
        onload: function(response) {
            try {
                const data = JSON.parse(response.responseText);
                console.log('JSON 数据:', data); // 调试：输出原始 JSON
                celebrityNames = [...new Set(data.blockList || [])]; // 使用 blockList 字段
                console.log('名人列表:', celebrityNames); // 调试：输出处理后的列表
                if (!celebrityNames.length) {
                    console.warn('名人列表为空，使用默认名单');
                }
                // 更新正则表达式
                regex = new RegExp(celebrityNames.map(name => name.replace(/\s+/g, '')).join('|'), 'i');
                // 重新执行过滤
                filterHotSearch();
            } catch (e) {
                console.error('加载名人列表失败:', e);
            }
        },
        onerror: function() {
            console.error('无法获取JSON文件，使用默认名单');
        }
    });

    // 创建正则表达式（初始使用默认名单）
    let regex = new RegExp(celebrityNames.map(name => name.replace(/\s+/g, '')).join('|'), 'i');

    // 添加CSS样式
    GM_addStyle(`
        .filtered-out {
            display: none !important;
        }
    `);

    // 过滤热搜列表
    function filterHotSearch() {
        const hotSearchItems = document.querySelectorAll('#pl_top_realtimehot tr');
        if (!hotSearchItems.length) {
            console.warn('未找到热搜列表元素'); // 调试
            return;
        }

        hotSearchItems.forEach(item => {
            const titleElement = item.querySelector('td.td-02 a');
            const isAd = item.querySelector('a[action-type="realtimehot_ad"], .ad-icon') !== null;

            if (titleElement) {
                const titleText = titleElement.textContent.trim().replace(/\s+/g, '');
                const isCelebrity = regex.test(titleText);
                console.log(`标题: ${titleText}, 是否名人: ${isCelebrity}, 是否广告: ${isAd}`); // 调试
                if (isCelebrity || isAd) {
                    item.classList.add('filtered-out');
                } else {
                    item.classList.remove('filtered-out'); // 确保不过滤非匹配项
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
    } else {
        console.warn('未找到 #pl_top_realtimehot 元素'); // 调试
    }
})();