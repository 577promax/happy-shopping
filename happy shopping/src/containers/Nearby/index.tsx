
import './style.scss';
import useRequest from '../../hooks/useRequest';
import { ResponseType } from './types'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const localLocation = localStorage.getItem('location')
const locationHistory = localLocation ? JSON.parse(localLocation) : null;

//默认请求数据
const defaultRequestData = {
  url: '/nearby.json',
  method: 'POST',
  data: {
    latitude: locationHistory ? locationHistory.latitude : 37.7304167,
    longitude: locationHistory ? locationHistory.longitude : -122.384425,
  }
}

const Nearby = () => {



  const { data } = useRequest<ResponseType>(defaultRequestData);
  const [Keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const list = (data?.data || []).filter(
    item => { return item.name.indexOf(Keyword) > -1 });

  function handleItemClick(latitude: string, longitude: string) {
    localStorage.setItem('location', JSON.stringify({
      latitude, longitude
    }));
    navigate('/home')
  }

  return (
    <div className='page nearby-page'>
      <div className='title'>
        <Link to='/home'>
          <div className='iconfont title-icon'>&#xe662;</div>
        </Link>
        切换门店
      </div>
      <div className='search'>
        <div className='search-icon iconfont'>&#xe687;</div>
        <input className='search-input'
          placeholder='请输入地址'
          value={Keyword}
          onChange={(e) => { setKeyword(e.target.value) }} />
      </div>

      <div className='subtitle'>附近门店</div>
      <ul className='list'>
        {
          list.map(item => {
            return (
              <li className='list-item'
                key={item.id}
                onClick={() => {
                  handleItemClick(item.latitude, item.longitude)
                }}>
                <div className='list-item-left'>
                  <div className='list-item-title'>{item.name}</div>
                  <p className='list-item-desc'>联系电话：{item.phone}</p>
                  <p className='list-item-desc'>{item.address}</p>
                </div>
                <div className='list-item-right'>
                  <span className='iconfont list-item-distance'>&#xe83d;</span>
                  {item.distance}
                </div>
              </li>
            )
          })
        }

      </ul>
    </div >
  )


}

export default Nearby;