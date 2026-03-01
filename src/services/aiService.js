export const fetchAIVisual = async (dreamText, config) => {
  const { 
    apiKey, 
    baseUrl = 'https://api.openai.com/v1', 
    model = 'gpt-4o-mini',
    temperature = 0.7,
    top_p = 1,
    max_tokens = 1000
  } = config;

  if (!apiKey) throw new Error('未設定 API Key');
  const cleanUrl = baseUrl.replace(/\/+$/, '');
  
  const sysPrompt = `你是一位融合達利風格與神經科學的超現實藝術家。分析夢境深度，回傳 JSON：
1. analysis: 3個反映潛意識的唯美詞彙。
2. svgPath: 一段具備「數學對稱美」與「碎形律動感」的左右對稱 SVG Path (viewBox 0 0 100 100)。
3. moodColor: 具備發光質感的色碼 (如螢光紫 #BC6FF1 或深海藍 #00D2FF)。
4. turbulence: 0.1-1.0 (數值越高，路徑越扭曲)。
重要：路徑必須呈現如羅夏克墨跡般的鏡像對稱，結構需細緻如生物神經元。`;

  const response = await fetch(`${cleanUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: sysPrompt + '\n\n重要：請嚴格只回傳 JSON 格式，不要包含額外文字。' },
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
    // 1. 清理 Markdown 標籤
    let jsonString = rawContent.replace(/```json|```/g, '').trim();
    
    // 2. 嘗試解析 JSON
    const parsed = JSON.parse(jsonString);
    
    // 3. 容錯處理：尋找可能的 key (不分大小寫)
    const getKey = (obj, target) => {
      const key = Object.keys(obj).find(k => k.toLowerCase() === target.toLowerCase());
      return key ? obj[key] : null;
    };

    return {
      analysis: getKey(parsed, 'analysis') || '神祕的夢境',
      svgPath: getKey(parsed, 'svgPath') || 'M50 20 C70 20 80 50 50 80 C20 50 30 20 50 20',
      moodColor: getKey(parsed, 'moodColor') || '#7C3AED',
      turbulence: parseFloat(getKey(parsed, 'turbulence') || 0.5)
    };
  } catch (e) {
    console.warn('AI 回傳解析失敗，使用原始文字作為分析內容。來源：', rawContent);
    // 萬一解析完全失敗，至少回傳一個可用的結構
    return {
      analysis: rawContent.substring(0, 50),
      svgPath: 'M50 20 C70 20 80 50 50 80 C20 50 30 20 50 20',
      moodColor: '#7C3AED',
      turbulence: 0.5
    };
  }
};

export const validateConnection = async (config) => {
  const { apiKey, baseUrl = 'https://api.openai.com/v1', model = 'gpt-4o-mini' } = config;
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
