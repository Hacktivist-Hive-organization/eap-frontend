import { createGlobalStyle } from 'styled-components';
import { colors } from '@/styles/theme';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 16px;
    background-color: ${colors.background};
    color: ${colors.text};
    font-family: 'Roboto', sans-serif;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;
