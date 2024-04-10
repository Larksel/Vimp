import { HashRouter } from 'react-router-dom';

import AppBar from '../componentes/AppBar/AppBar';
import SideBar from '../componentes/SideBar/SideBar';
import Header from '../componentes/Header/Header';
import Rotas from './Rotas';
import PlaybackConsole from '../componentes/PlaybackConsole/PlaybackConsole';

import ScrollBar from '../componentes/ScrollBar/ScrollBar';

export default function App() {
  return (
    <HashRouter>
      <div className='flex flex-col h-screen w-screen overflow-clip bg-black'>
        <AppBar />
        <div className='flex flex-row flex-1 overflow-clip bg-slate-500'>
          <SideBar />
          <ScrollBar>
            <div className='flex flex-col flex-1 overflow-clip bg-purple-500'>
              <Header />
              <Rotas />
            </div>
          </ScrollBar>
        </div>
        <PlaybackConsole />
      </div>
    </HashRouter>
  );
}
