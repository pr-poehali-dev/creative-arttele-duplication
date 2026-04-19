import Navbar from "@/components/Navbar";
import PageHero from "@/components/ui/PageHero";
import Icon from "@/components/ui/icon";
import blog from "@/data/blog";

export default function BlogPage() {
  return (
    <div className="min-h-screen mesh-bg noise font-sans text-white">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">

          <PageHero
            badge="Блог"
            badgeIcon="BookOpen"
            title="Полезно"
            highlight="знать"
            subtitle="Советы, новости и полезные материалы о домашнем интернете"
            accent="blue"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blog.map((post, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden border border-white/5 card-hover group cursor-pointer">
                <div className="h-52 overflow-hidden relative">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.5)", color: "var(--neon-blue)" }}>
                    {post.tag}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-white/30 text-xs mb-2">{post.date}</div>
                  <h2 className="font-semibold text-base text-white mb-3 leading-snug group-hover:text-[#00d4ff] transition-colors">{post.title}</h2>
                  <p className="text-white/40 text-sm leading-relaxed">{post.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold transition-all" style={{ color: "var(--neon-blue)" }}>
                    Читать <Icon name="ArrowRight" size={13} />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}