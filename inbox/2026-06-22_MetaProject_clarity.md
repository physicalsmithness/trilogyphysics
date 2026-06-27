# From MetaProject, 2026-06-22 (advice): add Clarity to the served pages

GA4 is already on the served pages (the per-topic `index.html` files and `physics_skill_driller_units_v4_1.html`). Add **Microsoft Clarity** (heatmaps) to the `<head>` of those same served pages. Domain is `physicalsmithness.github.io`, so id `xdr2tsc688`:

```html
<script type="text/javascript">
(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","xdr2tsc688");
</script>
```

Apply to whichever files are actually deployed (mirror wherever the GA block already sits), then Smith pushes via GitHub Desktop. Awareness only.
