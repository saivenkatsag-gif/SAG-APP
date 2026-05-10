import { useState, useEffect, useRef } from "react";
const SAG_LOGO_B64 = "data:image/jpeg;base64,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iVrY6Gm7FwkqIgXtLpC0yyDYO2Eg3HcpicG1xFy4JsIeTu6GGopj+RUytH2bLY+L6U6fYZp5WYLjGM01ux+tEwqaGN73Nl7VvJJzOc4uO7dh39ABtsvQwrBsV07w+DFsMtEdqtED3yRUscj5A1z3Fzju8k9SSe9BX3jeMa46t6964X7SG7WG2W+7XSew3KrujyHupi5zQ2IhjiPUYNyNj1GyyniM0+tuiGg2g9llrPSIMayJrqytYzbtHuInmeG94G7XbDv2AU0sH03wnTa311DhNghtEFfVGtqmxyPk7WYgAvJe4nuA6dy/PUDTDA9U7HTWfPsdhvVFSz+lQwyyyRhknKW827HNPc4jbu6oI38Hlmq881B1F4kb5A4VGSXKWhtIk74qRjgTt7OkUf8AuivrQIPy35Q/XPOH7yR20xWOGQncDlcIyB/+L9qlHi2KY9hWIUOL4ta4rZaKFnZ01JESWxguLj1cSSSSSSSSSV5uHaa4Rp/WXmrxCwRWye9VRrbjIyWSQ1M27jzu53Hbq93QbDqUGkOPK/Os/B1cqCOTkfeLjSUAG+245zMR9UKyfBNWtMKHh9NmwvNbLeKzE8U9IngoJ+cxsp6cAuPkOYD4lbF1A0vwTVOy0toz7Hor1RUs/pMMEsskYZJylvN6jmknZxHXzWPY7w76M4nYb9ZsewWjoKK/0voVzijnmPpMPX1C5zyWj1j9EhBpPg7DsJ4BbxnVWC2Wplud7kkf0LhEwsB/5J+taE0+1UwTBvk08xx6oyShnzPKairb80xv56j7tyQ872j6IDGufufMeJVhlJpthFDpO7TOjsEMOKOpZKJ1sZJIGGGQkvZzc3N1LnbnffqsKsPC1w/41fqa82fTG0RVtNIJYZJ3y1AY4HcODZHubuD1B26IO7w44lXYPwsYRjd0idDWwW1stRE4bOjklc6VzD7QZNj7ltJANgiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiD//2Q==";
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

// ─── SUPABASE REVIEW HELPERS ──────────────────────────────────
async function sbGetReviews(productId) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/product_reviews?product_id=eq.${productId}&order=created_at.desc&select=*`,
    { headers: sbHeaders }
  );
  if (!res.ok) return [];
  return res.json();
}

async function sbSubmitReview(accessToken, review) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/product_reviews`, {
    method: "POST",
    headers: { ...sbHeaders, Authorization: `Bearer ${accessToken}`, Prefer: "return=representation" },
    body: JSON.stringify(review),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.details || "Failed to submit review");
  }
  return res.json();
}

