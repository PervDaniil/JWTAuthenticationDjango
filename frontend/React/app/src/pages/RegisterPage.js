import { useContext, useState } from "react";
import Theme from "../components/theme";
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';
import { Container, Box, Typography, Button, TextField, Checkbox, Fab, Tooltip, Snackbar, Alert, Paper, FormControlLabel } from "@mui/material";
import AuthProvider, { AuthContext } from "../components/AuthProvider";



export default function RegisterPage() {
    return (
        <AuthProvider>
            <RegisterPageComponents />
        </AuthProvider>
    )
}

function RegisterPageComponents() {
    const { login } = useContext(AuthContext);
    const [validationError, setValidationError] = useState(null);
    const [infoResponse, setInfoResponse] = useState(null);
    const navigate = useNavigate();

    
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmedPassword: ''
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
            const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({
                    'username' : formData.username,
                    'password' : formData.password,
                    'confirmed_password' : formData.confirmedPassword,
                })
            })

            const responsebody = await response.json();
            setInfoResponse(responsebody.info);

            if (response.status === 201) {
                await login(responsebody.access, responsebody.refresh);

                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        }

        formData.password === formData.confirmedPassword ?
        POSTRequest() :
        setValidationError('Passwords are different!');
    }


    return (
        <Theme>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%' }}>
                <Paper sx={{ width: '420px', px: 2, py: 3.5, boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.7)' }}>
                    <Box component="form" onSubmit={HandleFormSubmit} sx={{ p: 2}}>
                        <Typography align="center" variant="h4" pt={2} pb={3.5} >Register page</Typography>
                        <TextField fullWidth label="Username" name="username" focused size="small" onChange={HandleInputChange} sx={{ my: 1.5, px: 1}} />
                        <TextField fullWidth label="Password" name="password" focused size="small" onChange={HandleInputChange} sx={{ my: 1.5, px: 1}} />
                        <TextField fullWidth label="Confirmed password" name="confirmedPassword" onChange={HandleInputChange} focused size="small" sx={{ my: 1.5, px: 1}} />
                        <FormControlLabel checked control={<Checkbox />} label="Remember me?" />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 10 }}>Submit</Button>
                    </Box>
                </Paper>
            </Box>
            
            {validationError && 
                <Snackbar open={true} autoHideDuration={5000} anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}>
                    <Alert severity="error"> {validationError} </Alert>
                </Snackbar>}

            {infoResponse && 
                <Snackbar open={true} autoHideDuration={5000} anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}>
                    <Alert severity="info"> {infoResponse} </Alert>
                </Snackbar>}

            <Fab color="primary" sx={{ position: 'absolute', bottom: '1em', left: '1em'}} href="/">
                <HomeIcon />
            </Fab>
        </Theme>
    )
}
