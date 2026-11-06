import test from "node:test";
import assert from "node:assert/strict";
import { demoActivities, demoEnrollments } from "../src/data/demo-data.ts";
import {
  filterActivities,
  publishedActivities,
  findPublishedActivity,
  availableSeats,
  emptyFilters,
  readCatalogFilters,
  writeCatalogFilters,
} from "../src/features/catalog/catalog-selectors.ts";
const filter = (patch: Partial<typeof emptyFilters>) =>
  filterActivities(demoActivities, demoEnrollments, {
    ...emptyFilters,
    ...patch,
  });

test("RF11: todas as consultas excluem os quatro status não aprovados", () => {
  assert.equal(demoActivities.length, 16);
  assert.equal(publishedActivities(demoActivities).length, 12);
  assert.equal(filter({}).length, 12);
  for (const activity of demoActivities.filter(
    (item) => item.status !== "Aprovada",
  )) {
    assert.equal(findPublishedActivity(demoActivities, activity.id), undefined);
    assert.equal(filter({ query: activity.title }).length, 0);
  }
});
test("RF12: busca no título ignora caixa e acentos", () => {
  assert.deepEqual(
    filter({ query: "   ALGEBRA LINEAR  " }).map((item) => item.id),
    ["algebra-linear"],
  );
});
test("RF12: busca encontra palavra presente apenas na ementa", () => {
  assert.deepEqual(
    filter({ query: "juncoes" }).map((item) => item.id),
    ["sql-sem-misterio"],
  );
});
test("RF13: filtro por área temática", () => {
  const results = filter({ area: "Design" });
  assert.equal(results.length, 2);
  assert.ok(results.every((item) => item.thematicArea === "Design"));
});
test("RF14: intervalo inclui limites e exclui atividades fora dele", () => {
  const results = filter({ minHours: "4", maxHours: "6" });
  assert.equal(results.length, 6);
  assert.ok(results.every((item) => item.hours >= 4 && item.hours <= 6));
  assert.equal(filter({ minHours: "12", maxHours: "4" }).length, 0);
});
test("RF15: filtro por formato", () => {
  const results = filter({ format: "Remoto" });
  assert.equal(results.length, 6);
  assert.ok(results.every((item) => item.format === "Remoto"));
});
test("RF16: disponibilidade deriva de inscrições e exclui atividades lotadas", () => {
  const results = filter({ onlyAvailable: true });
  assert.equal(results.length, 10);
  assert.ok(results.every((item) => availableSeats(item, demoEnrollments) > 0));
  assert.equal(availableSeats(demoActivities[4], demoEnrollments), 0);
});
test("Filtros e busca se combinam pela interseção de todos os critérios", () => {
  assert.deepEqual(
    filter({
      query: "componentes",
      area: "Design",
      format: "Presencial",
      minHours: "6",
      maxHours: "6",
      onlyAvailable: true,
    }).map((item) => item.id),
    ["interfaces-figma"],
  );
  assert.equal(
    filter({ area: "Design", format: "Remoto", onlyAvailable: true }).length,
    0,
  );
});
test("Busca sem correspondência e limpeza restauram coleção aprovada", () => {
  assert.equal(filter({ query: "astronomia-inexistente-xyz" }).length, 0);
  assert.equal(filter({ ...emptyFilters }).length, 12);
});
test("Estado de filtros pode ser preservado em URL e descarta horas inválidas", () => {
  const filters = {
    ...emptyFilters,
    query: "Álgebra",
    area: "Matemática",
    minHours: "4",
    maxHours: "12",
    format: "Remoto",
    onlyAvailable: true,
  };
  assert.deepEqual(readCatalogFilters(writeCatalogFilters(filters)), filters);
  assert.equal(
    readCatalogFilters(new URLSearchParams("min=abc&max=-4")).minHours,
    "",
  );
  assert.equal(
    readCatalogFilters(new URLSearchParams("min=abc&max=-4")).maxHours,
    "",
  );
});
test("Detalhes só encontram ID publicado; inexistentes são tratados", () => {
  assert.equal(
    findPublishedActivity(demoActivities, "interfaces-figma")?.title,
    demoActivities[0].title,
  );
  assert.equal(
    findPublishedActivity(demoActivities, "id-inexistente"),
    undefined,
  );
});
test("Consultas não alteram inscrições nem capacidade das atividades", () => {
  const before = JSON.stringify([demoActivities, demoEnrollments]);
  filter({ onlyAvailable: true });
  filter({ query: "SQL" });
  assert.equal(JSON.stringify([demoActivities, demoEnrollments]), before);
});
