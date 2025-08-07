// API 응답 관련 타입 정의

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiListResponse<T = any> {
  items: T[];
  total: number;
  page?: number;
  limit?: number;
  lastUpdated: string;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: any;
}
