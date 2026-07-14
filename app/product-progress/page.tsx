import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getPublicData } from "@/lib/public-data";

export default async function ProductProgressPage() {
  const data = await getPublicData();
  const products = data.products.filter((item) => item.isPublic);

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Product Progress</p>
              <h1>产品进展</h1>
              <p>这里只展示你自己创业要做的产品，以及它当前的推进状态。</p>
            </div>
            <Link className="button" href="/growth">
              去成长路径
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="project-grid">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
