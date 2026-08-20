/*
  Warnings:

  - You are about to drop the column `puntuacionAgua` on the `Resultado` table. All the data in the column will be lost.
  - You are about to drop the column `puntuacionAire` on the `Resultado` table. All the data in the column will be lost.
  - You are about to drop the column `puntuacionFuego` on the `Resultado` table. All the data in the column will be lost.
  - You are about to drop the column `puntuacionTierra` on the `Resultado` table. All the data in the column will be lost.
  - You are about to drop the column `respuestaDudosa` on the `Resultado` table. All the data in the column will be lost.
  - Added the required column `puntuacionCautela` to the `Resultado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `puntuacionCooperacion` to the `Resultado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `puntuacionDisciplina` to the `Resultado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `puntuacionIniciativa` to the `Resultado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `puntuacionLiderazgo` to the `Resultado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `puntuacionRiesgo` to the `Resultado` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Resultado" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pilotoId" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "puntuacionRiesgo" INTEGER NOT NULL,
    "puntuacionCautela" INTEGER NOT NULL,
    "puntuacionCooperacion" INTEGER NOT NULL,
    "puntuacionDisciplina" INTEGER NOT NULL,
    "puntuacionIniciativa" INTEGER NOT NULL,
    "puntuacionLiderazgo" INTEGER NOT NULL,
    "respuestasCrudas" TEXT NOT NULL,
    "comentarios" TEXT,
    "analisisPersonalizado" TEXT,
    CONSTRAINT "Resultado_pilotoId_fkey" FOREIGN KEY ("pilotoId") REFERENCES "Piloto" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Resultado" ("analisisPersonalizado", "fecha", "id", "pilotoId", "respuestasCrudas") SELECT "analisisPersonalizado", "fecha", "id", "pilotoId", "respuestasCrudas" FROM "Resultado";
DROP TABLE "Resultado";
ALTER TABLE "new_Resultado" RENAME TO "Resultado";
CREATE INDEX "Resultado_pilotoId_idx" ON "Resultado"("pilotoId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
