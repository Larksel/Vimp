import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import sizeConfigs from '../../configs/sizeConfigs';

import placeholderImage from '../../assets/images/placeholder.png';

interface PlaylistItemProps {
  playlist: {
    id: number;
    nome: string;
    imgPath: string;
  };
  collapsed: boolean;
}

const handleImageError = (event: React.BaseSyntheticEvent) => {
  event.target.src = placeholderImage;
};

const sizes = sizeConfigs.sidebar.playlistItem;

export default function PlaylistItem({
  playlist,
  collapsed,
}: PlaylistItemProps) {
  return (
    <ListItem disablePadding>
      <ListItemButton
        sx={{
          height: `${sizes.height}`,
          p: '8px',
          borderRadius: '8px',
        }}
      >
        <Box>
          <Box
            component='img'
            src={playlist.imgPath}
            onError={handleImageError}
            sx={{
              height: `${sizes.img}`,
              width: `${sizes.img}`,
              overflow: 'hidden',
              bgcolor: '#EB1E79',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '4px',
              objectFit: 'cover',
            }}
          />
        </Box>

        <ListItemText
          primary={playlist.nome}
          secondary={'Playlist'}
          sx={{
            ml: '16px',
            whiteSpace: 'nowrap',
            transition: 'all .3s ease-out',
            opacity: collapsed ? 0 : 1,
            translate: collapsed ? '-5px' : 0,
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}
