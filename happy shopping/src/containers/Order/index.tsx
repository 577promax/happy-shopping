import './style.scss';
import { ResponseType, ResponseDataType, AddressItemType, AddressResponseType, PaymentResponseType } from './type';
import { useEffect, useState } from 'react'; import { useNavigate, useParams } from 'react-router-dom';
import { Picker } from 'antd-mobile'

import useRequest from '../../hooks/useRequest';
import { message } from '../../utils/message';
import Popover from '../../components/Popover';

function Order() {
  const { request } = useRequest<ResponseType>({ manual: true });
  const { request: addressRequest } = useRequest<AddressResponseType>({ manual: true });
  const [data, setData] = useState<ResponseDataType | null>(null);
  const [showAddress, setShowAddress] = useState(false);
  const [addressList, setAddressList] = useState<AddressItemType[]>([])

  const { request: paymentRequest } = useRequest<PaymentResponseType>({ manual: true });
  const [showPayment, setShowPayment] = useState(false);
  const [payWay, setPayWay] = useState('weixin');

  const [showTimeRange, setShowTimeRange] = useState(false);

  const params = useParams<{ id: string }>();

  const navigate = useNavigate();

  useEffect(() => {
    request({
      url: '/orderDetail.json',
      method: 'GET',
      params: { id: params.id }
    }).then((response) => {
      setData(response.data);
    }).catch(e => {
      message(e.message)
    })
  }, [params, request]);

  function handleReceiverClick() {
    setShowAddress(true);
    addressRequest({
      url: '/userAddress.json',
      method: 'GET'
    }).then((response) => {
      setAddressList(response.data);
    }).catch(e => {
      message(e.message)
    })
  }

  function handleAddressClick(address: AddressItemType) {
    if (data) {
      const newData = { ...data };
      newData.address = address;
      setData(newData);
    }
    setShowAddress(false);
  }

  function handleOrderSubmit() {
    const orderId = params.id;
    const addressId = data?.address.id;
    const time = data?.time;
    paymentRequest({
      method: 'POST',
      url: '/pay.json',
      data: {
        orderId,
        addressId,
        time,
        payWay
      }
    }).then((response) => {
      if (response.data) {
        navigate('/home')
      } else {
        message('支付失败');
      }
    }).catch(e => {
      message(e.message)
    })

  }

  return data ? (
    <div className='page order-page'>
      <div className='title'>确认订单</div>
      <div className='receiver' onClick={handleReceiverClick}>
        <div className='iconfont'>&#xe650;</div>
        <div className='receiver-content'>
          <div className='receiver-name'>
            收货人:  {data.address.name}
            <span className='receiver-phone'>{data.address.phone}</span>
          </div>
          <div className='receiver-address'>
            收货人地址: {data.address.address}
          </div>
        </div>
      </div>
      <div className='delivery'>
        <div className='delivery-text'>送达时间</div>
        <div className='delivery-select' onClick={() => { setShowTimeRange(true) }}>{data.time?.[0]} {data.time?.[1]}:{data.time?.[2]}</div>
      </div>
      {
        data.shop.map(shop => (
          <div key={shop.shopId}>
            <div className='shop'>
              <div className='shop-title' >
                <span className='iconfont'>&#xe6d8;</span>{shop.shopName}
              </div>
              <div className='shop-products'>
                {
                  shop.cartList.map(product => (
                    <div className='shop-product' key={product.productId}>
                      <img src={product.imgUrl} alt={product.title} className='shop-product-img' />
                      <div className='shop-product-content'>
                        <div className='shop-product-title'>
                          {product.title}
                        </div>
                        <div className='shop-product-kilo'>
                          {product.weight}
                        </div>
                      </div>
                      <div className='shop-product-order'>
                        <div>&yen;{product.price}</div>
                        <div>X{product.count}</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        ))
      }

      <div className='footer'>
        <div className='footer-total'>
          合计：<span className='footer-total-price'>
            <span className='footer-total-yen'>
              &yen;
            </span>
            {data.total}
          </span>
        </div>
        <div className='footer-submit' onClick={() => { setShowPayment(true) }}>提交订单</div>
      </div>
      <Popover show={showAddress} blankClickCallback={() => { setShowAddress(false) }}>
        <div className='address-popover'>
          <div className='address-popover-title'>选择地址</div>
          {
            addressList?.map((address) => (
              <div className='address-item' key={address.id} onClick={() => handleAddressClick(address)}>
                <div className='address-item-name'>
                  收货人:  {address.name}
                  <span className='address-item-phone'>{address.phone}</span>
                </div>
                <div className='address-item-address'>
                  收货人地址: {address.address}
                </div>
              </div>
            ))
          }
        </div>
      </Popover>
      <Popover show={showPayment} blankClickCallback={() => { setShowPayment(false) }}>
        <div className='payment-popover'>
          <div className='payment-popover-title'>选择地址</div>
          <div className='payment-popover-price'>&yen; {data.total}</div>
          <div className='payment-popover-products'>
            <div className='payment-popover-product' onClick={() => { setPayWay('weixin') }}>
              <img className='payment-popover-img' src='http://statics.dell-lee.com/shopping/weixin.png' alt='微信' />
              微信
              <div className={payWay === 'weixin' ? 'radio radio-active' : 'radio'}></div>
            </div>
            <div className='payment-popover-product' onClick={() => { setPayWay('cash') }}>
              <img className='payment-popover-img' src='http://statics.dell-lee.com/shopping/cash.png' alt='微信' />
              余额（{data.money}）
              <div className={payWay === 'cash' ? 'radio radio-active' : 'radio'}></div>
            </div>
          </div>
          <div className='payment-popover-button' onClick={handleOrderSubmit}>立即支付</div>
        </div>
      </Popover>
      <Picker
        columns={data.timeRange || []}
        visible={showTimeRange}
        onClose={() => {
          setShowTimeRange(false)
        }}
        value={data?.time}
        onConfirm={value => {
          if (data) {
            const newData = { ...data };
            newData.time = value as string[];
            setData(newData);
          }
          setShowTimeRange(false)
        }}
      />
    </div>
  ) : null;
}

export default Order;