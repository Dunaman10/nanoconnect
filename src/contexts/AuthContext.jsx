import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId) => {
    try {
      // 1. Try to get existing profile
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        // If row not found (PGRST116) and we have a session, try to create it (Self-Healing)
        if (error.code === 'PGRST116') {
          const { data: { session } } = await supabase.auth.getSession();
          const authUser = session?.user;

          if (authUser && authUser.id === userId) {
            console.log("Profile missing, creating sync for:", authUser.email);
            
            const newProfile = {
              id: authUser.id,
              name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
              email: authUser.email,
              user_type: authUser.user_metadata?.user_type || 'sme',
              avatar_url: '',
              password: 'auth-managed-account', // Placeholder for the NOT NULL constraint
              is_active: true,
              is_verified: true // Since they logged in via Supabase Auth
            };

            const { data: insertedData, error: insertError } = await supabase
              .from('users')
              .insert(newProfile)
              .select()
              .single();

            if (insertError) {
              console.error('Error creating user profile fallback:', insertError);
            } else {
              setUserProfile(insertedData);
              return; // Success
            }
          }
        }
        console.error('Error fetching user profile:', error);
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(),
    user,
    userProfile,
    refreshProfile: () => user && fetchUserProfile(user.id),
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
