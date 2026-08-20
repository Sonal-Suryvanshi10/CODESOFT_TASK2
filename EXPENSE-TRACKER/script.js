(function() {
    // ----- STATE -----
    let transactions = [];
    let filterCategory = 'all';
    let currentTheme = 'light';

    // DOM refs
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
    const themeToggle = document.getElementById('themeToggle');

    // helpers
    function formatCurrency(amount) {
        return '₹' + Number(amount).toLocaleString('en-IN');
    }

    function generateId() {
        return Date.now() + Math.floor(Math.random() * 10000);
    }

    // ----- THEME -----
    function toggleTheme() {
        if (currentTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            currentTheme = 'dark';
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('expenseTrackerTheme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            currentTheme = 'light';
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('expenseTrackerTheme', 'light');
        }
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('expenseTrackerTheme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            currentTheme = 'dark';
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            currentTheme = 'light';
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    // ----- LOCAL STORAGE -----
    function loadTransactions() {
        const stored = localStorage.getItem('expenseTrackerData');
        if (stored) {
            try {
                transactions = JSON.parse(stored);
            } catch (e) {
                transactions = [];
            }
        } else {
            // Seed with sample data
            transactions = [
                { id: Date.now() - 100000, date: '2026-08-18', category: 'food', description: 'Lunch with friends', amount: 450, type: 'expense' },
                { id: Date.now() - 200000, date: '2026-08-19', category: 'salary', description: 'Monthly Salary', amount: 30000, type: 'income' },
                { id: Date.now() - 300000, date: '2026-08-20', category: 'travel', description: 'Metro card recharge', amount: 200, type: 'expense' },
            ];
        }
        saveTransactions();
    }

    function saveTransactions() {
        localStorage.setItem('expenseTrackerData', JSON.stringify(transactions));
    }

    // ----- CRUD -----
    function addTransaction() {
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

        const newTx = {
            id: generateId(),
            date: date,
            category: category,
            description: description,
            amount: amount,
            type: type,
        };

        transactions.push(newTx);
        saveTransactions();
        render();

        // Clear inputs
        txAmount.value = '';
        txDesc.value = '';
        txDate.value = new Date().toISOString().slice(0, 10);
    }

    function deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            transactions = transactions.filter(t => t.id !== id);
            saveTransactions();
            render();
        }
    }

    function editTransaction(id) {
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
            alert('Invalid category. Use: salary, food, travel, shopping, bills, education, entertainment, other');
            return;
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
            alert('Invalid date format. Use YYYY-MM-DD');
            return;
        }

        const typeLower = newType.toLowerCase().trim();
        if (!['income', 'expense'].includes(typeLower)) {
            alert('Type must be "income" or "expense"');
            return;
        }

        tx.description = newDesc.trim() || 'Untitled';
        tx.amount = amountNum;
        tx.category = catLower;
        tx.date = newDate;
        tx.type = typeLower;

        saveTransactions();
        render();
    }

    // ----- FILTER & TOTALS -----
    function getFiltered() {
        if (filterCategory === 'all') return transactions;
        return transactions.filter(tx => tx.category === filterCategory);
    }

    function computeTotals() {
        let income = 0,
            expenses = 0;
        transactions.forEach(tx => {
            if (tx.type === 'income') income += tx.amount;
            else expenses += tx.amount;
        });
        return { income, expenses, balance: income - expenses };
    }

    // ----- RENDER -----
    function render() {
        // Update summary
        const { income, expenses, balance } = computeTotals();
        totalIncomeEl.textContent = formatCurrency(income);
        totalExpensesEl.textContent = formatCurrency(expenses);
        balanceEl.textContent = formatCurrency(balance);

        // Filter & sort
        const filtered = getFiltered();
        txCountEl.textContent = filtered.length + ' transaction' + (filtered.length !== 1 ? 's' : '');

        const sorted = [...filtered].sort((a, b) =>
            (a.date < b.date ? 1 : (a.date > b.date ? -1 : (a.id < b.id ? 1 : -1)))
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

        // Event listeners for edit/delete
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = Number(btn.dataset.id);
                editTransaction(id);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = Number(btn.dataset.id);
                deleteTransaction(id);
            });
        });
    }

    // ----- INIT -----
    function init() {
        loadTheme();
        loadTransactions();

        // Set default date to today
        const today = new Date().toISOString().slice(0, 10);
        txDate.value = today;

        // Event listeners
        themeToggle.addEventListener('click', toggleTheme);
        addBtn.addEventListener('click', addTransaction);

        txAmount.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTransaction();
        });
        txDesc.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTransaction();
        });

        filterSelect.addEventListener('change', (e) => {
            filterCategory = e.target.value;
            render();
        });

        clearFilterBtn.addEventListener('click', () => {
            filterCategory = 'all';
            filterSelect.value = 'all';
            render();
        });

        render();
    }

    init();
})();