import { net, protocol } from 'electron';
import { pathToFileURL } from 'url';
import { normalize } from 'path';


export const setupVimpProtocol = () => {
  protocol.registerFileProtocol('vimp', (req, callback) => {
    const filePath = decodeURIComponent(req.url.slice('vimp://'.length));
    callback({ path: filePath });
  });

  protocol.handle('vimp-music', async (req) => {
    const filePath = decodeURIComponent(req.url.slice('vimp-music:///'.length));
    const normalizedPath = normalize(filePath);

    return net.fetch(pathToFileURL(normalizedPath).toString());
  });
};
