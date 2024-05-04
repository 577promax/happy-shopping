// 返回内容类型
export type ResponseType = {
  success: boolean;
  data: Array<{
    id: string;
    keyword: string,
  }>
}