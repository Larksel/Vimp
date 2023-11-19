import React from 'react'

import Button from '@mui/material/Button'

import sizeConfigs from '../../configs/sizeConfigs'
import colorConfigs from '../../configs/colorConfigs'

const buttons = [
  { label: '-', action: () => window.electronAPI.minimize()},
  { label: '+', action: () => window.electronAPI.maximizeOrRestore()},
  { label: 'x', action: () => window.electronAPI.close()},
]

const sizes = sizeConfigs.appBar.buttons
const colors = colorConfigs.appBar.buttons

export default function WindowButtons() {
  return (
    <>
      {buttons.map((button, index) => (
        <Button
          key={index}
          onClick={button.action}
          sx={{
            borderRadius: 0,
            width: `${sizes.width}`,
            height: `${sizes.height}`,
            color: `${colors.text}`,
            ":hover": {
              bgcolor: `${index !== 2 ? colors.defaultHoverBg : colors.closeHoverBg}`
            }
          }}
        >
          {button.label}
        </Button>
      ))}
    </>
  )
}