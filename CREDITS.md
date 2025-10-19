# Credits

This project uses or is inspired by the following open-source work:

- decimal.js — Arbitrary-precision Decimal type for JavaScript by Michael Mclaughlin

  - Repo: <https://github.com/MikeMcl/decimal.js>

  - Used optionally. A minified copy can be placed at `js/decimal.min.js` and the app will automatically use it if present.

Design & Implementation:

- UI and core logic created as part of the LightningCalc project.

Notes:

- The repository can include `js/decimal.min.js` (a minified copy of decimal.js). `index.html` already attempts to load `js/decimal.min.js` before the app script.
