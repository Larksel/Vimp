import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

import placeholderImage from '../../assets/images/placeholder.png';

import ListHeader from './ListHeader';

const playlists = [
  {
    id: 1,
    nome: 'Hello World',
    imgPath: '#',
    //link: '/playlist/teste1' - link to the playlist
  },
  {
    id: 2,
    nome: 'Teste 2',
    imgPath: '#',
    //link: '/playlist/teste2' - link to the playlist
  },
  {
    id: 3,
    nome: 'Teste 3',
    imgPath: '#',
    //link: '/playlist/teste3' - link to the playlist
  },
  {
    id: 4,
    nome: 'Teste 4',
    imgPath: '#',
    //link: '/playlist/teste4' - link to the playlist
  },
  {
    id: 5,
    nome: 'Teste 5',
    imgPath: '#',
    //link: '/playlist/teste5' - link to the playlist
  },
  {
    id: 6,
    nome: 'Teste 6',
    imgPath: '#',
    //link: '/playlist/teste6' - link to the playlist
  },
  {
    id: 7,
    nome: 'Teste 7',
    imgPath: '#',
    //link: '/playlist/teste7' - link to the playlist
  },
  {
    id: 8,
    nome: 'Teste 8',
    imgPath: '#',
    //link: '/playlist/teste8' - link to the playlist
  },
  {
    id: 9,
    nome: 'Teste 9',
    imgPath: '#',
    //link: '/playlist/teste9' - link to the playlist
  },
  {
    id: 10,
    nome: 'Teste 10',
    imgPath: '#',
    //link: '/playlist/teste10' - link to the playlist
  },
];

interface PlaylistListProps {
  collapsed: boolean;
}

//TODO Resolver conflito com botões principais
//TODO Usar InfoText

export default function PlaylistList({ collapsed }: PlaylistListProps) {
  const [view, setView] = useState<string>();
  const navigate = useNavigate();

  const handleImageError = (event: React.BaseSyntheticEvent) => {
    event.target.src = placeholderImage;
  };

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    nextView: string
  ) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  return (
    <Box>
      <ListHeader collapsed={collapsed} />

      <ToggleButtonGroup
        orientation='vertical'
        exclusive
        fullWidth
        onChange={handleChange}
      >
        {playlists.map((playlist, index) => (
          <ToggleButton
            key={index}
            value={playlist.nome}
            onClick={() => navigate(playlist.nome)}
            sx={{
              display: 'flex',
              height: '64px',
              textTransform: 'capitalize',
              border: 0,
              borderRadius: 0,
              padding: '8px',
              justifyContent: 'left',
              gap: '16px',
              whiteSpace: 'nowrap',
            }}
          >
            <Box>
              <Box
                component='img'
                src={playlist.imgPath}
                onError={handleImageError}
                sx={{
                  height: '48px',
                  width: '48px',
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

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                transition: 'all .15s ease',
                translate: collapsed ? '-8px' : 0,
                opacity: collapsed ? 0 : 1,
              }}
            >
              <Typography variant='body2' sx={{ width: 'fit-content' }}>
                {playlist.nome}
              </Typography>
              <Typography
                variant='caption'
                color={'text.secondary'}
                sx={{ width: 'fit-content' }}
              >
                Playlist
              </Typography>
            </Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
