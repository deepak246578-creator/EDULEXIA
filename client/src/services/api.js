/**
 * FRONTEND API SERVICE
 */

const getBackendUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }
  // When running in browser on localhost or 127.0.0.1, always point to local backend port 5000
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5000';
    }
  }
  return '';
};

const BACKEND_URL = getBackendUrl();
const API_BASE = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('dyslexia_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  async login(email, password, role) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async register(name, email, password, role, studentId) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, studentId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  async switchDemo(role) {
    const res = await fetch(`${API_BASE}/auth/switch-demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to switch demo role');
    return data;
  },

  async loginWithGoogle({ credential, email, name, role = 'student' }) {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential, email, name, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Google authentication failed');
    return data;
  },

  async requestPhoneVerification(email, role = 'student') {
    const res = await fetch(`${API_BASE}/auth/phone-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to dispatch phone verification');
    return data;
  },

  async verifyPhoneRequest(email, role = 'student', code = null, approveDirect = false) {
    const res = await fetch(`${API_BASE}/auth/phone-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role, code, approveDirect })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to verify phone prompt');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch current user');
    return data;
  },

  // Student Profile & Progress
  async getStudentProfile(studentId) {
    const query = studentId ? `?studentId=${studentId}` : '';
    const res = await fetch(`${API_BASE}/student/profile${query}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch profile');
    return data;
  },

  async updatePreferences(preferences) {
    const res = await fetch(`${API_BASE}/student/preferences`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(preferences)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update preferences');
    return data;
  },

  async getStudentProgress(studentId) {
    const query = studentId ? `?studentId=${studentId}` : '';
    const res = await fetch(`${API_BASE}/student/progress${query}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch progress');
    return data;
  },

  async getStudentAchievements(studentId) {
    const query = studentId ? `?studentId=${studentId}` : '';
    const res = await fetch(`${API_BASE}/student/achievements${query}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch achievements');
    return data;
  },

  // Screening
  async getScreeningStages() {
    const res = await fetch(`${API_BASE}/screening/stages`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch screening curriculum');
    return data.stages;
  },

  async submitScreening(stageResponses) {
    const res = await fetch(`${API_BASE}/screening/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ stageResponses })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit screening');
    return data.result;
  },

  async getScreeningResult(id) {
    const res = await fetch(`${API_BASE}/screening/result/${id}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch screening result');
    return data.result;
  },

  async getScreeningHistory(studentId) {
    const query = studentId ? `?studentId=${studentId}` : '';
    const res = await fetch(`${API_BASE}/screening/history${query}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch screening history');
    return data.history;
  },

  // Recommendations
  async getRecommendations(studentId) {
    const query = studentId ? `?studentId=${studentId}` : '';
    const res = await fetch(`${API_BASE}/recommendations${query}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch recommendations');
    return data.recommendations;
  },

  // Learning Activities
  async getActivities(level, skillArea) {
    const params = new URLSearchParams();
    if (level) params.append('level', level);
    if (skillArea) params.append('skillArea', skillArea);

    const res = await fetch(`${API_BASE}/activities?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch activities');
    return data.activities;
  },

  async getActivity(id) {
    const res = await fetch(`${API_BASE}/activities/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch activity');
    return data.activity;
  },

  async submitActivity(id, scoreData) {
    const res = await fetch(`${API_BASE}/activities/${id}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(scoreData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to record activity result');
    return data;
  },

  // Parent
  async getParentStudentData() {
    const res = await fetch(`${API_BASE}/parent/student`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch parent overview');
    return data;
  },

  // Teacher
  async getTeacherStudents() {
    const res = await fetch(`${API_BASE}/teacher/students`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch teacher roster');
    return data;
  },

  async getTeacherStudentDetail(studentId) {
    const res = await fetch(`${API_BASE}/teacher/student/${studentId}/detail`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch student details');
    return data;
  }
};
