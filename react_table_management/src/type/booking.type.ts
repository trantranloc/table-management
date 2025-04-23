import { Table } from "./table.type";
import { User } from "./user.type";

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  numberOfPeople: number;
  bookingTime: string;
  note?: string;
  status: BookingStatus;
  table?: Table;
  handledBy?: User;
  createdAt?: string;
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED"
}

export type BookingRequest = Pick<Booking, 'customerName' | 'phone' | 'numberOfPeople' | 'bookingTime' | 'note'>;