import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';

import logo from '../../assets/images/logo.png';

import NavButtons from './NavButtons';
import PlaylistList from './PlaylistList';

export default function SideBar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`w-full ${collapsed ? 'max-w-16' : 'max-w-80'} flex flex-col overflow-clip transition-all shrink-0`}>
      <button onClick={() => setCollapsed(!collapsed)}>
        Toggle Menu
      </button>

      {/* NavButtons */}

      {/* PlaylistList */}
    </div>
  );
}
