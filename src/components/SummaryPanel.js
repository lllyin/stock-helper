import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
}));

export default function StockPanel() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2bh-content" id="panel2bh-header">
        <Typography className={classes.heading}>总览</Typography>
        {/* <Typography className={classes.secondaryHeading}>
            You are currently not an owner
          </Typography> */}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography className={classes.secondaryHeading}>You are currently not an owner</Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}
