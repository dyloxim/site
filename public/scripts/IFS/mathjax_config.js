window.MathJax = {
  loader: {load: ['[tex]/color']},
  tex: {
    packages: {'[+]': ['color']},
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    autoload: {
      color: [],
      colorv2: ['color'],
    }
  },
  fontCache: 'global'
};
