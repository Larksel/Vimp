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
  playbackConsole: {
    height: '90px',
    width: '100%',
    minWidth: '620px',
    playbackControl: {
      width: '40%',
      maxWidth: '722px'
    },
    musicInfo: {
      width: '30%'
    },
    moreOptions: {
      width: '30%'
    }
  },

  // Content
  card: {
    img: '192px'
  }
};

sizeConfigs.mainContent.height = `calc(100vh - ${sizeConfigs.playbackConsole.height} - ${sizeConfigs.appBar.height})`

export default sizeConfigs;