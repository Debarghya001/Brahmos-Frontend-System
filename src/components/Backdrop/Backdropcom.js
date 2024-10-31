import React from 'react'
import { Backdrop, CircularProgress } from '@mui/material'

const Backdropcom = ({loading}) => {
  return (
    <Backdrop
    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
    open={loading}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
  )
}

export default Backdropcom