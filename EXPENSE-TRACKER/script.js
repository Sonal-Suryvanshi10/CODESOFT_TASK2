import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    updateProfile 
} from "firebase/auth";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    where, 
    deleteDoc, 
    doc, 
    updateDoc,
    onSnapshot 
} from "firebase/firestore";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDVBYqSIEl8hccruKRhptb9Wp8aYXNWtfM",
    authDomain: "expence-tracker-1ce8a.firebaseapp.com",
    projectId: "expence-tracker-1ce8a",
    storageBucket: "expence-tracker-1ce8a.firebasestorage.app",
    messagingSenderId: "570530395661",
    appId: "1:570530395661:web:d75d7648df8ed023e1c744",
    measurementId: "G-RK2QG9E3YK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==================== DOM ELEMENTS ====================
const authContainer = document.getElementById('authContainer');
const homePage = document.getElementById('homePage');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const signupName = document.getElementById('signupName');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const signupConfirmPassword = document.getElementById('signupConfirmPassword');
const loginError = document.getElementById('loginError');
const signupError = document.getElementById('signupError');
const logoutBtn = document.getElementById('logoutBtn');
const userNameDisplay = document.getElementById('userNameDisplay');
const settingsUserEmail = document.getElementById('settingsUserEmail');
const profileBtn = document.getElementById('profileBtn');
const dropdownMenu = document.getElementById('dropdownMenu');
const settingsOption = document.getElementById('settingsOption');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');

// Transactions
const txType = document.getElementById('txType');
const txAmount = document.getElementById('txAmount');
const txCategory = document.getElementById('txCategory');
const txDate = document.getElementById('txDate');
const txDesc = document.getElementById('txDesc');
const addBtn = document.getElementById('addBtn');
const filterSelect = document.getElementById('filterCategory');
const clearFilterBtn = document.getElementById('clearFilterBtn');
const transactionListEl = document.getElementById('transactionList');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpensesEl = document.getElementById('totalExpenses');
const balanceEl = document.getElementById('balance');
const txCountEl = document.getElementById('txCount');

// ==================== STATE ====================
let currentUser = null;
let transactions = [];
let filterCategory = 'all';
let unsubscribe = null;
let isLoggingOut = false;

// ==================== HELPERS ====================
function formatCurrency(amount) {
    return '₹' + Number(amount).toLocaleString('en-IN');
}

// ==================== SHOW/HIDE PAGES ====================
function showLoginPage() {
    authContainer.style.display = 'flex';
    homePage.style.display = 'none';
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    loginError.textContent = '';
    signupError.textContent = '';
    loginEmail.value = '';
    loginPassword.value = '';
    console.log('📱 Showing login page');
}

function showHomePage() {
    authContainer.style.display = 'none';
    homePage.style.display = 'block';
    console.log('🏠 Showing home page');
}

// ==================== AUTO LOGOUT ON TAB/WINDOW CLOSE ====================
// This function will be called when user closes the tab or browser
async function handleTabClose() {
    if (currentUser && !isLoggingOut) {
        console.log('🔄 Tab closing - auto logout user');
        try {
            await signOut(auth);
            console.log('✅ User auto-logged out on tab close');
        } catch (error) {
            console.error('Error during auto logout:', error);
        }
    }
}

// Detect when user is navigating away or closing tab
window.addEventListener('beforeunload', handleTabClose);

// Detect when user is leaving the page (for modern browsers)
window.addEventListener('pagehide', handleTabClose);

// Also detect visibility change (for mobile browsers)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        // User switched to another tab or minimized
        // We don't logout here, only when actually closing
    }
});

// ==================== AUTH FUNCTIONS ====================
showSignup.addEventListener('click', () => {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    loginError.textContent = '';
    signupError.textContent = '';
    signupName.value = '';
    signupEmail.value = '';
    signupPassword.value = '';
    signupConfirmPassword.value = '';
});

showLogin.addEventListener('click', () => {
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
    loginError.textContent = '';
    signupError.textContent = '';
    loginEmail.value = '';
    loginPassword.value = '';
});

// Login
loginBtn.addEventListener('click', async () => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();
    
    if (!email || !password) {
        loginError.textContent = 'Please enter email and password';
        return;
    }
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        loginError.textContent = '';
        loginEmail.value = '';
        loginPassword.value = '';
    } catch (error) {
        loginError.textContent = error.message;
        console.error('Login error:', error);
    }
});

