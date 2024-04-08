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
        justifyContent: 'flex-end',
        WebkitUserSelection: 'none',
        WebkitAppRegion: 'drag',
      }}
    >
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
