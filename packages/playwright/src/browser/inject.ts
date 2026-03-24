/**
 * Self-contained browser script injected into the page via addScriptTag.
 * All helper functions are inlined so nothing depends on module scope.
 */

export const BROWSER_SCRIPT = `
(function() {
  // ── Gradient contrast filter ──

  function hasCssGradientBackground(s) {
    var bg = s.backgroundImage;
    return !!bg && bg !== 'none' && /\\b(?:linear|radial|conic)-gradient\\s*\\(/i.test(bg);
  }

  function isFullyTransparentColor(value) {
    var v = value.trim().toLowerCase();
    if (v === 'transparent') return true;
    if (/\\brgba?\\([^)]*\\/\\s*0\\s*\\)/.test(v)) return true;
    if (/\\brgba?\\([^)]+,\\s*0\\s*\\)\\s*$/.test(v)) return true;
    return false;
  }

  function isContrastUnreliable(element) {
    var s = getComputedStyle(element);
    if (!hasCssGradientBackground(s)) return false;
    var clip = s.backgroundClip;
    var webkitClip = s.webkitBackgroundClip;
    if (clip === 'text' || webkitClip === 'text') return true;
    var webkitFill = s.webkitTextFillColor;
    if (webkitFill && isFullyTransparentColor(webkitFill)) return true;
    if (isFullyTransparentColor(s.color)) return true;
    return false;
  }

  // ── React source mapping ──

  function getReactSource(element) {
    var keys = Object.keys(element);
    var fiberKey = null;
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].indexOf('__reactFiber$') === 0 || keys[i].indexOf('__reactInternalInstance$') === 0) {
        fiberKey = keys[i];
        break;
      }
    }
    if (!fiberKey) return null;
    var fiber = element[fiberKey];
    for (var j = 0; j < 20 && fiber; j++) {
      if (fiber._debugSource) {
        return {
          fileName: fiber._debugSource.fileName,
          lineNumber: fiber._debugSource.lineNumber,
          columnNumber: fiber._debugSource.columnNumber
        };
      }
      fiber = fiber.return;
    }
    return null;
  }

  // ── Pattern helpers ──

  function isPlaceholderHref(href) {
    if (!href) return true;
    var h = href.trim().toLowerCase();
    return h === '#' || h === '#!' || h.indexOf('javascript:') === 0 || h === '';
  }

  function hasAccessibleName(el) {
    var ariaLabel = el.getAttribute('aria-label');
    if (ariaLabel && ariaLabel.trim()) return true;
    var ariaLabelledby = el.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
      var ids = ariaLabelledby.split(/\\s+/);
      for (var i = 0; i < ids.length; i++) {
        var ref = document.getElementById(ids[i]);
        if (ref && ref.textContent && ref.textContent.trim()) return true;
      }
    }
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      if (el.id && document.querySelector('label[for="' + el.id + '"]')) return true;
    }
    if (el.textContent && el.textContent.trim()) return true;
    if (el.querySelector('img[alt]')) return true;
    if (el.querySelector('[aria-label]')) return true;
    return false;
  }

  function escapeCSS(str) {
    return str.replace(/([.:#\\[\\]()>+~=|^$*!])/g, '\\\\$1');
  }

  function getSelector(el) {
    if (el.id) return '#' + escapeCSS(el.id);
    var tag = el.tagName.toLowerCase();
    var cls = Array.from(el.classList).slice(0, 2);
    var role = el.getAttribute('role');
    var s = tag;
    for (var i = 0; i < cls.length; i++) {
      s += '.' + escapeCSS(cls[i]);
    }
    if (role) s += '[role="' + role + '"]';
    return s;
  }

  function getSnippet(el) {
    var html = el.outerHTML;
    if (html.length <= 200) return html;
    var open = html.indexOf('>');
    if (open === -1) return html.slice(0, 200) + '…';
    return html.slice(0, open + 1) + '…</' + el.tagName.toLowerCase() + '>';
  }

  var FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

  // ── Pattern definitions ──

  var patterns = [
    {
      id: 'link-as-trigger',
      matches: function(el) {
        if (el.tagName !== 'A') return false;
        if (el.hasAttribute('aria-expanded')) return true;
        if (el.hasAttribute('aria-haspopup')) return true;
        if (isPlaceholderHref(el.getAttribute('href'))) return true;
        return false;
      },
      checks: [{
        id: 'prefer-button',
        check: function(el) {
          if (el.tagName !== 'A') return true;
          return !(el.hasAttribute('aria-expanded') || el.hasAttribute('aria-haspopup') || isPlaceholderHref(el.getAttribute('href')));
        },
        message: 'Anchor looks like a trigger (not navigation)',
        suggestion: 'Use <button type="button"> with aria-expanded / aria-haspopup. Reserve <a href="..."> for real navigations.',
        severity: 'serious',
        learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/'
      }]
    },
    {
      id: 'disclosure-trigger',
      matches: function(el) {
        var role = el.getAttribute('role');
        if (role === 'combobox' || role === 'searchbox' || role === 'textbox') return false;
        var tag = el.tagName;
        if (tag === 'BUTTON' || tag === 'A' || role === 'button' || role === 'link') {
          return el.hasAttribute('aria-expanded') || el.hasAttribute('aria-controls');
        }
        return false;
      },
      checks: [
        {
          id: 'role-button',
          check: function(el) { return el.tagName === 'BUTTON' || el.getAttribute('role') === 'button'; },
          message: 'Expandable control should be a button (or role="button")',
          suggestion: 'Prefer <button> for controls that show/hide content.',
          severity: 'moderate',
          learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/'
        },
        {
          id: 'has-controls',
          check: function(el) { return !el.hasAttribute('aria-expanded') || el.hasAttribute('aria-controls'); },
          message: 'aria-expanded present but aria-controls is missing',
          suggestion: 'Add aria-controls pointing to the id of the panel you expand/collapse.',
          severity: 'moderate',
          learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/'
        }
      ]
    },
    {
      id: 'fake-button',
      matches: function(el) {
        var tag = el.tagName;
        if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT') return false;
        if (el.getAttribute('role') === 'button') return true;
        if (el.hasAttribute('onclick')) return true;
        return false;
      },
      checks: [
        {
          id: 'tabindex',
          check: function(el) {
            if (el.tagName === 'BUTTON' || el.tagName === 'A') return true;
            var tab = el.getAttribute('tabindex');
            return tab !== null && tab !== '-1';
          },
          message: 'Custom control may not be keyboard-focusable',
          suggestion: 'Add tabindex="0" and role="button", and handle Enter/Space. Better: use a real <button>.',
          severity: 'serious',
          learnMore: 'https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/'
        },
        {
          id: 'name',
          check: function(el) { return hasAccessibleName(el); },
          message: 'Custom control needs an accessible name',
          suggestion: 'Add visible text, aria-label, or aria-labelledby.',
          severity: 'critical',
          learnMore: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html'
        }
      ]
    },
    {
      id: 'missing-label',
      matches: function(el) {
        if (!(el instanceof HTMLInputElement)) return false;
        var t = el.type;
        return ['hidden','button','submit','reset','image'].indexOf(t) === -1;
      },
      checks: [{
        id: 'labeled',
        check: function(el) {
          if (!(el instanceof HTMLInputElement)) return true;
          if (el.getAttribute('aria-label') && el.getAttribute('aria-label').trim()) return true;
          if (el.getAttribute('aria-labelledby')) return true;
          if (el.id && document.querySelector('label[for="' + el.id + '"]')) return true;
          return false;
        },
        message: 'Form control has no associated label',
        suggestion: 'Use <label for="id">, or aria-label / aria-labelledby.',
        severity: 'serious',
        learnMore: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html'
      }]
    },
    {
      id: 'dialog-focus',
      matches: function(el) {
        var role = el.getAttribute('role');
        return role === 'dialog' || role === 'alertdialog' || el.getAttribute('aria-modal') === 'true';
      },
      checks: [{
        id: 'focusable-descendant',
        check: function(el) { return !!el.querySelector(FOCUSABLE_SELECTOR); },
        message: 'Dialog has no focusable content',
        suggestion: 'Ensure at least one focusable element exists inside the dialog and move focus to it on open.',
        severity: 'serious',
        learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/'
      }]
    },
    {
      id: 'tab-interface',
      matches: function(el) { return el.getAttribute('role') === 'tablist'; },
      checks: [
        {
          id: 'has-tabs',
          check: function(el) { return el.querySelectorAll('[role="tab"]').length > 0; },
          message: 'tablist has no tab children',
          suggestion: 'Add elements with role="tab" inside the tablist.',
          severity: 'critical',
          learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/'
        },
        {
          id: 'tabs-selected',
          check: function(el) {
            var tabs = el.querySelectorAll('[role="tab"]');
            if (tabs.length === 0) return true;
            return Array.from(tabs).some(function(t) { return t.getAttribute('aria-selected') === 'true'; });
          },
          message: 'No tab is marked selected',
          suggestion: 'Set aria-selected="true" on the active tab and "false" on others.',
          severity: 'serious',
          learnMore: 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/'
        }
      ]
    }
  ];

  // ── Scanner API exposed on window ──

  window.__aclint = {
    isContrastUnreliable: isContrastUnreliable,
    getReactSource: getReactSource,

    runPatterns: function(scopeSelector) {
      var scope = document.querySelector(scopeSelector) || document.body;
      var allElements = Array.from(scope.querySelectorAll('*'));
      var violations = [];

      for (var e = 0; e < allElements.length; e++) {
        var el = allElements[e];
        for (var p = 0; p < patterns.length; p++) {
          var pattern = patterns[p];
          if (!pattern.matches(el)) continue;
          for (var c = 0; c < pattern.checks.length; c++) {
            var check = pattern.checks[c];
            if (check.check(el)) continue;
            violations.push({
              patternId: pattern.id + ':' + check.id,
              message: check.message,
              severity: check.severity,
              suggestion: check.suggestion,
              learnMoreUrl: check.learnMore,
              selector: getSelector(el),
              snippet: getSnippet(el)
            });
          }
        }
      }
      return violations;
    }
  };
})();
`;
