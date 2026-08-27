// Shared status vocabulary for bespoke inquiries and out-of-stock order
// requests. The order below is the suggested progression shown in admin; the
// admin can move a record to any status at any time.
export const REQUEST_STATUSES = [
  "new",
  "accepted",
  "rejected",
  "in_progress",
  "completed",
  "packed",
  "shipped",
  "cancelled",
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  new: "New",
  accepted: "Accepted",
  rejected: "Rejected",
  in_progress: "In progress",
  completed: "Completed",
  packed: "Packed",
  shipped: "Shipped",
  cancelled: "Cancelled",
};

export function requestStatusLabel(status: string) {
  return REQUEST_STATUS_LABELS[status as RequestStatus] ?? status;
}
