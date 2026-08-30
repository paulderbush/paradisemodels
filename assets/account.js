// =================== ACCOUNT PAGE ===================
let _acctMode = 'signin';

function setAcctMode(mode) {
  _acctMode = mode;
  document.getElementById('acctTabSignin').classList.toggle('active', mode === 'signin');
  document.getElementById('acctTabSignup').classList.toggle('active', mode === 'signup');
  document.getElementById('acctModeTitle').textContent = mode === 'signin' ? 'Sign In' : 'Create Account';
  document.getElementById('acctSubmitBtn').textContent = mode === 'signin' ? 'Sign In' : 'Create Account';
  document.getElementById('acctPassword').autocomplete = mode === 'signin' ? 'current-password' : 'new-password';
  document.getElementById('acctError').style.display = 'none';
  document.getElementById('acctSignupNotice').style.display = 'none';
  document.getElementById('acctFormFields').style.display = 'block';
}

function showAcctError(message) {
  const el = document.getElementById('acctError');
  el.textContent = message;
  el.style.display = 'block';
}

async function submitAcctForm() {
  const email = document.getElementById('acctEmail').value.trim();
  const password = document.getElementById('acctPassword').value;
  document.getElementById('acctError').style.display = 'none';
  document.getElementById('acctSignupNotice').style.display = 'none';

  if (!email || !password) { showAcctError('Enter your email and password.'); return; }
  if (_acctMode === 'signup' && password.length < 6) { showAcctError('Password must be at least 6 characters.'); return; }

  const btn = document.getElementById('acctSubmitBtn');
  btn.disabled = true;
  btn.textContent = _acctMode === 'signin' ? 'Signing in…' : 'Creating account…';

  const {data, error} = _acctMode === 'signin'
    ? await authSignIn(email, password)
    : await authSignUp(email, password);

  btn.disabled = false;
  setAcctMode(_acctMode);

  if (error) {
    showAcctError(error.message || 'Something went wrong.');
    return;
  }

  if (_acctMode === 'signup' && !(data && data.session)) {
    // Email confirmation is on for this project: no session yet.
    document.getElementById('acctFormFields').style.display = 'none';
    document.getElementById('acctSignupNotice').style.display = 'block';
    return;
  }

  const next = new URLSearchParams(window.location.search).get('next');
  if (_acctMode === 'signin' && next && next.startsWith('/')) {
    window.location.href = next;
    return;
  }

  await renderAcctState();
}

async function handleSignOut() {
  await authSignOut();
  await renderAcctState();
}

async function renderAcctState() {
  const loading = document.getElementById('acctLoading');
  const authBox = document.getElementById('acctAuthBox');
  const dash = document.getElementById('acctDashboard');
  loading.style.display = 'block';
  authBox.style.display = 'none';
  dash.style.display = 'none';

  const user = await authGetUser();

  loading.style.display = 'none';
  if (!user) {
    document.getElementById('acctLead').textContent = 'Sign in to manage your VIP catalog access.';
    authBox.style.display = 'block';
    return;
  }

  document.getElementById('acctLead').textContent = 'Manage your account and VIP catalog access.';
  document.getElementById('acctEmailDisplay').textContent = user.email;
  dash.style.display = 'block';

  const vipEl = document.getElementById('acctVipStatus');
  const vipBtn = document.getElementById('acctVipBtn');
  vipEl.textContent = 'Checking VIP access…';
  const hasVip = await checkVipAccess(user.id);
  vipEl.textContent = hasVip ? '✓ VIP catalog access is active.' : 'No VIP catalog access yet.';
  vipBtn.textContent = hasVip ? 'View VIP Models' : 'Get access to VIP models';
}

document.addEventListener('DOMContentLoaded', renderAcctState);
