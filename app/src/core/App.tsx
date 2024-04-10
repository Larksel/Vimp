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
      <div className='flex flex-col h-screen w-screen overflow-hidden bg-black'>
        <AppBar />
        <div className='flex flex-row flex-1 overflow-hidden bg-slate-500'>
          <SideBar />
          <ScrollBar>
            <Header />

            <div className='flex-1 bg-purple-500 p-6'>
              <div className='grid grid-cols-5 gap-2 justify-items-center'>

                <div className='bg-zinc-800 rounded-lg w-48 flex flex-col p-2 items-center justify-center'>
                  <div className='h-44 w-44 bg-red-400'/>
                  <h1>Titulo</h1>
                  <h6>artista</h6>
                </div>
                <div className='bg-zinc-800 rounded-lg w-48 flex flex-col p-2 items-center justify-center'>
                  <div className='h-44 w-44 bg-red-400'/>
                  <h1>Titulo</h1>
                  <h6>artista</h6>
                </div>
                <div className='bg-zinc-800 rounded-lg w-48 flex flex-col p-2 items-center justify-center'>
                  <div className='h-44 w-44 bg-red-400'/>
                  <h1>Titulo</h1>
                  <h6>artista</h6>
                </div>
                <div className='bg-zinc-800 rounded-lg w-48 flex flex-col p-2 items-center justify-center'>
                  <div className='h-44 w-44 bg-red-400'/>
                  <h1>Titulo</h1>
                  <h6>artista</h6>
                </div>
                <div className='bg-zinc-800 rounded-lg w-48 flex flex-col p-2 items-center justify-center'>
                  <div className='h-44 w-44 bg-red-400'/>
                  <h1>Titulo</h1>
                  <h6>artista</h6>
                </div>
                <div className='bg-zinc-800 rounded-lg w-48 flex flex-col p-2 items-center justify-center'>
                  <div className='h-44 w-44 bg-red-400'/>
                  <h1>Titulo</h1>
                  <h6>artista</h6>
                </div>
                <div className='bg-zinc-800 rounded-lg w-48 flex flex-col p-2 items-center justify-center'>
                  <div className='h-44 w-44 bg-red-400'/>
                  <h1>Titulo</h1>
                  <h6>artista</h6>
                </div>
              </div>
            </div>
            {
              /** <div className='bg-purple-500 h-full w-full p-2'>
              <h1>esquerda</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
              <h1>direita</h1>
            </div>*/
            }
          </ScrollBar>
          {/*<SideBar />
          <Scrollbar>
            <Header />
            <Rotas />
          </Scrollbar>
          */}
        </div>
        <div className='h-24 bg-red-500'>
          {
            //<PlaybackConsole />
          }
        </div>
      </div>
    </HashRouter>
  );
}
