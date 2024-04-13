import logo from '../../assets/images/logo.png';

import NavButtons from './NavButtons';
import PlaylistList from './PlaylistList';

export default function SideBar({ className, toggle, collapsed }) {
  return (
    <div className={className}>
      <div className='w-full p-2'>
        <button onClick={toggle} className='flex h-12 w-full justify-center'>
          <img src={logo} className='size-12' />
        </button>
      </div>

      {/* NavButtons */}

      {/* PlaylistList */}
    </div>
  );
}
