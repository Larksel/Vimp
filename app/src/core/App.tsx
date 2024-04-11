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
      {
        //TODO testar grid
      }
      <div className='flex h-screen w-screen flex-col overflow-hidden bg-black'>
        <AppBar />
        <div
          className='flex flex-1 flex-row overflow-clip bg-red-500'
          style={{
            maxHeight: 'calc(100vh - 36px - 96px)',
          }}
        >
          <SideBar />
          <div
            className='relative flex flex-1 basis-0'
            style={{
              maxWidth: 'calc(100vw - 320px)',
            }}
          >
            {
              // ! Revisar estrutura DOM e definir quais elementos
              // ! dão overflow em quem
            }
            <Header />
            <ScrollBar>
              <Rotas />
            </ScrollBar>
          </div>
        </div>
        <PlaybackConsole />
      </div>
    </HashRouter>
  );
}
