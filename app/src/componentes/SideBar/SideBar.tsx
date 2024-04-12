import { useState } from 'react';

import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';

import logo from '../../assets/images/logo.png';

import NavButtons from './NavButtons';
import PlaylistList from './PlaylistList';

export default function SideBar({ toggle, collapsed }) {
  return (
    <div className={`w-full ${collapsed ? 'max-w-20' : 'max-w-80'} flex flex-col overflow-clip transition-all shrink-0`}>
      <button onClick={toggle}>
        Toggle Menu
      </button>

      {/* NavButtons */}

      {/* PlaylistList */}
    </div>
  );
}
