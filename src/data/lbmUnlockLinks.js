export const lbmUnlockLinks = {
  'tyria-masteries': 'https://www.lebusmagique.fr/pages/guides/maitrises/liste-des-points-de-maitrise/tyrie-centrale.html',

  'hot-glider': 'https://www.lebusmagique.fr/pages/extension/gw2-hot/maitrises-hot/',
  'hot-mushrooms': 'https://www.lebusmagique.fr/pages/extension/gw2-hot/maitrises-hot/',
  'hot-itzel': 'https://www.lebusmagique.fr/pages/extension/gw2-hot/maitrises-hot/ethnologie-des-itzels.html',
  'hot-nuhoch': 'https://www.lebusmagique.fr/pages/extension/gw2-hot/maitrises-hot/ethnologie-des-nuhochs.html',
  'hot-exalted': 'https://www.lebusmagique.fr/pages/extension/gw2-hot/maitrises-hot/ethnologie-des-exaltes.html',
  'hot-raids': 'https://www.lebusmagique.fr/pages/extension/gw2-hot/maitrises-hot/raids.html',

  'pof-raptor': 'https://www.lebusmagique.fr/pages/extension/gw2-pof/maitrises-pof/raptor.html',
  'pof-springer': 'https://www.lebusmagique.fr/pages/extension/gw2-pof/maitrises-pof/',
  'pof-skimmer': 'https://www.lebusmagique.fr/pages/extension/gw2-pof/maitrises-pof/',
  'pof-jackal': 'https://www.lebusmagique.fr/pages/extension/gw2-pof/maitrises-pof/',
  'pof-griffon': 'https://www.lebusmagique.fr/pages/extension/gw2-pof/maitrises-pof/griffon.html',
  'pof-beetle': 'https://www.lebusmagique.fr/pages/extension/gw2-pof/maitrises-pof/scaraboule.html',
  'pof-skyscale': 'https://www.lebusmagique.fr/pages/extension/gw2-pof/maitrises-pof/dracaille.html',

  'lw4-beetle': 'https://www.lebusmagique.fr/pages/extension/s4/acquisition-du-scaraboule/',
  'lw4-skyscale-prereq': 'https://www.lebusmagique.fr/pages/extension/s4/acquisition-du-dracaille/',

  'eod-jade-bot': 'https://www.lebusmagique.fr/blog/gw2/le-drone-de-jade-votre-assistant-personnel.html',
  'eod-jade-batteries': 'https://www.lebusmagique.fr/pages/extension/gw2-eod/maitrises-eod/',
  'eod-ziplines': 'https://www.lebusmagique.fr/pages/extension/gw2-eod/maitrises-eod/',
  'eod-fishing': 'https://www.lebusmagique.fr/pages/extension/gw2-eod/peche/',
  'eod-skiff': 'https://www.lebusmagique.fr/pages/extension/gw2-eod/maitrises-eod/maitrises-end-of-dragons-esquif.html',
  'eod-turtle': 'https://www.lebusmagique.fr/pages/extension/gw2-eod/cantha/tortue-de-siege.html',

  'soto-new-skyscale': 'https://www.lebusmagique.fr/pages/extension/gw2-soto/cieux-de-la-tyrie/acquisition-du-dracaille/',
  'soto-flight': 'https://www.lebusmagique.fr/pages/extension/gw2-soto/maitrises-soto/maitrises-soto-entrainement-au-vol.html',
  'soto-convergences': 'https://www.lebusmagique.fr/pages/extension/gw2-soto/convergences/',

  'janthir-homestead': 'https://www.lebusmagique.fr/pages/extension/gw2-jw/janthir/il-fait-bon-d-etre-chez-soi.html',
  'janthir-land-spear': 'https://www.lebusmagique.fr/blog/gw2/gw2-jw/preparez-vous-pour-la-beta-des-lances-terrestres.html',
  'janthir-regional-masteries': 'https://www.lebusmagique.fr/pages/extension/gw2-jw/maitrises-jw/',
  'janthir-exploration': 'https://www.lebusmagique.fr/pages/extension/gw2-jw/janthir/',
};

export const getLbmUnlockLink = (unlockKey) => lbmUnlockLinks[unlockKey] || null;
