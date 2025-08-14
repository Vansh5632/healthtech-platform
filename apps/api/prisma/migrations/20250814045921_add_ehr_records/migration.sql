-- CreateEnum
CREATE TYPE "public"."EHRRecordType" AS ENUM ('CLINICAL_NOTE', 'LAB_RESULT', 'IMAGING_STUDY');

-- CreateTable
CREATE TABLE "public"."EHRRecord" (
    "id" TEXT NOT NULL,
    "recordType" "public"."EHRRecordType" NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "patientId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,

    CONSTRAINT "EHRRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."EHRRecord" ADD CONSTRAINT "EHRRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EHRRecord" ADD CONSTRAINT "EHRRecord_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
