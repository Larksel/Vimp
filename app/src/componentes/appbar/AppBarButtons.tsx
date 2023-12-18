import React, { useEffect, useState } from 'react'

import Button from '@mui/material/Button'

import sizeConfigs from '../../configs/sizeConfigs'
import colorConfigs from '../../configs/colorConfigs'

import HorizontalRuleSharpIcon from '@mui/icons-material/HorizontalRuleSharp';
import CropSquareSharpIcon from '@mui/icons-material/CropSquareSharp';
import FilterNoneSharpIcon from '@mui/icons-material/FilterNoneSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';

const sizes = sizeConfigs.appBar.buttons
const colors = colorConfigs.appBar.buttons

export default function AppBarButtons() {
  const [isMaximized, setIsMaximized] = useState<boolean>()

  const buttons = [
    { 
      label: <HorizontalRuleSharpIcon sx={{ fontSize: '18px' }} />, 
      action: () => window.electronAPI.minimize() 
    },
    { 
      label: isMaximized ? 
      <FilterNoneSharpIcon sx={{ rotate: '180deg', fontSize: '14px' }} /> 
      : <CropSquareSharpIcon sx={{ fontSize: '17px' }} />, 
      action: () => window.electronAPI.maximizeOrRestore()
    },
    { 
      label: <CloseSharpIcon sx={{ fontSize: '18px' }} />, 
      action: () => window.electronAPI.close()
    },
  ]
  

  return (
    <>
      {buttons.map((button, index) => (
        <Button
          key={index}
          onClick={button.action}
          disableRipple
          sx={{
            borderRadius: 0,
            minWidth: 0,
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