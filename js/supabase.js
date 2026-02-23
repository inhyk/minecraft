// ============================================================
// Supabase Client Configuration
// ============================================================

const SUPABASE_URL = 'https://mwhbpndubgbblkiehlqw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13aGJwbmR1YmdiYmxraWVobHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2Mjk5ODYsImV4cCI6MjA4NzIwNTk4Nn0.3HAvXjzyzLQE9oP9K_gFj2vpL4QpckY_uUgHBxAdcGQ';

let supabaseClient = null;

function initSupabase() {
  if (supabaseClient) return supabaseClient;
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    realtime: {
      params: {
        eventsPerSecond: 20
      }
    }
  });
  return supabaseClient;
}

// Generate 6-character room code
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create new game session
async function createGameSession() {
  const roomCode = generateRoomCode();
  const seed = Math.floor(Math.random() * 2147483647);

  const { data, error } = await supabaseClient
    .from('game_sessions')
    .insert({ room_code: roomCode, seed: seed })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get game session by room code
async function getGameSession(roomCode) {
  const { data, error } = await supabaseClient
    .from('game_sessions')
    .select('*')
    .eq('room_code', roomCode.toUpperCase())
    .eq('is_active', true)
    .single();

  if (error) return null;
  return data;
}

// Save block change to database
async function saveBlockChange(sessionId, bx, by, blockType) {
  await supabaseClient
    .from('block_changes')
    .insert({
      session_id: sessionId,
      bx: bx,
      by: by,
      block_type: blockType
    });
}

// Load all block changes for a session
async function loadBlockChanges(sessionId) {
  const { data, error } = await supabaseClient
    .from('block_changes')
    .select('bx, by, block_type')
    .eq('session_id', sessionId)
    .order('changed_at', { ascending: true });

  if (error) return [];

  // Keep only latest change per coordinate
  const latestChanges = new Map();
  for (const change of data) {
    const key = `${change.bx},${change.by}`;
    latestChanges.set(key, change);
  }

  return Array.from(latestChanges.values());
}

// ============================================================
// Google Authentication
// ============================================================

let currentUser = null;

// Check current session on load
async function checkAuthSession() {
  initSupabase();
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session?.user) {
    currentUser = session.user;
    playerName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Player';
    connectFields.name = playerName;
  }
  return currentUser;
}

// Get the correct redirect URL (handles both local and deployed environments)
function getRedirectUrl() {
  // Use current origin - works for both localhost and deployed URLs
  const origin = window.location.origin;

  // If we're on a known deployed domain, use HTTPS
  if (origin.includes('onrender.com') ||
      origin.includes('vercel.app') ||
      origin.includes('netlify.app') ||
      origin.includes('railway.app')) {
    return origin;
  }

  // For localhost, use the current origin
  return origin;
}

// Sign in with Google
async function signInWithGoogle() {
  initSupabase();

  const redirectUrl = getRedirectUrl();
  console.log('OAuth redirect URL:', redirectUrl);

  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  });
  if (error) {
    console.error('Google sign in error:', error);
    return null;
  }
  return data;
}

// Sign out
async function signOut() {
  initSupabase();
  await supabaseClient.auth.signOut();
  currentUser = null;
  playerName = 'Player';
  connectFields.name = 'Player';
}

// Listen for auth state changes
function setupAuthListener() {
  initSupabase();
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      currentUser = session.user;
      playerName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Player';
      connectFields.name = playerName;
    } else {
      currentUser = null;
    }
  });
}
