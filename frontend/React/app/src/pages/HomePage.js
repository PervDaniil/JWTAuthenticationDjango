import { useContext } from "react";
import Theme from "../components/theme";
import { Container, Typography, Button, Box, Alert } from "@mui/material";
import AuthProvider, { AuthContext } from "../components/AuthProvider";


export default function HomePage() {
    return (
        <AuthProvider>
            <HomeComponent />
        </AuthProvider>
    )
}

function HomeComponent() {
    const { logout, user } = useContext(AuthContext);


    return (
        <Theme>
            <Container sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', minHeight: '100vh', flexWrap: 'wrap' }}>
                <Box display="flex" flexWrap="wrap" flexDirection="column">
                    <Box component="img" src="https://jwt.io/img/pic_logo.svg" mr={2} />

                    <Box>
                        <Typography sx={{ fontSize: '5.5vw' }}>JWT Authentication</Typography>
                    </Box>
                    
                    { user && <>
                        <Alert severity="info" sx={{ boxShadow: '0px 0px 24px black'}}>
                            <Typography component="div" variant="body2" align="center">
                                You are authenticated as { user.username }
                            </Typography>
                        </Alert>
                    </>}

                    <Box display="flex" justifyContent="space-evenly" margin="2.5em 0" width="100%">
                        <Button variant="contained" href="login/">Login</Button>
                        <Button variant="contained" onClick={logout}>Logout</Button>
                        <Button variant="contained" href="register/">Register</Button>
                    </Box>
                </Box>
                <Typography color="text.secondary">
                    JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties.
                </Typography>
            </Container>
        </Theme>
    );
}
