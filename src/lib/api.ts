// API utility functions for making requests to the backend

// Base fetch function with error handling
const fetchAPI = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  // Register a new user
  register: async (userData: any) => {
    return fetchAPI('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    return fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

// Events API functions
export const eventsAPI = {
  // Get all events
  getAllEvents: async (filters?: { category?: string; search?: string }) => {
    let url = '/api/events';
    
    if (filters) {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    return fetchAPI(url);
  },

  // Get a single event
  getEvent: async (id: string) => {
    return fetchAPI(`/api/events/${id}`);
  },

  // Create a new event
  createEvent: async (eventData: any) => {
    return fetchAPI('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  // Update an event
  updateEvent: async (id: string, eventData: any) => {
    return fetchAPI(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  // Delete an event
  deleteEvent: async (id: string) => {
    return fetchAPI(`/api/events/${id}`, {
      method: 'DELETE',
    });
  },

  // Register for an event
  registerForEvent: async (eventId: string, userId: string) => {
    return fetchAPI(`/api/events/${eventId}/register`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },
};

// Users API functions
export const usersAPI = {
  // Get all users (admin)
  getAllUsers: async () => {
    return fetchAPI('/api/users');
  },

  // Get a single user
  getUser: async (id: string) => {
    return fetchAPI(`/api/users/${id}`);
  },

  // Create a new user (admin)
  createUser: async (userData: any) => {
    return fetchAPI('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Update a user
  updateUser: async (id: string, userData: any) => {
    return fetchAPI(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Delete a user (admin)
  deleteUser: async (id: string) => {
    return fetchAPI(`/api/users/${id}`, {
      method: 'DELETE',
    });
  },
}; 