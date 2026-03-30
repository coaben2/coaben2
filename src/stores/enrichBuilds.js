import fs from 'fs';
import { Buffer } from 'buffer';
import { decode } from 'gw2e-chat-codes';

const INPUT_FILE = 'src/data/builds.json';
const OUTPUT_FILE = 'src/data/gw2Builds.json';

const weaponNameMap = {
  Hache: 'Axe',
  Espadon: 'Greatsword',
  Épée: 'Sword',
  Dague: 'Dagger',
  Masse: 'Mace',
  Pistolet: 'Pistol',
  Sceptre: 'Scepter',
  Bâton: 'Staff',
  Arc_long: 'Longbow',
  Arc_court: 'Shortbow',
  Bouclier: 'Shield',
  Torche: 'Torch',
  Cor_de_guerre: 'Warhorn',
  Focus: 'Focus',
  Marteau: 'Hammer',
  Fusil: 'Rifle',
  Lance: 'Spear',
};

const profNameMap = {
  guerrier: 'Warrior',
  gardien: 'Guardian',
  revenant: 'Revenant',
  rodeur: 'Ranger',
  voleur: 'Thief',
  ingenieur: 'Engineer',
  elementaliste: 'Elementalist',
  envouteur: 'Mesmer',
  necromant: 'Necromancer',
};

const profIdToKey = {
  1: 'gardien',
  2: 'guerrier',
  3: 'ingenieur',
  4: 'rodeur',
  5: 'voleur',
  6: 'elementaliste',
  7: 'envouteur',
  8: 'necromant',
  9: 'revenant',
};

const weaponPaletteMap = {
  1: 'Axe',
  2: 'Dagger',
  3: 'Mace',
  4: 'Pistol',
  5: 'Scepter',
  6: 'Sword',
  7: 'Focus',
  8: 'Shield',
  9: 'Torch',
  10: 'Warhorn',
  11: 'Greatsword',
  12: 'Hammer',
  13: 'Longbow',
  14: 'Rifle',
  15: 'Shortbow',
  16: 'Staff',
  17: 'Harpoon Gun',
  18: 'Spear',
  19: 'Trident',
};

const commonItemsMap = {
  force: 24615,
  malice: 91478,
  géomancie: 24605,
  geomancie: 24605,
  énergie: 24607,
  energie: 24607,
  frappe: 24639,
  fermeté: 24615,
  fermete: 24615,
  célérité: 24865,
  celerite: 24865,
  cruauté: 24625,
  cruaute: 24625,
  soif_de_sang: 24562,
  drainage: 24591,
  agilité: 24603,
  agilite: 24603,
  explosion: 44944,
  air: 24554,
  terre: 24560,
  feu: 24548,
  feux: 24548, 
  eau: 24551,
  précision: 24564,
  precision: 24564,
  impact: 24868,
  puissance: 24560,
  éclatement: 44944,
  eclatement: 44944,
  purification: 24581,
  concentration: 72339,
  destruction: 24585,
  intelligence: 24589,
  paralysie: 24609,
  pureté: 24552,
  purete: 24552,
  renouveau: 24833,
  transfert: 24599,
  vitesse: 24577,
  endurance: 24562,
  choc: 24639,
  tourment: 48911,
  annulation: 24585, 
  nettoyage: 24581,
  exploitation: 38294,
  // Runes
  érudit: 24836,
  erudit: 24836,
  scholars: 24836,
  cauchemar: 24819,
  tourmente: 91432,
  balthazar: 24815,
  gardien: 24723,
  draconique: 92108,
  divinité: 24734,
  divinite: 24734,
  rage: 24718,
  sang: 24715,
  troupeau: 24711,
  troupe: 24711,
  voleur: 24714,
  aventure: 24732,
  trappeur: 24830,
  berserker: 70412,
  pack: 24823,
  feux_dartifice: 87398,
  infiltration: 24831,
  moine: 24723,
  aventurier: 24732,
  aristocratie: 24734,
  durabilité: 74413,
  durabilite: 74413,
  aigle: 24820,
  krait: 24817,
  miséricorde: 24721,
  misericorde: 24721,
  rayonnement: 24710,
  faucheur: 75782,
  renégat: 82061,
  renegat: 82061,
  résistance: 72124,
  resistance: 72124,
  fléau: 84438,
  fleau: 84438,
  rune_de_force: 24707,
  vampirisme: 24713,
  tisse_sort: 83664
};

