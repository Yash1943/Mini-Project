document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = this.querySelector('input[type="text"]').value;
    const password = this.querySelector('input[type="password"]').value;
    // Here you can add code to handle the login process, like making API calls.
    console.log('Login:', username, password);
  });
  
  document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    // Here you can add code to handle the sign-up process, like making API calls.
    console.log('Sign Up:', username, email, password);
  });




document.addEventListener("DOMContentLoaded", () => {
  const signUpButton = document.querySelector(".btn-signup");
  const signInButton = document.querySelector(".btn-signin");
  const signUpSection = document.querySelector(".signup-section");
  const signInSection = document.querySelector(".signin-section");

  signUpButton.addEventListener("click", () => {
    signUpSection.classList.add("show-signup");
    signInSection.classList.add("show-signup");
    signUpSection.classList.remove("show-signin");
    signInSection.classList.remove("show-signin");
  });

  signInButton.addEventListener("click", () => {
    signUpSection.classList.add("show-signin");
    signInSection.classList.add("show-signin");
    signUpSection.classList.remove("show-signup");
    signInSection.classList.remove("show-signup");
  });
});
