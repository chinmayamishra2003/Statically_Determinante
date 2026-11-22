# Statically Determinate

IES Civil exam prep site. Static files only, no build step.

## Deploy on Cloudflare Pages (free)
1. Cloudflare dashboard > Workers & Pages > Create > Pages > Connect to Git, pick this repo.
2. Framework preset: None. Build command: leave empty. Build output directory: `/`.
3. Save and Deploy. Every `git push`, and every image or edit published from the site, redeploys automatically.

## Publish from the website (owner only)
Sync tab > card 3: paste a fine-grained GitHub token (this repo only, Contents: Read and write). Then you can add formula images (Formulas tab), edit topics, notes and formulas, and tap "Publish changes".

## Push from your PC
1. `git clone` the repo once, edit files locally.
2. Optional: drop scans into `uploads/formulas/<subject number>/` (0 = first subject) and run `node tools/scan-images.js`.
3. Run `push.bat` (Windows) or `./push.sh`. It pulls first, so website edits are never overwritten.
