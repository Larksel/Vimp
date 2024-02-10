import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';

interface ListHeaderProps {
  collapsed: boolean;
}

//TODO pesquisa de playlists
//TODO ordem

export default function ListHeader({ collapsed }: ListHeaderProps) {
  return (
    <Box
      sx={{
        position: 'sticky',
        bgcolor: '#121212',
        top: 0,
        width: '100%',
        height: collapsed ? 0 : '42px',
        paddingX: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: collapsed ? 0 : 1,
        overflow: 'hidden',
        transition: 'all .15s ease',
        zIndex: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
        }}
      >
        <IconButton
          color='inherit'
          sx={{
            display: 'flex',
            minWidth: 0,
            minHeight: 0,
            height: '32px',
            width: '32px',
          }}
        >
          <AddRoundedIcon fontSize='small' />
        </IconButton>

        <IconButton
          color='inherit'
          sx={{
            display: 'flex',
            minWidth: 0,
            minHeight: 0,
            height: '32px',
            width: '32px',
          }}
        >
          <SearchRoundedIcon fontSize='small' />
        </IconButton>
      </Box>
      <IconButton
        color='inherit'
        sx={{
          display: 'flex',
          minWidth: 0,
          minHeight: 0,
          height: '32px',
          width: '32px',
        }}
      >
        <FormatListBulletedRoundedIcon fontSize='small' />
      </IconButton>
    </Box>
  );
}
