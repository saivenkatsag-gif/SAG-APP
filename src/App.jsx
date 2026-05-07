import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = "https://mefmpxohxrpnezwlbchj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZm1weG9oeHJwbmV6d2xiY2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTk3MjEsImV4cCI6MjA5Mjc5NTcyMX0.PbTag81xO1_X8vuxkizhVYjfhj3lz5CO3yjn8zlnNoM";

const LOGO = "https://framerusercontent.com/images/J2SsjH2XcUHn6jAVX44tSmKJ8.png";

// ─── SUPABASE EMAIL AUTH HELPERS ─────────────────────────────
const sbHeaders = {
  "Content-Type": "application/json",
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

// Register — sends confirmation email; user must click it before they can log in
async function sbSignUp(email, password, name) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: sbHeaders,
    body: JSON.stringify({
      email,
      password,
      data: { full_name: name },
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.message || "Registration failed");
  // If identities array is empty the email is already registered
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    throw new Error("An account with this email already exists. Please sign in.");
  }
  return data;
}

// Login — will fail with a clear message if email not yet confirmed
async function sbSignIn(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: sbHeaders,
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data.error_description || data.msg || "";
    if (msg.toLowerCase().includes("email not confirmed") || msg.toLowerCase().includes("not confirmed")) {
      throw new Error("Please confirm your email first. Check your inbox and click the confirmation link.");
    }
    throw new Error("Invalid email or password. Please try again.");
  }
  return data;
}

async function sbSignOut(accessToken) {
  await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
    method: "POST",
    headers: { ...sbHeaders, Authorization: `Bearer ${accessToken}` },
  });
}

async function sbGetUser(accessToken) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { ...sbHeaders, Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  return res.json();
}