// Signup
signupBtn.addEventListener('click', async () => {
    const name = signupName.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value.trim();
    const confirmPassword = signupConfirmPassword.value.trim();
    
    signupError.textContent = '';
    
    if (!name || !email || !password || !confirmPassword) {
        signupError.textContent = 'Please fill all fields';
        return;
    }
    
    if (password.length < 6) {
        signupError.textContent = 'Password must be at least 6 characters';
        return;
    }
    
    if (password !== confirmPassword) {
        signupError.textContent = 'Passwords do not match!';
        signupPassword.value = '';
        signupConfirmPassword.value = '';
        signupPassword.focus();
        return;
    }
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        signupError.textContent = '';
        signupName.value = '';
        signupEmail.value = '';
        signupPassword.value = '';
        signupConfirmPassword.value = '';
        alert('✅ Account created successfully! Welcome ' + name);
    } catch (error) {
        signupError.textContent = error.message;
        console.error('Signup error:', error);
    }
});

// Enter key support
signupPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') signupConfirmPassword.focus();
});
signupConfirmPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') signupBtn.click();
});
loginPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loginBtn.click();
});

// ==================== LOGOUT ====================
logoutBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to logout?')) {
        isLoggingOut = true;
        try {
            if (unsubscribe) {
                unsubscribe();
                unsubscribe = null;
            }
            
            transactions = [];
            renderTransactions();
            
            await signOut(auth);
            showLoginPage();
            dropdownMenu.classList.remove('show');
            
            console.log('✅ Logged out successfully');
        } catch (error) {
            alert('Error logging out: ' + error.message);
            console.error('Logout error:', error);
        } finally {
            isLoggingOut = false;
        }
    }
});

// Profile Dropdown
profileBtn.addEventListener('click', () => {
    dropdownMenu.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.profile-dropdown')) {
        dropdownMenu.classList.remove('show');
    }
});

// Settings Modal
settingsOption.addEventListener('click', () => {
    settingsModal.classList.add('show');
    dropdownMenu.classList.remove('show');
});

closeSettings.addEventListener('click', () => {
    settingsModal.classList.remove('show');
});

settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.classList.remove('show');
    }
});

// ==================== TRANSACTION FUNCTIONS ====================
function loadUserTransactions(userId) {
    if (unsubscribe) {
        unsubscribe();
    }
    
    const q = query(collection(db, 'transactions'), where('userId', '==', userId));
    unsubscribe = onSnapshot(q, (snapshot) => {
        transactions = [];
        snapshot.forEach((doc) => {
            transactions.push({ id: doc.id, ...doc.data() });
        });
        renderTransactions();
    });
}

addBtn.addEventListener('click', async () => {
    if (!currentUser) {
        alert('Please login first');
        return;
    }
    
    const type = txType.value;
    const amountRaw = txAmount.value.trim();
    const category = txCategory.value;
    const date = txDate.value.trim();
    const description = txDesc.value.trim() || 'Untitled';

    if (!date || !amountRaw || Number(amountRaw) <= 0) {
        alert('Please enter a valid date and positive amount.');
        return;
    }

    const amount = parseFloat(amountRaw);

    try {
        await addDoc(collection(db, 'transactions'), {
            userId: currentUser.uid,
            date: date,
            category: category,
            description: description,
            amount: amount,
            type: type,
            createdAt: new Date().toISOString()
        });
        
        txAmount.value = '';
        txDesc.value = '';
        txDate.value = new Date().toISOString().slice(0, 10);
    } catch (error) {
        alert('Error adding transaction: ' + error.message);
        console.error('Add error:', error);
    }
});

async function deleteTransaction(id) {
    if (!currentUser) return;
    if (confirm('Are you sure you want to delete this transaction?')) {
        try {
            await deleteDoc(doc(db, 'transactions', id));
        } catch (error) {
            alert('Error deleting transaction: ' + error.message);
            console.error('Delete error:', error);
        }
    }
}

async function editTransaction(id) {
    if (!currentUser) return;
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    const newDesc = prompt('Edit description:', tx.description);
    if (newDesc === null) return;

    const newAmount = prompt('Edit amount (positive number):', tx.amount);
    if (newAmount === null) return;

    const newCat = prompt('Edit category (salary, food, travel, shopping, bills, education, entertainment, other):', tx.category);
    if (newCat === null) return;

    const newDate = prompt('Edit date (YYYY-MM-DD):', tx.date);
    if (newDate === null) return;

    const newType = prompt('Edit type (income/expense):', tx.type);
    if (newType === null) return;

    const amountNum = parseFloat(newAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
        alert('Invalid amount');
        return;
    }

    const validCats = ['salary', 'food', 'travel', 'shopping', 'bills', 'education', 'entertainment', 'other'];
    const catLower = newCat.toLowerCase().trim();
    if (!validCats.includes(catLower)) {
        alert('Invalid category');
        return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
        alert('Invalid date format');
        return;
    }

    const typeLower = newType.toLowerCase().trim();
    if (!['income', 'expense'].includes(typeLower)) {
        alert('Type must be "income" or "expense"');
        return;
    }

    try {
        await updateDoc(doc(db, 'transactions', id), {
            description: newDesc.trim() || 'Untitled',
            amount: amountNum,
            category: catLower,
            date: newDate,
            type: typeLower
        });
    } catch (error) {
        alert('Error updating transaction: ' + error.message);
        console.error('Update error:', error);
    }
}

