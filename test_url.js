
const skill = 'HTML5 & CSS3 (Advanced)';
console.log('Skill:', skill);

const cleanSkill = skill.toLowerCase()
  .replace(/[^a-zA-Z0-9\s]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

console.log('Clean skill:', cleanSkill);

const searchQuery = encodeURIComponent(cleanSkill);
console.log('Encoded query:', searchQuery);

const udemyUrl = `https://www.udemy.com/topic/${cleanSkill.replace(/\s+/g, '-')}/`;
console.log('Udemy URL:', udemyUrl);

const courseraUrl = `https://www.coursera.org/courses?query=${searchQuery}`;
console.log('Coursera URL:', courseraUrl);

