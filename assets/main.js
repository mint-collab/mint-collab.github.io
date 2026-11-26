/* 站点交互：问候语、实时时间、运行时长、一言与标题彩蛋 */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var START_DATE = '2021-05-06';
  var WEEKDAYS = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  var fallbackTitle = document.title;

  /* ---------------- 问候语与运行时长 ---------------- */

  function greetingText() {
    var now = new Date();
    var h = now.getHours();
    var hello;
    if (h < 5) hello = '夜深了';
    else if (h <= 10) hello = '早上好';
    else if (h <= 13) hello = '中午好';
    else if (h <= 18) hello = '下午好';
    else hello = '晚上好';
    return hello + ' ~ 今天是' + WEEKDAYS[now.getDay()];
  }

  function tickClock() {
    var greet = $('#time');
    if (greet) greet.textContent = greetingText();

    var runtime = $('#runtime');
    if (!runtime) return;
    var start = new Date(START_DATE + 'T00:00:00');
    var diff = Math.max(0, Date.now() - start.getTime());
    var days = Math.floor(diff / 86400000);
    var hours = Math.floor(diff / 3600000) % 24;
    var mins = Math.floor(diff / 60000) % 60;
    var secs = Math.floor(diff / 1000) % 60;
    runtime.textContent = '本站已运行: ' + days + '天' + hours + '小时' + mins + '分' + secs + '秒';
  }

  /* ---------------- 一言 ---------------- */

  var LOCAL_QUOTES = [
    '纸上得来终觉浅，绝知此事要躬行。',
    '生活不是我们活过的日子，而是我们记住的日子。',
    '慢慢来，比较快。',
    '把每一件小事做完，就是最好的天赋。'
  ];

  function initHitokoto() {
    var link = $('#hitokoto_text');
    if (!link) return;

    function useLocal(text) {
      link.textContent = '“' + text + '”';
      link.removeAttribute('href');
      link.removeAttribute('target');
    }

    if (!window.fetch) {
      useLocal(LOCAL_QUOTES[Math.floor(Math.random() * LOCAL_QUOTES.length)]);
      return;
    }

    fetch('https://v1.hitokoto.cn/?c=i&c=k&c=d')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data || !data.hitokoto) throw new Error('empty');
        link.textContent = '“' + data.hitokoto + '”';
        link.href = 'https://hitokoto.cn/?uuid=' + data.uuid;
        link.target = '_blank';
        link.rel = 'noopener';
      })
      .catch(function () {
        useLocal(LOCAL_QUOTES[Math.floor(Math.random() * LOCAL_QUOTES.length)]);
      });
  }

  /* ---------------- 细节彩蛋 ---------------- */

  function initTitleEgg() {
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        document.title = '林中笔记|不要走嘛(*´д`*)';
        return;
      }
      document.title = '林中笔记|欢迎回来(づ￣3￣)づ';
      setTimeout(function () { document.title = fallbackTitle; }, 2000);
    });
  }

  function consoleWelcome() {
    console.log('%c林中笔记', 'font-size:16px;font-weight:bold;color:#3e9afc');
    console.log('欢迎来访，这里写代码，也写代码之外的事。');
  }

  /* ---------------- 启动 ---------------- */

  document.addEventListener('DOMContentLoaded', function () {
    tickClock();
    setInterval(tickClock, 1000);
    initHitokoto();
    initTitleEgg();
    consoleWelcome();

    $$('.copy-year').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  });
})();