// Resend confirmation email
async function sbResendConfirmation(email) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/resend`, {
    method: "POST",
    headers: sbHeaders,
    body: JSON.stringify({ type: "signup", email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.message || "Could not resend email");
  return data;
}

function saveSession(session) {
  localStorage.setItem("sag_sb_session", JSON.stringify(session));
}
function loadSession() {
  try { return JSON.parse(localStorage.getItem("sag_sb_session") || "null"); } catch { return null; }
}
function clearSession() {
  localStorage.removeItem("sag_sb_session");
}


  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{font-family:'DM Sans',sans-serif;background:#0a0f0d;color:#e8f5ec;overflow-x:hidden;}
  :root{
    --green:#2ecc71;--green-dark:#1a9c52;--glow:rgba(46,204,113,0.16);
    --dark:#0a0f0d;--dark2:#101810;--card:#131f16;--card2:#182118;
    --border:rgba(46,204,113,0.13);--text:#e8f5ec;--muted:#7aab8a;--radius:16px;
  }
  .sag-app{min-height:100vh;background:#0a0f0d;color:#e8f5ec;font-family:'DM Sans',sans-serif;}

  /* ── NAV ── */
  .nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:14px 44px;background:rgba(10,15,13,0.96);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);gap:20px;}
  .nav-logo{display:flex;align-items:center;gap:10px;cursor:pointer;text-decoration:none;flex-shrink:0;}
  .nav-logo img{height:48px;}
  .nav-logo-text{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:1.1rem;color:#fff;letter-spacing:.03em;}
  .nav-search-wrap{flex:1;max-width:420px;position:relative;}
  .nav-search{width:100%;padding:9px 14px 9px 38px;background:var(--card2);border:1.5px solid var(--border);border-radius:40px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:0.85rem;outline:none;transition:border-color .2s;}
  .nav-search:focus{border-color:var(--green);}
  .nav-search::placeholder{color:var(--muted);}
  .nav-search-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:0.95rem;color:var(--muted);pointer-events:none;}
  .nav-right{display:flex;align-items:center;gap:10px;flex-shrink:0;}
  .nav-icon-btn{position:relative;background:var(--card2);border:1.5px solid var(--border);color:var(--muted);width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.05rem;transition:all .2s;}
  .nav-icon-btn:hover{border-color:var(--green);color:var(--green);}
  .nav-cart-count{position:absolute;top:-4px;right:-4px;background:var(--green);color:#0a0f0d;font-size:0.6rem;font-weight:800;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;}
  .nav-user-btn{display:flex;align-items:center;gap:8px;background:var(--card2);border:1.5px solid var(--border);color:var(--text);padding:8px 16px;border-radius:40px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:0.84rem;font-weight:600;transition:all .2s;}
  .nav-user-btn:hover{border-color:var(--green);color:var(--green);}
  .nav-user-avatar{width:26px;height:26px;border-radius:50%;background:var(--green);color:#0a0f0d;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:0.85rem;flex-shrink:0;}
  .btn-login-nav{background:var(--green);color:#0a0f0d;padding:9px 20px;border-radius:40px;font-weight:700;font-size:0.85rem;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;transition:all .2s;}
  .btn-login-nav:hover{background:var(--green-dark);}
  .hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;background:none;border:none;padding:4px;}
  .hamburger span{width:24px;height:2px;background:var(--green);border-radius:2px;display:block;}

  /* ── AUTH MODAL ── */
  .auth-overlay{position:fixed;inset:0;z-index:9999;background:rgba(5,10,7,0.9);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;}
  .auth-box{background:var(--card);border:1px solid rgba(46,204,113,0.25);border-radius:20px;padding:44px 40px;width:100%;max-width:420px;text-align:center;position:relative;}
  .auth-close{position:absolute;top:16px;right:18px;background:none;border:none;color:var(--muted);font-size:1.3rem;cursor:pointer;transition:color .2s;}
  .auth-close:hover{color:#e05050;}
  .auth-logo{height:44px;margin-bottom:20px;}
  .auth-box h2{font-family:'Barlow Condensed',sans-serif;font-size:1.9rem;font-weight:800;color:#fff;margin-bottom:5px;}
  .auth-box .auth-sub{font-size:0.86rem;color:var(--muted);margin-bottom:28px;}
  .auth-tabs{display:flex;gap:0;margin-bottom:28px;background:var(--dark2);border-radius:40px;padding:3px;}
  .auth-tab{flex:1;padding:8px 16px;border-radius:40px;font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:600;cursor:pointer;border:none;background:none;color:var(--muted);transition:all .2s;}
  .auth-tab.active{background:var(--green);color:#0a0f0d;}
  .auth-field{margin-bottom:14px;text-align:left;}
  .auth-field label{font-size:0.73rem;color:var(--muted);font-weight:700;letter-spacing:.08em;text-transform:uppercase;display:block;margin-bottom:5px;}
  .auth-field input{width:100%;padding:11px 14px;background:var(--dark2);border:1.5px solid rgba(46,204,113,0.2);border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:0.93rem;outline:none;transition:border-color .2s;}
  .auth-field input:focus{border-color:var(--green);}
  .auth-btn{width:100%;padding:13px;background:var(--green);color:#0a0f0d;border:none;border-radius:40px;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.95rem;cursor:pointer;transition:all .2s;margin-top:6px;}
  .auth-btn:hover{background:var(--green-dark);transform:translateY(-1px);}
  .auth-error{color:#e05050;font-size:0.83rem;margin-top:10px;background:rgba(224,80,80,0.12);border-radius:8px;padding:8px 14px;border:1px solid rgba(224,80,80,0.3);}
  .auth-success{color:var(--green);font-size:0.83rem;margin-top:10px;background:rgba(46,204,113,0.1);border-radius:8px;padding:8px 14px;border:1px solid rgba(46,204,113,0.3);}
  .auth-divider{display:flex;align-items:center;gap:12px;margin:18px 0;color:var(--muted);font-size:0.78rem;}
  .auth-divider::before,.auth-divider::after{content:'';flex:1;height:1px;background:var(--border);}
  .auth-demo-note{font-size:0.77rem;color:var(--muted);background:var(--dark2);border-radius:8px;padding:10px 14px;text-align:left;line-height:1.7;border:1px solid var(--border);}
  .auth-demo-note strong{color:var(--green);}

  /* ── CART DRAWER ── */
  .cart-overlay{position:fixed;inset:0;z-index:9998;background:rgba(5,10,7,0.7);backdrop-filter:blur(6px);}
  .cart-drawer{position:fixed;top:0;right:0;bottom:0;z-index:9999;width:100%;max-width:400px;background:var(--card);border-left:1px solid rgba(46,204,113,0.2);display:flex;flex-direction:column;transition:transform .35s cubic-bezier(.4,0,.2,1);transform:translateX(100%);}
  .cart-drawer.open{transform:translateX(0);}
  .cart-hdr{display:flex;align-items:center;justify-content:space-between;padding:20px 22px;border-bottom:1px solid var(--border);}
  .cart-hdr h3{font-family:'Barlow Condensed',sans-serif;font-size:1.3rem;font-weight:800;color:#fff;}
  .cart-close{background:none;border:none;color:var(--muted);font-size:1.4rem;cursor:pointer;transition:color .2s;}
  .cart-close:hover{color:#e05050;}
  .cart-body{flex:1;overflow-y:auto;padding:18px;}
  .cart-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--muted);gap:12px;font-size:0.9rem;}
  .cart-empty-icon{font-size:3.5rem;opacity:0.4;}
  .cart-item{display:flex;gap:12px;padding:14px 0;border-bottom:1px solid var(--border);}
  .cart-item-img{width:68px;height:68px;border-radius:10px;overflow:hidden;background:var(--dark2);flex-shrink:0;border:1px solid var(--border);}
  .cart-item-img img{width:100%;height:100%;object-fit:cover;}
  .cart-item-info{flex:1;min-width:0;}
  .cart-item-name{font-size:0.85rem;font-weight:600;color:#fff;margin-bottom:4px;line-height:1.3;}
  .cart-item-price{font-family:'Barlow Condensed',sans-serif;font-size:1rem;font-weight:800;color:var(--green);}
  .cart-item-qty{display:flex;align-items:center;gap:8px;margin-top:8px;}
  .qty-btn{width:26px;height:26px;border-radius:50%;border:1px solid var(--border);background:var(--dark2);color:var(--text);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:0.85rem;transition:all .2s;}
  .qty-btn:hover{border-color:var(--green);color:var(--green);}
  .qty-num{font-size:0.88rem;font-weight:600;color:#fff;min-width:18px;text-align:center;}
  .cart-item-remove{color:var(--muted);background:none;border:none;cursor:pointer;font-size:1rem;transition:color .2s;align-self:flex-start;margin-top:2px;}
  .cart-item-remove:hover{color:#e05050;}
  .cart-footer{padding:16px 22px;border-top:1px solid var(--border);}
  .cart-total-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;}
  .cart-total-label{font-size:0.88rem;color:var(--muted);font-weight:500;}
  .cart-total-val{font-family:'Barlow Condensed',sans-serif;font-size:1.4rem;font-weight:800;color:#fff;}
  .cart-checkout-btn{width:100%;padding:14px;background:var(--green);color:#0a0f0d;border:none;border-radius:40px;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.95rem;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;}
  .cart-checkout-btn:hover{background:var(--green-dark);transform:translateY(-1px);}
  .cart-wa-note{font-size:0.75rem;color:var(--muted);text-align:center;margin-top:10px;}

  /* ── SHOP ── */
  .page-hero{padding:108px 48px 56px;position:relative;overflow:hidden;background:var(--dark2);border-bottom:1px solid var(--border);text-align:center;}
  .page-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 70% 50%,rgba(46,204,113,0.08),transparent 70%);pointer-events:none;}
  .page-hero-grid{position:absolute;inset:0;background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);background-size:60px 60px;opacity:0.3;}
  .page-hero-inner{position:relative;z-index:2;max-width:720px;margin:0 auto;}
  .section-tag{display:inline-block;background:var(--glow);border:1px solid var(--green);border-radius:40px;padding:5px 16px;font-size:0.77rem;color:var(--green);font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:16px;}

  .shop-layout{display:flex;padding:32px 44px 80px;align-items:flex-start;gap:28px;}
  .shop-sidebar{width:220px;flex-shrink:0;position:sticky;top:90px;}
  .sidebar-label{font-size:0.7rem;font-weight:700;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;display:block;padding:0 4px;}
  .sidebar-cats{list-style:none;margin-bottom:20px;}
  .sidebar-cats li{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-radius:10px;cursor:pointer;transition:all .2s;font-size:0.85rem;color:var(--muted);font-weight:500;}
  .sidebar-cats li:hover{background:var(--card2);color:var(--text);}
  .sidebar-cats li.active{background:var(--glow);color:var(--green);font-weight:700;}
  .cat-count{font-size:0.68rem;background:var(--card2);border-radius:20px;padding:2px 7px;color:var(--muted);}
  .sidebar-divider{height:1px;background:var(--border);margin:0 0 16px;}
  .sidebar-tag-btn{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:10px;cursor:pointer;background:none;border:none;font-family:'DM Sans',sans-serif;font-size:0.85rem;color:var(--muted);font-weight:500;transition:all .2s;width:100%;text-align:left;margin-bottom:4px;}
  .sidebar-tag-btn:hover{background:var(--card2);color:var(--text);}
  .sidebar-tag-btn.active{background:var(--glow);color:var(--green);font-weight:700;}
  .tag-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}

  .shop-main{flex:1;min-width:0;}
  .products-toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;gap:12px;flex-wrap:wrap;}
  .products-count{font-size:0.82rem;color:var(--muted);}
  .products-count strong{color:var(--text);}
  .sort-select{background:var(--card2);border:1.5px solid var(--border);border-radius:40px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:0.82rem;padding:7px 14px;outline:none;cursor:pointer;transition:border-color .2s;}
  .sort-select:focus{border-color:var(--green);}

  .products-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
  .product-card{background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden;transition:border-color .2s,transform .2s;cursor:pointer;position:relative;display:flex;flex-direction:column;}
  .product-card:hover{border-color:rgba(46,204,113,0.5);transform:translateY(-4px);}
  .product-badge{position:absolute;top:9px;left:9px;z-index:2;background:var(--green);color:#0a0f0d;font-size:0.66rem;font-weight:800;padding:2px 8px;border-radius:20px;text-transform:uppercase;}
  .product-img{width:100%;aspect-ratio:4/3;overflow:hidden;background:#0d1a10;}
  .product-img img{width:100%;height:100%;object-fit:cover;transition:transform .4s;}
  .product-card:hover .product-img img{transform:scale(1.06);}
  .product-info{padding:12px 14px 6px;flex:1;}
  .product-cat{font-size:0.7rem;font-weight:700;color:var(--green);letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;opacity:0.8;}
  .product-name{font-size:0.9rem;font-weight:600;color:#fff;line-height:1.35;margin-bottom:8px;}
  .product-price{display:flex;align-items:baseline;gap:8px;margin-bottom:4px;}
  .price-new{font-family:'Barlow Condensed',sans-serif;font-size:1.2rem;font-weight:800;color:var(--green);}
  .price-old{font-size:0.8rem;color:var(--muted);text-decoration:line-through;}
  .price-off{font-size:0.72rem;background:rgba(46,204,113,0.15);border:1px solid rgba(46,204,113,0.3);color:var(--green);padding:1px 7px;border-radius:20px;font-weight:700;}
  .product-status-dot{display:flex;align-items:center;gap:5px;font-size:0.72rem;color:var(--green);font-weight:600;margin-bottom:10px;}
  .product-status-dot::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--green);display:inline-block;}
  .product-actions{display:grid;grid-template-columns:1fr auto;gap:8px;padding:10px 14px 14px;}
  .add-cart-btn{background:var(--green);color:#0a0f0d;border:none;border-radius:40px;padding:9px 14px;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.83rem;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:6px;}
  .add-cart-btn:hover{background:var(--green-dark);}
  .add-cart-btn:disabled{opacity:0.5;cursor:not-allowed;}
  .enquire-btn{border:1.5px solid var(--border);background:none;color:var(--muted);border-radius:40px;padding:9px 12px;cursor:pointer;transition:all .2s;font-size:0.9rem;}
  .enquire-btn:hover{border-color:var(--green);color:var(--green);}

  /* ── PRODUCT MODAL ── */
  .product-modal-overlay{position:fixed;inset:0;z-index:9990;background:rgba(5,10,7,0.9);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;}
  .product-modal{background:var(--card);border:1px solid rgba(46,204,113,0.2);border-radius:20px;width:100%;max-width:760px;max-height:90vh;overflow-y:auto;position:relative;}
  .product-modal-close{position:absolute;top:16px;right:18px;background:var(--dark2);border:1px solid var(--border);color:var(--muted);width:32px;height:32px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1rem;transition:all .2s;z-index:2;}
  .product-modal-close:hover{border-color:#e05050;color:#e05050;}
  .product-modal-inner{display:grid;grid-template-columns:1fr 1fr;}
  .product-modal-img{aspect-ratio:1/1;overflow:hidden;background:var(--dark2);border-radius:20px 0 0 20px;}
  .product-modal-img img{width:100%;height:100%;object-fit:cover;}
  .product-modal-body{padding:30px 26px;}
  .pm-cat{font-size:0.72rem;font-weight:700;color:var(--green);letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;}
  .pm-title{font-family:'Barlow Condensed',sans-serif;font-size:1.7rem;font-weight:800;color:#fff;line-height:1.1;margin-bottom:12px;}
  .pm-price-row{display:flex;align-items:baseline;gap:10px;margin-bottom:18px;}
  .pm-price{font-family:'Barlow Condensed',sans-serif;font-size:2rem;font-weight:800;color:var(--green);}
  .pm-old{font-size:1rem;color:var(--muted);text-decoration:line-through;}
  .pm-off{font-size:0.8rem;background:rgba(46,204,113,0.15);border:1px solid rgba(46,204,113,0.3);color:var(--green);padding:2px 9px;border-radius:20px;font-weight:700;}
  .pm-divider{height:1px;background:var(--border);margin:18px 0;}
  .pm-label{font-size:0.72rem;font-weight:700;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px;}
  .pm-actions{display:flex;flex-direction:column;gap:10px;margin-top:20px;}
  .pm-add-btn{background:var(--green);color:#0a0f0d;border:none;border-radius:40px;padding:13px 20px;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.95rem;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;}
  .pm-add-btn:hover{background:var(--green-dark);transform:translateY(-1px);}
  .pm-wa-btn{border:1.5px solid rgba(46,204,113,0.4);background:none;color:var(--green);border-radius:40px;padding:11px 20px;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.9rem;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;}
  .pm-wa-btn:hover{background:var(--glow);}

  /* ── USER DROPDOWN ── */
  .user-menu-wrap{position:relative;}
  .user-dropdown{position:absolute;top:calc(100% + 10px);right:0;background:var(--card);border:1px solid rgba(46,204,113,0.2);border-radius:14px;min-width:220px;overflow:hidden;z-index:200;box-shadow:0 20px 40px rgba(0,0,0,0.4);}
  .user-dropdown-hdr{padding:14px 16px;border-bottom:1px solid var(--border);}
  .user-dropdown-name{font-weight:700;font-size:0.9rem;color:#fff;}
  .user-dropdown-email{font-size:0.77rem;color:var(--muted);margin-top:2px;}
  .user-dropdown-item{display:flex;align-items:center;gap:10px;padding:11px 16px;cursor:pointer;font-size:0.85rem;color:var(--muted);transition:all .2s;background:none;border:none;width:100%;font-family:'DM Sans',sans-serif;text-align:left;}
  .user-dropdown-item:hover{background:var(--card2);color:var(--text);}
  .user-dropdown-item.danger:hover{background:rgba(224,80,80,0.1);color:#e05050;}

  /* ── WISH PAGE ── */
  .wish-page{padding:100px 44px 80px;}
  .wish-page h2{font-family:'Barlow Condensed',sans-serif;font-size:2rem;font-weight:800;color:#fff;margin-bottom:24px;}

  /* ── FOOTER ── */
  footer{background:#080d09;border-top:1px solid var(--border);padding:56px 44px 28px;}
  .footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1.2fr;gap:40px;margin-bottom:44px;}
  .footer-brand img{height:36px;margin-bottom:14px;}
  .footer-brand p{font-size:0.85rem;color:var(--muted);line-height:1.7;}
  .footer-col h4{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:0.88rem;color:#fff;margin-bottom:14px;letter-spacing:.04em;}
  .footer-col ul{list-style:none;display:flex;flex-direction:column;gap:9px;}
  .footer-col ul a{color:var(--muted);text-decoration:none;font-size:0.85rem;transition:color .2s;cursor:pointer;background:none;border:none;padding:0;text-align:left;}
  .footer-col ul a:hover{color:var(--green);}
  .footer-bottom{border-top:1px solid var(--border);padding-top:20px;text-align:center;font-size:0.8rem;color:var(--muted);}

  /* ── TOAST ── */
  .toast{position:fixed;bottom:24px;right:24px;z-index:99999;background:var(--card2);border:1px solid rgba(30,53,34,1);border-radius:12px;padding:12px 18px;display:flex;align-items:center;gap:9px;font-size:0.88rem;min-width:220px;transition:all .35s;transform:translateY(20px);opacity:0;pointer-events:none;box-shadow:0 10px 30px rgba(0,0,0,0.5);}
  .toast.show{transform:translateY(0);opacity:1;pointer-events:all;}
  .toast.success{border-color:var(--green);}
  .toast.error{border-color:#e05050;}

  /* ── ADMIN STYLES (preserved) ── */
  .admin-layout{display:flex;min-height:100vh;}
  .admin-sidebar{width:240px;background:var(--dark2);border-right:1px solid rgba(30,53,34,1);display:flex;flex-direction:column;position:fixed;top:0;bottom:0;left:0;z-index:50;}
  .admin-sidebar-logo{padding:22px 20px;border-bottom:1px solid rgba(30,53,34,1);display:flex;align-items:center;gap:10px;}
  .admin-sidebar-logo img{height:34px;}
  .admin-sidebar-logo span{font-family:'Barlow Condensed',sans-serif;font-size:0.9rem;font-weight:800;color:#fff;line-height:1.2;}
  .admin-nav{flex:1;padding:20px 12px;display:flex;flex-direction:column;gap:4px;}
  .admin-nav-label{font-size:0.66rem;font-weight:800;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;padding:0 10px;margin-bottom:8px;margin-top:8px;display:block;}
  .admin-link{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;background:none;border:none;font-family:'DM Sans',sans-serif;font-size:0.86rem;font-weight:500;color:var(--muted);transition:all .2s;text-align:left;width:100%;}
  .admin-link:hover{background:var(--card);color:var(--text);}
  .admin-link.active{background:var(--glow);color:var(--green);font-weight:700;}
  .admin-link-icon{font-size:1rem;width:20px;text-align:center;}
  .admin-link-badge{margin-left:auto;background:var(--card2);border-radius:20px;padding:1px 8px;font-size:0.68rem;font-weight:700;}
  .admin-sidebar-footer{padding:14px 12px;border-top:1px solid rgba(30,53,34,1);}
  .admin-user{display:flex;align-items:center;gap:10px;}
  .admin-avatar{width:32px;height:32px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:800;color:#0a0f0d;font-size:0.9rem;flex-shrink:0;}
  .admin-user-name{font-size:0.82rem;font-weight:600;color:#fff;}
  .admin-user-role{font-size:0.72rem;color:var(--muted);}
  .logout-btn{margin-left:auto;background:none;border:none;color:var(--muted);cursor:pointer;font-size:1rem;transition:color .2s;}
  .logout-btn:hover{color:#e05050;}
  .admin-main{margin-left:240px;flex:1;background:var(--dark);}
  .admin-topbar{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;border-bottom:1px solid rgba(30,53,34,1);background:var(--dark2);position:sticky;top:0;z-index:10;}
  .admin-topbar-title{font-family:'Barlow Condensed',sans-serif;font-size:1.25rem;font-weight:800;color:#fff;}
  .admin-topbar-title span{color:var(--green);}
  .live-badge{display:flex;align-items:center;gap:6px;font-size:0.75rem;font-weight:700;color:var(--green);background:rgba(46,204,113,0.1);border:1px solid rgba(46,204,113,0.3);border-radius:20px;padding:4px 10px;}
  .live-dot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:pulse 1.5s infinite;}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}
  .dash-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:28px;}
  .dash-stat{background:var(--card);border:1px solid rgba(30,53,34,1);border-radius:var(--radius);padding:20px 18px;transition:all .2s;}
  .dash-stat:hover{border-color:var(--green);transform:translateY(-2px);}
  .dash-stat-icon{font-size:1.5rem;margin-bottom:8px;}
  .dash-stat-num{font-family:'Barlow Condensed',sans-serif;font-size:2rem;font-weight:800;color:#fff;}
  .dash-stat-num.red{color:#e05050;}
  .dash-stat-num.amber{color:#f0a030;}
  .dash-stat-num.blue{color:#3a9ad9;}
  .dash-stat-label{font-size:0.8rem;color:var(--muted);margin-top:5px;}
  .admin-section-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
  .admin-section-hdr h3{font-family:'Barlow Condensed',sans-serif;font-size:1.4rem;font-weight:800;color:#fff;}
  .admin-section-hdr h3 span{color:var(--green);}
  .admin-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:40px;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.83rem;cursor:pointer;border:none;transition:all .2s;}
  .admin-btn.green{background:var(--green);color:#0a0f0d;}
  .admin-btn.green:hover{background:var(--green-dark);}
  .admin-btn.outline{background:transparent;border:1.5px solid var(--green);color:var(--green);}
  .admin-btn.outline:hover{background:var(--glow);}
  .admin-btn.red{background:rgba(224,80,80,0.15);border:1px solid #e05050;color:#e05050;}
  .admin-btn.red:hover{background:rgba(224,80,80,0.28);}
  .admin-btn.blue{background:rgba(58,154,217,0.15);border:1px solid #3a9ad9;color:#3a9ad9;}
  .admin-btn.amber{background:rgba(240,160,48,0.15);border:1px solid #f0a030;color:#f0a030;}
  .admin-btn.sm{padding:6px 13px;font-size:0.77rem;}
  .apps-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;}
  .app-card{background:var(--card);border:1px solid rgba(30,53,34,1);border-radius:13px;overflow:hidden;transition:all .2s;}
  .app-card:hover{border-color:var(--green);transform:translateY(-3px);}
  .app-card-visual{height:150px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;background:var(--dark2);}
  .app-card-visual img{width:100%;height:100%;object-fit:cover;}
  .emoji-ph{font-size:4.5rem;opacity:0.22;}
  .card-status-badge{position:absolute;top:10px;right:10px;border-radius:20px;padding:3px 9px;font-size:0.7rem;font-weight:700;letter-spacing:.05em;}
  .badge-active{background:rgba(46,204,113,0.15);border:1px solid var(--green);color:var(--green);}
  .badge-inactive{background:rgba(224,80,80,0.15);border:1px solid #e05050;color:#e05050;}
  .app-card-body{padding:18px;}
  .app-card-emoji{font-size:1.3rem;margin-bottom:7px;}
  .app-card-title{font-family:'Barlow Condensed',sans-serif;font-size:1.15rem;font-weight:800;color:#fff;margin-bottom:5px;}
  .app-card-desc{font-size:0.81rem;color:var(--muted);line-height:1.5;margin-bottom:14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
  .app-card-actions{display:flex;gap:7px;flex-wrap:wrap;}
  .admin-modal-overlay{position:fixed;inset:0;z-index:200;background:rgba(5,10,7,0.88);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;}
  .admin-modal{background:var(--card);border:1px solid rgba(30,53,34,1);border-radius:18px;width:100%;max-width:640px;max-height:90vh;overflow-y:auto;}
  .admin-modal-header{padding:22px 26px 18px;border-bottom:1px solid rgba(30,53,34,1);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--card);z-index:2;}
  .admin-modal-header h3{font-family:'Barlow Condensed',sans-serif;font-size:1.35rem;font-weight:800;color:#fff;}
  .admin-modal-close{width:30px;height:30px;border-radius:50%;border:1px solid rgba(30,53,34,1);background:none;color:var(--muted);cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;transition:all .2s;}
  .admin-modal-close:hover{border-color:#e05050;color:#e05050;}
  .admin-modal-body{padding:26px;}
  .admin-modal-footer{padding:14px 26px;border-top:1px solid rgba(30,53,34,1);display:flex;gap:9px;justify-content:flex-end;position:sticky;bottom:0;background:var(--card);}
  .admin-form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;}
  .admin-form-row.single{grid-template-columns:1fr;}
  .admin-form-group{margin-bottom:0;}
  .admin-form-group label{display:block;font-size:0.73rem;font-weight:700;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
  .admin-form-control{width:100%;padding:10px 13px;background:var(--dark2);border:1px solid rgba(30,53,34,1);border-radius:9px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:0.88rem;outline:none;transition:border-color .2s;resize:vertical;}
  .admin-form-control:focus{border-color:var(--green);}
  .admin-form-control::placeholder{color:var(--muted);opacity:0.55;}
  select.admin-form-control option{background:var(--card2);}
  h1{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:clamp(2rem,5vw,3rem);line-height:1.05;color:#fff;margin-bottom:14px;}
  h1 span{color:var(--green);}
  h2{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:clamp(1.6rem,3vw,2.4rem);color:#fff;line-height:1.1;}
  h2 span{color:var(--green);}

  /* ── MOBILE ── */
  .mobile-menu-overlay{position:fixed;inset:0;z-index:200;background:rgba(10,15,13,0.97);backdrop-filter:blur(16px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;}
  .mobile-menu-overlay a{color:var(--text);text-decoration:none;font-family:'Barlow Condensed',sans-serif;font-size:1.45rem;font-weight:700;cursor:pointer;background:none;border:none;}
  .mobile-menu-overlay a:hover{color:var(--green);}
  .mobile-close{position:absolute;top:22px;right:26px;font-size:1.9rem;color:var(--green);cursor:pointer;background:none;border:none;}

  @media(max-width:900px){
    .nav{padding:12px 16px;}
    .nav-search-wrap{display:none;}
    .hamburger{display:flex;}
    .shop-layout{flex-direction:column;padding:20px 16px 60px;}
    .shop-sidebar{display:none;}
    .products-grid{grid-template-columns:1fr 1fr;gap:10px;}
    .footer-grid{grid-template-columns:1fr;gap:24px;}
    footer{padding:44px 16px 24px;}
    .admin-sidebar{display:none;}
    .admin-main{margin-left:0;}
    .dash-stats{grid-template-columns:1fr 1fr;}
    .apps-grid{grid-template-columns:1fr;}
    .admin-form-row{grid-template-columns:1fr;}
    .product-modal-inner{grid-template-columns:1fr;}
    .product-modal-img{border-radius:20px 20px 0 0;}
  }
  @media(max-width:480px){
    .products-grid{grid-template-columns:1fr;}
    .dash-stats{grid-template-columns:1fr;}
  }
`;

