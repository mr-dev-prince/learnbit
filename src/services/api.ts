class ApiClient {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url);
    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.error?.message ?? 'Request failed');
    }
    return json.data;
  }

  async post<T>(url: string, body: unknown): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error?.message ?? 'Request failed');
    }

    return json.data;
  }

  async put<T>(url: string, body: unknown): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error?.message ?? 'Request failed');
    }
    return json.data;
  }

  async patch<T>(url: string, body: unknown): Promise<T> {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error?.message ?? 'Request failed');
    }
    return json.data;
  }

  async delete(url: string): Promise<void> {
    const response = await fetch(url, {
      method: 'DELETE',
    });

    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error?.message ?? 'Request failed');
    }
  }
}

export const api = new ApiClient();
