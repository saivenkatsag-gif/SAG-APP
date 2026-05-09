import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = "https://mkhopakdgqbibtvtpuhg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1raG9wYWtkZ3FiaWJ0dnRwdWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNTczODcsImV4cCI6MjA5MTYzMzM4N30.oJSHnjo82-zJ7sMoENC2VXSTxia3_TTGBJJf7heZ7FA";
const LOGO = "https://framerusercontent.com/images/J2SsjH2XcUHn6jAVX44tSmKJ8.png";
const ADMIN_EMAIL = "saivenkat.sag@gmail.com";

// ─── SUPABASE AUTH HELPERS ─────────────────────────────────────
const sbHeaders = {
  "Content-Type": "application/json",
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

async function sbSignUp(email, password, name) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST", headers: sbHeaders,
    body: JSON.stringify({ email, password, data: { full_name: name } }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.message || "Registration failed");
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0)
    throw new Error("An account with this email already exists. Please sign in.");
  return data;
}

async function sbSignIn(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST", headers: sbHeaders,
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data.error_description || data.msg || "";
    if (msg.toLowerCase().includes("email not confirmed") || msg.toLowerCase().includes("not confirmed"))
      throw new Error("Please confirm your email first. Check your inbox and click the confirmation link.");
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

async function sbResendConfirmation(email) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/resend`, {
    method: "POST", headers: sbHeaders,
    body: JSON.stringify({ type: "signup", email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.message || "Could not resend email");
  return data;
}

function saveSession(s) { localStorage.setItem("sag_sb_session", JSON.stringify(s)); }
function loadSession() { try { const s = JSON.parse(localStorage.getItem("sag_sb_session") || "null"); if (s && s.email) s.email = s.email.trim().toLowerCase(); return s; } catch { return null; } }
function clearSession() { localStorage.removeItem("sag_sb_session"); }

// ─── SUPABASE DB HELPERS ───────────────────────────────────────
async function sbGetProfile(userId, accessToken) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?id=eq.${userId}&select=*`, {
    headers: { ...sbHeaders, Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data[0] || null;
}

async function sbUpdateProfile(userId, accessToken, updates) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?id=eq.${userId}`, {
    method: "PATCH",
    headers: { ...sbHeaders, Authorization: `Bearer ${accessToken}`, Prefer: "return=representation" },
    body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

async function sbSaveEnquiry(accessToken, enquiry) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/user_enquiries`, {
    method: "POST",
    headers: { ...sbHeaders, Authorization: `Bearer ${accessToken}`, Prefer: "return=representation" },
    body: JSON.stringify(enquiry),
  });
  if (!res.ok) return null;
  return res.json();
}

async function sbGetEnquiries(userId, accessToken) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/user_enquiries?user_id=eq.${userId}&order=created_at.desc&select=*`, {
    headers: { ...sbHeaders, Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return [];
  return res.json();
}

// Admin: get all users profiles + enquiries
async function sbGetAllProfiles() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?select=*&order=created_at.desc`, {
    headers: sbHeaders,
  });
  if (!res.ok) return [];
  return res.json();
}

async function sbGetAllEnquiries() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/user_enquiries?select=*&order=created_at.desc`, {
    headers: sbHeaders,
  });
  if (!res.ok) return [];
  return res.json();
}

// ─── CART DB HELPERS ──────────────────────────────────────────
async function sbGetCart(userId, accessToken) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/user_cart?user_id=eq.${userId}&select=*`,
    { headers: { ...sbHeaders, Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) return [];
  return res.json();
}

async function sbUpsertCartItem(userId, accessToken, productId, qty) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/user_cart`, {
    method: "POST",
    headers: {
      ...sbHeaders,
      Authorization: `Bearer ${accessToken}`,
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({
      user_id: userId,
      product_id: productId,
      qty,
      updated_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error("Failed to update cart");
  return res.json();
}

async function sbDeleteCartItem(userId, accessToken, productId) {
  await fetch(
    `${SUPABASE_URL}/rest/v1/user_cart?user_id=eq.${userId}&product_id=eq.${productId}`,
    {
      method: "DELETE",
      headers: { ...sbHeaders, Authorization: `Bearer ${accessToken}` },
    }
  );
}

async function sbClearCart(userId, accessToken) {
  await fetch(
    `${SUPABASE_URL}/rest/v1/user_cart?user_id=eq.${userId}`,
    {
      method: "DELETE",
      headers: { ...sbHeaders, Authorization: `Bearer ${accessToken}` },
    }
  );
}

// ─── STATIC DATA ──────────────────────────────────────────────
const STATIC_PRODUCTS = [
  { id:1,  name:"SAG Agri Drone 10L",              price:750000,  originalPrice:900000,  image:"https://framerusercontent.com/images/J2SsjH2XcUHn6jAVX44tSmKJ8.png",              isNew:true,  isOffer:true,  status:"instock",    category:"Drones",           waNum:"919390238537" },
  { id:2,  name:"SAG Flash Q20 TC Drone",           price:850000,  originalPrice:1000000, image:"https://framerusercontent.com/images/eRu3lhJevMrkK1YctwXEMpgZICM.png",           isNew:false, isOffer:true,  status:"instock",    category:"Drones",           waNum:"919390238537" },
  { id:3,  name:"14S 22000mAh SAG VOLT Plus",       price:40000,   originalPrice:55000,   image:"https://framerusercontent.com/images/oDDN2aWnPwDBOacMrdJxrPj3K8.png",            isNew:false, isOffer:true,  status:"instock",    category:"Batteries",        waNum:"919390238537" },
  { id:4,  name:"14S 30000mAh SAG VOLT Plus",       price:50000,   originalPrice:65000,   image:"https://framerusercontent.com/images/EIRN6BISlMewm9CBHoIWVhtzYak.png",           isNew:true,  isOffer:true,  status:"instock",    category:"Batteries",        waNum:"919390238537" },
  { id:5,  name:"K3A Pro FC Kit",                   price:33000,   originalPrice:35000,   image:"https://framerusercontent.com/images/dRPDPsr5jgfAEPLI0RIrENpcIoo.webp",          isNew:false, isOffer:true,  status:"instock",    category:"Flight Controller", waNum:"919390238537" },
  { id:6,  name:"VK V9 AG FC Kit",                  price:42000,   originalPrice:45000,   image:"https://framerusercontent.com/images/0Jj398ugeqPzDZmnM5qbUhQZs.png",             isNew:true,  isOffer:false, status:"instock",    category:"Flight Controller", waNum:"919390238537" },
  { id:7,  name:"Hobbywing 8L/min Pump",            price:6800,    originalPrice:7500,    image:"https://framerusercontent.com/images/7Sk32BzwB1Yj3AHjFfUIzNMK0.jpg",             isNew:false, isOffer:false, status:"instock",    category:"Accessories",      waNum:"919390238537" },
  { id:8,  name:"SKYRC 3000 Watt Charger",          price:45000,   originalPrice:50000,   image:"https://framerusercontent.com/images/ccOSG205SKwpOBmfBTiG6vyFe4.jpeg",           isNew:true,  isOffer:true,  status:"instock",    category:"Batteries",        waNum:"919390238537" },
  { id:9,  name:"JiYi K++ Full FC Kit",             price:32000,   originalPrice:35000,   image:"https://framerusercontent.com/images/VDfEexOOoRK6EOM1ybMGwFQgm4.jpg",            isNew:false, isOffer:true,  status:"instock",    category:"Flight Controller", waNum:"919390238537" },
  { id:10, name:"Skydroid T12 Full RC Kit",         price:19000,   originalPrice:21000,   image:"https://framerusercontent.com/images/tKmkl1E8aOyMTjsSN1a4jFh4fGY.jpeg",          isNew:true,  isOffer:false, status:"instock",    category:"Accessories",      waNum:"919390238537" },
  { id:11, name:"Hobbywing CW X8 Motor Combo",      price:13000,   originalPrice:15000,   image:"https://framerusercontent.com/images/aYSQ4cQ8alqgSNu26gG4YI9gAVY.jpg",           isNew:false, isOffer:true,  status:"instock",    category:"Accessories",      waNum:"919390238537" },
  { id:12, name:"SiYi MK15 Transmitter Kit",        price:35000,   originalPrice:45000,   image:"https://framerusercontent.com/images/qaHt0hSCGuIztk0xhYkDydSmzM.png",            isNew:true,  isOffer:true,  status:"instock",    category:"Accessories",      waNum:"919390238537" },
];

const CATEGORY_ICONS = {
  "All":             "🏪",
  "Drones":          "🚁",
  "Batteries":       "🔋",
  "Flight Controller":"🕹️",
  "Accessories":     "🔧",
  "Offers":          "🏷️",
  "New":             "✨",
};

// Default promotional banners (admin can add/edit these)
const DEFAULT_BANNERS = [
  {
    id: 1,
    title: "SALE IS LIVE",
    subtitle: "Up to 20% off on all Drones",
    badge: "LIMITED TIME",
    bg: "linear-gradient(135deg,#0d3a8e 0%,#1a56cc 60%,#0d3a8e 100%)",
    emoji: "🚁",
    cta: "Shop Now",
  },
  {
    id: 2,
    title: "NEW BATTERIES",
    subtitle: "SAG VOLT Plus 14S Series – In Stock",
    badge: "JUST ARRIVED",
    bg: "linear-gradient(135deg,#0a4d0a 0%,#1a8c2e 60%,#0a4d0a 100%)",
    emoji: "🔋",
    cta: "View Range",
  },
  {
    id: 3,
    title: "FC MEGA DEAL",
    subtitle: "Flight Controllers from ₹32,000",
    badge: "HOT DEAL",
    bg: "linear-gradient(135deg,#5c0d8e 0%,#9333ea 60%,#5c0d8e 100%)",
    emoji: "🕹️",
    cta: "Grab Now",
  },
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
  const el = (
    <div style={{
      position: "fixed", bottom: 80, left: "50%", transform: toast.show ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(20px)",
      opacity: toast.show ? 1 : 0, transition: "all .35s", zIndex: 99999,
      background: toast.type === "success" ? "#1a4a2a" : "#4a1a1a",
      border: `1px solid ${toast.type === "success" ? "#2ecc71" : "#e05050"}`,
      borderRadius: 12, padding: "10px 18px", color: "#fff",
      fontSize: "0.85rem", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap",
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)", pointerEvents: toast.show ? "all" : "none",
    }}>{toast.msg}</div>
  );
  return [el, show];
}

// ─── AUTH MODAL ───────────────────────────────────────────────
function AuthModal({ onClose, onLogin }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState("");

  const switchTab = (t) => { setTab(t); setError(""); setInfo(""); setUnconfirmedEmail(""); };

  const doLogin = async () => {
    setError(""); setInfo(""); setLoading(true);
    if (!email.trim() || !password) { setError("Please fill in all fields."); setLoading(false); return; }
    try {
      const data = await sbSignIn(email.trim().toLowerCase(), password);
      const displayName = data.user?.user_metadata?.full_name || email.split("@")[0];
      const userEmail = (data.user.email || email).trim().toLowerCase();
      const session = { id: data.user.id, name: displayName, email: userEmail, accessToken: data.access_token };
      saveSession(session); onLogin(session); onClose();
    } catch (e) {
      if (e.message.includes("confirm your email")) setUnconfirmedEmail(email.trim().toLowerCase());
      setError(e.message);
    } finally { setLoading(false); }
  };

  const doRegister = async () => {
    setError(""); setInfo(""); setLoading(true);
    if (!name.trim() || !email.trim() || !password) { setError("All fields are required."); setLoading(false); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }
    try {
      await sbSignUp(email.trim().toLowerCase(), password, name.trim());
      setInfo(`✅ Confirmation sent to ${email.trim()}. Check your inbox, then sign in.`);
      setTab("login"); setPassword(""); setName("");
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  const doResend = async () => {
    setError(""); setInfo(""); setLoading(true);
    try {
      await sbResendConfirmation(unconfirmedEmail);
      setInfo(`📧 Confirmation email resent to ${unconfirmedEmail}.`);
      setUnconfirmedEmail("");
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <div style={{
      position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.85)",
      backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background:"#131f16",border:"1px solid rgba(46,204,113,0.25)",borderRadius:20,
        padding:"36px 28px",width:"100%",maxWidth:400,position:"relative",
      }}>
        <button onClick={onClose} style={{
          position:"absolute",top:14,right:16,background:"none",border:"none",
          color:"#7aab8a",fontSize:"1.3rem",cursor:"pointer"
        }}>✕</button>
        <img src={LOGO} alt="SAG" style={{ height:40, marginBottom:14, display:"block", margin:"0 auto 14px" }} />
        <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.7rem",fontWeight:800,color:"#fff",textAlign:"center",marginBottom:4 }}>
          {tab === "login" ? "Welcome Back" : "Create Account"}
        </h2>
        <p style={{ fontSize:"0.83rem",color:"#7aab8a",textAlign:"center",marginBottom:24 }}>
          {tab === "login" ? "Sign in to your SAG Drones account" : "Join SAG Drone Technologies"}
        </p>
        <div style={{ display:"flex",background:"#101810",borderRadius:40,padding:3,marginBottom:22 }}>
          {["login","register"].map(t => (
            <button key={t} onClick={() => switchTab(t)} style={{
              flex:1,padding:"8px 14px",borderRadius:40,border:"none",cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",fontSize:"0.84rem",fontWeight:600,
              background: tab===t ? "#2ecc71" : "none",
              color: tab===t ? "#0a0f0d" : "#7aab8a",transition:"all .2s"
            }}>{t === "login" ? "Sign In" : "Register"}</button>
          ))}
        </div>
        {tab === "register" && (
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:"0.71rem",color:"#7aab8a",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",display:"block",marginBottom:4 }}>Full Name</label>
            <input placeholder="Ravi Kumar" value={name} onChange={e => setName(e.target.value)}
              style={{ width:"100%",padding:"10px 13px",background:"#0a0f0d",border:"1.5px solid rgba(46,204,113,0.2)",borderRadius:10,color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:"0.9rem",outline:"none",boxSizing:"border-box" }} />
          </div>
        )}
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:"0.71rem",color:"#7aab8a",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",display:"block",marginBottom:4 }}>Email</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (tab==="login"?doLogin():doRegister())}
            style={{ width:"100%",padding:"10px 13px",background:"#0a0f0d",border:"1.5px solid rgba(46,204,113,0.2)",borderRadius:10,color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:"0.9rem",outline:"none",boxSizing:"border-box" }} />
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:"0.71rem",color:"#7aab8a",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",display:"block",marginBottom:4 }}>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (tab==="login"?doLogin():doRegister())}
            style={{ width:"100%",padding:"10px 13px",background:"#0a0f0d",border:"1.5px solid rgba(46,204,113,0.2)",borderRadius:10,color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:"0.9rem",outline:"none",boxSizing:"border-box" }} />
        </div>
        <button onClick={tab==="login"?doLogin:doRegister} disabled={loading} style={{
          width:"100%",padding:13,background:"#2ecc71",color:"#0a0f0d",border:"none",borderRadius:40,
          fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.95rem",cursor:"pointer",transition:"all .2s"
        }}>{loading ? "Please wait..." : (tab==="login" ? "Sign In →" : "Create Account →")}</button>
        {error && (
          <div style={{ marginTop:12,color:"#e05050",fontSize:"0.82rem",background:"rgba(224,80,80,0.1)",borderRadius:8,padding:"8px 12px",border:"1px solid rgba(224,80,80,0.3)" }}>
            ⚠ {error}
            {unconfirmedEmail && (
              <button onClick={doResend} disabled={loading} style={{
                display:"block",marginTop:8,background:"none",border:"1px solid rgba(224,80,80,0.5)",
                color:"#e05050",borderRadius:6,padding:"5px 12px",fontSize:"0.78rem",cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif",fontWeight:600,width:"100%"
              }}>📧 Resend confirmation email</button>
            )}
          </div>
        )}
        {info && <div style={{ marginTop:12,color:"#2ecc71",fontSize:"0.82rem",background:"rgba(46,204,113,0.1)",borderRadius:8,padding:"8px 12px",border:"1px solid rgba(46,204,113,0.3)" }}>{info}</div>}
      </div>
    </div>
  );
}

// ─── CART DRAWER ──────────────────────────────────────────────
function CartDrawer({ open, onClose, cart, user, showAuth, updateCartQty, removeFromCart }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const checkout = async () => {
    if (!user) { onClose(); showAuth(); return; }
    const lines = cart.map(i => `• ${i.name} x${i.qty} — ${formatINR(i.price*i.qty)}`).join("\n");
    const msg = `🛒 *Cart Enquiry — SAG Drone Technologies*\n\n👤 *Customer:* ${user.name}\n✉️ *Email:* ${user.email||''}\n\n*Items:*\n${lines}\n\n💰 *Total: ${formatINR(total)}*\n\nPlease confirm availability. Thank you!`;
    if (user.accessToken) {
      await sbSaveEnquiry(user.accessToken, {
        user_id: user.id,
        user_name: user.name,
        user_email: user.email || "",
        items: cart.map(i => ({ id:i.id, name:i.name, price:i.price, qty:i.qty })),
        total_amount: total,
        status: "enquired",
      }).catch(() => {});
    }
    window.open(`https://wa.me/919390238537?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <>
      {open && <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:9998,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)" }} />}
      <div style={{
        position:"fixed",top:0,right:0,bottom:0,zIndex:9999,width:"100%",maxWidth:380,
        background:"#131f16",borderLeft:"1px solid rgba(46,204,113,0.2)",
        display:"flex",flexDirection:"column",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition:"transform .35s cubic-bezier(.4,0,.2,1)"
      }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 20px",borderBottom:"1px solid rgba(46,204,113,0.13)" }}>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.25rem",fontWeight:800,color:"#fff" }}>
            🛒 Cart {cart.length > 0 && <span style={{ color:"#2ecc71" }}>({cart.length})</span>}
          </span>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"#7aab8a",fontSize:"1.3rem",cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:16 }}>
          {cart.length === 0 ? (
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",color:"#7aab8a",gap:10 }}>
              <div style={{ fontSize:"3rem",opacity:.4 }}>🛒</div>
              <div style={{ fontSize:"0.9rem" }}>Your cart is empty</div>
            </div>
          ) : cart.map(item => (
            <div key={item.id} style={{ display:"flex",gap:12,padding:"12px 0",borderBottom:"1px solid rgba(46,204,113,0.1)" }}>
              <div style={{ width:64,height:64,borderRadius:10,overflow:"hidden",background:"#0a0f0d",flexShrink:0 }}>
                {item.image && <img src={item.image} alt={item.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} />}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"0.84rem",fontWeight:600,color:"#fff",marginBottom:3,lineHeight:1.3 }}>{item.name}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1rem",fontWeight:800,color:"#2ecc71" }}>{formatINR(item.price*item.qty)}</div>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginTop:6 }}>
                  <button onClick={() => updateCartQty(item.id, item.qty - 1)} style={{ width:24,height:24,borderRadius:"50%",border:"1px solid rgba(46,204,113,0.3)",background:"#0a0f0d",color:"#e8f5ec",cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center" }}>−</button>
                  <span style={{ fontSize:"0.88rem",fontWeight:600,color:"#fff",minWidth:18,textAlign:"center" }}>{item.qty}</span>
                  <button onClick={() => updateCartQty(item.id, item.qty + 1)} style={{ width:24,height:24,borderRadius:"50%",border:"1px solid rgba(46,204,113,0.3)",background:"#0a0f0d",color:"#e8f5ec",cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center" }}>+</button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} style={{ background:"none",border:"none",color:"#7aab8a",cursor:"pointer",fontSize:"1rem",alignSelf:"flex-start" }}>✕</button>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div style={{ padding:"14px 18px",borderTop:"1px solid rgba(46,204,113,0.13)" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
              <span style={{ fontSize:"0.88rem",color:"#7aab8a" }}>Total</span>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.35rem",fontWeight:800,color:"#fff" }}>{formatINR(total)}</span>
            </div>
            <button onClick={checkout} style={{
              width:"100%",padding:13,background:"#2ecc71",color:"#0a0f0d",border:"none",
              borderRadius:40,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.93rem",cursor:"pointer"
            }}>💬 Enquire via WhatsApp</button>
            <div style={{ fontSize:"0.73rem",color:"#7aab8a",textAlign:"center",marginTop:8 }}>
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
  const handleAddCart = () => { if (!user) { onClose(); showAuth(); return; } onAddCart(product); onClose(); };
  const msg = `Hello SAG Drone Technologies! 👋\n\nI'm interested in: ${product.name}\nPrice: ${formatINR(product.price)}\n\nPlease share more details.`;

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position:"fixed",inset:0,zIndex:9990,background:"rgba(0,0,0,0.88)",
      backdropFilter:"blur(10px)",display:"flex",alignItems:"flex-end",justifyContent:"center",padding:0
    }}>
      <div style={{
        background:"#131f16",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:600,
        maxHeight:"92vh",overflowY:"auto",position:"relative",padding:"0 0 20px"
      }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 18px",borderBottom:"1px solid rgba(46,204,113,0.15)" }}>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.1rem",fontWeight:800,color:"#fff" }}>Product Details</span>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.05)",border:"none",color:"#7aab8a",width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
        </div>
        <div style={{ height:260,overflow:"hidden",background:"#0d1a10" }}>
          {product.image
            ? <img src={product.image} alt={product.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} />
            : <div style={{ width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"5rem",opacity:.2 }}>📦</div>
          }
        </div>
        <div style={{ padding:"16px 18px" }}>
          <div style={{ fontSize:"0.7rem",fontWeight:700,color:"#2ecc71",letterSpacing:".08em",textTransform:"uppercase",marginBottom:4 }}>{product.category || "Product"}</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.6rem",fontWeight:800,color:"#fff",lineHeight:1.1,marginBottom:10 }}>{product.name}</div>
          <div style={{ display:"flex",alignItems:"baseline",gap:10,marginBottom:12 }}>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.9rem",fontWeight:800,color:"#2ecc71" }}>{formatINR(product.price)}</span>
            {product.originalPrice && <span style={{ fontSize:"1rem",color:"#7aab8a",textDecoration:"line-through" }}>{formatINR(product.originalPrice)}</span>}
            {off && <span style={{ fontSize:"0.78rem",background:"rgba(46,204,113,0.15)",border:"1px solid rgba(46,204,113,0.3)",color:"#2ecc71",padding:"2px 8px",borderRadius:20,fontWeight:700 }}>{off}% off</span>}
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:6,fontSize:"0.78rem",color:"#2ecc71",fontWeight:600,marginBottom:16 }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:"#2ecc71",display:"inline-block" }} />
            In Stock — Ready to ship
          </div>
          <div style={{ height:1,background:"rgba(46,204,113,0.1)",marginBottom:16 }} />
          <div style={{ fontSize:"0.72rem",fontWeight:700,color:"#7aab8a",letterSpacing:".08em",textTransform:"uppercase",marginBottom:6 }}>Product Details</div>
          <div style={{ fontSize:"0.84rem",color:"#7aab8a",lineHeight:1.7,marginBottom:20 }}>
            DGCA-certified quality drone component. All products come with manufacturer warranty and SAG Drone Technologies' trusted after-sale support.
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            <button onClick={handleAddCart} style={{
              background:"#2ecc71",color:"#0a0f0d",border:"none",borderRadius:40,padding:"13px 20px",
              fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.95rem",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",gap:8
            }}>🛒 {user ? "Add to Cart" : "Sign in to Add to Cart"}</button>
            <a href={waLink(product.waNum||"919390238537", msg)} target="_blank" rel="noreferrer" style={{
              border:"1.5px solid rgba(46,204,113,0.4)",background:"none",color:"#2ecc71",borderRadius:40,
              padding:"11px 20px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.9rem",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",gap:8,textDecoration:"none"
            }}>💬 Enquire on WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BANNER CAROUSEL ──────────────────────────────────────────
