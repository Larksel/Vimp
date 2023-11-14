import React from 'react'
import styles from './homeStyles'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

export default function Home() {
  const navigate = useNavigate()

  const nopage = () => {
    navigate('/efesgsegse')
  }

  return (
    <Box sx={styles.container}>
      <Typography 
        component='h1' 
        variant='h3'
        sx={styles.titulo}
      >
        Vimp
      </Typography>
      <Button onClick={nopage}>
        NoPage
      </Button>
    </Box>
  );
}