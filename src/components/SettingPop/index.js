import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import InputAdornment from '@material-ui/core/InputAdornment';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';

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
      width: 150,
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

const Transition = React.forwardRef((props, ref) => <Slide direction='up' ref={ref} {...props} />);

export default function SimulateSetting(props) {
  const classes = useStyles();
  const [values, setValues] = useState(props.data);
  const [open, setOpen] = useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const handleInputChange = (e, key) => {
    setValues({
      ...values,
      [key]: e.target.value,
    });
  };

  const handleClose = () => {
    props.onClose && props.onClose(true);
  };

  const handleConfirm = () => {
    // props.onClose && props.onClose(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    props.onClose && props.onClose(true);
    props.onConfirm && props.onConfirm(values);
  };

  console.log('values', props);

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id='alert-dialog-slide-title'>估值设置</DialogTitle>
          <DialogContent>
            {/* <DialogContentText id="alert-dialog-slide-description" className={classes.tips}>
              你可以通过导入JSON来快速初始化你的持仓数据。该操作会覆盖现有数据，请谨慎操作。
            </DialogContentText> */}
            <div className={classes.row}>
              总股本：
              <TextField
                required
                id='issue'
                type='number'
                value={values?.issue}
                onChange={(e) => handleInputChange(e, 'issue')}
                InputProps={{
                  endAdornment: <InputAdornment position='start'>亿</InputAdornment>,
                  className: classes.center,
                }}
              />
            </div>
            <div className={classes.row}>
              预期EPS：
              <TextField
                required
                id='eps'
                placeholder='每股收益'
                type='number'
                value={values?.eps}
                onChange={(e) => handleInputChange(e, 'eps')}
                InputProps={{
                  className: classes.center,
                }}
              />
            </div>

            <div className={classes.row}>
              预期净利润：
              <TextField
                required
                id='profits'
                placeholder='年净利润'
                type='number'
                value={values?.profits}
                onChange={(e) => handleInputChange(e, 'profits')}
                InputProps={{
                  endAdornment: <InputAdornment position='start'>亿</InputAdornment>,
                  className: classes.center,
                }}
              />
            </div>

            <div className={classes.row}>
              参考PE：
              <TextField
                required
                id='pe'
                type='number'
                value={values?.pe}
                placeholder='参考市盈率'
                onChange={(e) => handleInputChange(e, 'pe')}
                InputProps={{
                  endAdornment: <InputAdornment position='start'>倍</InputAdornment>,
                  className: classes.center,
                }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='primary'>
              取消
            </Button>
            <Button onClick={handleConfirm} color='primary' type='submit'>
              确定
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
