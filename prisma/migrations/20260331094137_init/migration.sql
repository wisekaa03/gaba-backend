CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PromoCode" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "code" TEXT NOT NULL,
    "discountPercent" INTEGER NOT NULL,
    "activationLimit" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PromoCodeActivation" (
    "promoCodeId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromoCodeActivation_pkey"
    PRIMARY KEY ("promoCodeId", "userId")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "PromoCode_code_key" ON "PromoCode"("code");

CREATE INDEX "PromoCodeActivation_promoCodeId_idx"
ON "PromoCodeActivation"("promoCodeId");

CREATE INDEX "PromoCodeActivation_userId_idx"
ON "PromoCodeActivation"("userId");

ALTER TABLE "PromoCodeActivation"
ADD CONSTRAINT "PromoCodeActivation_promoCodeId_fkey"
FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PromoCodeActivation"
ADD CONSTRAINT "PromoCodeActivation_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
