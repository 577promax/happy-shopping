



import type { LoginResponseType } from './types';
import useRequest from '../../hooks/useRequest';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { message } from '../../utils/message';




const Login = () => {


  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  //1.通过泛型传递给 useRequest 方法
  const { request } = useRequest<LoginResponseType>({ manual: true });


  //点击按钮时的操作
  function handleSubmitBtnClick() {
    if (!phoneNumber) {
      message('手机号码不得为空');
      return;
    }
    if (!password) {
      message('密码不得为空');
      return;
    }


    request(
      {
        url: '/login.json',
        method: 'POST',
        data: {
          phone: phoneNumber,
          password: password,
        }
      }
    ).then((data) => {
      const { data: { token } } = data;
      if (token) {
        localStorage.setItem('token', token);
        navigate('/home');
      }
    }).catch((e: any) => {
      // alert(e?.message)
      // setShowModal(true);
      // setMessage(e?.message || '未知异常');
      message(e?.message);
    });
  }
  return (
    <>
      <div className="form">
        <div className="form-item">
          <div className="form-item-title">手机号</div>
          <input value={phoneNumber} className="form-item-content" placeholder="请输入手机号码" onChange={(e) => {
            setPhoneNumber(e.target.value)
          }} />
        </div>

        <div className="form-item">
          <div className="form-item-title" >密码</div>
          <input value={password} type="password" className="form-item-content" placeholder="请输入密码"
            onChange={(e) => {
              setPassword(e.target.value)
            }} />
        </div>
      </div>
      <div className="submit" onClick={handleSubmitBtnClick}>
        登录
      </div>
      <p className="notice">
        *登录即表示你同意使用条款和隐私政策
      </p>
    </>
  )
}
export default Login;