const STATIC_PRODUCTS = [
  { id:1, name:"Beta 610 TC Drone", price:650000, originalPrice:800000, image:"https://framerusercontent.com/images/JHfqfEGEY832dH8wU2FIj8e42o.png", isNew:true, isOffer:true, status:"instock", category:"Drones", waNum:"919390238537" },
  { id:2, name:"SAG Flash Q20 TC Drone", price:850000, originalPrice:1000000, image:"https://framerusercontent.com/images/eRu3lhJevMrkK1YctwXEMpgZICM.png", isNew:false, isOffer:true, status:"instock", category:"Drones", waNum:"919390238537" },
  { id:3, name:"14S 22000mAh SAG VOLT Plus Battery", price:40000, originalPrice:55000, image:"https://framerusercontent.com/images/oDDN2aWnPwDBOacMrdJxrPj3K8.png", isNew:false, isOffer:true, status:"instock", category:"Batteries", waNum:"919390238537" },
  { id:4, name:"14S 30000mAh SAG VOLT Plus Battery", price:50000, originalPrice:65000, image:"https://framerusercontent.com/images/EIRN6BISlMewm9CBHoIWVhtzYak.png", isNew:true, isOffer:true, status:"instock", category:"Batteries", waNum:"919390238537" },
  { id:5, name:"K3A Pro FC Kit", price:33000, originalPrice:35000, image:"https://framerusercontent.com/images/dRPDPsr5jgfAEPLI0RIrENpcIoo.webp", isNew:false, isOffer:true, status:"instock", category:"Flight Controller", waNum:"919390238537" },
  { id:6, name:"VK V9 AG FC Kit", price:42000, originalPrice:45000, image:"https://framerusercontent.com/images/0Jj398ugeqPzDZmnM5qbUhQZs.png", isNew:true, isOffer:false, status:"instock", category:"Flight Controller", waNum:"919390238537" },
  { id:7, name:"Hobbywing 8L/min Pump", price:6800, originalPrice:7500, image:"https://framerusercontent.com/images/7Sk32BzwB1Yj3AHjFfUIzNMK0.jpg", isNew:false, isOffer:false, status:"instock", category:"Accessories", waNum:"919390238537" },
  { id:8, name:"SKYRC 3000 Watt Charger", price:45000, originalPrice:50000, image:"https://framerusercontent.com/images/ccOSG205SKwpOBmfBTiG6vyFe4.jpeg", isNew:true, isOffer:true, status:"instock", category:"Batteries", waNum:"919390238537" },
  { id:9, name:"JiYi K++ Full FC Kit", price:32000, originalPrice:35000, image:"https://framerusercontent.com/images/VDfEexOOoRK6EOM1ybMGwFQgm4.jpg", isNew:false, isOffer:true, status:"instock", category:"Flight Controller", waNum:"919390238537" },
  { id:10, name:"Skydroid T12 Full RC Kit", price:19000, originalPrice:21000, image:"https://framerusercontent.com/images/tKmkl1E8aOyMTjsSN1a4jFh4fGY.jpeg", isNew:true, isOffer:false, status:"instock", category:"Accessories", waNum:"919390238537" },
  { id:11, name:"Hobbywing CW X8 Motor Combo", price:13000, originalPrice:15000, image:"https://framerusercontent.com/images/aYSQ4cQ8alqgSNu26gG4YI9gAVY.jpg", isNew:false, isOffer:true, status:"instock", category:"Accessories", waNum:"919390238537" },
  { id:12, name:"SiYi MK15 Transmitter Kit", price:35000, originalPrice:45000, image:"https://framerusercontent.com/images/qaHt0hSCGuIztk0xhYkDydSmzM.png", isNew:true, isOffer:true, status:"instock", category:"Accessories", waNum:"919390238537" },
];

