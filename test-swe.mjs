import SwissEphemeris from '@swisseph/browser';
import { Planet, HouseSystem } from '@swisseph/core';

const swe = new SwissEphemeris();
await swe.init();
console.log('version:', swe.version());

// Jan 29 1988 10:45 UT - Caldas da Rainha 39.4N -9.1W
const jd = swe.julianDay(1988, 1, 29, 10.75);
console.log('JD:', jd);
const sun = swe.calculatePosition(jd, Planet.Sun);
console.log('Sun:', sun.longitude.toFixed(4));
const moon = swe.calculatePosition(jd, Planet.Moon);
console.log('Moon:', moon.longitude.toFixed(4));
const merc = swe.calculatePosition(jd, Planet.Mercury);
const venus = swe.calculatePosition(jd, Planet.Venus);
const mars = swe.calculatePosition(jd, Planet.Mars);
const jup = swe.calculatePosition(jd, Planet.Jupiter);
const sat = swe.calculatePosition(jd, Planet.Saturn);
console.log('Mercury:', merc.longitude.toFixed(4));
console.log('Venus:', venus.longitude.toFixed(4));
console.log('Mars:', mars.longitude.toFixed(4));
console.log('Jupiter:', jup.longitude.toFixed(4));
console.log('Saturn:', sat.longitude.toFixed(4));

const houses = swe.calculateHouses(jd, 39.4, -9.1, HouseSystem.Placidus);
console.log('Ascendant:', houses.ascendant.toFixed(4));
console.log('MC:', houses.mc.toFixed(4));
