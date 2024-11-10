-- CreateTable
CREATE TABLE "Suport" (
    "id" UUID NOT NULL,
    "id_desabafo" UUID NOT NULL,

    CONSTRAINT "Suport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vent" (
    "id" UUID NOT NULL,
    "titulo" VARCHAR(50) NOT NULL,
    "descricao" VARCHAR(2500) NOT NULL,

    CONSTRAINT "Vent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Suport" ADD CONSTRAINT "Suport_id_desabafo_fkey" FOREIGN KEY ("id_desabafo") REFERENCES "Vent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
