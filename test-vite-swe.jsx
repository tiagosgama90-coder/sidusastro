import SwissEphemeris from '@swisseph/browser';
import { Planet, HouseSystem } from '@swisseph/core';

export async function testSwe() {
  const swe = new SwissEphemeris();
  await swe.init('/swisseph.wasm');
  const jd = swe.julianDay(1988, 1, 29, 10.75);
  const sun = swe.calculatePosition(jd, Planet.Sun);
  const houses = swe.calculateHouses(jd, 39.4, -9.1, HouseSystem.Placidus);
  return { sun: sun.longitude, asc: houses.ascendant };
}
