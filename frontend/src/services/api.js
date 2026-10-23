/* ─────────────────────────────────────────
   Fixovia API Service
   Base URL resolved from VITE_API_URL env var
   ───────────────────────────────────────── */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const getToken = () => localStorage.getItem('fixovia_access_token');

const request = async (path, options = {}) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  return res.json();
};

export const api = {
  // Auth
  login:    (email, password) => request('/auth/login',    { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data)            => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  // Discovery
  workers:  (params = '') => request(`/workers${params}`),
  services: ()            => request('/services'),

  // Jobs (customer)
  createJob:    (data) => request('/jobs',         { method: 'POST', body: JSON.stringify(data) }),
  customerJobs: ()     => request('/jobs/customer'),
  cancelJob:    (id)   => request(`/jobs/${id}/cancel`, { method: 'POST' }),

  // Jobs (worker)
  workerJobs:          () => request('/jobs/worker'),
  workerRequestedJobs: () => request('/jobs/worker/requested'),
  acceptJob: (id)  => request(`/jobs/${id}/accept`,    { method: 'POST' }),
  rejectJob: (id)  => request(`/jobs/${id}/reject`,    { method: 'POST' }),
  onTheWay:  (id)  => request(`/jobs/${id}/on-the-way`, { method: 'POST' }),
  arrived:   (id)  => request(`/jobs/${id}/arrived`,   { method: 'POST' }),
  startJob:  (id, otp) => request(`/jobs/${id}/start`, { method: 'POST', body: JSON.stringify({ otp }) }),
  completeJob: (id)    => request(`/jobs/${id}/complete`, { method: 'POST' }),

  // Admin
  adminDashboard: () => request('/admin/dashboard'),
  pendingWorkers: () => request('/admin/workers/pending'),
  verifyWorker:   (id) => request(`/admin/workers/${id}/verify`, { method: 'POST' }),
  rejectWorker:   (id) => request(`/admin/workers/${id}/reject`, { method: 'POST' }),
};
