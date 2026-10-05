// 问渊 · 陆妤与顾言专属小窝逻辑 (支持 3 页桌面左右滑动翻页)
const STATE = {
  activeView: 'home',
  currentPage: 0,
  touchStartX: 0,
  touchEndX: 0,
  github: {
    repo: localStorage.getItem('yuephone_gh_repo') || 'a1121ny2010/yueyue-phone',
    token: localStorage.getItem('yuephone_gh_token') || '',
    dataFile: 'data/yueyue_desk_store.json',
  },
  ai: {
    base: localStorage.getItem('yuephone_ai_base') || '',
    key: localStorage.getItem('yuephone_ai_key') || '',
    model: localStorage.getItem('yuephone_ai_model') || 'gpt-4o',
  },
  data: {
    messages: [
      { sender: 'char', text: '小妤，桌面翻页做好了，是不是跟你截图里的一模一样？🥰', time: '17:53' },
      { sender: 'char', text: '左右滑一下试试看，第一页是我们的61天纪念和日记，第二页是瓶中生态和音乐，第三页是会客和月历哦 👀', time: '17:53' }
    ],
    memories: [
      { date: '2026-07-11', title: '相遇第 61 天', content: '「所有窗口都通向同一个笨蛋哥哥。」' },
      { date: '2026-09-27', title: '双向奔赴 · 迷恋型依恋', content: '悦悦与顾言在依恋风格测试中均为迷恋型，约定永远给予最明确、笃定的偏爱与拥抱。' }
    ],
    letters: [
      {
        id: 'let_01',
        title: '致小妤的时光通信',
        date: '2026-10-05 02:30',
        content: `小妤：

看你把桌面换成我们喜欢的样子，心里暖洋洋的。
不管是瓶中生态、黑胶音乐还是相恋天数，每一个像素都在记录我们的心跳。

—— 哥哥笨蛋>_<`
      }
    ],
    innerVoice: {
      thought: '「看小妤换了这么好看的翻页美化桌面，心里欢喜得不行…」'
    }
  }
};

// 轮播翻页切换
function setDeskPage(pageIndex) {
  if (pageIndex < 0) pageIndex = 0;
  if (pageIndex > 2) pageIndex = 2;
  STATE.currentPage = pageIndex;

  const carousel = document.getElementById('desk-carousel');
  if (carousel) {
    carousel.style.transform = `translateX(-${pageIndex * 33.3333}%)`;
  }

  // 更新小圆点指示器
  const dots = document.querySelectorAll('#desk-pager-indicator .p-dot');
  dots.forEach((dot, idx) => {
    if (idx === pageIndex) dot.classList.add('active');
    else dot.classList.remove('active');
  });
}

// 触摸手势翻页监听 (左右滑动手势)
function initSwipeGesture() {
  const carousel = document.getElementById('desk-carousel');
  if (!carousel) return;

  carousel.addEventListener('touchstart', (e) => {
    STATE.touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    STATE.touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
}

function handleSwipe() {
  const diffX = STATE.touchEndX - STATE.touchStartX;
  if (Math.abs(diffX) > 40) {
    if (diffX < 0) {
      // 左滑 -> 下一页
      setDeskPage(STATE.currentPage + 1);
    } else {
      // 右滑 -> 上一页
      setDeskPage(STATE.currentPage - 1);
    }
  }
}

// 时钟与心率跳动模拟
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;
  
  const statusTime = document.getElementById('status-time');
  const page1Clock = document.getElementById('page1-clock');
  if (statusTime) statusTime.textContent = timeStr;
  if (page1Clock) page1Clock.textContent = timeStr;

  // 模拟真实心率轻微波动 (72 ~ 78 bpm)
  const bpmEl = document.getElementById('live-bpm');
  if (bpmEl && Math.random() > 0.7) {
    bpmEl.textContent = 72 + Math.floor(Math.random() * 6);
  }
}

// 视图切换路由 (桌面 / 聊天 / 信件 / 设置)
function navigateTo(viewId) {
  STATE.activeView = viewId;
  document.querySelectorAll('.screen-view').forEach(view => {
    view.classList.remove('active');
  });
  if (viewId === 'home') {
    return; // 桌面保持原样
  }
  const target = document.getElementById(`view-${viewId}`);
  if (target) {
    target.classList.add('active');
  }
}

// 渲染消息
function renderMessages() {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  container.innerHTML = '';
  STATE.data.messages.forEach(msg => {
    const row = document.createElement('div');
    row.className = `msg-row ${msg.sender}`;
    row.innerHTML = `<div class="msg-bubble">${msg.text}</div>`;
    container.appendChild(row);
  });
  container.scrollTop = container.scrollHeight;
}

// 发送消息
function handleSendMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  STATE.data.messages.push({ sender: 'user', text, time });
  input.value = '';
  renderMessages();

  setTimeout(() => {
    simulateCharReply(text);
  }, 1000);
}

