export interface IRedisService {
  set(key: string, value: string, expireInSeconds?: number): Promise<void>;
  get(key: string): Promise<string | null>;
  delete(key: string): Promise<boolean>;
  exists(key: string): Promise<boolean>;
}
