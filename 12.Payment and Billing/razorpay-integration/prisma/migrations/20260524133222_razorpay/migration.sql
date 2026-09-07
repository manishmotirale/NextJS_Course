-- CreateEnum
CREATE TYPE "PLAN" AS ENUM ('FREE', 'PRO');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "plan" "PLAN" NOT NULL DEFAULT 'FREE';
