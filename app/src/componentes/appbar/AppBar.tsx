import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import sizeConfigs from '../../configs/sizeConfigs';
import colorConfigs from '../../configs/colorConfigs';

import AppBarButtons from './AppBarButtons';

const sizes = sizeConfigs.appBar;
const colors = colorConfigs.appBar;

// Definição de cada parte da aplicação
export default function AppBar() {
  return (
    <Box
      sx={{
        backgroundColor: `${colors.bg}`,
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
      <Typography component="h1" sx={{ ml: '18px' }}>
        Vimp
      </Typography>

      <Box
        sx={{
          WebkitAppRegion: 'no-drag',
        }}
      >
        <AppBarButtons />
      </Box>
    </Box>
  );
}
