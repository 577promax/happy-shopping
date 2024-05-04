import './style.scss';
import Docker from '../../components/Docker';
import useRequest from '../../hooks/useRequest';
import { ListItemType, ResponseType, SubmitResponseType, CartSubmitArray } from './types';
import { useEffect, useState } from 'react';
import { message } from '../../utils/message';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const navigate = useNavigate();
  const { request } = useRequest<ResponseType>({ manual: true });
  const { request: submitRequest } = useRequest<SubmitResponseType>({ manual: true });
  const [list, setList] = useState<ListItemType[]>([]);

  useEffect(() => {
    request({
      url: '/cartProducts.json',
      method: 'GET'
    }).then((data) => {
      const list = data.data;
      const newList = list.map(shop => {
        const newCartList = shop.cartList.map(product => {
          return { ...product, selected: false }
        })
        return { shopId: shop.shopId, shopName: shop.shopName, cartList: newCartList }
      })
      setList(newList);
    }).catch((e) => { message(e.message) })
  }, [request]);

  function handleCountChange(shopId: string, productId: string, count: string) {
    const newList = [...list];
    const shop = newList.find(shop => shop.shopId === shopId);
    shop?.cartList.forEach((product) => {
      if (product.productId === productId) {
        const countNumber = +count;
        product.count = Number.isNaN(countNumber) ? 0 : countNumber;
      }
    })
    setList(newList);
  }

  function handleProductClick(shopId: string, productId: string) {
    const newList = [...list];
    const shop = newList.find(shop => shop.shopId === shopId);
    let shopAllSelected = true;
    shop?.cartList.forEach((product) => {
      if (product.productId === productId) {
        product.selected = !product.selected;
      }
      if (!product.selected) {
        shopAllSelected = false;
      }
    });
    shop!.selected = shopAllSelected;
    setList(newList);
  }

  function handleShopSelectClick(shopId: string) {
    const newList = [...list];
    const shop = newList.find(shop => shop.shopId === shopId);
    shop?.cartList.forEach((product) => {
      product.selected = true;
    })
    shop!.selected = true;
    setList(newList);
  }

  function handleSelectAllClick() {
    const newList = [...list];
    newList.forEach(shop => {
      shop.selected = true;
      shop.cartList.forEach(product => {
        product.selected = true
      })
    })
    setList(newList);
  }

  const notSelectedShop = list.find(shop => !shop.selected);
  let count = 0;
  let totalPrice = 0;
  list.forEach(shop => {
    shop.cartList.forEach(product => {
      if (product.selected) {
        count++;
        totalPrice += (product.count * product.price);
      }
    })
  })

  function handleCartSubmit() {
    const params: CartSubmitArray = []
    list.forEach(shop => {
      shop.cartList.forEach(product => {
        if (product.selected) {
          params.push({
            productId: product.productId,
            count: product.count
          })
        }
      })
    })
    if (params.length === 0) {
      message('您没有勾选任何购物车中的商品，无法创建订单');
      return;
    }
    submitRequest({
      url: '/cartSubmit.json',
      method: 'POST',
      data: params
    }).then(response => {
      const { orderId } = response.data;
      navigate(`/order/${orderId}`);
    }).catch(e => message(e.message));
  }

  return (
    <div className='page cart-page'>
      <div className='title'>购物车</div>
      {
        list.map(shop => {
          return (
            <div className='shop' key={shop.shopId}>
              <div className='shop-title' onClick={() => { handleShopSelectClick(shop.shopId) }}>
                <div className={shop.selected ? 'radio radio-active' : 'radio'}></div>
                <span className='iconfont'>&#xe6d8;</span>{shop.shopName}
              </div>
              <div className='shop-products'>
                {
                  shop.cartList.map(product => {
                    return (
                      <div
                        className='shop-product'
                        key={product.productId}
                        onClick={() => {
                          handleProductClick(shop.shopId, product.productId)
                        }}
                      >
                        <div className={product.selected ? 'radio radio-active' : 'radio'}></div>
                        <img src={product.imgUrl} className='shop-product-img' />
                        <div className='shop-product-content'>
                          <div className='shop-product-title'>
                            {product.title}
                          </div>
                          <div className='shop-product-kilo'>
                            {product.weight}
                          </div>
                          <div className='shop-product-price'>
                            <span className='shop-product-price-yen'>&yen;</span>{product.price}
                          </div>
                          <input className='shop-product-count' onChange={(e) => { handleCountChange(shop.shopId, product.productId, e.target.value) }} value={product.count} onClick={(e) => { e.stopPropagation() }} />
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )
        })
      }
      <div className='total-price'>
        <div className='select-all' onClick={handleSelectAllClick}>
          <div className={notSelectedShop ? 'radio' : 'radio radio-active'}></div>
          <div className='select-all-text'>全选</div>
        </div>
        <div className='total'>
          <span className='total-text'>合计:</span>
          <div className='total-price-inner'><span className='total-price-inner-yen'>&yen;</span>{totalPrice.toFixed(1)}</div>
        </div>
        <div className='check' onClick={handleCartSubmit}>结算（{count}）</div>
      </div>
      <Docker activeName='cart' />
    </div>
  )
}

export default Cart;