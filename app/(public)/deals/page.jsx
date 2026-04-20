import ActiveDeals from "@/components/ActiveDeals";

export const metadata = {
  title: "GoCart. - Deals",
  description: "GoCart. - Active deals and coupon codes",
};

export default function DealsPage() {
  return <ActiveDeals limit={0} compact={false} />;
}
