# vip-models/

Each subfolder holds one VIP model's photos, named to match the numbered
`.webp` convention `assets/profile.js`'s gallery prober and the card/og:image
code expect: `1.webp` is the cover (used as `og:image` and the card
thumbnail), `2.webp`, `3.webp`, … are the rest of the gallery.

## teaser-blur.webp

Every VIP model needs this file — the real photo is never sent to a
signed-out/unpaid visitor, in two places that show a locked preview card:

1. The fixed 5-card locked grid on `/vip-models/` (see `vipTeaserPool()` in
   `assets/vip.js`), driven by the hardcoded `VIP_TEASER_MODELS` in
   `data/models.js`.
2. The homepage's per-city rows (see `VIP_CITY_TEASERS` in `_build/build.js`
   and `vipCityTeaserCardHTML()` in `assets/main.js`), which tops up a city
   whose public roster is thin with a locked card for any real VIP model
   based there — computed automatically from every `vip:true, real:true`
   entry, no per-model registration needed beyond this file existing.

`teaser-blur.webp` is a derivative of `1.webp`, heavily downsampled and
Gaussian-blurred *before* being scaled back up — the actual pixel detail is
destroyed at generation time, so there's nothing to recover even if a
visitor strips every CSS filter on the page (unlike a plain CSS `blur()` on
the real photo, which is just hidden, not destroyed).

Generate it for every new VIP model (the build doesn't do this for you):

```python
from PIL import Image, ImageFilter

name = 'ModelName'
im = Image.open(f'vip-models/{name}/1.webp').convert('RGB')
w, h = im.size
small = im.resize((max(1, w // 80), max(1, h // 80)), Image.BILINEAR)
big = small.resize((w, h), Image.BILINEAR)
big = big.filter(ImageFilter.GaussianBlur(24))
big.save(f'vip-models/{name}/teaser-blur.webp', 'WEBP', quality=75)
```

That alone is enough for the homepage city teaser (#2 above) to pick her up
automatically. Only add a matching entry to `VIP_TEASER_MODELS` in
`data/models.js` (name/age/nationality/etc. mirroring her real profile,
plus `teaserImg: '/vip-models/ModelName/teaser-blur.webp'`) if she should
also appear in the fixed 5-card locked grid (#1 above).
