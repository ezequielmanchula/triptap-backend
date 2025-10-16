/*
  Warnings:

  - You are about to drop the column `date` on the `Trip` table. All the data in the column will be lost.
  - Added the required column `tripType` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TripType" AS ENUM ('ONE_WAY', 'ROUND_TRIP');

-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "date",
ADD COLUMN     "tripType" "TripType" NOT NULL;
