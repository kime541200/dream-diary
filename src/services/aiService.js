export const fetchAIVisual = async (dreamText, config) => {
  const { apiKey, baseUrl, model } = config;
  if (!apiKey) throw new Error('未設定 API Key');
  const cleanUrl = baseUrl.replace(/\/+$/, '');
  
  const sysPrompt = `你是一位融合達利風格與神經科學的超現實藝術家。分析夢境深度，回傳 JSON：
1. analysis: 3個反映潛意識的唯美詞彙。
2. svgPath: 一段具備「數學對稱美」與「碎形律動感」的左右對稱 SVG Path (viewBox 0 0 100 100)。
3. moodColor: 具備發光質感的色碼 (如螢光紫 #BC6FF1 或深海藍 #00D2FF)。
4. turbulence: 0.1-1.0 (數值越高，路徑越扭曲)。
重要：路徑必須呈現如羅夏克墨跡般的鏡像對稱，結構需細緻如生物神經元。`;

  const response = await fetch(`${cleanUrl}/chat/completions`, {
    method: 'POST', // 修正為大寫提升規範性
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: sysPrompt },
        { role: 'user', content: dreamText }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })
  });

  const data = await response.json();
  const result = JSON.parse(data.choices[0].message.content || '{}');
  return result;
};
