import log from 'electron-log/main';

export default function setupLogger(isDebug: boolean) {
  log.transports.file.level = 'info';
  log.transports.console.level = isDebug ? 'debug' : false;
  log.transports.file.format =
    '[{y}-{m}-{d} {h}:{i}:{s}] [{processType}] [{level}]- {text}';
  log.transports.console.format =
    '[{y}-{m}-{d} {h}:{i}:{s}] [{processType}] [{level}]- {text}';
  log.transports.console.useStyles = true;
  log.initialize();
}
