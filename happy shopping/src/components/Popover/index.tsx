import { ReactNode } from 'react';
import './style.scss';

function Popover(props: {
  show: boolean,
  blankClickCallback: () => void,
  children: ReactNode
}) {
  const { show, blankClickCallback, children } = props;
  return show ? (
    <>
      <div className='popover-mask' onClick={blankClickCallback}></div>
      <div className='popover-content'>
        {children}
      </div>
    </>
  ): null;
}

export default Popover;