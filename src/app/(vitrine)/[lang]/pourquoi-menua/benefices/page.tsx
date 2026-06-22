import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? "Our Benefits – MENUA CONSULTING" : "Nos bénéfices – MENUA CONSULTING",
  };
}

export default async function Benefices({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === 'en';

  return (
    <main>
      <PageHeader
        title={isEn ? "Our Benefits" : "Nos bénéfices"}
        subtitle={isEn ? "Benefits for your organization." : "Bénéfices pour votre organisation."}
      />
      <section className="page-section">
        <div className="container page-container">
          <SectionTitle>{isEn ? "What you gain" : "Ce que vous gagnez"}</SectionTitle>
          <h2 className="page-title">
            {isEn ? "Benefits for your organization" : "Bénéfices pour votre organisation"}
          </h2>
          <p className="page-text">
            {isEn ? "By outsourcing your back and middle office functions to MENUA CONSULTING, you save time, improve your productivity, enhance your reliability, and sustainably support your turnover." : "En externalisant vos fonctions back et middle office avec MENUA CONSULTING, vous gagnez du temps, améliorez votre productivité, renforcez votre fiabilité et soutenez durablement votre chiffre d'affaires."}
          </p>
          <p className="page-text page-text--large-margin">
            {isEn ? "This organization allows you to reduce your internal costs, better absorb your business volumes, and sustainably retain your customer base." : "Cette organisation vous permet de réduire vos charges internes, de mieux absorber vos volumes d'activité et de fidéliser durablement votre clientèle."}
          </p>
          <div className="grid-generic">
            {[
              { title: isEn ? "Time saving" : "Gain de temps", icon: "⏱" },
              { title: isEn ? "Reduction of internal costs" : "Réduction des charges internes", icon: "↘" },
              { title: isEn ? "Increased productivity" : "Productivité accrue", icon: "↑" },
              { title: isEn ? "Enhanced efficiency" : "Efficacité renforcée", icon: "◎" },
              { title: isEn ? "Reliability of operations" : "Fiabilité des opérations", icon: "✓" },
              { title: isEn ? "Customer loyalty" : "Fidélisation de la clientèle", icon: "♾" },
              { title: isEn ? "Supported turnover" : "Chiffre d'affaires soutenu", icon: "→" },
            ].map((b, idx) => (
              <div key={idx} className="card-generic">
                <span className="card-generic__icon">
                  {b.icon}
                </span>
                <p className="card-generic__title">
                  {b.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
