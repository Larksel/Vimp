const sizeConfigs = {
  sidebar: {
    width: '300px',
    playlistItem: {
      height: '64px',
      img: '48px',
    },
    mainListItem: {
      height: '56px',
    },
    scrollbar: {
      width: '10px'
    },
  },
  appBar: {
    height: '31px',
    buttons: {
      width: '45px',
      height: '31px'
    }
  },
  mainContent: {
    height: '',
  },
  playerControl: {
    height: '90px'
  },
  card: {
    img: '192px'
  }
};

sizeConfigs.mainContent.height = `calc(100vh - ${sizeConfigs.playerControl.height} - ${sizeConfigs.appBar.height})`

export default sizeConfigs;