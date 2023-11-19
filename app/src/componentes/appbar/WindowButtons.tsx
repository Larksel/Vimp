import React from 'react'

import Button from '@mui/material/Button'

import sizeConfigs from '../../configs/sizeConfigs'


const sizes = sizeConfigs.appBar.buttons

export default function WindowButtons() {
  return (
    <>
        <Button
          onClick={() => window.electronAPI.minimize()}
          sx={{
            width: `${sizes.width}`,
            height: `${sizes.height}`,
            borderRadius: 0,
            color: '#fff',
            bgcolor: '#ff0',
            ":hover": {
              bgcolor: '#eee'
            }
          }}
        >
          -
        </Button>
        <Button
          onClick={() => window.electronAPI.maximizeOrRestore()}
          sx={{
            width: `${sizes.width}`,
            height: `${sizes.height}`,
            borderRadius: 0,
            color: '#fff',
            bgcolor: '#ff0',
            ":hover": {
              bgcolor: '#eee'
            }
          }}
        >
          +
        </Button>
        <Button
          onClick={() => window.electronAPI.close()}
          sx={{
            width: `${sizes.width}`,
            height: `${sizes.height}`,
            borderRadius: 0,
            color: '#fff',
            bgcolor: '#ff0',
            ":hover": {
              bgcolor: '#eee'
            }
          }}
        >
          x
        </Button>
    </>
  )
}