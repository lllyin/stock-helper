import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import FloatButtom from '../FloatButtom'

const useStyles = makeStyles({
  navbar: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    borderRadius: 6,
    overflow: 'hidden',
    boxShadow: '1px 1px 5px 1px #eee',
  },
});

export default function BasicLayout(props) {
  const { children } = props
  const classes = useStyles()

  return (
    <Container fixed>
      { children }

        <div className={classes.navbar}>
          <FloatButtom />
        </div>
    </Container>
  )
}
