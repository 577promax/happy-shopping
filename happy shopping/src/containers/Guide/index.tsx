
import './style.scss'
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';



const Guide = () => {
  //处理动画相关的逻辑
  const ref = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    ref.current.style.opacity = "1";
  }, [])


  //处理页面跳转相关的逻辑
  const navigate = useNavigate();
  function handleIconClick() {
    if (localStorage.getItem('token')) {
      navigate('/home');
    } else {
      navigate('/account/login');
    }

  }

  return (<div ref={ref} className="page guide-page">
    <img className='main-pic' src={require('../../static/img/halg_logo_icon_@2x.png')} alt="欢乐购" />
    <p className='title'>欢乐购</p>
    <img className="sub-pic" src={require("../../static/img/slogn_word_icon_@2x.png")} alt="欢乐购" />
    <div className='iconfont arrow-icon' onClick={handleIconClick}>&#xe60c;</div>
  </div>

  )
}
export default Guide;


