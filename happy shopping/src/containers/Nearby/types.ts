// 返回内容类型
export type ResponseType = {
  success: boolean;
  data: Array<{
    id: string;
    name: string,
    phone: string,
    address: string,
    distance: string;
    latitude: string;
    longitude: string;
  }>
}