# vip-models/

Each subfolder holds one VIP model's photos, named to match the numbered
`.webp` convention `assets/profile.js`'s gallery prober and the card/og:image
code expect: `1.webp` is the cover (used as `og:image` and the card
thumbnail), `2.webp`, `3.webp`, … are the rest of the gallery.

## teaser-blur.webp

The locked teaser grid on `/vip-models/` (see `vipTeaserPool()` in
`assets/vip.js`) shows one card per VIP model even though the real photo is
never sent to a signed-out/unpaid visitor. `teaser-blur.webp` is a
derivative of `1.webp`, heavily downsampled and Gaussian-blurred *before*
being scaled back up — the actual pixel detail is destroyed at generation
time, so there's nothing to recover even if a visitor strips every CSS
filter on the page (unlike a plain CSS `blur()` on the real photo, which is
just hidden, not destroyed).

Regenerate it for a new VIP model with:

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

Then add a matching entry to `VIP_TEASER_MODELS` in `data/models.js`
(name/age/nationality/etc. mirroring the model's real profile, plus
`teaserImg: '/vip-models/ModelName/teaser-blur.webp'`) so it shows up in
the locked grid.