function getFiltered() {
    if (filterCategory === 'all') return transactions;
    return transactions.filter(tx => tx.category === filterCategory);
}

function computeTotals() {
    let income = 0, expenses = 0;
    transactions.forEach(tx => {
        if (tx.type === 'income') income += tx.amount;
        else expenses += tx.amount;
    });
    return { income, expenses, balance: income - expenses };
}

function renderTransactions() {
    const { income, expenses, balance } = computeTotals();
    totalIncomeEl.textContent = formatCurrency(income);
    totalExpensesEl.textContent = formatCurrency(expenses);
    balanceEl.textContent = formatCurrency(balance);

    const filtered = getFiltered();
    txCountEl.textContent = filtered.length + ' transaction' + (filtered.length !== 1 ? 's' : '');

    const sorted = [...filtered].sort((a, b) =>
        (a.date < b.date ? 1 : (a.date > b.date ? -1 : (a.createdAt < b.createdAt ? 1 : -1)))
    );

    if (sorted.length === 0) {
        transactionListEl.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <span>No transactions yet.<br /> Add your first income or expense!</span>
            </div>
        `;
        return;
    }

    let html = '';
    sorted.forEach(tx => {
        const isIncome = tx.type === 'income';
        const sign = isIncome ? '+' : '-';
        const amountClass = isIncome ? 'income' : 'expense';
        const categoryDisplay = tx.category.charAt(0).toUpperCase() + tx.category.slice(1);
        const emojiMap = {
            salary: '💰',
            food: '🍔',
            travel: '🚗',
            shopping: '🛍️',
            bills: '📄',
            education: '📚',
            entertainment: '🎬',
            other: '📦'
        };
        const emoji = emojiMap[tx.category] || '📌';

        html += `
            <div class="transaction-item" data-id="${tx.id}">
                <div class="tx-left">
                    <span class="tx-category">${emoji} ${categoryDisplay}</span>
                    <span class="tx-desc">${tx.description || 'Untitled'}</span>
                    <span class="tx-date"><i class="far fa-calendar-alt" style="margin-right:4px;"></i>${tx.date}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.3rem;">
                    <span class="tx-amount ${amountClass}">${sign}${formatCurrency(tx.amount)}</span>
                    <div class="tx-actions">
                        <button class="edit-btn" data-id="${tx.id}" title="Edit"><i class="fas fa-pen"></i></button>
                        <button class="delete-btn" data-id="${tx.id}" title="Delete"><i class="fas fa-trash-can"></i></button>
                    </div>
                </div>
            </div>
        `;
    });

    transactionListEl.innerHTML = html;

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            editTransaction(id);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            deleteTransaction(id);
        });
    });
}

filterSelect.addEventListener('change', (e) => {
    filterCategory = e.target.value;
    renderTransactions();
});

clearFilterBtn.addEventListener('click', () => {
    filterCategory = 'all';
    filterSelect.value = 'all';
    renderTransactions();
});

// ==================== AUTH STATE OBSERVER ====================
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        showHomePage();
        userNameDisplay.textContent = user.displayName || user.email;
        settingsUserEmail.textContent = user.email;
        
        const today = new Date().toISOString().slice(0, 10);
        txDate.value = today;
        
        loadUserTransactions(user.uid);
        console.log('✅ User logged in:', user.email);
    } else {
        currentUser = null;
        
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }
        
        transactions = [];
        renderTransactions();
        
        showLoginPage();
        console.log('👋 User logged out');
    }
});

// ==================== DARK MODE ====================
function setTheme(isDark) {
    const themeToggle = document.getElementById('themeToggle');
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        darkModeSwitch.checked = true;
        localStorage.setItem('expenseTrackerTheme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        darkModeSwitch.checked = false;
        localStorage.setItem('expenseTrackerTheme', 'light');
    }
}

const savedTheme = localStorage.getItem('expenseTrackerTheme');
if (savedTheme === 'light') {
    setTheme(false);
} else {
    setTheme(true);
}

document.getElementById('themeToggle').addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(!isDark);
});

document.getElementById('darkModeSwitch').addEventListener('change', (e) => {
    setTheme(e.target.checked);
});

txAmount.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addBtn.click();
});
txDesc.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addBtn.click();
});

console.log('✅ Expense Tracker App Loaded Successfully!');
console.log('🔒 Auto-logout enabled on tab/window close');