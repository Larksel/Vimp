import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  // Alterando cores ja existentes para as desejadas
  palette: {
    mode: 'dark',
    primary: {
      main: '#6f00ff',
    },
    secondary: {
      main: '#00ff00',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
    },
  },
  typography: {
    fontFamily: [
      'Poppins', 
      'sans-serif'
    ].join(','),
    fontSize: 16,
  },
};

export const tema = createTheme(themeOptions, {
  // Adicionando nomes de cores personalizados
  palette: {
    mode: 'dark',
    background: {
      dark: '#272727',
      light: '#353535'
    }
  },
})