function decodeBuildV2(chatCode) {
  if (!chatCode || !chatCode.startsWith('[&') || !chatCode.endsWith(']')) return null;
  const base64 = chatCode.slice(2, -1);
  const buffer = Buffer.from(base64, 'base64');
  if (buffer[0] !== 0x0D) return null;

  const res = {
    weaponPaletteIds: [], // [M1, O1, M2, O2]
    sigilIds: [], // [S1_1, S1_2, S2_1, S2_2]
    runeId: null,
    relicId: null,
  };

  if (buffer.length < 44) return res;

  // Weapons (Offsets: 44, 46, 48, 50)
  for (let i = 0; i < 4; i++) {
    const offset = 44 + i * 2;
    if (offset + 1 < buffer.length) {
      const id = buffer[offset] | (buffer[offset + 1] << 8);
      if (id > 0) res.weaponPaletteIds[i] = id;
    }
  }

  // Sigils (Offsets: 52, 54, 56, 58)
  if (buffer.length >= 54) {
    for (let i = 0; i < 4; i++) {
      const offset = 52 + i * 2;
      if (offset + 1 < buffer.length) {
        const id = buffer[offset] | (buffer[offset + 1] << 8);
        if (id > 0) res.sigilIds.push(id);
      }
    }
  }

  // Rune (Offset: 60, 4 bytes)
  if (buffer.length >= 64) {
    const id = buffer[60] | (buffer[61] << 8) | (buffer[62] << 16) | (buffer[63] << 24);
    if (id > 0) res.runeId = id;
  }

  // Relic (Offset: 64, 2 bytes)
  if (buffer.length >= 66) {
    const id = buffer[64] | (buffer[65] << 8);
    if (id > 0) res.relicId = id;
  }

  return res;
}

async function fetchJson(url, ignoreErrors = false) {
  const separator = url.includes('?') ? '&' : '?';
  const schemaVer = 'v=2019-12-19T00:00:00Z';
  const fullUrl = `${url}${separator}${schemaVer}`;
  try {
    const res = await fetch(fullUrl);
    if (!res.ok) {
        const text = await res.text();
        if (ignoreErrors) return null;
        throw new Error(`API Error ${res.status}: ${fullUrl}\nResponse: ${text.slice(0, 200)}`);
    }
    return res.json();
  } catch (e) {
    if (ignoreErrors) return null;
    throw e;
  }
}

