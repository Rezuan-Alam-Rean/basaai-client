━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SYSTEM DESIGN CONSTANT — SHADCN/UI DESIGN SYSTEM
Apply this to every component, page, and layout without exception.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## DESIGN SYSTEM: shadcn/ui (canonical)

### TECH STACK
- Framework: React + TypeScript
- Styling: Tailwind CSS v3 utility classes only
- Primitives: Radix UI (shadcn/ui wrappers)
- Icons: lucide-react
- Font: Geist Sans (display), Geist Mono (code)

### COLOR TOKENS — CSS VARIABLES
Light mode:
  --background: 0 0% 100%
  --foreground: 240 10% 3.9%
  --card: 0 0% 100%
  --card-foreground: 240 10% 3.9%
  --primary: 240 5.9% 10%
  --primary-foreground: 0 0% 98%
  --secondary: 240 4.8% 95.9%
  --secondary-foreground: 240 5.9% 10%
  --muted: 240 4.8% 95.9%
  --muted-foreground: 240 3.8% 46.1%
  --accent: 240 4.8% 95.9%
  --accent-foreground: 240 5.9% 10%
  --destructive: 0 84.2% 60.2%
  --border: 240 5.9% 90%
  --input: 240 5.9% 90%
  --ring: 240 5.9% 10%
  --radius: 0.5rem

Dark mode (.dark):
  --background: 240 10% 3.9%
  --foreground: 0 0% 98%
  --primary: 0 0% 98%
  --primary-foreground: 240 5.9% 10%
  --secondary: 240 3.7% 15.9%
  --muted: 240 3.7% 15.9%
  --muted-foreground: 240 5% 64.9%
  --border: 240 3.7% 15.9%
  --input: 240 3.7% 15.9%

### TYPOGRAPHY SCALE
  Display:    text-4xl font-bold tracking-tight
  Heading 1:  text-3xl font-semibold tracking-tight
  Heading 2:  text-2xl font-semibold tracking-tight
  Body:       text-sm font-normal leading-6
  Muted:      text-sm text-muted-foreground
  Code:       font-mono text-sm bg-muted px-1 py-0.5 rounded

### SPACING & LAYOUT RULES
  Page padding:     px-4 md:px-8 lg:px-16
  Section gap:      space-y-8 or gap-8
  Card padding:     p-6
  Max width:        max-w-7xl mx-auto
  Radius:           rounded-lg (cards) | rounded-md (inputs/buttons)

### STRICT RULES
  ✗ No raw hex colors — CSS variable tokens only
  ✗ No custom fonts — Geist Sans / Geist Mono only
  ✗ No inline styles — Tailwind classes only
  ✗ No third-party UI libraries — shadcn/ui primitives only

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT BRIEF — APPLY SHADCN SYSTEM TO ALL PAGES BELOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## PROJECT: BashaAI — AI-Powered Bachelor Seat, Room & House Finder (Bangladesh)

BashaAI is an AI-first online platform for Bangladesh where users can find
bachelor seats, single rooms, family flats, and sublets through a GPT-style
conversational interface. The visual identity must communicate "AI intelligence"
— think ChatGPT or Claude-like UI language: dark/neutral tones, glowing input
areas, animated thinking indicators, clean message bubbles, and a sense of
intelligent search happening in real time. The platform serves two user types:
Seekers (looking for housing) and Listers (room/house owners posting listings).

