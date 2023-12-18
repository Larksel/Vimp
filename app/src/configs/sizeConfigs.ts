const sizeConfigs = {
  // Main layout
  appBar: {
    height: '35px',
    width: '100%',
    buttons: {
      width: '50px',
      height: '35px'
    }
  },
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
  mainContent: {
    height: '',
  },
  playerControlBar: {
    height: '90px',
    width: '100%',
    minWidth: '620px',
    playerControl: {
      width: '40%',
      maxWidth: '722px'
    }
  },

  // Content
  card: {
    img: '192px'
  }
};

sizeConfigs.mainContent.height = `calc(100vh - ${sizeConfigs.playerControlBar.height} - ${sizeConfigs.appBar.height})`

export default sizeConfigs;