// --------------------------------------
// Firebase CONFIG (PUT YOUR REAL CONFIG)
// --------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyD1ZS9e5N26B698qHmMkDv7IJBSE88gsWs",
  authDomain: "Yinterny-portal-f9ef1.firebaseapp.com",
  projectId: "interny-portal-f9ef1",
  storageBucket: "interny-portal-f9ef1.firebasestorage.app",
  messagingSenderId: "371233302014",
  appId: "1:371233302014:web:a6af15e9a1b4ef72638caf"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();


// --------------------------------------
// Success Modal Show/Hide
// --------------------------------------
function openSuccessModal() {
  const modal = document.getElementById("accountSuccessModal");
  modal.classList.add("show");
}

function closeSuccessModal() {
  const modal = document.getElementById("accountSuccessModal");
  modal.classList.remove("show");
}


// --------------------------------------
// HANDLE SIGNUP
// --------------------------------------
function handleSignup(event) {
  event.preventDefault();

  const fullName = document.getElementById("signupFullName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("signupConfirmPassword").value;
  const domain = document.getElementById("signupDomain").value.trim();

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
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
      // OPEN SUCCESS POPUP 🎉
      openSuccessModal();
    })
    .catch((err) => {
      alert(err.message);
      console.error(err);
    });
}

// Make globally accessible
window.handleSignup = handleSignup;


// --------------------------------------
// Success Modal Buttons
// --------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("closeSuccessModal");
  const stayBtn = document.getElementById("successStayBtn");
  const loginBtn = document.getElementById("goToLoginBtn");

  if (closeBtn) closeBtn.addEventListener("click", closeSuccessModal);
  if (stayBtn) stayBtn.addEventListener("click", closeSuccessModal);
  if (loginBtn)
    loginBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
});
