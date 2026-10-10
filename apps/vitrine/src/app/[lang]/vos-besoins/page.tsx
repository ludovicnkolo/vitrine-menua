import { Metadata } from 'next';
import YourNeedsClientPage from '@/components/pages/YourNeedsClientPage';
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';

  return {
    title: isEn ? "Your Needs" : "Vos Besoins",
    description: isEn
      ? "Finance, compliance, data: structured operational support to strengthen your teams and maintain continuity."
      : "Finance, conformité, data : nous répondons à vos besoins de renfort opérationnel et de support fonctionnel.",
    alternates: {
      canonical: isEn ? 'https://menuaconsulting.com/en/your-needs' : 'https://menuaconsulting.com/fr/vos-besoins',
      languages: {
        'fr-FR': 'https://menuaconsulting.com/fr/vos-besoins',
        'en-GB': 'https://menuaconsulting.com/en/your-needs',
        'x-default': 'https://menuaconsulting.com/fr/vos-besoins',
      },
    },
    openGraph: {
      title: isEn ? "Your Needs | Menua Consulting" : "Vos Besoins | Menua Consulting",
      description: isEn
        ? "Finance, compliance, data: operational support and functional reinforcement."
        : "Finance, conformité, data : renfort opérationnel et support fonctionnel.",
      locale: isEn ? 'en_GB' : 'fr_FR',
      url: isEn ? 'https://menuaconsulting.com/en/your-needs' : 'https://menuaconsulting.com/fr/vos-besoins',
    },
  };
}

export default function Page() {
  return <YourNeedsClientPage />;
}
