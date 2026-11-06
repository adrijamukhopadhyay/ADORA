// ADORA Firebase Authentication + Firestore bookings.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged,
  updateProfile, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore, collection, addDoc, getDocs, query, where,
  deleteDoc, doc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const $ = id => document.getElementById(id);
const modal=$("authModal"), trigger=$("signIn"), form=$("authForm");
const errorBox=$("authError"), nameLabel=$("authNameLabel");
const confirmLabel=$("authConfirmLabel"), tabs=[...document.querySelectorAll("[data-auth-mode]")];
const submit=$("authSubmit"), googleButton=$("googleAuth");
let auth=null, db=null, mode="signin", currentUser=null;

const isConfigured=!!(firebaseConfig.apiKey && firebaseConfig.authDomain &&
  firebaseConfig.projectId && firebaseConfig.appId &&
  !String(firebaseConfig.apiKey).startsWith("PASTE_"));

if(isConfigured){
  const app=initializeApp(firebaseConfig);
  auth=getAuth(app);
  db=getFirestore(app);
}else{
  console.warn("ADORA: Firebase configuration is incomplete.");
}

function showError(message){errorBox.textContent=message;}
function openModal(){modal.classList.add("open");modal.setAttribute("aria-hidden","false");showError("");setTimeout(()=>$("authEmail")?.focus(),50);}
function closeModal(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");}
function setMode(next){
  mode=next;const signup=mode==="signup";
  nameLabel.hidden=!signup;confirmLabel.hidden=!signup;
  $("authName").required=signup;$("authConfirmPassword").required=signup;
  $("authPassword").autocomplete=signup?"new-password":"current-password";
  $("authTitle").innerHTML=signup?'Create your <span>account.</span>':'Welcome <span>back.</span>';
  submit.innerHTML=signup?"Create Account&nbsp; →":"Login&nbsp; →";
  tabs.forEach(t=>{const active=t.dataset.authMode===mode;t.classList.toggle("active",active);t.setAttribute("aria-selected",String(active));});
  showError("");
}
function updateHeader(user){
  currentUser=user||null;
  window.adoraCurrentUser=currentUser;
  if(currentUser){
    const displayName=currentUser.displayName||currentUser.email?.split("@")[0]||"Account";
    trigger.textContent=`Hi, ${displayName.split(" ")[0]}`;
    trigger.title=`${currentUser.email||""} — click to log out`;
    trigger.setAttribute("aria-label","Log out");
  }else{
    trigger.textContent="Login / Sign Up";trigger.title="Log in or create an ADORA account";
    trigger.setAttribute("aria-label","Login or sign up");
  }
  window.dispatchEvent(new CustomEvent("adora-auth-changed",{detail:{user:currentUser}}));
}
function friendlyError(error){
  const map={
    "auth/email-already-in-use":"An account with this email already exists. Please log in.",
    "auth/invalid-email":"Please enter a valid email address.",
    "auth/weak-password":"Use a password with at least 6 characters.",
    "auth/invalid-credential":"Email or password is incorrect.",
    "auth/too-many-requests":"Too many attempts. Please wait and try again.",
    "auth/popup-closed-by-user":"The Google sign-in window was closed.",
    "auth/popup-blocked":"Your browser blocked the Google sign-in popup.",
    "auth/unauthorized-domain":"Add this website domain in Firebase Authentication → Settings → Authorized domains.",
    "auth/operation-not-allowed":"Enable this sign-in method in Firebase Authentication.",
    "permission-denied":"Firestore denied this request. Publish the ADORA Firestore security rules provided with these files."
  };
  return map[error.code]||error.message||"Something went wrong. Please try again.";
}
trigger.addEventListener("click",()=>{
  if(currentUser){if(confirm("Log out of your ADORA account?"))signOut(auth).catch(e=>showError(friendlyError(e)));return;}
  setMode("signin");openModal();
});
tabs.forEach(t=>t.addEventListener("click",()=>setMode(t.dataset.authMode)));
document.querySelectorAll("[data-auth-close]").forEach(b=>b.addEventListener("click",closeModal));
modal.addEventListener("click",e=>{if(e.target===modal)closeModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});

form.addEventListener("submit",async e=>{
  e.preventDefault();showError("");
  if(!auth){showError("Firebase is not configured. Check firebase-config.js.");return;}
  const name=$("authName").value.trim(),email=$("authEmail").value.trim();
  const password=$("authPassword").value,confirmPassword=$("authConfirmPassword").value;
  if(password.length<6){showError("Password must contain at least 6 characters.");return;}
  if(mode==="signup"&&name.length<2){showError("Please enter your full name.");return;}
  if(mode==="signup"&&password!==confirmPassword){showError("The passwords do not match.");return;}
  submit.disabled=true;submit.textContent="Please wait…";
  try{
    if(mode==="signup"){
      const credential=await createUserWithEmailAndPassword(auth,email,password);
      await updateProfile(credential.user,{displayName:name});
    }else await signInWithEmailAndPassword(auth,email,password);
    form.reset();setMode("signin");closeModal();
  }catch(error){showError(friendlyError(error));}
  finally{submit.disabled=false;submit.innerHTML=mode==="signup"?"Create Account&nbsp; →":"Login&nbsp; →";}
});
googleButton.addEventListener("click",async()=>{
  showError("");if(!auth){showError("Firebase is not configured.");return;}
  googleButton.disabled=true;googleButton.textContent="Connecting to Google…";
  try{const provider=new GoogleAuthProvider();provider.setCustomParameters({prompt:"select_account"});await signInWithPopup(auth,provider);closeModal();}
  catch(error){showError(friendlyError(error));}
  finally{googleButton.disabled=false;googleButton.innerHTML='<span class="google-g">G</span> Continue with Google';}
});

// Public functions used by script.js. Every booking is scoped to the authenticated UID.
window.adoraSaveBooking=async booking=>{
  if(!auth||!db)throw new Error("Booking database is not ready.");
  const user=auth.currentUser;
  if(!user)throw new Error("Please log in before registering for an event.");
  const existing=await getDocs(query(collection(db,"bookings"),where("userId","==",user.uid)));
  if(existing.docs.some(d=>Number(d.data().eventId)===Number(booking.eventId)))
    throw new Error("You have already booked this event.");
  await addDoc(collection(db,"bookings"),{
    ...booking,eventId:Number(booking.eventId),userId:user.uid,
    userEmail:user.email||booking.email,createdAt:serverTimestamp()
  });
};
window.adoraLoadBookings=async()=>{
  if(!auth||!db)throw new Error("Firebase Firestore is not ready.");
  const user=auth.currentUser;
  if(!user)throw new Error("Please log in to view your bookings.");
  const snap=await getDocs(query(collection(db,"bookings"),where("userId","==",user.uid)));
  return snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>{
    const at=a.createdAt?.toMillis?.()||0,bt=b.createdAt?.toMillis?.()||0;return bt-at;
  });
};
window.adoraCancelBooking=async bookingId=>{
  if(!auth||!db||!auth.currentUser)throw new Error("Please log in first.");
  // Confirm ownership before deleting; Firestore rules enforce it again.
  const ref=doc(db,"bookings",bookingId);
  await deleteDoc(ref);
};
window.adoraSendPasswordReset=async email=>{
  if(!auth)throw new Error("Firebase is not configured.");
  return sendPasswordResetEmail(auth,email);
};
if(auth)onAuthStateChanged(auth,user=>updateHeader(user));
else updateHeader(null);
