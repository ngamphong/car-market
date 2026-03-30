import { supabase } from "../../../lib/supabase"
import ImageGallery from "../../components/ImageGallery"
import CarCard from "../../components/CarCard"
import CarFinance from "../../components/CarFinance"

export default async function CarDetail({ params }: { params: Promise<{ id: string }> }) {

const { id } = await params

const { data: car } = await supabase
.from("cars")
.select("*")
.eq("id", id)
.single()

if (!car) {
return (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;900&family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,900;1,700&display=swap');
      body{background:#0A0A0A;color:#F0EEE9;font-family:'Barlow',sans-serif;}
    `}</style>
    <div style={{padding:'80px 20px',textAlign:'center',fontFamily:"'Bebas Neue',sans-serif",fontSize:'2rem',color:'#E8191A'}}>
      ไม่พบรถคันนี้
    </div>
  </>
)
}

const images = car.image_url.split(",")

const { data: recommend } = await supabase
.from("cars")
.select("*")
.neq("id", id)
.neq("status", "sold")
.limit(3)

const isSold = car.stock === 0 || car.status === "sold"

return(
<>
<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;900&family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,900;1,700&display=swap');

  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

  :root{
    --red:#E8191A;
    --red-dark:#B71212;
    --red-glow:rgba(232,25,26,0.3);
    --black:#0A0A0A;
    --dark:#111114;
    --surface:#17171B;
    --surface2:#1F1F25;
    --surface3:#26262D;
    --border:rgba(255,255,255,0.07);
    --border-red:rgba(232,25,26,0.3);
    --text:#F0EEE9;
    --muted:#888892;
    --green:#22C55E;
    --green-dark:#16A34A;
  }

  body{
    background:var(--black);
    color:var(--text);
    font-family:'Barlow',sans-serif;
  }

  /* ── TOP SLASH BAR ── */
  .slash-bar{
    height:4px;
    background:linear-gradient(90deg, var(--red) 0%, #fff 40%, var(--red) 60%, var(--red-dark) 100%);
    position:relative;
  }
  .slash-bar::after{
    content:'';
    position:absolute;right:0;top:0;
    width:0;height:0;
    border-style:solid;
    border-width:4px 24px 0 0;
    border-color:var(--red) transparent transparent transparent;
  }

  /* ── PAGE WRAPPER ── */
  .page{
    background:var(--black);
    min-height:100vh;
    padding-bottom:80px;
  }

  /* ── BREADCRUMB ── */
  .breadcrumb-bar{
    background:var(--dark);
    border-bottom:1px solid var(--border);
    padding:12px 0;
  }
  .breadcrumb-inner{
    max-width:1280px;margin:0 auto;padding:0 24px;
    display:flex;align-items:center;gap:8px;
    font-family:'Barlow Condensed',sans-serif;
    font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;
    color:var(--muted);
  }
  .breadcrumb-inner span{color:var(--red);}
  .breadcrumb-inner a{color:var(--muted);text-decoration:none;}
  .breadcrumb-inner a:hover{color:var(--text);}

  /* ── HEADER ── */
  .car-header{
    background:var(--dark);
    border-bottom:1px solid var(--border);
    padding:24px 0 20px;
    position:relative;overflow:hidden;
  }
  .car-header::before{
    content:'KKC';
    position:absolute;right:-10px;top:50%;transform:translateY(-50%);
    font-family:'Bebas Neue',sans-serif;
    font-size:10rem;letter-spacing:0.1em;
    color:rgba(255,255,255,0.02);
    pointer-events:none;white-space:nowrap;line-height:1;
  }
  .car-header-inner{
    max-width:1280px;margin:0 auto;padding:0 24px;
    display:flex;align-items:flex-start;justify-content:space-between;
    gap:20px;flex-wrap:wrap;position:relative;
  }
  .car-eyebrow{
    font-family:'Barlow Condensed',sans-serif;
    font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;
    color:var(--red);margin-bottom:6px;
    display:flex;align-items:center;gap:8px;
  }
  .car-eyebrow::before{
    content:'';display:block;
    width:20px;height:2px;background:var(--red);
  }
  .car-title{
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(2rem,5vw,3.2rem);
    letter-spacing:0.05em;line-height:1;
    color:var(--text);
  }
  .car-sub{
    font-size:0.82rem;color:var(--muted);margin-top:6px;
  }

  /* STATUS BADGE */
  .badge-sold{
    display:inline-flex;align-items:center;gap:6px;
    background:rgba(232,25,26,0.12);
    border:1px solid var(--border-red);
    color:var(--red);
    font-family:'Barlow Condensed',sans-serif;
    font-size:0.78rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
    padding:8px 16px;border-radius:4px;
  }
  .badge-avail{
    display:inline-flex;align-items:center;gap:6px;
    background:rgba(34,197,94,0.1);
    border:1px solid rgba(34,197,94,0.3);
    color:var(--green);
    font-family:'Barlow Condensed',sans-serif;
    font-size:0.78rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
    padding:8px 16px;border-radius:4px;
  }
  .badge-dot{
    width:6px;height:6px;border-radius:50%;
    background:currentColor;
    animation:pulse-dot 2s ease-in-out infinite;
  }
  @keyframes pulse-dot{0%,100%{opacity:1;}50%{opacity:0.4;}}

  /* ── MAIN LAYOUT ── */
  .main-inner{
    max-width:1280px;margin:0 auto;padding:32px 24px 0;
    display:grid;
    grid-template-columns:1fr 360px;
    gap:24px;
    align-items:start;
  }

  /* ── CARDS ── */
  .card{
    background:var(--surface);
    border:1px solid var(--border);
    border-radius:8px;
    overflow:hidden;
  }
  .card-body{padding:24px;}
  .card + .card{margin-top:20px;}

  /* ── CARD SECTION TITLE ── */
  .card-title{
    font-family:'Bebas Neue',sans-serif;
    font-size:1.3rem;letter-spacing:0.08em;
    color:var(--text);margin-bottom:20px;
    display:flex;align-items:center;gap:12px;
  }
  .card-title::after{
    content:'';flex:1;height:1px;
    background:linear-gradient(90deg,var(--border),transparent);
  }

  /* ── GALLERY WRAPPER ── */
  .gallery-card{
    background:var(--surface);
    border:1px solid var(--border);
    border-radius:8px;
    overflow:hidden;
  }
  .gallery-top-stripe{
    height:3px;
    background:linear-gradient(90deg,var(--red),transparent);
  }

  /* ── SPEC GRID ── */
  .spec-grid{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:1px;
    background:var(--border);
    border:1px solid var(--border);
    border-radius:6px;
    overflow:hidden;
  }
  .spec-cell{
    background:var(--surface2);
    padding:16px;
  }
  .spec-label{
    font-family:'Barlow Condensed',sans-serif;
    font-size:0.65rem;letter-spacing:0.18em;text-transform:uppercase;
    color:var(--muted);margin-bottom:4px;
  }
  .spec-value{
    font-family:'Barlow Condensed',sans-serif;
    font-size:1.05rem;font-weight:700;color:var(--text);
    letter-spacing:0.02em;
  }
  .spec-value.red{color:var(--red);}

  /* ── DESCRIPTION ── */
  .desc-text{
    color:var(--muted);font-size:0.92rem;line-height:1.8;
    white-space:pre-line;
  }

  /* ── STICKY SIDEBAR ── */
  .sidebar{position:sticky;top:24px;}

  /* ── PRICE CARD ── */
  .price-card{
    background:var(--surface);
    border:1px solid var(--border);
    border-radius:8px;
    overflow:hidden;
  }
  .price-card-top{
    background:var(--surface2);
    padding:20px 24px 16px;
    border-bottom:1px solid var(--border);
    position:relative;overflow:hidden;
  }
  .price-card-top::before{
    content:'';
    position:absolute;top:0;left:0;right:0;height:2px;
    background:var(--red);
  }
  .price-label{
    font-family:'Barlow Condensed',sans-serif;
    font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;
    color:var(--muted);margin-bottom:4px;
  }
  .price-amount{
    font-family:'Bebas Neue',sans-serif;
    font-size:2.6rem;letter-spacing:0.05em;
    color:var(--red);line-height:1;
  }
  .price-unit{
    font-family:'Barlow Condensed',sans-serif;
    font-size:0.8rem;letter-spacing:0.1em;
    color:var(--muted);margin-top:2px;
  }
  .price-card-body{padding:20px 24px;}

  /* ── CTA BUTTONS ── */
  .btn-call{
    display:block;text-align:center;text-decoration:none;
    background:var(--green);color:#fff;
    border:none;cursor:pointer;width:100%;
    padding:14px;border-radius:6px;
    font-family:'Bebas Neue',sans-serif;
    font-size:1.1rem;letter-spacing:0.1em;
    transition:all .2s;
    margin-bottom:10px;
  }
  .btn-call:hover{background:var(--green-dark);transform:translateY(-1px);}
  .btn-line{
    display:block;text-align:center;text-decoration:none;
    background:rgba(34,197,94,0.15);
    border:1px solid rgba(34,197,94,0.3);
    color:var(--green);
    padding:13px;border-radius:6px;
    font-family:'Bebas Neue',sans-serif;
    font-size:1.1rem;letter-spacing:0.1em;
    transition:all .2s;
    margin-bottom:10px;
    cursor:pointer;
  }
  .btn-line:hover{background:rgba(34,197,94,0.25);}
  .btn-save{
    display:block;text-align:center;
    background:transparent;
    border:1px solid var(--border);
    color:var(--muted);
    padding:12px;border-radius:6px;
    font-family:'Barlow Condensed',sans-serif;
    font-size:0.85rem;letter-spacing:0.1em;text-transform:uppercase;
    transition:all .2s;cursor:pointer;width:100%;
  }
  .btn-save:hover{border-color:var(--red);color:var(--red);}

  .sold-notice{
    text-align:center;
    padding:16px;
    background:rgba(232,25,26,0.08);
    border:1px solid var(--border-red);
    border-radius:6px;
    font-family:'Bebas Neue',sans-serif;
    font-size:1.1rem;letter-spacing:0.08em;
    color:var(--red);
    margin-bottom:10px;
  }

  /* ── FINANCE WRAPPER ── */
  .finance-wrap{
    border-top:1px solid var(--border);
    padding-top:16px;margin-top:16px;
  }
  .finance-label{
    font-family:'Barlow Condensed',sans-serif;
    font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;
    color:var(--muted);margin-bottom:12px;
    display:flex;align-items:center;gap:8px;
  }
  .finance-label::after{content:'';flex:1;height:1px;background:var(--border);}

  /* ── RECOMMEND ── */
  .recommend-section{
    max-width:1280px;margin:48px auto 0;padding:0 24px;
  }
  .recommend-title{
    font-family:'Bebas Neue',sans-serif;
    font-size:1.8rem;letter-spacing:0.06em;
    margin-bottom:20px;
    display:flex;align-items:center;gap:14px;
  }
  .recommend-title::after{
    content:'';flex:1;height:1px;
    background:linear-gradient(90deg,var(--border),transparent);
  }
  .recommend-grid{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:16px;
  }

  /* ── RESPONSIVE ── */
  @media(min-width:768px){
    .recommend-grid{grid-template-columns:repeat(3,1fr);}
  }
  @media(max-width:900px){
    .main-inner{grid-template-columns:1fr;}
    .sidebar{position:static;}
    .spec-grid{grid-template-columns:repeat(2,1fr);}
  }
  @media(max-width:480px){
    .spec-grid{grid-template-columns:1fr 1fr;}
    .car-title{font-size:1.8rem;}
    .price-amount{font-size:2rem;}
  }
`}</style>

<div className="page">
  {/* TOP SLASH */}
  <div className="slash-bar"/>

  {/* BREADCRUMB */}
  <div className="breadcrumb-bar">
    <div className="breadcrumb-inner">
      <a href="/">หน้าแรก</a>
      <span>/</span>
      <a href="/">รถมือสอง</a>
      <span>/</span>
      <span style={{color:'var(--text)'}}>{car.brand} {car.model}</span>
    </div>
  </div>

  {/* HEADER */}
  <div className="car-header">
    <div className="car-header-inner">
      <div>
        <div className="car-eyebrow">ประกาศรถมือสอง</div>
        <h1 className="car-title">{car.brand} {car.model}</h1>
        <p className="car-sub">ปี {car.year} · {Number(car.mileage).toLocaleString()} กม.</p>
      </div>
      <div style={{paddingTop:'8px'}}>
        {isSold ? (
          <div className="badge-sold">
            <div className="badge-dot"/>
            ขายแล้ว
          </div>
        ) : (
          <div className="badge-avail">
            <div className="badge-dot"/>
            พร้อมขาย ({car.stock} คัน)
          </div>
        )}
      </div>
    </div>
  </div>

  {/* MAIN GRID */}
  <div className="main-inner">

    {/* LEFT */}
    <div>

      {/* GALLERY */}
      <div className="gallery-card">
        <div className="gallery-top-stripe"/>
        <div style={{padding:'16px'}}>
          <ImageGallery images={images}/>
        </div>
      </div>

      {/* SPECS */}
      <div className="card" style={{marginTop:'20px'}}>
        <div className="card-body">
          <div className="card-title">ข้อมูลรถ</div>
          <div className="spec-grid">
            <div className="spec-cell">
              <div className="spec-label">ยี่ห้อ</div>
              <div className="spec-value">{car.brand}</div>
            </div>
            <div className="spec-cell">
              <div className="spec-label">รุ่น</div>
              <div className="spec-value">{car.model}</div>
            </div>
            <div className="spec-cell">
              <div className="spec-label">ปี</div>
              <div className="spec-value">{car.year}</div>
            </div>
            <div className="spec-cell">
              <div className="spec-label">เลขไมล์</div>
              <div className="spec-value">{Number(car.mileage).toLocaleString()} กม.</div>
            </div>
            <div className="spec-cell">
              <div className="spec-label">ราคา</div>
              <div className="spec-value red">{Number(car.price).toLocaleString()} ฿</div>
            </div>
            <div className="spec-cell">
              <div className="spec-label">สต็อก</div>
              <div className="spec-value">{car.stock} คัน</div>
            </div>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="card" style={{marginTop:'20px'}}>
        <div className="card-body">
          <div className="card-title">รายละเอียด</div>
          <p className="desc-text">{car.description}</p>
        </div>
      </div>

    </div>

    {/* RIGHT SIDEBAR */}
    <div className="sidebar">
      <div className="price-card">
        <div className="price-card-top">
          <div className="price-label">ราคาขาย</div>
          <div className="price-amount">{Number(car.price).toLocaleString()}</div>
          <div className="price-unit">บาท</div>
        </div>
        <div className="price-card-body">

          <CarFinance price={Number(car.price)} />

          {isSold ? (
            <div className="sold-notice">❌ รถคันนี้ขายแล้ว</div>
          ) : (
            <>
              <a href={`tel:${car.phone ?? "0800000000"}`} className="btn-call">
                📞 โทรหาผู้ขาย
              </a>
              <a href={`https://line.me/ti/p/~${car.line ?? ""}`} className="btn-line">
                💬 ติดต่อ LINE
              </a>
            </>
          )}

          <button className="btn-save">❤️ บันทึกรถ</button>

        </div>
      </div>
    </div>

  </div>

  {/* RECOMMEND */}
  <div className="recommend-section">
    <h2 className="recommend-title">🚗 รถแนะนำ</h2>
    <div className="recommend-grid">
      {recommend?.map((car:any)=>(
        <CarCard key={car.id} car={car}/>
      ))}
    </div>
  </div>

</div>
</>
)

}