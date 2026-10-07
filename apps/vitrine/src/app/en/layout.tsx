import { Metadata } from 'next';

export const metadata: Metadata = {
  keywords: [
    "back office outsourcing",
    "middle office support",
    "AMF compliance",
    "wealth management",
    "financial services outsourcing"
  ]
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
