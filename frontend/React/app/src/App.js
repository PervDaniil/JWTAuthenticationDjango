import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';


export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='login/' element={<LoginPage />} />
				<Route path='register/' element={<RegisterPage />} />
			</Routes>
		</BrowserRouter>
	)
}