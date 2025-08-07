// API 응답 관련 타입 정의

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiListResponse<T = unknown> {
  items: T[];
  total: number;
  page?: number;
  limit?: number;
  lastUpdated: string;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}
