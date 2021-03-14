import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { isEmpty } from '@/shared/utils'

const useStyles = makeStyles(theme => ({
  panel: {
    display: 'block',
  },
  detial: {
    display: 'block',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  defaultColor: {
    color: '#888',
  },
}));

export default function SummaryPanel(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const { summary = {}, list = [] } = props;
  const _isEmpty = isEmpty(summary) || isEmpty(list)

  return (
    <ExpansionPanel className={classes.haha} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2bh-content" id="panel2bh-header">
        <Typography className={classes.heading}>总览</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.detial}>
        {_isEmpty ? (
          <>
            <Typography display="inline" color="error">
              请先添加持仓，才能查看总览。
            </Typography>
            <Typography display="inline" className={classes.defaultColor} variant="body1">
              或者点击上方的RESET按钮,参看示例数据。
            </Typography>
          </>
        ) : (
          <>
            <Typography display="block" paragraph>
              <span>你持仓的总市值为{summary.marketValue}。</span>
              <span>总成本为{summary.costValue}。</span>
              <span>
                目前{summary.earnMoney >= 0 ? '盈利' : '亏损'} {Math.abs(summary.earnMoney)}元。
              </span>
              <span>盈亏率：{(summary.earnRate * 100).toFixed(2)}%。</span>
            </Typography>
            {Object.keys(summary.advice || {}).length > 0 && (
              <Typography display="block" color="error">
                建议账户保留流动资金{summary.advice?.hotMoney}元，以应对风险。
              </Typography>
            )}
          </>
        )}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}
