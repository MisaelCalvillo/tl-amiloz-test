export enum Roles {
  ADMIN = 'admin',
  USER = 'user'
}

export enum OfferStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  UNDER_REVIEW = 'UNDER_REVIEW'
}

export enum LoanStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  PAID = 'PAID',
  DEFAULTED = 'DEFAULTED',
  RESTRUCTURED = 'RESTRUCTURED',
  CANCELLED = 'CANCELLED',
  UNDER_REVIEW = 'UNDER_REVIEW'
}

export enum PaymentStatus {
  SCHEDULED = 'SCHEDULED',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  PARTIAL = 'PARTIAL'
}