import React, { useState } from 'react'
import { Fab, Menu, MenuItem, Fade } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { useHistory } from 'react-router-dom'

export default function FloatButton() {
  const history = useHistory()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleOpenMenu = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClick = (type) => {
    history.push(type)
    setAnchorEl(null)
  }

  return (
    <>
      <Fab
        color="primary"
        aria-label="menu"
        aria-controls="fade-menu"
        aria-haspopup="true"
        onClick={handleOpenMenu}
      >
        <MenuIcon />
      </Fab>

      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={() => handleClick('dashbord')}>行情</MenuItem>
        <MenuItem onClick={() => handleClick('positions')}>持仓</MenuItem>
      </Menu>
    </>
  )
}
