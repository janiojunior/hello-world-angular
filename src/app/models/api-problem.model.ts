export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiProblem {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  timestamp: string;
  traceId?: string | null;
  errors?: ApiFieldError[];
}
