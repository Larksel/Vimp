import { useState } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import sizeConfigs from '../../configs/sizeConfigs';
import colorConfigs from '../../configs/colorConfigs';
import logo from '../../assets/images/logo.png';

import NavButtons from './NavButtons';
import PlaylistItem from './PlaylistItem';

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
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
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
        <NavButtons collapsed={collapsed}/>
      </Box>

      <Box
        sx={{
          bgcolor: colors.bg,
          borderRadius: '8px',
          width: '100%',
          overflowX: 'hidden',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: collapsed ? 0 : `${sizeConfigs.scrollbarSize}`,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: `${colorConfigs.scrollbar.thumb}`,
            borderRadius: `${sizeConfigs.scrollbarRadius}`,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: `${colorConfigs.scrollbar.track}`,
            borderRadius: `${sizeConfigs.scrollbarRadius}`,
          },
        }}
      >
        <List disablePadding>
          {/* Playlists list*/}
          <Button
            color='inherit'
            fullWidth
            sx={{
              display: 'flex',
              height: sizes.playlistItem.height,
              textTransform: 'capitalize',
              padding: '8px',
              justifyContent: 'left',
              gap: '16px',
              whiteSpace: 'nowrap',
              borderRadius: '8px',
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 0,
            }}
          >
            <AddRoundedIcon
              sx={{
                border: '1px solid #555',
                height: `${sizes.playlistItem.img}`,
                width: `${sizes.playlistItem.img}`,
                borderRadius: '4px',
              }}
            />
            <Typography
              variant='body1'
              sx={{
                transition: 'all .15s ease-out',
                opacity: collapsed ? 0 : 1,
                translate: collapsed ? '-5px' : 0,
              }}
            >
              New Playlist
            </Typography>
          </Button>
          {playlists.map((playlist) => (
            <PlaylistItem
              key={playlist.id}
              playlist={playlist}
              collapsed={collapsed}
            />
          ))}
        </List>
      </Box>
    </Box>
  );
}
