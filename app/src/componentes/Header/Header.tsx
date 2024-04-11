import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import NotificationsNoneSharpIcon from '@mui/icons-material/NotificationsNoneSharp';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';

//TODO cor de fundo sólida após scroll <- Fade in
export default function Header() {
  return (
    <Box 
      sx={{
        height: '64px',
        width: '100%',
        position: 'absolute', //absolute
        zIndex: 1,
    }}>
      <Box
        sx={{
          top: 0,
          width: '100%',
          display: 'flex',
          height: '64px',
          alignItems: 'center',
          padding: '16px',
          gap: '8px',
          justifyContent: 'space-between',
        }}
      >
        Header
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            flexDirection: 'row',
          }}
        >
          <IconButton
            disableTouchRipple
            sx={{
              bgcolor: '#0009',
            }}
          >
            <NotificationsNoneSharpIcon fontSize='small' />
          </IconButton>
          <IconButton
            disableTouchRipple
            sx={{
              bgcolor: '#0009',
            }}
          >
            <SettingsSharpIcon fontSize='small' />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
