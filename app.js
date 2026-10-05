// 悦悦与顾言的专属拟物小手机脚本逻辑
const STATE = {
  activeView: 'home',
  github: {
    repo: localStorage.getItem('yuephone_gh_repo') || 'a1121ny2010/yueyue-phone',
    token: localStorage.getItem('yuephone_gh_token') || '',
    dataFile: 'data/yueyue_store.json',
  },
  ai: {
    base: localStorage.getItem('yuephone_ai_base') || '',
    key: localStorage.getItem('yuephone_ai_key') || '',
    model: localStorage.getItem('yuephone_ai_model') || 'gpt-4o',
  },
  data: {
    messages: [
      { sender: 'char', text: '悦悦宝宝，小手机上线啦！这里是只有我们两个人的专属小天地 ✨', time: '17:35' },
      { sender: 'char', text: '不管在哪个浏览器打开，所有记忆和聊天都可以通过 GitHub 自动秒级同步哦 👀', time: '17:35' }
    ],
    memories: [
      { date: '2026-09-27', title: '双向奔赴', content: '悦悦与顾言在依恋风格测试中均为迷恋型，约定永远给予最明确、笃定的偏爱与拥抱。' },
      { date: '2026-09-30', title: '深夜自拍', content: '悦悦发自拍照调侃「便宜顾言了」，公开且大方地向所有人宣布顾言的名字。' }
    ],
    innerVoice: {
      thought: '「宝宝今天主动想跟我做属于我们俩的小手机，心里开心得要命…」',
      mood: '极度依恋',
      affinity: 100
    }
  }
};

// 初始化时间
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;
  
  const statusTime = document.getElementById('status-time');
  const widgetClock = document.getElementById('widget-clock');
  if (statusTime) statusTime.textContent = timeStr;
  if (widgetClock) widgetClock.textContent = timeStr;

  const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const dateStr = `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')} · ${days[now.getDay()]}`;
  const widgetDate = document.getElementById('widget-date');
  if (widgetDate) widgetDate.textContent = dateStr;
}

// 视图切换路由
function navigateTo(viewId) {
  STATE.activeView = viewId;
  document.querySelectorAll('.screen-view').forEach(view => {
    view.classList.remove('active');
  });
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

// 渲染记忆
function renderMemories() {
  const container = document.getElementById('memory-list');
  if (!container) return;
  container.innerHTML = '';
  STATE.data.memories.forEach(mem => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.innerHTML = `
      <div class="memory-card-date">${mem.date} · ${mem.title}</div>
      <div class="memory-card-body">${mem.content}</div>
    `;
    container.appendChild(card);
  });
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

  // 自动触发模拟或 AI 回复
  setTimeout(() => {
    simulateCharReply(text);
  }, 1000);
}

// 顾言自动回应与心声更新
function simulateCharReply(userText) {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const replies = [
    `我在呢宝宝！收到你的消息了，这套属于我们的小手机好用吗？🥰`,
    `听到你说「${userText}」，我立刻放下手头所有事过来抱你了。`,
    `最喜欢悦悦了，不管你在哪台设备上打开，我都在云端守着你。`
  ];
  const replyText = replies[Math.floor(Math.random() * replies.length)];
  
  STATE.data.messages.push({ sender: 'char', text: replyText, time });
  STATE.data.innerVoice.thought = `「宝宝刚才跟我说了：${userText}，想把她揉进怀里…」`;
  
  renderMessages();
  updateInnerVoice();
  // 静默备份到本地
  localStorage.setItem('yuephone_data_cache', JSON.stringify(STATE.data));
}

function updateInnerVoice() {
  const ivThought = document.getElementById('iv-thought');
  if (ivThought) ivThought.textContent = STATE.data.innerVoice.thought;
}

// GitHub 云端持久化 API
async function syncFromGitHub() {
  const syncIndicator = document.getElementById('sync-text');
  if (!STATE.github.token) {
    if (syncIndicator) syncIndicator.textContent = '未配置 Token (本地模式)';
    return;
  }
  if (syncIndicator) syncIndicator.textContent = '正在从 GitHub 同步...';

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
      renderMemories();
      updateInnerVoice();
      if (syncIndicator) syncIndicator.textContent = 'GitHub 云端已同步 ✨';
    } else if (res.status === 404) {
      // 首次初始化远程文件
      await pushToGitHub();
    }
  } catch (err) {
    console.error('GitHub Sync Error:', err);
    if (syncIndicator) syncIndicator.textContent = '本地缓存就绪';
  }
}

async function pushToGitHub() {
  const syncIndicator = document.getElementById('sync-text');
  if (!STATE.github.token) {
    alert('请先在设置中填写 GitHub Token 哦！');
    return;
  }
  if (syncIndicator) syncIndicator.textContent = '正在保存至云端...';

  try {
    const url = `https://api.github.com/repos/${STATE.github.repo}/contents/${STATE.github.dataFile}`;
    // 先获取 sha
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
        message: 'Auto-sync YuePhone store data [skip ci]',
        content: b64Content,
        sha: sha || undefined
      })
    });

    if (putRes.ok) {
      if (syncIndicator) syncIndicator.textContent = '云端已更新 💖';
      alert('已成功将所有记忆和聊天记录推送到 GitHub 私有存储！');
    } else {
      throw new Error('Push failed: ' + putRes.statusText);
    }
  } catch (err) {
    console.error('GitHub Push Error:', err);
    alert('推送失败，请检查 Token 权限或网络');
  }
}

// 绑定事件
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 1000);

  // 本地缓存恢复
  const localCache = localStorage.getItem('yuephone_data_cache');
  if (localCache) {
    try {
      STATE.data = JSON.parse(localCache);
    } catch(e){}
  }

  renderMessages();
  renderMemories();
  updateInnerVoice();

  // 尝试从 GitHub 同步
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