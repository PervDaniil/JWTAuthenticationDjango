import Theme from "../components/theme";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home as HomeIcon } from '@mui/icons-material';
import AuthProvider, { AuthContext } from "../components/AuthProvider";
import { Container, Box, Typography, Button, TextField, Checkbox, Fab, Tooltip, Snackbar, Alert, Paper, FormControlLabel } from "@mui/material";


export default function LoginPage() {
    return (
        <AuthProvider>
            <LoginPageComponents />
        </AuthProvider>
    )
}

function LoginPageComponents() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [responseStatus, setResponseStatus] = useState(null);
    const [responseWarning, setResponseWarning] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });


    const HandleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData(data => ({
            ...data,
            [name]: value
        }));
    }


    const HandleFormSubmit = (event) => {
        event.preventDefault();

        const POSTRequest = async () => {
            const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'username': formData.username,
                    'password': formData.password,
                })
            })

            const responsebody = await response.json();

            if (response.ok) {
                await login(responsebody.access, responsebody.refresh);

                setResponseStatus(responsebody.info);

                setFormData({
                    username: '',
                    password: '',
                });

                setTimeout(() => {
                    navigate('/');
                }, 2000);

                return;
            }

            setResponseWarning(responsebody.info);

        }

        POSTRequest();
    }


    return (
        <Theme>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%' }}>
                <Paper sx={{ width: '420px', px: 2, py: 3.5, boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.7)' }}>
                    <Box component="form" onSubmit={HandleFormSubmit} sx={{ p: 2 }}>
                        <Typography align="center" variant="h4" pt={2} pb={4.5} >Login page</Typography>
                        <TextField fullWidth label="Username" name="username" focused size="small" onChange={HandleInputChange} value={formData.username} sx={{ my: 1.5, px: 1 }} />
                        <TextField type="password" fullWidth label="Password" name="password" focused size="small" onChange={HandleInputChange} value={formData.password} sx={{ my: 1.5, px: 1 }} />
                        <FormControlLabel checked control={<Checkbox />} label="Remember me?" />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 10 }}>Submit</Button>
                    </Box>
                </Paper>
            </Box>

            {responseStatus &&
                <Snackbar open={true} autoHideDuration={5000} anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}>
                    <Alert severity="info"> {responseStatus} </Alert>
                </Snackbar>}

            {responseWarning &&
                <Snackbar open={true} autoHideDuration={5000} anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}>
                    <Alert severity="error"> {responseWarning} </Alert>
                </Snackbar>}

            <Fab color="primary" sx={{ position: 'absolute', bottom: '1em', left: '1em'}} href="/">
                <HomeIcon />
            </Fab>
        </Theme>
    )
}
