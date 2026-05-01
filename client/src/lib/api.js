const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE;
  }

  getToken() {
    if (typeof window !== 'undefined') return localStorage.getItem('token');
    return null;
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${this.baseUrl}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  }

  get(endpoint) { return this.request(endpoint); }
  post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); }
  put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); }
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }

  // Auth
  register(data) { return this.post('/auth/register', data); }
  login(data) { return this.post('/auth/login', data); }
  googleAuth(data) { return this.post('/auth/google', data); }
  getProfile() { return this.get('/auth/profile'); }

  // Survey
  submitSurvey(data) { return this.post('/survey/submit', data); }
  getSurveyResult() { return this.get('/survey/result'); }

  // Careers
  getCareers(params = '') { return this.get(`/careers${params}`); }
  getCareer(id) { return this.get(`/careers/${id}`); }
  compareCareers(ids) { return this.post('/careers/compare', { careerIds: ids }); }
  getCostEstimate(id) { return this.get(`/careers/${id}/cost`); }

  // AI
  chat(messages) { return this.post('/ai/chat', { messages }); }
  skillGap(skills, career) { return this.post('/ai/skill-gap', { currentSkills: skills, targetCareer: career }); }
  riskScore(career) { return this.post('/ai/risk-score', { careerTitle: career }); }

  // User
  getDashboard() { return this.get('/user/dashboard'); }
  saveCareer(careerId) { return this.post('/user/save-career', { careerId }); }
  getBadges() { return this.get('/user/badges'); }
}

const api = new ApiClient();
export default api;
