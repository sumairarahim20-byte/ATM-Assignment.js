// ======================================================
// NOVA BANK ATM MACHINE
// COMPLETE JAVASCRIPT
// ======================================================


// ======================================================
// 1. DATA
// ======================================================

let correctPin = localStorage.getItem("atmPin");

if (!correctPin) {
    correctPin = "1234";
    localStorage.setItem("atmPin", correctPin);
}


let balance = Number(
    localStorage.getItem("atmBalance")
);

if (!Number.isFinite(balance)) {
    balance = 50000;

    localStorage.setItem(
        "atmBalance",
        String(balance)
    );
}


let transactions = [];

const savedTransactions =
    localStorage.getItem("atmTransactions");

if (savedTransactions) {

    try {

        const parsedTransactions =
            JSON.parse(savedTransactions);

        if (Array.isArray(parsedTransactions)) {
            transactions = parsedTransactions;
        }

    } catch (error) {

        transactions = [];

    }
}


// ======================================================
// 2. HTML ELEMENTS
// ======================================================

const loginScreen =
    document.getElementById("loginScreen");

const dashboardScreen =
    document.getElementById("dashboardScreen");

const pinInput =
    document.getElementById("pinInput");

const loginMessage =
    document.getElementById("loginMessage");

const balanceDisplay =
    document.getElementById("balanceDisplay");

const recentTransactions =
    document.getElementById("recentTransactions");

const modal =
    document.getElementById("modal");

const modalContent =
    document.getElementById("modalContent");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const toastIcon =
    document.getElementById("toastIcon");

const demoPinDisplay =
    document.getElementById("demoPinDisplay");


// ======================================================
// 3. PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateBalanceUI();

        displayRecentTransactions();

        updateDemoPin();

    }
);


// ======================================================
// 4. LOGIN
// ======================================================

function login() {

    if (!pinInput) {
        return;
    }

    const enteredPin =
        pinInput.value.trim();


    if (enteredPin === "") {

        loginMessage.textContent =
            "Please enter your PIN.";

        return;
    }


    if (!/^\d{4}$/.test(enteredPin)) {

        loginMessage.textContent =
            "PIN must contain exactly 4 digits.";

        return;
    }


    if (enteredPin !== correctPin) {

        loginMessage.textContent =
            "Incorrect PIN. Please try again.";

        pinInput.value = "";

        return;
    }


    loginMessage.textContent = "";

    loginScreen.classList.add("hidden");

    dashboardScreen.classList.remove("hidden");

    updateBalanceUI();

    displayRecentTransactions();

    showToast(
        "Login successful!",
        "✓"
    );
}


// ======================================================
// 5. LOGOUT
// ======================================================

function logout() {

    dashboardScreen.classList.add("hidden");

    loginScreen.classList.remove("hidden");

    pinInput.value = "";

    loginMessage.textContent = "";

    showToast(
        "You have been logged out.",
        "✓"
    );
}


// ======================================================
// 6. PIN VISIBILITY
// ======================================================

function togglePinVisibility() {

    if (!pinInput) {
        return;
    }

    const eye =
        document.getElementById("pinEye");


    if (pinInput.type === "password") {

        pinInput.type = "text";

        if (eye) {
            eye.className =
                "fa-solid fa-eye-slash";
        }

    } else {

        pinInput.type = "password";

        if (eye) {
            eye.className =
                "fa-solid fa-eye";
        }
    }
}


// ======================================================
// 7. UPDATE BALANCE UI
// ======================================================

function updateBalanceUI() {

    if (!balanceDisplay) {
        return;
    }

    balanceDisplay.textContent =
        formatCurrency(balance);
}


// ======================================================
// 8. SHOW BALANCE
// ======================================================

function showBalance() {

    openSimpleModal(
        "Current Balance",
        `
            <div class="modal-balance">

                <span>
                    Available Balance
                </span>

                <h2>
                    ${formatCurrency(balance)}
                </h2>

            </div>

            <p
                style="
                    text-align:center;
                    margin-top:15px;
                    color:#6b7280;
                    font-size:12px;
                "
            >
                Your current available account balance.
            </p>
        `
    );
}


