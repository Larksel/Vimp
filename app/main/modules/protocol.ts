import { protocol } from 'electron';

// Will not use protocol.handle, its buggy
export const setupVimpProtocol = () => {
  protocol.registerFileProtocol('vimp', (req, callback) => {
    const filePath = decodeURIComponent(req.url.slice('vimp://'.length));
    callback({ path: filePath });
  });
}
