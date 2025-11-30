// =========================================================
//            SHERBET HOLMES - MAIN SCRIPT
// =========================================================

// 1. CART DATA INITIALIZATION
if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify([]));
}

// 2. ADD TO CART FUNCTION
function addToCart(name, price, image) {
    let c = JSON.parse(localStorage.getItem("cart"));
    let f = c.find(i => i.name === name);

    if (f) f.qty++;
    else c.push({ name, price, image, qty: 1 });

    localStorage.setItem("cart", JSON.stringify(c));
    updateCartCount();
    
    alert(name + " added to cart!");
}

// 3. UPDATE NAVBAR BADGE
function updateCartCount() {
    let c = JSON.parse(localStorage.getItem("cart"));
    let t = c.reduce((a, i) => a + i.qty, 0);

    let el = document.getElementById("cart-count");
    if (el) el.textContent = t;
}

// 4. LOAD CART DISPLAY (For Cart Page)
function loadCartItems() {
    let c = JSON.parse(localStorage.getItem("cart"));
    let box = document.getElementById("cart-items");
    let totalBox = document.getElementById("total-price");

    if (!box || !totalBox) return;

    let discountInput = document.querySelector(".discount-input");

    // SCENARIO 1: CART IS EMPTY
    if (c.length === 0) {
        box.style.display = "block";
        box.style.textAlign = "center";

        box.innerHTML = `
            <div style="padding: 60px 20px;">
                <i class="fa-solid fa-basket-shopping" style="font-size: 80px; color: #d1e8e2; margin-bottom: 20px;"></i>
                <h3 style="color: #2b7a78; font-size: 28px; margin-bottom: 10px;">Your Cart is Empty</h3>
                <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
                    It looks like you haven't started your investigation yet! 🕵️‍♀️
                </p>
                <a href="menu.html" class="btn" style="text-decoration: none; display: inline-block; padding: 12px 30px; background-color: #2b7a78; color: white; border-radius: 10px;">
                    Investigate the Menu
                </a>
            </div>
        `;
        
        totalBox.textContent = "0";
        if (discountInput) discountInput.value = "";
        return;
    }

    // SCENARIO 2: CART HAS ITEMS
    box.style.display = "grid"; 
    box.style.textAlign = "left";

    box.innerHTML = "";
    let total = 0;

    c.forEach((it, i) => {
        let sub = it.qty * it.price;
        total += sub;

        box.innerHTML += `
        <div class='item cart-item'>
            <img src="${it.image}" class="menu-img">
            <h3>${it.name}</h3>
            <p style="color:#2b7a78; font-weight:bold;">Rs ${it.price}</p>
            <p>Qty: ${it.qty}</p>
            <p>Subtotal: Rs ${sub}</p>
            <div style="display:flex; justify-content:center; gap:10px; margin-top:10px;">
                <button onclick="inc(${i})" style="width:30px;">+</button>
                <button onclick="dec(${i})" style="width:30px;">-</button>
            </div>
        </div>`;
    });

    totalBox.textContent = total;
}

function inc(i) {
    let c = JSON.parse(localStorage.getItem("cart"));
    c[i].qty++;
    localStorage.setItem("cart", JSON.stringify(c));
    loadCartItems();
    updateCartCount();
}

function dec(i) {
    let c = JSON.parse(localStorage.getItem("cart"));
    if (c[i].qty > 1) c[i].qty--;
    else c.splice(i, 1);
    localStorage.setItem("cart", JSON.stringify(c));
    loadCartItems();
    updateCartCount();
}

// 5. CHECKOUT LOGIC
const discountCodes = {
    SWEET10: 10,
    HAPPY20: 20,
    NARC_PRINCESS: 30
};

function handleCheckout() {
    let cart = JSON.parse(localStorage.getItem("cart"));

    if (!cart || cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    let total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    
    let discountInput = document.querySelector(".discount-input");
    let userCode = "";
    if (discountInput) {
        userCode = discountInput.value.trim().toUpperCase();
    }

    if (userCode && !discountCodes[userCode]) {
        alert("Invalid discount code!");
        return;
    }

    if (userCode && discountCodes[userCode]) {
        let discountPercent = discountCodes[userCode];
        let discountAmount = (total * discountPercent) / 100;
        total -= discountAmount;
        alert(`Discount applied! You spent Rs ${total.toFixed(2)}. Come again!`);
    } else {
        alert(`You spent Rs ${total}. Come again!`);
    }

    localStorage.setItem("cart", JSON.stringify([]));
    loadCartItems();
    updateCartCount();
}

// 6. SLIDESHOW LOGIC
let slideIndex = 1;

function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (slides.length === 0) return;
    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    if (dots.length > 0) {
        dots[slideIndex - 1].className += " active";
    }
}
function plusSlides(n) { showSlides(slideIndex += n); }
function currentSlide(n) { showSlides(slideIndex = n); }

