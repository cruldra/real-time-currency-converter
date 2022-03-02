export default class StringUtils {
  /**
   * Capitalize the first letter of {@link str}
   * @param str
   */
  static capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
