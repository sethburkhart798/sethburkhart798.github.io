/*
  All the "real world" facts for the site live here, separate from the markup,
  so filling in real links/copy never means touching HTML/CSS.

  Anything still starting with TODO_ renders as a "Coming Soon" state
  automatically — swap it for the real value and the page updates itself.
*/

const CONFIG = {
  // Public contact
  email: "sethburkhartssb@gmail.com",
  instagram: {
    handle: "@sethsburkhart",
    url: "https://instagram.com/sethsburkhart"
  },
  tiktok: {
    handle: "@sethburkhart",
    url: "https://www.tiktok.com/@sethburkhart"
  },

  // 1-on-1 Coaching — CTAs open the application popup. Submissions are
  // emailed via FormSubmit; the FIRST submission triggers a one-time
  // activation email to this address (click "Activate" in it once).
  coaching: {
    formAction: "https://formsubmit.co/ajax/sethburkhartssb@gmail.com"
  },

  // 45-minute paid consulting call
  consulting: {
    price: "$200",
    duration: "45 min",
    bookingUrl: "TODO_BOOKING_LINK" // Calendly / booking page that collects the $200
  },

  // Fatloss Blueprint digital product
  blueprint: {
    name: "Fat Loss Blueprint",
    price: "TODO_PRICE", // e.g. "$47"
    url: "TODO_PRODUCT_LINK" // leave as TODO to show the "Coming Soon" state
  },

  // Biohackr Health shop affiliate
  biohackr: {
    code: "SETH", // discount code shoppers enter at checkout
    discount: "10%",
    url: "https://www.biohackr.health/shop/"
  },

  /*
    Case studies ("The proof" section).
    The section stays hidden on the live site until at least one entry has a
    real name, headline, and story. Preview the layout any time by opening
    the site with ?proof-preview added to the URL.

    Photos: drop before/after images into assets/img/ and put the paths here
    (e.g. "assets/img/cs-mike-before.jpg"). Leave them TODO to show a clean
    text-only layout instead.
  */
  caseStudies: [
    {
      name: "TODO_FIRST_NAME",            // e.g. "Mike"
      headline: "TODO_RESULT_HEADLINE",   // e.g. "Down 34 lbs and kept it off"
      timeframe: "TODO_TIMEFRAME",        // e.g. "7 months"
      stats: [
        // Up to three short numbers that tell the story at a glance.
        { value: "TODO", label: "TODO" }, // e.g. { value: "-34 lbs", label: "total change" }
        { value: "TODO", label: "TODO" }, // e.g. { value: "7 mo", label: "to goal" }
        { value: "TODO", label: "TODO" }  // e.g. { value: "1 yr+", label: "maintained" }
      ],
      story: [
        // 2-4 paragraphs. Where they started, what you changed, what happened.
        "TODO_PARAGRAPH_1",
        "TODO_PARAGRAPH_2",
        "TODO_PARAGRAPH_3"
      ],
      quote: "TODO_CLIENT_QUOTE",         // one sentence, their words
      beforeImage: "TODO_IMAGE_PATH",
      afterImage: "TODO_IMAGE_PATH"
    },
    {
      name: "TODO_FIRST_NAME",
      headline: "TODO_RESULT_HEADLINE",
      timeframe: "TODO_TIMEFRAME",
      stats: [
        { value: "TODO", label: "TODO" },
        { value: "TODO", label: "TODO" },
        { value: "TODO", label: "TODO" }
      ],
      story: [
        "TODO_PARAGRAPH_1",
        "TODO_PARAGRAPH_2",
        "TODO_PARAGRAPH_3"
      ],
      quote: "TODO_CLIENT_QUOTE",
      beforeImage: "TODO_IMAGE_PATH",
      afterImage: "TODO_IMAGE_PATH"
    }
  ]
};
