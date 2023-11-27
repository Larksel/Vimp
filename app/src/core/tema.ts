import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  // Alterando cores ja existentes para as desejadas
  palette: {
    mode: 'dark',
    primary: {
      main: '#6f00ff',
      dark: '#4c00f1',
      light: '#be97ff',
      contrastText: '#fff'
    },
    secondary: {
      main: '#89eb00',
      dark: '#5dc400',
      light: '#b4f470',
      contrastText: '#000'
    },
    error: {
      main: '#d32f2f',
      dark: '#b71c1c',
      light: '#e57373',
      contrastText: '#fff'
    },
    warning: {
      main: '#FFED00',
      dark: '#ffc000',
      light: '#fff694',
      contrastText: '#000'
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