// 7. ACCORDION LOGIC (For FAQ)
function initAccordion() {
    var acc = document.getElementsByClassName("faq-question");
    for (var i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            } 
        });
    }
}

function filterFAQ() {
    var input, filter, container, items, button, i, txtValue;
    input = document.getElementById("searchInput");
    if(!input) return;
    filter = input.value.toUpperCase();
    container = document.querySelector(".faq-container");
    items = container.getElementsByClassName("faq-item");

    for (i = 0; i < items.length; i++) {
        button = items[i].getElementsByClassName("faq-question")[0];
        txtValue = button.textContent || button.innerText;
        
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            items[i].style.display = "";
        } else {
            items[i].style.display = "none";
        }
    }
}


// =========================================================
//            MAIN PAGE LOAD LISTENER (The Brain)
// =========================================================
document.addEventListener("DOMContentLoaded", () => {

    // A. Run Common Functions
    updateCartCount();
    
    // B. If Cart Page
    if (typeof loadCartItems === 'function') loadCartItems();
    
    // C. If Checkout Button Exists
    let checkoutButton = document.getElementById("checkout-btn");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", handleCheckout);
    }

    // D. If Slideshow Exists
    if (document.querySelector(".mySlides")) showSlides(slideIndex);

    // E. If FAQ Page
    if (document.getElementsByClassName("faq-question").length > 0) {
        initAccordion();
    }
    // Bind search input for FAQ
    let searchInput = document.getElementById("searchInput");
    if(searchInput) {
        searchInput.addEventListener("keyup", filterFAQ);
    }

    // F. FEEDBACK FORM (Saves to Local Storage + Google Sheet)
    const feedbackForm = document.getElementById("feedbackForm");
    if (feedbackForm) {
        feedbackForm.addEventListener("submit", function(e) {
            e.preventDefault(); 

            const name = document.getElementById("reviewerName").value;
            const message = document.getElementById("reviewText").value;
            const ratingStr = document.getElementById("reviewRating").value;
            let stars = "⭐".repeat(parseInt(ratingStr));

            const newReview = { name: name, text: message, stars: stars };
            let savedReviews = JSON.parse(localStorage.getItem("sherbetReviews")) || [];
            savedReviews.push(newReview);
            localStorage.setItem("sherbetReviews", JSON.stringify(savedReviews));

            const scriptURL = "https://script.google.com/macros/s/AKfycbzBvnnrE8vq_2jU1iOk6NkfkF8OkpzoV1w3Hl5CS6g2JINBNRSvvmk_5PMe_X6Ge47f9A/exec";
            fetch(scriptURL, { method: 'POST', body: new FormData(feedbackForm)})
                .then(response => {
                    alert("Thank you! Your feedback has been recorded.");
                    window.location.href = "reviews.html"; 
                })
                .catch(error => {
                    alert("Thank you! Your feedback has been recorded.");
                    window.location.href = "reviews.html";
                });
        });
    }

    // G. LOGIN FORM
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault(); 
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
            
            if (email === "admin@sherbet.com" && password === "12345") {
                localStorage.setItem("isLoggedIn", "true");
                alert("Login Successful! Welcome back.");
                window.location.href = "index.html"; 
            } else {
                alert("Invalid email or password.");
            }
        });
    }

    // H. NAVBAR LOGOUT LOGIC
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const loginLink = document.querySelector('a[href="login.html"]');
    const loginBtn = document.querySelector('.login-btn'); 
    let targetElement = loginLink || loginBtn;

    if (isLoggedIn === "true" && targetElement) {
        targetElement.textContent = "Logout";
        if(targetElement.classList.contains('login-btn')) {
             targetElement.style.backgroundColor = "#e85b42";
        } else {
             targetElement.style.color = "red";
        }
        targetElement.href = "#"; 
        targetElement.addEventListener("click", function(e) {
            e.preventDefault();
            localStorage.removeItem("isLoggedIn");
            alert("You have been logged out.");
            window.location.reload();
        });
    }
    
    // I. LOAD USER REVIEWS (Reviews Page)
    const reviewsContainer = document.getElementById("new-reviews-placeholder");
    if (reviewsContainer) {
        let savedReviews = JSON.parse(localStorage.getItem("sherbetReviews")) || [];
        savedReviews.forEach(review => {
            let card = document.createElement("div");
            card.className = "review-card"; 
            card.innerHTML = `
                <div class="stars">${review.stars}</div>
                <p class="review-text">${review.text}</p>
                <p class="review-author">- ${review.name}</p>
                <div style="font-size: 12px; color: #999; margin-top: 10px;">(Verified Buyer via Feedback Form)</div>
            `;
            reviewsContainer.prepend(card);
        });
    }
});