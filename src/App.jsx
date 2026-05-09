import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = "https://mefmpxohxrpnezwlbchj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZm1weG9oeHJwbmV6d2xiY2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMTk3MjEsImV4cCI6MjA5Mjc5NTcyMX0.PbTag81xO1_X8vuxkizhVYjfhj3lz5CO3yjn8zlnNoM";
const LOGO = "https://framerusercontent.com/images/J2SsjH2XcUHn6jAVX44tSmKJ8.png";

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
function loadSession() { try { return JSON.parse(localStorage.getItem("sag_sb_session") || "null"); } catch { return null; } }
function clearSession() { localStorage.removeItem("sag_sb_session"); }

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
      const session = { id: data.user.id, name: displayName, email: data.user.email, accessToken: data.access_token };
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
function CartDrawer({ open, onClose, cart, setCart, user, showAuth }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const updateQty = (id, delta) => setCart(c => c.map(i => i.id===id ? {...i,qty:Math.max(1,i.qty+delta)} : i));
  const remove = (id) => setCart(c => c.filter(i => i.id !== id));

  const checkout = () => {
    if (!user) { onClose(); showAuth(); return; }
    const lines = cart.map(i => `• ${i.name} x${i.qty} — ${formatINR(i.price*i.qty)}`).join("\n");
    const msg = `🛒 *Cart Enquiry — SAG Drone Technologies*\n\n👤 *Customer:* ${user.name}\n✉️ *Email:* ${user.email||''}\n\n*Items:*\n${lines}\n\n💰 *Total: ${formatINR(total)}*\n\nPlease confirm availability. Thank you!`;
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
                  <button onClick={() => updateQty(item.id,-1)} style={{ width:24,height:24,borderRadius:"50%",border:"1px solid rgba(46,204,113,0.3)",background:"#0a0f0d",color:"#e8f5ec",cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center" }}>−</button>
                  <span style={{ fontSize:"0.88rem",fontWeight:600,color:"#fff",minWidth:18,textAlign:"center" }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id,1)} style={{ width:24,height:24,borderRadius:"50%",border:"1px solid rgba(46,204,113,0.3)",background:"#0a0f0d",color:"#e8f5ec",cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center" }}>+</button>
                </div>
              </div>
              <button onClick={() => remove(item.id)} style={{ background:"none",border:"none",color:"#7aab8a",cursor:"pointer",fontSize:"1rem",alignSelf:"flex-start" }}>✕</button>
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
function BannerCarousel({ banners }) {
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
    <div style={{ margin:"12px 14px 0",borderRadius:14,overflow:"hidden",position:"relative" }}>
      <div style={{
        background: b.bg, minHeight:170,padding:"22px 20px",
        display:"flex",flexDirection:"column",justifyContent:"center",position:"relative"
      }}>
        {/* Badge */}
        <div style={{ display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.18)",borderRadius:20,padding:"3px 10px",fontSize:"0.68rem",fontWeight:800,color:"#fff",letterSpacing:".08em",marginBottom:10,width:"fit-content" }}>
          🔥 {b.badge}
        </div>
        {/* Big emoji decoration */}
        <div style={{ position:"absolute",right:20,top:"50%",transform:"translateY(-50%)",fontSize:"5rem",opacity:.25 }}>{b.emoji}</div>
        {/* Title */}
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"2.2rem",fontWeight:900,color:"#fff",lineHeight:1,marginBottom:6,letterSpacing:"-0.02em" }}>
          {b.title}
        </div>
        <div style={{ fontSize:"0.88rem",color:"rgba(255,255,255,0.85)",marginBottom:14 }}>{b.subtitle}</div>
        <button style={{ alignSelf:"flex-start",background:"#fff",color:"#0a0f0d",border:"none",borderRadius:40,padding:"8px 18px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.83rem",cursor:"pointer" }}>
          {b.cta} →
        </button>
      </div>
      {/* Dots */}
      <div style={{ display:"flex",justifyContent:"center",gap:6,padding:"8px 0",background:"rgba(0,0,0,0.4)" }}>
        {banners.map((_,i) => (
          <div key={i} onClick={() => goTo(i)} style={{
            width: i===idx ? 18 : 6, height:6, borderRadius:3,
            background: i===idx ? "#fff" : "rgba(255,255,255,0.35)",
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
  const [form, setForm] = useState({ title:"", subtitle:"", badge:"", bg:"linear-gradient(135deg,#0d3a8e 0%,#1a56cc 60%,#0d3a8e 100%)", emoji:"🚁", cta:"Shop Now" });

  const openEdit = (i) => {
    setEditIdx(i);
    setForm(i === -1 ? { title:"", subtitle:"", badge:"", bg:"linear-gradient(135deg,#0d3a8e 0%,#1a56cc 60%,#0d3a8e 100%)", emoji:"🚁", cta:"Shop Now" } : {...list[i]});
  };

  const saveForm = () => {
    if (!form.title.trim()) return;
    if (editIdx === -1) {
      setList(l => [...l, { ...form, id: Date.now() }]);
    } else {
      setList(l => l.map((b,i) => i===editIdx ? {...form, id:b.id} : b));
    }
    setEditIdx(null);
  };

  const deleteB = (i) => setList(l => l.filter((_,x) => x !== i));

  return (
    <div style={{ position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.88)",backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center" }}
      onClick={e => e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#131f16",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:520,maxHeight:"88vh",overflowY:"auto",padding:"0 0 20px" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 18px",borderBottom:"1px solid rgba(46,204,113,0.15)" }}>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.1rem",fontWeight:800,color:"#fff" }}>🖼 Manage Banners</span>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"#7aab8a",fontSize:"1.3rem",cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ padding:"14px 18px" }}>
          {editIdx !== null ? (
            <div>
              <div style={{ fontSize:"0.88rem",fontWeight:700,color:"#fff",marginBottom:12 }}>{editIdx===-1?"Add New Banner":"Edit Banner"}</div>
              {[
                ["Title","title","e.g. SALE IS LIVE"],
                ["Subtitle","subtitle","e.g. Up to 20% off on Drones"],
                ["Badge Text","badge","e.g. LIMITED TIME"],
                ["Emoji","emoji","e.g. 🚁"],
                ["CTA Button","cta","e.g. Shop Now"],
              ].map(([label,key,ph]) => (
                <div key={key} style={{ marginBottom:10 }}>
                  <label style={{ fontSize:"0.7rem",color:"#7aab8a",fontWeight:700,textTransform:"uppercase",display:"block",marginBottom:4 }}>{label}</label>
                  <input value={form[key]} onChange={e => setForm(f => ({...f,[key]:e.target.value}))} placeholder={ph}
                    style={{ width:"100%",padding:"9px 12px",background:"#0a0f0d",border:"1.5px solid rgba(46,204,113,0.2)",borderRadius:10,color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:"0.88rem",outline:"none",boxSizing:"border-box" }} />
                </div>
              ))}
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:"0.7rem",color:"#7aab8a",fontWeight:700,textTransform:"uppercase",display:"block",marginBottom:4 }}>Background CSS Gradient</label>
                <input value={form.bg} onChange={e => setForm(f => ({...f,bg:e.target.value}))} placeholder="linear-gradient(135deg,#0d3a8e 0%,#1a56cc 100%)"
                  style={{ width:"100%",padding:"9px 12px",background:"#0a0f0d",border:"1.5px solid rgba(46,204,113,0.2)",borderRadius:10,color:"#fff",fontFamily:"monospace",fontSize:"0.8rem",outline:"none",boxSizing:"border-box" }} />
                <div style={{ height:28,borderRadius:6,marginTop:6,background:form.bg }} />
              </div>
              <div style={{ display:"flex",gap:10 }}>
                <button onClick={saveForm} style={{ flex:1,padding:"11px",background:"#2ecc71",color:"#0a0f0d",border:"none",borderRadius:40,fontFamily:"'DM Sans',sans-serif",fontWeight:700,cursor:"pointer" }}>Save Banner</button>
                <button onClick={()=>setEditIdx(null)} style={{ flex:1,padding:"11px",background:"rgba(255,255,255,0.05)",color:"#e8f5ec",border:"1px solid rgba(255,255,255,0.1)",borderRadius:40,fontFamily:"'DM Sans',sans-serif",fontWeight:600,cursor:"pointer" }}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              {list.map((b,i) => (
                <div key={b.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid rgba(46,204,113,0.08)" }}>
                  <div style={{ width:44,height:44,borderRadius:10,background:b.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",flexShrink:0 }}>{b.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700,fontSize:"0.88rem",color:"#fff" }}>{b.title}</div>
                    <div style={{ fontSize:"0.75rem",color:"#7aab8a" }}>{b.subtitle}</div>
                  </div>
                  <button onClick={()=>openEdit(i)} style={{ background:"rgba(58,154,217,0.15)",border:"1px solid #3a9ad9",color:"#3a9ad9",borderRadius:8,padding:"5px 11px",fontSize:"0.76rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:700 }}>Edit</button>
                  <button onClick={()=>deleteB(i)} style={{ background:"rgba(224,80,80,0.12)",border:"1px solid #e05050",color:"#e05050",borderRadius:8,padding:"5px 8px",fontSize:"0.76rem",cursor:"pointer" }}>✕</button>
                </div>
              ))}
              <button onClick={()=>openEdit(-1)} style={{ width:"100%",marginTop:14,padding:"11px",background:"rgba(46,204,113,0.1)",color:"#2ecc71",border:"1.5px dashed rgba(46,204,113,0.4)",borderRadius:12,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.88rem",cursor:"pointer" }}>
                + Add New Banner
              </button>
              <button onClick={()=>onSave(list)} style={{ width:"100%",marginTop:10,padding:"11px",background:"#2ecc71",color:"#0a0f0d",border:"none",borderRadius:40,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.9rem",cursor:"pointer" }}>
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
function HomePage({ user, cart, setCart, showAuth, showToast, onTabChange, banners, setBanners }) {
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [modalProduct, setModalProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [localUser, setLocalUser] = useState(user);
  const [bannerAdminOpen, setBannerAdminOpen] = useState(false);
  const [showBannerHint, setShowBannerHint] = useState(false);

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

  const addToCart = (product) => {
    setCart(c => {
      const ex = c.find(i => i.id===product.id);
      if (ex) return c.map(i => i.id===product.id ? {...i,qty:i.qty+1} : i);
      return [...c, {...product,qty:1}];
    });
    showToast("success", `✅ "${product.name}" added to cart!`);
  };

  const cartCount = cart.reduce((s,i) => s+i.qty, 0);

  // Featured sections
  const featuredDrones = products.filter(p => p.category==="Drones").slice(0,3);
  const featuredBatteries = products.filter(p => p.category==="Batteries").slice(0,3);
  const offers = products.filter(p => p.isOffer).slice(0,4);

  return (
    <div style={{ background:"#0a0f0d",minHeight:"100vh",paddingBottom:70,fontFamily:"'DM Sans',sans-serif" }}>

      {/* ─── TOP BAR ─── */}
      <div style={{
        position:"sticky",top:0,zIndex:100,
        background:"linear-gradient(135deg,#0d3a8e 0%,#1760d8 100%)",
        padding:"10px 14px 0"
      }}>
        {/* Logo row */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <img src={LOGO} alt="SAG" style={{ height:34,borderRadius:6 }} />
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:"0.95rem",color:"#fff",lineHeight:1 }}>SAG DRONES</div>
              <div style={{ fontSize:"0.64rem",color:"rgba(255,255,255,0.75)",lineHeight:1 }}>Nidadavole, AP</div>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            {/* Banner admin hint */}
            {localUser && (
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

        {/* Search bar */}
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

        {/* Category chips */}
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

        {/* Promotional Banner Carousel */}
        <BannerCarousel banners={banners} />

        {search || activeCat !== "All" ? (
          /* ── FILTERED RESULTS ── */
          <div style={{ padding:"16px 14px 8px" }}>
            <div style={{ fontSize:"0.82rem",color:"#7aab8a",marginBottom:12 }}>
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
            {/* ── FEATURED DRONES ── */}
            <SectionBlock title="🚁 Drones" subtitle="Agricultural drones for every farm" products={featuredDrones}
              onProductClick={setModalProduct} onAddCart={(p) => { if(!localUser){setAuthOpen(true);return;} addToCart(p); }} user={localUser}
              onViewAll={() => setActiveCat("Drones")} />

            {/* ── HOT OFFERS ── */}
            {offers.length > 0 && (
              <SectionBlock title="🏷️ Hot Deals" subtitle="Best prices on top products" products={offers}
                onProductClick={setModalProduct} onAddCart={(p) => { if(!localUser){setAuthOpen(true);return;} addToCart(p); }} user={localUser}
                onViewAll={() => setActiveCat("Offers")} accent="#f0a030" />
            )}

            {/* ── BATTERIES ── */}
            <SectionBlock title="🔋 Batteries" subtitle="SAG VOLT Plus series & chargers" products={featuredBatteries}
              onProductClick={setModalProduct} onAddCart={(p) => { if(!localUser){setAuthOpen(true);return;} addToCart(p); }} user={localUser}
              onViewAll={() => setActiveCat("Batteries")} />

            {/* ── ALL PRODUCTS ── */}
            <div style={{ padding:"0 14px 8px" }}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
                <div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.25rem",fontWeight:800,color:"#fff" }}>All Products</div>
                  <div style={{ fontSize:"0.75rem",color:"#7aab8a",marginTop:1 }}>{products.length} items available</div>
                </div>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                {products.map(p => <ProductCard key={p.id} p={p} onClick={() => setModalProduct(p)} onAddCart={() => { if(!localUser){setAuthOpen(true);return;} addToCart(p); }} user={localUser} />)}
              </div>
            </div>
          </>
        )}

        {/* Footer info */}
        <div style={{ padding:"20px 14px",borderTop:"1px solid rgba(46,204,113,0.1)",marginTop:10 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
            <img src={LOGO} alt="SAG" style={{ height:28 }} />
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"0.9rem",fontWeight:800,color:"#fff" }}>SAG Drone Technologies</span>
          </div>
          <div style={{ fontSize:"0.78rem",color:"#7aab8a",lineHeight:1.9 }}>
            📍 Nidadavole, Andhra Pradesh – 534 302<br />
            📞 +91 897777 6019 &nbsp;|&nbsp; ✉️ sagtechinfo@gmail.com
          </div>
          <div style={{ fontSize:"0.72rem",color:"rgba(122,171,138,0.5)",marginTop:10,textAlign:"center" }}>
            © 2025 SAG Drone Technologies. All rights reserved.
          </div>
        </div>

      </div>

      {/* Modals */}
      {cartOpen && <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setCart={setCart} user={localUser} showAuth={() => setAuthOpen(true)} />}
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
    <div style={{ margin:"16px 0 0",background:"rgba(13,31,22,0.7)",borderRadius:"0 0 0 0",padding:"14px 0 4px" }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 14px",marginBottom:12 }}>
        <div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.25rem",fontWeight:800,color:"#fff" }}>{title}</div>
          <div style={{ fontSize:"0.74rem",color:"#7aab8a",marginTop:1 }}>{subtitle}</div>
        </div>
        <button onClick={onViewAll} style={{ background:`rgba(${accent==="#2ecc71"?"46,204,113":"240,160,48"},0.15)`,border:`1px solid ${accent}33`,color:accent,borderRadius:20,padding:"5px 12px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.75rem",cursor:"pointer" }}>
          View All →
        </button>
      </div>
      <div style={{ display:"flex",gap:10,overflowX:"auto",padding:"0 14px 10px",scrollbarWidth:"none" }}>
        {products.map(p => (
          <div key={p.id} style={{ flexShrink:0,width:150 }}>
            <ProductCard p={p} onClick={() => onProductClick(p)} onAddCart={() => onAddCart(p)} user={user} compact />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────
function ProductCard({ p, onClick, onAddCart, user, compact }) {
  const off = discount(p.price, p.originalPrice);
  return (
    <div onClick={onClick} style={{
      background:"#131f16",border:"1px solid rgba(46,204,113,0.12)",borderRadius:12,
      overflow:"hidden",cursor:"pointer",display:"flex",flexDirection:"column",
      transition:"border-color .2s", position:"relative"
    }}>
      {(p.isNew||p.isOffer) && (
        <div style={{
          position:"absolute",top:7,left:7,zIndex:2,background:p.isNew?"#2ecc71":"#f0a030",
          color:"#0a0f0d",fontSize:"0.58rem",fontWeight:800,padding:"2px 7px",borderRadius:20,textTransform:"uppercase"
        }}>{p.isNew?"New":"Sale"}</div>
      )}
      <div style={{ width:"100%",aspectRatio:"4/3",overflow:"hidden",background:"#0d1a10" }}>
        {p.image && <img src={p.image} alt={p.name} loading="lazy" style={{ width:"100%",height:"100%",objectFit:"cover" }} />}
      </div>
      <div style={{ padding: compact ? "8px 9px 6px" : "10px 12px 6px",flex:1 }}>
        <div style={{ fontSize:"0.62rem",fontWeight:700,color:"#2ecc71",letterSpacing:".06em",textTransform:"uppercase",marginBottom:2,opacity:.8 }}>{p.category||"Product"}</div>
        <div style={{ fontSize: compact ? "0.78rem" : "0.86rem",fontWeight:600,color:"#fff",lineHeight:1.3,marginBottom:6,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{p.name}</div>
        <div style={{ display:"flex",alignItems:"baseline",gap:5,flexWrap:"wrap",marginBottom: compact ? 0 : 4 }}>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize: compact ? "0.95rem" : "1.1rem",fontWeight:800,color:"#2ecc71" }}>{formatINR(p.price)}</span>
          {off && <span style={{ fontSize:"0.62rem",background:"rgba(46,204,113,0.15)",border:"1px solid rgba(46,204,113,0.3)",color:"#2ecc71",padding:"1px 5px",borderRadius:10,fontWeight:700 }}>{off}%</span>}
        </div>
        {p.originalPrice && !compact && <div style={{ fontSize:"0.73rem",color:"#7aab8a",textDecoration:"line-through",marginBottom:4 }}>{formatINR(p.originalPrice)}</div>}
      </div>
      {!compact && (
        <div style={{ padding:"6px 12px 12px",display:"flex",gap:8 }} onClick={e=>e.stopPropagation()}>
          <button onClick={onAddCart} style={{
            flex:1,background:"#2ecc71",color:"#0a0f0d",border:"none",borderRadius:30,
            padding:"8px 10px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.78rem",cursor:"pointer"
          }}>🛒 {user?"Add":"Sign in"}</button>
          <a href={waLink(p.waNum||"919390238537",`Hello SAG! I'm interested in ${p.name} (${formatINR(p.price)})`)} target="_blank" rel="noreferrer"
            style={{ border:"1.5px solid rgba(46,204,113,0.3)",background:"none",color:"#2ecc71",borderRadius:30,padding:"8px 10px",cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",textDecoration:"none" }}>
            💬
          </a>
        </div>
      )}
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
    <div style={{ background:"#0a0f0d",minHeight:"100vh",paddingBottom:70,fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:"linear-gradient(135deg,#0d3a8e 0%,#1760d8 100%)",padding:"16px 16px 14px" }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.5rem",fontWeight:800,color:"#fff" }}>Categories</div>
        <div style={{ fontSize:"0.78rem",color:"rgba(255,255,255,0.75)",marginTop:2 }}>Browse by product type</div>
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
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.15rem",fontWeight:800,color:"#fff" }}>{cat}</div>
                  <div style={{ fontSize:"0.73rem",color:"#7aab8a" }}>{catDescs[cat]} · {items.length} items</div>
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
  const cartCount = cart.reduce((s,i) => s+i.qty, 0);
  const cartTotal = cart.reduce((s,i) => s+i.price*i.qty, 0);

  return (
    <div style={{ background:"#0a0f0d",minHeight:"100vh",paddingBottom:70,fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:"linear-gradient(135deg,#0d3a8e 0%,#1760d8 100%)",padding:"16px 16px 24px" }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.5rem",fontWeight:800,color:"#fff",marginBottom:2 }}>Account</div>
        {user ? (
          <div style={{ display:"flex",alignItems:"center",gap:12,marginTop:12 }}>
            <div style={{ width:52,height:52,borderRadius:"50%",background:"#2ecc71",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:"1.4rem",color:"#0a0f0d" }}>
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight:700,fontSize:"1rem",color:"#fff" }}>{user.name}</div>
              <div style={{ fontSize:"0.78rem",color:"rgba(255,255,255,0.7)" }}>{user.email}</div>
            </div>
          </div>
        ) : (
          <div style={{ fontSize:"0.85rem",color:"rgba(255,255,255,0.75)",marginTop:4 }}>Sign in to access your account</div>
        )}
      </div>

      <div style={{ padding:"16px 14px" }}>
        {!user ? (
          <div style={{ textAlign:"center",paddingTop:20 }}>
            <div style={{ fontSize:"3.5rem",marginBottom:12 }}>👤</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.4rem",fontWeight:800,color:"#fff",marginBottom:6 }}>Not signed in</div>
            <div style={{ fontSize:"0.85rem",color:"#7aab8a",marginBottom:22 }}>Sign in to track orders and enquire faster</div>
            <button onClick={() => setAuthOpen(true)} style={{
              background:"#2ecc71",color:"#0a0f0d",border:"none",borderRadius:40,padding:"13px 36px",
              fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.95rem",cursor:"pointer"
            }}>Sign In / Register</button>
          </div>
        ) : (
          <>
            {/* Cart summary */}
            {cartCount > 0 && (
              <div style={{ background:"#131f16",border:"1px solid rgba(46,204,113,0.15)",borderRadius:12,padding:"14px 16px",marginBottom:14 }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <div>
                    <div style={{ fontWeight:700,fontSize:"0.9rem",color:"#fff",marginBottom:2 }}>🛒 Cart</div>
                    <div style={{ fontSize:"0.78rem",color:"#7aab8a" }}>{cartCount} item{cartCount!==1?"s":""} · {formatINR(cartTotal)}</div>
                  </div>
                  <a href={`https://wa.me/919390238537?text=${encodeURIComponent(`Hello SAG! I have ${cartCount} items in my cart worth ${formatINR(cartTotal)}.`)}`}
                    target="_blank" rel="noreferrer"
                    style={{ background:"#2ecc71",color:"#0a0f0d",border:"none",borderRadius:20,padding:"7px 14px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.78rem",cursor:"pointer",textDecoration:"none" }}>
                    Enquire 💬
                  </a>
                </div>
              </div>
            )}

            {/* Menu items */}
            {[
              ["📦","My Orders","View past enquiries via WhatsApp"],
              ["📍","Delivery Address","Nidadavole, Andhra Pradesh"],
              ["💬","WhatsApp Support","Chat with our team directly"],
              ["📞","Call Us","+91 897777 6019"],
            ].map(([icon,label,sub]) => (
              <div key={label} style={{ display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:"#131f16",border:"1px solid rgba(46,204,113,0.1)",borderRadius:12,marginBottom:10,cursor:"pointer" }}>
                <span style={{ fontSize:"1.3rem" }}>{icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600,fontSize:"0.88rem",color:"#fff" }}>{label}</div>
                  <div style={{ fontSize:"0.75rem",color:"#7aab8a" }}>{sub}</div>
                </div>
                <span style={{ color:"#7aab8a",fontSize:"0.8rem" }}>›</span>
              </div>
            ))}

            <button onClick={onLogout} style={{
              width:"100%",marginTop:8,padding:"13px",background:"rgba(224,80,80,0.1)",
              border:"1px solid rgba(224,80,80,0.3)",color:"#e05050",borderRadius:12,
              fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.88rem",cursor:"pointer"
            }}>⏏ Sign Out</button>
          </>
        )}
      </div>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onLogin={(session) => { saveSession(session); onLogin(session); showToast("success","✅ Welcome, "+session.name+"!"); setAuthOpen(false); }} />}
    </div>
  );
}

// ─── CART PAGE ─────────────────────────────────────────────────
function CartPage({ cart, setCart, user, showAuth, showToast }) {
  const total = cart.reduce((s,i) => s+i.price*i.qty, 0);
  const updateQty = (id, delta) => setCart(c => c.map(i => i.id===id ? {...i,qty:Math.max(1,i.qty+delta)} : i));
  const remove = (id) => setCart(c => c.filter(i => i.id !== id));

  const checkout = () => {
    if (!user) { showAuth(); return; }
    const lines = cart.map(i => `• ${i.name} x${i.qty} — ${formatINR(i.price*i.qty)}`).join("\n");
    const msg = `🛒 *Cart Enquiry — SAG Drone Technologies*\n\n👤 *Customer:* ${user.name}\n✉️ *Email:* ${user.email||''}\n\n*Items:*\n${lines}\n\n💰 *Total: ${formatINR(total)}*\n\nPlease confirm availability. Thank you!`;
    window.open(`https://wa.me/919390238537?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div style={{ background:"#0a0f0d",minHeight:"100vh",paddingBottom:100,fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:"linear-gradient(135deg,#0d3a8e 0%,#1760d8 100%)",padding:"16px 16px 14px" }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.5rem",fontWeight:800,color:"#fff" }}>My Cart</div>
        <div style={{ fontSize:"0.78rem",color:"rgba(255,255,255,0.75)",marginTop:2 }}>{cart.reduce((s,i)=>s+i.qty,0)} items</div>
      </div>

      <div style={{ padding:"14px 14px" }}>
        {cart.length === 0 ? (
          <div style={{ textAlign:"center",paddingTop:40 }}>
            <div style={{ fontSize:"4rem",opacity:.3,marginBottom:12 }}>🛒</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.4rem",fontWeight:800,color:"#fff",marginBottom:6 }}>Your cart is empty</div>
            <div style={{ fontSize:"0.85rem",color:"#7aab8a" }}>Add products from the store to get started</div>
          </div>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.id} style={{ display:"flex",gap:12,padding:"12px",background:"#131f16",border:"1px solid rgba(46,204,113,0.1)",borderRadius:12,marginBottom:10 }}>
                <div style={{ width:72,height:72,borderRadius:10,overflow:"hidden",background:"#0a0f0d",flexShrink:0 }}>
                  {item.image && <img src={item.image} alt={item.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} />}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"0.84rem",fontWeight:600,color:"#fff",marginBottom:3,lineHeight:1.3 }}>{item.name}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1rem",fontWeight:800,color:"#2ecc71",marginBottom:8 }}>{formatINR(item.price*item.qty)}</div>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <button onClick={() => updateQty(item.id,-1)} style={{ width:28,height:28,borderRadius:"50%",border:"1.5px solid rgba(46,204,113,0.3)",background:"#0a0f0d",color:"#e8f5ec",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem" }}>−</button>
                    <span style={{ fontSize:"0.9rem",fontWeight:700,color:"#fff",minWidth:20,textAlign:"center" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id,1)} style={{ width:28,height:28,borderRadius:"50%",border:"1.5px solid rgba(46,204,113,0.3)",background:"#0a0f0d",color:"#e8f5ec",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem" }}>+</button>
                  </div>
                </div>
                <button onClick={() => remove(item.id)} style={{ background:"none",border:"none",color:"#7aab8a",cursor:"pointer",fontSize:"1.1rem",alignSelf:"flex-start" }}>✕</button>
              </div>
            ))}

            <div style={{ background:"#131f16",border:"1px solid rgba(46,204,113,0.15)",borderRadius:12,padding:"14px 16px",marginTop:8 }}>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#7aab8a",marginBottom:6 }}>
                <span>Subtotal ({cart.reduce((s,i)=>s+i.qty,0)} items)</span>
                <span style={{ color:"#fff",fontWeight:600 }}>{formatINR(total)}</span>
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:"0.85rem",color:"#7aab8a",marginBottom:12 }}>
                <span>Delivery</span><span style={{ color:"#2ecc71",fontWeight:600 }}>Contact for quote</span>
              </div>
              <div style={{ height:1,background:"rgba(46,204,113,0.1)",marginBottom:12 }} />
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:14 }}>
                <span style={{ fontWeight:700,fontSize:"0.9rem",color:"#fff" }}>Total</span>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.4rem",fontWeight:800,color:"#fff" }}>{formatINR(total)}</span>
              </div>
              <button onClick={checkout} style={{
                width:"100%",padding:"13px",background:"#2ecc71",color:"#0a0f0d",border:"none",borderRadius:40,
                fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.93rem",cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",gap:8
              }}>💬 Enquire via WhatsApp</button>
              <div style={{ fontSize:"0.73rem",color:"#7aab8a",textAlign:"center",marginTop:8 }}>
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
      background:"#101810",borderTop:"1px solid rgba(46,204,113,0.15)",
      display:"flex",height:62,
    }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{
          flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,
          background:"none",border:"none",cursor:"pointer",padding:"6px 0",
          color: activeTab===tab.id ? "#2ecc71" : "#7aab8a",
          transition:"color .2s",position:"relative"
        }}>
          <span style={{ fontSize:"1.25rem",position:"relative" }}>
            {tab.icon}
            {tab.badge > 0 && (
              <span style={{
                position:"absolute",top:-4,right:-6,background:"#ff5722",color:"#fff",
                fontSize:"0.55rem",fontWeight:800,width:14,height:14,borderRadius:"50%",
                display:"flex",alignItems:"center",justifyContent:"center"
              }}>{tab.badge > 9 ? "9+" : tab.badge}</span>
            )}
          </span>
          <span style={{ fontSize:"0.62rem",fontWeight: activeTab===tab.id ? 700 : 500,fontFamily:"'DM Sans',sans-serif" }}>{tab.label}</span>
          {activeTab===tab.id && <div style={{ position:"absolute",bottom:0,width:28,height:2,background:"#2ecc71",borderRadius:1 }} />}
        </button>
      ))}
    </div>
  );
}

// ─── ADMIN PAGE (preserved) ───────────────────────────────────
// (Admin page styles & logic preserved from original)
const adminCSS = `
  .admin-layout{display:flex;min-height:100vh;}
  .admin-sidebar{width:240px;background:#101810;border-right:1px solid rgba(30,53,34,1);display:flex;flex-direction:column;position:fixed;top:0;bottom:0;left:0;z-index:50;}
  .admin-sidebar-logo{padding:22px 20px;border-bottom:1px solid rgba(30,53,34,1);display:flex;align-items:center;gap:10px;}
  .admin-sidebar-logo img{height:34px;}
  .admin-sidebar-logo span{font-family:'Barlow Condensed',sans-serif;font-size:0.9rem;font-weight:800;color:#fff;line-height:1.2;}
  .admin-nav{flex:1;padding:20px 12px;display:flex;flex-direction:column;gap:4px;}
  .admin-nav-label{font-size:0.66rem;font-weight:800;color:#7aab8a;letter-spacing:.12em;text-transform:uppercase;padding:0 10px;margin-bottom:8px;margin-top:8px;display:block;}
  .admin-link{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;background:none;border:none;font-family:'DM Sans',sans-serif;font-size:0.86rem;font-weight:500;color:#7aab8a;transition:all .2s;text-align:left;width:100%;}
  .admin-link:hover{background:#131f16;color:#e8f5ec;}
  .admin-link.active{background:rgba(46,204,113,0.16);color:#2ecc71;font-weight:700;}
  .admin-link-icon{font-size:1rem;width:20px;text-align:center;}
  .admin-link-badge{margin-left:auto;background:#131f16;border-radius:20px;padding:1px 8px;font-size:0.68rem;font-weight:700;}
  .admin-sidebar-footer{padding:14px 12px;border-top:1px solid rgba(30,53,34,1);}
  .admin-user{display:flex;align-items:center;gap:10px;}
  .admin-avatar{width:32px;height:32px;border-radius:50%;background:#2ecc71;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:800;color:#0a0f0d;font-size:0.9rem;flex-shrink:0;}
  .admin-user-name{font-size:0.82rem;font-weight:600;color:#fff;}
  .admin-user-role{font-size:0.72rem;color:#7aab8a;}
  .logout-btn{margin-left:auto;background:none;border:none;color:#7aab8a;cursor:pointer;font-size:1rem;transition:color .2s;}
  .logout-btn:hover{color:#e05050;}
  .admin-main{margin-left:240px;flex:1;background:#0a0f0d;}
  .admin-topbar{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;border-bottom:1px solid rgba(30,53,34,1);background:#101810;position:sticky;top:0;z-index:10;}
  .admin-topbar-title{font-family:'Barlow Condensed',sans-serif;font-size:1.25rem;font-weight:800;color:#fff;}
  .live-badge{display:flex;align-items:center;gap:6px;font-size:0.75rem;font-weight:700;color:#2ecc71;background:rgba(46,204,113,0.1);border:1px solid rgba(46,204,113,0.3);border-radius:20px;padding:4px 10px;}
  .live-dot{width:6px;height:6px;border-radius:50%;background:#2ecc71;animation:pulse 1.5s infinite;}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}
  .dash-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px;}
  .dash-stat{background:#131f16;border:1px solid rgba(30,53,34,1);border-radius:16px;padding:20px 18px;transition:all .2s;}
  .dash-stat:hover{border-color:#2ecc71;}
  .dash-stat-icon{font-size:1.5rem;margin-bottom:8px;}
  .dash-stat-num{font-family:'Barlow Condensed',sans-serif;font-size:2rem;font-weight:800;color:#fff;}
  .dash-stat-label{font-size:0.8rem;color:#7aab8a;margin-top:5px;}
  .apps-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;}
  .app-card{background:#131f16;border:1px solid rgba(30,53,34,1);border-radius:13px;overflow:hidden;transition:all .2s;}
  .app-card:hover{border-color:#2ecc71;}
  .app-card-visual{height:150px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#101810;}
  .app-card-visual img{width:100%;height:100%;object-fit:cover;}
  .emoji-ph{font-size:4.5rem;opacity:0.22;}
  .card-status-badge{position:absolute;top:10px;right:10px;border-radius:20px;padding:3px 9px;font-size:0.7rem;font-weight:700;}
  .badge-active{background:rgba(46,204,113,0.15);border:1px solid #2ecc71;color:#2ecc71;}
  .badge-inactive{background:rgba(224,80,80,0.15);border:1px solid #e05050;color:#e05050;}
  .app-card-body{padding:14px 16px 16px;}
  .app-card-emoji{font-size:1.5rem;margin-bottom:6px;}
  .app-card-title{font-family:'Barlow Condensed',sans-serif;font-size:1.1rem;font-weight:800;color:#fff;margin-bottom:4px;}
  .app-card-desc{font-size:0.8rem;color:#7aab8a;line-height:1.5;margin-bottom:12px;}
  .app-card-actions{display:flex;gap:8px;}
  .admin-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:40px;font-family:'DM Sans',sans-serif;font-weight:700;font-size:0.83rem;cursor:pointer;border:none;transition:all .2s;}
  .admin-btn.green{background:#2ecc71;color:#0a0f0d;}
  .admin-btn.green:hover{background:#1a9c52;}
  .admin-btn.red{background:rgba(224,80,80,0.15);border:1px solid #e05050;color:#e05050;}
  .admin-btn.blue{background:rgba(58,154,217,0.15);border:1px solid #3a9ad9;color:#3a9ad9;}
  .admin-btn.sm{padding:6px 13px;font-size:0.77rem;}
  .modal-overlay{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:20px;}
  .modal-box{background:#131f16;border:1px solid rgba(46,204,113,0.25);border-radius:16px;padding:28px;width:100%;max-width:480px;position:relative;max-height:90vh;overflow-y:auto;}
  .modal-field{margin-bottom:14px;}
  .modal-field label{font-size:0.72rem;color:#7aab8a;font-weight:700;letter-spacing:.08em;text-transform:uppercase;display:block;margin-bottom:5px;}
  .modal-field input,.modal-field textarea,.modal-field select{width:100%;padding:10px 13px;background:#0a0f0d;border:1.5px solid rgba(46,204,113,0.2);border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:0.9rem;outline:none;box-sizing:border-box;}
  .modal-field textarea{min-height:80px;resize:vertical;}
  .section-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
  .section-hdr h3{font-family:'Barlow Condensed',sans-serif;font-size:1.3rem;font-weight:800;color:#fff;}
`;

// Minimal AdminPage preserved from original
function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("sag_admin") === "1");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [adminPage, setAdminPage] = useState("dashboard");
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [toast, setToast] = useState({ show:false,type:"success",msg:"" });

  const showToast = (type, msg) => { setToast({show:true,type,msg}); setTimeout(()=>setToast(t=>({...t,show:false})),3000); };

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/products?order=created_at.asc&select=*`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    }).then(r => r.ok ? r.json() : null)
      .then(rows => { if (rows&&rows.length) setProducts(rows.map(r => ({ id:r.id,name:r.name,price:r.price,originalPrice:r.original_price,image:r.image,isNew:r.is_new,isOffer:r.is_offer,status:r.status,category:r.category,waNum:r.wa_num||"919390238537" }))); })
      .catch(()=>{});
  }, []);

  if (!authed) return (
    <div style={{ minHeight:"100vh",background:"#0a0f0d",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div style={{ background:"#131f16",border:"1px solid rgba(46,204,113,0.2)",borderRadius:16,padding:"32px 28px",width:"100%",maxWidth:360,textAlign:"center" }}>
        <img src={LOGO} alt="SAG" style={{ height:40,marginBottom:16 }} />
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.5rem",fontWeight:800,color:"#fff",marginBottom:18 }}>Admin Access</div>
        <input type="password" placeholder="Enter admin password" value={pw} onChange={e=>setPw(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&(pw==="sag@admin2025"?(sessionStorage.setItem("sag_admin","1"),setAuthed(true)):setErr("Wrong password"))}
          style={{ width:"100%",padding:"11px 14px",background:"#0a0f0d",border:"1.5px solid rgba(46,204,113,0.2)",borderRadius:10,color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:"0.9rem",outline:"none",boxSizing:"border-box",marginBottom:10 }} />
        {err && <div style={{ color:"#e05050",fontSize:"0.82rem",marginBottom:8 }}>{err}</div>}
        <button onClick={()=>pw==="sag@admin2025"?(sessionStorage.setItem("sag_admin","1"),setAuthed(true)):setErr("Wrong password")}
          style={{ width:"100%",padding:"12px",background:"#2ecc71",color:"#0a0f0d",border:"none",borderRadius:40,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.93rem",cursor:"pointer" }}>
          Enter Admin →
        </button>
      </div>
    </div>
  );

  const inStock = products.filter(p=>p.status!=="outofstock").length;
  const outStock = products.filter(p=>p.status==="outofstock").length;
  const offers = products.filter(p=>p.isOffer).length;

  return (
    <div className="admin-layout">
      <style>{adminCSS}</style>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo"><img src={LOGO} alt="SAG" /><span>SAG Admin</span></div>
        <nav className="admin-nav">
          <span className="admin-nav-label">Overview</span>
          {[["dashboard","📊","Dashboard"],["products","🛒","Products"]].map(([page,icon,label]) => (
            <button key={page} className={`admin-link${adminPage===page?" active":""}`} onClick={()=>setAdminPage(page)}>
              <span className="admin-link-icon">{icon}</span>{label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <div className="admin-avatar">A</div>
            <div><div className="admin-user-name">Admin</div><div className="admin-user-role">Super Admin</div></div>
            <button className="logout-btn" onClick={()=>{sessionStorage.removeItem("sag_admin");setAuthed(false);}}>⏏</button>
          </div>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-title">{adminPage==="dashboard"?"Dashboard":"Products"}</div>
          <div className="live-badge"><div className="live-dot" />LIVE</div>
        </div>
        <div style={{ padding:28 }}>
          {adminPage === "dashboard" && (
            <div>
              <div className="dash-stats">
                {[["📦","Total Products",products.length,""],["✅","In Stock",inStock,""],["⛔","Out of Stock",outStock,""],["🏷️","On Offer",offers,""]].map(([icon,label,val]) => (
                  <div key={label} className="dash-stat">
                    <div className="dash-stat-icon">{icon}</div>
                    <div className="dash-stat-num">{val}</div>
                    <div className="dash-stat-label">{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:"#131f16",border:"1px solid rgba(30,53,34,1)",borderRadius:12,padding:"16px 20px" }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1rem",fontWeight:800,color:"#fff",marginBottom:4 }}>📢 Tip</div>
                <div style={{ fontSize:"0.82rem",color:"#7aab8a",lineHeight:1.6 }}>Use the Products section to manage inventory. To add promotional banners, sign in to the customer app and tap "🖼 Banners" at the top.</div>
              </div>
            </div>
          )}
          {adminPage === "products" && (
            <div>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.2rem",fontWeight:800,color:"#fff" }}>🛒 Products ({products.length})</div>
                <button className="admin-btn green" onClick={()=>{setEditProduct(null);setShowProductModal(true);}}>+ Add Product</button>
              </div>
              <div className="apps-grid">
                {products.map(p => (
                  <div key={p.id} className="app-card">
                    <div className="app-card-visual">{p.image?<img src={p.image} alt={p.name} />:<div className="emoji-ph">📦</div>}<span className={`card-status-badge ${p.status!=="outofstock"?"badge-active":"badge-inactive"}`}>{p.status!=="outofstock"?"In Stock":"Out of Stock"}</span></div>
                    <div className="app-card-body">
                      <div className="app-card-title">{p.name}</div>
                      <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:"1.1rem",color:"#2ecc71",marginBottom:10 }}>{formatINR(p.price)}</div>
                      <div className="app-card-actions">
                        <button className="admin-btn blue sm" onClick={()=>{setEditProduct(p);setShowProductModal(true);}}>✏️ Edit</button>
                        <button className="admin-btn red sm" onClick={()=>{if(confirm(`Delete "${p.name}"?`)){setProducts(a=>a.filter(x=>x.id!==p.id));showToast("success","Deleted.");}}} >🗑️ Del</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      {showProductModal && (
        <ProductFormModal product={editProduct} onSave={p => {
          const idx = products.findIndex(x=>x.id===p.id);
          if (idx!==-1) { const n=[...products]; n[idx]=p; setProducts(n); }
          else setProducts(prev=>[...prev,{...p,id:Date.now()}]);
          showToast("success","✅ Product saved!"); setShowProductModal(false);
        }} onClose={()=>setShowProductModal(false)} />
      )}
      <div style={{ position:"fixed",bottom:24,right:24,zIndex:99999,background:toast.type==="success"?"#1a4a2a":"#4a1a1a",border:`1px solid ${toast.type==="success"?"#2ecc71":"#e05050"}`,borderRadius:12,padding:"10px 18px",color:"#fff",fontSize:"0.85rem",fontFamily:"'DM Sans',sans-serif",transition:"all .35s",transform:toast.show?"translateY(0)":"translateY(20px)",opacity:toast.show?1:0,pointerEvents:toast.show?"all":"none" }}>{toast.msg}</div>
    </div>
  );
}

function ProductFormModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(product || { name:"",price:"",originalPrice:"",image:"",category:"Drones",status:"instock",isNew:false,isOffer:false,waNum:"919390238537" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box">
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.3rem",fontWeight:800,color:"#fff",marginBottom:18 }}>{product?"Edit Product":"Add Product"}</div>
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
          <button onClick={()=>onSave({...form,price:Number(form.price),originalPrice:Number(form.originalPrice)||null})} style={{ flex:1,padding:"12px",background:"#2ecc71",color:"#0a0f0d",border:"none",borderRadius:40,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:"0.9rem",cursor:"pointer" }}>Save Product</button>
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

  useEffect(() => {
    const session = loadSession();
    if (session?.accessToken) sbGetUser(session.accessToken).then(u => { if (!u) { clearSession(); setUser(null); } }).catch(() => { clearSession(); setUser(null); });
    fetch(`${SUPABASE_URL}/rest/v1/products?order=created_at.asc&select=*`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    }).then(r => r.ok ? r.json() : null)
      .then(rows => { if (rows&&rows.length) setProducts(rows.map(r => ({ id:r.id,name:r.name,price:r.price,originalPrice:r.original_price,image:r.image,isNew:r.is_new,isOffer:r.is_offer,status:r.status,category:r.category,waNum:r.wa_num||"919390238537" }))); })
      .catch(()=>{});
  }, []);

  const logout = async () => {
    if (user?.accessToken) await sbSignOut(user.accessToken);
    clearSession(); setUser(null); showToast("success","👋 Signed out.");
  };

  const cartCount = cart.reduce((s,i)=>s+i.qty,0);

  if (showAdmin) return (
    <div>
      <AdminPage />
      <div style={{ position:"fixed",bottom:20,right:20,zIndex:9999 }}>
        <button onClick={()=>setShowAdmin(false)} style={{ background:"#131f16",border:"1px solid rgba(46,204,113,0.3)",color:"#7aab8a",padding:"8px 14px",borderRadius:40,fontSize:"0.75rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>← Back to App</button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif",background:"#0a0f0d",minHeight:"100vh" }}>
      <style>{`*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}html,body{overflow-x:hidden;}`}</style>

      {tab === "home" && (
        <HomePage user={user} cart={cart} setCart={setCart} showAuth={()=>{}} showToast={showToast} onTabChange={setTab} banners={banners} setBanners={setBanners} />
      )}
      {tab === "categories" && (
        <CategoriesPage products={products} onProductClick={setModalProduct}
          onAddCart={(p) => { if(!user){showToast("error","Sign in to add to cart");return;} setCart(c=>{const ex=c.find(i=>i.id===p.id);if(ex)return c.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i);return[...c,{...p,qty:1}];});showToast("success",`✅ "${p.name}" added!`); }} user={user} />
      )}
      {tab === "account" && (
        <AccountPage user={user} onLogin={(s)=>{setUser(s);}} onLogout={logout} cart={cart} showToast={showToast} />
      )}
      {tab === "cart" && (
        <CartPage cart={cart} setCart={setCart} user={user} showAuth={()=>setTab("account")} showToast={showToast} />
      )}

      <BottomNav activeTab={tab} onTabChange={setTab} cartCount={cartCount} />
      {toastEl}

      {modalProduct && (
        <ProductDetailModal product={modalProduct} onClose={()=>setModalProduct(null)}
          onAddCart={(p)=>{ setCart(c=>{const ex=c.find(i=>i.id===p.id);if(ex)return c.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i);return[...c,{...p,qty:1}];});showToast("success",`✅ "${p.name}" added!`); }}
          user={user} showAuth={()=>{setModalProduct(null);setTab("account");}} />
      )}

      {/* Admin shortcut */}
      <div style={{ position:"fixed",bottom:72,right:16,zIndex:99 }}>
        <button onClick={()=>setShowAdmin(true)} style={{ background:"rgba(10,15,13,0.9)",border:"1px solid rgba(46,204,113,0.2)",color:"#7aab8a",padding:"7px 13px",borderRadius:40,fontSize:"0.72rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",backdropFilter:"blur(6px)" }}>⚙ Admin</button>
      </div>
    </div>
  );
}
