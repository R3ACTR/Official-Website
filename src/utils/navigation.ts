// An array of links for navigation bar
const navBarLinks = [
  { name: 'Home', url: '/' },
  { name: 'Services', url: '/services' },
  { name: 'Blog', url: '/blog' },
  { name: 'Contact', url: '/contact' },
];
// An array of links for footer
const footerLinks = [
  {
    section: 'Ecosystem',
    links: [
      { name: 'Services', url: '/services' },
      { name: 'Open Source', url: 'https://github.com/R3ACTR' },
    ],
  },
  {
    section: 'Company',
    links: [
      { name: 'Home', url: '/' },
      { name: 'FAQ', url: '/faq' },
      { name: 'Blog', url: '/blog' },
      { name: 'Contact', url: '/contact' },
    ],
  },
  {
    section: 'Legal',
    links: [
      { name: 'Privacy Policy', url: '/privacy' },
      { name: 'Terms & Conditions', url: '/terms' },
    ],
  },
];
// An object of links for social icons
const socialLinks = {
  github: 'https://github.com/R3ACTR',
  instagram: 'https://www.instagram.com/r3actr/',
  linkedin: 'https://www.linkedin.com/company/r3actr-innovations/',
};

export default {
  navBarLinks,
  footerLinks,
  socialLinks,
};
