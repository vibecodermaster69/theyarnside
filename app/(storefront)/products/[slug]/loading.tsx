// Streamed immediately on navigation so the route paints instantly instead of
// blocking on the product fetch. Mirrors the real product layout to avoid a jump.
export default function ProductLoading() {
  return (
    <main className="product-skeleton" aria-busy="true" aria-label="Loading product">
      <div className="skeleton-top" />
      <div className="skeleton-layout">
        <div className="skeleton-panel">
          <div className="skeleton-hero shimmer" />
          <div className="skeleton-thumbs">
            {[0, 1, 2].map((index) => <div key={index} className="skeleton-thumb shimmer" />)}
          </div>
        </div>
        <div className="skeleton-copy">
          <div className="shimmer line eyebrow" />
          <div className="shimmer line title" />
          <div className="shimmer line title short" />
          <div className="shimmer line price" />
          <div className="skeleton-rule" />
          {[0, 1, 2, 3].map((index) => <div key={index} className="shimmer line body" />)}
          <div className="shimmer line button" />
        </div>
        <div className="skeleton-aside">
          <div className="shimmer line heading" />
          {[0, 1, 2].map((index) => <div key={index} className="skeleton-rec shimmer" />)}
        </div>
      </div>
      <style>{`
        .product-skeleton{min-height:100vh;background:var(--cream);padding:28px 5vw 90px}
        .skeleton-top{max-width:1240px;margin:0 auto 38px;height:18px}
        .skeleton-layout{display:grid;grid-template-columns:minmax(260px,420px) minmax(280px,1fr) minmax(220px,320px);gap:54px;max-width:1240px;margin:auto;align-items:start}
        .skeleton-panel{background:var(--white);border:1px solid rgba(75,58,50,.1);padding:14px}
        .skeleton-hero{width:100%;aspect-ratio:4/5}
        .skeleton-thumbs{display:flex;gap:10px;margin-top:14px}
        .skeleton-thumb{flex:0 0 72px;height:82px;border-radius:8px}
        .skeleton-copy{padding-top:38px}
        .skeleton-aside{padding-top:38px}
        .line{border-radius:6px;margin-bottom:14px}
        .eyebrow{width:120px;height:11px}
        .title{width:100%;height:44px;margin-bottom:8px}
        .title.short{width:55%;margin-bottom:24px}
        .price{width:130px;height:26px;margin-bottom:24px}
        .skeleton-rule{height:1px;background:rgba(75,58,50,.14);margin-bottom:26px}
        .body{width:100%;height:13px}
        .body:last-of-type{width:70%}
        .button{width:190px;height:48px;border-radius:8px;margin-top:26px}
        .heading{width:210px;height:22px;margin-bottom:20px}
        .skeleton-rec{height:96px;border-radius:18px;margin-bottom:14px}
        .shimmer{background:linear-gradient(100deg,rgba(75,58,50,.07) 30%,rgba(75,58,50,.13) 50%,rgba(75,58,50,.07) 70%);background-size:200% 100%;animation:skeleton-slide 1.4s linear infinite}
        @keyframes skeleton-slide{from{background-position:200% 0}to{background-position:-200% 0}}
        @media(max-width:900px){.skeleton-layout{grid-template-columns:minmax(240px,400px) 1fr;gap:30px}.skeleton-aside{grid-column:1/-1;padding-top:0}}
        @media(max-width:600px){.product-skeleton{padding:22px 18px 70px}.skeleton-layout{display:block}.skeleton-copy{padding-top:28px}}
        @media(prefers-reduced-motion:reduce){.shimmer{animation:none}}
      `}</style>
    </main>
  );
}
