import React, { useState } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AddIcon from '@mui/icons-material/Add';

import sizeConfigs from '../../configs/sizeConfigs';
import colorConfigs from '../../configs/colorConfigs';

/*
const playlists = () => {
 *  // Get all playlists available
}
*/
const playlists = [
  {
    id: 1,
    nome: 'Teste 1',
    imgPath: '#'
    //link: '/playlist/teste1' - link to the playlist
  },
  {
    id: 2,
    nome: 'Teste 2',
    imgPath: '#'
    //link: '/playlist/teste2' - link to the playlist
  },
  {
    id: 3,
    nome: 'Teste 3',
    imgPath: '#'
    //link: '/playlist/teste3' - link to the playlist
  },
  {
    id: 4,
    nome: 'Teste 4',
    imgPath: '#'
    //link: '/playlist/teste4' - link to the playlist
  },
  {
    id: 5,
    nome: 'Teste 5',
    imgPath: '#'
    //link: '/playlist/teste5' - link to the playlist
  },
  {
    id: 6,
    nome: 'Teste 6',
    imgPath: '#'
    //link: '/playlist/teste6' - link to the playlist
  },
  {
    id: 7,
    nome: 'Teste 7',
    imgPath: '#'
    //link: '/playlist/teste7' - link to the playlist
  },
  {
    id: 8,
    nome: 'Teste 8',
    imgPath: '#'
    //link: '/playlist/teste8' - link to the playlist
  },
  {
    id: 9,
    nome: 'Teste 9',
    imgPath: '#'
    //link: '/playlist/teste9' - link to the playlist
  },
  {
    id: 10,
    nome: 'Teste 10',
    imgPath: '#'
    //link: '/playlist/teste10' - link to the playlist
  },
]

const mainList = [
  'Home', 
  'Search', 
  'Music Library', 
  'Video Library', 
  'New Playlist'
]
const mainListIcons = [
  <HomeIcon />, 
  <SearchIcon />, 
  <LibraryMusicIcon />, 
  <VideoLibraryIcon />, 
  <AddIcon />
]

const colors = colorConfigs.sidebar
const sizes = sizeConfigs.sidebar

export default function Sidebar() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (
    index: number,
  ) => {
    setSelectedIndex(index);
  };

  return (
    <Box
      component='aside'
      sx={{
        p: '8px',
        width: sizes.width,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: `calc(100vh - ${sizeConfigs.playerControl.height})`,
      }}
    >
      <Box
        sx={{
          bgcolor: colors.bg,
          borderRadius: '8px',
        }}
      >
        <List> {/* Main list*/}
          {
            mainList.map((text, index) => {
              return (
                <ListItem key={text} disablePadding>
                  <ListItemButton 
                    selected={selectedIndex === index}
                    onClick={() => 
                      index !== 4 ? handleListItemClick(index) : ''
                    }
                    sx={{
                      height: `${sizes.mainListItem}`
                    }}
                  >
                    <ListItemIcon>
                      {mainListIcons[index]}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              )
            })
          }
        </List>
      </Box>

      <Box
        sx={{
          mt: '8px',
          bgcolor: colors.bg,
          borderRadius: '8px',
          overflowY: 'scroll',
          '&::-webkit-scrollbar': {
            width: `${sizes.scrollbar.width}`,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: `${colors.scrollbar.thumb}`,
            borderRadius: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: `${colors.scrollbar.track}`,
            borderRadius: '8px',
          },
        }}
      >
        <List> {/* Playlist list*/}
          {
            playlists.map(playlist => {
              return (
                <ListItem key={playlist.id} disablePadding>
                  <ListItemButton
                    sx={{
                      height: `${sizes.playlistHeight}`,
                      margin: '0 8px',
                      borderRadius: '8px',
                    }}
                  >
                    <Box 
                      sx={{ 
                        height: '48px', 
                        width: '48px', 
                        bgcolor: '#ff0', 
                        color: 'black',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '4px'
                      }}>
                      Img
                    </Box>
                    <ListItemText 
                      primary={playlist.nome}
                      secondary={'Playlist'}
                      sx={{ ml: '16px' }}
                    />
                  </ListItemButton>
                </ListItem>
              )
            })
          }
        </List>
      </Box>
    </Box>
  );
}