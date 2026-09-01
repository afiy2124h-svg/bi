# For Sneha ❤️

A private, cinematic, romantic birthday surprise website — a digital birthday gift
created especially for Sneha. It opens with a secret password, plays a song, walks
through photos and memories, and ends with a burst of happiness.

## Quick Start

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

## Build for deployment

```bash
npm run build
npm run preview
```

The finished site is written to the `dist/` folder and can be hosted on any static
host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, etc.) — no backend needed.

---

## Add your photos

Put photos in:

```
public/assets/images/
```

Edit `src/config/birthday.js` → the `photos` array:

```js
photos: [
  {
    image: "assets/images/photo1.jpg",
    caption: "That beautiful smile ❤️"
  }
]
```

If a photo is missing, the site shows a beautiful fallback instead of breaking.

## Add your music

Put your song here:

```
public/assets/music/birthday-song.mp3
```

If the file is missing, the site still works — the music player simply shows a hint.

## Personalize everything

Almost everything is editable in one file:

```
src/config/birthday.js
```

| What | Where |
| --- | --- |
| Name | `name` |
| Password | `password` |
| Birthday | `birthday` (e.g. `"2005-09-01"`) |
| Countdown on/off | `showCountdown` |
| Song file | `song` |
| Birthday message | `birthdayMessage` |
| Slideshow photos | `photos` |
| Memory timeline | `memories` |
| Gift options | `giftOptions` |
| Secret message | `secretMessage` / `enableSecretMessage` |

> The password gate is intentionally a simple client-side secret. It keeps the
> surprise hidden from casual visitors, but it is not real authentication.

## The journey

```
Password screen  →  Unlock animation  →  Welcome  →  Countdown
→  Birthday introduction  →  Music  →  Photo slideshow
→  Memories  →  Birthday message  →  Happiness gift
→  Final surprise  →  Replay memories
```

## Tips

- Photos work best in landscape / square, reasonably sized (under ~1 MB each).
- The wrong-password hint is a gentle shake — unlimited attempts allowed.
- Clicking the small heart in the bottom-left corner 5 times reveals a secret
  message.
- The music starts after pressing **"Begin Your Birthday Surprise ✨"**, since
  browsers only allow audio after a real user click.

Made with love, for Sneha. ❤️
