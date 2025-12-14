/**
 * Utility type definitions
 */

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Nullable<T> = T | null;

export type AsyncData<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

