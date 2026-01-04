/**
 * 存储工具类
 * 提供localStorage和sessionStorage操作方法
 */
export class Storage {
  /**
   * localStorage 存储
   */
  static set(key: string, value: any): void {

    // 检查值是否有效
    if (value === undefined) {
      console.error(`Storage.set - 不能存储 undefined 值，键: ${key}`);
      throw new Error(`不能存储 undefined 值，键: ${key}`);
    }

    // 检查是否是无效的字符串
    if (typeof value === 'string' && (value === 'undefined' || value === 'null')) {
      console.error(`Storage.set - 不能存储字符串 "${value}"，键: ${key}`);
      throw new Error(`不能存储字符串 "${value}"，键: ${key}`);
    }

    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Storage.set - 存储键 ${key} 时发生错误:`, error);
      throw error;
    }
  }

  static get<T>(key: string, defaultValue?: T): T {
    const value = localStorage.getItem(key);

    // 如果值为null，返回默认值
    if (!value) return defaultValue as T;

    // 检查是否是无效的字符串
    if (value === 'undefined' || value === 'null') {
      console.warn(`Storage.get - 检测到无效值 "${value}"，键: ${key}，已清理并返回默认值`);
      this.remove(key);
      return defaultValue as T;
    }

    try {
      return JSON.parse(value);
    } catch {
      // 如果解析失败，返回原始字符串
      // 如果解析失败，返回原始字符串
      console.warn(`Storage.get - 解析失败，返回原始字符串，键: ${key}`);
      return value as unknown as T;
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Storage.remove - 删除键 ${key} 时发生错误:`, error);
    }
  }

  /**
   * sessionStorage 存储
   */
  static sessionSet(key: string, value: any): void {

    // 检查值是否有效
    if (value === undefined) {
      console.error(`Storage.sessionSet - 不能存储 undefined 值，键: ${key}`);
      throw new Error(`不能存储 undefined 值，键: ${key}`);
    }

    // 检查是否是无效的字符串
    if (typeof value === 'string' && (value === 'undefined' || value === 'null')) {
      console.error(`Storage.sessionSet - 不能存储字符串 "${value}"，键: ${key}`);
      throw new Error(`不能存储字符串 "${value}"，键: ${key}`);
    }

    try {
      if (value === null) {
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Storage.sessionSet - 存储键 ${key} 时发生错误:`, error);
      throw error;
    }
  }

  static sessionGet<T>(key: string, defaultValue?: T): T {
    const value = sessionStorage.getItem(key);

    // 如果值为null，返回默认值
    if (!value) return defaultValue as T;

    // 检查是否是无效的字符串
    if (value === 'undefined' || value === 'null') {
      console.warn(`Storage.sessionGet - 检测到无效值 "${value}"，键: ${key}，已清理并返回默认值`);
      this.sessionRemove(key);
      return defaultValue as T;
    }

    try {
      return JSON.parse(value);
    } catch {
      // 如果解析失败，返回原始字符串

      console.warn(`Storage.sessionGet - 解析失败，返回原始字符串，键: ${key}`);
      return value as unknown as T;
    }
  }

  static sessionRemove(key: string): void {


    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Storage.sessionRemove - 删除键 ${key} 时发生错误:`, error);
    }

  }
}
