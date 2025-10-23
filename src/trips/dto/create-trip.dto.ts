// Local TripType definition to match Prisma enum
export type TripType = 'ONE_WAY' | 'ROUND_TRIP';

export class CreateTripDto {
  origin: string;
  destination: string;
  tripType: TripType;
  totalSeats: number;
  price: number;
}
