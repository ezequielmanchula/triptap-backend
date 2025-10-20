import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebSocketsGateway } from 'src/web-socket/web-socket.gateway';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly websocketGateway: WebSocketsGateway,
  ) {}

  //reservar Asiento
  async create(createBookingDto: CreateBookingDto) {
    const { userId, tripId, seatNumber } = createBookingDto;

    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        tripId,
        seatNumber,
        isActive: true, //ocupado
      },
    });

    if (existingBooking) {
      throw new ConflictException(
        'El asiento ya está reservado para este viaje.',
      );
    }

    const booking = await this.prisma.booking.create({
      data: {
        userId,
        tripId,
        seatNumber,
        isActive: true,
        isConfirmed: false,
      },
    });

    this.websocketGateway.notifySeatReserved(tripId, seatNumber);
    return booking;
  }
  //obterner reservas
  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        user: { select: { name: true, email: true } },
        trip: { select: { origin: true, destination: true, tripType: true } },
      },
    });
  }

  //obtener reserva por id
  async findOne(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, lastName: true, email: true } },
        trip: {
          select: {
            origin: true,
            destination: true,
            tripType: true,
            price: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }

    return booking;
  }

  //actualizar reserva
  async update(id: number, updateBookingDto: UpdateBookingDto) {
    await this.findOne(id); // Verificar si la reserva existe
    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
    });
  }

  //eliminar reserva
  async remove(id: number) {
    await this.findOne(id); // Verificar si la reserva existe
    return this.prisma.booking.delete({
      where: { id },
    });
  }

  // // Verificar si la reserva existe

  async confirmBooking(bookingId: number) {
    const booking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { isConfirmed: true },
    });

    this.websocketGateway.notifyBookingConfirmed(
      booking.tripId,
      booking.seatNumber,
    );
    return booking;
  }

  async cancelBooking(bookingId: number) {
    const booking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { isConfirmed: false, isActive: false },
    });
    this.websocketGateway.notifySeatFreed(booking.tripId, booking.seatNumber);
    return booking;
  }

  async getAvailableSeats(tripId: number) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new NotFoundException(`Viaje con ID ${tripId} no encontrado`);
    }

    const occupiedSeats = await this.prisma.booking.findMany({
      where: { tripId, isActive: true },
      select: { seatNumber: true },
    });

    const occupiedSeatNumbers = occupiedSeats.map((seat) => seat.seatNumber);
    const allSeats = Array.from({ length: trip.totalSeats }, (_, i) => i + 1);
    const availableSeatNumbers = allSeats.filter(
      (seat) => !occupiedSeatNumbers.includes(seat),
    );

    return {
      totalSeats: trip.totalSeats,
      occupiedSeats: occupiedSeats.length,
      availableSeats: availableSeatNumbers.length,
      availableSeatNumbers,
    };
  }

  async getUserBookings(userId: number) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        trip: {
          select: {
            origin: true,
            destination: true,
            tripType: true,
            price: true,
          },
        },
      },
    });
  }
}
