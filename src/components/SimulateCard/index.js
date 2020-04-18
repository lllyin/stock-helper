import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LineChart from '../Chart/LineChart';
import { simulate } from '../../utils/simulate';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
  },
}));

function SimulateCard(props) {
  const [lineSource, setuLineSource] = useState([]);
  const classes = useStyles();
  const { stock, options } = props;

  useEffect(() => {
    const simulateInitData = {
      costPrice: stock.costPrice,
      position: stock.position,
      earnRate: 0,
    };
    const simulateResult = simulate(simulateInitData, options);
    const { onlineRecords = [] } = simulateResult;
    const lineSource = [];

    onlineRecords.forEach((v, idx) => {
      lineSource.push({
        x: idx,
        y: v.earnRate,
        type: '预期收益',
      });
      lineSource.push({
        x: idx,
        y: (v.price || simulateInitData.costPrice) / simulateInitData.costPrice - 1,
        type: '市场收益',
      });
    });

    setuLineSource(lineSource);
  }, [props.options, props.update]);

  return (
    <div className={`simulate-card ${classes.root}`}>
      <LineChart data={{ source: lineSource }} width="100%" height="100%" />
    </div>
  );
}

export default React.memo(SimulateCard);
