// Real Asynchronous AI Helpers fetching from internal Gemini API route

export async function autoAnalyzeRequest(text = '') {
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'analyze_request', text })
    });
    if (!res.ok) throw new Error("API Route failed");
    return await res.json();
  } catch (error) {
    console.error("autoAnalyzeRequest error:", error);
    return null;
  }
}

export async function generateAISummary(requestObj) {
  if (!requestObj) return '';
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate_summary', requestObj })
    });
    if (!res.ok) throw new Error("API Route failed");
    const data = await res.json();
    return data.summary || '';
  } catch (error) {
    console.error("generateAISummary error:", error);
    return `${requestObj.category} request with ${requestObj.urgency?.toLowerCase() || 'low'} urgency. Best suited for members with relevant expertise.`; // Graceful fallback
  }
}

export async function suggestSkillsForUser(skills = []) {
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'suggest_skills', skills })
    });
    if (!res.ok) throw new Error("API Route failed");
    const data = await res.json();
    return data.skills || [];
  } catch (error) {
    console.error("suggestSkillsForUser error:", error);
    return []; // fallback
  }
}

// These are static mathematical computations - keeping them synchronous as they don't require an LLM
export function computeTrustScore(user) {
  return Math.min(100, 50 + (user.helpCount || 0) * 2);
}

export function computeBadges(user) {
  const badges = [];
  if (user.helpCount >= 1) badges.push('First Helper');
  if (user.helpCount >= 5) badges.push('Fast Responder');
  if (user.helpCount >= 10) badges.push('Top Mentor');
  if (user.skills?.includes('Figma') || user.skills?.includes('UI/UX')) badges.push('Design Ally');
  if (user.skills?.includes('React') || user.skills?.includes('JavaScript')) badges.push('Code Rescuer');
  return badges;
}
