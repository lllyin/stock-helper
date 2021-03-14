import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import StockList from '../StockList';

const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  panel: {
    padding: '8px 18px 24px',
  },
}));

export default function StockPanel(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState('panel2');

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const { map, list, onSave, dispatch } = props;

  return (
    <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2bh-content" id="panel2bh-header">
        <Typography className={classes.heading}>持仓</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.panel}>
        <StockList map={map} list={list} onSave={onSave} dispatch={dispatch} />
      </AccordionDetails>
    </Accordion>
  );
}
