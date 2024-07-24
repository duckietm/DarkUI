import { useRef, useState } from 'react';
import Overlay from 'react-bootstrap/esm/Overlay';

const BattlePassReward = (props) => {
  const [showContext, setShowContext] = useState(false);
  const target = useRef(null);

  return (
    <>
      <div onMouseEnter={() => setShowContext(true)} onMouseLeave={() => setShowContext(false)} ref={target} className='battlepass-reward' style={{backgroundImage: `url(${props.src})`, backgroundRepeat: "no-repeat", backgroundPosition: "center"}}>
        {props.vip !== null && props.vip && 
          <span className="badge bg-success text-white" style={{position: "relative", right: "-14px"}}>VIP</span>
        }
      </div>
      {showContext && 
        <Overlay target={target.current} show={true} placement="top">
          {({ placement, arrowProps, show: _show, popper, ...propis }) => (
            <div
              {...propis}
              style={{
                position: 'absolute',
                backgroundColor: 'rgba(0,0,0, 0.85)',
                padding: '2px 10px',
                color: 'white',
                zIndex: 99999999,
                borderRadius: 3,
                ...propis.style,
              }}
            >
              {props.name}
            </div>
          )}
        </Overlay>
      }
    </>
  )
}

export default BattlePassReward
