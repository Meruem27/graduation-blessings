/* ============================================
   首页交互逻辑 - main.js
   功能：花瓣飘落动画、信封卡片入场延迟
   ============================================ */

(function () {
  'use strict';

  /* ---------- 花瓣飘落动画（Canvas 实现） ---------- */

  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return; // 安全检查

  const ctx = canvas.getContext('2d');

  // 花瓣颜色池（樱花色系）
  const PETAL_COLORS = [
    'rgba(255, 183, 197, 0.8)',  // 淡粉
    'rgba(255, 192, 203, 0.7)',  // 粉红
    'rgba(255, 170, 190, 0.6)',  // 深粉
    'rgba(255, 210, 220, 0.75)', // 浅粉
    'rgba(248, 200, 220, 0.65)', // 玫瑰粉
    'rgba(255, 240, 245, 0.5)',  // 近白粉
  ];

  // 花瓣数量（根据屏幕宽度自适应）
  const PETAL_COUNT = window.innerWidth < 600 ? 25 : 45;

  // 花瓣数组
  let petals = [];

  /**
   * 单个花瓣对象
   * 包含位置、大小、速度、旋转等属性
   */
  function createPetal() {
    return {
      // 初始 x 随机分布在屏幕宽度
      x: Math.random() * canvas.width,
      // 初始 y 在屏幕上方随机位置（负值确保从上方飘入）
      y: Math.random() * -canvas.height,
      // 花瓣尺寸
      size: Math.random() * 8 + 5,
      // 下落速度
      speedY: Math.random() * 1.5 + 0.5,
      // 水平漂移速度
      speedX: Math.random() * 1 - 0.5,
      // 旋转角度
      rotation: Math.random() * Math.PI * 2,
      // 旋转速度
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      // 水平摆动振幅
      swingAmplitude: Math.random() * 40 + 20,
      // 水平摆动频率
      swingSpeed: Math.random() * 0.02 + 0.01,
      // 摆动相位偏移
      swingOffset: Math.random() * Math.PI * 2,
      // 颜色
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      // 透明度
      opacity: Math.random() * 0.5 + 0.3,
      // 时间计数器（用于摆动计算）
      time: Math.random() * 1000,
    };
  }

  /**
   * 初始化花瓣数组
   */
  function initPetals() {
    petals = [];
    for (let i = 0; i < PETAL_COUNT; i++) {
      const p = createPetal();
      // 让初始花瓣分散在整个屏幕，而非全部从顶部开始
      p.y = Math.random() * canvas.height;
      petals.push(p);
    }
  }

  /**
   * 绘制单个花瓣
   * 使用贝塞尔曲线绘制花瓣形状
   */
  function drawPetal(petal) {
    ctx.save();
    ctx.translate(petal.x, petal.y);
    ctx.rotate(petal.rotation);
    ctx.globalAlpha = petal.opacity;

    // 花瓣形状：两个贝塞尔曲线构成的椭圆花瓣
    const s = petal.size;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(s / 2, -s, s, -s / 2, 0, s);
    ctx.bezierCurveTo(-s, -s / 2, -s / 2, -s, 0, 0);
    ctx.fillStyle = petal.color;
    ctx.fill();

    ctx.restore();
  }

  /**
   * 更新花瓣位置
   */
  function updatePetal(petal) {
    petal.time += 1;
    // 垂直下落
    petal.y += petal.speedY;
    // 水平摆动 + 漂移
    petal.x += Math.sin(petal.time * petal.swingSpeed + petal.swingOffset) * 0.5 + petal.speedX;
    // 旋转
    petal.rotation += petal.rotationSpeed;

    // 超出屏幕底部则重置到顶部
    if (petal.y > canvas.height + 20) {
      petal.y = -20;
      petal.x = Math.random() * canvas.width;
    }
    // 超出屏幕左右边界则回绕
    if (petal.x > canvas.width + 20) petal.x = -20;
    if (petal.x < -20) petal.x = canvas.width + 20;
  }

  /**
   * 动画主循环
   */
  function animate() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新并绘制每个花瓣
    for (let i = 0; i < petals.length; i++) {
      updatePetal(petals[i]);
      drawPetal(petals[i]);
    }

    requestAnimationFrame(animate);
  }

  /**
   * 调整画布尺寸（响应窗口变化）
   */
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // 监听窗口大小变化
  window.addEventListener('resize', function () {
    resizeCanvas();
  });

  // 初始化并启动动画
  resizeCanvas();
  initPetals();
  animate();

  /* ---------- 信封卡片入场延迟 ---------- */

  // 获取所有信封卡片
  const envelopeCards = document.querySelectorAll('.envelope-card');

  // 为每张卡片设置递增的动画延迟，形成依次入场效果
  envelopeCards.forEach(function (card, index) {
    // 每张卡片延迟 0.15s，基础延迟 0.5s（等待标题动画完成）
    card.style.animationDelay = (0.5 + index * 0.15) + 's';
  });

})();
