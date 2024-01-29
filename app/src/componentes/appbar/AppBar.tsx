import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import sizeConfigs from '../../configs/sizeConfigs';

import AppBarButtons from './AppBarButtons';
import logo from '../../assets/images/logo.png';

const sizes = sizeConfigs.appBar;

export default function AppBar() {
  return (
    <Box
      sx={{
        height: `${sizes.height}`,
        width: `${sizes.width}`,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        WebkitUserSelection: 'none',
        WebkitAppRegion: 'drag',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
          ml: '24px',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          component='img'
          src={logo}
          sx={{
            height: `${sizes.logo}`,
            width: `${sizes.logo}`,
          }}
        />
        <Typography
          component='h1'
          sx={{
            fontWeight: 'bold',
            color: '#ff6077',
            textAlign: 'center',
          }}
        >
          Vimp
        </Typography>
      </Box>

      <Box
        sx={{
          WebkitAppRegion: 'no-drag',
          zIndex: 99,
        }}
      >
        <AppBarButtons />
      </Box>
    </Box>
  );
}