// ======================================================
// 9. WITHDRAW MODAL
// ======================================================

function openWithdrawModal() {

    if (!modal || !modalContent) {
        return;
    }

    modalContent.innerHTML = `

        <h2 class="modal-title">
            Withdraw Money
        </h2>

        <p class="modal-subtitle">
            Select an amount or enter a custom amount.
        </p>

        <div class="quick-amounts">

            <button
                type="button"
                class="quick-amount"
                onclick="setAmount(1000)"
            >
                Rs. 1,000
            </button>

            <button
                type="button"
                class="quick-amount"
                onclick="setAmount(5000)"
            >
                Rs. 5,000
            </button>

            <button
                type="button"
                class="quick-amount"
                onclick="setAmount(10000)"
            >
                Rs. 10,000
            </button>

        </div>

        <div class="modal-form-group">

            <label for="amountInput">
                Enter Amount
            </label>

            <input
                id="amountInput"
                class="modal-input"
                type="number"
                min="1"
                placeholder="Enter amount"
            >

        </div>

        <button
            type="button"
            class="modal-btn"
            onclick="withdraw()"
        >
            <i class="fa-solid fa-money-bill-wave"></i>
            Withdraw Money
        </button>

    `;

    modal.classList.remove("hidden");
}


// ======================================================
// 10. WITHDRAW
// ======================================================

function withdraw() {

    const amountInput =
        document.getElementById("amountInput");


    if (!amountInput) {

        showToast(
            "Amount field not found.",
            "!"
        );

        return;
    }


    const value =
        amountInput.value.trim();


    if (value === "") {

        showToast(
            "Please enter an amount.",
            "!"
        );

        return;
    }


    const amount =
        Number(value);


    if (!Number.isFinite(amount)) {

        showToast(
            "Please enter a valid amount.",
            "!"
        );

        return;
    }


    if (amount <= 0) {

        showToast(
            "Amount must be greater than zero.",
            "!"
        );

        return;
    }


    if (amount > balance) {

        showToast(
            "Insufficient balance.",
            "!"
        );

        return;
    }


    if (amount % 500 !== 0) {

        showToast(
            "Withdrawal must be a multiple of Rs. 500.",
            "!"
        );

        return;
    }


    balance -= amount;

    saveBalance();


    addTransaction(
        "withdraw",
        amount,
        "Cash Withdrawal"
    );


    updateBalanceUI();

    displayRecentTransactions();

    closeModal();


    showToast(
        formatCurrency(amount) +
        " withdrawn successfully.",
        "✓"
    );
}


// ======================================================
// 11. DEPOSIT MODAL
// ======================================================

function openDepositModal() {

    if (!modal || !modalContent) {
        return;
    }

    modalContent.innerHTML = `

        <h2 class="modal-title">
            Deposit Money
        </h2>

        <p class="modal-subtitle">
            Enter the amount you want to deposit.
        </p>

        <div class="modal-form-group">

            <label for="amountInput">
                Deposit Amount
            </label>

            <input
                id="amountInput"
                class="modal-input"
                type="number"
                min="1"
                placeholder="Enter amount"
            >

        </div>

        <button
            type="button"
            class="modal-btn"
            onclick="deposit()"
        >
            <i class="fa-solid fa-circle-plus"></i>
            Deposit Money
        </button>

    `;

    modal.classList.remove("hidden");
}


// ======================================================
// 12. DEPOSIT
// ======================================================

