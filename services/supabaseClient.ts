import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = localStorage.getItem('supabaseUrl');
const supabaseAnonKey = localStorage.getItem('supabaseAnonKey');

let supabase: SupabaseClient | null = null;
let configured = false;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    configured = true;
}

export const isSupabaseConfigured = () => configured;

export const signInWithGoogle = async () => {
    if (!supabase) {
        alert("Supabase is not configured. Please go to the Settings page to add your URL and Key.");
        return;
    }
    await supabase.auth.signInWithOAuth({
        provider: 'google',
    });
};

export const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
};

export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
    if (!supabase) {
        // Return a dummy subscription if supabase is not configured
        return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange(callback);
};

export { supabase };