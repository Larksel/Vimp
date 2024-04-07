import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';

import sizeConfigs from '../../configs/sizeConfigs';
import colorConfigs from '../../configs/colorConfigs';
import { scrollbarStyle } from '../../core/scrollbarStyle';
import logo from '../../assets/images/logo.png';

import NavButtons from './NavButtons';
import PlaylistList from './PlaylistList';

const colors = colorConfigs.sidebar;
const sizes = sizeConfigs.sidebar;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box
      component='nav'
      sx={{
        minWidth: collapsed ? '0px' : sizes.minWidth,
        maxWidth: collapsed ? '64px' : '300px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        gap: '8px',
        transition: 'all .15s ease',
      }}
    >
      <Box
        sx={{
          width: '100%',
          bgcolor: colors.bg,
          borderRadius: '8px',
        }}
      >
        {/* Main list */}
        <Button
          color='inherit'
          fullWidth
          disableRipple
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            height: sizes.navButton.height,
            borderRadius: '8px',
            paddingX: '15px',
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            textTransform: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              component='img'
              src={logo}
              sx={{
                height: '32px',
                width: '32px',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                objectFit: 'cover',
                userSelect: 'none',
              }}
            />
            <Typography
              variant='body1'
              sx={{
                transition: 'all .15s ease-out',
                opacity: collapsed ? 0 : 1,
                translate: collapsed ? '-5px' : 0,
                fontWeight: 'bold',
                color: '#ff6077',
                textAlign: 'center',
              }}
            >
              Vimp
            </Typography>
          </Box>
          <ChevronLeftRoundedIcon
            sx={{
              transition: 'all .15s ease-out',
              opacity: collapsed ? 0 : 1,
              position: 'absolute',
              right: '18px',
            }}
          />
        </Button>

        <NavButtons collapsed={collapsed} />
      </Box>

      <Box
        sx={[
          scrollbarStyle,
          {
            bgcolor: colors.bg,
            borderRadius: '8px',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            overflowY: 'auto',
            position: 'relative',
          },
        ]}
      >
        <PlaylistList collapsed={collapsed} />
      </Box>
    </Box>
  );
}
