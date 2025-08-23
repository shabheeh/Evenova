import z from "zod";
import type { User } from "./user.types";

export const createEventSchema = z
  .object({
    title: z.string().min(1, "Event name is required"),
    category: z.string().min(1, "Category is required"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    image: z.string().url("Please select an image").min(1, "Image is required"),
    startDateTime: z.date({ message: "Start date and time is required" }),
    endDateTime: z.date({ message: "End date and time is required" }),
    isOnline: z.boolean(),
    location: z.object({
      venue: z.string().min(1, "Venue is required"),
      address: z.string().min(1, "Address is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      zip: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid PIN code"),
    }),
    onlineLink: z.string().url().optional().or(z.literal("")),
    tickets: z
      .array(
        z.object({
          name: z.string().min(1, "Ticket name is required"),
          price: z.string().min(1, "Price is required"),
          quantity: z.string().min(1, "Quantity is required"),
          foodIncluded: z.boolean(),
        })
      )
      .min(1, "At least one ticket type is required"),
    capacity: z.string().min(1, "Capacity is required"),
    tags: z.string().min(1, "Tags are required"),
    needJudges: z.boolean(),
    judges: z
      .array(
        z.object({
          name: z.string().min(1, "Judge name is required"),
          email: z.string().email("Valid email is required"),
          expertise: z.string().min(1, "Expertise is required"),
          bio: z.string().optional(),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.isOnline) {
        return (
          data.location.venue &&
          data.location.address &&
          data.location.city &&
          data.location.state &&
          data.location.zip
        );
      }
      return true;
    },
    {
      message: "All location fields are required for in-person events",
      path: ["location"],
    }
  )
  .refine(
    (data) => {
      if (data.endDateTime && data.startDateTime) {
        const diffMs =
          data.endDateTime.getTime() - data.startDateTime.getTime();
        return diffMs >= 1800000;
      }
      return true;
    },
    {
      message: "End time must be at least 30 minutes after start time",
      path: ["endDateTime"],
    }
  )
  .refine(
    (data) => {
      if (data.needJudges) {
        return data.judges && data.judges.length > 0;
      }
      return true;
    },
    {
      message: "Add at least one judge or turn off Judges Needed",
      path: ["judges"],
    }
  )
  .refine(
    (data) => {
      const ticketQtySum = data.tickets.reduce(
        (acc, t) => acc + Number(t.quantity),
        0
      );
      return Number(data.capacity) == ticketQtySum;
    },
    {
      message: "Capacity must be the the sum of all ticket quantities",
      path: ["capacity"],
    }
  );

export type CreateEventFormData = z.infer<typeof createEventSchema>;

export interface Event {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  startDateTime: Date;
  endDateTime: Date;
  isOnline: boolean;
  location?:
    | {
        venue: string;
        address: string;
        city: string;
        state: string;
        zip: string;
      }
    | undefined;
  onlineLink?: string | undefined;
  tickets: Ticket[];
  capacity: number;
  tags: string[];
  needJudges: boolean;
  judges: {
    name: string;
    email: string;
    expertise: string;
    bio?: string;
  }[];
  organizer: User;
  status: string;
  attendeesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  name: string;
  price: number;
  quantity: number;
  available: number;
  foodIncluded: boolean;
}
