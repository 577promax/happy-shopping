//1.定义接口返回内容    登录返回结果类型
export type LoginResponseType = {
  // name: string;
  success: boolean,
  data: {
    token: string;
  }
}

//注册返回结果类型
export type RegisterResponseType = {
  success: boolean;
  data: boolean;
}