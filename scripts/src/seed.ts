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

// ---------------------------------------------------------------------------
// CONTENT SOURCE OF TRUTH
//
// Every module below uses Dr. Geoff Angell's verbatim copy from
// ../FPP-CONTENT-REFERENCE.md (assembled 1:1 from his Word docs). His
// "Thoughts/Ideas" notes in those docs are treated as build instructions:
//   - videoEmbedUrl "placeholder:vimeo:<label>" marks a video slot he asked for
//     (rendered as a labeled "Video coming soon" box until footage exists).
//   - Inline `![<the image he described>]()` marks an image slot he asked for
//     (rendered as a labeled "Image coming soon" box until artwork exists).
//   - Tables and forms (medication list, nutrition tables) are real GFM tables.
//
// Section ordering is data-driven via `order` + `planSection`:
//   intro -> overview -> assessment -> ten_point -> fall_response
//        -> appendix_a -> appendix_b
//
// Note on tiers (business model from the brief, not Geoff's docs): the
// Introduction, Overview, and Fall Self-Assessment are free previews
// (freeTier: true); the paid program is gated.
// Editorial note: only unambiguous spelling typos in the source were corrected
// (e.g. "soul" -> "sole"); no clinical content, numbers, or wording was changed.
// ---------------------------------------------------------------------------

