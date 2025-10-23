import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateTripDto) {
    return this.prisma.trip.create({ data: data as any });
  }

  findAll() {
    return this.prisma.trip.findMany();
  }

  findOne(id: number) {
    return this.prisma.trip.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateTripDto) {
    return this.prisma.trip.update({ where: { id }, data: data as any });
  }

  remove(id: number) {
    return this.prisma.trip.delete({ where: { id } });
  }
}
