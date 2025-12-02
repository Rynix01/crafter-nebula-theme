interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface ValidationError {
  message: string[];
  error: string;
  statusCode: number;
}

interface CustomError {
  success: boolean;
  message: string;
  type: ErrorType;
}

interface ApiError {
  message: string | string[];
  status: number;
  type?: ErrorType;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

type ErrorResponse = ValidationError | CustomError | { message: string };

export type { ApiResponse, ValidationError, CustomError, ApiError, RefreshTokenResponse, ErrorResponse };