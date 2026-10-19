const scout = (text) => ({ text, tone: 'scout' });
const priority = (text) => ({ text, tone: 'priority' });
const supply = (text, value) => ({ text, value, tone: 'supply' });
const timing = (text, value) => ({ text, value, tone: 'timing' });

const cards = [
  { id: 'opening', title: 'Opening', x: 670, y: 24, width: 340, height: 294, steps: [
    supply('Pylon', '14'), supply('Chrono probes + Gate', '16'), supply('Gas w/ 17th probe', '17'),
    supply('Probe rallied down', '18'), 'Send extra probe to gas', supply('Nexus', '20'), scout('Scout for proxy'),
    supply('core', '20'), supply('Gas', '21'), supply('Lowground Pylon (same worker as gas)', '22'),
    'Chrono stalker + WG', 'Lowground Battery', 'Chrono main Nexus',
  ] },
  { id: 'proxy', title: 'Getting proxied', x: 564, y: 438, width: 244, height: 64, steps: [
    priority('Subscribe to Patreon Tier 5'),
  ] },
  { id: 'twilight', label: 'Sentry + Twilight Council', x: 832, y: 354, width: 358, height: 235, steps: [
    'Sentry', 'Twilight Council', scout('Pull 2 probes off gas'), scout('Energy recharge sentry + Scout'),
    scout('Scout ennemy nat then main'), 'Stalker', "Two Gateways (don't cut probes)", 'Charge',
    'Third Pylon in base (trust)', 'Re-saturate main gas when nat saturated', 'Third Nexus (3:40-3:55)',
  ] },
  { id: 'first-scout', title: 'First hallucination scout', tone: 'scout', x: 841, y: 619, width: 340, height: 50 },
  { id: 'mine', title: 'Mine Drop', x: 20, y: 760, width: 511, height: 138, steps: [
    'Video Timestamp: 17:58 and 25:42', scout('Second hallucination as soon as you see the Starport produce'),
    'Go to 5-7 stalkers + 1 sentry', priority('Split army in main and natural'),
    scout('Recharge + Third hallucination to track medivac'),
  ] },
  { id: 'cyclone', title: 'Cyclone Drop', x: 550, y: 772, width: 289, height: 118, steps: [
    'Video Timestamp: 14:32', 'Battery in main mineral line', 'Five stalkers then warp zealots',
    scout('Track medivac with hallucination'),
  ] },
  { id: 'reapers', title: '3 Reapers 2 Hellions', x: 858, y: 760, width: 304, height: 138, steps: [
    'Video Timestamp: 10:57', 'Full wall With Gateway', 'Delay nexus a bit',
    'Keep 2 stalkers in main', 'Keep the sentry in nat for forcefields',
  ] },
  { id: 'hellion', title: 'Hellion Drop', x: 1181, y: 704, width: 369, height: 250, steps: [
    'Video Timestamp: 21:00', 'Battery in main mineral line', 'Fourth stalker before pylon + charge',
    scout('Early second hallucination'), scout('Track the hellions'), 'Full wall with gateway',
    priority('Hold with 4 stalkers + sentry'), priority('Focus medivac first'), priority('Try to forcefield hellions'),
    'Warp more stalkers and move out once held', priority('Chase the starport'),
  ] },
  { id: 'push', title: '3-1-0 push', x: 1268, y: 995, width: 468, height: 284, steps: [
    'Video Timestamp: XX:XX', 'Regular expand timing', priority('Stay on 2 stalkers'), 'Constant zealot warpins',
    timing('Templar Archives ASAP', '4:05'), 'Gradually go to 5 gates when you have the money',
    scout('Scout for moveout with probe and hallucination'), priority('Prioritise warp-ins'),
    timing('Chrono storm', '4:45'), 'Warp 3 templars - energy recharge', 'Forge with excess money - +1 defense',
    priority('Send 4-5 zealots around the map to counterattack'), priority('Go out on the map and fish for big storms'),
  ] },
  { id: 'robo', label: 'Robo + Third Gas', x: 850, y: 1085, width: 335, height: 122, steps: [
    'Robo', 'Third Gas', scout('Halluc scout to check Terran followup'),
    priority('Continuous Zealot warp-ins until then'), 'Templar Archives',
  ] },
  { id: 'followup', title: 'Followup scout', tone: 'scout', x: 981, y: 1327, width: 220, height: 50 },
  { id: 'aggression', title: 'Signs of aggression', x: 880, y: 1417, width: 420, height: 157, steps: [
    'Video Timestamp: 28:46', 'Battery in main if you expect banshees or drops', 'Keep making zealots',
    'Make immortals', 'Chrono your gates if needed', scout('Keep scouting until you see more rax'),
  ] },
  { id: 'setup', title: 'Midgame setup', x: 1226, y: 1620, width: 228, height: 195, steps: [
    'Storm', 'Go to 8 Gateways', 'Warp prism', 'Forge', 'Warp 3-4 templars',
    'Keep making zealots', 'Fourth base', scout('Get vision on the map'),
  ] },
  { id: 'midgame', title: 'Go into midgame', tone: 'finish', x: 1243, y: 1856, width: 195, height: 50 },
];

const edges = [
  ['opening', 'proxy', 'M 770 318 L 700 434'],
  ['opening', 'twilight', 'M 942 318 L 964 350'],
  ['twilight', 'first-scout', 'M 1011 589 V 615'],
  ['first-scout', 'mine', 'M 841 649 C 655 655 480 696 390 756'],
  ['first-scout', 'cyclone', 'M 945 669 C 858 696 800 733 754 768'],
  ['first-scout', 'reapers', 'M 1011 669 V 756'],
  ['first-scout', 'hellion', 'M 1081 669 C 1131 682 1162 694 1177 714'],
  ['first-scout', 'push', 'M 1181 646 C 1450 655 1573 673 1608 708 C 1678 788 1640 925 1605 991'],
  ['mine', 'robo', 'M 401 898 Q 602 990 871 1081'],
  ['cyclone', 'robo', 'M 755 890 L 952 1081'],
  ['reapers', 'robo', 'M 1011 898 V 1081'],
  ['hellion', 'robo', 'M 1220 954 L 1078 1081'],
  ['robo', 'followup', 'M 1034 1207 L 1084 1323'],
  ['followup', 'aggression', 'M 1091 1377 V 1413'],
  ['followup', 'setup', 'M 1201 1362 C 1312 1380 1380 1420 1355 1616'],
  ['aggression', 'setup', 'M 1176 1574 L 1222 1626'],
  ['push', 'setup', 'M 1480 1279 L 1373 1616'],
  ['setup', 'midgame', 'M 1340 1815 V 1852'],
].map(([from, to, path]) => ({ from, to, path }));

export default {
  slug: 'pvt', code: 'PvT', title: 'Protoss vs. Terran', number: '01',
  description: 'A Protoss opening with scouting checkpoints, Terran responses, and a route into the midgame.',
  width: 1756, height: 1930, entry: 'opening', cards, edges,
};
