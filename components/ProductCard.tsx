import { ProgressBar } from "@/components/ProgressBar";
import type { ProductProgress } from "@/lib/types";

export function ProductCard({ product }: { product: ProductProgress }) {
  return (
    <article className="product-card">
      <div className="card-head">
        <div>
          <p className="eyebrow">{product.status}</p>
          <h3>{product.name}</h3>
        </div>
        <span className="status">{product.progress}%</span>
      </div>
      <p className="summary">{product.tagline}</p>
      <div className="product-copy">
        <div>
          <strong>要解决的问题</strong>
          <p>{product.problem}</p>
        </div>
        <div>
          <strong>当前方案</strong>
          <p>{product.solution}</p>
        </div>
      </div>
      <ProgressBar value={product.progress} />
      <div className="tag-row">
        {product.roadmap.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </article>
  );
}