async function sbCheckUserReview(productId, userId, accessToken) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/product_reviews?product_id=eq.${productId}&user_id=eq.${userId}&select=id`,
    { headers: { ...sbHeaders, Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) return false;
  const data = await res.json();
  return data.length > 0;
}

// ─── STAR RATING (display) ────────────────────────────────────
function StarRating({ rating = 0, count = 0, size = "0.9rem" }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span style={{ display:"inline-flex",alignItems:"center",gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize:size, color: i<=full ? "#f59e0b" : (i===full+1&&half ? "#f59e0b" : "#d1d5db") }}>
          {i<=full ? "★" : (i===full+1&&half ? "⯨" : "☆")}
        </span>
      ))}
      {count>0 && <span style={{ fontSize:"0.72rem",color:"#6b7280",marginLeft:4 }}>({count})</span>}
    </span>
  );
}

// ─── STAR PICKER (interactive) ────────────────────────────────
function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <span style={{ display:"inline-flex",gap:4 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i}
          onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(0)}
          onClick={()=>onChange(i)}
          style={{ fontSize:"1.6rem",cursor:"pointer",color: i<=(hover||value) ? "#f59e0b" : "#d1d5db",transition:"color .15s" }}>
          ★
        </span>
      ))}
    </span>
  );
}

// ─── PRODUCT DETAIL PAGE (full screen) ────────────────────────
function ProductDetailModal({ product, onClose, onAddCart, user, showAuth, allProducts, onSimilarClick }) {
  const off = discount(product.price, product.originalPrice);
  const handleAddCart = () => { if (!user) { onClose(); showAuth(); return; } onAddCart(product); onClose(); };
  const msg = `Hello SAG Drone Technologies! 👋\n\nI'm interested in: ${product.name}\nPrice: ${formatINR(product.price)}\n\nPlease share more details.`;

  // Similar products (same category, excluding current)
  const similar = (allProducts||[]).filter(p=>p.id!==product.id && p.category===product.category).slice(0,8);

  // Product highlights
  const highlights = [
    { label:"Brand",         value:"SAG Drone Technologies" },
    { label:"Category",      value:product.category||"—" },
    { label:"Status",        value:product.status==="instock" ? "✅ In Stock" : "❌ Out of Stock" },
    { label:"Warranty",      value:"Manufacturer Warranty" },
    { label:"Certification", value:"DGCA Certified" },
    { label:"Support",       value:"After-Sales Support" },
  ];

  // ── Real reviews state ──
  const [reviews, setReviews]         = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  // Collapsed reviews
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Write-review form
  const [showForm, setShowForm]   = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [formText, setFormText]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Load reviews on mount
  useEffect(() => {
    setShowAllReviews(false);
    setReviewsLoading(true);
    sbGetReviews(product.id)
      .then(rows => { setReviews(rows); setReviewsLoading(false); })
      .catch(() => setReviewsLoading(false));
    if (user?.id && user?.accessToken) {
      sbCheckUserReview(product.id, user.id, user.accessToken)
        .then(setAlreadyReviewed).catch(()=>{});
    }
  }, [product.id, user]);

  // Aggregate stats computed from real reviews
  const totalReviews = reviews.length;
  const avgRating = totalReviews
    ? Math.round((reviews.reduce((s,r)=>s+r.rating,0)/totalReviews)*10)/10
    : 0;
  const starCounts = [5,4,3,2,1].map(s=>({ star:s, count:reviews.filter(r=>r.rating===s).length }));

  const submitReview = async () => {
    setFormError(""); setFormSuccess("");
    if (!formRating) { setFormError("Please select a star rating."); return; }
    if (!formText.trim()) { setFormError("Please write a comment."); return; }
    setSubmitting(true);
    try {
      await sbSubmitReview(user.accessToken, {
        product_id: product.id,
        user_id: user.id,
        user_name: user.name,
        rating: formRating,
        comment: formText.trim(),
      });
      setFormSuccess("✅ Review submitted! Thank you.");
      setFormRating(0); setFormText(""); setShowForm(false);
      setAlreadyReviewed(true);
      // Refresh reviews
      const rows = await sbGetReviews(product.id);
      setReviews(rows);
    } catch(e) { setFormError(e.message); }
    finally { setSubmitting(false); }
  };

  // Hardware back button — App.openProduct already pushed a history entry.
  // We just listen for popstate and call onClose (which navigates the product stack).
  useEffect(() => {
    const onPop = () => { onClose(); };
    window.addEventListener("popstate", onPop);
    return () => { window.removeEventListener("popstate", onPop); };
  }, [onClose]);

  // Shared style tokens
  const S = {
    page: {
      position:"fixed", inset:0, zIndex:9990,
      background:"#f5f7fa", overflowY:"auto",
      fontFamily:"'DM Sans',sans-serif",
    },
    header: {
      position:"sticky", top:0, zIndex:20,
      display:"flex", alignItems:"center", gap:10,
      padding:"14px 16px",
      background:"#fff", borderBottom:"1px solid #e5e7eb",
    },
    backBtn: {
      background:"none", border:"none", cursor:"pointer",
      color:"#374151", fontSize:"1.3rem", lineHeight:1,
      display:"flex", alignItems:"center", justifyContent:"center",
      width:32, height:32, borderRadius:8, flexShrink:0,
    },
    card: {
      background:"#fff", borderTop:"1px solid #e5e7eb",
      borderBottom:"1px solid #e5e7eb", padding:"16px",
      marginBottom:8,
    },
    secTitle: {
      fontSize:"0.78rem", fontWeight:700, color:"#374151",
      letterSpacing:".07em", textTransform:"uppercase", marginBottom:12,
    },
  };

  return (
    <div style={S.page}>

      {/* ── Sticky header ── */}
      <div style={S.header}>
        <button style={S.backBtn} onClick={onClose}>←</button>
        <span style={{ fontWeight:700, fontSize:"0.92rem", color:"#111827", flex:1,
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
          {product.name}
        </span>
      </div>

      {/* ── Product image ── */}
      <div style={{ background:"#fff", display:"flex", alignItems:"center",
        justifyContent:"center", padding:"28px 20px", borderBottom:"1px solid #e5e7eb" }}>
        {product.image
          ? <img src={product.image} alt={product.name}
              style={{ width:"100%", maxHeight:280, objectFit:"contain" }} />
          : <div style={{ fontSize:"5rem", opacity:.2 }}>📦</div>}
      </div>

      {/* ── Primary info ── */}
      <div style={{ background:"#fff", padding:"16px 16px 20px", marginBottom:8, borderBottom:"1px solid #e5e7eb" }}>
        <div style={{ fontSize:"0.67rem", fontWeight:700, color:"#85c9ff",
          letterSpacing:".1em", textTransform:"uppercase", marginBottom:4 }}>
          {product.category||"PRODUCT"}
        </div>
        <div style={{ fontSize:"1.3rem", fontWeight:700, color:"#111827",
          lineHeight:1.3, marginBottom:10 }}>{product.name}</div>

        {/* Live rating row — only shows if there are real reviews */}
        {totalReviews>0 && (
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <StarRating rating={avgRating} />
            <span style={{ fontSize:"0.85rem", fontWeight:700, color:"#111827" }}>{avgRating}</span>
            <span style={{ fontSize:"0.78rem", color:"#85c9ff", fontWeight:600 }}>
              {totalReviews} review{totalReviews!==1?"s":""}
            </span>
          </div>
        )}

        {/* Price row */}
        <div style={{ display:"flex", alignItems:"baseline", gap:10, flexWrap:"wrap", marginBottom:6 }}>
          <span style={{ fontSize:"1.65rem", fontWeight:800, color:"#111827" }}>
            {formatINR(product.price)}
          </span>
          {product.originalPrice && (
            <span style={{ fontSize:"0.95rem", color:"#9ca3af", textDecoration:"line-through" }}>
              {formatINR(product.originalPrice)}
            </span>
          )}
          {off && (
            <span style={{ display:"inline-block", padding:"2px 10px", borderRadius:20,
              fontSize:"0.72rem", fontWeight:700, background:"rgba(133,201,255,0.15)", color:"#0369a1" }}>
              {off}% off
            </span>
          )}
        </div>

        {off && product.originalPrice && (
          <div style={{ fontSize:"0.8rem", color:"#0369a1", fontWeight:600, marginBottom:10 }}>
            You save {formatINR(product.originalPrice - product.price)}
          </div>
        )}

        {/* Stock status */}
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.8rem", marginBottom:16 }}>
          <span style={{ width:7, height:7, borderRadius:"50%", flexShrink:0,
            background:product.status==="instock"?"#22c55e":"#ef4444", display:"inline-block" }} />
          <span style={{ fontWeight:600, color:product.status==="instock"?"#15803d":"#dc2626" }}>
            {product.status==="instock" ? "In Stock — Ready to ship" : "Out of Stock"}
          </span>
        </div>

        {/* CTAs */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <button onClick={handleAddCart} style={{
            background:"#85c9ff", color:"#0c1b2e", border:"none", borderRadius:40,
            padding:"13px 20px", fontFamily:"'DM Sans',sans-serif", fontWeight:700,
            fontSize:"0.95rem", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}>🛒 {user ? "Add to Cart" : "Sign in to Add to Cart"}</button>
          <a href={waLink(product.waNum||"919390238537", msg)} target="_blank" rel="noreferrer" style={{
            border:"1.5px solid #85c9ff", background:"#fff", color:"#0369a1",
            borderRadius:40, padding:"11px 20px", fontFamily:"'DM Sans',sans-serif",
            fontWeight:700, fontSize:"0.9rem", textDecoration:"none",
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}>💬 Enquire on WhatsApp</a>
        </div>
      </div>

      {/* ── Product Highlights ── */}
      <div style={S.card}>
        <div style={S.secTitle}>Product Highlights</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
          {highlights.map(h => (
            <div key={h.label} style={{ display:"flex", flexDirection:"column", gap:2 }}>
              <span style={{ fontSize:"0.68rem", color:"#9ca3af", fontWeight:600,
                textTransform:"uppercase", letterSpacing:".05em" }}>{h.label}</span>
              <span style={{ fontSize:"0.84rem", color:"#1f2937", fontWeight:600 }}>{h.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Product Details ── */}
      <div style={S.card}>
        <div style={S.secTitle}>Product Details</div>
        <p style={{ fontSize:"0.85rem", color:"#4b5563", lineHeight:1.8, margin:0 }}>
          DGCA-certified quality drone component. All products come with manufacturer warranty
          and SAG Drone Technologies' trusted after-sale support. Designed for professional
          agricultural operations with high reliability and performance.
        </p>
      </div>

      {/* ── Ratings & Reviews ── */}
      <div style={S.card}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={S.secTitle}>Ratings &amp; Reviews</div>
          {user && !alreadyReviewed && !showForm && (
            <button onClick={()=>setShowForm(true)} style={{
              background:"rgba(133,201,255,0.12)", border:"1px solid #85c9ff",
              color:"#0369a1", borderRadius:20, padding:"5px 14px",
              fontSize:"0.78rem", fontWeight:700, cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",
            }}>+ Write a Review</button>
          )}
          {!user && (
            <button onClick={()=>{onClose();showAuth();}} style={{
              background:"rgba(133,201,255,0.12)", border:"1px solid #85c9ff",
              color:"#0369a1", borderRadius:20, padding:"5px 14px",
              fontSize:"0.78rem", fontWeight:700, cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",
            }}>Sign in to Review</button>
          )}
        </div>

        {/* Write-review form */}
        {showForm && (
          <div style={{ background:"#f0f9ff", border:"1px solid #bae6fd",
            borderRadius:12, padding:14, marginBottom:16 }}>
            <div style={{ fontSize:"0.82rem", fontWeight:700, color:"#0369a1", marginBottom:10 }}>
              Your Review
            </div>
            <div style={{ marginBottom:10 }}>
              <StarPicker value={formRating} onChange={setFormRating} />
              {formRating>0 && (
                <span style={{ fontSize:"0.78rem", color:"#6b7280", marginLeft:8 }}>
                  {["","Poor","Fair","Good","Very Good","Excellent"][formRating]}
                </span>
              )}
            </div>
            <textarea
              value={formText} onChange={e=>setFormText(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={3}
              style={{ width:"100%", boxSizing:"border-box", borderRadius:8,
                border:"1px solid #bae6fd", padding:"8px 10px", fontSize:"0.85rem",
                fontFamily:"'DM Sans',sans-serif", resize:"vertical", color:"#111827",
                background:"#fff", outline:"none" }}
            />
            {formError && <div style={{ fontSize:"0.78rem", color:"#dc2626", marginTop:6 }}>{formError}</div>}
            {formSuccess && <div style={{ fontSize:"0.78rem", color:"#15803d", marginTop:6 }}>{formSuccess}</div>}
            <div style={{ display:"flex", gap:8, marginTop:10 }}>
              <button onClick={submitReview} disabled={submitting} style={{
                flex:1, background:"#85c9ff", color:"#0c1b2e", border:"none",
                borderRadius:30, padding:"10px", fontSize:"0.85rem", fontWeight:700,
                cursor:submitting?"wait":"pointer", fontFamily:"'DM Sans',sans-serif",
                opacity:submitting?.7:1,
              }}>{submitting?"Submitting…":"Submit Review"}</button>
              <button onClick={()=>{setShowForm(false);setFormError("");setFormRating(0);setFormText("");}} style={{
                flex:1, background:"#fff", color:"#6b7280", border:"1px solid #e5e7eb",
                borderRadius:30, padding:"10px", fontSize:"0.85rem", fontWeight:600,
                cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
              }}>Cancel</button>
            </div>
          </div>
        )}

        {alreadyReviewed && (
          <div style={{ fontSize:"0.8rem", color:"#15803d", background:"#f0fdf4",
            border:"1px solid #bbf7d0", borderRadius:8, padding:"8px 12px", marginBottom:12 }}>
            ✅ You have already reviewed this product.
          </div>
        )}

        {/* Aggregate summary */}
        {reviewsLoading ? (
          <div style={{ textAlign:"center", color:"#9ca3af", padding:"20px 0", fontSize:"0.85rem" }}>
            Loading reviews…
          </div>
        ) : totalReviews===0 ? (
          <div style={{ textAlign:"center", color:"#9ca3af", padding:"20px 0", fontSize:"0.85rem" }}>
            No reviews yet. Be the first to review this product!
          </div>
        ) : (
          <>
            {/* Summary bar */}
            <div style={{ display:"flex", alignItems:"center", gap:16,
              padding:"12px 0", borderBottom:"1px solid #f3f4f6", marginBottom:16 }}>
              <div style={{ textAlign:"center", flexShrink:0 }}>
                <div style={{ fontSize:"2.8rem", fontWeight:800, color:"#111827", lineHeight:1 }}>
                  {avgRating}
                </div>
                <StarRating rating={avgRating} size="1rem" />
                <div style={{ fontSize:"0.7rem", color:"#9ca3af", marginTop:4 }}>
                  {totalReviews} review{totalReviews!==1?"s":""}
                </div>
              </div>
              <div style={{ flex:1 }}>
                {starCounts.map(({star,count})=>{
                  const pct = totalReviews ? Math.round((count/totalReviews)*100) : 0;
                  return (
                    <div key={star} style={{ display:"flex", alignItems:"center",
                      gap:6, marginBottom:4 }}>
                      <span style={{ fontSize:"0.7rem", color:"#6b7280", width:8 }}>{star}</span>
                      <span style={{ fontSize:"0.7rem", color:"#f59e0b" }}>★</span>
                      <div style={{ flex:1, height:6, background:"#e5e7eb",
                        borderRadius:4, overflow:"hidden" }}>
                        <div style={{ width:`${pct}%`, height:"100%",
                          background:"#85c9ff", borderRadius:4, transition:"width .3s" }} />
                      </div>
                      <span style={{ fontSize:"0.68rem", color:"#9ca3af",
                        width:28, textAlign:"right" }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Individual review cards */}
            {(showAllReviews ? reviews : reviews.slice(0,3)).map((r,i,arr) => (
              <div key={r.id||i} style={{
                paddingBottom:14, marginBottom:14,
                borderBottom: i<arr.length-1 ? "1px solid #f3f4f6" : "none",
              }}>
                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"flex-start", marginBottom:4 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:32, height:32, borderRadius:"50%",
                      background:"linear-gradient(135deg,#85c9ff,#38bdf8)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:"0.85rem", fontWeight:700, color:"#0c1b2e", flexShrink:0 }}>
                      {(r.user_name||"U")[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize:"0.82rem", fontWeight:700, color:"#111827" }}>
                        {r.user_name||"User"}
                      </div>
                      <StarRating rating={r.rating} size="0.8rem" />
                    </div>
                  </div>
                  <span style={{ fontSize:"0.7rem", color:"#9ca3af", flexShrink:0 }}>
                    {new Date(r.created_at).toLocaleDateString("en-IN",{month:"short",year:"numeric"})}
                  </span>
                </div>
                <p style={{ fontSize:"0.83rem", color:"#4b5563", margin:"6px 0 0 40px",
                  lineHeight:1.65 }}>{r.comment}</p>
              </div>
            ))}

            {/* View All / Show Less toggle */}
            {reviews.length > 3 && (
              <button
                onClick={() => setShowAllReviews(v => !v)}
                style={{
                  width:"100%", padding:"10px", marginTop:2,
                  background:"rgba(133,201,255,0.1)", border:"1px solid #bae6fd",
                  borderRadius:10, color:"#0369a1", fontFamily:"'DM Sans',sans-serif",
                  fontWeight:700, fontSize:"0.83rem", cursor:"pointer",
                }}
              >
                {showAllReviews
                  ? "▲ Show Less"
                  : `View All ${reviews.length} Reviews ▼`}
              </button>
            )}
          </>
        )}
      </div>

      {/* ── Similar Products ── */}
      {similar.length>0 && (
        <div style={S.card}>
          <div style={S.secTitle}>Similar Products</div>
          <div style={{ display:"flex", gap:12, overflowX:"auto",
            paddingBottom:4, scrollbarWidth:"none" }}>
            {similar.map(p=>{
              const pOff=discount(p.price,p.originalPrice);
              return (
                <div key={p.id}
                  onClick={()=>onSimilarClick(p)}
                  style={{ flexShrink:0, width:144, background:"#f9fafb",
                    borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden",
                    cursor:"pointer", transition:"box-shadow .18s, transform .18s",
                  }}
                  onMouseEnter={e=>{ e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.12)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}
                >
                  <div style={{ height:100, background:"#fff", display:"flex",
                    alignItems:"center", justifyContent:"center", padding:8 }}>
                    {p.image
                      ? <img src={p.image} alt={p.name}
                          style={{ width:"100%", height:"100%", objectFit:"contain" }} />
                      : <span style={{ fontSize:"2rem", opacity:.3 }}>📦</span>}
                  </div>
                  <div style={{ padding:"8px 8px 10px" }}>
                    <div style={{ fontSize:"0.72rem", color:"#374151", fontWeight:600,
                      lineHeight:1.3, marginBottom:4,
                      display:"-webkit-box", WebkitLineClamp:2,
                      WebkitBoxOrient:"vertical", overflow:"hidden" }}>{p.name}</div>
                    <div style={{ fontSize:"0.82rem", fontWeight:800, color:"#111827" }}>
                      {formatINR(p.price)}
                    </div>
                    {pOff && (
                      <span style={{ fontSize:"0.65rem", color:"#0369a1", fontWeight:700 }}>
                        {pOff}% off
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ height:32 }} />
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
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
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

  // ── Save All to Supabase ──
  const saveAll = async () => {
    setSaving(true); setSaveError("");
    try {
      // Delete banners removed from list
      const removedDbIds = banners
        .filter(orig => orig.db_id && !list.find(b => b.db_id === orig.db_id))
        .map(b => b.db_id);
      for (const id of removedDbIds) {
        await sbDeleteBanner(id);
      }
      // Upsert all current banners
      const savedList = [];
      for (let i = 0; i < list.length; i++) {
        const b = { ...list[i], sort_order: i };
        const rows = await sbUpsertBanner(b);
        const saved = Array.isArray(rows) ? rows[0] : rows;
        if (saved) {
          savedList.push({
            ...b,
            db_id: saved.id,
            id: saved.id,
            imageUrl: saved.image_url || b.imageUrl || "",
            linkCategory: saved.link_category || b.linkCategory || "",
          });
        } else {
          savedList.push(b);
        }
      }
      onSave(savedList);
    } catch (e) {
      setSaveError("Failed to save banners. Please try again.");
      setSaving(false);
    }
  };

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
              {saveError && (
                <div style={{ marginTop:10,padding:"8px 12px",background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:8,color:"#dc2626",fontSize:"0.8rem" }}>
                  {saveError}
                </div>
              )}
              <button onClick={saveAll} disabled={saving} style={{ width:"100%",marginTop:10,padding:"11px",background: saving ? "#9ca3af" : "#2454c7",color:"#fff",border:"none",borderRadius:40,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.9rem",cursor:saving?"wait":"pointer",opacity:saving?0.8:1 }}>
                {saving ? "⏳ Saving to cloud…" : "✅ Save All Changes"}
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
  const [productHistory, setProductHistory] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const openProduct = (p) => {
    if (modalProduct) setProductHistory(h => [...h, modalProduct]);
    setModalProduct(p);
    window.history.pushState({ pdModal: true }, "");
  };

  const closeModal = () => {
    if (productHistory.length > 0) {
      const prev = productHistory[productHistory.length - 1];
      setProductHistory(h => h.slice(0, -1));
      setModalProduct(prev);
    } else {
      setModalProduct(null);
      setProductHistory([]);
    }
  };
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
                {filtered.map(p => <ProductCard key={p.id} p={p} onClick={() => openProduct(p)} onAddCart={() => { if(!localUser){setAuthOpen(true);return;} addToCart(p); }} user={localUser} />)}
              </div>
            )}
          </div>
        ) : (
          <>
            <SectionBlock title="🚁 Drones" subtitle="Agricultural drones for every farm" products={featuredDrones}
              onProductClick={openProduct} onAddCart={(p) => { if(!localUser){setAuthOpen(true);return;} addToCart(p); }} user={localUser}
              onViewAll={() => setActiveCat("Drones")} />

            {offers.length > 0 && (
              <SectionBlock title="🏷️ Hot Deals" subtitle="Best prices on top products" products={offers}
                onProductClick={openProduct} onAddCart={(p) => { if(!localUser){setAuthOpen(true);return;} addToCart(p); }} user={localUser}
                onViewAll={() => setActiveCat("Offers")} accent="#f0a030" />
            )}

            <SectionBlock title="🔋 Batteries" subtitle="SAG VOLT Plus series & chargers" products={featuredBatteries}
              onProductClick={openProduct} onAddCart={(p) => { if(!localUser){setAuthOpen(true);return;} addToCart(p); }} user={localUser}
              onViewAll={() => setActiveCat("Batteries")} />

            <div style={{ padding:"0 14px 8px" }}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
                <div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.25rem",fontWeight:800,color:"#111827" }}>All Products</div>
                  <div style={{ fontSize:"0.75rem",color:"#6b7280",marginTop:1 }}>{products.length} items available</div>
                </div>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                {products.map(p => <ProductCard key={p.id} p={p} onClick={() => openProduct(p)} onAddCart={() => { if(!localUser){setAuthOpen(true);return;} addToCart(p); }} user={localUser} />)}
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
      {modalProduct && <ProductDetailModal product={modalProduct} onClose={closeModal} onAddCart={addToCart} allProducts={products} onSimilarClick={openProduct} user={localUser} showAuth={() => { closeModal(); setProductHistory([]); setModalProduct(null); setAuthOpen(true); }} />}
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
function CategoriesPage({ products: propProducts, onProductClick, onAddCart, user }) {
  const [products, setProducts]   = useState(propProducts && propProducts.length ? propProducts : STATIC_PRODUCTS);
  const [catObjs, setCatObjs]     = useState([]);   // full category objects from Supabase
  const [loading, setLoading]     = useState(true);
  const [activeCat, setActiveCat] = useState("All");

  // ── Fetch BOTH categories and products from Supabase in parallel ──
  useEffect(() => {
    const fetchProducts = fetch(
      `${SUPABASE_URL}/rest/v1/products?order=created_at.asc&select=*`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    ).then(r => r.ok ? r.json() : null);

    const fetchCats = sbGetCategories();

    Promise.all([fetchProducts, fetchCats])
      .then(([productRows, catRows]) => {
        if (productRows && productRows.length) {
          setProducts(productRows.map(r => ({
            id: r.id, name: r.name, price: r.price, originalPrice: r.original_price,
            image: r.image, isNew: r.is_new, isOffer: r.is_offer, status: r.status,
            category: r.category, waNum: r.wa_num || "919390238537"
          })));
        }
        if (catRows && catRows.length) {
          setCatObjs(catRows.filter(c => c.active !== false));
        } else {
          // Fallback: derive unique category names from products
          const names = [...new Set((productRows || STATIC_PRODUCTS).map(p => p.category).filter(Boolean))];
          setCatObjs(names.map((n, i) => ({ name: n, icon: CATEGORY_ICONS[n] || "📦", description: "", sort_order: i })));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Keep in sync if parent passes freshly-loaded products
  useEffect(() => {
    if (propProducts && propProducts.length) setProducts(propProducts);
  }, [propProducts]);

  // Which category names to render in the content area
  const displayCatNames = activeCat === "All"
    ? catObjs.map(c => c.name)
    : [activeCat];

  // Helper: look up icon from catObjs first, then CATEGORY_ICONS fallback
  const iconFor  = (name) => catObjs.find(c => c.name === name)?.icon || CATEGORY_ICONS[name] || "📦";
  const descFor  = (name) => catObjs.find(c => c.name === name)?.description || "";

  return (
    <div style={{ background:"#f5f7fa",minHeight:"100vh",paddingBottom:70,fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@keyframes catpulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>

      {/* ── Header ── */}
      <div style={{ background:"linear-gradient(135deg,#1a2b6b 0%,#2454c7 100%)",padding:"16px 16px 0" }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.5rem",fontWeight:800,color:"#fff" }}>Categories</div>
        <div style={{ fontSize:"0.78rem",color:"rgba(255,255,255,0.8)",marginTop:2,marginBottom:12 }}>Browse by product type</div>

        {/* Filter pills — All + every category from Supabase */}
        <div style={{ display:"flex",gap:8,overflowX:"auto",paddingBottom:12,scrollbarWidth:"none",msOverflowStyle:"none" }}>
          {/* All pill */}
          <button onClick={() => setActiveCat("All")} style={{
            flexShrink:0,display:"flex",alignItems:"center",gap:6,
            background: activeCat==="All" ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.1)",
            border: activeCat==="All" ? "2px solid #fff" : "2px solid transparent",
            borderRadius:20,padding:"6px 14px",cursor:"pointer",transition:"all .2s",
          }}>
            <span style={{ fontSize:"1rem" }}>🏪</span>
            <span style={{ fontSize:"0.72rem",fontWeight:700,color:"#fff",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif" }}>All</span>
          </button>

          {/* Dynamic category pills */}
          {loading
            ? [1,2,3,4].map(i => (
                <div key={i} style={{ flexShrink:0,width:90,height:32,borderRadius:20,background:"rgba(255,255,255,0.15)",animation:"catpulse 1.4s infinite" }} />
              ))
            : catObjs.map(cat => (
                <button key={cat.name} onClick={() => setActiveCat(cat.name)} style={{
                  flexShrink:0,display:"flex",alignItems:"center",gap:6,
                  background: activeCat===cat.name ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.1)",
                  border: activeCat===cat.name ? "2px solid #fff" : "2px solid transparent",
                  borderRadius:20,padding:"6px 14px",cursor:"pointer",transition:"all .2s",
                }}>
                  <span style={{ fontSize:"1rem" }}>{cat.icon || "📦"}</span>
                  <span style={{ fontSize:"0.72rem",fontWeight:700,color:"#fff",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif" }}>{cat.name}</span>
                </button>
              ))
          }
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding:"14px 14px" }}>
        {loading ? (
          <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
            {[1,2,3].map(i => (
              <div key={i}>
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                  <div style={{ width:42,height:42,borderRadius:12,background:"#e5e7eb",animation:"catpulse 1.4s infinite" }} />
                  <div>
                    <div style={{ width:130,height:16,background:"#e5e7eb",borderRadius:6,marginBottom:6,animation:"catpulse 1.4s infinite" }} />
                    <div style={{ width:90,height:12,background:"#f3f4f6",borderRadius:6,animation:"catpulse 1.4s infinite" }} />
                  </div>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                  {[1,2].map(j => <div key={j} style={{ height:280,background:"#e5e7eb",borderRadius:14,animation:"catpulse 1.4s infinite" }} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Total count bar */}
            <div style={{ fontSize:"0.78rem",color:"#6b7280",marginBottom:14,display:"flex",alignItems:"center",gap:6 }}>
              <span style={{ fontWeight:700,color:"#374151" }}>
                {activeCat === "All"
                  ? `${products.length} product${products.length!==1?"s":""} across ${catObjs.length} categor${catObjs.length!==1?"ies":"y"}`
                  : `${products.filter(p=>p.category===activeCat).length} product${products.filter(p=>p.category===activeCat).length!==1?"s":""} in ${activeCat}`
                }
              </span>
            </div>

            {displayCatNames.map(name => {
              const items = products.filter(p => p.category === name);
              if (!items.length) return null;
              return (
                <div key={name} style={{ marginBottom:26 }}>
                  {/* Category header */}
                  <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:12,
                    padding:"10px 14px",background:"#fff",borderRadius:14,
                    boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #e8edf5" }}>
                    <div style={{
                      width:46,height:46,borderRadius:12,flexShrink:0,
                      background:"linear-gradient(135deg,#1a2b6b,#2454c7)",
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem"
                    }}>{iconFor(name)}</div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.2rem",fontWeight:800,color:"#111827" }}>{name}</div>
                      <div style={{ fontSize:"0.72rem",color:"#6b7280",marginTop:1 }}>
                        {descFor(name) || name}
                        {" · "}
                        <span style={{ fontWeight:600,color:"#2454c7" }}>{items.length} item{items.length!==1?"s":""}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                    {items.map(p => (
                      <ProductCard key={p.id} p={p}
                        onClick={() => onProductClick(p)}
                        onAddCart={() => onAddCart(p)}
                        user={user} />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {displayCatNames.every(name => !products.filter(p => p.category === name).length) && (
              <div style={{ textAlign:"center",padding:"60px 20px",color:"#9ca3af" }}>
                <div style={{ fontSize:"3rem",marginBottom:12,opacity:.4 }}>📭</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.3rem",fontWeight:800,color:"#374151",marginBottom:6 }}>No products here yet</div>
                <div style={{ fontSize:"0.85rem" }}>Products assigned to this category will appear here.</div>
              </div>
            )}
          </>
        )}
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
  const payload = {
    title: banner.title, subtitle: banner.subtitle, badge: banner.badge,
    bg: banner.bg, emoji: banner.emoji, cta: banner.cta,
    image_url: banner.imageUrl || null,
    link_category: banner.linkCategory || null,
    sort_order: banner.sort_order || 0,
    active: banner.active !== false,
  };
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

// ─── CATEGORY DB HELPERS ──────────────────────────────────────
async function sbGetCategories() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/categories?order=sort_order.asc,name.asc&select=*`,
    { headers: sbHeaders }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.warn("sbGetCategories failed:", res.status, err);
    return null;
  }
  return res.json();
}

async function sbUpsertCategory(cat) {
  const payload = {
    name:        cat.name,
    icon:        cat.icon        || "📦",
    description: cat.description || "",
    sort_order:  cat.sort_order  ?? 0,
    active:      cat.active      !== false,
    updated_at:  new Date().toISOString(),
  };

  // UPDATE existing row by id
  if (cat.db_id) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/categories?id=eq.${cat.db_id}`,
      {
        method: "PATCH",
        headers: { ...sbHeaders, Prefer: "return=representation" },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("sbUpsertCategory PATCH failed:", res.status, err);
      throw new Error(err.message || err.details || "Update failed");
    }
    return res.json();
  }

  // INSERT new row — use ON CONFLICT(name) DO UPDATE so duplicate names update instead of erroring
  const res = await fetch(`${SUPABASE_URL}/rest/v1/categories`, {
    method: "POST",
    headers: {
      ...sbHeaders,
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({ ...payload, created_at: new Date().toISOString() }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("sbUpsertCategory INSERT failed:", res.status, err);
    throw new Error(err.message || err.details || "Insert failed");
  }
  return res.json();
}

async function sbDeleteCategory(id) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/categories?id=eq.${id}`,
    { method: "DELETE", headers: sbHeaders }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("sbDeleteCategory failed:", res.status, err);
    throw new Error(err.message || "Delete failed");
  }
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
  const [catList, setCatList] = useState(["Drones","Batteries","Flight Controller","Accessories"]);

  // Load real categories for filter chips
  useEffect(() => {
    sbGetCategories().then(rows => {
      if (rows && rows.length) setCatList(rows.filter(r=>r.active!==false).map(r=>r.name));
    }).catch(()=>{});
  }, []);

  const cats = ["All", ...catList];
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

// ─── ADMIN: CATEGORIES SECTION ────────────────────────────────
function AdminCategories({ showToast }) {
  const DEFAULT_CATS = [
    { name:"Drones",            icon:"🚁", description:"DGCA-certified agricultural drones",       sort_order:0, active:true },
    { name:"Batteries",         icon:"🔋", description:"High-capacity LiPo batteries & chargers",  sort_order:1, active:true },
    { name:"Flight Controller", icon:"🕹️", description:"Precision FC kits for AG drones",          sort_order:2, active:true },
    { name:"Accessories",       icon:"🔧", description:"Pumps, transmitters, motors & more",        sort_order:3, active:true },
  ];

  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIdx, setEditIdx] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const emptyForm = { name:"", icon:"📦", description:"", active:true };
  const [form, setForm] = useState(emptyForm);
  const COMMON_ICONS = ["📦","🚁","🔋","🕹️","🔧","⚙️","🛸","🌾","💡","🛠️","📡","🎮","🔩","🪝","🧰","🛡️","🔌","📷","🎯","🏷️"];

  useEffect(() => {
    sbGetCategories()
      .then(rows => {
        if (rows && rows.length) {
          setCats(rows.map(r => ({ db_id:r.id, name:r.name, icon:r.icon||"📦", description:r.description||"", sort_order:r.sort_order||0, active:r.active!==false })));
        } else {
          // Seed defaults if table is empty
          setCats(DEFAULT_CATS);
        }
        setLoading(false);
      })
      .catch(() => { setCats(DEFAULT_CATS); setLoading(false); });
  }, []);

  const openEdit = (i) => {
    setEditIdx(i);
    setForm(i === -1 ? { ...emptyForm, sort_order: cats.length } : { ...cats[i] });
  };

  const saveForm = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = { ...form, name: form.name.trim(), sort_order: editIdx === -1 ? cats.length : (form.sort_order ?? editIdx) };
      const rows = await sbUpsertCategory(payload);
      const saved = Array.isArray(rows) ? rows[0] : rows;
      if (editIdx === -1) {
        setCats(prev => [...prev, { ...payload, db_id: saved?.id }]);
        showToast("success", `✅ Category "${payload.name}" created!`);
      } else {
        setCats(prev => prev.map((c,i) => i===editIdx ? { ...payload, db_id: saved?.id || c.db_id } : c));
        showToast("success", `✅ Category updated!`);
      }
      setEditIdx(null);
    } catch { showToast("error","Failed to save category."); }
    setSaving(false);
  };

  const deleteCat = async (i) => {
    const c = cats[i];
    if (!window.confirm(`Delete category "${c.name}"? Products using this category will need to be reassigned.`)) return;
    setDeleting(i);
    try {
      if (c.db_id) await sbDeleteCategory(c.db_id);
      setCats(prev => prev.filter((_,x)=>x!==i));
      showToast("success", `🗑️ "${c.name}" deleted.`);
    } catch { showToast("error","Failed to delete."); }
    setDeleting(null);
  };

  const toggleActive = async (i) => {
    const updated = { ...cats[i], active: !cats[i].active };
    setCats(prev => prev.map((c,x)=>x===i?updated:c));
    if (updated.db_id) { try { await sbUpsertCategory(updated); } catch {} }
  };

  const moveRow = async (i, dir) => {
    const arr = [...cats];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    arr[i] = { ...arr[i], sort_order: i };
    arr[j] = { ...arr[j], sort_order: j };
    setCats(arr);
    // Persist new order silently
    [arr[i], arr[j]].forEach(c => { if (c.db_id) sbUpsertCategory(c).catch(()=>{}); });
  };

  if (editIdx !== null) return (
    <div>
      <button onClick={()=>setEditIdx(null)} style={{ display:"flex",alignItems:"center",gap:6,background:"none",border:"none",color:"#7aab8a",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"0.85rem",marginBottom:20,padding:0 }}>← Back to Categories</button>
      <div style={{ background:"#131f16",border:"1px solid rgba(46,204,113,0.2)",borderRadius:16,padding:24,maxWidth:520 }}>
        <div className="modal-title" style={{ marginBottom:18 }}>{editIdx===-1?"➕ New Category":"✏️ Edit Category"}</div>

        {/* Icon picker */}
        <div className="modal-field">
          <label>Icon Emoji</label>
          <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:10 }}>
            {COMMON_ICONS.map(ic => (
              <button key={ic} onClick={()=>setForm(f=>({...f,icon:ic}))} style={{
                width:38,height:38,borderRadius:10,border: form.icon===ic?"2px solid #2ecc71":"1px solid rgba(46,204,113,0.2)",
                background: form.icon===ic?"rgba(46,204,113,0.15)":"#0a0f0d",fontSize:"1.2rem",cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"
              }}>{ic}</button>
            ))}
          </div>
          <input value={form.icon} onChange={e=>setForm(f=>({...f,icon:e.target.value}))} placeholder="Or type any emoji"
            style={{ width:"100%",padding:"9px 12px",background:"#0a0f0d",border:"1.5px solid rgba(46,204,113,0.2)",borderRadius:10,color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:"1.2rem",outline:"none",boxSizing:"border-box",textAlign:"center" }} />
        </div>

        <div className="modal-field">
          <label>Category Name *</label>
          <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Spare Parts"
            style={{ width:"100%",padding:"10px 13px",background:"#0a0f0d",border:"1.5px solid rgba(46,204,113,0.2)",borderRadius:10,color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:"0.88rem",outline:"none",boxSizing:"border-box" }} />
        </div>

        <div className="modal-field">
          <label>Description</label>
          <input value={form.description||""} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="e.g. Replacement parts and spares"
            style={{ width:"100%",padding:"10px 13px",background:"#0a0f0d",border:"1.5px solid rgba(46,204,113,0.2)",borderRadius:10,color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:"0.88rem",outline:"none",boxSizing:"border-box" }} />
        </div>

        {/* Preview */}
        <div style={{ background:"#0a0f0d",border:"1px solid rgba(46,204,113,0.15)",borderRadius:12,padding:"12px 16px",marginBottom:18 }}>
          <div style={{ fontSize:"0.7rem",color:"#7aab8a",marginBottom:8,textTransform:"uppercase",letterSpacing:".07em",fontWeight:700 }}>Preview</div>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#1a2b6b,#2454c7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem" }}>{form.icon||"📦"}</div>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:"1.1rem",color:"#fff" }}>{form.name||"Category Name"}</div>
              <div style={{ fontSize:"0.73rem",color:"#7aab8a",marginTop:1 }}>{form.description||"No description"}</div>
            </div>
          </div>
        </div>

        <label style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer",marginBottom:20,color:"#7aab8a",fontSize:"0.85rem",fontFamily:"'DM Sans',sans-serif" }}>
          <input type="checkbox" checked={!!form.active} onChange={e=>setForm(f=>({...f,active:e.target.checked}))} style={{ accentColor:"#2ecc71",width:16,height:16 }} />
          Active (visible in app and product form)
        </label>

        <div style={{ display:"flex",gap:10 }}>
          <button onClick={saveForm} disabled={saving||!form.name.trim()} style={{ flex:1,padding:"11px",background:saving||!form.name.trim()?"rgba(46,204,113,0.4)":"#2ecc71",color:"#0a0f0d",border:"none",borderRadius:40,fontFamily:"'DM Sans',sans-serif",fontWeight:700,cursor:saving?"wait":"pointer" }}>{saving?"Saving…":"Save Category"}</button>
          <button onClick={()=>setEditIdx(null)} style={{ flex:1,padding:"11px",background:"rgba(255,255,255,0.05)",color:"#e8f5ec",border:"1px solid rgba(255,255,255,0.1)",borderRadius:40,fontFamily:"'DM Sans',sans-serif",fontWeight:600,cursor:"pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="section-hdr">
        <h3>🗂️ Categories ({cats.filter(c=>c.active).length} active)</h3>
        <button className="admin-btn green" onClick={()=>openEdit(-1)}>+ New Category</button>
      </div>

      {/* Info banner */}
      <div style={{ background:"rgba(46,204,113,0.06)",border:"1px solid rgba(46,204,113,0.18)",borderRadius:12,padding:"10px 16px",marginBottom:20,fontSize:"0.8rem",color:"#7aab8a",display:"flex",alignItems:"center",gap:8 }}>
        <span style={{ fontSize:"1.1rem" }}>💡</span>
        Categories created here appear in the <strong style={{ color:"#2ecc71" }}>Add/Edit Product</strong> form and in the app's <strong style={{ color:"#2ecc71" }}>Browse</strong> sections. Drag ↕ arrows to reorder.
      </div>

      {loading ? (
        <div style={{ textAlign:"center",padding:"40px 0",color:"#7aab8a" }}>Loading categories…</div>
      ) : (
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {cats.map((c,i) => (
            <div key={c.db_id||c.name||i} style={{
              background:"#131f16",border:`1px solid ${c.active?"rgba(46,204,113,0.2)":"rgba(255,255,255,0.06)"}`,
              borderRadius:14,padding:"14px 18px",display:"flex",alignItems:"center",gap:14,
              opacity:c.active?1:0.6,transition:"all .2s"
            }}>
              {/* Reorder arrows */}
              <div style={{ display:"flex",flexDirection:"column",gap:2,flexShrink:0 }}>
                <button onClick={()=>moveRow(i,-1)} disabled={i===0} style={{ background:"none",border:"none",color:i===0?"#2d3d2e":"#7aab8a",cursor:i===0?"default":"pointer",fontSize:"0.75rem",lineHeight:1,padding:"1px 4px" }}>▲</button>
                <button onClick={()=>moveRow(i,+1)} disabled={i===cats.length-1} style={{ background:"none",border:"none",color:i===cats.length-1?"#2d3d2e":"#7aab8a",cursor:i===cats.length-1?"default":"pointer",fontSize:"0.75rem",lineHeight:1,padding:"1px 4px" }}>▼</button>
              </div>

              {/* Icon */}
              <div style={{ width:46,height:46,borderRadius:12,background:"linear-gradient(135deg,#1a2b6b,#2454c7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",flexShrink:0 }}>{c.icon||"📦"}</div>

              {/* Info */}
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1rem",fontWeight:800,color:"#fff" }}>{c.name}</div>
                  {!c.active && <span style={{ fontSize:"0.65rem",background:"rgba(255,100,100,0.15)",border:"1px solid rgba(255,100,100,0.4)",color:"#ff8080",borderRadius:20,padding:"1px 8px",fontWeight:700 }}>HIDDEN</span>}
                </div>
                <div style={{ fontSize:"0.74rem",color:"#7aab8a",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{c.description||"No description"}</div>
              </div>

              {/* Actions */}
              <div style={{ display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
                <label style={{ display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:"0.75rem",color:c.active?"#2ecc71":"#7aab8a" }}>
                  <input type="checkbox" checked={!!c.active} onChange={()=>toggleActive(i)} style={{ accentColor:"#2ecc71" }} />
                  {c.active?"Live":"Off"}
                </label>
                <button className="admin-btn blue sm" onClick={()=>openEdit(i)}>✏️ Edit</button>
                <button className="admin-btn red sm" onClick={()=>deleteCat(i)} disabled={!!deleting}>{deleting===i?"…":"🗑️"}</button>
              </div>
            </div>
          ))}

          {cats.length === 0 && (
            <div className="empty-state">
              <div className="es-icon">🗂️</div>
              <div className="es-title">No Categories Yet</div>
              <p>Click "New Category" to add your first one.</p>
            </div>
          )}
        </div>
      )}
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

  const pageTitle = { dashboard:"Dashboard", products:"Products", offers:"Offers", banners:"Banners", users:"Users", categories:"Categories" };
  const navItems = [
    { group:"Overview", items:[["dashboard","📊","Dashboard"]] },
    { group:"Catalog", items:[["products","🛒","Products"],["categories","🗂️","Categories"],["offers","🏷️","Offers"]] },
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
                  {page==="users" && <span className="admin-link-badge">{users.length}</span>}                </button>
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
          {adminPage==="categories" && <AdminCategories showToast={showToast} />}
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
  const [categories, setCategories] = useState(["Drones","Batteries","Flight Controller","Accessories"]);
  const [catLoading, setCatLoading] = useState(true);
  const [newCatMode, setNewCatMode] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("📦");
  const [addingCat, setAddingCat] = useState(false);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  useEffect(() => {
    sbGetCategories()
      .then(rows => {
        if (rows && rows.length) {
          setCategories(rows.filter(r=>r.active!==false).map(r=>r.name));
          // If product's current category isn't in list, keep it
          if (product?.category && !rows.find(r=>r.name===product.category)) {
            setCategories(prev => [product.category, ...prev]);
          }
        }
        setCatLoading(false);
      })
      .catch(() => setCatLoading(false));
  }, []);

  // Auto-select first category if form has none
  useEffect(() => {
    if (!form.category && categories.length) set("category", categories[0]);
  }, [categories]);

  const addQuickCategory = async () => {
    if (!newCatName.trim()) return;
    setAddingCat(true);
    try {
      const rows = await sbUpsertCategory({ name: newCatName.trim(), icon: newCatIcon, sort_order: categories.length, active: true });
      const saved = Array.isArray(rows) ? rows[0] : rows;
      const name = saved?.name || newCatName.trim();
      setCategories(prev => [...prev, name]);
      set("category", name);
      setNewCatName(""); setNewCatIcon("📦"); setNewCatMode(false);
    } catch {}
    setAddingCat(false);
  };

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

        {/* ── Category selector ── */}
        <div className="modal-field">
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5 }}>
            <label style={{ margin:0 }}>Category</label>
            <button onClick={()=>setNewCatMode(v=>!v)} style={{
              background:"rgba(46,204,113,0.1)",border:"1px solid rgba(46,204,113,0.3)",color:"#2ecc71",
              borderRadius:20,padding:"3px 10px",fontSize:"0.7rem",fontWeight:700,cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif"
            }}>{newCatMode ? "✕ Cancel" : "+ New Category"}</button>
          </div>

          {/* Quick add new category inline */}
          {newCatMode && (
            <div style={{ background:"rgba(46,204,113,0.06)",border:"1px solid rgba(46,204,113,0.2)",borderRadius:10,padding:"10px 12px",marginBottom:10 }}>
              <div style={{ fontSize:"0.72rem",color:"#7aab8a",fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:".06em" }}>Quick-add Category</div>
              <div style={{ display:"flex",gap:8,marginBottom:8 }}>
                <input value={newCatIcon} onChange={e=>setNewCatIcon(e.target.value)} placeholder="📦"
                  style={{ width:44,padding:"8px",background:"#0a0f0d",border:"1.5px solid rgba(46,204,113,0.2)",borderRadius:8,color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:"1.1rem",textAlign:"center",outline:"none" }} />
                <input value={newCatName} onChange={e=>setNewCatName(e.target.value)}
                  placeholder="e.g. Spare Parts" onKeyDown={e=>e.key==="Enter"&&addQuickCategory()}
                  style={{ flex:1,padding:"8px 12px",background:"#0a0f0d",border:"1.5px solid rgba(46,204,113,0.2)",borderRadius:8,color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:"0.88rem",outline:"none" }} />
              </div>
              <button onClick={addQuickCategory} disabled={addingCat||!newCatName.trim()} style={{
                width:"100%",padding:"8px",background:addingCat||!newCatName.trim()?"rgba(46,204,113,0.3)":"#2ecc71",
                color:"#0a0f0d",border:"none",borderRadius:8,fontFamily:"'DM Sans',sans-serif",
                fontWeight:700,fontSize:"0.82rem",cursor:addingCat?"wait":"pointer"
              }}>{addingCat?"Adding…":"✅ Add & Select"}</button>
            </div>
          )}

          {catLoading ? (
            <div style={{ padding:"10px 12px",background:"#0a0f0d",border:"1.5px solid rgba(46,204,113,0.2)",borderRadius:10,color:"#7aab8a",fontSize:"0.85rem" }}>Loading categories…</div>
          ) : (
            <select value={form.category} onChange={e=>set("category",e.target.value)}
              size={Math.min(categories.length, 6)}
              style={{ width:"100%",background:"#0a0f0d",border:"1.5px solid rgba(46,204,113,0.2)",
                borderRadius:10,color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:"0.88rem",outline:"none",
                boxSizing:"border-box",minHeight:44,padding:0,cursor:"pointer",overflowY:"auto" }}>
              {categories.map(c => (
                <option key={c} value={c} style={{ padding:"8px 12px",background: form.category===c?"#1a4d2e":"#0a0f0d",color:"#fff",fontSize:"0.88rem" }}>{c}</option>
              ))}
            </select>
          )}
          <div style={{ fontSize:"0.72rem",color:"#7aab8a",marginTop:5 }}>
            Selected: <strong style={{ color:"#2ecc71" }}>{form.category || "—"}</strong>
            &nbsp;·&nbsp;{categories.length} categor{categories.length!==1?"ies":"y"} available
          </div>
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
  const [splash, setSplash] = useState(true);
  const [splashOut, setSplashOut] = useState(false);
  const [tab, setTab] = useState("home");
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(() => loadSession());
  const [toastEl, showToast] = useToast();
  const [banners, setBanners] = useState(DEFAULT_BANNERS);
  const [showAdmin, setShowAdmin] = useState(false);
  const [products, setProducts] = useState(STATIC_PRODUCTS);

  // ── Splash screen: show 2.8s then fade out ──
  useEffect(() => {
    const fadeTimer  = setTimeout(() => setSplashOut(true), 2400);
    const hideTimer  = setTimeout(() => setSplash(false),   3000);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

  // ── Load banners from Supabase on mount ──
  useEffect(() => {
    sbGetBanners().then(rows => {
      if (rows && rows.length) {
        setBanners(rows.map(r => ({
          id: r.id, db_id: r.id,
          title: r.title, subtitle: r.subtitle, badge: r.badge,
          bg: r.bg, emoji: r.emoji, cta: r.cta,
          imageUrl: r.image_url || "",
          linkCategory: r.link_category || "",
          sort_order: r.sort_order || 0,
          active: r.active !== false,
        })));
      }
    }).catch(() => {});
  }, []);
  const [modalProduct, setModalProduct] = useState(null);
  // Stack so similar-product clicks create a back-navigable history
  const [productHistory, setProductHistory] = useState([]);

  const openProduct = (p) => {
    if (modalProduct) setProductHistory(h => [...h, modalProduct]);
    setModalProduct(p);
    window.history.pushState({ pdModal: true }, "");
  };

  const closeModal = () => {
    if (productHistory.length > 0) {
      const prev = productHistory[productHistory.length - 1];
      setProductHistory(h => h.slice(0, -1));
      setModalProduct(prev);
    } else {
      setModalProduct(null);
      setProductHistory([]);
    }
  };

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
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body{overflow-x:hidden;}

        /* ── Splash ── */
        @keyframes splashLogoIn {
          0%   { opacity:0; transform: scale(0.82); }
          60%  { opacity:1; transform: scale(1.04); }
          100% { opacity:1; transform: scale(1); }
        }
        @keyframes splashFadeOut {
          0%   { opacity:1; }
          100% { opacity:0; pointer-events:none; }
        }
        .splash-wrap {
          position:fixed; inset:0; z-index:9999;
          background:#ffffff;
          display:flex;
          align-items:center; justify-content:center;
        }
        .splash-wrap.out { animation: splashFadeOut 0.55s ease forwards; }
        .splash-logo-img {
          width: 72vw;
          max-width: 340px;
          height: auto;
          animation: splashLogoIn 0.75s cubic-bezier(.22,1,.36,1) 0.15s both;
          mix-blend-mode: multiply;
        }
      `}</style>

      {/* ── Splash Screen ── */}
      {splash && (
        <div className={`splash-wrap${splashOut ? " out" : ""}`}>
          <img src={SAG_LOGO_B64} className="splash-logo-img" alt="SAG" />
        </div>
      )}

      {tab === "home" && (
        <HomePage user={user} cart={cart} showAuth={()=>{}} showToast={showToast} onTabChange={setTab}
          banners={banners} setBanners={setBanners} addToCart={addToCart} />
      )}
      {tab === "categories" && (
        <CategoriesPage products={products} onProductClick={openProduct} onAddCart={addToCart} user={user} />
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
        <ProductDetailModal product={modalProduct} onClose={closeModal}
          onAddCart={addToCart} allProducts={products}
          onSimilarClick={openProduct}
          user={user} showAuth={()=>{closeModal();setProductHistory([]);setModalProduct(null);setTab("account");}} />
      )}

      {(user?.email||"").toLowerCase() === ADMIN_EMAIL && (
        <div style={{ position:"fixed",bottom:72,right:16,zIndex:99 }}>
          <button onClick={()=>setShowAdmin(true)} style={{ background:"rgba(10,15,13,0.9)",border:"1px solid rgba(46,204,113,0.2)",color:"#7aab8a",padding:"7px 13px",borderRadius:40,fontSize:"0.72rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",backdropFilter:"blur(6px)" }}>⚙ Admin</button>
        </div>
      )}
    </div>
  );
}
