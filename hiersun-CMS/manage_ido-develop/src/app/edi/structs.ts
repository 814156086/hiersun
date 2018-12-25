/**
 * 分页结构
 */
export interface Page<T> {
  /**
   * 查询结果总数
   */
  total: number;
  /**
   * 分页大小。每页可承载的内容数量
   */
  pageSize: number;
  /**
   * 结果总页数。使用total和pageSize计算所得，total为0时，总页数为1，即一张空白页
   */
  totalPages: number;
  /**
   * 当前页页码。自然页码，第一页页码为1
   */
  currentPageNumber: number;
  /**
   * 当前页页码是否已经越界。页码大于总页数则为越界
   */
  overflow: boolean;
  /**
   * 当前页承载内容列表
   */
  content: Array<T>;
  /**
   * 当前页实际承载内容数
   */
  pageContentSize: number;
  /**
   * 当前页实际承载的第一个元素索引。自0计，如果当前页没有内容，值为-1
   */
  pageFirstIndex: number;
  /**
   * 当前页实际承载的最后一个元素索引。自0计，如果当前页没有内容，值为-1
   */
  pageLastIndex: number;
  /**
   * 当前页承载可承载是最大元素索引（假设total足够多)。自0计，如果当前页越界，值为-1
   */
  pageMaxIndex: number;
}

export interface ItemType {
  name: string;
  type: string;
}
