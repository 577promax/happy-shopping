// 返回内容类型
export type ResponseType = {
  success: boolean;
  data: Array<{
    id: string;
    imgUrl: string;
    title: string;
    price: number;
    sales: number;

  }>
}