# RS Clicked It website

A static site in plain HTML, CSS and JavaScript, with no build step and nothing to install.

- `index.html`: the homepage, with the hero, selected work, featured film, services, about and contact sections
- `photography.html`, `design.html`, `film.html`: the full portfolio pages
- `assets/css/site.css`: all styles (colors and fonts are set at the top)
- `assets/js/site.js`: the menu, film player, photo viewer, filters and inquiry form
- `assets/img/` and `assets/video/`: web-sized copies of your media (the originals in `Media/` are untouched)

## See it

Double-click `index.html` to open it in your browser.

## Contact details

Email (ronald@rsclickedit.com), phone ((445) 202-9689) and Instagram (@rsclickedit) appear on all four pages. To change one later, use find-and-replace across the `website` folder.

## Inquiry form

The form in `index.html` sends to Formspree at `https://formspree.io/f/xnpdjgow`, which forwards each inquiry to the email on your Formspree account. Each email arrives with the subject "New inquiry from the RS Clicked It website". A hidden `_gotcha` field filters out most spam bots.

To use a different Formspree form later, replace that address in `index.html`.

## Words to review

These are drafts written from your portfolio. Edit them in `index.html`:

- **About section.** The two paragraphs under "Hi, I'm Ronald."
- **"Recent work for" client list.** Confirm each name is correct and that you're comfortable listing them publicly.
- **Services descriptions and "Typical projects" lists.**
- **Alt text and captions** on the portfolio pages. They were written from file names and small previews, so check that they describe each photo accurately.
- **Case studies on the Film page** (Innovate & Inspire and Imhotep). The goals and "What we did" lists were written from the films themselves. If you have a real result, such as views, applications or turnout, it can be added as a "Results" row.
- **"What happens next" beside the contact form.** It promises a reply within 1 business day and a custom quote for every project.

## Films

Three films play from YouTube. The site shows a poster and play button, and loads YouTube's player only when someone presses play:

| Film | YouTube video | Channel |
|---|---|---|
| Innovate & Inspire | `j4pF3AYWusY` | Elevate 215 |
| Beat the Odds | `tOqPjl7x-o8` | Ronald Smith |
| Stories of What's Possible in Philadelphia Schools | `z0ZtwAFEPYE` | Elevate 215 |

If one of these is removed or made private on YouTube, it stops playing on the site. To change one, update its `data-yt` and `href` values in `film.html` (Innovate & Inspire also appears in `index.html`). The Stories of What's Possible poster comes straight from YouTube's thumbnail.

The other films play from `assets/video/`. Sizes matter when choosing a host (GitHub Pages allows 100 MB per file; Cloudflare Pages allows 25 MB):

| Film | Size |
|---|---|
| Imhotep school promotion | 77 MB |
| Jaylin's prom send-off | 74 MB |
| Young Scholars social video | 37 MB |
| Saleem animated flyer | 8.6 MB |
| Homepage loop clip | 3.9 MB |

## Hosting

The site is published with GitHub Pages from the `main` branch of [RSClickedit/rsclickedit-website](https://github.com/RSClickedit/rsclickedit-website), at https://www.rsclickedit.com. The bare rsclickedit.com forwards to www.

- **Domain:** the `CNAME` file tells GitHub Pages which domain to use. Don't delete it.
- **DNS and https (Cloudflare, free plan):** the domain's nameservers are `bingo.ns.cloudflare.com` and `elmo.ns.cloudflare.com`. Cloudflare provides the https certificate and forwards visitors to GitHub.
  - rsclickedit.com: four A records to 185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153, proxied (orange cloud).
  - `www`: a CNAME to `rsclickedit.github.io`, proxied.
  - Settings: SSL/TLS mode **Full**, with **Always Use HTTPS** on. Leave "Enforce HTTPS" off in GitHub's Pages settings.
- **Email (Google Workspace):** the five MX records, the `google._domainkey` DKIM TXT record and the `google-site-verification` TXT record must stay as they are. The `mail` A records are left over from Register.com and set to "DNS only".

### Publishing a change

Edit the files, then in Terminal:

```bash
cd ~/Desktop/"Creative Media Website"/website
git add -A
git commit -m "Describe the change"
git push
```

GitHub republishes the site within a minute or two.