function deposit() {

    const amountInput =
        document.getElementById("amountInput");


    if (!amountInput) {

        showToast(
            "Amount field not found.",
            "!"
        );

        return;
    }


    const value =
        amountInput.value.trim();


    if (value === "") {

        showToast(
            "Please enter an amount.",
            "!"
        );

        return;
    }


    const amount =
        Number(value);


    if (!Number.isFinite(amount)) {

        showToast(
            "Please enter a valid amount.",
            "!"
        );

        return;
    }


    if (amount <= 0) {

        showToast(
            "Amount must be greater than zero.",
            "!"
        );

        return;
    }


    balance += amount;

    saveBalance();


    addTransaction(
        "deposit",
        amount,
        "Cash Deposit"
    );


    updateBalanceUI();

    displayRecentTransactions();

    closeModal();


    showToast(
        formatCurrency(amount) +
        " deposited successfully.",
        "✓"
    );
}


// ======================================================
// 13. TRANSFER MODAL
// ======================================================

function openTransferModal() {

    if (!modal || !modalContent) {
        return;
    }

    modalContent.innerHTML = `

        <h2 class="modal-title">
            Transfer Money
        </h2>

        <p class="modal-subtitle">
            Send money to another account.
        </p>

        <div class="modal-form-group">

            <label for="receiverAccount">
                Receiver Account Number
            </label>

            <input
                id="receiverAccount"
                class="modal-input"
                type="text"
                placeholder="Enter account number"
            >

        </div>

        <div class="modal-form-group">

            <label for="amountInput">
                Transfer Amount
            </label>

            <input
                id="amountInput"
                class="modal-input"
                type="number"
                min="1"
                placeholder="Enter amount"
            >

        </div>

        <button
            type="button"
            class="modal-btn"
            onclick="transferMoney()"
        >
            <i class="fa-solid fa-paper-plane"></i>
            Transfer Money
        </button>

    `;

    modal.classList.remove("hidden");
}


// ======================================================
// 14. TRANSFER
// ======================================================

function transferMoney() {

    const receiverInput =
        document.getElementById("receiverAccount");

    const amountInput =
        document.getElementById("amountInput");


    if (!receiverInput || !amountInput) {

        showToast(
            "Transfer fields not found.",
            "!"
        );

        return;
    }


    const receiver =
        receiverInput.value.trim();

    const value =
        amountInput.value.trim();


    if (receiver === "") {

        showToast(
            "Please enter receiver account number.",
            "!"
        );

        return;
    }


    if (value === "") {

        showToast(
            "Please enter transfer amount.",
            "!"
        );

        return;
    }


    const amount =
        Number(value);


    if (!Number.isFinite(amount)) {

        showToast(
            "Please enter a valid amount.",
            "!"
        );

        return;
    }


    if (amount <= 0) {

        showToast(
            "Transfer amount must be greater than zero.",
            "!"
        );

        return;
    }


    if (amount > balance) {

        showToast(
            "Insufficient balance.",
            "!"
        );

        return;
    }


    balance -= amount;

    saveBalance();


    addTransaction(
        "transfer",
        amount,
        "Money Transfer",
        receiver
    );


    updateBalanceUI();

    displayRecentTransactions();

    closeModal();


    showToast(
        formatCurrency(amount) +
        " transferred successfully.",
        "✓"
    );
}


// ======================================================
// 15. CHANGE PIN MODAL
// ======================================================

function openPinModal() {

    if (!modal || !modalContent) {
        return;
    }

    modalContent.innerHTML = `

        <h2 class="modal-title">
            Change PIN
        </h2>

        <p class="modal-subtitle">
            Update your 4-digit ATM security PIN.
        </p>

        <div class="modal-form-group">

            <label for="oldPin">
                Current PIN
            </label>

            <input
                id="oldPin"
                class="modal-input"
                type="password"
                maxlength="4"
                inputmode="numeric"
                placeholder="Enter current PIN"
            >

        </div>

        <div class="modal-form-group">

            <label for="newPin">
                New PIN
            </label>

            <input
                id="newPin"
                class="modal-input"
                type="password"
                maxlength="4"
                inputmode="numeric"
                placeholder="Enter new 4-digit PIN"
            >

        </div>

        <div class="modal-form-group">

            <label for="confirmPin">
                Confirm New PIN
            </label>

            <input
                id="confirmPin"
                class="modal-input"
                type="password"
                maxlength="4"
                inputmode="numeric"
                placeholder="Confirm new PIN"
            >

        </div>

        <button
            type="button"
            class="modal-btn"
            onclick="changePin()"
        >
            <i class="fa-solid fa-key"></i>
            Change PIN
        </button>

    `;

    modal.classList.remove("hidden");
}


