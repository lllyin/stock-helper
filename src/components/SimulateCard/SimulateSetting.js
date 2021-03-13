import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import InputAdornment from '@material-ui/core/InputAdornment';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles(() => ({
  button: {
    color: '#888',
    textTransform: 'uppercase',
    fontSize: 15,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  center: {
    textAlign: 'center',
    '& input': {
      textAlign: 'center',
    },
  },
  mediumWidth: {
    width: 80,
  },
  tips: {
    fontSize: 14,
  },
}));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function SimulateSetting(props) {
  const classes = useStyles();
  const [values, setValues] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setValues(props.options);
  }, [props.options]);

  const handleInputChange = (e, key) => {
    setValues({
      ...values,
      [key]: e.target.value,
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {};

  const handleSubmit = (e) => {
    e.preventDefault();

    setOpen(false);
    props.onConfirm && props.onConfirm(values);
  };

  return (
    <>
      <IconButton aria-label="setting" onClick={handleClickOpen} className={classes.button}>
        <SettingsIcon className={classes.icon} />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id="alert-dialog-slide-title">模拟设置</DialogTitle>
          <DialogContent>
            {/* <DialogContentText id="alert-dialog-slide-description" className={classes.tips}>
              你可以通过导入JSON来快速初始化你的持仓数据。该操作会覆盖现有数据，请谨慎操作。
            </DialogContentText> */}
            <div className={classes.row}>
              设置上涨概率为
              <TextField
                required
                id="p"
                placeholder="0到1之间"
                type="number"
                value={values.p}
                onChange={(e) => handleInputChange(e, 'p')}
                InputProps={{
                  className: classes.center,
                }}
              />
            </div>
            <div className={classes.row}>
              日涨幅下跌
              <TextField
                required
                id="down_threshold"
                type="number"
                size="small"
                className={classes.mediumWidth}
                value={values.down_threshold}
                onChange={(e) => handleInputChange(e, 'down_threshold')}
                InputProps={{
                  endAdornment: <InputAdornment position="start">%</InputAdornment>,
                  className: classes.center,
                }}
              />
              加仓
              <TextField
                required
                id="down_position"
                type="number"
                size="small"
                className={classes.mediumWidth}
                value={values.down_position}
                onChange={(e) => handleInputChange(e, 'down_position')}
                InputProps={{
                  endAdornment: <InputAdornment position="start">手</InputAdornment>,
                  className: classes.center,
                }}
              />
            </div>
            <div className={classes.row}>
              日涨幅上涨
              <TextField
                required
                id="up_threshold"
                type="number"
                value={values.up_threshold}
                onChange={(e) => handleInputChange(e, 'up_threshold')}
                InputProps={{
                  endAdornment: <InputAdornment position="start">%</InputAdornment>,
                  className: classes.center,
                }}
                className={classes.mediumWidth}
              />
              减仓
              <TextField
                required
                id="up_position"
                label=""
                type="number"
                className={classes.mediumWidth}
                value={values.up_position}
                onChange={(e) => handleInputChange(e, 'up_position')}
                InputProps={{
                  endAdornment: <InputAdornment position="start">手</InputAdornment>,
                  className: classes.center,
                }}
              />
            </div>
            <div className={classes.row}>
              模拟
              <TextField
                required
                id="cycle"
                type="number"
                value={values.cycle}
                onChange={(e) => handleInputChange(e, 'cycle')}
                InputProps={{
                  endAdornment: <InputAdornment position="start">交易日</InputAdornment>,
                  className: classes.center,
                }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              取消
            </Button>
            <Button onClick={handleConfirm} color="primary" type="submit">
              确定
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
