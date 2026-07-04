import SiteChrome from "@/components/SiteChrome";

export default function InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome>{children}</SiteChrome>;
}
