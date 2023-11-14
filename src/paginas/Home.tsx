import React from 'react'
import styles from '../estilos/homeStyles'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function Home() {
  return (
    <Box sx={styles.container}>
      <Typography 
        component='h1' 
        variant='h3'
        sx={styles.titulo}
      >
        Vimp
      </Typography>
    </Box>
  );
}