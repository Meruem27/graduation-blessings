/* ============================================
   详情页通用逻辑 - detail.js
   功能：拆信动画、读取 JSON 数据、渲染祝福、淡入动画
   ============================================ */

(function () {
  'use strict';

  /* ---------- 读取页面中的祝福数据 ---------- */

  // 获取隐藏的 JSON 数据标签
  const dataEl = document.getElementById('blessing-data');
  if (!dataEl) {
    console.error('未找到 #blessing-data 标签，无法加载祝福数据');
    return;
  }

  // 解析 JSON 数据
  let blessingData;
  try {
    blessingData = JSON.parse(dataEl.textContent);
  } catch (e) {
    console.error('祝福数据 JSON 解析失败：', e);
    return;
  }

  /* ---------- 拆信动画流程 ---------- */

  const envelope = document.querySelector('.detail-envelope');
  const letterPaper = document.querySelector('.letter-paper');
  const blessingList = document.getElementById('blessing-list');

  // 页面加载后延迟触发拆信动画
  const OPEN_DELAY = 800; // 拆信前等待时间（ms）

  setTimeout(function () {
    // 第一步：信封盖打开
    if (envelope) {
      envelope.classList.add('open');
    }

    // 第二步：信封盖打开后，信纸抽出
    const LETTER_APPEAR_DELAY = 1200; // 信纸出现延迟（ms）
    setTimeout(function () {
      if (letterPaper) {
        letterPaper.classList.add('visible');
      }

      // 第三步：信纸出现后，渲染祝福内容并逐条淡入
      const FADE_START_DELAY = 600; // 祝福淡入起始延迟（ms）
      setTimeout(function () {
        renderBlessings(blessingData);
      }, FADE_START_DELAY);

    }, LETTER_APPEAR_DELAY);

  }, OPEN_DELAY);

  /* ---------- 渲染祝福内容 ---------- */

  /**
   * 将祝福数据渲染到信纸中
   * @param {Object} data - 祝福数据对象，包含 name 和 blessings 数组
   */
  function renderBlessings(data) {
    if (!blessingList) {
      console.error('未找到 #blessing-list 容器');
      return;
    }

    // 清空现有内容
    blessingList.innerHTML = '';

    // 遍历祝福数组，创建 DOM 节点
    const blessings = data.blessings || [];
    blessings.forEach(function (item, index) {
      // 创建祝福条目容器
      const div = document.createElement('div');
      div.className = 'blessing-item';

      // 祝福者名字
      const fromEl = document.createElement('div');
      fromEl.className = 'blessing-from';
      fromEl.textContent = '来自 ' + item.from;

      // 祝福内容
      const textEl = document.createElement('div');
      textEl.className = 'blessing-text';
      textEl.textContent = item.text;

      div.appendChild(fromEl);
      div.appendChild(textEl);
      blessingList.appendChild(div);

      // 逐条淡入：每条间隔 400ms
      setTimeout(function () {
        div.classList.add('fade-in');
      }, index * 400);
    });
  }

})();
