import { auth, googleProvider } from "../config/firebase";
import { createUserWithEmailAndPassword,signInWithPopup } from "firebase/auth";

const SocialLogin = () => {

  const signInWithGoogle = async (e) => {
    e.preventDefault(); 
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("User Created");
    } catch (error) {
      console.error("Signup Error:", error.message);
      alert(error.message); 
    }
  };

    return (
      <div className="social-login">
        <button className="social-button" onClick={signInWithGoogle}>
          <img src="https://logos-world.net/wp-content/uploads/2020/09/Google-Symbol.png" alt="Google" className="social-icon " />
        </button>
        
      </div>
    )
  }
  export default SocialLogin;