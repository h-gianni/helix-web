-- CreateTable
CREATE TABLE "org_name" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "org_name_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "org_name" ADD CONSTRAINT "org_name_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
