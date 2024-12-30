import log from 'electron-log/main';

export default function setupLogger(isDebug: boolean) {
  // File
  log.transports.file.level = 'info';
  log.transports.file.format =
    '[{y}-{m}-{d} {h}:{i}:{s}] [{processType}] [{level}]- {text}';

  // Console
  log.transports.console.level = isDebug ? 'debug' : false;
  log.transports.console.format =
    '[{y}-{m}-{d} {h}:{i}:{s}] [{processType}] [{level}]- {text}';
  log.transports.console.useStyles = true;

  log.initialize();
}
