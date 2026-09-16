      (function() {
        try {
          var savedTheme = localStorage.getItem('atm_theme');
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } catch (e) {}
      })();
