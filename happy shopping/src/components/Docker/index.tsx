import { useNavigate } from 'react-router-dom';
import './style.scss';

const items = [{
  name: 'home',
  url: '/home',
  icon: '&#xe600;',
  text: '首页'
}, {
  name: 'category',
  url: '/category',
  icon: '&#xe745;',
  text: '分类'
}, {
  name: 'cart',
  url: '/cart',
  icon: '&#xe633;',
  text: '购物车'
}, {
  name: 'my',
  url: '/my',
  icon: '&#xe612;',
  text: '我的'
}]

function Docker(props: { activeName: string }) {
  const navigate = useNavigate();
  const { activeName } = props;

  return (
    <div className='docker'>
      {
        items.map(item => (
          <div
            className={activeName === item.name ? 'docker-item docker-item-active' : 'docker-item'}
            onClick={() => { navigate(item.url) }}
            key={item.name}
          >
            <p className='iconfont docker-item-icon' dangerouslySetInnerHTML={{
              __html: item.icon
            }}></p>
            <p className='docker-item-title'>{item.text}</p>
          </div>
        ))
      }
    </div>
  )
}
export default Docker;