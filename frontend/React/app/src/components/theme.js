import { CssBaseline, createTheme, ThemeProvider } from '@mui/material';


export default function Theme({ children }) {
    const UserThemeMode = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#3399ff',
            },
            background: {
            }
        },
        typography: {
            fontFamily: 'Poppins'
        }
    })

    return (
        <ThemeProvider theme={UserThemeMode}>
            <CssBaseline />
            { children }
        </ThemeProvider>
    );
} 