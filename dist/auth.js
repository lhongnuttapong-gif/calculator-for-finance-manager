import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBvFhwWSN2x-MH0yuS7LDSzMjMoSxQ9H04',
  authDomain: 'data-base-calculator.firebaseapp.com',
  projectId: 'data-base-calculator',
  storageBucket: 'data-base-calculator.firebasestorage.app',
  messagingSenderId: '146225647129',
  appId: '1:146225647129:web:e5a679f78cd69619b7e488',
  measurementId: 'G-459EGG2XSE'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
void isAnalyticsSupported().then(supported => { if (supported) getAnalytics(app); }).catch(() => {});

const authGate = document.getElementById('authGate');
const appShell = document.getElementById('appShell');
const authForm = document.getElementById('authForm');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authSubmit = document.getElementById('authSubmit');
const authTitle = document.getElementById('authTitle');
const authDescription = document.getElementById('authDescription');
const authMessage = document.getElementById('authMessage');
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const forgotPassword = document.getElementById('forgotPassword');
const accountEmail = document.getElementById('accountEmail');
const signOutButton = document.getElementById('signOutButton');

let mode = 'login';
let calculatorLoaded = false;

function setMode(nextMode) {
  mode = nextMode;
  const isLogin = mode === 'login';
  loginTab.classList.toggle('active', isLogin);
  registerTab.classList.toggle('active', !isLogin);
  loginTab.setAttribute('aria-selected', String(isLogin));
  registerTab.setAttribute('aria-selected', String(!isLogin));
  authTitle.textContent = isLogin ? 'เข้าสู่ระบบ' : 'สร้างบัญชี';
  authDescription.textContent = isLogin ? 'เข้าสู่พื้นที่วิเคราะห์ทางการเงินของคุณ' : 'สร้างบัญชีเพื่อเริ่มใช้งานเครื่องคิดเลขทางการเงิน';
  authSubmit.textContent = isLogin ? 'เข้าสู่ระบบ' : 'สร้างบัญชี';
  authPassword.autocomplete = isLogin ? 'current-password' : 'new-password';
  forgotPassword.classList.toggle('is-hidden', !isLogin);
  showMessage('', '');
}

function showMessage(message, type) {
  authMessage.textContent = message;
  authMessage.className = `auth-message${type ? ` ${type}` : ''}`;
}

function friendlyError(error) {
  const messages = {
    'auth/email-already-in-use': 'อีเมลนี้มีบัญชีอยู่แล้ว กรุณาเข้าสู่ระบบหรือรีเซ็ตรหัสผ่าน',
    'auth/invalid-email': 'รูปแบบอีเมลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง',
    'auth/invalid-credential': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    'auth/missing-password': 'กรุณากรอกรหัสผ่าน',
    'auth/weak-password': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
    'auth/too-many-requests': 'มีการลองเข้าสู่ระบบหลายครั้ง กรุณารอสักครู่แล้วลองใหม่',
    'auth/network-request-failed': 'ไม่สามารถเชื่อมต่อเครือข่ายได้ กรุณาตรวจสอบอินเทอร์เน็ต',
    'auth/operation-not-allowed': 'ยังไม่ได้เปิดใช้งาน Email/Password ใน Firebase Console'
  };
  return messages[error?.code] || 'ไม่สามารถดำเนินการได้ในขณะนี้ กรุณาลองอีกครั้ง';
}

async function ensureCalculatorLoaded() {
  if (calculatorLoaded) return;
  await import('./app.js');
  calculatorLoaded = true;
}

function setBusy(busy) {
  authSubmit.disabled = busy;
  authSubmit.textContent = busy ? 'กำลังดำเนินการ…' : mode === 'login' ? 'เข้าสู่ระบบ' : 'สร้างบัญชี';
}

loginTab.addEventListener('click', () => setMode('login'));
registerTab.addEventListener('click', () => setMode('register'));

authForm.addEventListener('submit', async event => {
  event.preventDefault();
  showMessage('', '');
  const email = authEmail.value.trim();
  const password = authPassword.value;
  if (!email) return showMessage('กรุณากรอกอีเมล', 'error');
  if (password.length < 6) return showMessage('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', 'error');
  setBusy(true);
  try {
    if (mode === 'register') await createUserWithEmailAndPassword(auth, email, password);
    else await signInWithEmailAndPassword(auth, email, password);
    authForm.reset();
  } catch (error) {
    showMessage(friendlyError(error), 'error');
  } finally {
    setBusy(false);
  }
});

forgotPassword.addEventListener('click', async () => {
  const email = authEmail.value.trim();
  if (!email) {
    showMessage('กรุณากรอกอีเมลก่อนขอรีเซ็ตรหัสผ่าน', 'error');
    authEmail.focus();
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    showMessage('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลแล้ว', 'success');
  } catch (error) {
    showMessage(friendlyError(error), 'error');
  }
});

signOutButton.addEventListener('click', async () => {
  signOutButton.disabled = true;
  try { await signOut(auth); }
  finally { signOutButton.disabled = false; }
});

setPersistence(auth, browserLocalPersistence)
  .catch(() => {})
  .finally(() => {
    onAuthStateChanged(auth, async user => {
      if (user) {
        accountEmail.textContent = user.email || 'บัญชี Firebase';
        authGate.classList.add('is-hidden');
        appShell.classList.remove('is-hidden');
        appShell.setAttribute('aria-hidden', 'false');
        await ensureCalculatorLoaded();
      } else {
        appShell.classList.add('is-hidden');
        appShell.setAttribute('aria-hidden', 'true');
        authGate.classList.remove('is-hidden');
        accountEmail.textContent = '';
        setMode('login');
      }
    });
  });
