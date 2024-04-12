import { useState } from 'react';

import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';

import logo from '../../assets/images/logo.png';

import NavButtons from './NavButtons';
import PlaylistList from './PlaylistList';

export default function SideBar({ toggle, collapsed }) {
  return (
    <div className={`w-full ${collapsed ? 'max-w-20' : 'max-w-80'} flex flex-col items-center overflow-clip transition-all bg-neutral-900`}>
      <div className='p-2'>
        <button onClick={toggle} className='size-12'>
          <img src={logo} />
        </button>
      </div>

      {/* NavButtons */}

      {/* PlaylistList */}
    </div>
  );
}
