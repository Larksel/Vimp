import React from 'react';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import sizeConfigs from '../../configs/sizeConfigs';

interface SidebarItemProps {
  text: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

const sizes = sizeConfigs.sidebar.mainListItem;

export default function SidebarItem({
  text,
  icon,
  selected,
  onClick,
}: SidebarItemProps) {
  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={selected}
        onClick={onClick}
        sx={{
          height: `${sizes.height}`,
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
}
