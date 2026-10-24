const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const audioDir = path.join(__dirname, '../../audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// 5 Beats from Storyboard
const beats = [
  {
    id: 'beat1',
    text: "First impressions happen in seconds. With Really Simple, you can replace outdated paper cards with an interactive digital business card in under a minute—completely free."
  },
  {
    id: 'beat2',
    text: "Just enter your name, role, and bio. Every keystroke updates your live mobile card preview instantly."
  },
  {
    id: 'beat3',
    text: "Add your direct phone, email, and social profiles. Prospects can save your contact details directly to their phone with a single tap."
  },
  {
    id: 'beat4',
    text: "Choose from curated designer themes and modern typography to match your personal brand or corporate identity seamlessly."
  },
  {
    id: 'beat5',
    text: "Ready to upgrade how you connect? Start for free today at reallysimpleapps.com."
  }
];

console.log('Generating voiceover clips for 5 storyboard beats...');

beats.forEach((beat) => {
  const aiffPath = path.join(audioDir, `${beat.id}.aiff`);
  const wavPath = path.join(audioDir, `${beat.id}.wav`);
  console.log(`Generating ${beat.id}...`);
  // Samantha is standard natural en_US voice
  execSync(`say -v Samantha -r 175 -o "${aiffPath}" "${beat.text}"`);
  execSync(`ffmpeg -y -i "${aiffPath}" -ar 48000 -ac 2 "${wavPath}"`);
  fs.unlinkSync(aiffPath);
});

console.log('Voiceover generation completed successfully.');
