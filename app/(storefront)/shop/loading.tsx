export default function ShopLoading() {
  return (
    <main className="shop-skeleton" aria-busy="true" aria-label="Loading shop">
      <div className="container">
        <div className="skeleton-toolbar">
          <div className="shimmer control" />
          <div className="shimmer control" />
        </div>
        <div className="skeleton-grid">
          {Array.from({ length: 8 }, (_, index) => (
            <div className="skeleton-card" key={index}>
              <div className="shimmer skeleton-thumb" />
              <div className="skeleton-body">
                <div className="shimmer line short" />
                <div className="shimmer line" />
                <div className="shimmer line price" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .shop-skeleton{min-height:100vh;background:var(--cream);padding:64px 0}
        .skeleton-toolbar{display:flex;gap:16px;margin-bottom:32px;padding-bottom:20px;border-bottom:1px solid rgba(75,58,50,.1)}
        .control{width:190px;height:44px;border-radius:4px}
        .skeleton-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
        .skeleton-card{overflow:hidden;background:#fff;border:1px solid rgba(75,58,50,.08);border-radius:12px}
        .skeleton-thumb{aspect-ratio:4/5}
        .skeleton-body{padding:16px 18px 18px}
        .line{height:13px;border-radius:6px;margin-bottom:10px}
        .line.short{width:45%;height:10px}
        .line.price{width:35%;height:18px;margin-bottom:0}
        .shimmer{background:linear-gradient(100deg,rgba(75,58,50,.07) 30%,rgba(75,58,50,.13) 50%,rgba(75,58,50,.07) 70%);background-size:200% 100%;animation:skeleton-slide 1.4s linear infinite}
        @keyframes skeleton-slide{from{background-position:200% 0}to{background-position:-200% 0}}
        @media(max-width:991px){.skeleton-grid{grid-template-columns:repeat(3,1fr)}}
        @media(max-width:640px){.skeleton-grid{grid-template-columns:repeat(2,1fr);gap:12px}}
        @media(prefers-reduced-motion:reduce){.shimmer{animation:none}}
      `}</style>
    </main>
  );
}
