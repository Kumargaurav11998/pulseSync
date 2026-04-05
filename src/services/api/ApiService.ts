import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptor if needed (e.g., for auth tokens)
    this.instance.interceptors.request.use(
      (config) => {
        // console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for centralized error handling
    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const status = error.response ? error.response.status : null;
        
        if (status === 401) {
          console.error('[API Error] Unauthorized (401)');
        } else if (status === 404) {
          console.warn('[API Error] Not Found (404)');
        } else if (status >= 500) {
          console.error('[API Error] Server Error');
        } else {
          console.error('[API Error]', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }
}

export default new ApiService();
