// js/auth.js
import { supabase } from '../supabase.js';

// ✅ Send magic link (passwordless email)
export async function sendEmailLink(email) {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: 'http://127.0.0.1:5502/projects.html'
      }
    });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error sending link:', error.message);
    throw error;
  }
}

// ✅ Google sign-in
export async function signInWithGoogle() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://127.0.0.1:5502/projects.html'
      }
    });
    
    if (error) throw error;
  } catch (error) {
    console.error('Google sign-in error:', error.message);
    throw error;
  }
}

// ✅ Sign out
export async function logOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = 'auth.html';
  } catch (error) {
    console.error('Sign-out error:', error.message);
    throw error;
  }
}