Use DARK MODE as the default theme across all pages.
Primary accent color: a single electric blue (#3B82F6 mapped to --primary)
used sparingly on CTAs, AI glow effects, and active states.
All other colors must strictly follow shadcn dark mode CSS variables.

---

## PAGE 1: LANDING PAGE (Home)

Build a full landing page with these exact sections in order:

### SECTION 1 — Sticky Header / Navbar
- Logo left: "BashaAI" in Geist Sans bold with a small AI spark icon (lucide: Sparkles)
- Nav links center: Home, Find Listing, Map View, How It Works
- Right side: "Sign In" ghost button + "Get Started" primary button
- Sticky, backdrop-blur, border-bottom border-border/40

### SECTION 2 — Hero / AI Chat Interface (Above the Fold)
This is the most important section. It must look and feel exactly like a
ChatGPT/Claude-style interface embedded on the landing page.
- Full-width dark panel, slightly elevated from page background (bg-card)
- Centered heading above chat: "Find Your Perfect Basha with AI" (text-4xl font-bold)
- Subheading: "Describe what you're looking for — BashaAI will find it for you."
- A mock AI chat conversation showing 3 turns:
    User bubble: "I need a bachelor seat near Dhaka University, max 3000 taka,
                  WiFi needed, no smokers"
    AI thinking indicator: animated typing dots with label "BashaAI is searching..."
    AI response bubble: Structured reply listing 3 matched results with
                        location, price, and key facilities as pill badges
                        (WiFi ✓, No Smoking ✓, Water Included ✓)
- Below the mock chat: a real-looking chat input bar
    Placeholder: "Describe your ideal room, location, budget..."
    Right side of input: a glowing "Ask BashaAI" button with Sparkles icon
    The input bar should have a subtle electric blue glow ring (ring-blue-500/40)
- Show 3 quick-prompt suggestion chips above the input:
    "Bachelor seat near Mirpur 10", "Family flat under 12,000৳ in Dhanmondi",
    "Single room with meal facility near BUET"

### SECTION 3 — Latest Listings (Listing Cards)
- Section heading: "Recently Added Listings"
- Horizontal scrollable row of 6 listing cards, each card contains:
    - Top: Image placeholder area (bg-muted rounded-lg, aspect-video)
      with a badge top-left showing type: "Bachelor Seat" / "Single Room" / "Family Flat"
    - Location line with MapPin icon: e.g. "Mirpur-10, Dhaka"
    - Price: large bold text e.g. "৳ 3,500 / month"
    - Facilities row: small pill badges for WiFi, Gas Type, Water, Meals
    - AI match score badge: "AI Match 94%" in blue
    - Bottom: "View Details" outline button full width
- Cards: rounded-lg border bg-card shadow-sm, hover:-translate-y-0.5 transition

### SECTION 4 — Platform Features (6 Feature Cards)
- Section heading: "Why BashaAI?"
- 3-column grid (2 on tablet, 1 on mobile) of 6 cards, each with:
    - lucide icon in a rounded bg-muted square
    - Short bold title
    - 2-line description
  Use these 6 features:
    1. AI-Powered Matching (Sparkles) — "Describe your needs in plain Bangla or
       English. Our AI finds the best matches instantly."
    2. Map-Based Search (Map) — "Search listings within 500m, 1km or 2km radius
       from any location in Bangladesh."
    3. Smart Facility Filters (SlidersHorizontal) — "Filter by WiFi, meals, gas
       type, water supply, smoking policy, prepaid/postpaid electricity and more."
    4. Auto Landmark Detection (Navigation) — "AI auto-detects and displays
       nearby mosques, bus stands, hospitals, universities, and markets."
    5. Verified Listings (ShieldCheck) — "All listings go through a verification
       step to ensure accuracy and trustworthiness."
    6. Direct Messaging (MessageCircle) — "Chat directly with room owners or
       tenants without sharing your phone number publicly."

### SECTION 5 — Testimonials / Reviews
- Section heading: "What Our Users Say"
- 3 review cards side by side, each with:
    - Avatar placeholder (rounded-full bg-muted w-10 h-10) + Name + Role
    - Star rating (5 yellow stars using filled circle icons)
    - Review text (2-3 sentences in English, Bangladesh context)
  Example reviews:
    "Rahim Uddin, Seeker" — "I found a bachelor seat near Moghbazar in just
    2 minutes by describing what I needed. The AI understood my budget perfectly."
    "Nasrin Akter, Lister" — "I listed my room and got 3 genuine inquiries
    within the first day. The verification process makes tenants trust my listing."
    "Kamal Hossain, Seeker" — "The map view helped me find rooms within
    walking distance of my office in Gulshan. Saved me weeks of searching."

### SECTION 6 — Account Type CTA Box
- A prominent full-width card with dark bg-card border rounded-xl p-10
- Heading: "Join BashaAI Today"
- Subheading: "Are you looking for a place, or do you have a place to offer?"
- Two large CTA cards side by side inside this box:
    LEFT card — "I'm a Seeker"
      Icon: Search (lucide)
      Description: "Find bachelor seats, rooms and flats that match your
      exact needs using AI."
      Button: "Create Seeker Account" (primary)
    RIGHT card — "I'm a Lister"
      Icon: Home (lucide)
      Description: "Post your room or house listing and reach thousands of
      verified seekers."
      Button: "Create Lister Account" (outline)
- Divider between the two cards with "or" label

### SECTION 7 — Footer
- 4-column layout:
    Col 1: Logo + tagline "Bangladesh's smartest way to find your next home."
           + social icon row (Facebook, Instagram, LinkedIn using lucide icons)
    Col 2: Platform — Find Listing, Map View, How It Works, Pricing
    Col 3: Company — About Us, Blog, Careers, Press
    Col 4: Support — Help Center, Contact Us, Privacy Policy, Terms of Service
- Bottom bar: "© 2025 BashaAI. Made with ❤️ for Bangladesh."
- border-top border-border, bg-background

---

## PAGE 2: MAP VIEW PAGE

A full-page map-based listing finder. Since this is a prototype, simulate the
map with a styled placeholder panel — do not use any real map API.

### Layout: Two-column split
LEFT PANEL (w-80, fixed, scrollable):
- Search bar at top: "Search area or landmark..."
- Radius filter buttons below: 500m | 1km | 2km | 5km (toggle button group)
- Results count: "12 listings found nearby"
- Scrollable list of listing mini-cards (compact version):
    - Listing type badge + price + location + 2 facility pills
    - "View" button
    - Clicking highlights the pin on the map (show active state)

RIGHT PANEL (flex-1):
- Simulated map area: dark bg-muted/50 panel with a grid overlay pattern
  to simulate a map grid
- Scatter 8-10 mock location pin components across the panel:
    - Each pin: rounded-full bg-primary text-primary-foreground text-xs
      font-bold px-2 py-1 with a small downward pointer triangle below
    - Pin label: price e.g. "৳3,500"
    - One pin should be in "active/selected" state — larger, blue glow,
      with a popup card showing listing name, type, price, and 2 facilities
- Show a "You are here" indicator pin in a different color (green)
- Top-right of map: zoom controls (+/−) as ghost icon buttons
- Bottom-right: "Satellite / Map" toggle button group

---

## PAGE 3: SEARCH PAGE

A full search and filter page for listings.

### TOP SECTION: Search Bar
- Large search input: "Search by area, landmark, university, hospital..."
  with a Search icon inside and a blue "Search" button on the right
- Below: filter chips row showing active filters as removable badges:
  "Dhaka × " "Bachelor Seat × " "Under ৳5,000 × " "+ Add Filter"

### FILTER SIDEBAR (left, w-64) + RESULTS GRID (right, flex-1):

FILTER SIDEBAR:
- Heading: "Filter Results"
- Collapsible filter groups using Accordion pattern:
  1. Listing Type: Checkboxes — Bachelor Seat, Single Room, Family Flat, Sublet
  2. Budget Range: Dual-handle range slider showing ৳1,000 — ৳25,000
  3. Location: Input + "Use my location" button with MapPin icon
  4. Facilities (multi-select checkboxes):
       ☐ WiFi Available
       ☐ Meal Facility
       ☐ No Smokers
       ☐ Attached Bathroom
       ☐ Rooftop Access
  5. Water Supply: Radio — Direct Line / Water Tank / WASA
  6. Gas Type: Radio — Line Gas / Cylinder Gas
  7. Electricity: Radio — Prepaid Meter / Postpaid Meter
  8. Water Bill: Radio — Included / Separate
- "Apply Filters" primary button full width
- "Reset All" ghost button below

RESULTS GRID:
- Sort bar: "24 results" text left + "Sort by: Relevance ▾" dropdown right
- 3-column grid of listing cards (same card design as Landing Page Section 3)
- Pagination at bottom: Previous | 1 | 2 | 3 | Next

---

## PAGE 4: SEEKER ACCOUNT DASHBOARD (Demo — Looking for Listings)

A personal dashboard for a user who is searching for housing.

### LAYOUT: Sidebar (w-64) + Main Content

SIDEBAR:
- Avatar placeholder + "Rahim Uddin" + "Seeker Account" muted label
- Nav items with lucide icons:
    Dashboard (LayoutDashboard), Saved Listings (Bookmark),
    My Chats (MessageCircle), AI Search History (Sparkles),
    Account Settings (Settings), Logout (LogOut)
- Active state: bg-accent text-accent-foreground rounded-md

MAIN CONTENT — show these sections:

1. Greeting bar: "Good morning, Rahim 👋" + subtitle "You have 3 new matches today"
2. STATS ROW — 3 stat cards:
    "Saved Listings: 8", "Active Chats: 3", "AI Searches Today: 5"
3. AI SEARCH HISTORY — mini chat log panel showing last 3 AI searches:
    - Each row: query text + timestamp + "View Results" link button
    Example queries:
      "Bachelor seat near Farmgate under 4000 taka with WiFi"
      "Room with meal facility in Mohammadpur"
4. SAVED LISTINGS — 2-column grid of 4 compact listing cards with a
   "Remove from saved" icon button (Bookmark filled → unfilled on hover)
5. RECOMMENDED FOR YOU — section heading with Sparkles icon:
   "AI thinks you'll like these based on your searches"
   Horizontal scroll row of 3 listing cards with "AI Match %" badges

---

## PAGE 5: LISTER ACCOUNT DASHBOARD (Demo — Posting Listings)

A dashboard for a room owner managing their posted listings.

### LAYOUT: Same sidebar pattern as Seeker Dashboard

SIDEBAR NAV items:
    Dashboard (LayoutDashboard), My Listings (Home),
    Add New Listing (PlusCircle), Inquiries (Inbox),
    Messages (MessageCircle), Analytics (BarChart2),
    Account Settings (Settings), Logout (LogOut)

MAIN CONTENT:

1. Greeting: "Welcome back, Kamal Hossain" + "Room Owner / Lister"
2. STATS ROW — 4 stat cards:
    "Active Listings: 3", "Total Views: 248", "Inquiries This Week: 12",
    "Messages Unread: 5"
3. MY LISTINGS TABLE — a shadcn Table component showing 3 listings:
   Columns: Listing Title | Type | Location | Price | Status | Actions
   Status badge variants: "Active" (default), "Under Review" (secondary),
   "Paused" (outline)
   Actions: Edit (Pencil icon) + Pause/Activate toggle + Delete (Trash icon)
4. QUICK ADD LISTING CTA — a dashed border card (border-dashed border-2
   border-border) with a centered PlusCircle icon, heading "Add New Listing",
   and a "Post a Listing" primary button

5. RECENT INQUIRIES — list of 3 inquiry rows each showing:
   Seeker avatar + name + their message preview + timestamp + "Reply" button

---

## PAGE 6: SINGLE LISTING DETAIL PAGE

A full detail page for one listing. Use this mock listing:
Title: "Spacious Bachelor Seat — Mirpur-10, Dhaka"
Type: Bachelor Seat | Price: ৳3,500/month

### LAYOUT: Main content (flex-1) + Right sidebar (w-80)

MAIN CONTENT:

1. BREADCRUMB: Home > Search > Mirpur-10 > This Listing
2. IMAGE GALLERY: Large primary image placeholder (bg-muted rounded-xl
   aspect-video) + row of 4 smaller thumbnail placeholders below
3. LISTING HEADER:
   - Title (text-2xl font-semibold)
   - Location with MapPin icon: "Mirpur-10, Dhaka"
   - Price: "৳ 3,500 / month" (text-3xl font-bold)
   - Badges row: "Bachelor Seat" | "Verified ✓" | "AI Match 96%"

4. FACILITIES GRID — heading "Facilities & Amenities"
   Show all facilities as icon+label cards in a 4-column grid:
     WiFi Available (Wifi icon) ✓
     Meal Facility (UtensilsCrossed) ✗
     No Smokers (Wind) ✓
     Attached Bathroom (Bath) ✓
     Line Gas (Flame) ✓
     Prepaid Meter (Zap) ✓
     WASA Water Line (Droplets) ✓
     Water Bill Included (CheckCircle) ✓
   Green checkmark for available, red X for not available.

5. AI AUTO-DETECTED LANDMARKS — heading with Navigation icon
   "Nearby Landmarks (AI Detected)"
   Show as a list of rows with landmark icon + name + distance:
     🕌 Al-Amin Mosque — 120m away
     🚌 Mirpur-10 Bus Stand — 200m away
     🏥 National Heart Foundation Hospital — 1.2km away
     🎓 BRAC University — 800m away
     🏪 Agora Supermarket — 350m away
   Each row: icon + bold name + muted distance text

6. DESCRIPTION — "About This Listing" heading + 3 paragraph placeholder text
   (describe the room in realistic Bangladesh context)

7. MAP PREVIEW — simulated small map panel (bg-muted rounded-lg h-48)
   with a single pin in the center (same pin style as Map View page)
   and a "View on Full Map" link button below

RIGHT SIDEBAR (sticky):

1. CONTACT CARD — bg-card border rounded-xl p-6:
   - Lister avatar + "Kamal Hossain" + "Member since 2023"
   - "Response rate: 95%" + "Usually replies in 1 hour"
   - "Send Message" primary button full width (MessageCircle icon)
   - "Call Now" outline button full width (Phone icon)
   - Small note: "Your number stays private until you choose to share it"

2. SAVE LISTING — outline button with Bookmark icon "Save Listing"

3. SHARE LISTING — ghost button with Share2 icon "Share"

4. REPORT — ghost destructive button with Flag icon "Report Listing"

---

## PAGE 7: MESSAGING / CHAT PAGE

A full-page direct messaging interface between Seeker and Lister.

### LAYOUT: Three-panel layout

LEFT PANEL (w-72, conversation list):
- Search bar: "Search conversations..."
- List of 5 conversation rows, each showing:
    Avatar + Name + Last message preview + Timestamp
    Unread count badge (red circle with number) on unread chats
    Active/selected conversation has bg-accent highlight

CENTER PANEL (flex-1, chat area):
- TOP BAR: Avatar + Lister name "Kamal Hossain" + "Online" green dot
  + listing reference link "Re: Bachelor Seat — Mirpur-10"
  + three-dot menu button (MoreVertical icon)

- MESSAGE AREA (scrollable, flex-col gap-3 p-4):
  Show a realistic conversation thread (8-10 messages) between
  Seeker "Rahim" and Lister "Kamal" about the Mirpur-10 listing.
  Topics: asking about availability, price negotiation, asking if meals
  are included, confirming visit time.
  
  Message bubbles:
    Received (lister): left-aligned, bg-muted rounded-lg rounded-tl-none
    Sent (seeker): right-aligned, bg-primary text-primary-foreground
                   rounded-lg rounded-tr-none
  Each message: bubble + sender name muted + timestamp muted below

  Include one special "AI Suggestion" bubble between messages:
    bg-blue-950/40 border border-blue-500/30 rounded-lg p-3
    Header: Sparkles icon + "BashaAI Suggests" in blue muted text
    Content: "Based on your conversation, here are 2 similar listings
    you might also like:" + 2 compact listing mini-cards below

- BOTTOM BAR: Input area
    Paperclip icon button (attach) + emoji button
    Input: "Type a message..." with rounded-full styling
    Send button: bg-primary rounded-full p-2 (Send icon)

RIGHT PANEL (w-64, listing context sidebar):
- Heading: "About This Listing"
- Compact listing card for Mirpur-10 listing:
    Image placeholder + title + price + location + "View Listing" button
- Section: "Quick Replies" — 3 pre-written suggestion chips:
    "Is the room still available?"
    "Can I visit tomorrow?"
    "What is included in the rent?"
- Section: "Seeker Profile" — avatar + name + "Verified Seeker" badge

---

## GLOBAL DESIGN NOTES (apply to all pages):

1. Default theme: DARK MODE throughout all pages
2. The AI elements (chat bubbles, "BashaAI is thinking" dots, AI match
   badges, AI suggestion cards) should have a subtle blue glow treatment:
   ring-1 ring-blue-500/20 or shadow with blue tint — used sparingly
3. Currency: always use ৳ (Taka symbol) for all prices
4. Language: All UI copy in English but proper nouns (area names, landmarks)
   should be real Bangladesh locations (Dhaka, Mirpur, Dhanmondi, Gulshan,
   Mohammadpur, Farmgate, Moghbazar, Uttara, etc.)
5. Every page must have the sticky Navbar from Page 1
6. Loading/skeleton states: where relevant, show a shimmer skeleton card
   using bg-muted animate-pulse to indicate AI is processing
7. All interactive elements must have visible hover and focus states
8. Responsive: design for desktop-first but ensure mobile layout makes sense

Generate PAGE 1: LANDING PAGE first. Full desktop layout, dark mode.

Now generate PAGE 2: MAP VIEW PAGE. Keep all design tokens consistent with Page 1.


