-- CreateTable
CREATE TABLE "TeamInitiative" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "initiativeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamInitiative_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamInitiative_teamId_initiativeId_key" ON "TeamInitiative"("teamId", "initiativeId");

-- AddForeignKey
ALTER TABLE "TeamInitiative" ADD CONSTRAINT "TeamInitiative_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInitiative" ADD CONSTRAINT "TeamInitiative_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "Initiative"("id") ON DELETE CASCADE ON UPDATE CASCADE;
