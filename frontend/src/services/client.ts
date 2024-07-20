const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

interface RequestOptions extends RequestInit {
  url: string
}

class HTTPError extends Error {
  status: number
  response: unknown

  constructor(message: string, status: number, response: unknown) {
    super(message)
    this.status = status
    this.response = response
  }
}

class APIClient {
  baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private mergeHeaders(headers?: HeadersInit): HeadersInit {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    return headers ? { ...defaultHeaders, ...headers } : defaultHeaders
  }

  async request<T>({ url, headers, ...options }: RequestOptions): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: this.mergeHeaders(headers),
    })

    if (!response.ok) {
      const responseBody = await response.json()
      throw new HTTPError('HTTP Error', response.status, responseBody)
    }

    return response.json()
  }

  get<T>(url: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>({
      url,
      method: 'GET',
      headers,
    })
  }

  post<T>(url: string, data: unknown, headers?: HeadersInit): Promise<T> {
    return this.request<T>({
      url,
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
  }

  put<T>(url: string, data: unknown, headers?: HeadersInit): Promise<T> {
    return this.request<T>({
      url,
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    })
  }

  delete<T>(url: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>({
      url,
      method: 'DELETE',
      headers,
    })
  }
}

export const apiClient = new APIClient(API_BASE_URL)