function BannerCarousel({ banners, onCategoryLink }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setIdx(i => (i+1) % banners.length), 3500);
    return () => clearInterval(timerRef.current);
  }, [banners.length]);

  const goTo = (i) => { setIdx(i); clearInterval(timerRef.current); timerRef.current = setInterval(() => setIdx(x => (x+1) % banners.length), 3500); };

  if (!banners.length) return null;
  const b = banners[idx];

  return (
    <div style={{ margin:"12px 14px 0",borderRadius:16,overflow:"hidden",position:"relative",boxShadow:"0 4px 20px rgba(36,84,199,0.15)" }}>
      <div style={{
        minHeight:190,position:"relative",display:"flex",flexDirection:"column",justifyContent:"center",
        background: b.imageUrl ? "transparent" : (b.bg || "linear-gradient(135deg,#1a2b6b 0%,#2454c7 100%)"),
        overflow:"hidden"
      }}>
        {/* Full-bleed background image */}
        {b.imageUrl && (
          <img src={b.imageUrl} alt="banner" style={{
            position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",zIndex:0
          }} />
        )}
        {/* Overlay for text readability when image is used */}
        {b.imageUrl && (
          <div style={{ position:"absolute",inset:0,background:"linear-gradient(to right,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.1) 100%)",zIndex:1 }} />
        )}

        <div style={{ position:"relative",zIndex:2,padding:"22px 20px" }}>
          {b.badge && (
            <div style={{ display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.22)",backdropFilter:"blur(4px)",borderRadius:20,padding:"3px 10px",fontSize:"0.68rem",fontWeight:800,color:"#fff",letterSpacing:".08em",marginBottom:10,width:"fit-content" }}>
              🔥 {b.badge}
            </div>
          )}
          {!b.imageUrl && b.emoji && (
            <div style={{ position:"absolute",right:20,top:"50%",transform:"translateY(-50%)",fontSize:"5rem",opacity:.2 }}>{b.emoji}</div>
          )}
          {b.title && (
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"2.2rem",fontWeight:900,color:"#fff",lineHeight:1,marginBottom:6,letterSpacing:"-0.02em",textShadow:"0 2px 8px rgba(0,0,0,0.3)" }}>
              {b.title}
            </div>
          )}
          {b.subtitle && (
            <div style={{ fontSize:"0.88rem",color:"rgba(255,255,255,0.9)",marginBottom:16,textShadow:"0 1px 4px rgba(0,0,0,0.4)" }}>{b.subtitle}</div>
          )}
          {(b.cta || b.linkCategory) && (
            <button
              onClick={() => b.linkCategory && onCategoryLink && onCategoryLink(b.linkCategory)}
              style={{
                alignSelf:"flex-start",background:"#fff",color:"#1a2b6b",border:"none",borderRadius:40,
                padding:"9px 20px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.83rem",
                cursor:"pointer",boxShadow:"0 2px 10px rgba(0,0,0,0.2)"
              }}>
              {b.cta || "Shop Now"} →
            </button>
          )}
        </div>
      </div>
      <div style={{ display:"flex",justifyContent:"center",gap:6,padding:"8px 0",background:"rgba(0,0,0,0.08)" }}>
        {banners.map((_,i) => (
          <div key={i} onClick={() => goTo(i)} style={{
            width: i===idx ? 18 : 6, height:6, borderRadius:3,
            background: i===idx ? "#2454c7" : "rgba(36,84,199,0.3)",
            transition:"all .3s", cursor:"pointer"
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── BANNER ADMIN MODAL ───────────────────────────────────────
function BannerAdminModal({ banners, onSave, onClose }) {
  const [list, setList] = useState(banners.map(b => ({...b})));
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({ title:"", subtitle:"", badge:"", bg:"linear-gradient(135deg,#1a2b6b 0%,#2454c7 100%)", emoji:"🚁", cta:"Shop Now", imageUrl:"", linkCategory:"" });
  const imgInputRef = useRef(null);

  const CATEGORY_OPTIONS = ["All","Drones","Batteries","Flight Controller","Accessories","Offers","New"];

  const openEdit = (i) => {
    setEditIdx(i);
    setForm(i === -1
      ? { title:"", subtitle:"", badge:"", bg:"linear-gradient(135deg,#1a2b6b 0%,#2454c7 100%)", emoji:"🚁", cta:"Shop Now", imageUrl:"", linkCategory:"" }
      : {...list[i], imageUrl: list[i].imageUrl||"", linkCategory: list[i].linkCategory||"" });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({...f, imageUrl: ev.target.result}));
    reader.readAsDataURL(file);
  };

  const saveForm = () => {
    if (!form.title.trim() && !form.imageUrl) return;
    if (editIdx === -1) {
      setList(l => [...l, { ...form, id: Date.now() }]);
    } else {
      setList(l => l.map((b,i) => i===editIdx ? {...form, id:b.id} : b));
    }
    setEditIdx(null);
  };

  const deleteB = (i) => setList(l => l.filter((_,x) => x !== i));

  return (
    <div style={{ position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center" }}
      onClick={e => e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#fff",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:520,maxHeight:"88vh",overflowY:"auto",padding:"0 0 20px" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 18px",borderBottom:"1px solid #e8edf5" }}>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.1rem",fontWeight:800,color:"#111827" }}>🖼 Manage Banners</span>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"#6b7280",fontSize:"1.3rem",cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ padding:"14px 18px" }}>
          {editIdx !== null ? (
            <div>
              <div style={{ fontSize:"0.88rem",fontWeight:700,color:"#111827",marginBottom:12 }}>{editIdx===-1?"Add New Banner":"Edit Banner"}</div>

              {/* Image Upload */}
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:"0.7rem",color:"#6b7280",fontWeight:700,textTransform:"uppercase",display:"block",marginBottom:4 }}>Banner Image (JPG/PNG) — fills entire banner</label>
                <div
                  onClick={() => imgInputRef.current?.click()}
                  style={{
                    width:"100%",height:100,border:"2px dashed #85c9ff",borderRadius:12,
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                    background: form.imageUrl ? "transparent" : "#f0f7ff",cursor:"pointer",position:"relative",overflow:"hidden"
                  }}>
                  {form.imageUrl
                    ? <img src={form.imageUrl} alt="preview" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                    : <><div style={{ fontSize:"2rem",marginBottom:4 }}>📷</div><div style={{ fontSize:"0.78rem",color:"#85c9ff",fontWeight:600 }}>Click to upload image</div></>
                  }
                </div>
                <input ref={imgInputRef} type="file" accept="image/jpeg,image/png,image/jpg,image/webp" onChange={handleImageUpload} style={{ display:"none" }} />
                {form.imageUrl && <button onClick={() => setForm(f=>({...f,imageUrl:""}))} style={{ marginTop:6,background:"none",border:"1px solid #fca5a5",color:"#ef4444",borderRadius:8,padding:"3px 10px",fontSize:"0.75rem",cursor:"pointer" }}>✕ Remove Image</button>}
              </div>

              {[
                ["Title (shown over image)","title","e.g. SALE IS LIVE"],
                ["Subtitle","subtitle","e.g. Up to 20% off on Drones"],
                ["Badge Text","badge","e.g. LIMITED TIME"],
                ["CTA Button Text","cta","e.g. Shop Now"],
              ].map(([label,key,ph]) => (
                <div key={key} style={{ marginBottom:10 }}>
                  <label style={{ fontSize:"0.7rem",color:"#6b7280",fontWeight:700,textTransform:"uppercase",display:"block",marginBottom:4 }}>{label}</label>
                  <input value={form[key]} onChange={e => setForm(f => ({...f,[key]:e.target.value}))} placeholder={ph}
                    style={{ width:"100%",padding:"9px 12px",background:"#f9fafb",border:"1.5px solid #e5e7eb",borderRadius:10,color:"#111827",fontFamily:"'DM Sans',sans-serif",fontSize:"0.88rem",outline:"none",boxSizing:"border-box" }} />
                </div>
              ))}

              {/* Link to Category */}
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:"0.7rem",color:"#6b7280",fontWeight:700,textTransform:"uppercase",display:"block",marginBottom:4 }}>🔗 Link Button to Category</label>
                <select value={form.linkCategory} onChange={e => setForm(f=>({...f,linkCategory:e.target.value}))}
                  style={{ width:"100%",padding:"9px 12px",background:"#f9fafb",border:"1.5px solid #e5e7eb",borderRadius:10,color:"#111827",fontFamily:"'DM Sans',sans-serif",fontSize:"0.88rem",outline:"none",boxSizing:"border-box" }}>
                  <option value="">— No link —</option>
                  {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {form.linkCategory && <div style={{ marginTop:5,fontSize:"0.74rem",color:"#2454c7" }}>Button will navigate to: <strong>{form.linkCategory}</strong></div>}
              </div>

              {!form.imageUrl && (
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:"0.7rem",color:"#6b7280",fontWeight:700,textTransform:"uppercase",display:"block",marginBottom:4 }}>Emoji (shown if no image)</label>
                  <input value={form.emoji} onChange={e => setForm(f => ({...f,emoji:e.target.value}))} placeholder="🚁"
                    style={{ width:"100%",padding:"9px 12px",background:"#f9fafb",border:"1.5px solid #e5e7eb",borderRadius:10,color:"#111827",fontFamily:"'DM Sans',sans-serif",fontSize:"0.88rem",outline:"none",boxSizing:"border-box" }} />
                  <div style={{ marginTop:8 }}>
                    <label style={{ fontSize:"0.7rem",color:"#6b7280",fontWeight:700,textTransform:"uppercase",display:"block",marginBottom:4 }}>Background Gradient (used if no image)</label>
                    <input value={form.bg} onChange={e => setForm(f => ({...f,bg:e.target.value}))} placeholder="linear-gradient(135deg,#1a2b6b 0%,#2454c7 100%)"
                      style={{ width:"100%",padding:"9px 12px",background:"#f9fafb",border:"1.5px solid #e5e7eb",borderRadius:10,color:"#111827",fontFamily:"monospace",fontSize:"0.8rem",outline:"none",boxSizing:"border-box" }} />
                    <div style={{ height:28,borderRadius:6,marginTop:6,background:form.bg }} />
                  </div>
                </div>
              )}

              <div style={{ display:"flex",gap:10 }}>
                <button onClick={saveForm} style={{ flex:1,padding:"11px",background:"#2454c7",color:"#fff",border:"none",borderRadius:40,fontFamily:"'DM Sans',sans-serif",fontWeight:700,cursor:"pointer" }}>Save Banner</button>
                <button onClick={()=>setEditIdx(null)} style={{ flex:1,padding:"11px",background:"#f3f4f6",color:"#374151",border:"1px solid #e5e7eb",borderRadius:40,fontFamily:"'DM Sans',sans-serif",fontWeight:600,cursor:"pointer" }}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              {list.map((b,i) => (
                <div key={b.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid #f3f4f6" }}>
                  <div style={{ width:52,height:44,borderRadius:10,overflow:"hidden",flexShrink:0,background:b.bg||"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem" }}>
                    {b.imageUrl ? <img src={b.imageUrl} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : b.emoji}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700,fontSize:"0.88rem",color:"#111827" }}>{b.title||"(Image Banner)"}</div>
                    <div style={{ fontSize:"0.75rem",color:"#6b7280" }}>{b.linkCategory ? `→ ${b.linkCategory}` : b.subtitle}</div>
                  </div>
                  <button onClick={()=>openEdit(i)} style={{ background:"#eff6ff",border:"1px solid #85c9ff",color:"#2454c7",borderRadius:8,padding:"5px 11px",fontSize:"0.76rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:700 }}>Edit</button>
                  <button onClick={()=>deleteB(i)} style={{ background:"#fef2f2",border:"1px solid #fca5a5",color:"#ef4444",borderRadius:8,padding:"5px 8px",fontSize:"0.76rem",cursor:"pointer" }}>✕</button>
                </div>
              ))}
              <button onClick={()=>openEdit(-1)} style={{ width:"100%",marginTop:14,padding:"11px",background:"#eff6ff",color:"#2454c7",border:"1.5px dashed #85c9ff",borderRadius:12,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.88rem",cursor:"pointer" }}>
                + Add New Banner
              </button>
              <button onClick={()=>onSave(list)} style={{ width:"100%",marginTop:10,padding:"11px",background:"#2454c7",color:"#fff",border:"none",borderRadius:40,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.9rem",cursor:"pointer" }}>
                ✅ Save All Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── HOME PAGE ─────────────────────────────────────────────────
function HomePage({ user, cart, showAuth, showToast, onTabChange, banners, setBanners, addToCart }) {
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [modalProduct, setModalProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [localUser, setLocalUser] = useState(user);
  const [bannerAdminOpen, setBannerAdminOpen] = useState(false);

  useEffect(() => { setLocalUser(user); }, [user]);

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/products?order=created_at.asc&select=*`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(rows => {
        if (rows && rows.length) setProducts(rows.map(r => ({
          id:r.id, name:r.name, price:r.price, originalPrice:r.original_price,
          image:r.image, isNew:r.is_new, isOffer:r.is_offer, status:r.status,
          category:r.category, waNum:r.wa_num||"919390238537"
        })));
      }).catch(()=>{});
  }, []);

  const cats = ["All","Drones","Batteries","Flight Controller","Accessories","Offers","New"];

  let filtered = products.filter(p => {
    const cat = p.category || "Accessories";
    if (activeCat === "Offers") return p.isOffer;
    if (activeCat === "New") return p.isNew;
    if (activeCat !== "All" && cat !== activeCat) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !(p.category||"").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const cartCount = cart.reduce((s,i) => s+i.qty, 0);

  const featuredDrones = products.filter(p => p.category==="Drones").slice(0,3);
  const featuredBatteries = products.filter(p => p.category==="Batteries").slice(0,3);
  const offers = products.filter(p => p.isOffer).slice(0,4);

  return (
    <div style={{ background:"#f5f7fa",minHeight:"100vh",paddingBottom:70,fontFamily:"'DM Sans',sans-serif" }}>

      {/* ─── TOP BAR ─── */}
      <div style={{
        position:"sticky",top:0,zIndex:100,
        background:"linear-gradient(135deg,#1a2b6b 0%,#2454c7 100%)",
        padding:"10px 14px 0",
        boxShadow:"0 2px 12px rgba(36,84,199,0.18)"
      }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <img src={LOGO} alt="SAG" style={{ height:34,borderRadius:6 }} />
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:"1.05rem",color:"#fff",lineHeight:1,letterSpacing:"-0.01em" }}>SAG DRONES</div>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            {(localUser?.email||"").toLowerCase() === ADMIN_EMAIL && (
              <button onClick={() => setBannerAdminOpen(true)} title="Manage Banners" style={{
                background:"rgba(255,255,255,0.12)",border:"none",borderRadius:8,padding:"6px 10px",
                color:"#fff",fontSize:"0.7rem",fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"
              }}>🖼 Banners</button>
            )}
            <button onClick={() => setCartOpen(true)} style={{
              position:"relative",background:"rgba(255,255,255,0.12)",border:"none",
              borderRadius:"50%",width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",
              cursor:"pointer",fontSize:"1.1rem"
            }}>
              🛒
              {cartCount > 0 && (
                <span style={{
                  position:"absolute",top:-3,right:-3,background:"#ff5722",color:"#fff",
                  fontSize:"0.6rem",fontWeight:800,width:16,height:16,borderRadius:"50%",
                  display:"flex",alignItems:"center",justifyContent:"center"
                }}>{cartCount}</span>
              )}
            </button>
            {localUser ? (
              <div style={{
                width:34,height:34,borderRadius:"50%",background:"#2ecc71",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:"0.95rem",color:"#0a0f0d",cursor:"pointer",flexShrink:0
              }} onClick={() => onTabChange("account")}>
                {localUser.name[0].toUpperCase()}
              </div>
            ) : (
              <button onClick={() => setAuthOpen(true)} style={{
                background:"#fff",color:"#0d3a8e",border:"none",borderRadius:20,
                padding:"6px 14px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.78rem",cursor:"pointer"
              }}>Sign In</button>
            )}
          </div>
        </div>

        <div style={{ position:"relative",marginBottom:10 }}>
          <span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:"0.95rem",color:"#7aab8a",pointerEvents:"none" }}>🔍</span>
          <input
            placeholder="Search drones, batteries, accessories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width:"100%",padding:"10px 14px 10px 36px",background:"#fff",
              border:"none",borderRadius:10,color:"#0a0f0d",
              fontFamily:"'DM Sans',sans-serif",fontSize:"0.88rem",outline:"none",boxSizing:"border-box"
            }}
          />
        </div>

        <div style={{ display:"flex",gap:8,overflowX:"auto",paddingBottom:10,scrollbarWidth:"none" }}>
          {cats.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)} style={{
              flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:3,
              background: activeCat===cat ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
              border: activeCat===cat ? "2px solid #fff" : "2px solid transparent",
              borderRadius:10,padding:"6px 14px",cursor:"pointer",transition:"all .2s",
              minWidth:60
            }}>
              <span style={{ fontSize:"1.2rem" }}>{CATEGORY_ICONS[cat]||"📦"}</span>
              <span style={{ fontSize:"0.66rem",fontWeight:700,color:"#fff",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif" }}>{cat}</span>
              {activeCat===cat && <div style={{ width:18,height:2,background:"#fff",borderRadius:1 }} />}
            </button>
          ))}
        </div>
      </div>

      {/* ─── MAIN SCROLL AREA ─── */}
      <div>
        <BannerCarousel banners={banners} onCategoryLink={(cat) => setActiveCat(cat)} />

        {search || activeCat !== "All" ? (
          <div style={{ padding:"16px 14px 8px" }}>
            <div style={{ fontSize:"0.82rem",color:"#6b7280",marginBottom:12 }}>
              {filtered.length} result{filtered.length!==1?"s":""}{search ? ` for "${search}"` : ``}{activeCat!=="All" ? ` in ${activeCat}` : ""}
            </div>
            {filtered.length === 0 ? (
              <div style={{ textAlign:"center",padding:"40px 20px",color:"#7aab8a" }}>
                <div style={{ fontSize:"3rem",opacity:.4,marginBottom:10 }}>🔍</div>
                No products match your filters.
              </div>
            ) : (
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                {filtered.map(p => <ProductCard key={p.id} p={p} onClick={() => setModalProduct(p)} onAddCart={() => { if(!localUser){setAuthOpen(true);return;} addToCart(p); }} user={localUser} />)}
              </div>
            )}
          </div>
        ) : (
          <>
            <SectionBlock title="🚁 Drones" subtitle="Agricultural drones for every farm" products={featuredDrones}
              onProductClick={setModalProduct} onAddCart={(p) => { if(!localUser){setAuthOpen(true);return;} addToCart(p); }} user={localUser}
              onViewAll={() => setActiveCat("Drones")} />

            {offers.length > 0 && (
              <SectionBlock title="🏷️ Hot Deals" subtitle="Best prices on top products" products={offers}
                onProductClick={setModalProduct} onAddCart={(p) => { if(!localUser){setAuthOpen(true);return;} addToCart(p); }} user={localUser}
                onViewAll={() => setActiveCat("Offers")} accent="#f0a030" />
            )}

            <SectionBlock title="🔋 Batteries" subtitle="SAG VOLT Plus series & chargers" products={featuredBatteries}
              onProductClick={setModalProduct} onAddCart={(p) => { if(!localUser){setAuthOpen(true);return;} addToCart(p); }} user={localUser}
              onViewAll={() => setActiveCat("Batteries")} />

            <div style={{ padding:"0 14px 8px" }}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
                <div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.25rem",fontWeight:800,color:"#111827" }}>All Products</div>
                  <div style={{ fontSize:"0.75rem",color:"#6b7280",marginTop:1 }}>{products.length} items available</div>
                </div>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                {products.map(p => <ProductCard key={p.id} p={p} onClick={() => setModalProduct(p)} onAddCart={() => { if(!localUser){setAuthOpen(true);return;} addToCart(p); }} user={localUser} />)}
              </div>
            </div>
          </>
        )}

        <div style={{ padding:"20px 14px",borderTop:"1px solid #e8edf5",marginTop:10,background:"#fff" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
            <img src={LOGO} alt="SAG" style={{ height:28 }} />
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"0.9rem",fontWeight:800,color:"#111827" }}>SAG Drone Technologies</span>
          </div>
          <div style={{ fontSize:"0.78rem",color:"#6b7280",lineHeight:1.9 }}>
            📞 +91 897777 6019 &nbsp;|&nbsp; ✉️ sagtechinfo@gmail.com
          </div>
          <div style={{ fontSize:"0.72rem",color:"#9ca3af",marginTop:10,textAlign:"center" }}>
            © 2025 SAG Drone Technologies. All rights reserved.
          </div>
        </div>
      </div>

      {/* Modals */}
      {cartOpen && <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} user={localUser} showAuth={() => setAuthOpen(true)} updateCartQty={updateCartQty} removeFromCart={removeFromCart} />}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onLogin={(session) => { saveSession(session); setLocalUser(session); showToast("success","✅ Welcome, "+session.name+"!"); }} />}
      {modalProduct && <ProductDetailModal product={modalProduct} onClose={() => setModalProduct(null)} onAddCart={addToCart} user={localUser} showAuth={() => { setModalProduct(null); setAuthOpen(true); }} />}
      {bannerAdminOpen && <BannerAdminModal banners={banners} onSave={(list) => { setBanners(list); setBannerAdminOpen(false); showToast("success","✅ Banners saved!"); }} onClose={() => setBannerAdminOpen(false)} />}
    </div>
  );
}

// ─── SECTION BLOCK ────────────────────────────────────────────
function SectionBlock({ title, subtitle, products, onProductClick, onAddCart, user, onViewAll, accent="#2ecc71" }) {
  if (!products.length) return null;
  return (
    <div style={{ margin:"16px 0 0",background:"#ffffff",borderRadius:16,padding:"14px 0 4px",boxShadow:"0 1px 6px rgba(0,0,0,0.06)",marginLeft:14,marginRight:14 }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 14px",marginBottom:12 }}>
        <div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.25rem",fontWeight:800,color:"#111827" }}>{title}</div>
          <div style={{ fontSize:"0.74rem",color:"#6b7280",marginTop:1 }}>{subtitle}</div>
        </div>
        <button onClick={onViewAll} style={{ background:"#eff6ff",border:"1px solid #85c9ff",color:"#2454c7",borderRadius:20,padding:"5px 12px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.75rem",cursor:"pointer" }}>
          View All →
        </button>
      </div>
      <div style={{ display:"flex",gap:10,overflowX:"auto",padding:"0 14px 12px",scrollbarWidth:"none" }}>
        {products.map(p => (
          <ProductCard key={p.id} p={p} onClick={() => onProductClick(p)} onAddCart={() => onAddCart(p)} user={user} compact />
        ))}
      </div>
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────
function ProductCard({ p, onClick, onAddCart, user, compact }) {
  const off = discount(p.price, p.originalPrice);

  if (compact) {
    // Horizontal compact card for section carousels
    return (
      <div onClick={onClick} style={{
        background:"#fff",border:"1.5px solid #e8edf5",borderRadius:14,
        overflow:"hidden",cursor:"pointer",display:"flex",flexDirection:"column",
        width:150,flexShrink:0,
        boxShadow:"0 1px 4px rgba(0,0,0,0.05)",position:"relative"
      }}>
        {(p.isNew||p.isOffer) && (
          <div style={{
            position:"absolute",top:6,left:6,zIndex:2,
            background:p.isNew?"#0ea5e9":"#f59e0b",
            color:"#fff",fontSize:"0.52rem",fontWeight:800,padding:"2px 6px",borderRadius:20,textTransform:"uppercase"
          }}>{p.isNew?"New":"Sale"}</div>
        )}
        <div style={{ width:"100%",height:100,overflow:"hidden",background:"#f3f4f6",flexShrink:0 }}>
          {p.image && <img src={p.image} alt={p.name} loading="lazy" style={{ width:"100%",height:"100%",objectFit:"cover" }} />}
        </div>
        <div style={{ padding:"8px 9px 8px",display:"flex",flexDirection:"column",gap:3 }}>
          <div style={{ fontSize:"0.56rem",fontWeight:700,color:"#85c9ff",letterSpacing:".05em",textTransform:"uppercase" }}>{p.category||"Product"}</div>
          <div style={{ fontSize:"0.76rem",fontWeight:600,color:"#111827",lineHeight:1.25,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{p.name}</div>
          <div style={{ display:"flex",alignItems:"center",gap:4,flexWrap:"wrap",marginTop:2 }}>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"0.92rem",fontWeight:800,color:"#1a2b6b" }}>{formatINR(p.price)}</span>
            {off && <span style={{ fontSize:"0.58rem",background:"#eff6ff",border:"1px solid #bfdbfe",color:"#2454c7",padding:"1px 4px",borderRadius:8,fontWeight:700 }}>{off}%</span>}
          </div>
          {p.originalPrice && <div style={{ fontSize:"0.67rem",color:"#9ca3af",textDecoration:"line-through" }}>{formatINR(p.originalPrice)}</div>}
        </div>
      </div>
    );
  }

  // ── Grid card: fixed height, Myntra-style ──
  return (
    <div onClick={onClick} style={{
      background:"#ffffff",border:"1.5px solid #e8edf5",borderRadius:14,
      overflow:"hidden",cursor:"pointer",
      display:"flex",flexDirection:"column",
      height:340,                         // fixed card height
      boxShadow:"0 1px 6px rgba(0,0,0,0.07)",
      position:"relative",
      transition:"box-shadow .18s,border-color .18s"
    }}>
      {/* Badge */}
      {(p.isNew||p.isOffer) && (
        <div style={{
          position:"absolute",top:8,left:8,zIndex:2,
          background:p.isNew?"#0ea5e9":"#f59e0b",
          color:"#fff",fontSize:"0.55rem",fontWeight:800,
          padding:"2px 8px",borderRadius:20,textTransform:"uppercase",
          letterSpacing:".04em",boxShadow:"0 1px 4px rgba(0,0,0,0.15)"
        }}>{p.isNew?"NEW":"SALE"}</div>
      )}

      {/* Image — 60% of card */}
      <div style={{ width:"100%",height:185,overflow:"hidden",background:"#f3f4f6",flexShrink:0 }}>
        {p.image
          ? <img src={p.image} alt={p.name} loading="lazy" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
          : <div style={{ width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"3rem",opacity:.2 }}>📦</div>
        }
      </div>

      {/* Info — remaining space, no overflow */}
      <div style={{ padding:"9px 10px 0",display:"flex",flexDirection:"column",flex:1,minHeight:0 }}>
        {/* Category */}
        <div style={{ fontSize:"0.58rem",fontWeight:700,color:"#85c9ff",letterSpacing:".07em",textTransform:"uppercase",marginBottom:3,lineHeight:1 }}>{p.category||"Product"}</div>
        {/* Name — 2 lines max */}
        <div style={{ fontSize:"0.82rem",fontWeight:600,color:"#111827",lineHeight:1.3,marginBottom:5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{p.name}</div>
        {/* Price row */}
        <div style={{ display:"flex",alignItems:"center",gap:5,flexWrap:"wrap" }}>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.05rem",fontWeight:800,color:"#1a2b6b" }}>{formatINR(p.price)}</span>
          {off && <span style={{ fontSize:"0.6rem",background:"#eff6ff",border:"1px solid #bfdbfe",color:"#2454c7",padding:"1px 5px",borderRadius:10,fontWeight:700 }}>{off}%</span>}
        </div>
        {/* Original price */}
        {p.originalPrice && (
          <div style={{ fontSize:"0.7rem",color:"#9ca3af",textDecoration:"line-through",marginTop:1 }}>{formatINR(p.originalPrice)}</div>
        )}
      </div>

      {/* Action buttons — pinned to bottom */}
      <div style={{ padding:"7px 10px 10px",display:"flex",gap:7,marginTop:"auto",flexShrink:0 }} onClick={e=>e.stopPropagation()}>
        <button onClick={onAddCart} style={{
          flex:1,background:"#1a2b6b",color:"#fff",border:"none",borderRadius:30,
          padding:"8px 6px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,
          fontSize:"0.74rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,
          whiteSpace:"nowrap"
        }}>🛒 {user?"Add to Cart":"Sign in"}</button>
        <a href={waLink(p.waNum||"919390238537",`Hello SAG! I'm interested in ${p.name} (${formatINR(p.price)})`)}
          target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}
          style={{
            width:36,height:36,flexShrink:0,
            border:"1.5px solid #85c9ff",background:"#eff6ff",color:"#2454c7",
            borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:"0.9rem",textDecoration:"none"
          }}>💬</a>
      </div>
    </div>
  );
}

// ─── CATEGORIES PAGE ──────────────────────────────────────────
function CategoriesPage({ products, onProductClick, onAddCart, user }) {
  const cats = ["Drones","Batteries","Flight Controller","Accessories"];
  const catDescs = {
    "Drones": "DGCA-certified agricultural drones",
    "Batteries": "High-capacity LiPo batteries & chargers",
    "Flight Controller": "Precision FC kits for AG drones",
    "Accessories": "Pumps, transmitters, motors & more",
  };

  return (
    <div style={{ background:"#f5f7fa",minHeight:"100vh",paddingBottom:70,fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:"linear-gradient(135deg,#1a2b6b 0%,#2454c7 100%)",padding:"16px 16px 14px" }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.5rem",fontWeight:800,color:"#fff" }}>Categories</div>
        <div style={{ fontSize:"0.78rem",color:"rgba(255,255,255,0.8)",marginTop:2 }}>Browse by product type</div>
      </div>
      <div style={{ padding:"14px 14px" }}>
        {cats.map(cat => {
          const items = products.filter(p => p.category === cat);
          if (!items.length) return null;
          return (
            <div key={cat} style={{ marginBottom:22 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                <span style={{ fontSize:"1.5rem" }}>{CATEGORY_ICONS[cat]}</span>
                <div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.15rem",fontWeight:800,color:"#111827" }}>{cat}</div>
                  <div style={{ fontSize:"0.73rem",color:"#6b7280" }}>{catDescs[cat]} · {items.length} items</div>
                </div>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                {items.map(p => <ProductCard key={p.id} p={p} onClick={() => onProductClick(p)} onAddCart={() => onAddCart(p)} user={user} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ACCOUNT PAGE ─────────────────────────────────────────────
function AccountPage({ user, onLogin, onLogout, cart, showToast }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [profileForm, setProfileForm] = useState({ phone:"", address:"" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const cartCount = cart.reduce((s,i) => s+i.qty, 0);
  const cartTotal = cart.reduce((s,i) => s+i.price*i.qty, 0);

  useEffect(() => {
    if (!user?.accessToken) return;
    sbGetProfile(user.id, user.accessToken).then(p => {
      if (p) { setProfile(p); setProfileForm({ phone: p.phone||"", address: p.address||"" }); }
    }).catch(()=>{});
    sbGetEnquiries(user.id, user.accessToken).then(setEnquiries).catch(()=>{});
  }, [user]);

  const saveProfile = async () => {
    if (!user?.accessToken) return;
    setSavingProfile(true);
    try {
      await sbUpdateProfile(user.id, user.accessToken, profileForm);
      setProfile(p => ({...p, ...profileForm}));
      showToast("success","✅ Profile updated!");
    } catch { showToast("error","❌ Failed to save."); }
    finally { setSavingProfile(false); }
  };

  const statusColor = s => s==="enquired" ? "#2ecc71" : s==="confirmed" ? "#3a9ad9" : "#f0a030";

  return (
    <div style={{ background:"#f5f7fa",minHeight:"100vh",paddingBottom:80,fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:"linear-gradient(135deg,#1a2b6b 0%,#2454c7 100%)",padding:"16px 16px 20px" }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.5rem",fontWeight:800,color:"#fff",marginBottom:2 }}>Account</div>
        {user ? (
          <div style={{ display:"flex",alignItems:"center",gap:12,marginTop:10 }}>
            <div style={{ width:52,height:52,borderRadius:"50%",background:"#2ecc71",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:"1.4rem",color:"#0a0f0d",flexShrink:0 }}>
              {user.name[0].toUpperCase()}
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontWeight:700,fontSize:"1rem",color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{user.name}</div>
              <div style={{ fontSize:"0.76rem",color:"rgba(255,255,255,0.7)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{user.email}</div>
              {profile?.phone && <div style={{ fontSize:"0.74rem",color:"rgba(255,255,255,0.6)",marginTop:1 }}>📞 {profile.phone}</div>}
            </div>
          </div>
        ) : (
          <div style={{ fontSize:"0.85rem",color:"rgba(255,255,255,0.75)",marginTop:4 }}>Sign in to access your account</div>
        )}
      </div>

      <div style={{ padding:"14px 14px" }}>
        {!user ? (
          <div style={{ textAlign:"center",paddingTop:24 }}>
            <div style={{ fontSize:"3.5rem",marginBottom:12 }}>👤</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.4rem",fontWeight:800,color:"#fff",marginBottom:6 }}>Not signed in</div>
            <div style={{ fontSize:"0.85rem",color:"#7aab8a",marginBottom:22 }}>Sign in to track orders and manage your profile</div>
            <button onClick={() => setAuthOpen(true)} style={{
              background:"#2ecc71",color:"#0a0f0d",border:"none",borderRadius:40,padding:"13px 36px",
              fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.95rem",cursor:"pointer"
            }}>Sign In / Register</button>
          </div>
        ) : (
          <>
            <div style={{ display:"flex",gap:8,marginBottom:16 }}>
              {[["overview","🏠 Overview"],["orders","📦 My Orders"],["profile","👤 Profile"]].map(([s,l]) => (
                <button key={s} onClick={() => setActiveSection(s)} style={{
                  flex:1,padding:"9px 6px",borderRadius:10,border:"none",cursor:"pointer",
                  fontFamily:"'DM Sans',sans-serif",fontSize:"0.75rem",fontWeight:700,
                  background: activeSection===s ? "#2ecc71" : "#131f16",
                  color: activeSection===s ? "#0a0f0d" : "#7aab8a",
                  border: activeSection===s ? "none" : "1px solid rgba(46,204,113,0.1)",
                  transition:"all .2s"
                }}>{l}</button>
              ))}
            </div>

            {activeSection === "overview" && (
              <>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14 }}>
                  {[
                    ["📦", enquiries.length, "Enquiries"],
                    ["🛒", cartCount, "In Cart"],
                    ["✅", enquiries.filter(e=>e.status==="confirmed").length, "Confirmed"],
                  ].map(([icon,val,label]) => (
                    <div key={label} style={{ background:"#131f16",border:"1px solid rgba(46,204,113,0.1)",borderRadius:12,padding:"12px 10px",textAlign:"center" }}>
                      <div style={{ fontSize:"1.3rem",marginBottom:4 }}>{icon}</div>
                      <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.5rem",fontWeight:800,color:"#fff" }}>{val}</div>
                      <div style={{ fontSize:"0.68rem",color:"#7aab8a",marginTop:1 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {cartCount > 0 && (
                  <div style={{ background:"linear-gradient(135deg,rgba(46,204,113,0.1),rgba(46,204,113,0.05))",border:"1px solid rgba(46,204,113,0.2)",borderRadius:12,padding:"14px 16px",marginBottom:12 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                      <div>
                        <div style={{ fontWeight:700,fontSize:"0.9rem",color:"#fff",marginBottom:2 }}>🛒 Active Cart</div>
                        <div style={{ fontSize:"0.78rem",color:"#7aab8a" }}>{cartCount} item{cartCount!==1?"s":""} · {formatINR(cartTotal)}</div>
                      </div>
                      <a href={`https://wa.me/919390238537?text=${encodeURIComponent(`Hello SAG! I have ${cartCount} items in my cart worth ${formatINR(cartTotal)}.`)}`}
                        target="_blank" rel="noreferrer"
                        style={{ background:"#2ecc71",color:"#0a0f0d",border:"none",borderRadius:20,padding:"7px 14px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.78rem",cursor:"pointer",textDecoration:"none",flexShrink:0 }}>
                        Enquire 💬
                      </a>
                    </div>
                  </div>
                )}

                {[
                  ["💬","WhatsApp Support","Chat with our team",() => window.open("https://wa.me/919390238537","_blank")],
                  ["📞","Call Us","+91 897777 6019",() => window.open("tel:+918977776019","_blank")],
                  ["📍","Our Location","Nidadavole, Andhra Pradesh – 534 302",null],
                  ["✉️","Email Us","sagtechinfo@gmail.com",() => window.open("mailto:sagtechinfo@gmail.com","_blank")],
                ].map(([icon,label,sub,action]) => (
                  <div key={label} onClick={action||undefined} style={{ display:"flex",alignItems:"center",gap:12,padding:"13px 14px",background:"#131f16",border:"1px solid rgba(46,204,113,0.1)",borderRadius:12,marginBottom:9,cursor:action?"pointer":"default" }}>
                    <span style={{ fontSize:"1.25rem" }}>{icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600,fontSize:"0.87rem",color:"#fff" }}>{label}</div>
                      <div style={{ fontSize:"0.73rem",color:"#7aab8a",marginTop:1 }}>{sub}</div>
                    </div>
                    {action && <span style={{ color:"#7aab8a",fontSize:"0.85rem" }}>›</span>}
                  </div>
                ))}

                <button onClick={onLogout} style={{
                  width:"100%",marginTop:6,padding:"13px",background:"rgba(224,80,80,0.08)",
                  border:"1px solid rgba(224,80,80,0.25)",color:"#e05050",borderRadius:12,
                  fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.88rem",cursor:"pointer"
                }}>⏏ Sign Out</button>
              </>
            )}

            {activeSection === "orders" && (
              <div>
                <div style={{ fontSize:"0.8rem",color:"#7aab8a",marginBottom:12 }}>{enquiries.length} enquir{enquiries.length!==1?"ies":"y"} recorded</div>
                {enquiries.length === 0 ? (
                  <div style={{ textAlign:"center",padding:"40px 20px",color:"#7aab8a" }}>
                    <div style={{ fontSize:"3rem",opacity:.3,marginBottom:10 }}>📦</div>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.2rem",fontWeight:800,color:"#fff",marginBottom:6 }}>No enquiries yet</div>
                    <div style={{ fontSize:"0.82rem" }}>When you enquire on WhatsApp, it'll appear here.</div>
                  </div>
                ) : enquiries.map(enq => (
                  <div key={enq.id} style={{ background:"#131f16",border:"1px solid rgba(46,204,113,0.1)",borderRadius:12,padding:"14px 16px",marginBottom:10 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8 }}>
                      <div>
                        <div style={{ fontSize:"0.72rem",color:"#7aab8a" }}>#{enq.id} · {new Date(enq.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
                        <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.1rem",fontWeight:800,color:"#fff",marginTop:2 }}>{formatINR(enq.total_amount)}</div>
                      </div>
                      <span style={{ background:`${statusColor(enq.status)}22`,border:`1px solid ${statusColor(enq.status)}55`,color:statusColor(enq.status),borderRadius:20,padding:"3px 10px",fontSize:"0.68rem",fontWeight:700,textTransform:"uppercase" }}>
                        {enq.status}
                      </span>
                    </div>
                    {Array.isArray(enq.items) && enq.items.map((item,i) => (
                      <div key={i} style={{ display:"flex",justifyContent:"space-between",fontSize:"0.78rem",color:"#7aab8a",padding:"3px 0",borderTop: i===0?"1px solid rgba(46,204,113,0.08)":"none",marginTop: i===0?8:0 }}>
                        <span>{item.name} × {item.qty}</span>
                        <span style={{ color:"#fff" }}>{formatINR(item.price*item.qty)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {activeSection === "profile" && (
              <div>
                <div style={{ background:"#131f16",border:"1px solid rgba(46,204,113,0.1)",borderRadius:12,padding:"16px",marginBottom:12 }}>
                  <div style={{ fontSize:"0.88rem",fontWeight:700,color:"#fff",marginBottom:14 }}>Personal Information</div>
                  {[["Full Name", user.name],["Email", user.email]].map(([label,val]) => (
                    <div key={label} style={{ marginBottom:12 }}>
                      <div style={{ fontSize:"0.7rem",color:"#7aab8a",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4 }}>{label}</div>
                      <div style={{ padding:"10px 13px",background:"rgba(255,255,255,0.04)",borderRadius:10,fontSize:"0.88rem",color:"rgba(255,255,255,0.5)",border:"1px solid rgba(46,204,113,0.08)" }}>{val}</div>
                    </div>
                  ))}
                  <div style={{ marginBottom:12 }}>
                    <div style={{ fontSize:"0.7rem",color:"#7aab8a",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4 }}>Phone Number</div>
                    <input value={profileForm.phone} onChange={e => setProfileForm(f=>({...f,phone:e.target.value}))} placeholder="+91 98765 43210"
                      style={{ width:"100%",padding:"10px 13px",background:"#0a0f0d",border:"1.5px solid rgba(46,204,113,0.2)",borderRadius:10,color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:"0.88rem",outline:"none",boxSizing:"border-box" }} />
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontSize:"0.7rem",color:"#7aab8a",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",marginBottom:4 }}>Delivery Address</div>
                    <textarea value={profileForm.address} onChange={e => setProfileForm(f=>({...f,address:e.target.value}))} placeholder="House No, Street, City, State, Pincode"
                      rows={3} style={{ width:"100%",padding:"10px 13px",background:"#0a0f0d",border:"1.5px solid rgba(46,204,113,0.2)",borderRadius:10,color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:"0.88rem",outline:"none",boxSizing:"border-box",resize:"vertical" }} />
                  </div>
                  <button onClick={saveProfile} disabled={savingProfile} style={{
                    width:"100%",padding:"12px",background:"#2ecc71",color:"#0a0f0d",border:"none",borderRadius:40,
                    fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.9rem",cursor:"pointer"
                  }}>{savingProfile ? "Saving..." : "💾 Save Profile"}</button>
                </div>
                <button onClick={onLogout} style={{
                  width:"100%",padding:"13px",background:"rgba(224,80,80,0.08)",
                  border:"1px solid rgba(224,80,80,0.25)",color:"#e05050",borderRadius:12,
                  fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.88rem",cursor:"pointer"
                }}>⏏ Sign Out</button>
              </div>
            )}
          </>
        )}
      </div>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onLogin={(session) => { saveSession(session); onLogin(session); showToast("success","✅ Welcome, "+session.name+"!"); setAuthOpen(false); }} />}
    </div>
  );
}

// ─── CART PAGE ─────────────────────────────────────────────────
function CartPage({ cart, user, showAuth, showToast, updateCartQty, removeFromCart, clearCart }) {
  const total = cart.reduce((s,i) => s+i.price*i.qty, 0);

  const checkout = async () => {
    if (!user) { showAuth(); return; }
    const lines = cart.map(i => `• ${i.name} x${i.qty} — ${formatINR(i.price*i.qty)}`).join("\n");
    const msg = `🛒 *Cart Enquiry — SAG Drone Technologies*\n\n👤 *Customer:* ${user.name}\n✉️ *Email:* ${user.email||''}\n\n*Items:*\n${lines}\n\n💰 *Total: ${formatINR(total)}*\n\nPlease confirm availability. Thank you!`;
    if (user.accessToken) {
      await sbSaveEnquiry(user.accessToken, {
        user_id: user.id, user_name: user.name, user_email: user.email || "",
        items: cart.map(i => ({ id:i.id, name:i.name, price:i.price, qty:i.qty })),
        total_amount: total, status: "enquired",
      }).catch(() => {});
    }
    window.open(`https://wa.me/919390238537?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div style={{ background:"#f5f7fa",minHeight:"100vh",paddingBottom:100,fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:"linear-gradient(135deg,#1a2b6b 0%,#2454c7 100%)",padding:"16px 16px 14px" }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.5rem",fontWeight:800,color:"#fff" }}>My Cart</div>
        <div style={{ fontSize:"0.78rem",color:"rgba(255,255,255,0.8)",marginTop:2 }}>{cart.reduce((s,i)=>s+i.qty,0)} items</div>
      </div>

      <div style={{ padding:"14px 14px" }}>
        {cart.length === 0 ? (
          <div style={{ textAlign:"center",paddingTop:40 }}>
            <div style={{ fontSize:"4rem",opacity:.3,marginBottom:12 }}>🛒</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.4rem",fontWeight:800,color:"#111827",marginBottom:6 }}>Your cart is empty</div>
            <div style={{ fontSize:"0.85rem",color:"#6b7280" }}>Add products from the store to get started</div>
          </div>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.id} style={{ display:"flex",gap:12,padding:"12px",background:"#fff",border:"1.5px solid #e8edf5",borderRadius:14,marginBottom:10,boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ width:72,height:72,borderRadius:10,overflow:"hidden",background:"#f3f4f6",flexShrink:0 }}>
                  {item.image && <img src={item.image} alt={item.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} />}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"0.84rem",fontWeight:600,color:"#111827",marginBottom:3,lineHeight:1.3 }}>{item.name}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1rem",fontWeight:800,color:"#2454c7",marginBottom:8 }}>{formatINR(item.price*item.qty)}</div>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <button onClick={() => updateCartQty(item.id, item.qty - 1)} style={{ width:28,height:28,borderRadius:"50%",border:"1.5px solid #85c9ff",background:"#eff6ff",color:"#2454c7",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem" }}>−</button>
                    <span style={{ fontSize:"0.9rem",fontWeight:700,color:"#111827",minWidth:20,textAlign:"center" }}>{item.qty}</span>
                    <button onClick={() => updateCartQty(item.id, item.qty + 1)} style={{ width:28,height:28,borderRadius:"50%",border:"1.5px solid #85c9ff",background:"#eff6ff",color:"#2454c7",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem" }}>+</button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ background:"none",border:"none",color:"#9ca3af",cursor:"pointer",fontSize:"1.1rem",alignSelf:"flex-start" }}>✕</button>
              </div>
            ))}

            <div style={{ background:"#fff",border:"1.5px solid #e8edf5",borderRadius:14,padding:"14px 16px",marginTop:8 }}>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#6b7280",marginBottom:6 }}>
                <span>Subtotal ({cart.reduce((s,i)=>s+i.qty,0)} items)</span>
                <span style={{ color:"#111827",fontWeight:600 }}>{formatINR(total)}</span>
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#6b7280",marginBottom:12 }}>
                <span>Delivery</span><span style={{ color:"#2454c7",fontWeight:600 }}>Contact for quote</span>
              </div>
              <div style={{ height:1,background:"#e8edf5",marginBottom:12 }} />
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:14 }}>
                <span style={{ fontWeight:700,fontSize:"0.9rem",color:"#111827" }}>Total</span>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.4rem",fontWeight:800,color:"#111827" }}>{formatINR(total)}</span>
              </div>
              <button onClick={checkout} style={{
                width:"100%",padding:"13px",background:"#2454c7",color:"#fff",border:"none",borderRadius:40,
                fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.93rem",cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",gap:8
              }}>💬 Enquire via WhatsApp</button>
              {cart.length > 0 && (
                <button onClick={clearCart} style={{
                  width:"100%",marginTop:8,padding:"10px",background:"none",
                  border:"1px solid #fca5a5",color:"#ef4444",borderRadius:40,
                  fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:"0.82rem",cursor:"pointer"
                }}>🗑 Clear Cart</button>
              )}
              <div style={{ fontSize:"0.73rem",color:"#6b7280",textAlign:"center",marginTop:8 }}>
                {user ? `Signed in as ${user.name}` : "Sign in to enquire"}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────
function BottomNav({ activeTab, onTabChange, cartCount }) {
  const tabs = [
    { id:"home",   icon:"🏠", label:"Home"       },
    { id:"categories", icon:"⊞", label:"Categories" },
    { id:"account",icon:"👤", label:"Account"    },
    { id:"cart",   icon:"🛒", label:"Cart",  badge: cartCount },
  ];

  return (
    <div style={{
      position:"fixed",bottom:0,left:0,right:0,zIndex:200,
      background:"#ffffff",borderTop:"1.5px solid #e8edf5",
      display:"flex",height:62,
      boxShadow:"0 -2px 12px rgba(36,84,199,0.08)"
    }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{
          flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,
          background:"none",border:"none",cursor:"pointer",padding:"6px 0",
          color: activeTab===tab.id ? "#2454c7" : "#9ca3af",
          transition:"color .2s",position:"relative"
        }}>
          <span style={{ fontSize:"1.25rem",position:"relative" }}>
            {tab.icon}
            {tab.badge > 0 && (
              <span style={{
                position:"absolute",top:-4,right:-6,background:"#ef4444",color:"#fff",
                fontSize:"0.55rem",fontWeight:800,width:14,height:14,borderRadius:"50%",
                display:"flex",alignItems:"center",justifyContent:"center"
              }}>{tab.badge > 9 ? "9+" : tab.badge}</span>
            )}
          </span>
          <span style={{ fontSize:"0.62rem",fontWeight: activeTab===tab.id ? 700 : 500,fontFamily:"'DM Sans',sans-serif" }}>{tab.label}</span>
          {activeTab===tab.id && <div style={{ position:"absolute",bottom:0,width:28,height:2.5,background:"#2454c7",borderRadius:1 }} />}
        </button>
      ))}
    </div>
  );
}

// ─── ADMIN PAGE (full portal) ─────────────────────────────────
const adminCSS = `
  .admin-layout{display:flex;min-height:100vh;}
  .admin-sidebar{width:240px;background:#101810;border-right:1px solid rgba(30,53,34,1);display:flex;flex-direction:column;position:fixed;top:0;bottom:0;left:0;z-index:50;}
  .admin-sidebar-logo{padding:20px 18px;border-bottom:1px solid rgba(30,53,34,1);display:flex;align-items:center;gap:10px;}
  .admin-sidebar-logo img{height:34px;}
  .admin-sidebar-logo span{font-family:'Barlow Condensed',sans-serif;font-size:0.9rem;font-weight:800;color:#fff;line-height:1.2;}
  .admin-nav{flex:1;padding:16px 10px;display:flex;flex-direction:column;gap:2px;overflow-y:auto;}
  .admin-nav-label{font-size:0.63rem;font-weight:800;color:#7aab8a;letter-spacing:.12em;text-transform:uppercase;padding:0 10px;margin-bottom:6px;margin-top:10px;display:block;}
  .admin-link{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;background:none;border:none;font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:500;color:#7aab8a;transition:all .2s;text-align:left;width:100%;}
  .admin-link:hover{background:#131f16;color:#e8f5ec;}
  .admin-link.active{background:rgba(46,204,113,0.16);color:#2ecc71;font-weight:700;}
  .admin-link-icon{font-size:1rem;width:20px;text-align:center;}
  .admin-link-badge{margin-left:auto;background:#1a3a22;border-radius:20px;padding:1px 8px;font-size:0.68rem;font-weight:700;color:#2ecc71;}
  .admin-sidebar-footer{padding:14px 12px;border-top:1px solid rgba(30,53,34,1);}
  .admin-user{display:flex;align-items:center;gap:10px;}
  .admin-avatar{width:32px;height:32px;border-radius:50%;background:#2ecc71;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:800;color:#0a0f0d;font-size:0.9rem;flex-shrink:0;}
  .admin-user-name{font-size:0.82rem;font-weight:600;color:#fff;}
  .admin-user-role{font-size:0.72rem;color:#7aab8a;}
  .logout-btn{margin-left:auto;background:none;border:none;color:#7aab8a;cursor:pointer;font-size:1rem;transition:color .2s;}
  .logout-btn:hover{color:#e05050;}
  .admin-main{margin-left:240px;flex:1;background:#0a0f0d;}
  .admin-topbar{display:flex;align-items:center;justify-content:space-between;padding:16px 28px;border-bottom:1px solid rgba(30,53,34,1);background:#101810;position:sticky;top:0;z-index:10;}
  .admin-topbar-title{font-family:'Barlow Condensed',sans-serif;font-size:1.2rem;font-weight:800;color:#fff;}
  .admin-topbar-right{display:flex;align-items:center;gap:10px;}
  .live-badge{display:flex;align-items:center;gap:6px;font-size:0.75rem;font-weight:700;color:#2ecc71;background:rgba(46,204,113,0.1);border:1px solid rgba(46,204,113,0.3);border-radius:20px;padding:4px 10px;}
  .live-dot{width:6px;height:6px;border-radius:50%;background:#2ecc71;animation:pulse 1.5s infinite;}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}
  .admin-content{padding:24px 28px;}
  .dash-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;}
  @media(max-width:900px){.dash-stats{grid-template-columns:repeat(2,1fr);}.admin-sidebar{width:200px;}.admin-main{margin-left:200px;}}
  .dash-stat{background:#131f16;border:1px solid rgba(30,53,34,1);border-radius:16px;padding:18px 16px;transition:all .2s;cursor:pointer;}
  .dash-stat:hover{border-color:#2ecc71;transform:translateY(-2px);}
  .dash-stat-icon{font-size:1.4rem;margin-bottom:8px;}
  .dash-stat-num{font-family:'Barlow Condensed',sans-serif;font-size:2.2rem;font-weight:800;color:#fff;line-height:1;}
  .dash-stat-label{font-size:0.78rem;color:#7aab8a;margin-top:6px;}
  .dash-stat-trend{font-size:0.72rem;margin-top:4px;color:#2ecc71;}
  .apps-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;}
  .app-card{background:#131f16;border:1px solid rgba(30,53,34,1);border-radius:13px;overflow:hidden;transition:all .2s;}
  .app-card:hover{border-color:rgba(46,204,113,0.5);}
  .app-card-visual{height:140px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#101810;}
  .app-card-visual img{width:100%;height:100%;object-fit:cover;}
  .emoji-ph{font-size:4rem;opacity:0.2;}
  .card-status-badge{position:absolute;top:8px;right:8px;border-radius:20px;padding:3px 9px;font-size:0.68rem;font-weight:700;}
  .badge-active{background:rgba(46,204,113,0.15);border:1px solid #2ecc71;color:#2ecc71;}
  .badge-inactive{background:rgba(224,80,80,0.15);border:1px solid #e05050;color:#e05050;}
  .badge-offer{position:absolute;top:8px;left:8px;background:rgba(255,149,0,0.2);border:1px solid #ff9500;color:#ff9500;border-radius:20px;padding:3px 8px;font-size:0.65rem;font-weight:700;}
  .badge-new{position:absolute;bottom:8px;left:8px;background:rgba(46,204,113,0.2);border:1px solid #2ecc71;color:#2ecc71;border-radius:20px;padding:2px 7px;font-size:0.63rem;font-weight:700;}
  .app-card-body{padding:13px 14px 14px;}
  .app-card-title{font-family:'Barlow Condensed',sans-serif;font-size:1rem;font-weight:800;color:#fff;margin-bottom:2px;line-height:1.2;}
  .app-card-cat{font-size:0.73rem;color:#7aab8a;margin-bottom:8px;}
  .app-card-actions{display:flex;gap:7px;flex-wrap:wrap;}
  .admin-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:40px;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.82rem;cursor:pointer;border:none;transition:all .2s;}
  .admin-btn.green{background:#2ecc71;color:#0a0f0d;}
  .admin-btn.green:hover{background:#27ae60;}
  .admin-btn.red{background:rgba(224,80,80,0.12);border:1px solid #e05050;color:#e05050;}
  .admin-btn.red:hover{background:rgba(224,80,80,0.25);}
  .admin-btn.blue{background:rgba(58,154,217,0.12);border:1px solid #3a9ad9;color:#3a9ad9;}
  .admin-btn.blue:hover{background:rgba(58,154,217,0.25);}
  .admin-btn.orange{background:rgba(255,149,0,0.12);border:1px solid #ff9500;color:#ff9500;}
  .admin-btn.sm{padding:5px 11px;font-size:0.75rem;}
  .modal-overlay{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.88);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;}
  .modal-box{background:#131f16;border:1px solid rgba(46,204,113,0.25);border-radius:18px;padding:26px;width:100%;max-width:500px;position:relative;max-height:90vh;overflow-y:auto;}
  .modal-box::-webkit-scrollbar{width:4px;}.modal-box::-webkit-scrollbar-track{background:transparent;}.modal-box::-webkit-scrollbar-thumb{background:rgba(46,204,113,0.3);border-radius:2px;}
  .modal-title{font-family:'Barlow Condensed',sans-serif;font-size:1.35rem;font-weight:800;color:#fff;margin-bottom:20px;}
  .modal-field{margin-bottom:13px;}
  .modal-field label{font-size:0.7rem;color:#7aab8a;font-weight:700;letter-spacing:.08em;text-transform:uppercase;display:block;margin-bottom:5px;}
  .modal-field input,.modal-field textarea,.modal-field select{width:100%;padding:10px 13px;background:#0a0f0d;border:1.5px solid rgba(46,204,113,0.2);border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:0.88rem;outline:none;box-sizing:border-box;transition:border-color .2s;}
  .modal-field input:focus,.modal-field textarea:focus,.modal-field select:focus{border-color:rgba(46,204,113,0.5);}
  .modal-field textarea{min-height:70px;resize:vertical;}
  .modal-field select option{background:#0a0f0d;}
  .section-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
  .section-hdr h3{font-family:'Barlow Condensed',sans-serif;font-size:1.3rem;font-weight:800;color:#fff;margin:0;}
  .admin-table{width:100%;border-collapse:collapse;font-size:0.83rem;}
  .admin-table th{text-align:left;padding:10px 14px;font-size:0.68rem;font-weight:800;color:#7aab8a;letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid rgba(30,53,34,1);}
  .admin-table td{padding:12px 14px;border-bottom:1px solid rgba(30,53,34,0.6);color:#e8f5ec;vertical-align:middle;}
  .admin-table tr:hover td{background:rgba(46,204,113,0.04);}
  .admin-table tr:last-child td{border-bottom:none;}
  .user-avatar-sm{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#1a4d2e,#2ecc71);display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:800;color:#fff;font-size:0.82rem;flex-shrink:0;}
  .banner-preview{height:54px;border-radius:10px;display:flex;align-items:center;padding:0 14px;gap:10px;min-width:180px;}
  .banner-emoji{font-size:1.5rem;}
  .banner-info .banner-title{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:0.88rem;color:#fff;}
  .banner-info .banner-sub{font-size:0.7rem;color:rgba(255,255,255,0.75);margin-top:1px;}
  .offer-tag{display:inline-flex;align-items:center;gap:4px;background:rgba(255,149,0,0.15);border:1px solid rgba(255,149,0,0.4);color:#ff9500;border-radius:20px;padding:3px 9px;font-size:0.73rem;font-weight:700;}
  .search-bar{display:flex;align-items:center;gap:10px;background:#131f16;border:1px solid rgba(46,204,113,0.15);border-radius:12px;padding:9px 14px;margin-bottom:18px;}
  .search-bar input{background:none;border:none;outline:none;color:#fff;font-family:'DM Sans',sans-serif;font-size:0.88rem;flex:1;}
  .search-bar input::placeholder{color:#7aab8a;}
  .filter-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;}
  .chip{padding:5px 13px;border-radius:20px;font-size:0.78rem;font-weight:600;cursor:pointer;border:1px solid rgba(46,204,113,0.2);background:transparent;color:#7aab8a;font-family:'DM Sans',sans-serif;transition:all .2s;}
  .chip.active{background:rgba(46,204,113,0.15);border-color:#2ecc71;color:#2ecc71;}
  .chip:hover{border-color:#2ecc71;color:#e8f5ec;}
  .empty-state{text-align:center;padding:48px 20px;color:#7aab8a;}
  .empty-state .es-icon{font-size:3rem;margin-bottom:12px;}
  .empty-state .es-title{font-family:'Barlow Condensed',sans-serif;font-size:1.2rem;font-weight:800;color:#fff;margin-bottom:6px;}
  .card-table{background:#131f16;border:1px solid rgba(30,53,34,1);border-radius:14px;overflow:hidden;}
  .gradient-preview{height:32px;border-radius:6px;margin-top:6px;}
  .tab-pills{display:flex;background:#101810;border-radius:40px;padding:3px;margin-bottom:20px;width:fit-content;}
  .tab-pill{padding:7px 18px;border-radius:40px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:0.82rem;font-weight:600;transition:all .2s;color:#7aab8a;background:transparent;}
  .tab-pill.active{background:rgba(46,204,113,0.2);color:#2ecc71;}
`;

// ─── ADMIN SUPABASE HELPERS ────────────────────────────────────
async function sbUpsertProduct(product, accessToken) {
  const payload = {
    name: product.name, price: Number(product.price),
    original_price: Number(product.originalPrice)||null,
    image: product.image, is_new: !!product.isNew, is_offer: !!product.isOffer,
    status: product.status, category: product.category, wa_num: product.waNum||"919390238537",
    updated_at: new Date().toISOString(),
  };
  if (product.id && typeof product.id === "number" && product.id < 1e12) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${product.id}`, {
      method: "PATCH",
      headers: { ...sbHeaders, Authorization: `Bearer ${accessToken||SUPABASE_KEY}`, Prefer: "return=representation" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Update failed");
    return res.json();
  } else {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: "POST",
      headers: { ...sbHeaders, Authorization: `Bearer ${accessToken||SUPABASE_KEY}`, Prefer: "return=representation" },
      body: JSON.stringify({ ...payload, created_at: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error("Insert failed");
    return res.json();
  }
}

async function sbDeleteProduct(id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
    method: "DELETE",
    headers: { ...sbHeaders },
  });
  if (!res.ok) throw new Error("Delete failed");
}

async function sbGetBanners() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/banners?order=sort_order.asc&select=*`, { headers: sbHeaders });
  if (!res.ok) return null;
  return res.json();
}
async function sbUpsertBanner(banner) {
  const payload = { title:banner.title, subtitle:banner.subtitle, badge:banner.badge, bg:banner.bg, emoji:banner.emoji, cta:banner.cta, sort_order:banner.sort_order||0, active:banner.active!==false };
  if (banner.db_id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/banners?id=eq.${banner.db_id}`, {
      method:"PATCH", headers:{...sbHeaders,Prefer:"return=representation"}, body:JSON.stringify({...payload,updated_at:new Date().toISOString()}),
    });
    return res.ok ? res.json() : null;
  } else {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/banners`, {
      method:"POST", headers:{...sbHeaders,Prefer:"return=representation"}, body:JSON.stringify({...payload,created_at:new Date().toISOString()}),
    });
    return res.ok ? res.json() : null;
  }
}
async function sbDeleteBanner(id) {
  await fetch(`${SUPABASE_URL}/rest/v1/banners?id=eq.${id}`, { method:"DELETE", headers:sbHeaders });
}

// ─── ADMIN: BANNER SECTION ─────────────────────────────────────
function AdminBanners({ showToast }) {
  const [banners, setBanners] = useState(DEFAULT_BANNERS.map((b,i) => ({...b, sort_order:i, active:true})));
  const [editIdx, setEditIdx] = useState(null);
  const [loading, setLoading] = useState(false);
  const emptyForm = { title:"", subtitle:"", badge:"", bg:"linear-gradient(135deg,#0d3a8e 0%,#1a56cc 60%,#0d3a8e 100%)", emoji:"🚁", cta:"Shop Now", active:true };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    sbGetBanners().then(rows => {
      if (rows && rows.length) setBanners(rows.map(r => ({ id:r.id, db_id:r.id, title:r.title, subtitle:r.subtitle, badge:r.badge, bg:r.bg, emoji:r.emoji, cta:r.cta, active:r.active!==false, sort_order:r.sort_order||0 })));
    }).catch(()=>{});
  }, []);

  const openEdit = (i) => { setEditIdx(i); setForm(i===-1 ? emptyForm : {...banners[i]}); };

  const saveForm = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      if (editIdx === -1) {
        const newB = { ...form, sort_order: banners.length };
        const rows = await sbUpsertBanner(newB);
        const saved = rows && rows[0] ? { ...newB, db_id: rows[0].id, id: rows[0].id } : { ...newB, id: Date.now() };
        setBanners(b => [...b, saved]);
        showToast("success", "✅ Banner added!");
      } else {
        const updated = { ...banners[editIdx], ...form };
        await sbUpsertBanner(updated);
        setBanners(b => b.map((x,i) => i===editIdx ? updated : x));
        showToast("success", "✅ Banner updated!");
      }
    } catch { showToast("error", "Failed to save banner"); }
    setLoading(false); setEditIdx(null);
  };

  const deleteBanner = async (i) => {
    if (!confirm(`Delete "${banners[i].title}"?`)) return;
    const b = banners[i];
    if (b.db_id) { try { await sbDeleteBanner(b.db_id); } catch {} }
    setBanners(arr => arr.filter((_,x)=>x!==i));
    showToast("success","Banner deleted.");
  };

  const toggleActive = async (i) => {
    const updated = { ...banners[i], active: !banners[i].active };
    setBanners(b => b.map((x,j)=>j===i?updated:x));
    if (updated.db_id) { try { await sbUpsertBanner(updated); } catch {} }
  };

  if (editIdx !== null) return (
    <div>
      <button onClick={()=>setEditIdx(null)} style={{ display:"flex",alignItems:"center",gap:6,background:"none",border:"none",color:"#7aab8a",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"0.85rem",marginBottom:20,padding:0 }}>← Back to Banners</button>
      <div style={{ background:"#131f16",border:"1px solid rgba(46,204,113,0.2)",borderRadius:16,padding:24,maxWidth:560 }}>
        <div className="modal-title">{editIdx===-1?"Add Banner":"Edit Banner"}</div>
        {[["Title","title","text","e.g. SALE IS LIVE"],["Subtitle","subtitle","text","e.g. Up to 20% off on Drones"],["Badge","badge","text","e.g. LIMITED TIME"],["Emoji","emoji","text","e.g. 🚁"],["CTA Button","cta","text","e.g. Shop Now"]].map(([lbl,key,type,ph])=>(
          <div key={key} className="modal-field"><label>{lbl}</label><input type={type} placeholder={ph} value={form[key]||""} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} /></div>
        ))}
        <div className="modal-field">
          <label>Background CSS Gradient</label>
          <input value={form.bg} onChange={e=>setForm(f=>({...f,bg:e.target.value}))} placeholder="linear-gradient(135deg,#0d3a8e 0%,...)" style={{ fontFamily:"monospace",fontSize:"0.8rem" }} />
          <div className="gradient-preview" style={{ background:form.bg }} />
        </div>
        <div style={{ display:"flex",gap:10,marginTop:20 }}>
          <button className="admin-btn green" onClick={saveForm} style={{ flex:1,justifyContent:"center" }} disabled={loading}>{loading?"Saving…":"Save Banner"}</button>
          <button className="admin-btn" onClick={()=>setEditIdx(null)} style={{ flex:1,justifyContent:"center",background:"rgba(255,255,255,0.05)",color:"#e8f5ec",border:"1px solid rgba(255,255,255,0.1)" }}>Cancel</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="section-hdr">
        <h3>🖼 Banners ({banners.length})</h3>
        <button className="admin-btn green" onClick={()=>openEdit(-1)}>+ Add Banner</button>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        {banners.map((b,i) => (
          <div key={b.id||i} style={{ background:"#131f16",border:"1px solid rgba(30,53,34,1)",borderRadius:14,padding:"14px 18px",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap" }}>
            <div className="banner-preview" style={{ background:b.bg }}>
              <span className="banner-emoji">{b.emoji}</span>
              <div className="banner-info">
                <div className="banner-title">{b.title}</div>
                <div className="banner-sub">{b.subtitle}</div>
              </div>
            </div>
            <div style={{ flex:1,minWidth:120 }}>
              <div style={{ fontSize:"0.8rem",color:"#7aab8a",marginBottom:4 }}>Badge: <span style={{ color:"#fff" }}>{b.badge}</span></div>
              <div style={{ fontSize:"0.8rem",color:"#7aab8a" }}>CTA: <span style={{ color:"#2ecc71" }}>{b.cta}</span></div>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <label style={{ display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:"0.78rem",color:b.active?"#2ecc71":"#7aab8a" }}>
                <input type="checkbox" checked={!!b.active} onChange={()=>toggleActive(i)} style={{ accentColor:"#2ecc71" }} /> {b.active?"Live":"Hidden"}
              </label>
              <button className="admin-btn blue sm" onClick={()=>openEdit(i)}>✏️ Edit</button>
              <button className="admin-btn red sm" onClick={()=>deleteBanner(i)}>🗑️</button>
            </div>
          </div>
        ))}
        {banners.length===0 && <div className="empty-state"><div className="es-icon">🖼</div><div className="es-title">No Banners Yet</div><p>Add your first banner to showcase on the home page.</p></div>}
      </div>
    </div>
  );
}

// ─── ADMIN: OFFERS SECTION ─────────────────────────────────────
function AdminOffers({ products, setProducts, showToast }) {
  const offers = products.filter(p=>p.isOffer);
  const nonOffers = products.filter(p=>!p.isOffer);

  const toggleOffer = async (p) => {
    const updated = { ...p, isOffer: !p.isOffer };
    setProducts(prev => prev.map(x=>x.id===p.id?updated:x));
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${p.id}`, {
        method:"PATCH", headers:{...sbHeaders,Prefer:"return=representation"}, body:JSON.stringify({ is_offer:updated.isOffer, updated_at:new Date().toISOString() })
      });
      showToast(res.ok?"success":"error", res.ok?(updated.isOffer?"✅ Added to offers!":"Removed from offers."):"Failed to update.");
    } catch { showToast("error","Network error."); }
  };

  return (
    <div>
      <div className="section-hdr">
        <h3>🏷️ Offers Management</h3>
        <span style={{ fontSize:"0.83rem",color:"#7aab8a" }}>{offers.length} active offer{offers.length!==1?"s":""}</span>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }}>
        <div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1rem",fontWeight:800,color:"#2ecc71",marginBottom:12 }}>🏷️ On Offer ({offers.length})</div>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {offers.map(p=>(
              <div key={p.id} style={{ background:"#131f16",border:"1px solid rgba(255,149,0,0.25)",borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:44,height:44,borderRadius:8,overflow:"hidden",background:"#101810",flexShrink:0 }}>{p.image&&<img src={p.image} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />}</div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontSize:"0.83rem",fontWeight:700,color:"#fff",lineHeight:1.3,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.name}</div>
                  <div style={{ fontSize:"0.78rem",color:"#2ecc71",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700 }}>{formatINR(p.price)} {p.originalPrice&&<span style={{ color:"#7aab8a",textDecoration:"line-through",fontWeight:400,fontSize:"0.75rem" }}>{formatINR(p.originalPrice)}</span>}</div>
                  {p.originalPrice && <div style={{ fontSize:"0.7rem",color:"#ff9500",marginTop:1 }}>{discount(p.price,p.originalPrice)}% off</div>}
                </div>
                <button className="admin-btn red sm" onClick={()=>toggleOffer(p)}>Remove</button>
              </div>
            ))}
            {offers.length===0 && <div style={{ color:"#7aab8a",fontSize:"0.83rem",padding:14,textAlign:"center" }}>No offers active</div>}
          </div>
        </div>
        <div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1rem",fontWeight:800,color:"#7aab8a",marginBottom:12 }}>📦 Not on Offer ({nonOffers.length})</div>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {nonOffers.map(p=>(
              <div key={p.id} style={{ background:"#131f16",border:"1px solid rgba(30,53,34,1)",borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:44,height:44,borderRadius:8,overflow:"hidden",background:"#101810",flexShrink:0 }}>{p.image&&<img src={p.image} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />}</div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontSize:"0.83rem",fontWeight:700,color:"#fff",lineHeight:1.3,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.name}</div>
                  <div style={{ fontSize:"0.78rem",color:"#2ecc71",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700 }}>{formatINR(p.price)}</div>
                </div>
                <button className="admin-btn orange sm" onClick={()=>toggleOffer(p)}>+ Offer</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN: USERS SECTION ──────────────────────────────────────
function AdminUsers({ showToast }) {
  const [users, setUsers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("users");
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([sbGetAllProfiles(), sbGetAllEnquiries()]).then(([profiles, enqs]) => {
      setUsers(profiles||[]); setEnquiries(enqs||[]); setLoading(false);
    }).catch(()=>setLoading(false));
  }, []);

  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase();
    return !q || (u.full_name||"").toLowerCase().includes(q) || (u.email||"").toLowerCase().includes(q);
  });

  const filteredEnqs = enquiries.filter(e => {
    const q = search.toLowerCase();
    return !q || (e.message||"").toLowerCase().includes(q) || (e.user_id||"").includes(q);
  });

  return (
    <div>
      <div className="section-hdr">
        <h3>👥 User Management</h3>
        <span style={{ fontSize:"0.83rem",color:"#7aab8a" }}>{users.length} registered user{users.length!==1?"s":""}</span>
      </div>
      <div className="tab-pills">
        {[["users",`👤 Users (${users.length})`],["enquiries",`💬 Enquiries (${enquiries.length})`]].map(([id,lbl])=>(
          <button key={id} className={`tab-pill${tab===id?" active":""}`} onClick={()=>setTab(id)}>{lbl}</button>
        ))}
      </div>
      <div className="search-bar">
        <span style={{ color:"#7aab8a" }}>🔍</span>
        <input placeholder={tab==="users"?"Search by name or email…":"Search enquiries…"} value={search} onChange={e=>setSearch(e.target.value)} />
        {search && <button onClick={()=>setSearch("")} style={{ background:"none",border:"none",color:"#7aab8a",cursor:"pointer",fontSize:"1rem" }}>✕</button>}
      </div>
      {loading ? (
        <div style={{ textAlign:"center",padding:"40px 0",color:"#7aab8a" }}>Loading…</div>
      ) : tab==="users" ? (
        <div className="card-table">
          <table className="admin-table">
            <thead><tr><th>User</th><th>Email</th><th>Phone</th><th>Joined</th><th>Enquiries</th></tr></thead>
            <tbody>
              {filteredUsers.map(u => {
                const userEnqs = enquiries.filter(e=>e.user_id===u.id).length;
                const initials = (u.full_name||u.email||"U").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
                return (
                  <tr key={u.id}>
                    <td><div style={{ display:"flex",alignItems:"center",gap:10 }}><div className="user-avatar-sm">{initials}</div><div style={{ fontWeight:600,color:"#fff",fontSize:"0.85rem" }}>{u.full_name||"—"}</div></div></td>
                    <td style={{ color:"#7aab8a",fontSize:"0.82rem" }}>{u.email||"—"}</td>
                    <td style={{ color:"#7aab8a",fontSize:"0.82rem" }}>{u.phone||"—"}</td>
                    <td style={{ color:"#7aab8a",fontSize:"0.78rem" }}>{u.created_at?new Date(u.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"—"}</td>
                    <td><span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:userEnqs>0?"#2ecc71":"#7aab8a",fontSize:"1rem" }}>{userEnqs}</span></td>
                  </tr>
                );
              })}
              {filteredUsers.length===0 && <tr><td colSpan={5}><div className="empty-state"><div className="es-icon">👤</div><div className="es-title">No users found</div></div></td></tr>}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card-table">
          <table className="admin-table">
            <thead><tr><th>User</th><th>Message / Items</th><th>Total</th><th>Date</th></tr></thead>
            <tbody>
              {filteredEnqs.map((e,i) => {
                const user = users.find(u=>u.id===e.user_id);
                const name = user ? (user.full_name||user.email||"User") : e.user_id?.slice(0,8)+"…";
                const initials = name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
                let items = null;
                try { items = typeof e.items==="string" ? JSON.parse(e.items) : e.items; } catch {}
                return (
                  <tr key={e.id||i}>
                    <td><div style={{ display:"flex",alignItems:"center",gap:10 }}><div className="user-avatar-sm" style={{ background:"linear-gradient(135deg,#1a3d8e,#3a9ad9)" }}>{initials}</div><div style={{ fontWeight:600,color:"#fff",fontSize:"0.85rem" }}>{name}</div></div></td>
                    <td style={{ maxWidth:280 }}>
                      {items && Array.isArray(items) ? (
                        <div style={{ fontSize:"0.78rem",color:"#7aab8a" }}>{items.map(it=>`${it.name} ×${it.qty}`).join(", ")}</div>
                      ) : (
                        <div style={{ fontSize:"0.78rem",color:"#7aab8a",whiteSpace:"pre-wrap" }}>{e.message||"—"}</div>
                      )}
                    </td>
                    <td style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:"#2ecc71",fontSize:"1rem" }}>{e.total ? formatINR(e.total) : "—"}</td>
                    <td style={{ color:"#7aab8a",fontSize:"0.78rem" }}>{e.created_at?new Date(e.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"—"}</td>
                  </tr>
                );
              })}
              {filteredEnqs.length===0 && <tr><td colSpan={4}><div className="empty-state"><div className="es-icon">💬</div><div className="es-title">No enquiries yet</div></div></td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── ADMIN: PRODUCTS SECTION ───────────────────────────────────
function AdminProducts({ products, setProducts, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [saving, setSaving] = useState(false);

  const cats = ["All","Drones","Batteries","Flight Controller","Accessories"];
  const statuses = ["All","In Stock","Out of Stock"];

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    if (q && !p.name.toLowerCase().includes(q) && !(p.category||"").toLowerCase().includes(q)) return false;
    if (filterCat!=="All" && p.category!==filterCat) return false;
    if (filterStatus==="In Stock" && p.status==="outofstock") return false;
    if (filterStatus==="Out of Stock" && p.status!=="outofstock") return false;
    return true;
  });

  const handleSave = async (p) => {
    setSaving(true);
    try {
      const rows = await sbUpsertProduct(p);
      const saved = rows && rows[0] ? { ...p, id: rows[0].id } : p;
      const idx = products.findIndex(x=>x.id===p.id);
      if (idx!==-1) { const n=[...products]; n[idx]=saved; setProducts(n); }
      else setProducts(prev=>[...prev, saved]);
      showToast("success","✅ Product saved to database!");
      setShowModal(false);
    } catch (e) {
      showToast("error","Failed to save: "+e.message);
    }
    setSaving(false);
  };

  const handleDelete = async (p) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    try {
      await sbDeleteProduct(p.id);
      setProducts(a=>a.filter(x=>x.id!==p.id));
      showToast("success","🗑️ Deleted.");
    } catch { showToast("error","Delete failed."); }
  };

  const toggleStatus = async (p) => {
    const updated = { ...p, status: p.status==="outofstock"?"instock":"outofstock" };
    setProducts(prev=>prev.map(x=>x.id===p.id?updated:x));
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${p.id}`, {
        method:"PATCH", headers:{...sbHeaders,Prefer:"return=representation"}, body:JSON.stringify({ status:updated.status, updated_at:new Date().toISOString() })
      });
      showToast("success", updated.status==="instock"?"Marked In Stock":"Marked Out of Stock");
    } catch { showToast("error","Failed to update status."); }
  };

  return (
    <div>
      <div className="section-hdr">
        <h3>🛒 Products ({products.length})</h3>
        <button className="admin-btn green" onClick={()=>{setEditProduct(null);setShowModal(true);}}>+ Add Product</button>
      </div>
      <div className="search-bar">
        <span style={{ color:"#7aab8a" }}>🔍</span>
        <input placeholder="Search products…" value={search} onChange={e=>setSearch(e.target.value)} />
        {search && <button onClick={()=>setSearch("")} style={{ background:"none",border:"none",color:"#7aab8a",cursor:"pointer",fontSize:"1rem" }}>✕</button>}
      </div>
      <div className="filter-chips">
        {cats.map(c=><button key={c} className={`chip${filterCat===c?" active":""}`} onClick={()=>setFilterCat(c)}>{c}</button>)}
        <div style={{ width:1,background:"rgba(46,204,113,0.2)",margin:"0 4px" }} />
        {statuses.map(s=><button key={s} className={`chip${filterStatus===s?" active":""}`} onClick={()=>setFilterStatus(s)}>{s}</button>)}
      </div>
      {filtered.length===0 ? (
        <div className="empty-state"><div className="es-icon">📦</div><div className="es-title">No products found</div><p>Try changing your filters.</p></div>
      ) : (
        <div className="apps-grid">
          {filtered.map(p => (
            <div key={p.id} className="app-card">
              <div className="app-card-visual">
                {p.image?<img src={p.image} alt={p.name} />:<div className="emoji-ph">📦</div>}
                <span className={`card-status-badge ${p.status!=="outofstock"?"badge-active":"badge-inactive"}`}>{p.status!=="outofstock"?"In Stock":"Out of Stock"}</span>
                {p.isOffer && <span className="badge-offer">🏷️ Offer</span>}
                {p.isNew && <span className="badge-new">✨ New</span>}
              </div>
              <div className="app-card-body">
                <div className="app-card-title">{p.name}</div>
                <div className="app-card-cat">{p.category}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:"1.1rem",color:"#2ecc71",marginBottom:4 }}>{formatINR(p.price)}</div>
                {p.originalPrice && <div style={{ fontSize:"0.75rem",color:"#7aab8a",marginBottom:10 }}>MRP: <span style={{ textDecoration:"line-through" }}>{formatINR(p.originalPrice)}</span> <span style={{ color:"#ff9500" }}>({discount(p.price,p.originalPrice)}% off)</span></div>}
                <div className="app-card-actions">
                  <button className="admin-btn blue sm" onClick={()=>{setEditProduct(p);setShowModal(true);}}>✏️ Edit</button>
                  <button className="admin-btn sm" onClick={()=>toggleStatus(p)} style={{ background:"rgba(46,204,113,0.08)",border:"1px solid rgba(46,204,113,0.3)",color:"#2ecc71" }}>{p.status==="outofstock"?"✅":"⛔"}</button>
                  <button className="admin-btn red sm" onClick={()=>handleDelete(p)}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && <ProductFormModal product={editProduct} saving={saving} onSave={handleSave} onClose={()=>setShowModal(false)} />}
    </div>
  );
}

// ─── ADMIN: DASHBOARD ──────────────────────────────────────────
function AdminDashboard({ products, users, enquiries, setAdminPage }) {
  const inStock = products.filter(p=>p.status!=="outofstock").length;
  const outStock = products.filter(p=>p.status==="outofstock").length;
  const offers = products.filter(p=>p.isOffer).length;
  const newArrivals = products.filter(p=>p.isNew).length;

  const stats = [
    { icon:"📦", label:"Total Products", val:products.length, page:"products", trend:"Manage inventory" },
    { icon:"✅", label:"In Stock", val:inStock, page:"products", trend:`${outStock} out of stock` },
    { icon:"🏷️", label:"Active Offers", val:offers, page:"offers", trend:`${newArrivals} new arrivals` },
    { icon:"👥", label:"Registered Users", val:users, page:"users", trend:"View all users" },
    { icon:"💬", label:"Total Enquiries", val:enquiries, page:"users", trend:"View enquiries" },
    { icon:"🖼", label:"Banners", val:"—", page:"banners", trend:"Manage home banners" },
  ];

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.6rem",fontWeight:800,color:"#fff",marginBottom:4 }}>Welcome back, Admin 👋</div>
        <div style={{ fontSize:"0.85rem",color:"#7aab8a" }}>Here's a snapshot of SAG Drone Technologies.</div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:28 }}>
        {stats.map(s=>(
          <div key={s.label} className="dash-stat" onClick={()=>setAdminPage(s.page)}>
            <div className="dash-stat-icon">{s.icon}</div>
            <div className="dash-stat-num">{s.val}</div>
            <div className="dash-stat-label">{s.label}</div>
            <div className="dash-stat-trend">{s.trend}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
        <div style={{ background:"#131f16",border:"1px solid rgba(30,53,34,1)",borderRadius:14,padding:"18px 20px" }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1rem",fontWeight:800,color:"#fff",marginBottom:14 }}>📊 Inventory by Category</div>
          {["Drones","Batteries","Flight Controller","Accessories"].map(cat => {
            const cnt = products.filter(p=>p.category===cat).length;
            const pct = products.length ? Math.round(cnt/products.length*100) : 0;
            return (
              <div key={cat} style={{ marginBottom:12 }}>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:"0.8rem",color:"#7aab8a",marginBottom:4 }}>
                  <span>{cat}</span><span style={{ color:"#fff",fontWeight:600 }}>{cnt}</span>
                </div>
                <div style={{ height:6,background:"rgba(46,204,113,0.1)",borderRadius:3,overflow:"hidden" }}>
                  <div style={{ height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#1a9c52,#2ecc71)",borderRadius:3,transition:"width .6s" }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ background:"#131f16",border:"1px solid rgba(30,53,34,1)",borderRadius:14,padding:"18px 20px" }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1rem",fontWeight:800,color:"#fff",marginBottom:14 }}>⚡ Quick Actions</div>
          {[["+ Add Product","products","green"],["🏷️ Manage Offers","offers","orange"],["🖼 Edit Banners","banners","blue"],["👥 View Users","users",""]].map(([lbl,page,cls])=>(
            <button key={page} className={`admin-btn ${cls} sm`} onClick={()=>setAdminPage(page)} style={{ width:"100%",justifyContent:"center",marginBottom:8,padding:"11px" }}>{lbl}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PAGE ROOT ───────────────────────────────────────────
function AdminPage({ autoAuthed = false }) {
  const [authed, setAuthed] = useState(() => autoAuthed || sessionStorage.getItem("sag_admin") === "1");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [adminPage, setAdminPage] = useState("dashboard");
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [users, setUsers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [toast, setToast] = useState({ show:false,type:"success",msg:"" });

  const showToast = (type, msg) => { setToast({show:true,type,msg}); setTimeout(()=>setToast(t=>({...t,show:false})),3200); };

  useEffect(() => {
    if (!authed) return;
    fetch(`${SUPABASE_URL}/rest/v1/products?order=created_at.asc&select=*`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    }).then(r=>r.ok?r.json():null)
      .then(rows => { if (rows&&rows.length) setProducts(rows.map(r => ({ id:r.id,name:r.name,price:r.price,originalPrice:r.original_price,image:r.image,isNew:r.is_new,isOffer:r.is_offer,status:r.status,category:r.category,waNum:r.wa_num||"919390238537" }))); })
      .catch(()=>{});
    Promise.all([sbGetAllProfiles(), sbGetAllEnquiries()]).then(([p,e])=>{ setUsers(p||[]); setEnquiries(e||[]); }).catch(()=>{});
  }, [authed]);

  if (!authed) return (
    <div style={{ minHeight:"100vh",background:"#0a0f0d",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div style={{ background:"#131f16",border:"1px solid rgba(46,204,113,0.2)",borderRadius:20,padding:"36px 28px",width:"100%",maxWidth:380,textAlign:"center" }}>
        <img src={LOGO} alt="SAG" style={{ height:44,marginBottom:16,borderRadius:8 }} />
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.8rem",fontWeight:800,color:"#fff",marginBottom:6 }}>Admin Portal</div>
        <div style={{ fontSize:"0.82rem",color:"#7aab8a",marginBottom:28 }}>SAG Drone Technologies</div>
        <input type="password" placeholder="Enter admin password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}}
          onKeyDown={e=>e.key==="Enter"&&(pw==="sag@admin2025"?(sessionStorage.setItem("sag_admin","1"),setAuthed(true)):setErr("Incorrect password. Please try again."))}
          style={{ width:"100%",padding:"13px 16px",background:"#0a0f0d",border:"1.5px solid rgba(46,204,113,0.2)",borderRadius:12,color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:"0.92rem",outline:"none",boxSizing:"border-box",marginBottom:10,letterSpacing:4 }} />
        {err && <div style={{ color:"#e05050",fontSize:"0.82rem",marginBottom:10 }}>{err}</div>}
        <button onClick={()=>pw==="sag@admin2025"?(sessionStorage.setItem("sag_admin","1"),setAuthed(true)):setErr("Incorrect password. Please try again.")}
          style={{ width:"100%",padding:"13px",background:"#2ecc71",color:"#0a0f0d",border:"none",borderRadius:40,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.95rem",cursor:"pointer" }}>
          Enter Admin Portal →
        </button>
      </div>
    </div>
  );

  const pageTitle = { dashboard:"Dashboard", products:"Products", offers:"Offers", banners:"Banners", users:"Users" };
  const navItems = [
    { group:"Overview", items:[["dashboard","📊","Dashboard"]] },
    { group:"Catalog", items:[["products","🛒","Products"],["offers","🏷️","Offers"]] },
    { group:"Content", items:[["banners","🖼","Banners"]] },
    { group:"CRM", items:[["users","👥","Users"]] },
  ];

  return (
    <div className="admin-layout">
      <style>{adminCSS}</style>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <img src={LOGO} alt="SAG" />
          <span>SAG Admin<br /><span style={{ fontSize:"0.68rem",color:"#7aab8a",fontFamily:"'DM Sans',sans-serif",fontWeight:400 }}>Control Panel</span></span>
        </div>
        <nav className="admin-nav">
          {navItems.map(({ group, items }) => (
            <div key={group}>
              <span className="admin-nav-label">{group}</span>
              {items.map(([page,icon,label]) => (
                <button key={page} className={`admin-link${adminPage===page?" active":""}`} onClick={()=>setAdminPage(page)}>
                  <span className="admin-link-icon">{icon}</span>{label}
                  {page==="offers" && <span className="admin-link-badge">{products.filter(p=>p.isOffer).length}</span>}
                  {page==="users" && <span className="admin-link-badge">{users.length}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <div className="admin-avatar">A</div>
            <div><div className="admin-user-name">Admin</div><div className="admin-user-role">Super Admin</div></div>
            <button className="logout-btn" title="Sign out" onClick={()=>{sessionStorage.removeItem("sag_admin");setAuthed(false);}}>⏏</button>
          </div>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-title">{pageTitle[adminPage]||"Admin"}</div>
          <div className="admin-topbar-right">
            <div style={{ fontSize:"0.75rem",color:"#7aab8a" }}>{new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})}</div>
            <div className="live-badge"><div className="live-dot" />LIVE</div>
          </div>
        </div>
        <div className="admin-content">
          {adminPage==="dashboard" && <AdminDashboard products={products} users={users.length} enquiries={enquiries.length} setAdminPage={setAdminPage} />}
          {adminPage==="products" && <AdminProducts products={products} setProducts={setProducts} showToast={showToast} />}
          {adminPage==="offers" && <AdminOffers products={products} setProducts={setProducts} showToast={showToast} />}
          {adminPage==="banners" && <AdminBanners showToast={showToast} />}
          {adminPage==="users" && <AdminUsers showToast={showToast} />}
        </div>
      </main>
      <div style={{ position:"fixed",bottom:24,right:24,zIndex:99999,background:toast.type==="success"?"#1a4a2a":"#4a1a1a",border:`1px solid ${toast.type==="success"?"#2ecc71":"#e05050"}`,borderRadius:12,padding:"11px 20px",color:"#fff",fontSize:"0.85rem",fontFamily:"'DM Sans',sans-serif",transition:"all .35s",transform:toast.show?"translateY(0)":"translateY(20px)",opacity:toast.show?1:0,pointerEvents:toast.show?"all":"none",boxShadow:"0 10px 30px rgba(0,0,0,0.5)" }}>{toast.msg}</div>
    </div>
  );
}

function ProductFormModal({ product, onSave, onClose, saving }) {
  const [form, setForm] = useState(product || { name:"",price:"",originalPrice:"",image:"",category:"Drones",status:"instock",isNew:false,isOffer:false,waNum:"919390238537" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box">
        <div className="modal-title">{product?"Edit Product":"Add Product"}</div>
        {[["Product Name","name","text","e.g. SAG Agri Drone 10L"],["Price (₹)","price","number","e.g. 750000"],["Original Price (₹)","originalPrice","number","e.g. 900000"],["Image URL","image","text","https://..."],["WhatsApp Number","waNum","text","919390238537"]].map(([label,key,type,ph]) => (
          <div key={key} className="modal-field">
            <label>{label}</label>
            <input type={type} placeholder={ph} value={form[key]||""} onChange={e=>set(key,e.target.value)} />
          </div>
        ))}
        <div className="modal-field">
          <label>Category</label>
          <select value={form.category} onChange={e=>set("category",e.target.value)}>
            {["Drones","Batteries","Flight Controller","Accessories"].map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="modal-field">
          <label>Status</label>
          <select value={form.status} onChange={e=>set("status",e.target.value)}>
            <option value="instock">In Stock</option><option value="outofstock">Out of Stock</option>
          </select>
        </div>
        <div style={{ display:"flex",gap:16,marginBottom:18 }}>
          {[["isNew","New Arrival"],["isOffer","On Offer"]].map(([k,l]) => (
            <label key={k} style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer",color:"#7aab8a",fontSize:"0.85rem" }}>
              <input type="checkbox" checked={form[k]||false} onChange={e=>set(k,e.target.checked)} style={{ accentColor:"#2ecc71" }} />{l}
            </label>
          ))}
        </div>
        <div style={{ display:"flex",gap:10 }}>
          <button onClick={()=>onSave({...form,price:Number(form.price),originalPrice:Number(form.originalPrice)||null})} disabled={saving} style={{ flex:1,padding:"12px",background:"#2ecc71",color:"#0a0f0d",border:"none",borderRadius:40,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.9rem",cursor:saving?"wait":"pointer",opacity:saving?0.7:1 }}>{saving?"Saving…":"Save Product"}</button>
          <button onClick={onClose} style={{ flex:1,padding:"12px",background:"rgba(255,255,255,0.05)",color:"#e8f5ec",border:"1px solid rgba(255,255,255,0.1)",borderRadius:40,fontFamily:"'DM Sans',sans-serif",fontWeight:600,cursor:"pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("home");
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(() => loadSession());
  const [toastEl, showToast] = useToast();
  const [banners, setBanners] = useState(DEFAULT_BANNERS);
  const [showAdmin, setShowAdmin] = useState(false);
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [modalProduct, setModalProduct] = useState(null);

  // ── Load products + cart on mount ──
  useEffect(() => {
    const session = loadSession();

    // Validate session
    if (session?.accessToken) {
      sbGetUser(session.accessToken)
        .then(u => { if (!u) { clearSession(); setUser(null); } })
        .catch(() => { clearSession(); setUser(null); });
    }

    // Load products
    fetch(`${SUPABASE_URL}/rest/v1/products?order=created_at.asc&select=*`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    }).then(r => r.ok ? r.json() : null)
      .then(rows => {
        if (rows && rows.length) {
          const mapped = rows.map(r => ({
            id:r.id, name:r.name, price:r.price, originalPrice:r.original_price,
            image:r.image, isNew:r.is_new, isOffer:r.is_offer, status:r.status,
            category:r.category, waNum:r.wa_num||"919390238537"
          }));
          setProducts(mapped);

          // Load cart from DB after products are ready
          if (session?.accessToken && session?.id) {
            sbGetCart(session.id, session.accessToken).then(rows => {
              if (rows && rows.length) {
                const cartItems = rows.map(row => {
                  const product = mapped.find(p => p.id === row.product_id);
                  return product ? { ...product, qty: row.qty } : null;
                }).filter(Boolean);
                setCart(cartItems);
              }
            }).catch(() => {});
          }
        } else {
          // No products from DB yet — still try to load cart from static products
          if (session?.accessToken && session?.id) {
            sbGetCart(session.id, session.accessToken).then(rows => {
              if (rows && rows.length) {
                const cartItems = rows.map(row => {
                  const product = STATIC_PRODUCTS.find(p => p.id === row.product_id);
                  return product ? { ...product, qty: row.qty } : null;
                }).filter(Boolean);
                setCart(cartItems);
              }
            }).catch(() => {});
          }
        }
      }).catch(() => {});
  }, []);

  // ── Cart helpers that sync to DB ──
  const addToCart = (p) => {
    if (!user) { showToast("error", "Sign in to add to cart"); return; }
    setCart(c => {
      const ex = c.find(i => i.id === p.id);
      const newQty = ex ? ex.qty + 1 : 1;
      sbUpsertCartItem(user.id, user.accessToken, p.id, newQty).catch(() => {});
      if (ex) return c.map(i => i.id === p.id ? { ...i, qty: newQty } : i);
      return [...c, { ...p, qty: 1 }];
    });
    showToast("success", `✅ "${p.name}" added!`);
  };

  const updateCartQty = (productId, qty) => {
    if (qty <= 0) { removeFromCart(productId); return; }
    setCart(c => c.map(i => i.id === productId ? { ...i, qty } : i));
    if (user) sbUpsertCartItem(user.id, user.accessToken, productId, qty).catch(() => {});
  };

  const removeFromCart = (productId) => {
    setCart(c => c.filter(i => i.id !== productId));
    if (user) sbDeleteCartItem(user.id, user.accessToken, productId).catch(() => {});
  };

  const clearCart = () => {
    setCart([]);
    if (user) sbClearCart(user.id, user.accessToken).catch(() => {});
  };

  const logout = async () => {
    if (user?.accessToken) await sbSignOut(user.accessToken);
    clearSession(); setUser(null); setCart([]); showToast("success", "👋 Signed out.");
  };

  // Load cart when user logs in mid-session
  const handleLogin = (session) => {
    setUser(session);
    sbGetCart(session.id, session.accessToken).then(rows => {
      if (rows && rows.length) {
        setProducts(prev => {
          const cartItems = rows.map(row => {
            const product = prev.find(p => p.id === row.product_id);
            return product ? { ...product, qty: row.qty } : null;
          }).filter(Boolean);
          setCart(cartItems);
          return prev;
        });
      }
    }).catch(() => {});
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  if (showAdmin) return (
    <div>
      <AdminPage autoAuthed={(user?.email||"").toLowerCase() === ADMIN_EMAIL} />
      <div style={{ position:"fixed",bottom:20,right:20,zIndex:9999 }}>
        <button onClick={()=>setShowAdmin(false)} style={{ background:"#131f16",border:"1px solid rgba(46,204,113,0.3)",color:"#7aab8a",padding:"8px 14px",borderRadius:40,fontSize:"0.75rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>← Back to App</button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif",background:"#f5f7fa",minHeight:"100vh" }}>
      <style>{`*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}html,body{overflow-x:hidden;}`}</style>

      {tab === "home" && (
        <HomePage user={user} cart={cart} showAuth={()=>{}} showToast={showToast} onTabChange={setTab}
          banners={banners} setBanners={setBanners} addToCart={addToCart} />
      )}
      {tab === "categories" && (
        <CategoriesPage products={products} onProductClick={setModalProduct} onAddCart={addToCart} user={user} />
      )}
      {tab === "account" && (
        <AccountPage user={user} onLogin={handleLogin} onLogout={logout} cart={cart} showToast={showToast} />
      )}
      {tab === "cart" && (
        <CartPage cart={cart} user={user} showAuth={()=>setTab("account")} showToast={showToast}
          updateCartQty={updateCartQty} removeFromCart={removeFromCart} clearCart={clearCart} />
      )}

      <BottomNav activeTab={tab} onTabChange={setTab} cartCount={cartCount} />
      {toastEl}

      {modalProduct && (
        <ProductDetailModal product={modalProduct} onClose={()=>setModalProduct(null)}
          onAddCart={addToCart}
          user={user} showAuth={()=>{setModalProduct(null);setTab("account");}} />
      )}

      {(user?.email||"").toLowerCase() === ADMIN_EMAIL && (
        <div style={{ position:"fixed",bottom:72,right:16,zIndex:99 }}>
          <button onClick={()=>setShowAdmin(true)} style={{ background:"rgba(10,15,13,0.9)",border:"1px solid rgba(46,204,113,0.2)",color:"#7aab8a",padding:"7px 13px",borderRadius:40,fontSize:"0.72rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",backdropFilter:"blur(6px)" }}>⚙ Admin</button>
        </div>
      )}
    </div>
  );
}
