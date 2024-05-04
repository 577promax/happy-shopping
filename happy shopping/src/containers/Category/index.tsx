import './style.scss';
import { CartType, ProductType, CartResponseType, CategoryAndTagResponseType, ProductResponseType } from './types';
import { useEffect, useState } from 'react';
import { message } from '../../utils/message';
import useRequest from '../../hooks/useRequest';
import Docker from '../../components/Docker';
import Popover from '../../components/Popover';
import { CartChangeResponseType } from '../../types';
import { useNavigate } from 'react-router-dom';

const Category = () => {
  const navigate = useNavigate();
  // 列表项目数据的存储
  const [products, setProducts] = useState<Array<ProductType>>([])
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [tags, setTags] = useState<string[]>([]);
  // 驱动请求重新发送的数据
  const [keyword, setKeyword] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [currentCategory, setCurrentCategory] = useState('');
  // 购物车相关逻辑
  const [showCart, setShowCart] = useState(false);
  const [cartProductInfo, setCartProductInfo] = useState<CartType>({
    id: '', title: '', imgUrl: '', price: '', count: 0
  })
  // 根据页面要求，动态发送请求
  const { request: tagRequest } = useRequest<CategoryAndTagResponseType>({ manual: true });

  const { request: productRequest } = useRequest<ProductResponseType>({ manual: true });

  // 获取购物车内容信息
  const { request: cartRequest } = useRequest<CartResponseType>({ manual: true });

  // 更新购物车内容
  const { request: cartChangeRequest } = useRequest<CartChangeResponseType>({ manual: true });

  useEffect(() => {
    productRequest({
      url: '/categoryProduct.json',
      method: 'POST',
      data: {
        tag: currentTag,
        keyword,
        category: currentCategory
      }
    }).then((data) => {
      if (data?.success) {
        const result = data.data;
        setProducts(result);
      }
    }).catch((e: any) => {
      message(e?.message);
    });
  }, [keyword, currentTag, currentCategory, productRequest]);

  useEffect(() => {
    tagRequest({
      url: '/categoryAndTagList.json',
      method: 'GET',
    }).then((data) => {
      if (data?.success) {
        const result = data.data;
        setCategories(result.category);
        setTags(result.tag);
      }
    }).catch((e: any) => {
      message(e?.message);
    });
  }, [tagRequest]);

  // 处理搜索内容变更函数
  function handleKeyDown(key: string, target: EventTarget & HTMLInputElement) {
    if (key === 'Enter') {
      setKeyword(target.value);
    }
  }

  function handleProductClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>, productId: string) {
    e.stopPropagation();
    cartRequest({
      url: '/cartProductInfo.json',
      method: 'GET',
      params: { productId }
    }).then((data) => {
      setCartProductInfo(data.data);
      setShowCart(true);
    }).catch(e => {
      message(e.message);
    })
  }

  function handleCartNumberChange(type: 'minus' | 'add') {
    const newCartProductInfo = { ...cartProductInfo };
    const { count } = newCartProductInfo;
    if (type === 'minus') {
      newCartProductInfo.count = (count - 1) < 0 ? 0 : (count - 1);
    } else {
      newCartProductInfo.count = count + 1;
    }
    setCartProductInfo(newCartProductInfo);
  }

  function closeMask() {
    setShowCart(false);
  }

  function changeCartInfo() {
    cartChangeRequest({
      url: '/cartChange.json',
      method: 'GET',
      params: { id: cartProductInfo.id, count: cartProductInfo.count }
    }).then(() => {
      setShowCart(false);
    }).catch((e) => {
      message(e.message);
    })
  }

  return (
    <div className="page category-page">
      <div className='title'>
        分类
      </div>
      <div className='search'>
        <div className='search-area'>
          <div className='search-icon iconfont'>&#xe64e;</div>
          <input
            className='search-input'
            placeholder='请输入商品名称'
            onKeyDown={(e) => { handleKeyDown(e.key, e.currentTarget) }}
          />
        </div>
      </div>
      <div className='category'>
        <div
          className={currentCategory === '' ? 'category-item category-item-active' : 'category-item'}
          onClick={() => { setCurrentCategory('') }}
        >全部商品</div>
        {
          categories.map(category => {
            return (
              <div
                className={category.id === currentCategory ? 'category-item category-item-active' : 'category-item'}
                key={category.id}
                onClick={() => { setCurrentCategory(category.id) }}
              >{category.name}</div>)
          })
        }
      </div>
      <div className='tag'>
        <div
          onClick={() => setCurrentTag('')}
          className={currentTag === '' ? 'tag-item tag-item-active' : 'tag-item'}
        >全部</div>
        {
          tags.map((tag, index) => (
            <div
              className={tag === currentTag ? 'tag-item tag-item-active' : 'tag-item'}
              key={tag + index}
              onClick={() => setCurrentTag(tag)}
            >{tag}</div>
          ))
        }
      </div>
      <div className='product'>
        <div className='product-title'>精品商品（{products.length}）</div>
        {
          products.map(product => {
            return (
              <div className='product-item' key={product.id} onClick={() => {
                navigate(`/detail/${product.id}`)
              }}>
                <img className='product-item-img' src={product.imgUrl} alt={product.title} />
                <div className='product-item-content'>
                  <div className='product-item-title'>
                    {product.title}
                  </div>
                  <div className='product-item-sales'>
                    月售{product.sales}
                  </div>
                  <div className='product-item-price'>
                    <span className='product-item-price-yen'>&yen;</span>{product.price}
                  </div>
                  <div
                    className='product-item-button'
                    onClick={(e) => { handleProductClick(e, product.id) }}
                  >
                    购买
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
      <Docker activeName='category' />
      <Popover show={showCart} blankClickCallback={closeMask}>
        <div className='cart'>
          <div className='cart-content'>
            <img src={cartProductInfo.imgUrl} alt={cartProductInfo.title} className='cart-content-img' />
            <div className='cart-content-info'>
              <div className='cart-content-title'>{cartProductInfo.title}</div>
              <div className='cart-content-price'>
                <span className='cart-content-price-yen'>&yen;</span>
                {cartProductInfo.price}
              </div>
            </div>
          </div>
          <div className='cart-count'>
            <div className='cart-count-content'>
              购买数量
              <div className='cart-count-counter'>
                <div className='cart-count-button' onClick={() => handleCartNumberChange('minus')}>-</div>
                <div className='cart-count-text'>{cartProductInfo.count}</div>
                <div className='cart-count-button' onClick={() => { handleCartNumberChange('add') }}>+</div>
              </div>
            </div>
          </div>
          <div className='cart-buttons'>
            <div className='cart-button cart-button-left' onClick={changeCartInfo}>加入购物车</div>
            <div className='cart-button cart-button-right'>立即购买</div>
          </div>
        </div>
      </Popover>
    </div>
  )
}

export default Category;