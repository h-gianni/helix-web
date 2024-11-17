export async function fetcher<TResponse>(
    url: string,
    options?: RequestInit
  ): Promise<TResponse> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }
  
    return data;
  }