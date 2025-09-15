import { createRoutes } from '@renderer/utils/utils';
import DownloaderView from './pages/DownloaderView';

export const downloaderRoutes = createRoutes({
  DOWNLOADER: {
    path: 'downloader',
    displayName: 'Downloader',
    element: <DownloaderView />,
  },
});
