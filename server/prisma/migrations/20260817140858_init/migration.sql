-- CreateTable
CREATE TABLE "Piloto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "org" TEXT NOT NULL DEFAULT 'APEX SYNDICATE',
    "fechaAlta" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Resultado" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pilotoId" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "puntuacionAire" REAL NOT NULL,
    "puntuacionAgua" REAL NOT NULL,
    "puntuacionTierra" REAL NOT NULL,
    "puntuacionFuego" REAL NOT NULL,
    "respuestaDudosa" BOOLEAN NOT NULL DEFAULT false,
    "respuestasCrudas" TEXT NOT NULL,
    CONSTRAINT "Resultado_pilotoId_fkey" FOREIGN KEY ("pilotoId") REFERENCES "Piloto" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Resultado_pilotoId_idx" ON "Resultado"("pilotoId");
