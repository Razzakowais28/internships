// =========================
// 1) Firebase config
// =========================
const firebaseConfig = {
  apiKey: "AIzaSyD1ZS9e5N26B698qHmMkDv7IJBSE88gsWs",
  authDomain: "interny-portal-f9ef1.firebaseapp.com",
  projectId: "interny-portal-f9ef1",
};

// 2) Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// =========================
// SUCCESS MODAL HANDLING
// =========================

// Grab modal elements (will be null on pages that don't have the modal)
const accountSuccessModal = document.getElementById("accountSuccessModal");
const goToLoginBtn = document.getElementById("goToLoginBtn");
const successStayBtn = document.getElementById("successStayBtn");
const closeSuccessModal = document.getElementById("closeSuccessModal");

function openAccountSuccessModal() {
  // Fallback if modal HTML isn't on this page
  if (!accountSuccessModal) {
    alert("Account created successfully! Please log in.");
    window.location.href = "login.html";
    return;
  }
  accountSuccessModal.classList.add("show");
}

function closeAccountSuccessModal() {
  if (accountSuccessModal) {
    accountSuccessModal.classList.remove("show");
  }
}

// Attach events only if elements exist (so this file can be reused on other pages)
if (goToLoginBtn) {
  goToLoginBtn.addEventListener("click", () => {
    window.location.href = "login.html";
  });
}

if (successStayBtn) {
  successStayBtn.addEventListener("click", closeAccountSuccessModal);
}

if (closeSuccessModal) {
  closeSuccessModal.addEventListener("click", closeAccountSuccessModal);
}

if (accountSuccessModal) {
  // Close when clicking outside the modal card
  accountSuccessModal.addEventListener("click", (e) => {
    if (e.target === accountSuccessModal) {
      closeAccountSuccessModal();
    }
  });
}

// =========================
// SIGN UP FUNCTION
// =========================
async function handleSignup(event) {
  event.preventDefault();

  const fullName = document.getElementById("signupFullName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("signupConfirmPassword").value;
  const domain = document.getElementById("signupDomain").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    // 1. Create user in Firebase Auth
    const userCred = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCred.user;

    // 2. Store extra info in Firestore
    await db.collection("students").doc(user.uid).set({
      fullName,
      email,
      domain,
      createdAt: new Date(),
    });

    // 3. Show nice success popup instead of default alert
    openAccountSuccessModal();

  } catch (error) {
    alert(error.message);
  }
}

// =========================
// LOGIN FUNCTION
// =========================
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    await auth.signInWithEmailAndPassword(email, password);
    alert("Login successful!");
    window.location.href = "dashboard.html"; // Your dashboard page
  } catch (error) {
    alert(error.message);
  }
}

// =========================
// AUTH GUARD FOR PROTECTED PAGES
// =========================
function requireAuth() {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "login.html";
    }
  });
}
