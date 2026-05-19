#!/usr/bin/env node
// Image generation script for SOS Jukebox bar progression system
// Uses FAL AI (FLUX) to generate bar backgrounds, superfan portraits, and character milestones

const FAL_KEY = process.env.FAL_API_KEY;
if (!FAL_KEY) { console.error('FAL_API_KEY not set'); process.exit(1); }

import { writeFile } from 'fs/promises';
import { existsSync } from 'fs';

async function generate(prompt, outPath, opts = {}) {
  if (existsSync(outPath)) {
    console.log(`  ✓ exists: ${outPath}`);
    return;
  }
  const body = {
    prompt,
    image_size: opts.size || 'portrait_4_3',
    num_images: 1,
    num_inference_steps: opts.steps || 28,
    guidance_scale: opts.guidance || 3.5,
    seed: opts.seed,
  };
  if (opts.seed === undefined) delete body.seed;

  const res = await fetch('https://fal.run/fal-ai/flux/dev', {
    method: 'POST',
    headers: { 'Authorization': `Key ${FAL_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`FAL error ${res.status}: ${txt}`);
  }
  const data = await res.json();
  const imgUrl = data.images[0].url;

  const imgRes = await fetch(imgUrl);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  await writeFile(outPath, buf);
  console.log(`  ✓ saved: ${outPath} (${buf.length} bytes)`);
}

// ── Shared style tokens ──
const STYLE = 'digital illustration, warm moody bar interior, dark amber lighting, wooden floor and walls, game background art, no people, no text, no watermark, highly detailed';
const CAMERA = 'interior wide angle view facing the back wall, bar counter on left side, stage area on right side';

// ── Bar Backgrounds (10 levels) ──
const BAR_PROMPTS = [
  // Level 1 — absolute dive
  `Rundown dive bar interior, cracked dirty walls, single dim bare lightbulb hanging from ceiling, tiny wooden bar counter on left with 3 dusty bottles on a small crooked shelf, two wobbly wooden bar stools, right side has a lone cheap microphone stand on bare floor, old broken jukebox in corner barely glowing, trash and papers on the floor, cobwebs, very dark and neglected, ${CAMERA}, ${STYLE}`,

  // Level 2 — first cleanup
  `Slightly cleaner dive bar interior, walls still worn but patched in spots, one warm pendant lamp over the bar, bar counter on left with a small shelf holding 5-6 bottles, two bar stools, right side has a microphone stand with a single small spotlight shining on it from above, old jukebox in corner with a faint glow, floor swept but scratched, ${CAMERA}, ${STYLE}`,

  // Level 3 — small stage appears
  `Dive bar interior getting better, walls repainted dark wood paneling, two pendant lamps, bar counter on left with expanding bottle shelf, three bar stools, right side has a small raised wooden platform stage with a microphone stand and a single stage light, jukebox refurbished with warm glow, cleaner wooden floor, ${CAMERA}, ${STYLE}`,

  // Level 4 — curtains and warmth
  `Cozy bar interior improving, dark wood paneled walls in good condition, three warm pendant lamps, bar counter on left polished wood with well-stocked bottle shelf, three padded bar stools, right side has a raised stage platform with simple red curtains backdrop and two stage lights, microphone on stand, working jukebox glowing warmly, polished wooden floor, ${CAMERA}, ${STYLE}`,

  // Level 5 — proper venue
  `Nice bar interior, clean dark wood walls with decorative elements, four pendant lamps casting warm pools, bar counter on left well-polished with two rows of bottles on lit shelf, four padded bar stools, right side has a proper stage with red velvet curtains and three colored stage lights, microphone stand center stage, neon sign on back wall, polished hardwood floor, ${CAMERA}, ${STYLE}`,

  // Level 6 — upscale karaoke bar
  `Upscale karaoke bar interior, rich dark wood walls, pendant lamps and wall sconces, bar counter on left with premium bottle display backlit shelf, four leather bar stools, right side has an elevated stage with full red velvet curtains and four stage spotlights in different colors, monitor speakers on stage, professional microphone on chrome stand, vintage jukebox fully restored and glowing, polished dark hardwood floor, ${CAMERA}, ${STYLE}`,

  // Level 7 — premium venue
  `Premium karaoke bar interior, elegant dark wood and exposed brick walls, chandelier-style pendant lamps, long polished bar counter on left with impressive backlit multi-tier bottle display, leather bar stools with brass footrests, right side has a large stage with professional curtains and lighting rig with six colored spotlights, stage monitors, professional mic stand, LED strip accents around stage edge, restored premium jukebox, gleaming dark wood floor, ${CAMERA}, ${STYLE}`,

  // Level 8 — high-end lounge
  `High-end karaoke lounge interior, luxurious dark wood and brick walls with gold trim accents, ornate pendant lamps, premium long bar counter on left with spectacular three-tier backlit bottle display, plush leather bar stools, right side has a large professional stage with velvet curtains, professional lighting rig with eight spotlights, subtle fog effect, stage monitors and speakers, chrome microphone stand, neon signs, LED accent lighting throughout, premium restored jukebox, dark polished wood floor with carpet accents, ${CAMERA}, ${STYLE}`,

  // Level 9 — near concert venue
  `Spectacular karaoke venue interior, luxurious dark wood brick and velvet walls with gold accents, crystal pendant lamps, grand polished bar counter on left with impressive four-tier backlit premium bottle display, plush leather stools, right side has a concert-grade stage with motorized velvet curtains and full professional lighting rig with many colored spotlights and moving heads, fog machine effect, professional monitor speakers, chrome microphone stand with pop filter, multiple neon signs, LED strips everywhere, spectacular jukebox centerpiece, dark polished floor with star pattern, ${CAMERA}, ${STYLE}`,

  // Level 10 — legendary venue
  `Legendary world-class karaoke bar interior, opulent dark wood and velvet walls with gold leaf accents and VIP curtain areas, crystal chandeliers mixed with modern lighting, magnificent curved bar counter on left with spectacular five-tier backlit premium bottle display and cocktail station, plush leather stools with gold trim, right side has a spectacular concert stage with automated velvet curtains, full professional concert lighting rig with moving heads and laser effects, fog and haze, professional stage monitors and PA speakers, gold chrome microphone stand, massive restored golden jukebox as centerpiece glowing magnificently, multiple neon signs, LED strip lighting everywhere, dark polished parquet floor with gold inlay pattern, ${CAMERA}, ${STYLE}`,
];

// ── Superfan Portraits (20 characters) ──
const PORTRAIT_STYLE = 'cartoon illustrated anthropomorphic animal character portrait, circular frame, colorful, expressive face, wearing human clothes, game character art style, clean lines, solid colored background, no text';

const SUPERFANS = [
  { id: 'first_believer', prompt: `friendly brown bear wearing a band t-shirt, warm smile, simple and earnest, green background, ${PORTRAIT_STYLE}` },
  { id: 'melody_mel', prompt: `stylish pink flamingo wearing headphones around neck, musical and cool, orange background, ${PORTRAIT_STYLE}` },
  { id: 'pitch_pete', prompt: `colorful parrot wearing a denim jacket with pins, confident look, blue background, ${PORTRAIT_STYLE}` },
  { id: 'encore_enid', prompt: `elegant red fox wearing a sparkly dress top, excited expression, red background, ${PORTRAIT_STYLE}` },
  { id: 'standing_o_sam', prompt: `enthusiastic gorilla wearing a varsity jacket, clapping and grinning, yellow background, ${PORTRAIT_STYLE}` },
  { id: 'vinyl_vicky', prompt: `hip raccoon wearing vintage record shop outfit with scarf, knowing smile, purple background, ${PORTRAIT_STYLE}` },
  { id: 'bass_drop_boris', prompt: `tough bulldog wearing a DJ hoodie and chain necklace, head bobbing, dark blue background, ${PORTRAIT_STYLE}` },
  { id: 'harmony_hank', prompt: `wise old owl wearing a bow tie and glasses, dignified expression, teal background, ${PORTRAIT_STYLE}` },
  { id: 'treble_tina', prompt: `sassy calico cat wearing a beret and striped top, playful wink, pink background, ${PORTRAIT_STYLE}` },
  { id: 'mic_check_mike', prompt: `proud rooster wearing a leather vest, crowing expression, orange-red background, ${PORTRAIT_STYLE}` },
  { id: 'crescendo_carl', prompt: `gentle elephant wearing a conductor's vest, eyes closed enjoying music, gray-blue background, ${PORTRAIT_STYLE}` },
  { id: 'rhythm_ruby', prompt: `energetic rabbit wearing dance outfit with leg warmers, bouncy pose, magenta background, ${PORTRAIT_STYLE}` },
  { id: 'falsetto_fred', prompt: `tall giraffe wearing a turtleneck sweater, surprised high-note expression, yellow-green background, ${PORTRAIT_STYLE}` },
  { id: 'alto_alice', prompt: `graceful deer wearing a folk music cardigan, serene singing expression, forest green background, ${PORTRAIT_STYLE}` },
  { id: 'beatbox_benny', prompt: `cool frog wearing a snapback cap and hoodie, making beat sounds, lime green background, ${PORTRAIT_STYLE}` },
  { id: 'serenade_sally', prompt: `elegant white swan wearing a pearl necklace, romantic expression, lavender background, ${PORTRAIT_STYLE}` },
  { id: 'karaoke_king', prompt: `majestic lion wearing a gold crown and cape collar, roaring with confidence, royal purple background, ${PORTRAIT_STYLE}` },
  { id: 'diva_diana', prompt: `fabulous peacock with spread feathers wearing glamorous outfit, dramatic pose, deep teal background, ${PORTRAIT_STYLE}` },
  { id: 'showstopper_steve', prompt: `cool wolf wearing a rock band jacket with studs, intense gaze, dark red background, ${PORTRAIT_STYLE}` },
  { id: 'legendary_luna', prompt: `mythical golden eagle wearing a star-studded cape, powerful and legendary, midnight blue background with stars, ${PORTRAIT_STYLE}` },
];

// ── Character Milestones (Zeke & Stu at levels 4, 7, 10) ──
const ZEKE_STYLE = 'full body cartoon illustrated anthropomorphic zebra character with orange mohawk, standing pose, transparent background, game character art, clean lines, no text';
const STU_STYLE = 'full body cartoon illustrated anthropomorphic badger character with eye patch, standing pose, transparent background, game character art, clean lines, no text';

const CHARACTERS = [
  { id: 'zeke-level4', prompt: `${ZEKE_STYLE}, wearing a nicer leather jacket with band patches, checkered pants, combat boots, slightly more confident pose, starting to look cooler` },
  { id: 'zeke-level7', prompt: `${ZEKE_STYLE}, wearing a sharp black leather jacket with silver studs, ripped jeans, buckled boots, sunglasses pushed up on head, rockstar confidence` },
  { id: 'zeke-level10', prompt: `${ZEKE_STYLE}, wearing a magnificent gold-trimmed leather jacket, designer pants, premium boots, gold chain, legendary rockstar aura, flames and electric energy` },
  { id: 'stu-level4', prompt: `${STU_STYLE}, wearing a cleaner white shirt with rolled sleeves, nicer dark apron, arms crossed, slightly less grumpy, small smile` },
  { id: 'stu-level7', prompt: `${STU_STYLE}, wearing a professional bartender vest over crisp shirt, premium apron, cocktail shaker in hand, confident professional look` },
  { id: 'stu-level10', prompt: `${STU_STYLE}, wearing a magnificent gold-trimmed vest, premium white shirt, master bartender apron with gold embroidery, gold wristwatch, legendary bartender aura` },
];

// ── Run generation ──
async function runBatch(label, items, concurrency = 3) {
  console.log(`\n🎨 ${label} (${items.length} images, ${concurrency} parallel)...`);
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    await Promise.all(batch.map(item =>
      generate(item.prompt, item.path, item.opts || {}).catch(e => {
        console.error(`  ✗ ${item.path}: ${e.message}`);
      })
    ));
  }
}

async function main() {
  const mode = process.argv[2] || 'all';

  if (mode === 'all' || mode === 'bars') {
    await runBatch('Bar Backgrounds', BAR_PROMPTS.map((prompt, i) => ({
      prompt,
      path: `assets/bars/bar-level-${i + 1}.jpg`,
      opts: { size: 'portrait_4_3', steps: 30, guidance: 3.5 },
    })), 3);
  }

  if (mode === 'all' || mode === 'superfans') {
    await runBatch('Superfan Portraits', SUPERFANS.map(sf => ({
      prompt: sf.prompt,
      path: `assets/superfans/${sf.id}.jpg`,
      opts: { size: 'square', steps: 28, guidance: 3.5 },
    })), 4);
  }

  if (mode === 'all' || mode === 'characters') {
    await runBatch('Character Milestones', CHARACTERS.map(ch => ({
      prompt: ch.prompt,
      path: `assets/characters/${ch.id}.png`,
      opts: { size: 'portrait_4_3', steps: 30, guidance: 3.5 },
    })), 2);
  }

  console.log('\n✅ Done!');
}

main().catch(e => { console.error(e); process.exit(1); });
