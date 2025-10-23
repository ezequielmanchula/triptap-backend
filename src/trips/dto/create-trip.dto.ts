import { TripType } from '@prisma/client';

export class CreateTripDto {
  origin: string;
  destination: string;
  tripType: TripType;
  totalSeats: number;
  price: number;
}
