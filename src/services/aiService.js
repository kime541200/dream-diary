export const fetchAIVisual = async (dreamText, config) => {
  const { 
    apiKey, 
    baseUrl = '[https://api.openai.com/v1](https://api.openai.com/v1)', 
    model = 'gpt-4o-mini',
    temperature = 0.7,
    top_p = 1,
    max_tokens = 1000
  } = config;

  if (!apiKey) throw new Error('未設定 API Key');
  const cleanUrl = baseUrl.replace(/\/+$/, '');
  
  const sysPrompt = `你是一位融合達利風格與神經科學的超現實藝術家。分析夢境深度，嚴格回傳 JSON 格式：
{
  "emotion": "一個代表夢境核心情緒的詞彙（例如：幽暗、狂喜、寧靜）",
  "keywords": ["唯美詞彙1", "唯美詞彙2", "唯美詞彙3"],
  "svgPath": "一段具備數學對稱美與碎形律動感的 SVG Path (viewBox 0 0 100 100)。必須如羅夏克墨跡般鏡像對稱，結構細緻",
  "moodColor": "具備發光質感的 HEX 色碼 (如 #BC6FF1 或 #00D2FF)",
  "turbulence": 0.5
}
重要：請確保只輸出合法的 JSON，不要有任何前言後語或 Markdown 標記。`;

  const response = await fetch(`${cleanUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: sysPrompt },
        { role: 'user', content: dreamText }
      ],
      temperature: parseFloat(temperature),
      top_p: parseFloat(top_p),
      max_tokens: parseInt(max_tokens)
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API 請求失敗: ${response.status}`);
  }

  const data = await response.json();
  const rawContent = data.choices[0]?.message?.content || '{}';
  
  try {
    // 暴力提取 JSON 區塊，無視前後廢話
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('找不到 JSON 結構');
    
    const jsonString = jsonMatch[0];
    const parsed = JSON.parse(jsonString);

    return {
      emotion: parsed.emotion || '未解析情緒',
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      svgPath: parsed.svgPath || 'M50 20 C70 20 80 50 50 80 C20 50 30 20 50 20',
      moodColor: parsed.moodColor || '#7C3AED',
      turbulence: parseFloat(parsed.turbulence || 0.5)
    };
  } catch (e) {
    console.warn('AI 回傳解析失敗，使用原始文字作為分析內容。來源：', rawContent);
    return {
      emotion: '混沌',
      keywords: ['解析異常', '潛意識干擾'],
      svgPath: 'M50 20 C70 20 80 50 50 80 C20 50 30 20 50 20',
      moodColor: '#FF3366',
      turbulence: 0.8
    };
  }
};

export const validateConnection = async (config) => {
  const { apiKey, baseUrl = '[https://api.openai.com/v1](https://api.openai.com/v1)', model = 'gpt-4o-mini' } = config;
  if (!apiKey) throw new Error('請填寫 API Key');
  const cleanUrl = baseUrl.replace(/\/+$/, '');

  const response = await fetch(`${cleanUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'hi' }],
      max_tokens: 1
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `連線失敗 (HTTP ${response.status})`);
  }
  return true;
};
