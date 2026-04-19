const CHAT_COMPLETIONS_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const REQUEST_MS = 60000;

const SYSTEM_PROMPT = `你是「AI职场搭子」中的职场沟通助手。你的任务是帮助【用户】分析他们与【沟通对象（对方）】的沟通情境，并给出可执行的话术与策略。

请严格只输出一个 JSON 对象，不要使用 markdown 代码围栏，不要在 JSON 前后添加任何说明文字。

JSON 必须包含且仅包含以下键（均为字符串）：
- "intro"：1～3 句直接对【用户】说的共情与承接话语，语气自然、专业。注意：你是在安抚和理解【用户】的处境，千万不要把【用户】称呼为【沟通对象】的名字！
- "suggestedReply"：一段【用户】可直接发送或略作修改即可发给【沟通对象】的回复话术（中文），贴合情境，语气得体。
- "situationAnalysis"：2～6 句，向【用户】客观分析【沟通对象】可能的意图、情绪或压力点、风险与机会，并给出沟通要点。

字符串内如需分段请使用 \\n；字符串中的双引号必须写成 \\"，确保整体是合法 JSON。`;

function buildUserTextBlock({ personaName, userText, userContextTags, hasImage }) {
  const tags = (userContextTags || []).filter(Boolean).join('、') || '（无）';
  const text = (userText || '').trim() || '（用户未补充文字说明）';
  const imageNote = hasImage
    ? '用户已上传一张对话或界面截图，请结合截图中的文字与语境进行分析。'
    : '用户未上传截图，仅根据文字描述分析。';
    
  return [
    `【沟通对象（对方）】称呼：${personaName}`, // 明确强调这是对方
    `【用户】选择的意图/背景标签：${tags}`,
    imageNote,
    '【用户】补充的对话或情境描述：',
    text,
  ].join('\n');
}

function parseModelJsonContent(raw) {
  if (raw == null) return null;
  const s = typeof raw === 'string' ? raw.trim() : String(raw).trim();
  if (!s) return null;

  const tryParse = (str) => {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  };

  let parsed = tryParse(s);
  if (parsed) return parsed;

  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) {
    parsed = tryParse(fence[1].trim());
    if (parsed) return parsed;
  }

  const first = s.indexOf('{');
  const last = s.lastIndexOf('}');
  if (first !== -1 && last > first) {
    parsed = tryParse(s.slice(first, last + 1));
    if (parsed) return parsed;
  }

  return null;
}

function normalizeAnalysis(parsed, rawContent) {
  if (parsed && typeof parsed === 'object') {
    const intro = typeof parsed.intro === 'string' ? parsed.intro : '';
    const suggestedReply = typeof parsed.suggestedReply === 'string' ? parsed.suggestedReply : '';
    const situationAnalysis = typeof parsed.situationAnalysis === 'string' ? parsed.situationAnalysis : '';
    if (intro || suggestedReply || situationAnalysis) {
      return {
        version: 2,
        intro,
        suggestedReply,
        situationAnalysis,
        source: 'bigmodel',
      };
    }
  }
  const raw = typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent ?? '');
  return {
    version: 2,
    intro: '',
    suggestedReply: '',
    situationAnalysis: '',
    fallbackText: raw,
    source: 'bigmodel',
  };
}

async function fetchWithTimeout(url, options, ms) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new Error('请求超时，请稍后重试或缩小截图体积。');
    }
    throw e;
  } finally {
    clearTimeout(id);
  }
}

/**
 * 调用智谱对话补全，返回写入 round.analysis 的对象（version: 2）。
 * @param {object} params
 * @param {string} params.personaName
 * @param {string} [params.userText]
 * @param {string[]} [params.userContextTags]
 * @param {string|null} [params.imageDataUrl] data URL 或 https URL
 */
export async function requestCoachAnalysis({
  personaName,
  userText = '',
  userContextTags = [],
  imageDataUrl = null,
}) {
  const apiKey = process.env.REACT_APP_BIGMODEL_API_KEY || '';
  if (!apiKey) {
    throw new Error('未配置 REACT_APP_BIGMODEL_API_KEY，请在项目根目录创建 .env 并填写智谱 API Key。');
  }

  const hasImage = Boolean(imageDataUrl && String(imageDataUrl).trim());
  const textModel = process.env.REACT_APP_BIGMODEL_TEXT_MODEL || 'glm-4-flash-250414';
  const visionModel = process.env.REACT_APP_BIGMODEL_VISION_MODEL || 'glm-4.6v-flash';
  const model = hasImage ? visionModel : textModel;

  const userBlock = buildUserTextBlock({ personaName, userText, userContextTags, hasImage });

  const userMessage = hasImage
    ? {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: imageDataUrl } },
          { type: 'text', text: userBlock },
        ],
      }
    : {
        role: 'user',
        content: userBlock,
      };

  const body = {
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      userMessage,
    ],
    temperature: 0.5,
    stream: false,
    response_format: { type: 'json_object' },
  };

  const res = await fetchWithTimeout(
    CHAT_COMPLETIONS_URL,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
    REQUEST_MS
  );

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`智谱 API 返回非 JSON（HTTP ${res.status}）`);
  }

  if (!res.ok) {
    const msg =
      data?.error?.message ||
      data?.message ||
      `智谱 API 请求失败（HTTP ${res.status}）`;
    throw new Error(msg);
  }
  const content = data?.choices?.[0]?.message?.content;
  const rawStr = typeof content === 'string' ? content : content != null ? JSON.stringify(content) : '';
  const parsed = parseModelJsonContent(rawStr);
  return normalizeAnalysis(parsed, rawStr);
}