const DEFAULT_APPS = [
  { id:1,emoji:"🌸",tabLabel:"🌸 Flower Dropping",title:"Flower Dropping",titleHighlight:"Drone",desc:"Transform weddings, temple festivals, political rallies, and grand events.",badge:"Event Ready",accentColor:"#2ecc71",ctaText:"Enquire for Events →",ctaLink:"tel:+918977776019",features:["Payload up to 5kg of petals per flight","Custom trigger mechanism","Works for weddings, temples, political events"],imageUrl:"",status:"active",order:0 },
  { id:2,emoji:"💡",tabLabel:"💡 LED Display",title:"LED Display",titleHighlight:"Advertising Drone",desc:"Turn the night sky into a moving billboard.",badge:"Sky Billboard",accentColor:"#4488ff",ctaText:"Get a Demo →",ctaLink:"tel:+918977776019",features:["Programmable full-color LED matrix","Visible up to 500m distance","Ideal for product launches and concerts"],imageUrl:"",status:"active",order:1 },
  { id:3,emoji:"🎥",tabLabel:"🎥 Aerial Filming",title:"Aerial",titleHighlight:"Filming & Photography",desc:"Stunning aerial footage for films, real-estate, weddings, construction progress.",badge:"4K Cinema",accentColor:"#8060dd",ctaText:"Book a Shoot →",ctaLink:"tel:+918977776019",features:["4K/6K stabilized footage","3-axis gimbal","Licensed and insured pilots"],imageUrl:"",status:"active",order:2 },
];

