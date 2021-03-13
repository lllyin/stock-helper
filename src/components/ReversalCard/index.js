import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
  },
  face: {
    position: 'absolute',
    width: '100%',
    backfaceVisibility: 'hidden',
    transformStyle: 'preserve-3d',
    transition: 'transform 2s, visibility 2s',
  },
  back: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    transformStyle: 'preserve-3d',
    transition: 'transform 2s, visibility 2s',
  },
}));

function ReversalCard(props) {
  const { on = false, reversal, children, className = '' } = props;
  const classes = useStyles();
  const cardFaceEl = useRef(null);
  const [rect, setRect] = useState({});

  useEffect(() => {
    if (cardFaceEl) {
      const rect = cardFaceEl.current.getBoundingClientRect();
      setRect(rect);
    }
  }, []);

  return (
    <div
      className={`${className} ${classes.root}`}
      style={{
        width: rect.width,
        height: rect.height,
      }}
    >
      <div
        className={`reversal-card-face ${classes.face}`}
        style={{
          transform: on ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
        ref={cardFaceEl}
      >
        {children}
      </div>
      <div
        className={`reversal-card-back ${classes.back}`}
        style={{
          transform: on ? 'rotateY(0deg)' : 'rotateY(-180deg)',
          visibility: on ? 'visible' : 'hidden',
        }}
      >
        {reversal}
      </div>
    </div>
  );
}

function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
  // console.log('areEqual', nextProps.update, prevProps.on === nextProps.on);
  return prevProps.on === nextProps.on && prevProps.update === nextProps.update;
}

export default React.memo(ReversalCard, areEqual);
