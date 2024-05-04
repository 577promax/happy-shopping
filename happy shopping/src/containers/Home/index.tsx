import 'swiper/css';
import './style.scss';
import type { ResponseType } from './types';
import { useEffect, useState } from 'react';
import Docker from '../../components/Docker';
import useRequest from '../../hooks/useRequest';
import Banner from './components/Banner';
import Category from './components/Category';
import Card from './components/Card';

// 默认请求数据
const defaultRequestData = {
  url: '/home.json',
  method: 'POST',
  data: {
    latitude: 37.7304167,
    longitude: -122.384425,
  }
}

const Home = () => {
  const localLocation = localStorage.getItem('location');
  const locationHistory = localLocation ? JSON.parse(localLocation) : null;

  if (locationHistory) {
    defaultRequestData.data.latitude = locationHistory.latitude;
    defaultRequestData.data.longitude = locationHistory.longitude;
  }

  const [requestData, setRequestData] = useState(defaultRequestData);
  const { data } = useRequest<ResponseType>(requestData);

  // 获取经纬度信息
  useEffect(() => {
    if (navigator.geolocation && !locationHistory) {
      console.log('get location');
      navigator.geolocation.getCurrentPosition((position) => {
        const { coords } = position;
        const { latitude, longitude } = coords;
        localStorage.setItem('location', JSON.stringify({
          latitude, longitude
        }));
        setRequestData({
          ...defaultRequestData,
          data: { latitude, longitude }
        });
      }, (error) => {
        console.log(error);
      }, { timeout: 500 })
    }
  }, [locationHistory]);

  let location, banners, categories, freshes = undefined;
  const dataResult = data?.data;
  if (dataResult) {
    location = dataResult.location;
    banners = dataResult.banners;
    categories = dataResult.categories;
    freshes = dataResult.freshes;
  }

  return (
    <div className='page home-page'>
      <Banner location={location} banners={banners} />
      <Category categories={categories} />
      <Card title='新品尝鲜' list={freshes} />
      <div className='bottom'>
        - 我是有底线的 -
      </div>
      <Docker activeName='home' />
    </div>
  )
}

export default Home;