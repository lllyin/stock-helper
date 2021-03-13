import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import ImportExportIcon from '@material-ui/icons/ImportExport';

const useStyles = makeStyles(() => ({
  button: {
    color: '#888',
    textTransform: 'uppercase',
    fontSize: 15,
  },
  icon: {
    fontSize: 20,
  },
  tips: {
    fontSize: 14,
  },
}));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function Import(props) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
  };

  const handleTextChange = (e) => {
    const text = String(e.target.value).trim();
    setJsonText(text);

    text === '' && setError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let json = false;

    try {
      json = JSON.parse(jsonText);
      setError(false);
    } catch (error1) {
      setError('JSON解析错误, 请核验格式是否正确');
      return;
    }
    if (!Array.isArray(json)) {
      setError('JSON必须是一个持仓数组');
      return;
    }
    if (json) {
      setOpen(false);
      setJsonText('');
      props.onConfirm && props.onConfirm(json);
    }
  };

  return (
    <>
      <IconButton aria-label="import" size="small" onClick={handleClickOpen} className={classes.button}>
        <ImportExportIcon size="small" className={classes.icon} />
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
          <DialogTitle id="alert-dialog-slide-title">导入数据</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description" className={classes.tips}>
              你可以通过导入JSON来快速初始化你的持仓数据。该操作会覆盖现有数据，请谨慎操作。
            </DialogContentText>
            <TextField
              required
              autoFocus
              multiline
              rowsMax="6"
              rows="2"
              variant="outlined"
              margin="dense"
              name="position"
              id="position"
              label="JSON字符串"
              type="text"
              error={Boolean(error)}
              helperText={error}
              value={jsonText}
              onChange={handleTextChange}
              InputProps={{
                inputProps: {
                  pattern: /^\D/,
                },
              }}
              fullWidth
            />
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