// ======================================================
// 16. CHANGE PIN
// ======================================================

function changePin() {

    const oldPinElement =
        document.getElementById("oldPin");

    const newPinElement =
        document.getElementById("newPin");

    const confirmPinElement =
        document.getElementById("confirmPin");


    if (
        !oldPinElement ||
        !newPinElement ||
        !confirmPinElement
    ) {
        return;
    }


    const oldPin =
        oldPinElement.value.trim();

    const newPin =
        newPinElement.value.trim();

    const confirmPin =
        confirmPinElement.value.trim();


    if (oldPin !== correctPin) {

        showToast(
            "Current PIN is incorrect.",
            "!"
        );

        return;
    }


    if (!/^\d{4}$/.test(newPin)) {

        showToast(
            "New PIN must contain exactly 4 digits.",
            "!"
        );

        return;
    }


    if (newPin !== confirmPin) {

        showToast(
            "New PIN and confirmation do not match.",
            "!"
        );

        return;
    }


    if (newPin === oldPin) {

        showToast(
            "New PIN must be different from old PIN.",
            "!"
        );

        return;
    }


    correctPin = newPin;


    localStorage.setItem(
        "atmPin",
        newPin
    );


    updateDemoPin();

    closeModal();


    showToast(
        "PIN changed successfully!",
        "✓"
    );
}


// ======================================================
// 17. UPDATE DEMO PIN
// ======================================================

function updateDemoPin() {

    /*
       Demo PIN sirf login page par hai.
       Dashboard par element nahi hai.
    */

    if (demoPinDisplay) {

        demoPinDisplay.textContent =
            correctPin;
    }
}


// ======================================================
// 18. ADD TRANSACTION
// ======================================================

function addTransaction(
    type,
    amount,
    category,
    account
) {

    const transaction = {

        id: Date.now(),

        type: type,

        amount: amount,

        category: category,

        account: account || "",

        date: new Date().toLocaleString("en-PK")
    };


    transactions.unshift(transaction);


    transactions =
        transactions.slice(0, 20);


    localStorage.setItem(
        "atmTransactions",
        JSON.stringify(transactions)
    );
}


// ======================================================
// 19. DISPLAY RECENT TRANSACTIONS
// ======================================================

function displayRecentTransactions() {

    if (!recentTransactions) {
        return;
    }


    const recent =
        transactions.slice(0, 5);


    if (recent.length === 0) {

        recentTransactions.innerHTML = `

            <div class="empty-transactions">

                <i
                    class="fa-solid fa-receipt"
                    style="font-size:25px;"
                ></i>

                <p style="margin-top:10px;">
                    No transactions yet.
                </p>

            </div>

        `;

        return;
    }


    recentTransactions.innerHTML =
        recent
            .map(function (transaction) {

                let icon =
                    "fa-arrow-right-arrow-left";

                let amountClass =
                    "amount-negative";

                let sign = "-";


                if (
                    transaction.type ===
                    "deposit"
                ) {

                    icon =
                        "fa-circle-plus";

                    amountClass =
                        "amount-positive";

                    sign = "+";
                }


                if (
                    transaction.type ===
                    "withdraw"
                ) {

                    icon =
                        "fa-money-bill-wave";
                }


                if (
                    transaction.type ===
                    "transfer"
                ) {

                    icon =
                        "fa-paper-plane";
                }


                return `

                    <div class="transaction-item">

                        <div class="transaction-left">

                            <div
                                class="transaction-icon"
                            >
                                <i
                                    class="fa-solid ${icon}"
                                ></i>
                            </div>

                            <div>

                                <div
                                    class="transaction-title"
                                >
                                    ${escapeHTML(
                                        transaction.category
                                    )}
                                </div>

                                <div
                                    class="transaction-date"
                                >
                                    ${escapeHTML(
                                        transaction.date
                                    )}
                                </div>

                            </div>

                        </div>

                        <div
                            class="
                                transaction-amount
                                ${amountClass}
                            "
                        >
                            ${sign}
                            ${formatCurrency(
                                transaction.amount
                            )}
                        </div>

                    </div>

                `;

            })
            .join("");
}


