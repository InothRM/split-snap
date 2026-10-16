import { useEffect, useRef, useState } from "react";

const receiptItems = [
  { name: "Avocado toast", price: 14, icon: "🥑" },
  { name: "Truffle fries", price: 9.5, icon: "🍟" },
  { name: "Margherita pizza", price: 18, icon: "🍕" },
  { name: "Iced matcha latte", price: 6.5, icon: "🍵" },
];

const TAX_RATE = 0.085;
const avatarStyles = ["you", "friend-one", "friend-two", "friend-three"];
const initials = ["Y", "J", "M", "S"];

function formatMoney(cents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function App() {
  const fileInputRef = useRef(null);
  const tipInputRef = useRef(null);
  const [items, setItems] = useState(receiptItems);
  const [people, setPeople] = useState(4);
  const [tipRate, setTipRate] = useState(18);
  const [taxRate, setTaxRate] = useState(TAX_RATE);
  const [tipEditing, setTipEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [receiptName, setReceiptName] = useState("Sunday brunch · sample");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState(null);

  useEffect(
    () => () => {
      if (receiptPreview) URL.revokeObjectURL(receiptPreview);
    },
    [receiptPreview],
  );

  const subtotalCents = items.reduce(
    (sum, item) => sum + Math.round(item.price * 100),
    0,
  );
  const taxCents = Math.round(subtotalCents * taxRate);
  const tipCents = Math.round(subtotalCents * tipRate / 100);
  const totalCents = subtotalCents + taxCents + tipCents;
  const baseShare = Math.floor(totalCents / people);
  const extraCents = totalCents % people;
  const pluralPeople = people === 1 ? "person" : "people";

  function chooseFile() {
    fileInputRef.current?.click();
  }

  async function setReceipt(file) {
    if (!file) return;

    const fileName = file.name || "Uploaded receipt";
    const isPdf = file.type === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");
    const isImage = file.type === "image/jpeg" || file.type === "image/png";

    if (!isPdf && !isImage) {
      setUploadMessage("That file type isn’t supported. Choose a receipt image or PDF.");
      setUploadError(true);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    setUploadError(false);
    setUploadMessage("Uploading receipt for mock analysis…");

    try {
      const formData = new FormData();
      formData.append("receipt", file);
      const response = await fetch("/api/analyze", { method: "POST", body: formData });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "The receipt could not be analyzed.");
      }

      setItems(result.items);
      setTaxRate(result.taxRate);
      setTipRate(result.tipRate);
      setReceiptName(result.fileName || fileName);
      setReceiptPreview(isImage ? URL.createObjectURL(file) : null);
      setUploadMessage("Receipt added. These are sample results for your uploaded file.");
    } catch (error) {
      setUploadMessage(error instanceof Error ? error.message : "The receipt could not be analyzed.");
      setUploadError(true);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function showSample() {
    setItems(receiptItems);
    setTaxRate(TAX_RATE);
    setTipRate(18);
    setReceiptName("Sunday brunch · sample");
    setReceiptPreview(null);
    setUploadMessage("Sample receipt loaded. Adjust the tip or group size to try the split.");
    setUploadError(false);
  }

  function handleTipChange(event) {
    const value = Number(event.target.value);
    if (!Number.isFinite(value)) return;
    setTipRate(Math.min(100, Math.max(0, value)));
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    setReceipt(event.dataTransfer.files[0]);
  }

  return (
    <div className="app-shell">
      <header className="topbar landing-topbar">
        <a className="brand" href="#" aria-label="Split Snap home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="15" fill="currentColor" />
              <circle cx="24" cy="24" r="15" stroke="#F8F8EF" strokeWidth="2" />
              <path d="M24 15v4m0 10v4m-9-9h4m10 0h4" stroke="#C9EEA6" strokeWidth="2" strokeLinecap="round" />
              <path d="m21 21 3 3m0 0 3 3m-3-3 3-3m-3 3-3 3" stroke="#F8F8EF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="24" cy="24" r="2.5" fill="#F3A078" />
            </svg>
          </span>
          <span className="brand-copy"><span className="brand-name">split the check</span><small>GOOD FOOD, FAIR SHARES</small></span>
        </a>
        <nav className="landing-nav" aria-label="Main navigation">
          <a href="#receipt">Receipt</a>
          <a href="#your-items">Your items</a>
          <a href="#split-with-friends">Split with friends</a>
        </nav>
        <a className="nav-cta" href="#receipt">Split a bill</a>
      </header>

      <main>
        <section className="landing-hero" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> LESS MATH, MORE DESSERT</p>
            <h1 id="page-title">Good food is better<br className="hero-break" /> when the bill is easy.</h1>
            <p className="page-subtitle">Upload a restaurant receipt, check the items, add your friends, and see everyone's share in seconds.</p>
            <a className="hero-cta" href="#receipt">Split your bill <span aria-hidden="true">›</span></a>
            <p className="hero-privacy"><span /> Your receipt is only used for this preview and isn't stored.</p>
          </div>
          <div className="hero-art" aria-label="Illustration of a pizza shared with friends" role="img">
            <span className="hero-spark hero-spark-top" aria-hidden="true">✳</span>
            <span className="hero-spark hero-spark-bottom" aria-hidden="true">✳</span>
            <div className="hero-photo-card">
              <img className="pizza-art" src="/images/pizza-hero.jpg" alt="Friends sharing a freshly baked pizza around the table" />
            </div>
            <div className="share-sticker"><small>good times</small><strong>÷ everyone</strong></div>
          </div>
        </section>

        <section className="workbench-heading" aria-labelledby="workbench-title">
          <div><p className="eyebrow">THE EASY PART</p><h2 id="workbench-title">Let's split this check.</h2></div>
          <button className="reset-sample" type="button" onClick={showSample}>Reset sample</button>
        </section>

        <div className="dashboard-grid">
          <aside className="left-column" aria-label="Receipt and split controls">
            <section className="card upload-card" id="receipt">
              <div className="section-heading">
                <div><span className="section-kicker">STEP 01</span><h2>Bring the receipt</h2></div>
                <span className="heading-icon upload-heading-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14.5v3A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
              <div
                className={`drop-zone${isDragging ? " drag-over" : ""}`}
                role="button"
                tabIndex={0}
                aria-label="Choose or drop a receipt image or PDF"
                aria-busy={isUploading}
                style={receiptPreview ? { backgroundImage: `linear-gradient(rgb(251 253 249 / 92%), rgb(251 253 249 / 92%)), url("${receiptPreview}")` } : undefined}
                onClick={(event) => {
                  if (!event.target.closest("button")) chooseFile();
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    chooseFile();
                  }
                }}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,.jpg,.jpeg,.png,.pdf,application/pdf"
                  hidden
                  onChange={(event) => void setReceipt(event.target.files[0])}
                />
                <div className="upload-illustration" aria-hidden="true">
                  <svg viewBox="0 0 64 64" fill="none"><rect x="11" y="8" width="34" height="44" rx="7" fill="#EAF5E6"/><path d="M20 20h16M20 27h16M20 34h9" stroke="#68935D" strokeWidth="2.4" strokeLinecap="round"/><circle cx="43" cy="42" r="12" fill="#B9F36B" stroke="#fff" strokeWidth="3"/><path d="M43 36v12m0-12-4 4m4-4 4 4" stroke="#315C32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p className="drop-title">Drop your receipt here</p>
                <p className="drop-copy">or <button className="text-button" type="button" onClick={(event) => { event.stopPropagation(); chooseFile(); }}>browse files</button> from your device</p>
                <span className="file-hint">JPG, PNG or PDF</span>
              </div>
              <p className={`upload-message${uploadError ? " error" : ""}`} role="status" aria-live="polite">{uploadMessage}</p>
              <div className="privacy-note">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2.5 3.75 5v4.2c0 4.1 2.67 6.95 6.25 8.3 3.58-1.35 6.25-4.2 6.25-8.3V5L10 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="m7.5 9.7 1.65 1.65 3.4-3.55" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Uploads are processed in memory and not stored.
              </div>
              <button className="sample-button" type="button" onClick={showSample}>
                <span className="sample-thumb" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none"><rect x="5" y="2.75" width="14" height="18.5" rx="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8.5 7h7M8.5 10.5h7M8.5 14h3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="m14.5 17 1.5 1.5 2.75-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="sample-label"><strong>Try a sample receipt</strong><small>See how the split works</small></span>
                <svg className="sample-arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </section>

            <section className="card people-card" id="split-with-friends">
              <div className="section-heading">
                <div><span className="section-kicker">STEP 02</span><h2>Who’s at the table?</h2></div>
                <span className="heading-icon people-heading-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20m6-8a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10 8v-1.5a3.5 3.5 0 0 0-2.75-3.42M15.5 4.62a4 4 0 0 1 0 7.76" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
              <p className="control-description">Everyone gets an equal share of the total.</p>
              <div className="people-control">
                <div className="people-count-label"><strong>{people} {pluralPeople}</strong><span>sharing this bill</span></div>
                <div className="stepper" aria-label="Number of people sharing">
                  <button type="button" aria-label="Remove one person" onClick={() => setPeople((count) => Math.max(1, count - 1))}>−</button>
                  <output aria-live="polite">{people}</output>
                  <button type="button" aria-label="Add one person" onClick={() => setPeople((count) => Math.min(99, count + 1))}>+</button>
                </div>
              </div>
              <div className="people-avatars" aria-label={`${people} ${pluralPeople} sharing: you and ${people - 1} ${people === 2 ? "friend" : "friends"}`}>
                {Array.from({ length: Math.min(people, 4) }, (_, index) => (
                  <span key={initials[index]} className={`person-avatar ${avatarStyles[index]}`} aria-hidden="true">{initials[index]}</span>
                ))}
                {people > 4 && <span className="person-avatar more" aria-hidden="true">+{people - 4}</span>}
              </div>
            </section>
          </aside>

          <section className="card results-card" id="your-items" aria-labelledby="results-heading">
            <div className="results-top">
              <div className="section-heading">
                <div><span className="section-kicker">STEP 03</span><h2 id="results-heading">The breakdown</h2></div>
                <span className="analyzed-badge"><span /> Mock analysis</span>
              </div>
              <div className="receipt-source">
                <div className="receipt-file-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M7 3.75h7l4 4v12.5H7a2 2 0 0 1-2-2v-12.5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M14 4v4h4M8.5 12h7M8.5 15.5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <div className="receipt-meta"><strong>{receiptName}</strong><span>{items.length} {receiptName === "Sunday brunch · sample" ? "items" : "mock items"} · Ready to split</span></div>
                <span className="ready-check" aria-label="Ready">
                  <svg viewBox="0 0 20 20" fill="none"><path d="m5 10.2 3.2 3.2L15.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
            </div>

            <div className="items-section">
              <div className="subsection-heading"><h3>What you ordered</h3><span>{items.length} ITEMS</span></div>
              <ul className="item-list" aria-label="Extracted food items">
                {items.map((item) => (
                  <li className="item-row" key={item.name}>
                    <span className="item-name"><span className="food-icon" aria-hidden="true">{item.icon}</span><span>{item.name}</span></span>
                    <span className="item-price">{formatMoney(Math.round(item.price * 100))}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bill-summary">
              <div className="subsection-heading"><h3>Bill summary</h3><button className="tip-edit-button" type="button" onClick={() => {
                setTipEditing((editing) => !editing);
                if (!tipEditing) requestAnimationFrame(() => {
                  tipInputRef.current?.focus();
                  tipInputRef.current?.select();
                });
              }}>Edit tip <span aria-hidden="true">↗</span></button></div>
              <div className="summary-line"><span>Subtotal</span><strong>{formatMoney(subtotalCents)}</strong></div>
              <div className="summary-line"><span>Tax <small>{(taxRate * 100).toFixed(1)}%</small></span><strong>{formatMoney(taxCents)}</strong></div>
              <div className="summary-line tip-line"><span>Tip <small>{tipRate}%</small></span><strong>{formatMoney(tipCents)}</strong></div>
              <div className="tip-editor" hidden={!tipEditing}>
                <label htmlFor="tip-rate">Tip percentage</label>
                <div className="tip-input-wrap"><input ref={tipInputRef} id="tip-rate" type="number" min="0" max="100" step="1" value={tipRate} onChange={handleTipChange} inputMode="decimal" /><span>%</span></div>
              </div>
              <div className="summary-divider" />
              <div className="summary-line total-line"><span>Total bill</span><strong>{formatMoney(totalCents)}</strong></div>
            </div>

            <div className="share-panel">
              <div className="share-copy">
                <span className="share-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M12 3v18m5-13.5c0-1.66-2.24-3-5-3s-5 1.34-5 3 2.24 3 5 3 5 1.34 5 3-2.24 3-5 3-5-1.34-5-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
                </span>
                <span><small>EACH PERSON PAYS</small><strong>{formatMoney(baseShare)}</strong></span>
              </div>
              <span className="share-count">÷ {people} {pluralPeople}</span>
            </div>
            <p className="rounding-note">
              {extraCents
                ? `${extraCents} ${extraCents === 1 ? "person pays" : "people pay"} ${formatMoney(baseShare + 1)}; everyone else pays ${formatMoney(baseShare)}.`
                : "Split evenly, down to the last cent."}
            </p>
          </section>
        </div>

        <footer className="page-footer">
          <span>Made for the “let’s split it” crew <span className="footer-heart" aria-label="love">♥</span></span>
          <span>Split Snap <span className="footer-separator">·</span> 0 to Shipped</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