function formatINR(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}
function waLink(num, msg) {
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}
function discount(price, original) {
  if (!original || original <= price) return null;
  return Math.round((1 - price / original) * 100);
}

// ─── TOAST ────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState({ show: false, type: "success", msg: "" });
  const show = (type, msg) => {
    setToast({ show: true, type, msg });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };
  const el = <div className={`toast${toast.show ? " show" : ""} ${toast.type}`}>{toast.msg}</div>;
  return [el, show];
}

// ─── AUTH MODAL — Email + Password ───────────────────────────
function AuthModal({ onClose, onLogin }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");   // neutral blue/green info messages
  const [loading, setLoading] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState(""); // track who needs resend

  const switchTab = (t) => { setTab(t); setError(""); setInfo(""); setUnconfirmedEmail(""); };

  const doLogin = async () => {
    setError(""); setInfo(""); setLoading(true);
    if (!email.trim() || !password) { setError("Please fill in all fields."); setLoading(false); return; }
    try {
      const data = await sbSignIn(email.trim().toLowerCase(), password);
      const displayName = data.user?.user_metadata?.full_name || email.split("@")[0];
      const session = { id: data.user.id, name: displayName, email: data.user.email, accessToken: data.access_token };
      saveSession(session);
      onLogin(session);
      onClose();
    } catch (e) {
      if (e.message.includes("confirm your email")) {
        setUnconfirmedEmail(email.trim().toLowerCase());
      }
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const doRegister = async () => {
    setError(""); setInfo(""); setLoading(true);
    if (!name.trim() || !email.trim() || !password) { setError("All fields are required."); setLoading(false); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }
    try {
      await sbSignUp(email.trim().toLowerCase(), password, name.trim());
      setInfo(`✅ We've sent a confirmation link to ${email.trim()}. Please open it to activate your account, then sign in here.`);
      setTab("login");
      setPassword(""); setName("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const doResend = async () => {
    setError(""); setInfo(""); setLoading(true);
    try {
      await sbResendConfirmation(unconfirmedEmail);
      setInfo(`📧 Confirmation email resent to ${unconfirmedEmail}. Please check your inbox (and spam folder).`);
      setUnconfirmedEmail("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="auth-box">
        <button className="auth-close" onClick={onClose}>✕</button>
        <img src={LOGO} alt="SAG" className="auth-logo" />
        <h2>{tab === "login" ? "Welcome Back" : "Create Account"}</h2>
        <p className="auth-sub">
          {tab === "login"
            ? "Sign in to your SAG Drones account"
            : "Join the SAG Drone Technologies community"}
        </p>

        <div className="auth-tabs">
          <button className={`auth-tab${tab === "login" ? " active" : ""}`} onClick={() => switchTab("login")}>Sign In</button>
          <button className={`auth-tab${tab === "register" ? " active" : ""}`} onClick={() => switchTab("register")}>Register</button>
        </div>

        {tab === "register" && (
          <div className="auth-field">
            <label>Full Name</label>
            <input
              placeholder="Ravi Kumar"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && doRegister()}
            />
          </div>
        )}

        <div className="auth-field">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (tab === "login" ? doLogin() : doRegister())}
          />
        </div>

        <div className="auth-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (tab === "login" ? doLogin() : doRegister())}
          />
        </div>

        <button
          className="auth-btn"
          onClick={tab === "login" ? doLogin : doRegister}
          disabled={loading}
        >
          {loading
            ? (tab === "login" ? "Signing in..." : "Creating account...")
            : (tab === "login" ? "Sign In →" : "Create Account →")}
        </button>

        {/* Error with optional resend button */}
        {error && (
          <div className="auth-error" style={{ marginTop: 12 }}>
            ⚠ {error}
            {unconfirmedEmail && (
              <button
                onClick={doResend}
                disabled={loading}
                style={{
                  display: "block", marginTop: 8, background: "none", border: "1px solid rgba(224,80,80,0.5)",
                  color: "#e05050", borderRadius: 6, padding: "5px 12px", fontSize: "0.78rem",
                  cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, width: "100%"
                }}
              >
                📧 Resend confirmation email
              </button>
            )}
          </div>
        )}

        {/* Success / info message */}
        {info && (
          <div className="auth-success" style={{ marginTop: 12, textAlign: "left", lineHeight: 1.6 }}>
            {info}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CART DRAWER ──────────────────────────────────────────────
function CartDrawer({ open, onClose, cart, setCart, user, showAuth }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const updateQty = (id, delta) => {
    setCart(c => c.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };
  const remove = (id) => setCart(c => c.filter(i => i.id !== id));

  const checkout = () => {
    if (!user) { onClose(); showAuth(); return; }
    const lines = cart.map(i => `• ${i.name} x${i.qty} — ${formatINR(i.price * i.qty)}`).join("\n");
    const msg = `🛒 *Cart Enquiry — SAG Drone Technologies*\n\n👤 *Customer:* ${user.name}\n✉️ *Email:* ${user.email || ''}\n\n*Items:*\n${lines}\n\n💰 *Total: ${formatINR(total)}*\n\nPlease confirm availability. Thank you!`;
    window.open(`https://wa.me/919390238537?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <>
      {open && <div className="cart-overlay" onClick={onClose} />}
      <div className={`cart-drawer${open ? " open" : ""}`}>
        <div className="cart-hdr">
          <h3>🛒 Your Cart {cart.length > 0 && <span style={{ color: "var(--green)" }}>({cart.length})</span>}</h3>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <div>Your cart is empty</div>
              <div style={{ fontSize: "0.8rem" }}>Add products to get started</div>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  {item.image && <img src={item.image} alt={item.name} />}
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">{formatINR(item.price * item.qty)}</div>
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                </div>
                <button className="cart-item-remove" onClick={() => remove(item.id)}>✕</button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-val">{formatINR(total)}</span>
            </div>
            <button className="cart-checkout-btn" onClick={checkout}>
              💬 Enquire via WhatsApp
            </button>
            <div className="cart-wa-note">
              {user ? `Signed in as ${user.name}` : "Sign in to checkout"}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── PRODUCT DETAIL MODAL ─────────────────────────────────────
function ProductDetailModal({ product, onClose, onAddCart, user, showAuth }) {
  const off = discount(product.price, product.originalPrice);

  const handleAddCart = () => {
    if (!user) { onClose(); showAuth(); return; }
    onAddCart(product);
    onClose();
  };

  const msg = `Hello SAG Drone Technologies! 👋\n\nI'm interested in: ${product.name}\nPrice: ${formatINR(product.price)}\n\nPlease share more details. Thank you!`;

  return (
    <div className="product-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="product-modal">
        <button className="product-modal-close" onClick={onClose}>✕</button>
        <div className="product-modal-inner">
          <div className="product-modal-img">
            {product.image
              ? <img src={product.image} alt={product.name} />
              : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem", opacity: 0.2 }}>📦</div>
            }
          </div>
          <div className="product-modal-body">
            <div className="pm-cat">{product.category || "Product"}</div>
            <div className="pm-title">{product.name}</div>
            <div className="pm-price-row">
              <span className="pm-price">{formatINR(product.price)}</span>
              {product.originalPrice && <span className="pm-old">{formatINR(product.originalPrice)}</span>}
              {off && <span className="pm-off">{off}% off</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "var(--green)", fontWeight: 600, marginBottom: 16 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
              In Stock — Ready to ship
            </div>
            <div className="pm-divider" />
            <div className="pm-label">Product Details</div>
            <div style={{ fontSize: "0.84rem", color: "var(--muted)", lineHeight: 1.7 }}>
              DGCA-certified quality drone component. All products come with manufacturer warranty and SAG Drone Technologies' trusted after-sale support.
            </div>
            <div className="pm-actions">
              <button className="pm-add-btn" onClick={handleAddCart}>
                🛒 {user ? "Add to Cart" : "Sign in to Add to Cart"}
              </button>
              <a className="pm-wa-btn" href={waLink(product.waNum || "919390238537", msg)} target="_blank" rel="noreferrer">
                💬 Enquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────
function Nav({ user, cart, onCartOpen, onAuthOpen, onLogout, search, setSearch, mobileOpen, setMobileOpen }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <nav className="nav">
        <div className="nav-logo">
          <img src={LOGO} alt="SAG Drones" />
          <span className="nav-logo-text">SAG DRONES</span>
        </div>

        <div className="nav-search-wrap">
          <span className="nav-search-icon">🔍</span>
          <input
            className="nav-search"
            placeholder="Search drones, batteries, accessories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="nav-right">
          <button className="nav-icon-btn" onClick={onCartOpen} title="Cart">
            🛒
            {cart.length > 0 && <span className="nav-cart-count">{cart.reduce((s, i) => s + i.qty, 0)}</span>}
          </button>

          {user ? (
            <div className="user-menu-wrap" ref={ref}>
              <button className="nav-user-btn" onClick={() => setUserMenuOpen(o => !o)}>
                <div className="nav-user-avatar">{user.name[0].toUpperCase()}</div>
                {user.name.split(" ")[0]}
                <span style={{ fontSize: "0.7rem" }}>▾</span>
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-hdr">
                    <div className="user-dropdown-name">{user.name}</div>
                    <div className="user-dropdown-email">{user.email || ""}</div>
                  </div>
                  <button className="user-dropdown-item" onClick={() => { setUserMenuOpen(false); onCartOpen(); }}>🛒 My Cart ({cart.reduce((s, i) => s + i.qty, 0)} items)</button>
                  <button className="user-dropdown-item danger" onClick={() => { setUserMenuOpen(false); onLogout(); }}>⏏ Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn-login-nav" onClick={onAuthOpen}>Sign In</button>
          )}

          <button className="hamburger" onClick={() => setMobileOpen(o => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="mobile-menu-overlay">
          <button className="mobile-close" onClick={() => setMobileOpen(false)}>✕</button>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
            <div style={{ width: "100%", maxWidth: 320, padding: "0 20px", position: "relative" }}>
              <span style={{ position: "absolute", left: 32, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>🔍</span>
              <input className="nav-search" style={{ width: "100%", paddingLeft: 38 }} placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button onClick={() => { onCartOpen(); setMobileOpen(false); }} style={{ background: "none", border: "none", color: "var(--text)", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "1.45rem", fontWeight: 700, cursor: "pointer" }}>🛒 Cart ({cart.reduce((s, i) => s + i.qty, 0)})</button>
            {user
              ? <button onClick={() => { onLogout(); setMobileOpen(false); }} style={{ background: "none", border: "none", color: "#e05050", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "1.45rem", fontWeight: 700, cursor: "pointer" }}>Sign Out</button>
              : <button onClick={() => { onAuthOpen(); setMobileOpen(false); }} style={{ background: "var(--green)", color: "#0a0f0d", border: "none", padding: "12px 32px", borderRadius: 40, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}>Sign In</button>
            }
          </div>
        </div>
      )}
    </>
  );
}

// ─── PRODUCTS PAGE ────────────────────────────────────────────
function ProductsPage({ user, cart, setCart, showAuth, showToast }) {
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [activeCat, setActiveCat] = useState("all");
  const [activeTag, setActiveTag] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [modalProduct, setModalProduct] = useState(null);
  const [navSearch, setNavSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [localUser, setLocalUser] = useState(user);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setLocalUser(user); }, [user]);

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/products?order=created_at.asc&select=*`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(rows => {
        if (rows && rows.length) setProducts(rows.map(r => ({
          id: r.id, name: r.name, price: r.price, originalPrice: r.original_price,
          image: r.image, isNew: r.is_new, isOffer: r.is_offer, status: r.status,
          category: r.category, waNum: r.wa_num || "919390238537"
        })));
      })
      .catch(() => {});
  }, []);

  const cats = ["all", ...Array.from(new Set(products.map(p => p.category || "Accessories").filter(Boolean)))];
  const combinedSearch = navSearch || search;

  let filtered = products.filter(p => {
    const cat = p.category || "Accessories";
    const mc = activeCat === "all" || cat === activeCat;
    const mt = activeTag === "all" || (activeTag === "new" && p.isNew) || (activeTag === "offer" && p.isOffer);
    const ms = !combinedSearch || p.name.toLowerCase().includes(combinedSearch.toLowerCase()) || (p.category || "").toLowerCase().includes(combinedSearch.toLowerCase());
    return mc && mt && ms;
  });

  if (sort === "price_asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === "newest") filtered = [...filtered].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  else if (sort === "offer") filtered = [...filtered].sort((a, b) => (b.isOffer ? 1 : 0) - (a.isOffer ? 1 : 0));

  const addToCart = (product) => {
    setCart(c => {
      const existing = c.find(i => i.id === product.id);
      if (existing) return c.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { ...product, qty: 1 }];
    });
    showToast("success", `✅ "${product.name}" added to cart!`);
  };

  return (
    <div>
      <Nav
        user={localUser}
        cart={cart}
        onCartOpen={() => setCartOpen(true)}
        onAuthOpen={() => setAuthOpen(true)}
        onLogout={async () => { if (localUser?.accessToken) await sbSignOut(localUser.accessToken); clearSession(); setLocalUser(null); showToast("success", "👋 Signed out successfully."); }}
        search={navSearch}
        setSearch={setNavSearch}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-grid" />
        <div className="page-hero-inner">
          <div className="section-tag">SAG Drone Technologies</div>
          <h1>India's Best <span>Agricultural</span><br />Drone Store</h1>
          <p style={{ fontSize: "1rem", color: "var(--muted)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 24px" }}>
            DGCA-certified drones, premium batteries, flight controllers & accessories. Trusted by 500+ farmers across Andhra Pradesh.
          </p>
          {!localUser && (
            <button onClick={() => setAuthOpen(true)} style={{ background: "var(--green)", color: "#0a0f0d", border: "none", padding: "12px 28px", borderRadius: 40, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.93rem", cursor: "pointer", transition: "all .2s" }}>
              Sign In to Shop →
            </button>
          )}
        </div>
      </div>

      {/* Shop Layout */}
      <div className="shop-layout">
        {/* Sidebar */}
        <aside className="shop-sidebar">
          <span className="sidebar-label">Categories</span>
          <ul className="sidebar-cats">
            {cats.map((c, i) => (
              <li key={i} className={activeCat === c ? "active" : ""} onClick={() => setActiveCat(c)}>
                {c === "all" ? "All Products" : c}
                <span className="cat-count">{c === "all" ? products.length : products.filter(p => (p.category || "Accessories") === c).length}</span>
              </li>
            ))}
          </ul>
          <div className="sidebar-divider" />
          <span className="sidebar-label">Filter</span>
          {[["all","All Items","var(--green)"],["new","New Arrivals","var(--green)"],["offer","Offers","#f0a030"]].map(([tag, label, color]) => (
            <button key={tag} className={`sidebar-tag-btn${activeTag === tag ? " active" : ""}`} onClick={() => setActiveTag(tag)}>
              <span className="tag-dot" style={{ background: color }} />
              {label}
            </button>
          ))}
        </aside>

        {/* Main */}
        <div className="shop-main">
          <div className="products-toolbar">
            <div className="products-count">
              Showing <strong>{filtered.length}</strong> of {products.length} products
              {combinedSearch && <span> for "<strong>{combinedSearch}</strong>"</span>}
            </div>
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="default">Sort: Default</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="newest">Newest First</option>
              <option value="offer">Offers First</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: 12, opacity: 0.4 }}>🔍</div>
              No products match your filters.
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map(p => {
                const off = discount(p.price, p.originalPrice);
                return (
                  <div key={p.id} className="product-card" onClick={() => setModalProduct(p)}>
                    {p.isNew && <span className="product-badge">New</span>}
                    {!p.isNew && p.isOffer && <span className="product-badge" style={{ background: "#f0a030" }}>Offer</span>}
                    <div className="product-img">
                      {p.image && <img src={p.image} alt={p.name} loading="lazy" />}
                    </div>
                    <div className="product-info">
                      <div className="product-cat">{p.category || "Product"}</div>
                      <div className="product-name">{p.name}</div>
                      <div className="product-price">
                        <span className="price-new">{formatINR(p.price)}</span>
                        {p.originalPrice && <span className="price-old">{formatINR(p.originalPrice)}</span>}
                        {off && <span className="price-off">{off}% off</span>}
                      </div>
                      <div className="product-status-dot">In Stock</div>
                    </div>
                    <div className="product-actions" onClick={e => e.stopPropagation()}>
                      <button
                        className="add-cart-btn"
                        onClick={() => {
                          if (!localUser) { setAuthOpen(true); return; }
                          addToCart(p);
                        }}
                      >
                        🛒 Add to Cart
                      </button>
                      <a
                        className="enquire-btn"
                        href={waLink(p.waNum || "919390238537", `Hello SAG Drone Technologies! 👋\n\nI'm interested in: ${p.name}\nPrice: ${formatINR(p.price)}\n\nPlease share more details.`)}
                        target="_blank" rel="noreferrer"
                        title="Enquire on WhatsApp"
                      >
                        💬
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-grid">
          <div>
            <img src={LOGO} alt="SAG" style={{ height: 36, marginBottom: 14 }} />
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: 14 }}>
              India's trusted agricultural drone company. DGCA-certified drones, components & training.
            </p>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 2 }}>
              📍 Nidadavole, Andhra Pradesh – 534 302<br />
              📞 +91 897777 6019<br />
              ✉️ sagtechinfo@gmail.com
            </div>
          </div>
          <div className="footer-col">
            <h4>Products</h4>
            <ul>
              <li><a onClick={() => setActiveCat("Drones")}>Drones</a></li>
              <li><a onClick={() => setActiveCat("Batteries")}>Batteries</a></li>
              <li><a onClick={() => setActiveCat("Flight Controller")}>Flight Controllers</a></li>
              <li><a onClick={() => setActiveCat("Accessories")}>Accessories</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="mailto:sagtechinfo@gmail.com">Contact Us</a></li>
              <li><a href="tel:+918977776019">Call Now</a></li>
              <li><a href={`https://wa.me/919390238537`} target="_blank" rel="noreferrer">WhatsApp</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="https://framerusercontent.com" target="_blank" rel="noreferrer">About SAG</a></li>
              <li><a href="#">DGCA Certification</a></li>
              <li><a href="#">RPTO Training</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} SAG Drone Technologies. All rights reserved.
        </div>
      </footer>

      {/* Modals */}
      {modalProduct && (
        <ProductDetailModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onAddCart={addToCart}
          user={localUser}
          showAuth={() => setAuthOpen(true)}
        />
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        setCart={setCart}
        user={localUser}
        showAuth={() => setAuthOpen(true)}
      />

      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onLogin={(u) => { setLocalUser(u); showToast("success", `👋 Welcome back, ${u.name}!`); }}
        />
      )}
    </div>
  );
}

// ─── ADMIN MODALS (preserved) ─────────────────────────────────
function AppModal({ app, onSave, onClose }) {
  const [form, setForm] = useState(app || { emoji: "", tabLabel: "", title: "", titleHighlight: "", desc: "", ctaText: "Enquire →", ctaLink: "tel:+918977776019", badge: "", status: "active", accentColor: "#2ecc71", imageUrl: "", features: [] });
  const [feat, setFeat] = useState((app?.features || []).join("\n"));
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const save = () => {
    if (!form.emoji || !form.title || !form.desc) return;
    onSave({ ...form, features: feat.split("\n").map(f => f.trim()).filter(Boolean) });
  };
  return (
    <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h3>{app ? "✏️ Edit Application" : "+ Add Application"}</h3>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="admin-modal-body">
          <div className="admin-form-row">
            <div className="admin-form-group"><label>Emoji Icon *</label><input className="admin-form-control" placeholder="e.g. 🌸" value={form.emoji} onChange={e => set("emoji", e.target.value)} /></div>
            <div className="admin-form-group"><label>Tab Label</label><input className="admin-form-control" placeholder="e.g. 🌸 Flower Dropping" value={form.tabLabel} onChange={e => set("tabLabel", e.target.value)} /></div>
          </div>
          <div className="admin-form-row single"><div className="admin-form-group"><label>Title *</label><input className="admin-form-control" value={form.title} onChange={e => set("title", e.target.value)} /></div></div>
          <div className="admin-form-row single"><div className="admin-form-group"><label>Description *</label><textarea className="admin-form-control" rows={3} value={form.desc} onChange={e => set("desc", e.target.value)} /></div></div>
          <div className="admin-form-row">
            <div className="admin-form-group"><label>Status</label><select className="admin-form-control" value={form.status} onChange={e => set("status", e.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
            <div className="admin-form-group"><label>Badge</label><input className="admin-form-control" value={form.badge} onChange={e => set("badge", e.target.value)} /></div>
          </div>
          <div className="admin-form-row single"><div className="admin-form-group"><label>Features (one per line)</label><textarea className="admin-form-control" rows={4} value={feat} onChange={e => setFeat(e.target.value)} /></div></div>
        </div>
        <div className="admin-modal-footer">
          <button className="admin-btn outline" onClick={onClose}>Cancel</button>
          <button className="admin-btn green" onClick={save}>💾 Save</button>
        </div>
      </div>
    </div>
  );
}

function ProductModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(product || { name: "", price: "", originalPrice: "", image: "", isNew: false, isOffer: false, status: "instock", category: "", waNum: "919390238537" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const save = () => {
    if (!form.name || !form.price) return;
    onSave({ ...form, price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : null });
  };
  return (
    <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h3>{product ? "✏️ Edit Product" : "+ Add Product"}</h3>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="admin-modal-body">
          <div className="admin-form-row single"><div className="admin-form-group"><label>Product Name *</label><input className="admin-form-control" value={form.name} onChange={e => set("name", e.target.value)} /></div></div>
          <div className="admin-form-row single"><div className="admin-form-group"><label>Category</label><input className="admin-form-control" value={form.category} onChange={e => set("category", e.target.value)} /></div></div>
          <div className="admin-form-row">
            <div className="admin-form-group"><label>Price (₹) *</label><input className="admin-form-control" type="number" value={form.price} onChange={e => set("price", e.target.value)} /></div>
            <div className="admin-form-group"><label>Original Price (₹)</label><input className="admin-form-control" type="number" value={form.originalPrice || ""} onChange={e => set("originalPrice", e.target.value)} /></div>
          </div>
          <div className="admin-form-row single"><div className="admin-form-group"><label>Image URL</label><input className="admin-form-control" value={form.image || ""} onChange={e => set("image", e.target.value)} /></div></div>
          <div className="admin-form-row single"><div className="admin-form-group"><label>WhatsApp Number</label><input className="admin-form-control" value={form.waNum} onChange={e => set("waNum", e.target.value)} /></div></div>
        </div>
        <div className="admin-modal-footer">
          <button className="admin-btn outline" onClick={onClose}>Cancel</button>
          <button className="admin-btn green" onClick={save}>💾 Save Product</button>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PAGE ───────────────────────────────────────────────
function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState(""), [pass, setPass] = useState(""), [loginErr, setLoginErr] = useState(false);
  const [adminPage, setAdminPage] = useState("dashboard");
  const [apps, setApps] = useState(DEFAULT_APPS);
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [toast, setToast] = useState({ show: false, type: "success", msg: "" });
  const [showModal, setShowModal] = useState(false);
  const [editApp, setEditApp] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const ADMIN_USER = "sagadmin", ADMIN_PASS = "SAG@2026";

  useEffect(() => {
    if (sessionStorage.getItem("sag_admin") === "1") setAuthed(true);
    fetch(`${SUPABASE_URL}/rest/v1/products?order=created_at.asc&select=*`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } })
      .then(r => r.ok ? r.json() : null)
      .then(rows => { if (rows && rows.length) setProducts(rows.map(r => ({ id: r.id, name: r.name, price: r.price, originalPrice: r.original_price, image: r.image, isNew: r.is_new, isOffer: r.is_offer, status: r.status, category: r.category || "", waNum: r.wa_num || "919390238537" }))); })
      .catch(() => {});
  }, []);

  const showToast = (type, msg) => { setToast({ show: true, type, msg }); setTimeout(() => setToast(t => ({ ...t, show: false })), 3000); };

  const doLogin = () => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) { sessionStorage.setItem("sag_admin", "1"); setAuthed(true); }
    else { setLoginErr(true); setPass(""); }
  };

  const saveApp = (app) => {
    let newApps = app.id ? apps.map(a => a.id === app.id ? app : a) : [...apps, { ...app, id: Date.now(), order: apps.length }];
    setApps(newApps); localStorage.setItem("sag_drone_apps", JSON.stringify(newApps));
    showToast("success", "✅ Saved!"); setShowModal(false);
  };

  if (!authed) return (
    <div style={{ position: "fixed", inset: 0, background: "var(--dark)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ background: "var(--card)", border: "1px solid rgba(46,204,113,0.2)", borderRadius: 20, padding: "44px 40px", width: "100%", maxWidth: 400, textAlign: "center" }}>
        <img src={LOGO} alt="SAG" style={{ height: 48, marginBottom: 20 }} />
        <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginBottom: 5 }}>Admin Panel</h2>
        <p style={{ fontSize: "0.86rem", color: "var(--muted)", marginBottom: 28 }}>SAG Drone Technologies</p>
        {[["Username", user, setUser, "text", "admin"], ["Password", pass, setPass, "password", "••••••••"]].map(([label, val, setter, type, ph]) => (
          <div key={label} style={{ marginBottom: 14, textAlign: "left" }}>
            <label style={{ fontSize: "0.73rem", color: "var(--muted)", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>{label}</label>
            <input type={type} placeholder={ph} value={val} onChange={e => setter(e.target.value)} onKeyDown={e => e.key === "Enter" && doLogin()} style={{ width: "100%", padding: "11px 14px", background: "var(--dark2)", border: "1.5px solid rgba(46,204,113,0.2)", borderRadius: 10, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: "0.93rem", outline: "none" }} />
          </div>
        ))}
        <button onClick={doLogin} style={{ width: "100%", padding: 12, background: "var(--green)", color: "#0a0f0d", border: "none", borderRadius: 40, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "0.93rem", cursor: "pointer" }}>Sign In →</button>
        {loginErr && <div style={{ color: "#e05050", fontSize: "0.83rem", marginTop: 10, background: "rgba(224,80,80,0.12)", borderRadius: 8, padding: "7px 13px" }}>Incorrect credentials.</div>}
      </div>
    </div>
  );

  const navLinks = [
    { label: "Dashboard", icon: "📊", page: "dashboard" },
    { label: "Drone Applications", icon: "🚁", page: "applications", badge: apps.filter(a => a.status === "active").length },
    { label: "Manage Products", icon: "🛒", page: "products", badge: products.length },
  ];

  const pages = {
    dashboard: (
      <div>
        <div className="dash-stats">
          {[[apps.length, "Total Applications", ""], [apps.filter(a => a.status === "active").length, "Active Apps", ""], [products.length, "Total Products", " blue"]].map(([n, l, cls]) => (
            <div className="dash-stat" key={l}><div className="dash-stat-icon">{["🚁","👁","🛒"][["Total Applications","Active Apps","Total Products"].indexOf(l)]}</div><div className={`dash-stat-num${cls}`}>{n}</div><div className="dash-stat-label">{l}</div></div>
          ))}
        </div>
        <div className="admin-section-hdr"><h3>Recent <span>Products</span></h3><button className="admin-btn outline" onClick={() => setAdminPage("products")}>View All →</button></div>
        <div className="apps-grid">
          {products.slice(0, 6).map(p => (
            <div key={p.id} className="app-card">
              <div className="app-card-visual">{p.image ? <img src={p.image} alt={p.name} /> : <div className="emoji-ph">📦</div>}<span className={`card-status-badge ${p.status !== "outofstock" ? "badge-active" : "badge-inactive"}`}>{p.status !== "outofstock" ? "In Stock" : "Out of Stock"}</span></div>
              <div className="app-card-body"><div className="app-card-title">{p.name}</div><div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "1.15rem", color: "var(--green)" }}>{formatINR(p.price)}</div></div>
            </div>
          ))}
        </div>
      </div>
    ),
    applications: (
      <div>
        <div style={{ background: "var(--card2)", border: "1px solid rgba(30,53,34,1)", borderRadius: "var(--radius)", padding: "18px 22px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div><div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#fff" }}>🚁 Drone Applications</div><div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 2 }}>Manage drone service offerings shown to customers.</div></div>
          <button className="admin-btn green" onClick={() => { setEditApp(null); setShowModal(true); }}>+ Add Application</button>
        </div>
        <div className="apps-grid">
          {apps.map(app => (
            <div key={app.id} className="app-card">
              <div className="app-card-visual"><div className="emoji-ph">{app.emoji}</div><span className={`card-status-badge ${app.status === "active" ? "badge-active" : "badge-inactive"}`}>{app.status === "active" ? "● Active" : "● Hidden"}</span></div>
              <div className="app-card-body">
                <div className="app-card-emoji">{app.emoji}</div>
                <div className="app-card-title">{app.title}</div>
                <div className="app-card-desc">{app.desc}</div>
                <div className="app-card-actions">
                  <button className="admin-btn blue sm" onClick={() => { setEditApp(app); setShowModal(true); }}>✏️ Edit</button>
                  <button className="admin-btn red sm" onClick={() => { if (confirm(`Delete "${app.title}"?`)) { setApps(a => a.filter(x => x.id !== app.id)); showToast("success", "Deleted."); } }}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    products: (
      <div>
        <div style={{ background: "var(--card2)", border: "1px solid rgba(30,53,34,1)", borderRadius: "var(--radius)", padding: "18px 22px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div><div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#fff" }}>🛒 Products Manager</div><div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 2 }}>Add, edit, or remove store products.</div></div>
          <button className="admin-btn green" onClick={() => { setEditProduct(null); setShowProductModal(true); }}>+ Add Product</button>
        </div>
        <div className="apps-grid">
          {products.map(p => (
            <div key={p.id} className="app-card">
              <div className="app-card-visual">{p.image ? <img src={p.image} alt={p.name} /> : <div className="emoji-ph">📦</div>}<span className={`card-status-badge ${p.status !== "outofstock" ? "badge-active" : "badge-inactive"}`}>{p.status !== "outofstock" ? "In Stock" : "Out of Stock"}</span></div>
              <div className="app-card-body">
                <div className="app-card-title">{p.name}</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "var(--green)", marginBottom: 12 }}>{formatINR(p.price)}</div>
                <div className="app-card-actions">
                  <button className="admin-btn blue sm" onClick={() => { setEditProduct(p); setShowProductModal(true); }}>✏️ Edit</button>
                  <button className="admin-btn red sm" onClick={() => { if (confirm(`Delete "${p.name}"?`)) { setProducts(prev => prev.filter(x => x.id !== p.id)); showToast("success", "Deleted."); } }}>🗑️ Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo"><img src={LOGO} alt="SAG" /><span>SAG Admin</span></div>
        <nav className="admin-nav">
          <span className="admin-nav-label">Overview</span>
          {navLinks.map(l => (
            <button key={l.page} className={`admin-link${adminPage === l.page ? " active" : ""}`} onClick={() => setAdminPage(l.page)}>
              <span className="admin-link-icon">{l.icon}</span>{l.label}
              {l.badge !== undefined && <span className="admin-link-badge">{l.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <div className="admin-avatar">A</div>
            <div><div className="admin-user-name">Admin</div><div className="admin-user-role">Super Admin</div></div>
            <button className="logout-btn" onClick={() => { sessionStorage.removeItem("sag_admin"); setAuthed(false); }} title="Logout">⏏</button>
          </div>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-title"><span>{["Dashboard","Applications","Products"][["dashboard","applications","products"].indexOf(adminPage)]}</span></div>
          <div className="live-badge"><div className="live-dot" />LIVE</div>
        </div>
        <div style={{ padding: 32 }}>{pages[adminPage]}</div>
      </main>
      {showModal && <AppModal app={editApp} onSave={saveApp} onClose={() => setShowModal(false)} />}
      {showProductModal && <ProductModal product={editProduct} onSave={p => { const idx = products.findIndex(x => x.id === p.id); if (idx !== -1) { const n = [...products]; n[idx] = p; setProducts(n); } else { setProducts(prev => [...prev, { ...p, id: Date.now() }]); } showToast("success", "✅ Product saved!"); setShowProductModal(false); }} onClose={() => setShowProductModal(false)} />}
      <div className={`toast${toast.show ? " show" : ""} ${toast.type}`}>{toast.msg}</div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("products");
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(() => {
    loadSession()
  });
  const [toastEl, showToast] = useToast();

  // Validate stored session on mount
  useEffect(() => {
    const session = loadSession();
    if (session?.accessToken) {
      sbGetUser(session.accessToken)
        .then(u => { if (!u) { clearSession(); setUser(null); } })
        .catch(() => { clearSession(); setUser(null); });
    }
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  return (
    <div className="sag-app">
      <style>{css}</style>
      {page === "products" && (
        <ProductsPage
          user={user}
          cart={cart}
          setCart={setCart}
          showAuth={() => {}}
          showToast={showToast}
        />
      )}
      {page === "admin" && <AdminPage />}
      {toastEl}
      {page !== "admin" && (
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 99 }}>
          <button onClick={() => setPage("admin")} style={{ background: "var(--dark2)", border: "1px solid var(--border)", color: "var(--muted)", padding: "8px 14px", borderRadius: "40px", fontSize: "0.75rem", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>⚙ Admin</button>
        </div>
      )}
    </div>
  );
}