// ======================================================
// 20. SHOW ALL TRANSACTIONS
// ======================================================

function showTransactions() {

    let content = `

        <h2 class="modal-title">
            Transaction Statement
        </h2>

        <p class="modal-subtitle">
            Your recent account activity.
        </p>

    `;


    if (transactions.length === 0) {

        content += `

            <div class="empty-transactions">
                No transactions available.
            </div>

        `;

    } else {

        content +=
            transactions
                .map(function (transaction) {

                    let sign = "-";

                    let amountClass =
                        "amount-negative";


                    if (
                        transaction.type ===
                        "deposit"
                    ) {

                        sign = "+";

                        amountClass =
                            "amount-positive";
                    }


                    let accountHTML = "";


                    if (transaction.account) {

                        accountHTML = `

                            <span>
                                Account:
                                ${escapeHTML(
                                    transaction.account
                                )}
                            </span>

                        `;
                    }


                    return `

                        <div class="statement-item">

                            <div class="statement-info">

                                <strong>
                                    ${escapeHTML(
                                        transaction.category
                                    )}
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        transaction.date
                                    )}
                                </span>

                                ${accountHTML}

                            </div>

                            <strong
                                class="${amountClass}"
                            >
                                ${sign}
                                ${formatCurrency(
                                    transaction.amount
                                )}
                            </strong>

                        </div>

                    `;

                })
                .join("");
    }


    modalContent.innerHTML =
        content;

    modal.classList.remove("hidden");
}


// ======================================================
// 21. SIMPLE MODAL
// ======================================================

function openSimpleModal(
    title,
    content
) {

    if (!modal || !modalContent) {
        return;
    }


    modalContent.innerHTML = `

        <h2 class="modal-title">
            ${escapeHTML(title)}
        </h2>

        ${content}

    `;


    modal.classList.remove("hidden");
}


// ======================================================
// 22. CLOSE MODAL
// ======================================================

function closeModal() {

    if (!modal || !modalContent) {
        return;
    }


    modal.classList.add("hidden");

    modalContent.innerHTML = "";
}


// ======================================================
// 23. CLICK OUTSIDE MODAL
// ======================================================

if (modal) {

    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeModal();
            }

        }
    );
}


// ======================================================
// 24. QUICK AMOUNT
// ======================================================

function setAmount(amount) {

    const amountInput =
        document.getElementById("amountInput");


    if (amountInput) {

        amountInput.value =
            String(amount);
    }
}


// ======================================================
// 25. SAVE BALANCE
// ======================================================

function saveBalance() {

    localStorage.setItem(
        "atmBalance",
        String(balance)
    );
}


// ======================================================
// 26. FORMAT CURRENCY
// ======================================================

function formatCurrency(amount) {

    const number =
        Number(amount);


    return (
        "Rs. " +
        number.toLocaleString(
            "en-PK",
            {
                minimumFractionDigits: 2,

                maximumFractionDigits: 2
            }
        )
    );
}


// ======================================================
// 27. TOAST
// ======================================================

function showToast(
    message,
    icon
) {

    if (
        !toast ||
        !toastMessage ||
        !toastIcon
    ) {
        return;
    }


    toastMessage.textContent =
        message;


    toastIcon.textContent =
        icon || "✓";


    toast.classList.add("show");


    setTimeout(
        function () {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );
}


// ======================================================
// 28. ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        String(value);


    return div.innerHTML;
}