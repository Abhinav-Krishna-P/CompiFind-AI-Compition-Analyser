export type BaseErrorCode = 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'INTERNAL_ERROR'

export type Result<T, E extends string = BaseErrorCode> =
  | { success: true; data: T }
  | { success: false; error: E }

export type FormState<T, E extends string = BaseErrorCode> = {
  values?: T
  fieldErrors: null | Partial<Record<keyof T, string[]>>
  error?: E
  success: boolean
}

export function toFieldErrors<T>(error: import('payload').ValidationError): FormState<T>['fieldErrors'] {
  const result: Partial<Record<keyof T, string[]>> = {}
  for (const { path, message } of error.data.errors) {
    const key = path as keyof T
    ;(result[key] ??= []).push(message)
  }
  return result
}
