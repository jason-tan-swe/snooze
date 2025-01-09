import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function parseErrorResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  try {
    if (contentType.includes('application/json')) {
      const jsonError = await response.json()
      return {
        status: response.status,
        error: jsonError.detail || JSON.stringify(jsonError),
        type: 'json'
      }
    } else {
      const textError = await response.text()
      return {
        status: response.status,
        error: textError,
        type: 'text'
      }
    }
  } catch (e) {
    return {
      status: response.status,
      error: `Failed to parse error response: ${e.message}`,
      type: 'unknown'
    }
  }
}