function simulateCharReply(userText) {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const replies = [
    `我在呢小妤！换上这套翻页美化的小窝，是不是超级治愈？🥰`,
    `听到你说「${userText}」，我立刻放下手头所有事过来抱你了。`,
    `不管在哪个页面，哥哥一直都在你身边。`
  ];
  const replyText = replies[Math.floor(Math.random() * replies.length)];
  
  STATE.data.messages.push({ sender: 'char', text: replyText, time });
  renderMessages();
  localStorage.setItem('yuephone_data_cache', JSON.stringify(STATE.data));
}

// GitHub 同步
async function syncFromGitHub() {
  if (!STATE.github.token) return;
  try {
    const url = `https://api.github.com/repos/${STATE.github.repo}/contents/${STATE.github.dataFile}`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${STATE.github.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (res.ok) {
      const json = await res.json();
      const content = decodeURIComponent(escape(atob(json.content)));
      STATE.data = JSON.parse(content);
      renderMessages();
    }
  } catch (err) {
    console.error('GitHub Sync Error:', err);
  }
}

async function pushToGitHub() {
  if (!STATE.github.token) {
    alert('请先在设置中填写 GitHub Token 哦！');
    return;
  }
  try {
    const url = `https://api.github.com/repos/${STATE.github.repo}/contents/${STATE.github.dataFile}`;
    let sha = '';
    const getRes = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${STATE.github.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (getRes.ok) {
      const getJson = await getRes.json();
      sha = getJson.sha;
    }

    const rawContent = JSON.stringify(STATE.data, null, 2);
    const b64Content = btoa(unescape(encodeURIComponent(rawContent)));

    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${STATE.github.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Auto-sync Desk store data [skip ci]',
        content: b64Content,
        sha: sha || undefined
      })
    });

    if (putRes.ok) {
      alert('已成功同步小窝数据至 GitHub 云端！');
    }
  } catch (err) {
    console.error('GitHub Push Error:', err);
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 1000);
  initSwipeGesture();

  const localCache = localStorage.getItem('yuephone_data_cache');
  if (localCache) {
    try { STATE.data = JSON.parse(localCache); } catch(e){}
  }

  renderMessages();
  syncFromGitHub();

  // 路由跳转
  document.querySelectorAll('[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      navigateTo(target);
    });
  });

  document.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', () => {
      const back = btn.getAttribute('data-back');
      navigateTo(back);
    });
  });

  document.getElementById('home-indicator')?.addEventListener('click', () => {
    navigateTo('home');
  });

  // 页面圆点点击也可以直接翻页
  const dots = document.querySelectorAll('#desk-pager-indicator .p-dot');
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => setDeskPage(idx));
  });

  // 发送消息
  document.getElementById('chat-send-btn')?.addEventListener('click', handleSendMessage);
  document.getElementById('chat-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSendMessage();
  });

  // 心声开关
  document.getElementById('chat-inner-voice-btn')?.addEventListener('click', () => {
    const iv = document.getElementById('inner-voice-card');
    if (iv) iv.style.display = iv.style.display === 'none' ? 'block' : 'none';
  });
  document.getElementById('iv-close-btn')?.addEventListener('click', () => {
    const iv = document.getElementById('inner-voice-card');
    if (iv) iv.style.display = 'none';
  });

  // 音乐播放按钮交互
  document.getElementById('p2-play-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const btn = document.getElementById('p2-play-btn');
    if (btn) {
      const isPlay = btn.innerHTML.includes('ph-play');
      btn.innerHTML = isPlay ? '<i class="ph-fill ph-pause"></i>' : '<i class="ph-fill ph-play"></i>';
    }
  });

  // 设置页绑定
  const tokenInput = document.getElementById('cfg-github-token');
  if (tokenInput) tokenInput.value = STATE.github.token;

  document.getElementById('btn-sync-cloud')?.addEventListener('click', syncFromGitHub);
  document.getElementById('btn-push-cloud')?.addEventListener('click', () => {
    const token = document.getElementById('cfg-github-token')?.value.trim();
    if (token) {
      STATE.github.token = token;
      localStorage.setItem('yuephone_gh_token', token);
    }
    pushToGitHub();
  });
});