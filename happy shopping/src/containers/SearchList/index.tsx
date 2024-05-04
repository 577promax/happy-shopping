import type { ResponseType } from './types';
import { useState } from 'react';
import './style.scss';
import { Link, useParams } from 'react-router-dom';
import useRequest from '../../hooks/useRequest';

const SearchList = () => {
  const params = useParams<{ shopId: string; keyword: string }>();
  const [keyword, setKeyword] = useState(params.keyword);
  const [tabValue, setTabValue] = useState('default');

  const [requestData, setRequestData] = useState({
    url: '/shopSearchList.json',
    method: 'GET',
    params: {
      keyword,
      shopId: params.shopId,
      type: tabValue
    }
  });

  const { data } = useRequest<ResponseType>(requestData);
  const list = data?.data || [];

  function handleClearKeyword() {
    setKeyword('');
  }

  function handleKeyDown(key: string) {
    if (key === 'Enter' && keyword) {
      // 更新本地存储内容
      const localSearchList = localStorage.getItem('search-list');
      const seachListHistory: string[] = localSearchList ? JSON.parse(localSearchList) : [];
      const keywordIndex = seachListHistory.findIndex(item => item === keyword);
      const newHistoryList = [...seachListHistory];
      if (keywordIndex > -1) {
        newHistoryList.splice(keywordIndex, 1)
      }
      newHistoryList.unshift(keyword);
      if (newHistoryList.length > 20) {
        newHistoryList.length = 20;
      }
      localStorage.setItem('search-list', JSON.stringify(newHistoryList));
      const newRequestData = { ...requestData };
      newRequestData.params.keyword = keyword;
      setRequestData(newRequestData);
    }
  }

  function handleTabClick(tabValue: string) {
    setTabValue(tabValue);
    const newRequestData = { ...requestData };
    newRequestData.params.type = tabValue;
    setRequestData(newRequestData);
  }

  return (
    <div className="page search-list-page">
      <div className='search'>
        <Link to={`/search/${params.shopId}`} className='search-back-link'>
          <div className='search-back-icon iconfont'>&#xe601;</div>
        </Link>
        <div className='search-area'>
          <div className='search-icon iconfont'>&#xe64e;</div>
          <input
            className='search-input'
            placeholder='请输入商品名称'
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={(e) => { handleKeyDown(e.key) }}
          />
        </div>
        <div className='search-clear iconfont' onClick={handleClearKeyword}>&#xe844;</div>
      </div>
      <div className='tab'>
        <div
          className={tabValue === 'default' ? 'tab-item tab-item-active' : 'tab-item'}
          onClick={() => handleTabClick('default')}
        >默认</div>
        <div
          className={tabValue === 'sales' ? 'tab-item tab-item-active' : 'tab-item'}
          onClick={() => handleTabClick('sales')}
        >销量</div>
        <div
          className={tabValue === 'price' ? 'tab-item tab-item-active' : 'tab-item'}
          onClick={() => handleTabClick('price')}
        >价格</div>
      </div>
      <div className='list'>
        {
          list.map(item => {
            return (
              <Link to={`/detail/${item.id}`} key={item.id}>
                <div className='item'>
                  <img alt={item.title} className='item-img' src={item.imgUrl} />
                  <div className='item-content'>
                    <p className='item-title'>{item.title}</p>
                    <div className='item-price'>
                      <span className='item-price-yen'>&yen;</span>
                      {item.price}
                    </div>
                    <div className='item-sales'>已售{item.sales}</div>
                  </div>
                </div>
              </Link>
            );
          })
        }
      </div>
      <div className='bottom'>
        - 我是有底线的 -
      </div>
    </div>
  )
}

export default SearchList;