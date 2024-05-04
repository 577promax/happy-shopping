import { useNavigate } from 'react-router-dom';
import { CardListType } from '../types';

type CardPropsType = {
  title: string;
  list: CardListType | undefined;
}

const Card = (props: CardPropsType) => {
  const { title, list } = props;

  const navigate = useNavigate();

  function handleItemClick(productId: string) {
    navigate(`/detail/${productId}`);
  }

  return (
    <div className='card'>
      <h3 className='card-title'>
        <img
          alt={title}
          className='card-title-img'
          src='http://statics.dell-lee.com/shopping/hot.png'
        />
        {title}
        <div className='card-title-more'>更多<span className='iconfont'>&#xe613;</span></div>
      </h3>
      <div className='card-content'>
        {
          (list || []).map((item) => {
            return (
              <div className='card-content-item' key={item.id} onClick={() => handleItemClick(item.id)}>
                <img
                  alt={item.name}
                  className='card-content-item-img'
                  src={item.imgUrl}
                />
                <p className='card-content-item-desc'>{item.name}</p>
                <div className='card-content-item-price'>
                  <span className='card-content-item-yen'>&yen;</span>
                  {item.price}
                  <div className='iconfont'>&#xe7e0;</div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Card;