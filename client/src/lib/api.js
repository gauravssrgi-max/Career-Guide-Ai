/**
 * API Client — Smart Routing for Dev & Production
 * 
 * In development: routes to Express backend (localhost:5000)
 * In production (Vercel): routes to built-in Next.js API routes (/api/*)
 * 
 * @author Gaurav Kumar Shah
 */

const isProduction = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');
const EXTERNAL_API = process.env.NEXT_PUBLIC_API_URL || (isProduction ? '/api' : 'http://localhost:5000/api');

class ApiClient {
  constructor() {
    this.externalApi = EXTERNAL_API;
  }

  getToken() {
    if (typeof window !== 'undefined') return localStorage.getItem('token');
    return null;
  }

  // Make request to external Express backend
  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${this.externalApi}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  }

  // Make request to internal Next.js API route (works on Vercel)
  async internalRequest(endpoint, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    const res = await fetch(`/api${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  }

  get(endpoint) { return this.request(endpoint); }
  post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); }
  put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); }
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }

  // ── Auth ────────────────────────────────
  register(data) { return this.post('/auth/register', data); }
  login(data) { return this.post('/auth/login', data); }
  googleAuth(data) { return this.post('/auth/google', data); }
  getProfile() { return this.get('/auth/profile'); }

  // ── Survey ──────────────────────────────
  submitSurvey(data) { return this.post('/survey/submit', data); }
  getSurveyResult() { return this.get('/survey/result'); }

  // ── Careers ─────────────────────────────
  getCareers(params = '') { return this.get(`/careers${params}`); }
  getCareer(id) { return this.get(`/careers/${id}`); }
  compareCareers(ids) { return this.post('/careers/compare', { careerIds: ids }); }
  getCostEstimate(id) { return this.get(`/careers/${id}/cost`); }

  // ── AI (Smart routing: Vercel API or Express) ──
  async chat(messages) {
    // Try internal API first (works on Vercel), fallback to Express
    try {
      return await this.internalRequest('/chat', { method: 'POST', body: JSON.stringify({ messages }) });
    } catch {
      return this.post('/ai/chat', { messages });
    }
  }

  async recommend(answers) {
    try {
      return await this.internalRequest('/recommend', { method: 'POST', body: JSON.stringify({ answers }) });
    } catch {
      return this.post('/ai/recommend', { answers });
    }
  }

  skillGap(skills, career) { return this.post('/ai/skill-gap', { currentSkills: skills, targetCareer: career }); }
  riskScore(career) { return this.post('/ai/risk-score', { careerTitle: career }); }

  // ── User ────────────────────────────────
  getDashboard() { return this.get('/user/dashboard'); }
  saveCareer(careerId) { return this.post('/user/save-career', { careerId }); }
  getBadges() { return this.get('/user/badges'); }
}

const api = new ApiClient();
export default api;
