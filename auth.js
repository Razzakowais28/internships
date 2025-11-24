// auth.js (Firebase v8)

// 1. Firebase config — same as your project
const firebaseConfig = {
  apiKey: "AIzaSyD1ZS9e5N26B698qHmMkDv7IJBSE88gsWs",
  authDomain: "interny-portal-f9ef1.firebaseapp.com",
  projectId: "interny-portal-f9ef1",
  storageBucket: "interny-portal-f9ef1.firebasestorage.app",
  messagingSenderId: "371233302014",
  appId: "1:371233302014:web:a6af15e9a1b4ef72638caf"
};

// 2. Init Firebase (avoid double init if reused on other pages)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// ---------- Helper: open/close modals ----------

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("show");
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("show");
}

// ---------- SIGN UP HANDLER (used by signup.html) ----------

async function handleSignup(event) {
  event.preventDefault();

  const fullNameInput = document.getElementById("signupFullName");
  const emailInput = document.getElementById("signupEmail");
  const passwordInput = document.getElementById("signupPassword");
  const confirmInput = document.getElementById("signupConfirmPassword");
  const domainInput = document.getElementById("signupDomain");

  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmInput.value;
  const domain = (domainInput.value || "").trim();

  if (!fullName) {
    alert("Please enter your full name.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match. Please check again.");
    return;
  }

  try {
    // 1) Create user in Firebase Auth
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    const user = cred.user;

    // 2) Create Firestore doc under `students/{uid}`
    await db.collection("students").doc(user.uid).set({
      fullName: fullName,
      email: email,
      domain: domain,
      emailVerified: user.emailVerified || false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // 3) Send email verification
    // await user.sendEmailVerification();

    // 4) Clear form
    fullNameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
    confirmInput.value = "";
    domainInput.value = "";

    // 5) Show success modal
    openModal("accountSuccessModal");

  } catch (err) {
    console.error("Signup error:", err);

    // If email already registered
    if (err.code === "auth/email-already-in-use") {
      openModal("emailExistsModal");
    } else if (err.code === "auth/weak-password") {
      alert("Password must be at least 6 characters.");
    } else {
      alert(err.message || "Something went wrong while creating your account.");
    }
  }
}

// ---------- Wire buttons for modals ----------

window.addEventListener("load", () => {
  // Success modal buttons
  const closeSuccessModal = document.getElementById("closeSuccessModal");
  const goToLoginBtn = document.getElementById("goToLoginBtn");
  const successStayBtn = document.getElementById("successStayBtn");

  if (closeSuccessModal) {
    closeSuccessModal.addEventListener("click", () => {
      closeModal("accountSuccessModal");
    });
  }

  if (goToLoginBtn) {
    goToLoginBtn.addEventListener("click", () => {
      // 👉 You can remind them to check email in UI / text
      window.location.href = "login.html";
    });
  }

  if (successStayBtn) {
    successStayBtn.addEventListener("click", () => {
      closeModal("accountSuccessModal");
    });
  }

  // Email-exists modal buttons
  const closeEmailExistsModal = document.getElementById("closeEmailExistsModal");
  const goToLoginFromEmailExist = document.getElementById("goToLoginFromEmailExist");
  const stayEmailExistBtn = document.getElementById("stayEmailExistBtn");

  if (closeEmailExistsModal) {
    closeEmailExistsModal.addEventListener("click", () => {
      closeModal("emailExistsModal");
    });
  }

  if (goToLoginFromEmailExist) {
    goToLoginFromEmailExist.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }

  if (stayEmailExistBtn) {
    stayEmailExistBtn.addEventListener("click", () => {
      closeModal("emailExistsModal");
    });
  }
});

// Make handleSignup global so signup.html can call it
window.handleSignup = handleSignup;
