# Website Recreation Prompt: "LUMEN LEAF" (temporary brand name)

> Copy everything below the line into your AI site builder or hand it to a developer.
> The temp brand name is **LUMEN LEAF**. Swap in the real name later with a find-and-replace.
> All addresses, phone numbers, ratings and product names are placeholders.

---

## PROMPT

Build a single-page, scroll-driven, cinematic website for a premium neighborhood cannabis dispensary called **LUMEN LEAF**. The site should feel like a short film you scroll through. It is dark, moody and neon-lit, with an emerald-green and electric-blue glow over near-black. The user's scroll drives every major animation. Build for desktop first (16:9 viewport) and make it fully responsive. Use Next.js (or plain HTML) with **GSAP + ScrollTrigger** and **Lenis** for smooth scroll. Use **Three.js** or a 2D canvas for the particle text.

### 1. Global design system

**Colors**
- `--bg: #07100d` (near-black with a green tint). Sections use this as the base.
- `--bg-2: #0b1a17` (dark teal-charcoal panels)
- `--emerald: #19e27a` (neon green, used for glows, the leaf neon, the mascot's hoodie)
- `--emerald-deep: #0a5a3c` (radial glow at the top of sections)
- `--electric-blue: #1238c9` and `--blue-glow: #0b2a8a` (radial glow at the bottom of sections)
- `--violet: #8b2cff` and `--magenta: #e23cff` (aurora streaks in the hero, product spotlight)
- `--cream: #f2efe6` (headings and wordmark)
- `--muted: rgba(242,239,230,.6)` (body copy)
- `--gold-pill: linear-gradient(90deg,#f6e7a8,#e9cf6b)` (primary button)

**Section background recipe** (used from section 3 onward): a base of `--bg-2`, a large soft radial **emerald** glow centered at the top (`radial-gradient(ellipse 60% 45% at 50% 0%, rgba(25,226,122,.35), transparent 70%)`), and a large **electric-blue** glow at the bottom left/center (`radial-gradient(ellipse 55% 45% at 35% 100%, rgba(18,56,201,.55), transparent 70%)`). Add a faint vignette at the edges.

**Typography**
- Wordmark and luxury headings: a wide, high-contrast **serif in all caps with very wide tracking** (`Cormorant Garamond` 500 or `Cinzel`, `letter-spacing: .35em`). Example: "L U M E N   L E A F".
- Tiny eyebrows and labels: a small, all-caps sans (`Inter` 600, 9–11px, `letter-spacing: .3em`, muted).
- Product titles: a **heavy, slightly condensed grotesk** (`Archivo Black` / `Inter Tight 800`), cream, 28–40px.
- Script accents (storefront sign, footer heading, footer wordmark): a **chunky brush/retro script** (`Kaushan Script`, `Yellowtail` or `Pacifico`). Use cream with a dark offset shadow on the storefront sign, and neon green-white with glow in the footer.
- Body: `Inter` 400, 14–15px, line-height 1.6, muted.

**Motion language**: slow, weighty and cinematic. Pin each scene and scrub it with the scroll. Use `power2.out` or `expo.out` easing. Add soft motion blur (CSS `filter: blur()` that ramps from 8px to 0) to elements as they fly in. Nothing should snap; everything fades, drifts and blurs.

---

### 2. Section 1: HERO (scroll-scrubbed cinematic sequence)

This section is **pinned for about 400vh of scroll**. It plays a pre-rendered video or image sequence **frame by frame tied to scroll position**: draw frames to a `<canvas>`, about 150–200 WebP frames, preloaded. The sequence shows the brand mascot. Create an **original** character: a cartoon duck with a big glossy orange-red bill, a black snapback cap with a neon-green brim, a neon-green oversized hoodie, a chunky gold chain, black cargo shorts and neon-green high-top sneakers, rendered in a glossy 3D "designer toy" style. Do not copy any existing cartoon character.

Storyboard in scroll order:
1. **0–15%**: The mascot is shown side-on, mid-stride, walking left-to-right on a black void. Behind him are **horizontal neon aurora/light-streak ribbons** in magenta, violet, electric blue and neon green, flowing sideways like wind trails. The streaks drift and parallax faster than the mascot.
2. **15–35%**: The camera swings around so we see the mascot **from behind**. The streaks curl into a **swirling oval portal** of green, blue and violet smoke. Through the portal we see a sunny daytime street with parked cars and the dispensary storefront.
3. **35–55%**: The portal **expands outward and dissolves off the edges of the screen**, revealing the street scene in full color. The mascot keeps walking toward the shop.
4. **55–70%**: The mascot lifts a hand to his bill and **exhales a big puffy white-blue smoke cloud** that billows to the right and drifts across the sign.
5. **70–100%**: Light shifts to dusk. The camera **dollies in and up** toward the storefront. The black fascia carries a large **3D chrome/cream script sign "Lumen Leaf"** with a dark drop shadow. Small white condensed text below the sign reads "000 PLACEHOLDER AVE, YOUR CITY". The windows glow with **neon-green cannabis-leaf signs** and small neon "Lumen Leaf" script signs. The mascot walks to the door and disappears inside. The final frames push into the dark window glass, and the image darkens and blurs into the next scene.

**Hero overlay (fixed on top of the canvas)**: at the top center, the wordmark **"L U M E N   L E A F"** in the wide-tracked cream serif (about 22–28px) with a tiny line under it reading "PREMIUM CANNABIS" (about 8px, tracked). The wordmark fades from 100% to 0% opacity over the first 60% of the hero scroll. Add a subtle "scroll" indicator at the bottom center: a thin line with a dot that drops down on a loop.

---

### 3. Section 2: "YOU HIGH?" particle text

Use the scene-transition background: the dimmed, blurred final storefront frame, darkened about 70%, with the emerald and blue glows bleeding in from the bottom.

- Thousands of tiny **pale mint/green particles** (2px, `#bfffd9` to `#19e27a`, with additive blending) start **scattered horizontally like a stream of dust or grass blades** across the middle of the screen.
- As the user scrolls (pinned for about 150vh), the particles **fly in from the right and assemble into the words "YOU HIGH?"** in a very bold rounded sans (`Archivo Black`, about 14vw), centered.
- When the text is formed, the particles shimmer slightly (small noise jitter). On further scroll, they dissolve back into dust that drifts left.
- How to build it: sample the pixel positions of the text drawn on an offscreen canvas, give each particle a random start position, and lerp it to its target with progress = scroll progress, using a staggered delay per particle based on x position so the word builds left to right.

---

### 4. Section 3: "ELEVATE YOUR EVERYDAY" 3D gallery carousel

Use the section background recipe (emerald glow at the top, blue glow at the bottom).

- Centered at the top: an eyebrow, **"THE LUMEN LEAF FEELING"** (tiny tracked caps, muted).
- Headline: **"ELEVATE YOUR EVERYDAY"** in the wide-tracked cream serif, about 44px, `letter-spacing: .25em`.
- Subline: "Curated cannabis experiences for a higher standard." (small, muted).
- Below that is a **horizontal, scroll-driven coverflow of tall portrait cards** (about 3:4, roughly 280×380px), pinned while it scrolls sideways. Each card is a moody photo of the shop with a small caption under it in tiny tracked caps:
  - `HOUSE CHOICE` (glowing pre-roll / product box display under a spotlight)
  - `THE COUNTER` (marble counter with glass jars)
  - `THE SHOWROOM`
  - `GLASS GALLERY` (illuminated glass cases of colorful packaged products)
  - `THE ROOM` (wide interior with a neon-green lit display bar and ring ceiling lights)
- The cards sit in **3D perspective** (`perspective: 1400px`). The center card faces forward at full scale. Side cards are rotated ±25° on Y, scaled to 0.85 and dimmed. As you scroll, the row slides left, and each card rotates and scales as it passes center.
- Cards get **motion blur while moving** (blur from 0 to 3px based on scroll velocity) and a faint emerald glow under them.

---

### 5. Section 4: Product spotlight sequence ("The Collection")

This section is pinned and scroll-driven. It shows a sequence of **3 product showcases** that slide in and out diagonally with motion blur. Each showcase has a large square product image on one side and text on the other. The sides alternate.

Product image style: the product sits on a **glowing emerald glass pedestal** (an ellipse with a green under-light) under a **cone-shaped top spotlight**, against a dark backdrop with a thin gold frame line. The second product gets a **purple/violet spotlight** instead.

1. **Image left, text right.** Product: white jar with green "Lumen Leaf" script label, topped with a cannabis bud. Eyebrow: `THE COLLECTION`. Title: **"Flower, elevated"**. Body: "Kept under glass. Presented like it matters — because it does."
2. **Text left, image right.** Product: purple mylar bag with a retro script strain name and fruit illustration (placeholder strain **"Plum Velvet"**). Eyebrow: `THE SIGNATURE COLLECTION`. Title: **"Plum Velvet"**. Body: "A quiet moment on emerald glass."
3. **Image left, text right.** Product: black box with a glowing cyan neon-smoke script logo and a holographic label (placeholder **"Midnight Sherbet"**). Eyebrow: `HOUSE FAVORITE`. Title: **"Midnight Sherbet"**. Body: one short poetic line.

Animation per showcase: the image enters from bottom-right (or bottom-left) at `y: 40vh, x: ±15vw, rotate: ±4°, blur: 10px, opacity 0` and settles to its resting position. The text block fades up 30px with a 0.15 stagger (eyebrow, then title, then body). On exit, both drift up and to the opposite side with blur as the next showcase enters, so the two briefly overlap. The background glows slowly shift position between showcases.

---

### 6. Section 5: Visit / footer, "Take the feeling with you."

- Full-width background: a **dark, heavily dimmed photo of the store interior** (about 85% black overlay, with green neon visible in the shot), shown mainly on the right two-thirds. On first view it fades in from a pixelated/blurred state to sharp.
- Left column, about 420px wide, vertically centered:
  - Heading in **script** (Kaushan/Yellowtail), cream, about 48px, two lines: *"Take the feeling / with you."* It writes on with a left-to-right clip-path reveal.
  - Paragraph: "A premium neighborhood dispensary in the heart of [Your City], built for the curious and the well-versed."
  - Info stack (small, muted, 13px, 6px gap):
    - `000 Placeholder Ave`
    - `Your City, ST 00000`
    - `Open · Closes 10 PM`
    - `4.8 ★ · 500+ reviews`
    - `(000) 000-0000`
  - Primary button: a **pill-shaped gold gradient button** reading "Get Directions" (dark text, 14px radius 999px, soft gold glow on hover).
  - Under it, a tiny tracked-caps text link: `CALL THE SHOP`.
- Bottom band: the blue/emerald glow returns. Centered is a **script wordmark "Lumen Leaf"** in pale neon green-white with a soft glow, and under it the tiny line `4.8 ★ · 500+ reviews` and a copyright line in muted micro text.

---

### 7. Extra details and polish
- Use **smooth scroll everywhere** (Lenis, `lerp: 0.08`).
- Add a subtle **film grain** overlay (animated noise PNG at 4–6% opacity) over the whole site.
- Hide the cursor's default look over the hero. Optionally use a small glowing green dot cursor.
- Run an **age gate modal (21+)** on first visit. Style it in the same dark emerald look, with the serif wordmark, a "I am 21 or older" gold pill and an "Exit" ghost button.
- Show **no navbar during the hero**. After the hero, fade in a minimal top bar: wordmark on the left; "Menu", "Visit", "Call" on the right in tiny tracked caps.
- Mobile: replace the hero frame-sequence with a lighter 9:16 version (or an autoplay muted MP4). Turn the coverflow into a swipeable snap carousel. Stack the product showcases vertically, each with its own fade/blur entrance.
- Respect `prefers-reduced-motion` by replacing the scrubbed sequences with static key frames and simple fades.
- Performance: preload hero frames progressively (first 20 frames, then the rest). Use `will-change: transform` only during animation. Keep the canvas at devicePixelRatio ≤ 2.

### 8. Assets to generate or provide
1. A hero frame sequence (or a source video to split into frames) following the storyboard in Section 2, with the original duck mascot and the "Lumen Leaf" storefront.
2. Five moody interior photos for the gallery cards.
3. Three product hero shots on glowing emerald glass pedestals (jar, purple bag, black neon box).
4. One dim interior photo for the footer background.
5. A film grain texture.
