"use client";
import {
  ClipboardList,
  PackageOpen,
  Truck,
  PackageCheck,
} from "lucide-react";

const statusConfig = {
  ORDER_PLACED: {
    label: "Order placed",
    className: "bg-slate-100 text-slate-700",
    Icon: ClipboardList,
  },
  PROCESSING: {
    label: "Processing",
    className: "bg-amber-100 text-amber-700",
    Icon: PackageOpen,
  },
  SHIPPED: {
    label: "Shipped",
    className: "bg-blue-100 text-blue-700",
    Icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-green-100 text-green-700",
    Icon: PackageCheck,
  },
};

const OrderStatusBadge = ({ status, className = "" }) => {
  const config = statusConfig[status] || statusConfig.ORDER_PLACED;
  const Icon = config.Icon;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${config.className} ${className}`}
    >
      <Icon size={14} />
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
