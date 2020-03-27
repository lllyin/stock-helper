import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import StockList from './StockList';

const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
}));

export default function StockPanel(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState('panel2');

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const { map, list, onSave } = props;

  return (
    <ExpansionPanel expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2bh-content" id="panel2bh-header">
        <Typography className={classes.heading}>持仓</Typography>
        {/* <Typography className={classes.secondaryHeading}>
            You are currently not an owner
          </Typography> */}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <StockList map={map} list={list} onSave={onSave} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}
