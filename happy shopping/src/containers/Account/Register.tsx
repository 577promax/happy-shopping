



import type { RegisterResponseType } from './types';
import { useState } from 'react';
import useRequest from '../../hooks/useRequest';
import { message } from '../../utils/message';
import { useNavigate } from 'react-router-dom';




const Register = () => {

  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');


  //1.通过泛型传递给 useRequest 方法
  const { request } = useRequest<RegisterResponseType>({ manual: true });


  //点击 按钮时的操作
  function handleSubmitBtnClick() {
    if (!userName) {
      message('用户名不得为空');
      return;
    }
    if (!phoneNumber) {
      message('手机号码不得为空');
      return;
    }


    if (!password) {
      message('密码不得为空');
      return;
    }
    if (password.length < 6) {
      message('密码至少为六位');
      return;
    }
    if (password !== checkPassword) {
      message('两次密码输入不一致');
      return;
    }



    request(
      {
        url: '/register.json',
        method: 'POST',
        data: {
          user: userName,
          phone: phoneNumber,
          password: password,
        }
      }
    ).then((data) => {
      // if (data) {
      //   console.log(data.name);
      // }
      // data && console.log(data.name);

      if (data?.success) {
        navigate('/account/login')
      }
      // data && console.log(data);

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
          <div className="form-item-title">用户名</div>
          <input value={userName} className="form-item-content" placeholder="请输入用户名" onChange={(e) => {
            setUserName(e.target.value)
          }} />
        </div>

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
        <div className="form-item">
          <div className="form-item-title" >确认密码</div>
          <input value={checkPassword} type="password" className="form-item-content" placeholder="再次输入密码"
            onChange={(e) => {
              setCheckPassword(e.target.value)
            }} />
        </div>
      </div>
      <div className="submit" onClick={handleSubmitBtnClick}>
        注册
      </div>
    </>
  )
}
export default Register;


