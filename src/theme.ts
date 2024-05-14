(function themeListener() {
  // 尝试从localStorage获取当前主题模式设置，同时处理可能的异常
  let themeMode;
  try {
    themeMode = localStorage.getItem('vite-ui-theme');
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    themeMode = 'light'; // 默认主题设置为明亮模式，或根据需求进行调整
  }

  // 检查主题模式是否设置为"system"
  if (themeMode !== 'system') {
    return;
  }

  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const root = window.document.documentElement;

  // 切换主题模式的逻辑抽象为单独的函数
  function toggleThemeMode(isDarkMode: boolean) {
    if (isDarkMode) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  }

  // 初始化主题模式
  toggleThemeMode(mql.matches);

  // 监听媒体查询的变化，以动态更新主题模式
  mql.addEventListener('change', (e) => {
    toggleThemeMode(e.matches);
  });
})();
