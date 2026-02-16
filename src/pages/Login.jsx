import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  Container,
} from '@mui/material';
import { motion } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import api from '../services/api';
import { saveToken } from '../services/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  async function submit(e) {
    e?.preventDefault();
    setErr('');
    setLoading(true);

    try {
      // 🔥 IMPORTANT: Spring Security expects FORM URL ENCODED
      const params = new URLSearchParams();
      params.append("username", email);   // backend expects username
      params.append("password", password);

      const res = await api.post('/api/v1/auth/token', params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      console.log('Login response:', res.data);

      // Extract token safely (supports multiple formats)
      let token =
        res.data?.token ||
        res.data?.access_token ||
        res.data?.accessToken ||
        res.data?.jwtToken ||
        res.data;

      if (typeof token === 'object' && token?.token) token = token.token;
      if (typeof token === 'object' && token?.accessToken) token = token.accessToken;

      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token format received from server');
      }

      saveToken(token);
      console.log('Token saved:', token.substring(0, 20) + '...');

      enqueueSnackbar('Login successful!', { variant: 'success' });
      nav('/dashboard');

    } catch (ex) {
      const errMsg =
        ex.response?.data?.message ||
        ex.response?.data?.error ||
        ex.response?.data ||
        ex.message;

      console.error('Login error:', errMsg);
      setErr(errMsg);
      enqueueSnackbar(errMsg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ width: '100%' }}>
          <Paper sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                VulneraScan
              </Typography>
              <Typography variant="body2">
                Advanced Security Scanning Platform
              </Typography>
            </Box>

            {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

            <form onSubmit={submit}>
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                sx={{ mb: 3 }}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" variant="contained" fullWidth disabled={loading || !email || !password}>
                  {loading ? <CircularProgress size={24} /> : 'Sign In'}
                </Button>
              </motion.div>
            </form>

            <Typography sx={{ textAlign: 'center', mt: 3 }}>
              Don't have an account?{' '}
              <Link to="/signup">Sign Up</Link>
            </Typography>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
}
