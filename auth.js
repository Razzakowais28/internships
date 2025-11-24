// --------------------------------------
// Firebase CONFIG
// --------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyD1ZS9e5N26B698qHmMkDv7IJBSE88gsWs",
  authDomain: "Yinterny-portal-f9ef1.firebaseapp.com",
  projectId: "interny-portal-f9ef1",
  storageBucket: "interny-portal-f9ef1.firebasestorage.app",
  messagingSenderId: "371233302014",
  appId: "1:371233302014:web:a6af15e9a1b4ef72638caf"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();


// --------------------------------------
// Success / Error Modals Show/Hide
// --------------------------------------
function openSuccessModal() {
  const modal = document.getElementById("accountSuccessModal");
  if (modal) {
    modal.classList.add("show");
    console.log("✅ Success modal opened");
  }
}

function closeSuccessModal() {
  const modal = document.getElementById("accountSuccessModal");
  if (modal) modal.classList.remove("show");
}

function openEmailExistsModal() {
  const modal = document.getElementById("emailExistsModal");
  if (modal) {
    modal.classList.add("show");
    console.log("❗ Email exists modal opened");
  }
}

function closeEmailExistsModal() {
  const modal = document.getElementById("emailExistsModal");
  if (modal) modal.classList.remove("show");
}


// --------------------------------------
// HANDLE SIGNUP
// --------------------------------------
function handleSignup(event) {
  event.preventDefault();

  const fullName = document.getElementById("signupFullName").value.trim();
  const email    = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("signupConfirmPassword").value;
  const domain   = document.getElementById("signupDomain").value.trim();

  if (password !== confirmPassword) {
    alert("Passwords do not match."); // this one is fine
    return;
  }

  auth
    .createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      // Save extra data
      return db.collection("students").doc(cred.user.uid).set({
        fullName,
        email,
        domain,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      // ✅ OPEN SUCCESS POPUP 🎉
      openSuccessModal();
    })
    .catch((err) => {
      console.error("Signup error:", err);

      // 👇 This is the key part
      if (err.code === "auth/email-already-in-use") {
        // styled popup instead of browser alert
        openEmailExistsModal();
      } else {
        // for other errors, still show alert for now
        alert(err.message);
      }
    });
}

// Make globally accessible
window.handleSignup = handleSignup;


// --------------------------------------
// Modal Buttons
// --------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // success modal buttons
  const closeBtn = document.getElementById("closeSuccessModal");
  const stayBtn  = document.getElementById("successStayBtn");
  const loginBtn = document.getElementById("goToLoginBtn");

  if (closeBtn) closeBtn.addEventListener("click", closeSuccessModal);
  if (stayBtn)  stayBtn.addEventListener("click", closeSuccessModal);
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }

  // email-exists modal buttons
  const emailCloseBtn = document.getElementById("closeEmailExistsModal");
  const emailStayBtn  = document.getElementById("stayEmailExistBtn");
  const emailLoginBtn = document.getElementById("goToLoginFromEmailExist");

  if (emailCloseBtn) emailCloseBtn.addEventListener("click", closeEmailExistsModal);
  if (emailStayBtn)  emailStayBtn.addEventListener("click", closeEmailExistsModal);
  if (emailLoginBtn) {
    emailLoginBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
});
