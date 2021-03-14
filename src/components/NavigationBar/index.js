import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FavoriteIcon from '@material-ui/icons/Favorite';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    width: 500,
  },
});

export default function NavigationBar() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const history = useHistory();

  const handleNavChange = (e, type) => {
    history.push(type)
    setValue(type)
  }

  return (
    <BottomNavigation
      value={value}
      onChange={handleNavChange}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label="行情" value="dashbord" icon={<TrendingUpIcon />}/>
      <BottomNavigationAction label="持仓" value="positions" icon={<FavoriteIcon />} />
    </BottomNavigation>
  );
}
