import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  face: {
    position: 'absolute',
    width: '100%',
    backfaceVisibility: 'hidden',
    transformStyle: 'preserve-3d',
    transition: 'transform 2s',
  },
  back: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    transformStyle: 'preserve-3d',
    transition: 'transform 2s',
  },
}));

export default function ReversalCard(props) {
  const { on = false, reversal, children, className = '' } = props;
  const classes = useStyles();
  const cardFaceEl = useRef(null);
  const [rect, setRect] = useState({});
  const [isFirstIn, setIsFirstIn] = useState(true);

  useEffect(() => {
    if (cardFaceEl) {
      const rect = cardFaceEl.current.getBoundingClientRect();
      setRect(rect);
    }
    setIsFirstIn(true);
  }, []);

  useEffect(() => {
    setIsFirstIn(false);
  }, [on]);

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
        }}
      >
        {on || !isFirstIn ? reversal : null}
      </div>
    </div>
  );
}
