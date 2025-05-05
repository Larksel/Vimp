import log from 'electron-log/main';

export default function setupLogger(isDebug: boolean) {
  const date = new Date();
  const formattedDate = date
    .toLocaleString('pt-BR', {
      // (AAAA/MM/DD HH:mm:ss)
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour12: false,
    })
    .split('/')
    .reverse()
    .join('-');

  // File
  log.transports.file.fileName = `${formattedDate}.log`;
  log.transports.file.level = 'info';
  log.transports.file.format =
    '[{y}-{m}-{d} {h}:{i}:{s}] [{processType}/{level}] - {text}';

  // Console
  log.transports.console.level = isDebug ? 'debug' : false;
  log.transports.console.format =
    '[{y}-{m}-{d} {h}:{i}:{s}] [{processType}/{level}] - {text}';
  log.transports.console.useStyles = true;

  log.initialize();
}