async function enrich() {
  console.log('Reading builds...');
  const data = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  
  const allSkillIds = new Set();
  const allTraitIds = new Set();
  const allSpecIds = new Set();
  const allPetIds = new Set();
  const allItemIds = new Set();
  
  const professionDataByRawKey = {};
  const issues = [];

  // 1. First pass: Decode and collect IDs + Profession Data
  for (const profKey of Object.keys(data)) {
    if (profKey === 'sources') continue;
    
    const apiProfName = profNameMap[profKey.toLowerCase()];
    if (!apiProfName) {
        console.warn(`Warning: No API mapping for profession key "${profKey}"`);
        continue;
    }
    
    console.log(`Fetching profession data for ${apiProfName}...`);
    const profApi = await fetchJson(`https://api.guildwars2.com/v2/professions/${apiProfName}?lang=fr`);
    if (!profApi || !profApi.skills_by_palette) {
        console.error(`ERROR: Could not get skills_by_palette for ${apiProfName}`);
        continue;
    }

    const paletteMap = {};
    profApi.skills_by_palette.forEach(pair => paletteMap[pair[0]] = pair[1]);
    profApi.paletteMap = paletteMap;
    professionDataByRawKey[profKey] = profApi;

    for (const build of data[profKey]) {
      console.log(`Processing build: ${build.id || 'unknown'}`);
      if (!build.chatCode) continue;
      
      let decoded;
      try {
        decoded = decode(build.chatCode);
        build._decoded = decoded;
        build._decodedV2 = decodeBuildV2(build.chatCode);

        if (build._decodedV2) {
            // Fallback to details if V2 decoding yields no equipment (likely legacy code)
            const hasEquipment = build._decodedV2.sigilIds.length || build._decodedV2.weaponPaletteIds.length || build._decodedV2.runeId || build._decodedV2.relicId;
            
            if (!hasEquipment && build.details) {
                if (build.details.runes) {
                    const rName = build.details.runes.trim().toLowerCase().replace(/ /g, '_');
                    const rId = commonItemsMap[rName] || 
                               commonItemsMap[rName.replace(/s$/, '')] ||
                               commonItemsMap[rName.replace(/x$/, '')];
                    if (rId) build._decodedV2.runeId = rId;
                }
                if (build.details.sigils) {
                    const sList = build.details.sigils.split(',').map(s => s.trim().toLowerCase().replace(/ /g, '_'));
                    sList.forEach(sName => {
                        const sId = commonItemsMap[sName] || 
                                   commonItemsMap[sName.replace(/s$/, '')] ||
                                   commonItemsMap[sName.replace(/x$/, '')];
                        if (sId) build._decodedV2.sigilIds.push(sId);
                    });
                }
            }

            if (build._decodedV2.sigilIds.length) build._decodedV2.sigilIds.forEach(id => allItemIds.add(id));
            if (build._decodedV2.runeId) allItemIds.add(build._decodedV2.runeId);
            if (build._decodedV2.relicId) allItemIds.add(build._decodedV2.relicId);
        }

        const decodedProfKey = profIdToKey[decoded.profession];
        if (decodedProfKey !== profKey) {
          issues.push(`[Profession Mismatch] Build "${build.name}" in ${profKey} category decodes as ${decodedProfKey || 'unknown'}`);
        }
      } catch (e) {
        const msg = `Error decoding chatCode for build ${build.id}: ${e.message}`;
        console.error(msg);
        issues.push(msg);
        continue;
      }

      // Skills from palette
      const palettes = [
        decoded.terrestrialHealSkill,
        decoded.terrestrialUtilitySkill1,
        decoded.terrestrialUtilitySkill2,
        decoded.terrestrialUtilitySkill3,
        decoded.terrestrialEliteSkill
      ].filter(id => id);
      
      palettes.forEach(p => {
        const sId = paletteMap[p];
        if (sId) allSkillIds.add(sId);
      });

      // Fallback: search by name in details.sigils (can be a list)
      if (build._decodedV2 && build._decodedV2.sigilIds.length === 0 && build.details?.sigils) {
        const sigilNames = build.details.sigils.split(',').map(s => s.trim().toLowerCase().replace(/ /g, '_'));
        sigilNames.forEach(sName => {
          const sId = commonItemsMap[sName] || 
                      commonItemsMap[sName.replace(/s$/, '')] ||
                      commonItemsMap[sName.replace(/x$/, '')];
          if (sId) allItemIds.add(sId);
        });
      }

      // Specializations & Validation
      const specs = [
        { id: decoded.specialization1, key: 'spec1' },
        { id: decoded.specialization2, key: 'spec2' },
        { id: decoded.specialization3, key: 'spec3' }
      ].filter(s => s.id > 0);

      for (const sEntry of specs) {
        // We need to fetch spec dynamically or wait for batch?
        // Actually, we add it to allSpecIds and validate later in enrichment.
        allSpecIds.add(sEntry.id);
      }

      // Pets
      if (decoded.terrestrialPet1) allPetIds.add(decoded.terrestrialPet1);
      if (decoded.terrestrialPet2) allPetIds.add(decoded.terrestrialPet2);

      // Weapon skills
      if (build.details && build.details.weapons) {
        const weapons = build.details.weapons.split('+');
        weapons.forEach(set => {
          const parts = set.split('/').map(s => s.trim());
          parts.forEach(p => {
            const engName = weaponNameMap[p.replace(/ /g, '_')];
            const weaponInfo = profApi.weapons[engName];
            if (weaponInfo) {
              weaponInfo.skills.forEach(s => allSkillIds.add(s.id));
            }
          });
        });
      }
    }
  }

  // 2. Fetch all missing details in batch
  console.log(`Fetching ${allSkillIds.size} skills, ${allSpecIds.size} specs, ${allPetIds.size} pets, ${allItemIds.size} items...`);
  
  const skillsMap = {};
  if (allSkillIds.size > 0) {
    const skillIdsArray = Array.from(allSkillIds);
    // Break into chunks of 200 to avoid long URLs
    for (let i = 0; i < skillIdsArray.length; i += 200) {
      const chunk = skillIdsArray.slice(i, i + 200);
      const skillsData = await fetchJson(`https://api.guildwars2.com/v2/skills?lang=fr&ids=${chunk.join(',')}`);
      skillsData.forEach(s => skillsMap[s.id] = s);
    }
  }

  const specsMap = {};
  if (allSpecIds.size > 0) {
    const specsData = await fetchJson(`https://api.guildwars2.com/v2/specializations?lang=fr&ids=${Array.from(allSpecIds).join(',')}`);
    specsData.forEach(s => {
      specsMap[s.id] = s;
      s.major_traits.forEach(tId => allTraitIds.add(tId));
      s.minor_traits.forEach(tId => allTraitIds.add(tId));
    });
  }

  const petsMap = {};
  if (allPetIds.size > 0) {
    const petsData = await fetchJson(`https://api.guildwars2.com/v2/pets?lang=fr&ids=${Array.from(allPetIds).join(',')}`);
    petsData.forEach(p => petsMap[p.id] = p);
  }

  console.log(`Fetching ${allTraitIds.size} traits...`);
  const traitsMap = {};
  if (allTraitIds.size > 0) {
    const traitIdsArray = Array.from(allTraitIds);
    for (let i = 0; i < traitIdsArray.length; i += 200) {
        const chunk = traitIdsArray.slice(i, i + 200);
        const traitsData = await fetchJson(`https://api.guildwars2.com/v2/traits?lang=fr&ids=${chunk.join(',')}`);
        traitsData.forEach(t => traitsMap[t.id] = t);
    }
  }

  const itemsMap = {};
  if (allItemIds.size > 0) {
    const itemIdsArray = Array.from(allItemIds);
    for (let i = 0; i < itemIdsArray.length; i += 200) {
        const chunk = itemIdsArray.slice(i, i + 200);
        // Try to fetch items, ignore if invalid (some IDs might be internal/amulets)
        const itemsData = await fetchJson(`https://api.guildwars2.com/v2/items?lang=fr&ids=${chunk.join(',')}`, true);
        if (itemsData) {
            itemsData.forEach(it => itemsMap[it.id] = it);
        }
    }
  }

  // 3. Second pass: Enrichment
  for (const profKey of Object.keys(data)) {
    if (profKey === 'sources') continue;
    const profApi = professionDataByRawKey[profKey];
    if (!profApi) continue;
    const paletteMap = profApi.paletteMap;

    for (const build of data[profKey]) {
      const decoded = build._decoded;
      if (!decoded) continue;

      const enriched = {
        name: build.name,
        profession: profKey,
        professionIcon: profApi.icon,
        specs: [],
        traits: [],
        skills: [],
        weaponSkills: [],
        pets: [],
        weapons: [],
        sigils: [],
        rune: null,
        relic: null
      };

      const apiProfName = profNameMap[profKey.toLowerCase()];

      // Specs & Traits
      [
        { id: decoded.specialization1, choices: decoded.traitChoices1 },
        { id: decoded.specialization2, choices: decoded.traitChoices2 },
        { id: decoded.specialization3, choices: decoded.traitChoices3 }
      ].forEach((sEntry) => {
        const s = specsMap[sEntry.id];
        if (s) {
          // Relaxed profession check: only log a warning but still include if it's a valid spec
          if (s.profession !== apiProfName) {
            issues.push(`[Spec Profession Mismatch] Build "${build.name}" (${profKey}): Specialization ${s.name} (${s.id}) belongs to ${s.profession}, not ${apiProfName}`);
          }
          enriched.specs.push({ id: s.id, name: s.name, icon: s.icon });
          
          if (sEntry.choices) {
            sEntry.choices.forEach((choice, tier) => {
              const tId = choice > 0 ? s.major_traits[tier * 3 + (choice - 1)] : null;
              const t = traitsMap[tId];
              if (t) enriched.traits.push({ id: t.id, name: t.name, icon: t.icon, description: t.description });
            });
          }
        } else if (sEntry.id > 0) {
          issues.push(`[Spec Missing] Build "${build.name}" (${profKey}): Specialization ID ${sEntry.id} not found in API`);
        }
      });

      // Utility Skills (Heal, Util1-3, Elite)
      const uPalettes = [
        decoded.terrestrialHealSkill,
        decoded.terrestrialUtilitySkill1,
        decoded.terrestrialUtilitySkill2,
        decoded.terrestrialUtilitySkill3,
        decoded.terrestrialEliteSkill
      ];

      if (profIdToKey[decoded.profession] !== profKey) {
        issues.push(`[Skill Profession Mismatch] Build "${build.name}" (${profKey}): Chat code profession is ${profIdToKey[decoded.profession] || 'unknown'}, attempting to use ${profKey} palette anyway.`);
      }

      uPalettes.forEach(pId => {
        const sId = paletteMap[pId];
        const s = skillsMap[sId];
        if (s) enriched.skills.push({ id: s.id, name: s.name, icon: s.icon, description: s.description });
      });

      // Pets
      [decoded.terrestrialPet1, decoded.terrestrialPet2].forEach(pId => {
        const p = petsMap[pId];
        if (p) enriched.pets.push({ id: p.id, name: p.name, icon: p.icon });
      });

      // V2 Equipment (Weapons, Sigils, Runes, Relics)
      if (build._decodedV2) {
        const v2 = build._decodedV2;
        
        // Weapons from Selection IDs
        const wNames = [];
        v2.weaponPaletteIds.forEach((pId, idx) => {
          const wType = weaponPaletteMap[pId];
          if (wType) {
            const label = idx < 2 ? 'M1' : 'M2';
            const hand = (idx % 2 === 0) ? 'Principal' : 'Main gauche';
            wNames.push(`${wType} (${label} ${hand})`);
          }
        });
        if (wNames.length > 0) {
          enriched.weapons = wNames;
        } else if (build.details && build.details.weapons) {
          // Fallback weapons from details string
          enriched.weapons = build.details.weapons.split('+').map(s => s.trim());
        }

        // Sigils
        v2.sigilIds.forEach(id => {
          const it = itemsMap[id];
          if (it) enriched.sigils.push({ id: it.id, name: it.name, icon: it.icon });
        });

        // Rune
        if (v2.runeId) {
          const it = itemsMap[v2.runeId];
          if (it) enriched.rune = { id: it.id, name: it.name, icon: it.icon };
        }

        // Relic
        if (v2.relicId) {
          const it = itemsMap[v2.relicId];
          if (it) enriched.relic = { id: it.id, name: it.name, icon: it.icon };
        }
      }

      // Weapon Skills (Fallback to old weapons string if needed, or additive)
      if (build.details && build.details.weapons) {
        const weapons = build.details.weapons.split('+');
        const seenIds = new Set();
        const wSkills = [];
        
        weapons.forEach(set => {
          const parts = set.split('/').map(s => s.trim());
          parts.forEach(p => {
            const engName = weaponNameMap[p.replace(/ /g, '_')];
            const weaponInfo = profApi.weapons[engName];
            if (weaponInfo) {
              weaponInfo.skills.forEach(ws => {
                if (!seenIds.has(ws.id)) {
                  const s = skillsMap[ws.id];
                  if (s) {
                    wSkills.push({ id: s.id, name: s.name, icon: s.icon, description: s.description, slot: ws.slot });
                    seenIds.add(ws.id);
                  }
                }
              });
            }
          });
        });
        enriched.weaponSkills = wSkills.sort((a, b) => a.slot.localeCompare(b.slot));
      }

      delete build._decoded;
      delete build._decodedV2;
      build.enriched = enriched;
    }
  }

  console.log(`Writing to ${OUTPUT_FILE}...`);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf8');
  console.log('Enrichment complete!');

  if (issues.length > 0) {
    console.log('\n--- ISSUES DETECTED ---');
    issues.forEach(i => console.warn(i));
    console.log('-----------------------\n');
  }
}

enrich().catch(console.error);
