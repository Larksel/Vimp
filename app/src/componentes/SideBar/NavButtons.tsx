import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LibraryMusicRoundedIcon from '@mui/icons-material/LibraryMusicRounded';
import VideoLibraryRoundedIcon from '@mui/icons-material/VideoLibraryRounded';

import { ROUTES } from '../../core/Rotas';
import sizeConfigs from '../../configs/sizeConfigs';

const navButtons = [
  {
    text: 'Home',
    icon: <HomeRoundedIcon />,
    page: ROUTES.HOME,
  },
  {
    text: 'Search',
    icon: <SearchRoundedIcon />,
    page: ROUTES.SEARCH,
  },
  {
    text: 'Music Library',
    icon: <LibraryMusicRoundedIcon />,
    page: ROUTES.MUSIC_LIBRARY,
  },
  {
    text: 'Video Library',
    icon: <VideoLibraryRoundedIcon />,
    page: ROUTES.VIDEO_LIBRARY,
  },
];

const sizes = sizeConfigs.sidebar;

interface NavButtonsProps {
  collapsed: boolean;
}

export default function NavButtons({ collapsed }: NavButtonsProps) {
  const [view, setView] = useState<string>(navButtons[0].text);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const formattedPath = location.pathname
      .replace(/_/g, ' ')
      .replace('/', '')
      .replace(/(?:^|\s)\S/g, (letra) => letra.toUpperCase());

    if (view !== formattedPath && formattedPath !== '') {
      setView(formattedPath);
    }
  }, [location.pathname, view]);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    nextView: string
  ) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  return (
    <ToggleButtonGroup
      orientation='vertical'
      exclusive
      value={view}
      onChange={handleChange}
      fullWidth
    >
      {navButtons.map(({ text, icon, page }) => (
        <ToggleButton
          key={text}
          value={text}
          disableRipple
          onClick={() => navigate(page)}
          sx={{
            display: 'flex',
            height: sizes.navButton.height,
            textTransform: 'capitalize',
            border: 0,
            borderRadius: '8px',
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
            padding: '18px',
            justifyContent: 'left',
            gap: '12px',
            whiteSpace: 'nowrap',
          }}
        >
          {icon}
          <Typography
            variant='body1'
            sx={{
              transition: 'all .15s ease-out',
              opacity: collapsed ? 0 : 1,
              translate: collapsed ? '-5px' : 0,
            }}
          >
            {text}
          </Typography>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