const MODULES = [
  // ===== INTRODUCTION =====
  {
    slug: "introduction",
    title: "Introduction",
    subtitle: "Why falls happen — and why most are preventable",
    order: 1,
    planSection: "intro",
    durationMin: null,
    videoEmbedUrl: null,
    body: `## Introduction

Falling is one of the greatest risks faced by older adults today. They can lead to diminished balance confidence, decreased participation in daily activity, nursing home placement, serious injury and even death. Sadly, falls are alarmingly common and frequently hazardous — CDC statistics show that they are the leading cause of injury and injury-related death among seniors in the United States, with roughly 14 million falls, over 5 million injuries, and 34,000 deaths reported annually. Needless to say, falling is a very serious problem and these statistics could make one question if anything can actually be done to prevent them. Fortunately, the answer is a resounding YES! Falls are treatable. They don't have to be an inevitable part of aging. Research shows that most falls are preventable and fall risk can be significantly reduced. How is this accomplished? Studies indicate that implementing a multifaceted strategy that combines targeted fall-prevention techniques with balance focused strengthening exercises and a well-designed balance program is the most effective way to prevent falls.

## Getting Started

The Fall Prevention Plan was created for this purpose. It is the answer to increased fall risk. It is a simple, but thorough guide to create a personalized fall prevention strategy that incorporates targeted fall reduction techniques, strengthening exercises, and a personalized balance program. This plan is your roadmap to a safer life. It empowers you to significantly lower your chance of falling by helping to pinpoint key risk factors and then outlining the most effective strategies to address them.

To make the most of the program, review each section carefully, reflecting on how the recommendations apply to you, and then commit to integrating them into your daily routine. By doing so, you can enjoy a safer, more confident, and independent life.`,
    keyPoints: [
      "Most falls are preventable — falls are treatable and not an inevitable part of aging.",
      "The most effective approach combines targeted fall-prevention techniques, strengthening exercises, and a well-designed balance program.",
      "Review each section, reflect on how it applies to you, and build the recommendations into your daily routine.",
    ],
    comingSoon: false,
    freeTier: true,
    printable: true,
  },

  // ===== OVERVIEW OF BALANCE AND FALLS =====
  {
    slug: "overview-balance-and-falls",
    title: "An Overview of Balance and Falls",
    subtitle: "What a fall is, what balance is, and how your body creates it",
    order: 2,
    planSection: "overview",
    durationMin: null,
    videoEmbedUrl: null,
    body: `Before starting your journey to reduce fall risk, it's helpful to have a basic understanding of balance and falls — what they are, how balance is created, and what causes falls to occur. Once knowledgeable of these subjects, you are in a good position to consider what specific factors increase your risk of falling and then to determine how likely you are to suffer a fall. Let's begin looking at this now.

## What is a Fall?

A fall is an unexpected event where the body comes to rest on the ground, with or without injury.

![Someone falling — can be cartoonish]()

## What is Balance?

Balance is the act of maintaining physical stability and the body's primary defense against falling.

![Someone balancing — can be a cartoon, e.g. a tightrope walker]()

## How is balance created?

Balance is created through a complex sequence of events involving multiple body systems working together to create a stable body position. The process is automatic, subconscious, nearly instantaneous, and looks something like this:

The body's sensory systems gather data about its position and movement relative to the surrounding environment. This information is sent to the brain and spinal cord where it is analyzed and a plan to maintain balance is created. The newly formulated instructions are then sent to the muscles to carry out the movements used to maintain a stable body position and avoid falling.

![Sequence schematic: stimulus touches the body → message travels to the spinal cord and/or brain → a plan is created → message travels back to the body → the body carries out a response movement]()`,
    keyPoints: [
      "A fall is an unexpected event where the body comes to rest on the ground, with or without injury.",
      "Balance is the act of maintaining physical stability and the body's primary defense against falling.",
      "Balance is created automatically: the senses gather data, the brain and spinal cord form a plan, and the muscles carry it out.",
    ],
    comingSoon: false,
    freeTier: true,
    printable: true,
  },

  // ===== FALL SELF-ASSESSMENT =====
  {
    slug: "fall-self-assessment",
    title: "Fall Self-Assessment",
    subtitle: "What causes falls, and how likely you are to fall",
    order: 3,
    planSection: "assessment",
    durationMin: null,
    videoEmbedUrl: "placeholder:vimeo:Demonstration of how to perform the TUG (Timed Up and Go) Test",
    body: `## What causes falls?

Falls happen when the body becomes unsteady and any attempt it makes to regain a balanced position fails. The body can become unsteady and fall for a variety of reasons. The most common causes include:

- Muscle or joint stiffness
- Poor endurance
- Muscle weakness
- Reduced sensation
- Poor balance
- Dizziness
- Altered posture
- Low vision
- Pain
- Impulsive movements
- Abnormal walking patterns
- Decreased cognition
- Limited safety awareness
- Low acceptance of disability
- Reduced short-term memory
- Incontinence
- Polypharmacy (multiple medications)
- Adverse medication side effects
- Poor fluid intake
- Inadequate nutrition
- Poorly fitting footwear
- Improperly prescribed or fitted mobility devices
- Assistive device non-use
- Cluttered home environment
- Poor lighting
- Unsafe/unlevel terrain
- Lack of appropriate medical equipment in high-risk areas (e.g., shower, toilet, etc…)

![A banana peel, or a picture of multiple different fall catalysts]()

**A key point.** As you can now see, there are many factors that can cause unsteadiness, however understanding what causes your own unsteadiness is the key to improving your safety. This pinpoints the most likely reason you might fall and therefore begins creating the framework for an effective fall prevention plan.

**Question:** Did you recognize anything in the list above that might cause you to become unsteady and fall?

## Determining Fall Risk

Knowing how likely you are to fall is also very important to understand when creating a fall prevention plan. This information helps to select the strategies that will be most effective in reducing your chance of falling.

A tool that can be used to assess fall risk is the Timed Up and Go Test, or TUG Test. It is performed by measuring how long it takes to stand from a chair, walk ten feet, turn around, walk back, and sit down. The results of the test are then compared to standard data to make an estimate of fall risk.

**To perform the TUG Test:**

1. Place a sturdy chair in an open area.
2. Mark a line ten feet from the chair.
3. Time yourself as you stand, walk to the line at a normal pace, turn, walk back, and sit down.

**To score the TUG Test and estimate fall risk:**

Compare the time it took to complete the test to the following standard data to provide an estimate of fall risk:

| Time to Complete Test | Fall Risk |
| --- | --- |
| Less than 10 seconds | Low fall risk |
| 10–14.9 seconds | Moderate fall risk |
| Greater than 15 seconds | High fall risk |

Go ahead and try the TUG Test. How did you do?

**[Take your interactive Fall Self-Assessment →](/assessment)** — we'll time the TUG Test with you, walk through the risk-factor list above, and estimate your fall risk.`,
    keyPoints: [
      "Falls happen when the body becomes unsteady and cannot regain a balanced position.",
      "Understanding the cause of your own unsteadiness is the key to improving your safety.",
      "The Timed Up and Go (TUG) Test estimates fall risk: under 10 seconds is low, 10–14.9 is moderate, over 15 seconds is high.",
    ],
    comingSoon: false,
    freeTier: true,
    printable: true,
  },

  // ===== CREATING A PERSONALIZED FALL PREVENTION PLAN (intro) =====
  {
    slug: "personalized-plan-intro",
    title: "Creating a Personalized Fall Prevention Plan",
    subtitle: "The 10 areas your plan will address",
    order: 10,
    planSection: "ten_point",
    durationMin: null,
    videoEmbedUrl: null,
    body: `Now that you have a basic understanding of balance and falls, have identified your fall risk factors, and estimated how likely you are to fall, you're ready to tackle the problem of increased fall risk by creating a personalized Fall Prevention Plan.

To do this, you will be introduced to the 10 most common areas related to falls and the best strategies known to prevent them. The areas to be discussed include:

1. Mindset
2. Footwear
3. Vision
4. Medication
5. Nutrition and Hydration
6. Posture
7. Home Safety
8. Assistive Device Selection
9. Strength
10. Balance

As you explore the 10 Step Plan to reduce the risk of falls, take time to understand each problem area and the suggested solutions. Then determine the fall prevention strategies that would help you the most and begin working to incorporate them into your daily routine.

The Fall Prevention Plan isn't a one-time task, instead it's a guide for a safety-focused lifestyle. Stay consistent with its recommendations and you'll significantly reduce your risk of falls!`,
    keyPoints: [
      "Your plan addresses the 10 most common areas related to falls: mindset, footwear, vision, medication, nutrition and hydration, posture, home safety, assistive devices, strength, and balance.",
      "Understand each problem area, then choose the strategies that would help you the most and build them into your routine.",
      "The Fall Prevention Plan is a safety-focused lifestyle, not a one-time task — consistency is what reduces your risk.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },

  // ----- Step 1: Mindset -----
  {
    slug: "step-1-mindset",
    title: "Step 1: Mindset",
    subtitle: "Choosing to be safe",
    order: 11,
    planSection: "ten_point",
    durationMin: null,
    videoEmbedUrl: null,
    body: `The first step in the Fall Prevention Plan is adopting a safety-first mindset, that is, making a conscious decision to prioritize not falling. In essence, "choosing to be safe."

How is this accomplished?

1. Acknowledge your increased fall risk.
2. Stay alert to factors that could worsen your risk of falling.
3. Commit to using strategies that lower your chances of falling.

Being intentional about safety is key to preventing falls and the foundation of an effective Fall Prevention Plan.

**To decrease your risk of falls, choose to be safe!**

![Someone deep in thought, or the "Thinker" sculpture]()`,
    keyPoints: [
      "A safety-first mindset means making a conscious decision to prioritize not falling.",
      "Acknowledge your risk, stay alert to what worsens it, and commit to strategies that lower it.",
      "To decrease your risk of falls, choose to be safe.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },

  // ----- Step 2: Footwear -----
  {
    slug: "step-2-footwear",
    title: "Step 2: Footwear",
    subtitle: "Choosing the right shoes",
    order: 12,
    planSection: "ten_point",
    durationMin: null,
    videoEmbedUrl: null,
    body: `The second step in the Fall Prevention Plan is choosing the right footwear. Proper shoes play a key role in reducing fall risk and should be selected with that goal in mind. Shoes should enhance balance and minimize the chance of falling.

![Illustration or cartoon of a shoe]()

Brand doesn't matter, instead wear shoes that are comfortable, fit properly, have good arch support, a flat or low-pitched sole, a closed heel, a non-aggressive tread, and if able, the ability to be fastened securely.

**Footwear Recommendation:** to reduce fall risk, stick to the following shoe styles:

1. Walking shoe
2. Properly fitted slip-on shoe
3. Lace up dress shoe
4. Sandal with fastening straps at the toe and heel

![The recommended shoe styles]()

One last tip: stay away from high heels, slip on shoes that lack a closed heel, sandals without a back strap, or running shoes.`,
    keyPoints: [
      "Choose shoes that are comfortable and fit properly, with good arch support, a flat or low-pitched sole, a closed heel, a non-aggressive tread, and a secure fastening.",
      "Recommended styles: a walking shoe, a properly fitted slip-on, a lace-up dress shoe, or a sandal with straps at the toe and heel.",
      "Stay away from high heels, slip-ons without a closed heel, sandals without a back strap, and running shoes.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },

  // ----- Step 3: Vision -----
  {
    slug: "step-3-vision",
    title: "Step 3: Vision",
    subtitle: "Managing your vision",
    order: 13,
    planSection: "ten_point",
    durationMin: null,
    videoEmbedUrl: null,
    body: `The third step in the Fall Prevention Plan is properly managing your vision. Clear vision helps you navigate your surroundings and is therefore vital for maintaining balance. Unfortunately, visual acuity often deteriorates with age, and can, if left unaddressed, lead to increased fall risk.

To reduce fall risk, prioritize eye health with these 5 steps:

1. Get regular eye exams.
2. Wear your prescribed eyewear.
3. Follow your doctor's advice on vision medications and treatments.
4. Acknowledge any visual impairments and adjust your routine or environment as needed (ensure adequate lighting throughout your home, don't walk outside or drive at night, and mark stair edges with contrasting tape, etc...).
5. If multifocal lens glasses (bifocals, trifocals, or progressives) cause your vision to be distorted, consider having multiple sets of glasses. One pair for distance vision needs and another pair for close-up tasks.

![An eye chart, glasses, and a pill bottle]()`,
    keyPoints: [
      "Get regular eye exams and wear your prescribed eyewear.",
      "Follow your doctor's advice on vision medications and treatments.",
      "Adjust for visual impairments: improve home lighting, avoid walking or driving at night, and mark stair edges with contrasting tape.",
      "If multifocal lenses distort your vision, consider separate pairs for distance and close-up tasks.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },

  // ----- Step 4: Medication -----
  {
    slug: "step-4-medication",
    title: "Step 4: Medication and Balance",
    subtitle: "Managing your medications",
    order: 14,
    planSection: "ten_point",
    durationMin: null,
    videoEmbedUrl: null,
    body: `The fourth step in the Fall Prevention Plan is properly managing your medications. Medications are designed to improve health, but sadly some have negative side effects or interactions with other medications that increase the risk of falls. Unfortunately, this phenomenon occurs more frequently in the older adult population where taking multiple medications and slowed drug metabolism is common.

To minimize your risk of falling due to a medication, follow this action plan:

1. Take all prescription drugs, over-the-counter medications, vitamins, and supplements only as directed.
2. Keep an updated list of all prescription drugs, over-the-counter medications, vitamins, and supplements, noting dosages and frequency taken.
3. Share this list with every doctor at each appointment.
4. Inform your primary care physician about any medication changes made by specialists.
5. Regularly review your medication list with your primary care physician and pharmacist to identify harmful interactions, duplicates, or unnecessary prescriptions.
6. Discuss fall risk concerns with your doctors and request that medications with minimal impact on balance be considered. If a medication increases fall risk and no alternatives exist, ask for strategies to reduce its effects.

![Medicine bottles, pills, a patient in conversation with a physician, and a person talking with their pharmacist]()

## My Medication List

Keep an up-to-date list of everything you take. Use the **Download Printable Guide** button to print this form, then bring it to every appointment and to your medication review with your pharmacist.

| Medication | Dosage | Frequency | Time(s) Taken | Prescribing Provider |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |`,
    keyPoints: [
      "Take all prescriptions, over-the-counter medications, vitamins, and supplements only as directed.",
      "Keep an updated list of everything you take, with dosages and frequency, and share it with every doctor at each appointment.",
      "Regularly review your list with your primary care physician and pharmacist to catch harmful interactions, duplicates, or unnecessary prescriptions.",
      "Ask your doctors about medications with minimal impact on balance — or strategies to reduce the effects of those that raise fall risk.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },

  // ----- Step 5: Nutrition and Hydration -----
  {
    slug: "step-5-nutrition-hydration",
    title: "Step 5: Nutrition and Hydration",
    subtitle: "Eating and drinking to stay steady",
    order: 15,
    planSection: "ten_point",
    durationMin: null,
    videoEmbedUrl: null,
    body: `The fifth step in the Fall Prevention Plan is consuming a diet that minimizes your chances of falling. Maintaining proper nutrition and hydration plays a key role in reducing your risk of falls. In fact, poor dietary intake is actually the leading cause of serious falls, those requiring hospital admission, for senior adults.

A diet that consists of the proper amount of calories and fluid will help to maximize your strength, mental clarity, balance, and fall avoidance, while a diet lacking an adequate amount of calories and fluid can lead to weakness, confusion, unsteadiness, and ultimately increased fall risk.

The types of nutrients your diet consists of is also very important. A diet rich in protein will help create a lean body with higher levels of energy, greater amounts of muscle, and that is generally better able to manage unsteadiness and avoid falls, whereas a diet rich in carbohydrates and sugar will create a body with higher percentages of fat, lower amounts of energy, smaller amounts of muscle, and that is generally more susceptible to unsteadiness and falling.

To minimize your chances of falling, maintaining a good diet is key. Below are the recommended dietary guidelines to help you achieve this:

![A health-conscious diet — fresh, nutritious food]()

## Recommended Daily Calorie Intake for Senior Adults

**Male**

| Activity Level | Daily Calorie Need |
| --- | --- |
| Sedentary Lifestyle | 2,000–2,200 calories a day |
| Moderately Active Lifestyle | 2,200–2,400 calories a day |
| Highly Active Lifestyle | 2,400–2,800 calories a day |

**Female**

| Activity Level | Daily Calorie Need |
| --- | --- |
| Sedentary Lifestyle | 1,600 calories a day |
| Moderately Active Lifestyle | 1,800 calories a day |
| Highly Active Lifestyle | 2,000–2,200 calories a day |

If you want an exact amount, here's a link to a calorie calculator: [Calorie Calculator](https://www.gigacalculator.com/calculators/calorie-calculator.php)

\\*All diet changes should be discussed with your physician.

## Recommended Daily Fluid Intake for Senior Adults

| Body Weight | Fluid Intake Per Day |
| --- | --- |
| 90 lbs | 30–45 ounces |
| 100 lbs | 33–50 ounces |
| 110 lbs | 36–55 ounces |
| 120 lbs | 40–60 ounces |
| 130 lbs | 43–65 ounces |
| 140 lbs | 46–70 ounces |
| 150 lbs | 50–75 ounces |
| 160 lbs | 53–80 ounces |
| 170 lbs | 56–85 ounces |
| 180 lbs | 60–90 ounces |
| 190 lbs | 62–95 ounces |
| 200 lbs | 66–100 ounces |
| 210 lbs | 69–105 ounces |
| 220 lbs | 73–110 ounces |
| 230 lbs | 76–115 ounces |
| 240 lbs | 79–120 ounces |
| 250 lbs | 83–125 ounces |

\\*Higher levels indicated during periods of increased activity or temperature.
\\*\\*All diet changes should be discussed with your physician.

If you want an exact amount, here's a link to a fluid intake calculator: [Water Intake Calculator](https://www.gigacalculator.com/calculators/water-intake-calculator.php)

## Recommended Daily Protein Intake for Senior Adults

| Body Weight | Protein Intake Per Day |
| --- | --- |
| 90 lbs | 49–65 grams |
| 100 lbs | 54–72 grams |
| 110 lbs | 59–79 grams |
| 120 lbs | 65–86 grams |
| 130 lbs | 70–94 grams |
| 140 lbs | 76–101 grams |
| 150 lbs | 81–108 grams |
| 160 lbs | 86–115 grams |
| 170 lbs | 92–122 grams |
| 180 lbs | 97–130 grams |
| 190 lbs | 103–137 grams |
| 200 lbs | 108–144 grams |
| 210 lbs | 113–151 grams |
| 220 lbs | 119–159 grams |
| 230 lbs | 124–166 grams |
| 240 lbs | 130–173 grams |
| 250 lbs | 135–180 grams |

\\*Higher levels indicated when attempting to add muscle.
\\*\\*All diet changes should be discussed with your physician.

If you want an exact amount, here's a link to a protein intake calculator: [Protein Calculator](https://www.calculator.net/protein-calculator.html)

## A Special Note on Protein

When it comes to fall prevention, protein is the super nutrient. It serves a dual function of fueling the body to perform daily activities and as the building block of muscle, one of the body's primary reducers of fall risk. To maintain or build muscle, senior adults should aim to consume between 0.54–0.72 grams of protein per pound of body weight per day.

The primary protein sources for the body are meat, poultry, fish, dairy, beans, lentils, nuts, and seeds. Below is a list of common foods and their protein content to help you determine if your current diet is adequate.

### Protein Content Per Food Group

| Food Type | Serving Size | Protein Content |
| --- | --- | --- |
| Beef, Chicken, Turkey, Pork, Lamb | 6 oz | 42 grams |
| Fish, Seafood | 6 oz | 36–42 grams |
| Eggs | 1 egg | 6 grams |
| Lentils | ½ cup | 9 grams |
| Beans | ½ cup | 7–8 grams |
| Peanut butter | 2 Tbsp | 7 grams |
| Nuts | 1 oz (¼ cup) | 4–6 grams |
| Milk | 8 oz | 8 grams |
| Yogurt, fat free, light | 6 oz | 5 grams |
| Greek yogurt | 5 oz | 12–18 grams |
| Cheese | 1 oz | 7 grams |
| Cottage cheese | ½ cup | 14 grams |

If your diet lacks the appropriate amount of protein, the first step should be to try to increase your intake of natural protein sources at each meal. If that isn't enough or you aren't able, consider adding a protein supplement to your regular diet to meet the recommended daily protein intake levels.

Protein supplements come in many different forms, including: powder, pre-made shakes, juices, snack bars, and cookies. Supplements providing the highest amount of protein and the lowest amount of added sugar are best — e.g. 30 grams of protein, 0 grams of added sugar. If you are diabetic, use a protein supplement that provides glycemic control. Below are examples with links to purchase protein supplements on Amazon:

- Protein Powder: <https://a.co/d/00IAHd68>
- Protein Shakes: <https://a.co/d/094NTmFQ>
- Protein Juices: <https://a.co/d/07z47Gfy>
- Protein Bars: <https://a.co/d/0713jM4I>
- Protein Cookies: <https://a.co/d/0hVAgNc3>

If you are serious about avoiding falls, having a diet rich in protein is critical.

\\*All diet changes should be discussed with your physician.`,
    keyPoints: [
      "Poor dietary intake is the leading cause of serious falls (those requiring hospital admission) in senior adults.",
      "Adequate calories and fluid support strength, mental clarity, and balance; too little leads to weakness, confusion, and unsteadiness.",
      "Protein is the 'super nutrient' for fall prevention — aim for 0.54–0.72 grams per pound of body weight per day, from food first and a supplement if needed.",
      "Use the calorie, fluid, and protein tables (and the linked calculators) to check whether your diet is adequate. All diet changes should be discussed with your physician.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },

  // ----- Step 6: Posture -----
  {
    slug: "step-6-posture",
    title: "Step 6: Posture",
    subtitle: "Holding your body for better balance",
    order: 16,
    planSection: "ten_point",
    durationMin: null,
    videoEmbedUrl: "placeholder:vimeo:The three posture recommendations performed in sequence, and the postural stretching program",
    body: `The sixth step in the Fall Prevention Plan is maintaining good posture. Posture, or how you hold your body, is key to having good balance. Unfortunately, posture often deteriorates with age, and can, if left unaddressed, lead to increased fall risk. The most common posture changes seen in older adults include a forward, backward, and/or lateral leaning trunk, rounded upper back, protruding neck and head, and bent knees.

![Examples of abnormal posture]()

To improve posture and reduce fall risk, focus on these strategies:

1. Stand tall with an upright trunk, shoulders and head back, and knees straight.
2. While walking, fix your gaze twenty to thirty feet ahead of body unless navigating a known trip hazard, that is don't look straight down at the ground.
3. Take steps that extend in front of the body, landing heel-first.
4. Perform postural stretches 2-3 times per week targeting the chest, anterior hip, and hamstrings.`,
    keyPoints: [
      "Stand tall: upright trunk, shoulders and head back, knees straight.",
      "While walking, look 20–30 feet ahead rather than straight down (except to navigate a known trip hazard).",
      "Take steps that extend in front of the body, landing heel-first.",
      "Perform postural stretches 2–3 times per week for the chest, anterior hip, and hamstrings.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },

  // ----- Step 7: Creating a Safe Home Environment -----
  {
    slug: "step-7-safe-home-environment",
    title: "Step 7: Creating a Safe Home Environment",
    subtitle: "Simple changes that make home safer",
    order: 17,
    planSection: "ten_point",
    durationMin: null,
    videoEmbedUrl: null,
    body: `The seventh step in the Fall Prevention Plan is to create a safe home environment. Most falls happen in the comfort of one's own home. Despite the majority of people feeling safest there, homes are actually the most likely place for falls to occur. Fortunately, there is a solution. Research shows that implementing simple home safety modifications can significantly reduce the chance of falling there.

Here are proven ways to make your home safer:

- Keep your home clean and clutter-free.
- Arrange furniture to create clear and wide walking paths.
- Remove throw rugs or secure their edges to the floor.
- Organize closets and cabinets to avoid excessive reaching or bending.
- Ensure adequate lighting indoors and on outdoor walkways.
- Install nightlights in frequently used areas.
- Use chairs eighteen to twenty-two inches tall with backs and arms.
- In the bathroom, install a raised toilet seat with arm rests, grab bars at the entrance of and in the tub or shower, and non-slip strips on the tub or shower floor. If your balance is moderate to significantly compromised, consider a shower chair with a back and arms. If stepping over the tub wall is difficult, consider using a tub bench. See the Appendix of Home Safety Modifications and Equipment for equipment description and recommendations.
- Set your bed height between eighteen to twenty-three inches (when sat on) and add a bed rail if getting in and out is challenging.
- Create a designated dressing area with a sturdy chair and solid surface for support.
- Ensure stairs are well-lit, have handrails on one or both sides, and feature marked edges for visibility.

![Medical equipment and an orderly home environment — wide walkways and organized shelves]()

For a thorough explanation of home modifications and durable medical equipment that can be used to improve the safety of the home environment and assistance with ordering, please refer to the section titled **Appendix of Home Safety Modifications and Equipment**.`,
    keyPoints: [
      "Most falls happen at home — simple modifications significantly reduce the risk.",
      "Keep paths clear and clutter-free, remove or secure throw rugs, and ensure good lighting and nightlights.",
      "Use chairs 18–22 inches tall with backs and arms, and set bed height 18–23 inches (when sat on).",
      "Make the bathroom safe with a raised toilet seat with arm rests, grab bars, and non-slip strips — see Appendix B for equipment and ordering.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },

  // ----- Step 8: Choosing the Right Assistive Device -----
  {
    slug: "step-8-assistive-devices",
    title: "Step 8: Choosing the Right Assistive Device",
    subtitle: "Canes, walkers, and wheelchairs",
    order: 18,
    planSection: "ten_point",
    durationMin: null,
    videoEmbedUrl: "placeholder:vimeo:How to fit a walker and a cane",
    body: `The eighth step in the Fall Prevention Plan is selecting the appropriate assistive device. Assistive devices are very effective for improving balance and safety, and are generally considered to be one of the best fall prevention strategies available. They also boost strength, confidence, activity level, and overall quality of life and are therefore strongly recommended if a person has an increased risk of falls.

There are four main types of assistive devices: Canes, 2 Wheel Rolling Walkers, 4 Wheel Rolling Walkers, and Wheelchairs. Each model provides a different level of support and has multiple variations designed to accommodate a wide range of body sizes and needs.

![The four general types of assistive devices, and people using them independently]()

To minimize fall risk, it is imperative to choose the right assistive device. Follow this two step plan to determine which assistive device is best for you:

**Step 1: Identify the appropriate assistive device type.**

- Canes: Suitable for people with mild balance issues.
- 4 wheel rolling walkers: Ideal for people with mild to moderate balance issues or low endurance.
- 2 wheel rolling walkers: Best for people with moderate+ to significant balance challenges.
- Wheelchairs: Designed for people with major balance deficits.

**Step 2: If necessary, select a variation from the standard assistive device model that accommodates for any specific body characteristic or use case need.**

- Junior size: For shorter individuals.
- Tall size: For taller individuals.
- Bariatric size: For those with higher weight.
- Lightweight: For frequent travelers.
- Super Light: For frequent travelers with limited strength.
- Large-wheel: For rough terrain or a smoother ride.

### Special Note: Assistive Device Fitting

Properly fitting an assistive device is essential to maximizing safety and efficiency with use. To properly fit a cane or rolling walker, follow this two-step process:

1. Stand in your normal posture with arms hanging at your side.
2. Adjust the height of the cane or walker handle at or just above the wrist.

If you need help choosing which assistive device is best for you, please refer to the **Appendix of Assistive Devices**.`,
    keyPoints: [
      "Assistive devices are one of the best fall-prevention strategies and are strongly recommended for anyone at increased risk.",
      "Match the device to your balance: cane (mild), 4-wheel walker (mild–moderate or low endurance), 2-wheel walker (moderate+ to significant), wheelchair (major deficits).",
      "Choose a variation (junior, tall, bariatric, lightweight, super light, large-wheel) for your body and needs.",
      "Fit a cane or walker by standing in normal posture with arms at your sides and setting the handle at or just above the wrist. See Appendix A for help choosing.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },

  // ----- Step 9: Strength Training -----
  {
    slug: "step-9-strength-training",
    title: "Step 9: Strength Training for Fall Prevention",
    subtitle: "Three home programs and a fitness-center program",
    order: 19,
    planSection: "ten_point",
    durationMin: null,
    videoEmbedUrl: "placeholder:vimeo:Each complete Home Exercise Program (Levels 1, 2, and 3) performed start to finish",
    body: `The ninth step in the Fall Prevention Plan is to be physically strong. Strength is critical for preventing falls. It forms the foundation for good balance and is directly correlated to fall risk. Maintaining strength through the aging process however is not a given, it requires effort, and without regular performance of activities that build strength, muscles will weaken over time, and fall risk will increase. Performing Strengthening Exercises is the solution. They build muscle, lower fall risk, and are therefore a key component of a successful Fall Prevention Plan. Fortunately, strengthening exercise programs designed to reduce falls don't have to be elaborate to be effective. Research shows that regular performance of even a few targeted exercises, done to a point of fatigue can build muscle and significantly reduce fall risk. Exercises can be done at home or in a gym, and can even be selected to match your time availability and overall interest level. The key to success with an exercise program is choosing a routine that you'll stick with. It is best to start with a small program, and gradually add more exercises if desired, versus jumping into a large program and possibly quitting before exercise benefits are realized.

**To reduce fall risk, find a balance focused exercise program that works for you and be consistent with it!**

Presented below are 3 Home Exercise Programs and 1 Fitness Center Program specifically designed for fall prevention. They are listed in order of increasing complexity and time required to complete them. Each program has sections that address strength, flexibility, and endurance, and instructions are provided in how to correctly perform each one. Review the programs and select the one that most closely matches your commitment level and time availability.

# Home Exercise Programs for Fall Prevention

## Level 1 Home Exercise Program for Fall Prevention

**Strength: perform 2–3 times per week.**

- **Heel ups:** stand with your feet at shoulder width apart and holding a firm surface for support. Rise up on your toes as high as able, then relax and return to the original position. Repeat to muscle fatigue.
- **Sit-to-stand:** sit on a regular height chair that has a firm seat. Stand to an upright position, then relax and return to the seated position. Use your hands only if needed. Repeat to muscle fatigue.

**Flexibility: perform 2–3 times per week.**

- **Chest Stretch:** sit towards the front of a chair with your head and trunk erect, and your hands clasped behind your back. Pull your shoulders back until a "strong, but comfortable" stretch is felt across the chest. Hold 15 seconds. Perform 2-3 times. This stretch can also be performed in standing, if your balance status allows.

**Endurance: perform 3–5 times per week.**

- Walk on flat indoor or outdoor terrain, using a cane or walker as necessary, targeting a 20–30 minute duration at a moderate intensity, and stopping if needed. Do not use a treadmill. If walking is too difficult, see option 2 below.
- Ride a Recumbent Bike, Stationary Bike, or Nu-Step if you are unable to tolerate walking for at least 10 minutes. Target a duration of 20–30 minutes at a moderate intensity, stopping if needed.

## Level 2 Home Exercise Program for Fall Prevention

**Strength: perform 2–3 times per week.**

- **Heel ups:** stand with your feet at shoulder width apart and holding a firm surface for support. Rise up on your toes as high as able, then relax and return to the original position. Repeat to muscle fatigue.
- **Crunch/Sit-Up:** lie on your back with your hands behind your head, knees bent to 90°, and feet flat on the bed surface. Raise your head and trunk off the bed as high as able, then relax and return to the original position. Repeat to muscle fatigue. Do not perform if you have osteoporosis or osteopenia.
- **Bridges:** lie on your back with your knees bent to 90 degrees, feet flat on the bed and your arms on the bed beside you. Raise your bottom off the bed as high as you can, then relax and return to the original position. Repeat to muscle fatigue. This exercise may not be tolerated if you have spinal stenosis.
- **Clam Shell:** lie on your right side with the left leg resting on top of the right leg, hips bent to 45 degrees, and knees bent to 90 degrees. Lift your left knee up and down as high as you can while keeping your feet together and your body from rolling backwards. Repeat to muscle fatigue, then perform the same exercise on the opposite side of the body. If this exercise is too easy, straighten your legs and lift a straight left leg as high as you are able, keeping the left foot pointed straight forward/rotated slightly inward and your body from rolling backward. Repeat to muscle fatigue, then perform the same exercise on the opposite side of the body.
- **Sit-to-Stand:** sit on a regular height chair that has a firm seat. Stand to an upright position, then relax and return to the seated position. Use your hands only if needed. Repeat to muscle fatigue.

**Flexibility: perform 2–3 times per week.**

- **Hamstring Stretch:** sit towards the front of a chair with your right leg straight in front of the body and your right heel on the ground. Lean forward and extend your right hand toward your right toes until a "strong, but comfortable stretch" is felt in the back of the right thigh. Hold 15 seconds. Repeat on the left. Perform stretch 2–3 times on each leg.
- **Chest Stretch:** sit towards the front of a chair with your head and trunk in an erect posture, and your hands clasped behind your back. Pull your shoulders back until a "strong, but comfortable" stretch is felt across the chest. Hold 15 seconds. Perform stretch 2-3 times. This stretch can also be performed in standing if your balance status allows.

**Endurance: perform 4–5 times per week.**

- Walk on flat indoor or outdoor terrain, using a cane or walker as necessary, targeting a 20–30 minute duration at a moderate intensity, and stopping if needed. Do not use a treadmill. If walking is too difficult, see option 2 below.
- Ride a Recumbent Bike, Stationary Bike, or Nu-Step if you are unable to tolerate walking for at least 10 minutes. Target a duration of 20–30 minutes at a moderate intensity, stopping if needed.

## Level 3 Home Exercise Program for Fall Prevention

**Strength: perform 2–3 times per week.**

- **Heel ups:** stand with your feet at shoulder width apart and holding a firm surface for support. Rise up on your toes as high as able, then relax and return to the original position. Repeat to muscle fatigue.
- **Crunch/Sit-Up:** lie on your back with your hands behind your head, knees bent to 90°, and feet flat on the bed surface. Raise your head and trunk off the bed as high as able, then relax and return to the original position. Repeat to muscle fatigue. Avoid if you have osteoporosis or osteopenia.
- **Bridges:** lie on your back with your knees bent to 90 degrees, feet flat on the bed and your arms on the bed beside you. Raise your bottom off the bed as high as you can, then relax and return to the original position. Repeat to muscle fatigue. This exercise may not be tolerated if you have spinal stenosis.
- **Hip Roll:** lie on your back with your knees bent to 90 degrees, feet flat on the bed, and your arms lying on the bed surface extended away from your body. Rotate your hips side to side as far as able at a good pace. Repeat to muscle fatigue.
- **Clam Shell:** lie on your right side with the left leg resting on top of the right leg, hips bent to 45 degrees, and knees bent to 90 degrees. Lift your left knee up and down as high as you can while keeping your feet together and your body from rolling backwards. Repeat to muscle fatigue, then perform the same exercise on the opposite side of the body. If this exercise is too easy, straighten your legs and lift a straight left leg up and down as high as you are able, keeping the left foot pointed straight forward/rotated slightly inward and your body from rolling backward. Repeat to muscle fatigue, then perform the same exercise on the opposite side of the body.
- **Sit-to-Stand:** sit on a regular height chair that has a firm seat. Stand to a fully upright position, then relax and return to the seated position. Use your hands only if needed. Repeat to muscle fatigue.

**Flexibility: perform stretches 2–3 times per week.**

- **Neck and Trunk Rotation Stretch:** sit with an upright posture on a chair or bed. Twist your head and trunk as far as you can to the right, hold for 15 seconds, then repeat to the left. Perform stretch 2-3 times to each side.
- **Hamstring Stretch:** sit towards the front of a chair with your right leg straightened in front of the body and your right heel on the ground. Lean forward and extend your right hand toward your right toes until a "strong, but comfortable stretch" is felt in the back of the right thigh. Hold 15 seconds. Repeat on the left. Perform stretch 2–3 times on each leg.
- **Chest Stretch:** sit towards the front of a chair with your head and trunk in an upright posture, and your hands clasped behind your back. Pull your shoulders back until a "strong, but comfortable" stretch is felt across the chest. Hold 15 seconds. Perform stretch 2-3 times. If your balance status allows, this stretch can also be performed in standing.
- **Calf Stretch:** stand with feet at shoulder width apart and holding a firm surface. Take a full step backwards with your right foot, press your heel flat against the floor, then gently lean your body forward until a "strong, but comfortable" stretch is felt in the back of the right calf. Hold 15 seconds and then repeat on the left. Perform stretch 2–3 times on each leg.
- **Anterior Hip Stretch:** stand with feet at shoulder width apart and holding a firm surface. Take a full step backwards with your right foot then arch your pelvis and trunk backwards until a "strong, but comfortable" stretch is felt at the front of the right hip. Hold for 15 seconds then repeat on the left. Perform stretch 2–3 times on each leg. Do not perform if you've recently had a total hip replacement or have ever had an anterior approach total hip replacement.

**Endurance: perform 4–5 times per week.**

- Walk on flat indoor or outdoor terrain, using a cane or walker as necessary, targeting a 20–30 minute duration at a moderate intensity, and stopping if needed. Do not use a treadmill. If walking is too difficult, see option 2 below.
- Ride a Recumbent Bike, Stationary Bike, or Nu-Step if you are unable to tolerate walking for at least 10 minutes. Target a duration of 20–30 minutes at a moderate intensity, stopping if needed.

# Fitness Center Exercise Program for Fall Prevention

This section outlines an Exercise Program for Fall Prevention to be completed on exercise machines typically found in a Fitness Center or Gym. If you do not have experience with this type of equipment, it is recommended to work with a trainer for 1-3 sessions to build familiarity with machine set up and use prior to performing the program on your own. Follow the instructions below to create an effective and personalized program.

> 📄 A print-ready handout of this Fitness Center Program is available with the **Download Printable Guide** button — take it to the gym or hand it to a personal trainer.

**Strength — Instructions**

- Set exercise machines to properly fit your body.
- Perform 1 set of each exercise, 2-3 times per week.
- Perform the exercises through full range of motion while using proper form.
- Use resistance levels that result in muscle fatigue at 15 repetitions.
- Stop the exercise if you are no longer able to complete the exercise through the full range of motion using proper form.
- Increase the resistance by 5% when 15 repetitions becomes easy.
- Keep a log of the repetition numbers and resistance levels completed at each session to help guide progression.

\\*More than 1 set of each exercise can be performed if desired, however expect to complete fewer repetitions with each additional exercise set performed.

**Exercises to be performed include:**

- Leg Press
- Hip Adduction
- Hip Abduction
- Knee Extension
- Knee Flexion
- Low Back Extension
- Partial Sit Up on Incline Bench (perform to fatigue)
- Heel Ups (see description above)

**Flexibility: perform stretches 2–3 times per week.**

- **Neck and Trunk Rotation Stretch:** sit with an upright posture on a chair or bench. Twist your head and trunk as far as you can to the right, hold for 15 seconds, then repeat to the left. Perform stretch 2-3 times to each side.
- **Hamstring Stretch:** sit towards the front of a chair with your right leg straightened in front of the body and your right heel on the ground. Lean forward and extend your right hand toward your right toes until a "strong, but comfortable stretch" is felt in the back of the right thigh. Hold 15 seconds. Repeat on the left. Perform stretch 2–3 times on each leg.
- **Chest Stretch:** sit towards the front of a chair with your head and trunk in an upright posture, and your hands clasped behind your back. Pull your shoulders back until a "strong, but comfortable" stretch is felt across the chest. Hold 15 seconds. Perform stretch 2-3 times. If your balance status allows, this stretch can also be performed in standing.
- **Calf Stretch:** stand with feet at shoulder width apart and holding a firm surface. Take a full step backwards with your right foot, press your heel flat against the floor, then gently lean your body forward until a "strong, but comfortable" stretch is felt in the back of the right calf. Hold 15 seconds and repeat on the left. Perform stretch 2–3 times on each leg.
- **Anterior Hip Stretch:** stand with feet at shoulder width apart and holding a firm surface. Take a full step backwards with your right foot then arch your pelvis and trunk backwards until a "strong, but comfortable" stretch is felt at the front of the right hip. Hold for 15 seconds then repeat on the left. Perform stretch 2–3 times on each leg. Do not perform if you've recently had a total hip replacement or have ever had an anterior approach total hip replacement.

**Endurance: perform 4–5 times per week.**

- Walk on flat indoor or outdoor terrain, using a cane or walker as necessary, targeting a 20–30 minute duration at a moderate intensity, and stopping if needed. Do not use a treadmill. If walking is too difficult, see option 2 below.
- Ride a Recumbent Bike, Stationary Bike, or Nu-Step if you are unable to tolerate walking for at least 10 minutes. Target a duration of 20–30 minutes and stop if needed.`,
    keyPoints: [
      "Strength forms the foundation for good balance and is directly correlated to fall risk — without training, muscles weaken and fall risk rises.",
      "Even a few targeted exercises done to fatigue can build muscle and significantly reduce fall risk.",
      "Start small with a routine you'll stick with, and progress gradually; each program covers strength, flexibility, and endurance.",
      "Choose the Home Program level (1–3) that matches your commitment and time, or use the Fitness Center Program (printable handout) at a gym.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },

  // ----- Step 10: Balance Exercises -----
  {
    slug: "step-10-balance-exercises",
    title: "Step 10: Balance Exercises",
    subtitle: "Six balance programs by fall-risk level",
    order: 20,
    planSection: "ten_point",
    durationMin: null,
    videoEmbedUrl: "placeholder:vimeo:Each Balance Program (Levels 1–6) demonstrated start to finish",
    body: `The final, and arguably most important, step in the Fall Prevention Plan is to maximize balance. Balance, or the act of maintaining a steady position, is the body's primary defense against falling. Unfortunately, unless a person is actively engaged in activities that preserve it, balance, like strength, will deteriorate with age and fall risk will increase. Fortunately, there is hope, balance can be maintained and improved. Research shows that consistent performance of even a limited number of balance exercises increases body stability and lowers fall risk, and that well-designed balance programs are the gold standard in fall prevention due to their effectiveness in improving balance, safety confidence, and fall avoidance.

**If you are serious about reducing fall risk, performing a well-designed balance program is strongly recommended.**

Presented below are six balance programs specifically designed to reduce the risk of falls. They are listed in order of increasing intensity and are labeled to indicate the fall risk level they are designed to target. Review each of the programs and select the one that most closely matches your current balance and fall risk level. As your balance improves, progress to the next Balance Program Level.

An important note: each program is preceded by specific safety instructions to be used during their performance. Please follow the provided safety strategies recommended for each program.

![Balance-related backdrop — e.g. someone tightrope walking]()

> 📄 Each balance program has a print-ready handout — use the **Download Printable Guide** button to take it with you while you exercise.

## Level 1 Balance Program: High Fall Risk

**Safety Recommendations:** perform balance program standing in the corner of a room with your back to the wall, a locked walker or heavy chair in front of the body, and a capable person standing nearby for safety. Initiate the balance challenges with your hands on the walker or chair. As your confidence increases, slowly wean your hands to fingertip contact only and then completely off the supportive surface as you are able.

1. Stand with feet at shoulder width apart. Hold position up to 10 seconds. Perform 3 times.
2. Stand with the right foot a small step forward of the left. Hold position up to 10 seconds. Perform 3 times.
3. Stand with the left foot a small step forward of the right. Hold position up to 10 seconds. Perform 3 times.

## Level 2 Balance Program: High to Moderate Fall Risk

**Safety Recommendations:** perform the balance program standing in the corner of a room with your back to the wall, a locked walker or heavy chair in front of the body, and a capable person standing nearby for safety. Initiate the balance challenges with your hands on the walker or chair. As your confidence increases, slowly wean your hands to fingertip contact only and then completely off the supportive surface as you are able.

1. Stand with the right foot a medium step forward of the left. Hold position up to 10 seconds. Perform 2 times.
2. Stand with the left foot a medium step forward of the right. Hold position up to 10 seconds. Perform 2 times.
3. Stand with feet together. Hold position up to 10 seconds. Perform 2 times.
4. Standing with feet at shoulder width apart, turn head and shoulders side to side. Perform 3 times.
5. Standing with feet at shoulder width apart, bend forward and back. Perform 3 times.
6. Standing with feet at shoulder width apart, rock body side to side. Perform 5 times.
7. Standing with feet at shoulder width apart, rock body forward and back. Perform 5 times.

## Level 3 Balance Program: Moderate Fall Risk

**Safety Recommendations:** perform the balance program standing in the corner of a room with your back to the wall, a locked walker or heavy chair in front of the body, and a capable person standing nearby for safety. Initiate the balance challenges with your hands on the walker or chair. As your confidence increases, slowly wean your hands to fingertip contact only and then completely off the supportive surface as you are able.

1. Standing with feet together, turn head and shoulders side to side, then up and down. Perform 2 times.
2. Standing with right foot a medium step forward of the left, turn head and shoulders side to side, then up and down. Perform 2 times.
3. Standing with left foot a medium step forward of the right, turn head and shoulders side to side, then up and down. Perform 2 times.
4. Standing with feet at shoulder width apart, rock up and down on heels and toes. Perform 10 times.
5. Standing with feet at shoulder width apart, march in place. Perform 10 times.
6. Standing with feet at shoulder width apart, step forward with right foot and back to the starting position, then step forward with your left foot and back to the starting position. Perform 5 times.
7. Standing with feet at shoulder width apart, step to the side with right foot and back to the starting position, then step to the side with your left foot and back to the starting position. Perform 5 times.
8. Standing with feet at shoulder width apart, step backwards with the right foot and return to the starting position, then step backwards with the left foot and back to the starting position. Perform 5 times.

## Level 4 Balance Program: Low to Moderate Fall Risk

**Safety Recommendations:** perform balance program standing at the kitchen sink. Initiate balance challenges with fingertips on the kitchen sink/counter. Gradually wean fingertips off the support surface as confidence increases.

1. Standing with feet together, turn head and shoulders side to side, then up and down. Perform 2 times.
2. Standing with the right foot a full step forward of the left foot, turn head and shoulders side to side, then up and down. Perform 2 times.
3. Standing with the left foot a full step forward of the right foot, turn head and shoulders side to side, then up and down. Perform 2 times.
4. Standing with feet at shoulder width apart, rock up and down on heels and toes. Perform 10 times.
5. Standing with feet at shoulder width apart, march in place. Perform 10 times.
6. Standing with feet at shoulder width apart, step forward with right foot and back to the starting position, then step forward with the left foot and back to the starting position. Perform 5 times.
7. Standing with feet at shoulder width apart, step to the side with right foot and back to the starting position, then step to the side with the left foot and back to the starting position. Perform 5 times.
8. Standing with feet at shoulder width apart, step backwards with the right foot and return to the starting position, then step backwards with the left foot and return to the starting position. Perform 5 times.
9. Stand on right leg only up to 25 seconds, then left leg only up to 25 seconds. Perform 2-3 times.

## Level 5 Balance Program: Low Fall Risk

**Safety Recommendations:** perform balance program standing at the kitchen sink. Initiate balance challenges with fingertips on the kitchen sink/counter. Gradually wean fingertips off the support surface as confidence increases.

1. Standing with feet together, turn head and shoulders side to side, then up and down. Perform 2 times.
2. Standing with the right foot a full step forward of the left, turn head and shoulders side to side, then up and down. Perform 2 times.
3. Standing with the left foot a full step forward of the right, turn head and shoulders side to side, then up and down. Perform 2 times.
4. Standing with feet at shoulder width apart, rock up and down on heels and toes. Perform 10 times.
5. Standing with feet at shoulder width apart, march in place. Perform 10 times.
6. Standing with feet at shoulder width apart, step forward with right foot and back to the starting position, step to the side with the right foot and back to the starting position, then step backwards with the right foot and return to the starting position. Repeat the sequence on the left, stepping forward with the left foot and back to the starting position, stepping to the side with the left foot and back to the starting position, then stepping backwards with the left foot and back to the starting position. Perform 5 times.
7. Side step 10 steps to the right, then 10 steps to the left. Perform 3 times.
8. High step forward 10 steps and normal step backwards 10 steps. Perform 3 times.
9. Stand on right leg up to 25 seconds, then on left leg up to 25 seconds. Repeat 2-3 times.

## Level 6 Balance Program: Negligible to Low Fall Risk

**Safety Recommendations:** perform balance routine in a large area, free of obstruction.

1. Stand with feet together and eyes closed. Hold position up to 30 seconds. Perform 1 time.
2. Stand with right foot a full step forward of the left foot and eyes closed. Hold position up to 30 seconds. Then stand with the left foot a full step forward of the right foot and eyes closed. Hold position up to 30 seconds. Perform 1 time.
3. Standing with feet at shoulder width apart, step forward with right foot and back to the starting position, step to the side with the right foot and back to the starting position, then step backwards with the right foot and return to the starting position. Repeat the sequence on the left, stepping forward with the left foot and back to the starting position, stepping to the side with the left foot and back to the starting position, then stepping backwards with the left foot and returning to the starting position. Perform 5 times.
4. Side step 10 steps to the right, then 10 steps to the left. Perform 3 times.
5. High step forward 10 steps, then normal step backwards 10 steps. Perform 3 times.
6. Standing on right leg, turn body to the right and left, then stand on the left leg and turn body to the right and left. Perform 3 times.
7. Standing on the right leg, bend body forward and back then stand on the left leg and turn body to the right and left. Perform 3 times.
8. Step 3 times to your right, 2 steps backwards, 3 steps to your right, 2 steps forward, 3 steps to your left, 2 steps backwards, 3 steps to the left, 2 steps forward. Then repeat in the opposite direction: 2 steps backwards, 3 steps to your right, 2 steps forward, 3 steps to your right, 2 steps backwards, 3 steps to your left, 2 steps forward, and 3 steps to your left. Perform 3 times.
9. "Tight Rope" or tandem walk forward 10 steps. Perform 3 times.`,
    keyPoints: [
      "Balance is the body's primary defense against falling, and well-designed balance programs are the gold standard in fall prevention.",
      "Consistent practice of even a limited number of balance exercises increases stability and lowers fall risk.",
      "Choose the program level that matches your current balance and fall-risk level, and progress upward as you improve.",
      "Always follow the specific safety recommendations that precede each program.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },

  // ===== WHAT IF A FALL HAPPENS =====
  {
    slug: "minimizing-fall-injury-risk",
    title: "Minimizing the Risk of a Fall-Related Injury",
    subtitle: "Building stronger bones and knowing how to fall",
    order: 30,
    planSection: "fall_response",
    durationMin: null,
    videoEmbedUrl: "placeholder:vimeo:How to fall to reduce the risk of injury",
    body: `## What if a Fall Happens

Falls are typically sudden and startling events that often leave the faller stunned and scared. Unfortunately, even with careful planning and attention to safety, falls can happen. Since preventing every fall is impossible, knowing how to reduce fall related injury risk, react immediately after a fall occurs, stand up safely from the ground, and manage any post fall fears is important. The following guidelines outline the best strategies to handle each of these problems.

## Minimizing the Risk of a Fall-Related Injury

CDC statistics reveal that 37% of falls result in an injury that limits activity for at least one day and 20% of falls result in an injury that requires hospitalization. Knowing how to minimize the risk of a fall related injury is therefore critical as it could mean the difference between a minor injury or bruised ego and a serious injury that requires surgery or even nursing home placement.

Reducing the risk of a fall related injury needs to be considered from both short term and long-term perspectives. Here are the strategies recommended to reduce the risk of both types of fall related injuries:

**Reducing the risk of a fall related injury from a long term perspective focuses on building stronger bones. To do this, follow these tips:**

- Get adequate calcium and vitamin D. Guidelines set forth by the Mayo Clinic recommend that senior adults get 1200 milligrams of calcium and 800–1000 IU of Vitamin D per day.
- Stay active, getting at least one hundred fifty minutes of exercise weekly.
- Quit smoking.
- Limit alcohol consumption.
- Maintain a healthy body weight.
- Talk to your doctor about osteoporosis.

**Reducing the immediate risk of a fall related injury involves knowing how to fall. To do this, use these tips:**

If you feel yourself beginning to fall...

- Steer your body away from hard furniture, sharp objects, or hard floors.
- Aim to land on softer body parts, like your bottom.
- Instead of using your arms to break the fall, turn your body and shield your head with your arms.
- Relax your body as you fall, going limp and rolling naturally upon impact with the ground.

![Someone bewildered after a fall, trying to assess their situation]()`,
    keyPoints: [
      "37% of falls cause an injury that limits activity for at least a day; 20% require hospitalization.",
      "Build stronger bones long-term: adequate calcium (1200 mg) and vitamin D (800–1000 IU) daily, 150 minutes of weekly exercise, no smoking, limited alcohol, a healthy weight, and talk to your doctor about osteoporosis.",
      "If you feel yourself falling: steer away from hard objects, aim to land on softer parts like your bottom, shield your head with your arms, and relax and go limp on impact.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },
  {
    slug: "react-after-a-fall",
    title: "How to React Immediately After a Fall",
    subtitle: "The first steps that protect you",
    order: 31,
    planSection: "fall_response",
    durationMin: null,
    videoEmbedUrl: "placeholder:vimeo:How to react immediately after a fall",
    body: `Responding appropriately to a fall is vital. It reduces the risk of a sustained injury worsening, improves recovery chances, and reduces long-term damage risk.

If you fall, follow these steps:

1. Stay calm, take deep breaths, and check for injuries.
2. If possible, slide or crawl to a nearby chair or couch to help you stand.
3. If seriously injured, don't try to stand; call for help instead.
4. If you can't get up or are seriously injured, crawl or slide to a phone and call 911.

![Someone on the ground, calmly assessing their situation]()`,
    keyPoints: [
      "Stay calm, breathe, and check for injuries before moving.",
      "If you can, slide or crawl to a sturdy chair or couch to help you stand.",
      "If seriously injured, don't try to stand — call for help, or crawl/slide to a phone and call 911.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },
  {
    slug: "standing-up-after-a-fall",
    title: "Standing Up from the Ground After a Fall",
    subtitle: "Two proven methods",
    order: 32,
    planSection: "fall_response",
    durationMin: null,
    videoEmbedUrl: "placeholder:vimeo:How to get up from the ground after a fall (two methods)",
    body: `Standing up from the ground can be challenging for older adults, especially after a fall. Here are two proven methods to get up:

## Crawling Method

1. Roll onto your side.
2. Push up onto your hands and knees into a crawling position.
3. Crawl to a sturdy chair, coffee table, or couch.
4. Place your hands on the furniture, extend your stronger leg, and push into a half-lunge to stand.

If standing fully is difficult, turn and sit on the furniture. If knee pain prevents crawling, scoot on your bottom or roll to the furniture.

## Using a Nearby Surface

1. Scoot close to a staircase, coffee table, chair, or sofa.
2. Push into a seated position using your hands on the floor.
3. Turn so your back faces the furniture.
4. Lift your bottom onto the surface. If using a staircase, sit on the lowest step and move up step by step until you can stand.`,
    keyPoints: [
      "Crawling method: roll to your side, get onto hands and knees, crawl to sturdy furniture, then push up through your stronger leg into a half-lunge to stand.",
      "Using a nearby surface: scoot to furniture, push to sitting, turn your back to it, and lift your bottom onto the surface (or up a staircase step by step).",
      "If knee pain prevents crawling, scoot on your bottom or roll to the furniture.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },
  {
    slug: "overcoming-fear-of-falling",
    title: "Overcoming the Fear of Falling",
    subtitle: "A serious, often-overlooked problem",
    order: 33,
    planSection: "fall_response",
    durationMin: null,
    videoEmbedUrl: null,
    body: `The fear of falling is a very serious, but often overlooked problem for senior adults. It affects over 50% of people who have fallen in the past and more than 30% of the general senior adult population. If unaddressed, the fear of falling can lead to decreased participation in normal daily activity, social isolation, depression, physical decline, and ultimately increased fall risk.

To overcome the fear of falling, follow these steps:

1. Discuss the problem with your physician and/or those closest to you to determine any obvious cause.
2. Remove or discontinue anything that may be causing a fear of falling.
3. Resume activity as quickly as possible, starting with safe activities to build confidence if needed and then gradually increasing their intensity as you are able.

![Someone looking fearful about walking]()

![Someone self-isolating at home]()`,
    keyPoints: [
      "Fear of falling affects over 50% of people who have fallen and more than 30% of seniors overall.",
      "Left unaddressed it leads to less activity, social isolation, depression, physical decline, and higher fall risk.",
      "To overcome it: discuss the cause with your physician and loved ones, remove what's driving it, and resume activity gradually — starting safe and building confidence.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },
  {
    slug: "falls-as-warning-sign",
    title: "When Falls Are a Warning Sign of an Underlying Health Problem",
    subtitle: "When to seek a medical evaluation",
    order: 34,
    planSection: "fall_response",
    durationMin: null,
    videoEmbedUrl: null,
    body: `Impaired balance and falling can actually be a warning sign of an underlying health issue. If falls occur in the presence of other physical conditions such as persistent pain, swelling, shortness of breath, lethargy, or dizziness, a medical evaluation should be performed. Pain can signal tissue injury or joint damage; Dizziness can be due to dehydration, adverse medication side effects, vestibular system disorders or extremes in blood pressure and sugar levels; Swelling can be a result of tissue injury or problems with the heart, kidney, and lymphatic systems; Lethargy is often caused by infection or electrolyte imbalance; and Shortness of Breath can be a result of heart or lung problems.

If balance problems or falls appear to be associated with a physical condition such as persistent pain, swelling, shortness of breath, lethargy or dizziness, a medical assessment is strongly recommended to rule out an underlying health problem.

![Someone talking with their doctor]()`,
    keyPoints: [
      "Falls and balance problems can be a warning sign of an underlying health issue.",
      "Seek a medical evaluation if falls come with persistent pain, swelling, shortness of breath, lethargy, or dizziness.",
      "These symptoms can point to injury, dehydration, medication effects, vestibular disorders, or heart, lung, kidney, or other problems.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },

  // ===== APPENDIX A: ASSISTIVE DEVICES =====
  {
    slug: "appendix-assistive-devices",
    title: "Appendix A: Assistive Devices",
    subtitle: "Recommended canes, walkers, and wheelchairs with ordering links",
    order: 40,
    planSection: "appendix_a",
    durationMin: null,
    videoEmbedUrl: null,
    body: `Assistive Devices play a vital role in fall prevention, however to maximize their benefit, it is essential to select the device that most closely matches your balance impairment level, body type, and specific needs. Presented below is a detailed breakdown of the four basic assistive device categories and their most common variations. Each item includes ordering instructions and a discount code if you decide the product is right for you.

## I. Canes

*Suitable for people with mild balance problems.*

- **Single Point Cane** — <https://a.co/d/0ee4m4Rv>
- **Tripod Cane or Hurry-Cane** — equipped with a wider base, providing more stability and allowing the assistive device to stand on its own to decrease loss when the user is stationary. <https://a.co/d/0g8EWv9Z>
- **Foldable Cane** — can be folded into a compact size, making it easy to store and travel friendly. <https://a.co/d/03y80pLw>
- **Quad Cane** — very wide and stable base; designed to accommodate people with marked balance deficits and functional use of only one arm. <https://a.co/d/04M5u4r7>

![Pictures of each cane type]()

## II. 4 Wheel Rolling Walker (Rollator)

*Suitable for people with mild to moderate balance problems; often also used by people with moderate+ balance problems who are still able to maintain an upright standing posture.*

- **4 Wheel Rolling Walker (Rollator) — Base model** — <https://a.co/d/0ic8Lbez>
- **4 Wheel Rolling Walker (Rollator) — Better Quality** — <https://a.co/d/0euwFz2D>
- **Junior 4 Wheel Rolling Walker (Rollator)** — designed for someone of shorter stature, 4'10" to 5'4". <https://a.co/d/08qUjdhJ> · <https://a.co/d/0i232mg8>
- **Tall 4 Wheel Rolling Walker (Rollator)** — designed for someone 6' tall and greater. <https://a.co/d/0481gkbz>
- **Light 4 Wheel Rolling Walker** — good for travel in the community where frequent collapsing, loading, and unloading the walker into a car is necessary. Weighs 11–12 pounds. <https://a.co/d/0eQ5dETK>
- **Ultra Light Walker** — designed specifically for ease of travel. Folds quickly into a very compact size and weighs only 9.5 pounds (4 Wheel Rolling) or 7 pounds (2 Wheel Rolling with back leg and skis). <https://a.co/d/05SbMsOl> · <https://a.co/d/0cmGHhrC>
- **Three-Wheel Rolling Walker** — users often report its design makes it easier to navigate areas with limited space. Note: this model lacks a seat and is therefore not a good option for someone with poor endurance. <https://a.co/d/0iFtSTMm>
- **Bariatric Four Wheel Rolling Walker** — designed to accommodate people of excess weight. <https://a.co/d/00550hkv>
- **Upright Walker** — designed to assist in maintaining an upright standing posture. Note: users frequently report difficulty managing tall height. <https://a.co/d/06d53rZB>

![Pictures of each 4-wheel rolling walker variation]()

## III. 2 Wheel Rolling Walker

*Suitable for people with a moderate to moderate+ balance deficit. Provides increased stability.*

- **2 Wheel Rolling Walker (Rollator)** — <https://a.co/d/0dv8MLgf> · Recommended for use with walker skis for improved safety negotiating the environment: <https://a.co/d/06h7S4Ww>

![Picture of a 2-wheel rolling walker]()

## IV. Wheelchair

*Suitable for people with a significant balance problem.*

- **Regular Wheelchair** — designed for long-term use. Not easy to transport. Appropriate wheelchair fitting is essential for ease of use. Models come in 16, 18, 20, 22, and 24 inch widths. <https://a.co/d/0iAO9Gll>
- **Transport Wheelchair** — designed to assist balance- and/or endurance-compromised people when traveling in the community. Lightweight design makes it easy to transport. Not designed for long-term use. <https://a.co/d/092SG19U>

![Pictures of the wheelchairs]()`,
    keyPoints: [
      "Select the device that most closely matches your balance impairment level, body type, and specific needs.",
      "Four basic categories: canes (mild), 4-wheel rolling walkers (mild–moderate), 2-wheel rolling walkers (moderate to moderate+), and wheelchairs (significant deficits).",
      "Each category has variations (junior, tall, bariatric, lightweight, ultra light, large-wheel, transport) for specific needs.",
      "Each item links to a recommended product for ordering.",
    ],
    comingSoon: false,
    freeTier: false,
    printable: true,
  },

  // ===== APPENDIX B: HOME SAFETY MODIFICATIONS AND EQUIPMENT =====
  {
    slug: "appendix-home-safety",
    title: "Appendix B: Home Safety Modifications & Equipment",
    subtitle: "A room-by-room equipment guide with ordering links",
    order: 41,
    planSection: "appendix_b",
    durationMin: null,
    videoEmbedUrl: null,
    body: `Maximizing the safety of the home environment is one of the best strategies to prevent falls, however knowing which products would be the most beneficial can be confusing. This section provides a room-by-room outline and description of the most common products and methods used to decrease the risk of falls in the home. Pictures of each piece of equipment are given and instructions and a discount code for ordering are provided.

## The Bathroom

- **Slip Resistant Bathtub Rug / Mat** — place a slip resistant rug or mat next to the bathtub/shower when bathing to improve safety during entry and exit. <https://a.co/d/0alvBwRp>
- **Non-Skid Strips / Bath Mat** — use non-skid strips or a bath mat on the bathtub/shower floor to prevent slipping while bathing. Non-Skid Strips: <https://a.co/d/0d9xWkRZ> · Bath Mat: <https://a.co/d/0fjlndpN>
- **Grab Bars** — install grab bars in and around the bathtub/shower for improved standing balance. Grab bars should be mounted at a height just above waist level and in such a way that creates an almost continuous support surface starting outside the bathtub/shower and continuing throughout the entire bathing area. Towel racks and suction cup style grab bars should not be considered an adequate replacement for properly mounted grab bars. <https://a.co/d/07qqw31i>
- **Shower Chair with Back and Arms** — use in the bathtub/shower if standing balance or endurance is significantly compromised. Provides a safe sitting surface to perform bathing needs, is easy to stand up and down from, and when used in combination with grab bars, creates a very safe bathing area. <https://a.co/d/008u5Gxx>
- **Tub Bench** — use if stepping over the bathtub wall or shower is unsafe. The bather sits down on the tub bench outside of the bathtub/shower, then scoots across the bench into the bathing area. <https://a.co/d/01uC1RpB>
- **Modified Shower Curtain** — used with a tub bench to limit the amount of water that escapes the bathing area. <https://a.co/d/02eyVte7>
- **Tub Bench with a Sliding and Pivoting Seat** — a variation to the basic tub bench. Used if the bather is not strong enough to scoot across the elongated tub bench seat into the bathtub/shower, or does not possess adequate postural control to sit unsupported when scooting or bathing. The bather sits down on the seat outside of the bathing area, buckles in, pivots the chair direction, and then slides into the bathing area. <https://a.co/d/0deJQVQl>
- **Modified Toilet Seats** — use if standing up or down from a toilet is difficult or unsafe. There are multiple designs, each with their own use case:
  - **Versa Frame** — adds arms to a toilet, providing a stable surface to grasp when sitting down and to push up from when standing. Recommended when the toilet height is adequate but use of arms is needed to sit or stand safely. <https://a.co/d/0cgRcoED>
  - **Raised Toilet Seat with Arms** — adds arms and extra height to the toilet; used when the toilet is too low and use of arms is needed to stand. <https://a.co/d/03ubjpRV>
  - **Three in One Commode** — provides arms to assist with standing up or sitting down, has an adjustable toilet seat height, is portable, and certain designs are more accommodating to larger people. Used when the existing toilet is too low, use of arms is needed to safely stand or sit, other modified toilet seats are too confining, and/or the unit needs to be used in multiple locations or for multiple purposes (at bedside for nighttime toileting needs or in the shower/bathtub as a shower chair). <https://a.co/d/0hMYMIIM>

![Pictures of each bathroom product, including a diagram of the shower area showing grab bar positions]()

## The Bedroom

- **Designated Dressing Area** — create a designated dressing area in the bedroom or bathroom. Furnish it with a heavy chair with arms to sit on and a solid surface to hold onto when standing.
- **Adjust Bed Height** — beds that are either too tall or too short make getting in or out of bed difficult and dangerous. Optimum bed heights range between 18–23 inches when the mattress is sat on by an average height male or female. Beds can be lowered by replacing the traditional box spring with a reduced height box spring and raised by using furniture risers. If using furniture risers, make sure the inside base of the riser is large enough to accommodate the foot of the bed frame. Using a stool to get in and out of a tall bed, even if it has a built-in handrail, is not recommended. Reduced height box spring: <https://a.co/d/0eO8x7fV> · Furniture Riser (2 inch size shown): <https://a.co/d/05Dku18o>
- **Bed Rail** — use if getting in/out of bed is difficult, if safety during sitting or standing at the bed is compromised, or if rolling out of bed is possible. Bed rails secure to the bed frame or under the mattress and provide an easy-to-grasp support surface. <https://a.co/d/0gJXxjca>
- **Super Pole** — a good alternative to a bed rail. <https://a.co/d/07IG3EPp>

![Pictures of bedroom equipment]()

## The Stairway

- **Hand Rails** — install on one or both sides of the staircase for better support.
- **Contrasting Colored Tape** — mark stair edges with contrasting colored tape if visual impairments limit the ability to identify the stair edge. <https://a.co/d/0iS7KRUE>
- **Mechanical Stair Lift** — use if going up/down stairs is significantly difficult or dangerous. <https://a.co/d/00QNdZUO>

![Pictures of stairway equipment]()

## The Living Room / Den

- **Furniture Risers** — use to elevate chairs and couches that are low and difficult to stand up from. Optimum sitting surface height is 18–22 inches when the surface is sat on, maximizing the combination of sitting comfort and ease of standing. Furniture risers come in multiple heights and should be selected to accommodate a person's individual need. Furniture Riser (2 inch size shown): <https://a.co/d/05Dku18o>
- **Recliner Chair Riser Base** — use to increase the height of a recliner chair if standing up/down is difficult. <https://a.co/d/0ehAz0jn>
- **Elevating Recliner Chair** — use if standing up/down requires assistance. Elevating recliner chairs should only be used if standing up is markedly difficult or unsafe. For people with poor sitting balance and/or trunk control, choose a non-slick covering material such as a knit fabric to minimize the risk of sliding out of the chair when it is in the raised position. <https://www.la-z-boy.com/b/living-room/recliners/power-lift-chairs> · <https://a.co/d/0eoOFpXR>

![Pictures of living room equipment]()`,
    keyPoints: [
      "Maximizing home safety is one of the best strategies to prevent falls — this is a room-by-room equipment guide.",
      "Bathroom: slip-resistant mats, non-skid strips, properly mounted grab bars, shower chairs, tub benches, and modified toilet seats.",
      "Bedroom: a designated dressing area, correct bed height (18–23 inches when sat on), and bed rails or a super pole.",
      "Stairway and living areas: handrails, contrasting stair-edge tape, stair lifts, furniture risers, and lift recliners — each with an ordering link.",
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

// Tier 2 (subscription) includes regular exercise classes and a weekly Q&A.
// Geoff's classes are recorded so members can follow along anytime (he did NOT
// want them framed as "live"). Representative upcoming/recurring sessions.
const SESSIONS = [
  {
    kind: "class",
    title: "Balance Class",
    description:
      "A guided session working through the Fall Prevention Plan balance programs. Suitable for all levels — follow along at your own program level. Camera optional.",
    startsAt: daysFromNow(1, 10),
    durationMin: 45,
    host: "Dr. Geoff Angell, DPT",
    joinUrl: "stub://zoom/balance-class",
  },
  {
    kind: "class",
    title: "Strength Class",
    description:
      "A guided strength session based on the Home Exercise Programs — strength, flexibility, and endurance for fall prevention.",
    startsAt: daysFromNow(2, 10),
    durationMin: 45,
    host: "Dr. Geoff Angell, DPT",
    joinUrl: "stub://zoom/strength-class",
  },
  {
    kind: "qa",
    title: "Weekly Members Q&A",
    description:
      "Bring your questions about any step of the plan — footwear, medications, home safety, exercises, and more.",
    startsAt: daysFromNow(4, 13),
    durationMin: 60,
    host: "Dr. Geoff Angell, DPT",
    joinUrl: "stub://zoom/weekly-qa",
  },
];

const LIBRARY = [
  {
    title: "Recording — Balance Class",
    kind: "recording",
    summary:
      "Missed the balance class? The full recording is available here to follow along anytime.",
    publishedAt: daysFromNow(-7, 10),
    durationMin: 45,
  },
  {
    title: "Recording — Strength Class",
    kind: "recording",
    summary:
      "A recorded strength session based on the Home Exercise Programs, ready to follow along with at home.",
    publishedAt: daysFromNow(-5, 10),
    durationMin: 45,
  },
  {
    title: "Recording — Members Q&A",
    kind: "recording",
    summary:
      "A recording of a recent members Q&A covering medications, footwear, and home safety questions.",
    publishedAt: daysFromNow(-3, 13),
    durationMin: 60,
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
        fromName: "Dr. Geoff Angell, DPT",
        message:
          "Checking in after our home walkthrough — how did installing the bathroom grab bars go? Let me know if you'd like help finding a handyman.",
      });
      await db.insert(conciergeNotesTable).values({
        userId: u.id,
        authorName: "Dr. Geoff Angell, DPT",
        body: "Completed initial intake call. Member's daughter joined. Identified bathroom and bedside lighting as top priorities.",
      });
      await db.insert(conciergeNotesTable).values({
        userId: u.id,
        authorName: "Dr. Geoff Angell, DPT",
        body: "Reviewed the TUG self-assessment result and recommended starting the Level 3 balance program.",
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
