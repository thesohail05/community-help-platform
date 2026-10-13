import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ArrowRight, HandHeart, HeartHandshake, Search, MapPin, Clock3,
  Plus, Users, ShieldCheck, GraduationCap, Utensils, HeartPulse,
  CarFront, Sprout, X, CheckCircle2, LoaderCircle, Trash2, RefreshCw
} from "lucide-react";

const API = "http://localhost:5000/api/requests";
const categories = ["All categories", "Education", "Food", "Healthcare", "Transport", "Volunteering", "Other"];
const icons = {
  Education: GraduationCap, Food: Utensils, Healthcare: HeartPulse,
  Transport: CarFront, Volunteering: Sprout, Other: HandHeart
};
const initialForm = { title: "", description: "", category: "Volunteering", location: "", requesterName: "" };

function App() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== "All categories") params.category = category;
      setRequests((await axios.get(API, { params })).data);
    } catch {
      setError("Can't connect to the database yet. Start MongoDB and the backend server, then refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadRequests, 250);
    return () => clearTimeout(timer);
  }, [search, category]);

  const stats = useMemo(() => ({
    total: requests.length,
    open: requests.filter(r => r.status === "Open").length,
    completed: requests.filter(r => r.status === "Completed").length
  }), [requests]);

  const submitRequest = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await axios.post(API, form);
      setForm(initialForm);
      setShowForm(false);
      setNotice("Your request is live. Thank you for reaching out.");
      await loadRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create request. Check that the backend is running.");
    } finally {
      setSaving(false);
    }
  };

  const offerHelp = async (item) => {
    const helperName = window.prompt("What is your name? Enter your name to offer help:");
    if (!helperName?.trim()) return;
    try {
      await axios.patch(`${API}/${item._id}`, { status: "Help offered", helperName: helperName.trim() });
      setNotice(`Thanks ${helperName.trim()} — your offer has been recorded.`);
      await loadRequests();
    } catch {
      setError("Could not save your offer. Please try again.");
    }
  };

  const completeRequest = async (item) => {
    try {
      await axios.patch(`${API}/${item._id}`, { status: "Completed" });
      setNotice("Request marked as completed.");
      await loadRequests();
    } catch {
      setError("Could not update the request.");
    }
  };

  const deleteRequest = async (item) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/${item._id}`);
      setNotice("Request deleted.");
      await loadRequests();
    } catch {
      setError("Could not delete the request.");
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Kindred home">
          <span className="brand-mark"><HeartHandshake size={23} /></span>
          <span>kindred<span className="brand-dot">.</span><small>COMMUNITY, CONNECTED</small></span>
        </a>
        <nav className="nav-links">
          <a className="active" href="#requests">Explore help</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <button className="button button-dark nav-cta" onClick={() => setShowForm(true)}>
          <Plus size={17} /> Ask for help
        </button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> SMALL ACTS. BIG IMPACT.</div>
            <h1>A little help can<br />change <em>everything.</em></h1>
            <p className="hero-text">Good things happen when neighbours show up for one another. Ask for what you need, or be the reason someone smiles today.</p>
            <div className="hero-actions">
              <button className="button button-dark button-large" onClick={() => setShowForm(true)}>Request community help <ArrowRight size={18} /></button>
              <a className="text-link" href="#requests">I want to help <span>↗</span></a>
            </div>
            <div className="social-proof">
              <div className="avatar-stack"><span>R</span><span>A</span><span>M</span><span>S</span></div>
              <div><strong>Stronger, together.</strong><small>Every helpful act counts.</small></div>
            </div>
          </div>
          <div className="hero-art">
            <div className="art-backdrop"></div>
            <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1100&q=85" alt="Volunteers working together to help their community" />
            <div className="floating-note note-top"><span className="note-icon green"><HeartHandshake size={18} /></span><span><strong>Help is closer</strong><small>than you think.</small></span></div>
            <div className="floating-note note-bottom"><span className="note-icon peach"><HeartHandshake size={18} /></span><span><strong>Give a hand.</strong><small>Get a community.</small></span></div>
            <div className="art-spark">✳</div>
          </div>
          <div className="hero-decoration">KINDNESS<br />STARTS HERE</div>
        </section>

        <section className="stats-row" aria-label="Community overview">
          <div className="stat-item"><span className="stat-icon"><Users size={20} /></span><div><strong>{stats.total}</strong><span>Community requests</span></div></div>
          <div className="stat-item"><span className="stat-icon"><HandHeart size={20} /></span><div><strong>{stats.open}</strong><span>Still need a hand</span></div></div>
          <div className="stat-item"><span className="stat-icon"><CheckCircle2 size={20} /></span><div><strong>{stats.completed}</strong><span>Marked complete</span></div></div>
          <div className="stat-message">A kinder community begins with <em>one person.</em></div>
        </section>

        <section className="requests-section" id="requests">
          <div className="section-heading">
            <div><div className="eyebrow"><span className="eyebrow-line" /> THE COMMUNITY BOARD</div><h2>Where help <em>happens.</em></h2><p>Real needs, kind people, meaningful connections.</p></div>
            <button className="button button-outline" onClick={loadRequests}><RefreshCw size={16} /> Refresh board</button>
          </div>

          <div className="filter-bar">
            <label className="search-box"><Search size={19} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search requests or locations..." /></label>
            <select aria-label="Filter by category" value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(c => <option key={c} value={c === "All categories" ? c : c}>{c}</option>)}
            </select>
          </div>

          {notice && <div className="notice"><CheckCircle2 size={17} /> {notice}<button onClick={() => setNotice("")} aria-label="Dismiss"><X size={16}/></button></div>}
          {error && <div className="error-banner">{error}<button onClick={loadRequests}>Try again</button></div>}

          {loading ? <div className="loading"><LoaderCircle className="spin" size={25} /> Loading community requests...</div> : (
            <div className="request-grid">
              {requests.map(item => {
                const CategoryIcon = icons[item.category] || HandHeart;
                return <article className="request-card" key={item._id}>
                  <div className="card-topline"><span className="category-pill"><CategoryIcon size={15} />{item.category}</span><span className={`status status-${item.status.toLowerCase().replace(" ", "-")}`}>{item.status}</span></div>
                  <h3>{item.title}</h3>
                  <p className="card-description">{item.description}</p>
                  <div className="card-meta"><span><MapPin size={15}/>{item.location}</span><span><Clock3 size={15}/>{new Date(item.createdAt).toLocaleDateString()}</span></div>
                  <div className="card-footer"><div className="requester"><span className="requester-avatar">{item.requesterName?.charAt(0).toUpperCase()}</span><span><small>REQUESTED BY</small><strong>{item.requesterName}</strong></span></div>
                    <div className="card-actions">
                      {item.status === "Open" && <button className="button button-help" onClick={() => offerHelp(item)}>Offer help <ArrowRight size={15}/></button>}
                      {item.status === "Help offered" && <button className="button button-complete" onClick={() => completeRequest(item)}><CheckCircle2 size={15}/> Complete</button>}
                      <button className="icon-button" title="Delete request (demo)" onClick={() => deleteRequest(item)}><Trash2 size={16}/></button>
                    </div>
                  </div>
                  {item.helperName && <div className="helper-note">Helping hand offered by <strong>{item.helperName}</strong></div>}
                </article>;
              })}
              {requests.length === 0 && <div className="empty-state"><span>🌱</span><h3>No requests just yet</h3><p>Be the first to ask for help, or try a different search.</p><button className="button button-dark" onClick={() => setShowForm(true)}><Plus size={17}/> Create first request</button></div>}
            </div>
          )}
        </section>

        <section className="how-section" id="how-it-works">
          <div className="how-heading"><div className="eyebrow"><span className="eyebrow-line" /> SIMPLE BY DESIGN</div><h2>Helping is easier<br />than <em>ever.</em></h2></div>
          <div className="steps">
            <div className="step"><span className="step-number">01</span><span className="step-icon"><Plus size={22}/></span><h3>Share what you need</h3><p>Post a request with a few details so your community knows how to help.</p></div>
            <div className="step"><span className="step-number">02</span><span className="step-icon"><HeartHandshake size={22}/></span><h3>Someone steps in</h3><p>Neighbours and volunteers discover your request and offer a helping hand.</p></div>
            <div className="step"><span className="step-number">03</span><span className="step-icon"><ShieldCheck size={22}/></span><h3>Make it happen</h3><p>Connect, coordinate, and mark the request complete when help is delivered.</p></div>
          </div>
        </section>

        <section className="bottom-cta"><div><span className="eyebrow">YOUR COMMUNITY NEEDS YOU</span><h2>Be someone's good<br /><em>news today.</em></h2></div><button className="button button-light button-large" onClick={() => setShowForm(true)}>Post a help request <ArrowRight size={18}/></button><span className="cta-flower">✳</span></section>
      </main>

      <footer><a className="brand footer-brand" href="#home"><span className="brand-mark"><HeartHandshake size={21}/></span><span>kindred<span className="brand-dot">.</span><small>COMMUNITY, CONNECTED</small></span></a><p>Made with care, for people who care.</p><span>© {new Date().getFullYear()} Kindred Community</span></footer>

      {showForm && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-heading"><div><span className="eyebrow">A LITTLE HELP GOES A LONG WAY</span><h2 id="modal-title">Ask your community.</h2><p>Tell us what you need. Someone nearby may be able to help.</p></div><button className="icon-button close-button" onClick={() => setShowForm(false)} aria-label="Close"><X size={20}/></button></div>
          <form onSubmit={submitRequest} className="request-form">
            <label>Your name<input required maxLength="80" value={form.requesterName} onChange={e => setForm({...form, requesterName:e.target.value})} placeholder="e.g. Sohail" /></label>
            <label>What do you need help with?<input required maxLength="100" value={form.title} onChange={e => setForm({...form, title:e.target.value})} placeholder="e.g. Need school supplies" /></label>
            <label>Tell us a little more<textarea required maxLength="1000" rows="3" value={form.description} onChange={e => setForm({...form, description:e.target.value})} placeholder="Describe the help you need..." /></label>
            <div className="form-row"><label>Category<select value={form.category} onChange={e => setForm({...form, category:e.target.value})}>{categories.slice(1).map(c => <option key={c}>{c}</option>)}</select></label><label>Location<input required maxLength="100" value={form.location} onChange={e => setForm({...form, location:e.target.value})} placeholder="e.g. Hyderabad" /></label></div>
            <button className="button button-dark submit-button" disabled={saving}>{saving ? <><LoaderCircle className="spin" size={18}/> Posting...</> : <>Post request <ArrowRight size={18}/></>}</button>
            <p className="privacy-note"><ShieldCheck size={14}/> Share only information you're comfortable making public.</p>
          </form>
        </div>
      </div>}
    </div>
  );
}

export default App;
