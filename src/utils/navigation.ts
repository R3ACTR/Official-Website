// An array of links for navigation bar
const navBarLinks = [
  { name: 'Home', url: '/' },
  { name: 'Products', url: '/products' },
  { name: 'Services', url: '/services' },
  { name: 'Blog', url: '/blog' },
  { name: 'Contact', url: '/contact' },
];
// An array of links for footer
const footerLinks = [
  {
    section: 'Ecosystem',
    links: [
      { name: 'Products', url: '/products' },
      { name: 'Services', url: '/services' },
      { name: 'Open Source', url: 'https://github.com/R3ACTR-DEV' },
    ],
  },
  {
    section: 'Company',
    links: [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: 'Contact', url: '/contact' },
    ],
  },
];
// An object of links for social icons
const socialLinks = {
  github: 'https://github.com/R3ACTR-DEV',
  instagram: 'https://www.instagram.com/r3actr/',
  linkedin: 'https://www.linkedin.com/company/r3actr-innovations/',
};

export default {
  navBarLinks,
  footerLinks,
  socialLinks,
};
