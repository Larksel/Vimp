import Box from '@mui/material/Box';

import sizeConfigs from '../../configs/sizeConfigs';

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
    </Box>
  );
}
