import {
  db,
  modulesTable,
  liveSessionsTable,
  libraryItemsTable,
  usersTable,
  invoicesTable,
  conciergeNotesTable,
  conciergeCheckInsTable,
} from "@workspace/db";

const MODULES = [
  {
    slug: "intro-orientation",
    title: "Welcome & Orientation",
    subtitle: "How this program works and how to use it",
    order: 0,
    planSection: "intro",
    durationMin: 8,
    videoEmbedUrl: "https://player.vimeo.com/video/76979871",
    body: `## Welcome

Falls are the leading cause of injury for adults over 65 in the United States — but the great majority of falls are preventable. This program is built around a simple promise: small, consistent changes in four areas (movement, vision, medications, and home environment) can meaningfully lower your risk in a matter of weeks.

This orientation walks you through how the program is organized, how long each module takes, and how to get the most out of the live sessions.

## How to use the plan

The 10-Point Plan is meant to be worked through in order, but you can revisit any module as often as you like. We recommend one module a week. Print the worksheets, do the exercises, and bring questions to the live group classes.

## A note on safety

If you have had a recent fall, are recovering from surgery, or have a medical condition that affects balance, please talk with your doctor before starting any new exercise routine.`,
    keyPoints: [
      "Most falls are preventable — small, steady changes add up.",
      "Work through the modules in order, one per week is ideal.",
      "Bring questions to the live group sessions.",
    ],
    comingSoon: false,
    freeTier: true,
    printable: true,
  },
  {
    slug: "module-1-understanding-fall-risk",
    title: "Module 1 — Understanding Your Fall Risk",
    subtitle: "The four main risk factors and what to do about each",
    order: 1,
    planSection: "ten_point",
    durationMin: 22,
    videoEmbedUrl: "https://player.vimeo.com/video/76979871",
    body: `## What this module covers

In this first module you will learn the four risk factors that account for the vast majority of falls in older adults, how each one contributes, and which ones you can change. This is the foundation everything else in the plan is built on.

### 1. Movement and balance

Strength, flexibility, and balance all decline gradually with age — but they respond beautifully to practice at any age. Even short, simple routines done two or three times a week measurably reduce fall risk within six to eight weeks.

### 2. Vision

Poor vision is one of the most under-recognized contributors to falls. Bifocals and progressives, in particular, can distort your perception of stairs and curbs. Annual eye exams matter.

### 3. Medications

Many common medications — including some prescribed for blood pressure, sleep, anxiety, and pain — can cause dizziness or unsteadiness, especially in combination. A medication review with your pharmacist is one of the highest-leverage things you can do.

### 4. Home environment

The home is where most falls happen. Loose rugs, poor lighting, missing grab bars, and clutter are common culprits. Module 8 covers a full room-by-room walkthrough.

## Your homework for this module

1. Take the Fall Risk Self-Assessment if you have not already.
2. Note which of the four areas you scored highest in. That is where your plan starts.
3. Bring your top concern to the next live Q&A session.

## Printable

A one-page summary of this module is available to download below.`,
    keyPoints: [
      "Four risk factors cause most falls: movement, vision, medications, home environment.",
      "All four are modifiable — none are inevitable.",
      "Start with the area where you scored highest in the self-assessment.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },
  {
    slug: "module-2-balance-foundations",
    title: "Module 2 — Balance Foundations",
    subtitle: "Daily five-minute practice",
    order: 2,
    planSection: "ten_point",
    durationMin: 18,
    videoEmbedUrl: "https://player.vimeo.com/video/76979871",
    body: `## Why balance is trainable at any age

Balance is not a fixed trait. It is a skill, and like any skill it improves with practice — even into the ninth and tenth decades of life. The research here is unusually clear: adults who practice simple balance work for as little as five minutes a day, most days of the week, cut their fall risk by roughly a third within three months.

The reason is that balance is really three systems working together: your inner ear (vestibular), your eyes, and the sensors in your feet, ankles, and joints (proprioception). When any one of those weakens, the others can be trained to compensate. That is what this module's daily practice is designed to do.

### The five-minute foundation routine

Do this every day, ideally at the same time — many members find right after breakfast works best because you are already up and moving. Stand near a sturdy counter or the back of a heavy chair so you have something to hold if you need it.

1. **Heel-to-toe stand (30 seconds each side).** Place one foot directly in front of the other, heel touching toe. Hold. Switch which foot is in front.
2. **Single-leg stand (15–30 seconds each side).** Lift one foot just an inch off the floor. Build up over weeks.
3. **Heel raises (10 repetitions).** Rise up onto the balls of your feet, then lower slowly.
4. **Sideways walking (10 steps each direction).** Step sideways along your counter, controlled and slow.
5. **Sit-to-stand (5 repetitions).** From a sturdy chair, stand up without using your hands if you can. Sit back down with control.

The whole routine takes five to seven minutes. Done daily, it is the single most effective habit in the entire program.

## Progressing safely

Begin with one hand on the counter. After a week or two, try one finger. After another week or two, try hands hovering above the counter but not touching. Only progress when the current level feels easy.

## Common mistakes

The two most common mistakes are rushing the movements and holding your breath. Slow is strong. Breathe normally throughout.

## Homework

Print the tracking sheet below and check off the routine each day for the next seven days. Bring your sheet to the next live class.`,
    keyPoints: [
      "Five minutes a day, most days, measurably reduces fall risk within three months.",
      "Always practice near a sturdy counter or chair you can grab if needed.",
      "Progress by reducing support (full hand → one finger → hover), not by going faster.",
      "Slow, controlled movements build more balance than quick ones.",
      "Track your daily practice — consistency matters more than duration.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },
  {
    slug: "module-3-strength",
    title: "Module 3 — Building Lower-Body Strength",
    subtitle: "Sit-to-stand, calf raises, and the wall squat",
    order: 3,
    planSection: "ten_point",
    durationMin: 20,
    videoEmbedUrl: "https://player.vimeo.com/video/76979871",
    body: `## Why lower-body strength matters more than you think

After age 60, adults lose roughly 1–2% of their muscle mass per year if they do not actively work to maintain it. The legs and hips lose strength even faster. This is the single biggest factor in whether a stumble becomes a fall, and whether a fall becomes a hospital stay.

The good news is that lower-body strength responds to training faster than almost any other physical quality. Members in their 70s and 80s routinely double their leg strength in 10–12 weeks of consistent practice. You do not need a gym, weights, or special equipment.

### The three foundation exercises

These three movements, done two or three times a week, cover the major muscle groups that protect you from falls.

**1. Sit-to-stand (the king of all exercises).** From a sturdy chair, stand up without using your hands, then sit back down with control. Start with 5 repetitions. Build to 3 sets of 10 over six weeks. If standing without hands is too hard, use one hand on the chair arm and progress from there.

**2. Calf raises.** Standing behind a chair with light fingertip support, rise up onto the balls of your feet, hold for one second, then lower slowly over a count of three. Do 10 repetitions. Build to 3 sets of 15.

**3. Wall squat.** Stand with your back flat against a wall, feet about a foot in front of you, shoulder-width apart. Slide down the wall until your knees are bent about 30 degrees (do not go deeper than 90 degrees). Hold for 10 seconds, then slide back up. Build the hold to 30 seconds over six weeks.

## How to progress safely

Strength training should feel challenging by the last two or three repetitions of each set, but never painful. Mild muscle soreness the next day is normal and good. Sharp pain, especially in joints, is a signal to back off and check with your doctor or physical therapist.

Rest at least one day between strength sessions. Your muscles get stronger during recovery, not during the workout itself.

## What about weights?

You do not need them to get the benefits in this module. If you want to add resistance later, the simplest option is a small backpack with a couple of cans of soup. Start with two pounds and add a pound every couple of weeks.

## Homework

Pick three days this week — Monday/Wednesday/Friday is a popular pattern — and do all three exercises. Track your sets and reps on the worksheet below.`,
    keyPoints: [
      "Lower-body strength loss is the biggest predictor of serious falls — and the most reversible.",
      "Three exercises (sit-to-stand, calf raises, wall squat) cover the muscles that matter most.",
      "Train two or three days per week, with at least one rest day between sessions.",
      "Progress by adding repetitions, not by going faster.",
      "Mild soreness is fine; sharp joint pain is a stop sign.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },
  {
    slug: "module-4-vision",
    title: "Module 4 — Vision and Eyewear",
    subtitle: "Why your glasses might be working against you",
    order: 4,
    planSection: "ten_point",
    durationMin: 14,
    videoEmbedUrl: "https://player.vimeo.com/video/76979871",
    body: `## The vision–falls connection nobody talks about

Roughly one in three adults over 65 has a vision problem that contributes to their fall risk, and most of them do not know it. The culprit is rarely going blind. It is far more often a subtle change — depth perception, contrast sensitivity, or the way your glasses distort what is right in front of your feet.

### The bifocal and progressive lens problem

Bifocals and progressive (no-line) lenses are wonderful for reading and seeing far away — but they cause a specific problem when you look down at stairs or curbs. The lower portion of the lens is calibrated for reading distance (about 14 inches), which means everything four to six feet away — exactly where the next stair is — appears blurred and distorted.

The research on this is sobering: people who wear progressives outside the home have roughly double the fall risk on stairs compared to those who use single-vision distance glasses for walking.

### The two-glasses solution

The single most effective change you can make in this module is to own two pairs of glasses:

1. **Single-vision distance glasses** for walking, especially outdoors and on stairs.
2. **Your usual bifocals or progressives** for everything else — reading, cooking, the computer.

It is a small habit change. The impact on fall risk is large.

## Other vision factors that matter

**Annual eye exams.** Cataracts, glaucoma, and macular degeneration all develop gradually and silently. A yearly comprehensive exam (not just a vision screening) catches them early.

**Lighting at home.** Module 8 covers this in depth, but the headline is: your eyes need three times as much light at age 70 as they did at 30. Stairwells and hallways are the highest-priority places to improve.

**Contrast.** Putting a strip of brightly colored tape on the edge of each step makes them dramatically easier to see, especially in low light.

## Homework

1. If you wear bifocals or progressives, schedule an appointment to get a single-vision distance pair.
2. If your last comprehensive eye exam was more than a year ago, schedule one this week.
3. Walk through your home with the lights on as they normally are. Note the three darkest spots and plan to add lighting.`,
    keyPoints: [
      "Progressive and bifocal lenses double fall risk on stairs.",
      "Own a separate single-vision distance pair for walking, especially outdoors.",
      "Get a comprehensive eye exam every year — screenings are not enough.",
      "Adults over 70 need roughly 3× as much light as they did at 30.",
      "Bright tape on stair edges is a cheap, high-impact change.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },
  {
    slug: "module-5-medications",
    title: "Module 5 — The Medication Review",
    subtitle: "A conversation with your pharmacist",
    order: 5,
    planSection: "ten_point",
    durationMin: 16,
    videoEmbedUrl: "https://player.vimeo.com/video/76979871",
    body: `## Medications: the most overlooked fall risk

If we could change just one thing about how older adults are cared for in this country, it would be this: every adult over 65 should have a comprehensive medication review with a pharmacist at least once a year. The evidence is overwhelming. Medication review alone reduces fall risk by 20–40% in people taking four or more daily medications.

The reason is simple. Most people accumulate medications over the years — a sleep aid here, a blood pressure pill there, an anti-anxiety prescription from a few years back that nobody ever stopped. Each was reasonable on its own. Together, they can quietly cause the dizziness, lightheadedness, or daytime drowsiness that leads to a fall.

### High-risk medication categories

These categories are most strongly linked to falls in older adults. If you take any of them, the medication review below is especially important.

- **Sleep aids and sedatives** (zolpidem, eszopiclone, benzodiazepines like lorazepam or diazepam)
- **Anti-anxiety medications** (especially long-acting benzodiazepines)
- **Some antidepressants** (particularly older tricyclics)
- **Blood pressure medications** (especially when first started or after a dose change)
- **Diuretics ("water pills")** which can cause dehydration and dizziness
- **Opioid pain medications**
- **Some over-the-counter antihistamines** (diphenhydramine / Benadryl, in particular)
- **Anticholinergics** (some bladder medications, muscle relaxants)

A single medication in any of these categories may be entirely appropriate. The risk grows quickly when several are combined.

### How to prepare for the conversation

Bring **everything**, including over-the-counter products and supplements. Many pharmacists call this the "brown bag review" — literally bring a bag with every bottle in it.

Questions to ask:

1. Is each of these medications still needed? When was it last reviewed?
2. Are any of these on the **Beers Criteria** list of medications considered high-risk for older adults?
3. Could any of these interact with each other to cause dizziness, drowsiness, or low blood pressure?
4. Are there safer alternatives for any of them?
5. Could any be taken at a different time of day to reduce the chance of falling at night?

## A note on stopping medications safely

Never stop a prescription medication on your own. Some require gradual tapering. The point of this module is to start the conversation with your pharmacist and prescribing doctor — not to make changes without them.

## Homework

1. Make a list of every medication and supplement you take, with the dose and time of day.
2. Schedule a brown-bag review with your pharmacist this month.
3. After the review, share any recommended changes with your primary care doctor.`,
    keyPoints: [
      "Medication review reduces fall risk by 20–40% in people on four or more daily medications.",
      "Sleep aids, sedatives, blood pressure pills, and diuretics are the highest-risk categories.",
      "Bring every bottle — prescription, OTC, and supplements — to a 'brown bag' pharmacist review.",
      "Ask whether any of your medications are on the Beers Criteria list.",
      "Never stop a prescription on your own; some require gradual tapering.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },
  {
    slug: "module-6-footwear",
    title: "Module 6 — Footwear That Works",
    subtitle: "What to look for, what to throw out",
    order: 6,
    planSection: "ten_point",
    durationMin: 12,
    videoEmbedUrl: "https://player.vimeo.com/video/76979871",
    body: `## Your shoes matter more than you think

A surprising amount of fall research has focused on footwear, and the findings are consistent: the wrong shoes roughly double your fall risk, and the right ones can cut indoor falls nearly in half. Most people never get advice about this from their doctor.

### What makes a fall-safe shoe

The ideal shoe for an older adult has five features:

1. **A firm, thin sole.** Soft, cushy soles feel comfortable but reduce the feedback your feet need to sense the ground. A firmer sole helps you feel where you are.
2. **A low, broad heel.** Less than one inch, with a wide base. High or narrow heels shift your center of gravity and make ankle sprains far more likely.
3. **A non-slip tread.** Look for visible grooves on the sole, similar to a tire. Smooth leather soles are notoriously slippery on tile and polished wood.
4. **A secure fastening.** Laces, Velcro straps, or buckles that actually hold the shoe onto your foot. Slip-ons that flop around at the heel are a common fall trigger.
5. **A snug fit at the heel and a roomy fit at the toes.** Toes should not be cramped, but the heel must not slip up and down as you walk.

### What to throw out (or only wear sitting down)

- Backless slippers and slides
- Smooth-soled dress shoes
- High heels of any kind
- Shoes whose soles have gone smooth from wear
- Flip-flops and "barefoot" sandals
- Loose house slippers without a back

### What about going barefoot at home?

This one surprises people. Walking barefoot or in socks-only on hardwood, tile, or linoleum is one of the most common settings for indoor falls. Either wear a proper indoor shoe with a non-slip sole, or use non-slip socks with rubber dots on the bottom.

## When to replace shoes

Look at the sole. When the tread is worn smooth, the shoe is done — even if the upper still looks fine. For most daily-wear shoes, that is 9 to 12 months.

## Homework

1. Walk through your closet and apply the five-feature checklist to every pair of shoes.
2. Identify your one best pair for indoors and your one best pair for outdoors.
3. Replace or retire any pair that fails the checklist.`,
    keyPoints: [
      "Look for five features: firm thin sole, low broad heel, non-slip tread, secure fastening, snug heel.",
      "Backless slippers and smooth-soled dress shoes are the most common offenders.",
      "Walking barefoot or in socks on hardwood and tile is a major indoor fall risk.",
      "Replace shoes when the sole tread wears smooth — usually every 9–12 months.",
      "Audit your closet today; even one good change makes a measurable difference.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },
  {
    slug: "module-7-nutrition",
    title: "Module 7 — Nutrition for Bone and Muscle",
    subtitle: "Protein, vitamin D, and hydration",
    order: 7,
    planSection: "ten_point",
    durationMin: 15,
    videoEmbedUrl: "https://player.vimeo.com/video/76979871",
    body: `## Why nutrition belongs in a fall-prevention program

Two of the biggest predictors of a serious fall injury are sarcopenia (age-related muscle loss) and osteoporosis (low bone density). Both are powerfully influenced by what you eat and drink, and the changes that help are surprisingly simple.

### Protein: the underrated nutrient

Most older adults eat too little protein. The old guidelines suggested about 0.8 grams per kilogram of body weight per day; current research on healthy aging suggests 1.0 to 1.2 grams. For a 150-pound person, that is roughly 75 to 85 grams a day.

Just as important: **spread your protein across the day**. The body can only build muscle from about 25–30 grams of protein at a time. A typical American pattern — light breakfast, light lunch, big dinner — wastes most of the dinner protein. Aim for 20–30 grams at each of three meals.

Good sources: Greek yogurt, eggs, cottage cheese, fish, chicken, beans and lentils, tofu, milk, and a scoop of protein powder in a smoothie if you need a quick boost.

### Vitamin D and calcium

Vitamin D helps your body absorb calcium and is also linked directly to muscle function. Many older adults are mildly deficient, especially through the winter and especially if they spend most of their time indoors. A simple blood test will tell you where you stand. Most adults over 65 do well with 800–1,000 IU per day from food or a supplement — but talk to your doctor about the right level for you.

Calcium needs go up after age 50, to about 1,200 mg per day. Dairy is the easiest source; if you do not tolerate dairy, fortified plant milks, sardines, canned salmon with bones, tofu, and leafy greens all contribute.

### Hydration: the simplest fix

Mild dehydration causes dizziness on standing — the medical term is orthostatic hypotension — and is one of the most common preventable triggers of falls. Older adults feel thirst less reliably, so you cannot wait until you feel thirsty.

A simple rule: drink a full glass of water with every meal, and another one mid-morning and mid-afternoon. That is six glasses a day, before counting tea, coffee, or anything else. If you take a diuretic, your doctor may want you to aim slightly differently — ask.

## Homework

1. Track your protein for two days. If you are under 75 grams a day, plan one specific change.
2. If you have not had a vitamin D level checked in the last year, ask your doctor at your next visit.
3. Set up a visible water reminder — a marked bottle on the counter works well.`,
    keyPoints: [
      "Aim for 1.0–1.2 grams of protein per kilogram of body weight per day, spread across three meals.",
      "Vitamin D supports both calcium absorption and muscle function; ask your doctor about a blood test.",
      "Calcium needs rise to 1,200 mg per day after age 50.",
      "Mild dehydration is a major hidden trigger of dizziness and falls.",
      "Drink a glass of water with every meal plus mid-morning and mid-afternoon, without waiting for thirst.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },
  {
    slug: "module-8-home-walkthrough",
    title: "Module 8 — Room-by-Room Home Walkthrough",
    subtitle: "Bathroom, bedroom, stairs, kitchen",
    order: 8,
    planSection: "ten_point",
    durationMin: 28,
    videoEmbedUrl: "https://player.vimeo.com/video/76979871",
    body: `## The most important module in the program

More than half of all falls in adults over 65 happen at home, and the great majority of those happen in just four rooms: the bathroom, the bedroom, the stairway, and the kitchen. This module is a guided walkthrough of each one. Print the checklist below and do it with a family member if you can — a second pair of eyes catches what your own eyes have learned to ignore.

### The bathroom

The bathroom causes more serious injuries per square foot than any other room in the house. The combination of hard surfaces, water, and the act of standing up from a low toilet is uniquely hazardous.

- **Grab bars** beside the toilet and inside the shower or tub. Suction-cup bars are not safe — bars must be screwed into wall studs or use specialized hollow-wall anchors.
- **Non-slip mat** inside the tub or shower. Replace it when the suction stops gripping.
- **Raised toilet seat** if you find yourself pushing off the walls or counter to stand up.
- **Walk-in shower** if you are renovating. Stepping over a tub edge is a top-three indoor fall trigger.
- **A nightlight** in the bathroom for the inevitable middle-of-the-night trip.

### The bedroom

- **A clear path** from bed to bathroom with no rugs, cords, or shoes to step around.
- **A nightlight or motion-activated light** along that path.
- **A sturdy lamp** within easy reach of the bed — not a touch-lamp that may not respond on the first try.
- **Bed at the right height.** You should be able to plant both feet flat on the floor while seated on the edge.
- **Phone within reach** of the bed in case of a nighttime fall.

### The stairs

- **Sturdy handrails on both sides** of every staircase, inside and out.
- **Even, well-lit treads.** Bright tape on the edge of each step helps enormously in low light.
- **No clutter.** Nothing — not even a folded laundry basket — staged on the stairs to "take up later."
- **Avoid carrying loads** that block your view of the next step. Make two trips.

### The kitchen

- **Everyday items on shelves between waist and shoulder height.** No standing on a chair or step stool for the coffee mugs.
- **A sturdy, two-step kitchen ladder with a high handrail** for the rare reach to high shelves. Never a chair.
- **Spills mopped immediately.**
- **A rubber-backed mat** in front of the sink if you spend long periods standing there.

### Hallways and living areas

- **Throw rugs:** the simplest rule is to remove them. If you cannot, use double-sided rug tape to anchor every edge.
- **Cords:** never run them across walkways. Tape them to baseboards or run them behind furniture.
- **Lighting:** 60-watt-equivalent bulbs minimum in any room you walk through at night.

## Homework

Print the checklist below and walk through your home in one sitting. Mark every item as fixed, in progress, or needs help. Bring the list to your next live class or concierge call.`,
    keyPoints: [
      "More than half of all falls happen at home — and most are preventable with small changes.",
      "Bathroom, bedroom, stairs, and kitchen account for the great majority of home falls.",
      "Grab bars and handrails must be anchored into studs — suction-cup bars are not safe.",
      "Throw rugs are the single most common indoor trip hazard; remove them if possible.",
      "Do the walkthrough with a second pair of eyes — a family member sees what you no longer notice.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },
  {
    slug: "module-9-getting-up",
    title: "Module 9 — How to Get Up After a Fall",
    subtitle: "The technique everyone should practice once",
    order: 9,
    planSection: "ten_point",
    durationMin: 11,
    videoEmbedUrl: "https://player.vimeo.com/video/76979871",
    body: `## A skill worth practicing before you need it

Even with the best prevention plan, falls sometimes happen. What separates a fall that becomes a frightening hour on the floor from one that becomes a brief inconvenience is whether you have ever practiced getting back up. Most people have not. This module fixes that.

Important note: please practice this with another person present, on a carpeted floor or with a thick mat down. If you have hip, knee, or shoulder problems, talk with a physical therapist about whether and how to practice.

### Step 1: Pause and assess

Do not rush. Lie still for a moment and take a few breaths. Ask yourself: am I hurt? Can I move my arms and legs? If there is sharp pain, especially in a hip, do not try to get up. Call for help or use your phone or medical alert.

### Step 2: Roll onto your side

Slowly roll onto whichever side feels easier. Bend your top knee and reach your top arm across your body to help the roll.

### Step 3: Push up to your hands and knees

From your side, push yourself up onto your hands and knees. Take your time.

### Step 4: Crawl to a sturdy piece of furniture

Move to a heavy chair, sofa, or low bed — something that will not tip when you put weight on it.

### Step 5: Hands on the seat, one knee up

Put both hands flat on the seat of the chair. Bring your stronger leg forward and place that foot flat on the floor, with the knee bent. Your other knee stays down.

### Step 6: Push up and pivot

Push down through both hands and the forward foot to rise up. Pivot your hips and sit down on the chair. Sit for several minutes before trying to stand up and walk.

## When to call for help instead

- If you feel any sharp pain, especially in a hip, shoulder, or back.
- If you feel dizzy, confused, or short of breath.
- If you hit your head, even if you feel fine — this needs medical attention, especially if you take a blood thinner.
- If you cannot get into the position to push up.

A medical alert pendant or a phone kept on you at all times is a reasonable precaution for anyone living alone.

## Homework

Practice this once with a family member or in your next live class. The first time is awkward. By the third time most people feel surprisingly capable.`,
    keyPoints: [
      "Practice the get-up technique before you ever need it — most people never do.",
      "Always pause first to check for injury before trying to move.",
      "Roll to your side, then to hands and knees, then crawl to a sturdy chair.",
      "Sharp pain, dizziness, or a head hit means stop and call for help.",
      "Keep a phone or medical alert on your person, especially if you live alone.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },
  {
    slug: "module-10-staying-the-course",
    title: "Module 10 — Staying the Course",
    subtitle: "Habits, routines, and asking for help",
    order: 10,
    planSection: "ten_point",
    durationMin: 17,
    videoEmbedUrl: "https://player.vimeo.com/video/76979871",
    body: `## The hardest part is week six

Most fall-prevention programs work — when people stick with them. The challenge is rarely understanding what to do. It is doing it consistently after the early enthusiasm fades. This module is about the habits and supports that keep the plan going through month two, month six, and year two.

### Anchor each new habit to an existing one

The single most reliable trick in behavior research is called **habit stacking**. You attach a new habit to something you already do every day, in the same place, at the same time.

Examples that members find work:

- Balance exercises right after brushing teeth in the morning.
- Strength routine on Monday, Wednesday, and Friday before lunch.
- A full glass of water with each of the day's medications.
- A weekly Sunday-evening home safety walk-through (5 minutes is enough).

Do not try to install all of these at once. Pick one. Get it solid for two weeks. Then add the next.

### Make it social

People who do the program with a partner — a spouse, an adult child, a friend, or a small group from the live classes — stick with it dramatically longer. If you can, find one person to text once a week with "did the exercises three times this week, what about you?"

The live classes and Q&A sessions exist for exactly this reason. Showing up matters even when you do not have a question.

### Tracking that does not become a chore

A simple wall calendar with a checkmark for each day you do your routine is enough. Forget the apps. Forget the spreadsheets. The visible streak is the motivator.

### What to do when you slip

Everyone has weeks where the routine falls apart — a cold, a holiday, family visiting from out of town. The research is clear: a one-week lapse does not undo months of progress, and the people who get back on track within two weeks lose almost nothing.

The trick is to plan for the restart before the lapse ends. Pick the exact day and the exact first session. Tell someone. Show up.

### Asking for help is part of the plan

If you live alone, if you have had a recent fall, or if you are caring for a spouse, the concierge program exists for you. So do family members, neighbors, your faith community, and your primary care doctor. The most successful members of this program are not the ones who need the least help. They are the ones who ask for it earliest.

## Homework

1. Pick one habit from this module to anchor to something you already do daily.
2. Identify one person you will check in with weekly.
3. Put a wall calendar somewhere visible and start the streak.`,
    keyPoints: [
      "Anchor new habits to existing daily routines — this is the most reliable behavior-change trick.",
      "Add habits one at a time. Two weeks per habit before adding the next.",
      "People who do the program with a partner stick with it dramatically longer.",
      "A one-week lapse does not undo months of progress — plan your restart in advance.",
      "Asking for help early is a feature of the plan, not a failure of it.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },
  {
    slug: "five-point-quickstart",
    title: "5-Point Quick Start",
    subtitle: "The short version when you only have one afternoon",
    order: 20,
    planSection: "five_point",
    durationMin: 25,
    videoEmbedUrl: "https://player.vimeo.com/video/76979871",
    body: `## When you only have one afternoon

The full 10-Point Plan is the right place to land. But sometimes a family member is visiting for the weekend and wants to help, or you have just had a scare and want to do *something* today. This Quick Start is the high-leverage 20% — five changes that together cover most of what matters.

### 1. Walk through the bathroom

Install (or commit to installing) two grab bars: one beside the toilet and one in the shower or tub. Anchored into studs, not suction-cup. This single change has the largest evidence base of any home modification.

### 2. Audit the floors

Walk through every room. Pick up every throw rug. If you absolutely must keep one, tape down every edge with double-sided rug tape. Tape or move every cord that crosses a walkway.

### 3. Replace one pair of shoes

Find the worst pair you wear regularly — usually backless slippers, smooth-soled dress shoes, or worn-out sneakers — and replace them with something that has a firm, thin sole, a low broad heel, and a non-slip tread. One good pair for indoors, one for out.

### 4. Schedule two appointments

- A **comprehensive eye exam** if your last one was more than a year ago.
- A **brown-bag medication review** with your pharmacist, bringing every prescription, over-the-counter product, and supplement.

These are two phone calls. They are the two highest-impact medical conversations in the whole plan.

### 5. Start the five-minute daily routine

From Module 2: heel-to-toe stand, single-leg stand, heel raises, sideways walking, sit-to-stand. Five minutes, every morning, near a counter you can grab.

## What you'll have done in one afternoon

If you do all five of these — most of which are a single phone call or a single trip to the hardware store — you will have addressed the bathroom, the floors, your shoes, your eyes, your medications, and your daily practice. That is the great majority of fall risk for most people.

The full 10-Point Plan goes deeper on each of these and adds nutrition, strength, recovery, and habits. But this is a real, meaningful start.

## Homework

Print the checklist below. Do as much as you can in one afternoon. Whatever is left, schedule for next week.`,
    keyPoints: [
      "Two grab bars in the bathroom, anchored into studs, is the single highest-evidence home change.",
      "Pick up throw rugs and tape down cords — this afternoon, every room.",
      "Replace one worst pair of shoes with a firm-sole, low-heel, non-slip pair.",
      "Two phone calls: comprehensive eye exam and a brown-bag pharmacist review.",
      "Start the five-minute daily balance routine tomorrow morning.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },
  {
    slug: "appendix-a-printable-worksheets",
    title: "Appendix A — Printable Worksheets",
    subtitle: "Every worksheet in one place",
    order: 30,
    planSection: "appendix_a",
    durationMin: null,
    videoEmbedUrl: null,
    body: `## The full library of printables

Every worksheet, checklist, and tracking sheet referenced across the program is collected here so you can find them in one place. Download what you need and keep a binder if it helps — many members do.

### Assessment

- **Fall Risk Self-Assessment** — the 12-question screen used in Module 1.
- **Home Hazard Walkthrough Checklist** — the room-by-room list from Module 8.
- **Medication List Template** — the brown-bag form to bring to your pharmacist (Module 5).

### Daily and weekly practice

- **Five-Minute Balance Routine Tracker** — Module 2.
- **Strength Training Log** — Module 3 (sit-to-stand, calf raises, wall squat).
- **Weekly Home Safety Walk-Through** — a short Sunday-evening checklist.

### Reference cards

- **Footwear Five-Feature Checklist** — Module 6, the card to take shopping.
- **Get-Up Sequence Card** — the six-step technique from Module 9, designed to be taped to the inside of a closet door.
- **Daily Hydration and Protein Targets** — Module 7.

### For family and caregivers

- **Conversation Starter — Talking to a Parent About Falls** — for adult children who have noticed concerns.
- **Caregiver Home Walkthrough** — the Module 8 checklist annotated for a visiting family member.

## How to use the printables

Click any worksheet to download a print-ready PDF. We recommend printing on regular paper and keeping them in a single folder. The tracking sheets work best on the fridge, on a clipboard by your favorite chair, or anywhere you will actually see them.

If a worksheet refers to a module you have not done yet, save it for when you get there — going through them in order makes the most sense.`,
    keyPoints: [
      "Every worksheet from the program collected in one place for easy printing.",
      "Tracking sheets work best when they are visible — fridge, clipboard, closet door.",
      "Family-facing handouts make it easier to have the harder conversations.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },
  {
    slug: "appendix-b-resources",
    title: "Appendix B — Resources & Further Reading",
    subtitle: "Trusted books, sites, and organizations",
    order: 31,
    planSection: "appendix_b",
    durationMin: null,
    videoEmbedUrl: null,
    body: `## Trusted resources for further reading

The materials below are sources we trust and return to. They are not affiliate links; we do not earn anything from any of them.

### National organizations

- **National Council on Aging — Falls Free CheckUp.** A free 12-question online screening that mirrors the assessment used in Module 1.
- **CDC STEADI Initiative** (Stopping Elderly Accidents, Deaths & Injuries). The clinical toolkit that primary-care doctors use. The patient-facing brochures are excellent.
- **National Institute on Aging.** Their fall prevention page is plainspoken and accurate.
- **American Geriatrics Society.** The professional society's HealthInAging.org site has well-edited articles on medications, exercise, and home safety.

### Books

- *Stronger After 60* — a practical, encouraging book on resistance training in later life.
- *Tai Chi for Beginners* (Dr. Paul Lam) — the most widely studied Tai Chi program for fall prevention.
- *Better Balance for Life* — an eight-week balance program that aligns closely with Module 2.

### Videos and classes (outside this program)

- **Tai Chi: Moving for Better Balance** — community classes are offered through many local Area Agencies on Aging at low or no cost.
- **A Matter of Balance** — an eight-week group program developed at Boston University, widely available through senior centers.
- **Otago Exercise Program** — the strength-and-balance program with the strongest evidence base for at-home use. A physical therapist can teach it in 4–6 sessions.

### Finding local help

- **Area Agency on Aging.** Every county has one. They are an underused gateway to home modification grants, transportation, exercise classes, and caregiver support. Call 1-800-677-1116 to find yours.
- **Eldercare Locator.** The companion website to the number above.
- **Your state's Aging and Disability Resource Center** — searchable by zip code.

### When you need a professional

- **Physical therapist specializing in geriatrics.** Ask for one with the GCS (Geriatric Clinical Specialist) credential. A few sessions can be transformative.
- **Occupational therapist.** Especially helpful for home safety assessments and adaptive equipment.
- **Geriatric care manager.** A private professional (usually a nurse or social worker) who can coordinate care, especially helpful for families managing care from a distance.

## A final word

Use this program as a foundation, not a ceiling. The more you learn from the sources above and the more you bring back to your live classes and concierge calls, the better the plan will fit your life.`,
    keyPoints: [
      "The CDC STEADI initiative and the NCOA Falls Free CheckUp are the best free starting points.",
      "Your local Area Agency on Aging (1-800-677-1116) is the underused gateway to local help.",
      "A few sessions with a geriatric physical therapist can be transformative.",
      "Tai Chi and the Otago program have the strongest evidence base of any outside programs.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },
];

function daysFromNow(d: number, hour = 10): Date {
  const x = new Date();
  x.setDate(x.getDate() + d);
  x.setHours(hour, 0, 0, 0);
  return x;
}

const SESSIONS = [
  {
    kind: "class",
    title: "Live Balance Class with Dr. Hennessy",
    description:
      "A guided 45-minute session of seated and standing balance work. Suitable for all levels. Camera optional.",
    startsAt: daysFromNow(3, 10),
    durationMin: 45,
    host: "Dr. Anna Hennessy, DPT",
    joinUrl: "stub://zoom/balance-class",
  },
  {
    kind: "qa",
    title: "Members Q&A — Medications and Dizziness",
    description:
      "Bring your medication list. Bring your questions. Pharmacist Tom Reyes will join us for the full hour.",
    startsAt: daysFromNow(6, 13),
    durationMin: 60,
    host: "Tom Reyes, PharmD",
    joinUrl: "stub://zoom/qa-meds",
  },
  {
    kind: "class",
    title: "Home Walkthrough — What to Look For",
    description:
      "A camera-on session where we walk through a real apartment together and spot hazards in real time.",
    startsAt: daysFromNow(10, 11),
    durationMin: 45,
    host: "Marian Holloway, RN",
    joinUrl: "stub://zoom/home-walkthrough",
  },
];

const LIBRARY = [
  {
    title: "Recording — Last Month's Balance Class",
    kind: "recording",
    summary:
      "If you missed the live session in April, the full recording is here. Skip ahead with chapter markers.",
    publishedAt: daysFromNow(-12, 10),
    durationMin: 47,
  },
  {
    title: "Article — Why Bifocals Cause Falls (and What to Do)",
    kind: "article",
    summary:
      "A short, practical piece on how progressive lenses distort your view of stairs, and the simple two-glasses trick that helps.",
    publishedAt: daysFromNow(-21, 9),
    durationMin: 6,
  },
  {
    title: "Interview — A Conversation with Dr. Steven Wolf",
    kind: "interview",
    summary:
      "Dr. Wolf, one of the country's leading researchers on Tai Chi for fall prevention, joins us for a long-form conversation about what actually works.",
    publishedAt: daysFromNow(-34, 14),
    durationMin: 38,
  },
];

const SEED_MEMBERS = [
  { email: "evelyn.harper@example.com", name: "Evelyn Harper", tier: "subscription" },
  { email: "raymond.osei@example.com", name: "Raymond Osei", tier: "concierge" },
  { email: "barbara.kim@example.com", name: "Barbara Kim", tier: "one_time" },
  { email: "joseph.delgado@example.com", name: "Joseph Delgado", tier: "subscription" },
  { email: "marion.fitzgerald@example.com", name: "Marion Fitzgerald", tier: "guest" },
  { email: "admin@fallpreventionplan.com", name: "Admin Demo", tier: "admin" },
];

async function main() {
  console.log("Seeding modules...");
  for (const m of MODULES) {
    await db
      .insert(modulesTable)
      .values(m as never)
      .onConflictDoUpdate({
        target: modulesTable.slug,
        set: {
          title: m.title,
          subtitle: m.subtitle,
          order: m.order,
          planSection: m.planSection,
          durationMin: m.durationMin,
          videoEmbedUrl: m.videoEmbedUrl ?? null,
          body: m.body,
          keyPoints: m.keyPoints,
          comingSoon: m.comingSoon,
          freeTier: m.freeTier,
          printable: m.printable,
        },
      });
  }

  console.log("Seeding live sessions...");
  for (const s of SESSIONS) {
    await db.insert(liveSessionsTable).values(s as never);
  }

  console.log("Seeding library items...");
  for (const li of LIBRARY) {
    await db.insert(libraryItemsTable).values(li as never);
  }

  console.log("Seeding demo members...");
  for (const member of SEED_MEMBERS) {
    await db
      .insert(usersTable)
      .values(member as never)
      .onConflictDoNothing();
  }

  console.log("Seeding sample invoices and concierge data...");
  const allUsers = await db.select().from(usersTable);
  for (const u of allUsers) {
    if (u.tier === "one_time") {
      await db.insert(invoicesTable).values({
        userId: u.id,
        description: "Lifetime access — Fall Prevention Plan",
        amountCents: 5000,
        paidAt: daysFromNow(-40, 9),
      });
    } else if (u.tier === "subscription") {
      await db.insert(invoicesTable).values({
        userId: u.id,
        description: "Monthly Membership",
        amountCents: 1900,
        paidAt: daysFromNow(-30, 9),
      });
      await db.insert(invoicesTable).values({
        userId: u.id,
        description: "Monthly Membership",
        amountCents: 1900,
        paidAt: daysFromNow(-60, 9),
      });
    } else if (u.tier === "concierge") {
      await db.insert(invoicesTable).values({
        userId: u.id,
        description: "Concierge Program — monthly",
        amountCents: 29900,
        paidAt: daysFromNow(-15, 9),
      });
      await db.insert(conciergeCheckInsTable).values({
        userId: u.id,
        fromName: "Marian Holloway, RN",
        message:
          "Checking in after our home walkthrough — how did installing the bathroom grab bar go? Let me know if you'd like help finding a handyman.",
      });
      await db.insert(conciergeNotesTable).values({
        userId: u.id,
        authorName: "Marian Holloway, RN",
        body: "Completed initial intake call. Member's daughter joined. Identified bathroom and bedside lighting as top priorities.",
      });
      await db.insert(conciergeNotesTable).values({
        userId: u.id,
        authorName: "Marian Holloway, RN",
        body: "Scheduled medication review with Tom Reyes for next week.",
      });
    }
  }

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
