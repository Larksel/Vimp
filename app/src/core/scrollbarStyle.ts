import colorConfigs from "../configs/colorConfigs";
import sizeConfigs from "../configs/sizeConfigs";

export const scrollbarStyle = {
  '& .rcs-custom-scroll .rcs-inner-container': {
    overflowX: 'hidden',
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',
  },
  '& .rcs-custom-scroll .rcs-outer-container:hover .rcs-custom-scrollbar': {
    opacity: 1,
    transitionDuration: '0.15s',
  },
  '& .rcs-custom-scroll .rcs-custom-scrollbar': {
    position: 'absolute',
    height: '100%',
    width: '8px',
    right: 0,
    opacity: 0,
    zIndex: 4,
    transition: 'opacity 0.15s ease-out',
    pointerEvents: 'none',
  },
  '& .rcs-custom-scroll .rcs-custom-scroll-handle': {
    position: 'absolute',
    width: '100%',
  },
  '& .rcs-inner-handle': {
    height: 'calc(100% - 12px)',
    marginTop: '6px',
    backgroundColor: colorConfigs.scrollbar.thumb,
    borderRadius: sizeConfigs.scrollbarRadius,
  },
}