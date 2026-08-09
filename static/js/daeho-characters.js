/* ═══════════════════════════════════════════════════════════════════════
   THE SHRINE OF DAEHO · featured souls
   A fan shrine to the realm — characters to look at and adore.
   Fields: crest glyph, element (water|fire|mystic), house, iconic lines.
   ═══════════════════════════════════════════════════════════════════════ */

window.DAEHO = {
  filters: [
    { id: "all",    label: "All Souls",  korean: "전체" },
    { id: "faves",  label: "Adored",     korean: "애정" },
    { id: "fire",   label: "Fire Souls", korean: "화" },
    { id: "water",  label: "Water Souls",korean: "수" }
  ],
  characters: [
    {
      id: "jang-uk", name: "Jang Uk", korean: "장욱",
      art: "https://static.wikia.nocookie.net/alchemy-of-souls/images/a/a4/Jung_uk.jpg/revision/latest?cb=20230222193823",
      fallback: "/static/img/jang-uk.jpg",
      role: "Heir of the Jang House", house: "Jang · pupil of Jinyowon",
      element: "fire", glyph: "烏",
      location: "Daeho · the capital",
      excerpt: "The boy born with nothing, who refused to stay that way.",
      bio: [
        "Jang Uk is the son the realm couldn't keep — born without the power every Jang should carry, cast aside by a house that measured worth in fire. He grew up as the commoner who belonged to no one, and sharpened that loneliness into a blade.",
        "What he lacks in inheritance he repays in stubbornness. Given half a chance and a borrowed master, he set out to become a mage the realm would have to notice — and the realm, grudgingly, has begun to."
      ],
      lines: [
        "“They told me I was born without the fire. They forgot to tell me I could learn to hold a match.”"
      ],
      relationships: [
        { name: "Master Yi Su", note: "his dancing, vain, brilliant tutor", link: "yi-su" },
        { name: "Bubu", note: "the inn maid who keeps surprising him", link: "bubu" }
      ],
      tags: ["fire", "jang", "jinowon's heir"]
    },
    {
      id: "naksu", name: "Naksu", korean: "낙수",
      art: "https://static.wikia.nocookie.net/alchemy-of-souls/images/7/70/Cho_Yeong.jpg/revision/latest?cb=20230221221515",
      fallback: "/static/img/naksu.jpg",
      role: "The Flame That Wouldn't Die", house: "the whispered assassin",
      element: "fire", glyph: "焰",
      location: "Jinyowon's shadow",
      excerpt: "A storm you should have let go — now it has nowhere else to burn.",
      bio: [
        "Naksu is the name rumours say before they cross themselves — an assassin of terrible skill whose fire refused to be extinguished, even when fate took everything from her. She is less a person than a pressure the realm keeps pretending it can ignore.",
        "Denied the story she was owed, she wrote her own in the only language that suited her: leaving a trail so bright that those who swore she was gone could not, in good conscience, look away."
      ],
      lines: [
        "“You cannot put out a fire that has already decided it is the only thing left of you.”"
      ],
      relationships: [
        { name: "Jang Uk", note: "they keep meeting like an argument", link: "jang-uk" }
      ],
      tags: ["fire", "assassin", "jinyowon"]
    },
    {
      id: "bubu", name: "Mu-Deok · Bubu", korean: "무덕",
      art: "https://static.wikia.nocookie.net/alchemy-of-souls/images/5/5e/Mu-deok.jpeg/revision/latest?cb=20230222193452",
      fallback: "/static/img/bubu.jpg",
      role: "A Tempest in an Innkeeper's Body", house: "Jinyowon's strongest maid",
      element: "water", glyph: "水",
      location: "The inn · Daeho",
      excerpt: "The realm's most unremarkable maid — and the last person it should underestimate.",
      bio: [
        "Bubu is the inn's favourite, smallest, strongest maid — a walking contradiction who bends steel with one hand and serves tea with the other. Everyone loves her; no one thinks to look twice. That is precisely her gift.",
        "Under that round, apologetic smile is a current no one in Daeho has learned to fear yet. Water, after all, does not announce itself — it simply wears a path through whatever tried to stop it."
      ],
      lines: [
        "“I'm just the maid. Please don't mind me.” — while the candle across the room quietly stops burning."
      ],
      relationships: [
        { name: "Jang Uk", note: "her favourite storm to feed", link: "jang-uk" },
        { name: "the inn", note: "her uncomplicated, beloved home" }
      ],
      tags: ["water", "maid", "underestimate her"]
    },
    {
      id: "jang-gang", name: "Jang Gang", korean: "장강",
      art: "https://static.wikia.nocookie.net/drama/images/8/87/Joo_Sang_Wook.jpg/revision/latest?cb=20240829074613",
      fallback: "/static/img/jang-gang.jpg",
      role: "The Lord Who Chose the Wrong Vessel", house: "Jang · keeper of the Ice Stone",
      element: "fire", glyph: "石",
      location: "Jinyowon · the Ice Stone tower",
      excerpt: "He carried the Ice Stone so the realm wouldn't have to — and it carried him instead.",
      bio: [
        "Jang Gang was the Jang patriarch, a great fire-artist who took the Ice Stone into himself to keep it from the realm's grasp. It was an act of terrible devotion: to lock away the relic, he had to become its cage.",
        "Power of that order does not sit quietly. The lord who once ruled a house would find himself, at the wrong hour, watching his own hand move to music he had not heard — proof, some say, of how thin the line is between keeper and kept."
      ],
      lines: [
        "“You think a cage protects the realm from the storm. You forget who has to live inside it.”"
      ],
      relationships: [
        { name: "Jang Uk", note: "the son he could never safely love", link: "jang-uk" }
      ],
      tags: ["fire", "ice stone", "jang"]
    },
    {
      id: "yi-su", name: "Master Yi Su", korean: "이수",
      art: "https://static.tvmaze.com/uploads/images/original_untouched/334/835425.jpg",
      fallback: "/static/img/yi-su.jpg",
      role: "The Realm's Most Vain Genius", house: "wandering master · Jinyowon",
      element: "water", glyph: "睿",
      location: "Daeho · wandering",
      excerpt: "A thousand-year-old mage who would rather be admired than be right.",
      bio: [
        "Master Yi Su is Daeho's oldest and most insufferably brilliant living mage — a man who has seen eras pass and still regrets none of his own choices, only the audiences that failed to applaud them. He tutors for his own amusement and calls it mercy.",
        "Beneath the vanity is a mind that has forgotten nothing: every art, every flaw, every fire he let burn. He claims to teach for money; the truth is he teaches because watching disaster bloom never gets old, and occasionally he misses being useful."
      ],
      lines: [
        "“I am a thousand years old, and you are one mistake away from becoming a very good story.”"
      ],
      relationships: [
        { name: "Jang Uk", note: "his favourite unfinished disaster", link: "jang-uk" }
      ],
      tags: ["water", "master", "ancient"]
    },
    {
      id: "crown-prince", name: "The Crown Prince", korean: "세자",
      art: "https://static.wikia.nocookie.net/alchemy-of-souls/images/c/c1/Go_won.jpg/revision/latest?cb=20230222204444",
      fallback: "/static/img/crown-prince.jpg",
      role: "The Sharpest Blade, the Loneliest Heir", house: "the royal court",
      element: "water", glyph: "冠",
      location: "Cheonbugwan · the royal court",
      excerpt: "Every lesson taught him to win; none taught him how to rest afterward.",
      bio: [
        "The Crown Prince of Daeho is the sword the realm keeps drawn — brilliant, sharp, and marooned at the centre of a court that smiles in a language he stopped trusting years ago. He reads betrayal in every bow, because it is usually there.",
        "Those close to him whisper that the sharpness is armour before it is talent: a boy trained to win every argument and never taught that stillness is not the same as surrender. He is the realm's hope, and quietly, the realm's loneliest man."
      ],
      lines: [
        "“When every hand bows to you, you learn to count the ones that mean it.”"
      ],
      relationships: [
        { name: "Jang Uk", note: "the only peer who forgets to bow", link: "jang-uk" }
      ],
      tags: ["water", "royal", "court"]
    },
    {
      id: "seo-yul", name: "Seo Yul", korean: "서율",
      art: "https://static.wikia.nocookie.net/alchemy-of-souls/images/7/7b/Seo_yul.jpg/revision/latest?cb=20230222194721",
      role: "The Realm's Most Beautiful Blade", house: "the noble Seo house",
      element: "water", glyph: "律",
      location: "Daeho · the noble quarter",
      excerpt: "Daeho's most beautiful man — and its sharpest unclaimed blade.",
      bio: [
        "Seo Yul of the Seo house is a prodigy whose beauty the realm gossips about and whose sword it has learned to respect. He moves through Daeho's courts the way the lake reflects daylight — effortlessly, and not quite honestly.",
        "Denied the inheritance his birth should have promised, he taught himself that grace is armour: smile first, so no one sees the edge. Behind the famous beauty is a quiet hunger to be more than Daeho's prettiest rumour."
      ],
      lines: [
        "“They say beauty is a blade that needs no edge. They forget I am also a blade.”"
      ],
      relationships: [
        { name: "Jang Uk", note: "a friend hidden inside a rivalry", link: "jang-uk" },
        { name: "Mu-Deok", note: "who keeps surprising even him", link: "bubu" }
      ],
      tags: ["water", "swordsman", "noble"]
    },
    {
      id: "park-jin", name: "Park Jin", korean: "박진",
      art: "https://static.wikia.nocookie.net/alchemy-of-souls/images/a/ad/Park_jin.jpg/revision/latest?cb=20230222204559",
      role: "The Upstart of Daeho's Mages", house: "Jinyowon's outer halls",
      element: "fire", glyph: "鎭",
      location: "Jinyowon · the outer halls",
      excerpt: "A working-class mage who climbed to the top by refusing to be ignored.",
      bio: [
        "Park Jin earned his place at the summit of Daeho's mage circles with neither great blood nor great luck — only grit, quick wit, and the nerve to swing at anyone who looked down on him. He is the realm's favourite underdog: loud, proud, impossible to dismiss.",
        "Where the old houses hoard their arts, Park Jin treats power as a trade to be won in the open. He has spent as much energy holding his seat as using it — and he enjoys both entirely."
      ],
      lines: [
        "“Born with nothing, taught by no one — and here I am. Still. Annoying, isn't it.”"
      ],
      relationships: [
        { name: "Jang Uk", note: "the storm he keeps warning", link: "jang-uk" },
        { name: "Kim Do-ju", note: "the mage he never trusted", link: "kim-do-ju" }
      ],
      tags: ["fire", "mage", "underdog"]
    },
    {
      id: "kim-do-ju", name: "Kim Do-ju", korean: "김도주",
      art: "https://static.wikia.nocookie.net/alchemy-of-souls/images/6/62/Kim_do_ju.jpeg/revision/latest?cb=20230222204730",
      role: "The Mask Behind the Hearth", house: "the court's shadow",
      element: "fire", glyph: "暗",
      location: "Daeho · the court's shadow",
      excerpt: "The mage who wore a mother's face as a mask — and a viper underneath.",
      bio: [
        "Kim Do-ju is a mage of terrible skill and infinite patience, best remembered for the years she spent wearing a facade of warmth inside a great house. She taught in daylight and schemed in shadow, moving pieces no one knew were on the board.",
        "When the mask finally came away, the realm understood why she was feared — not for brute strength, but for how deeply she had stitched herself into the house's seams, so that unpicking her meant unpicking everything around her."
      ],
      lines: [
        "“A mask is only useful as long as the hand behind it is never seen.”"
      ],
      relationships: [
        { name: "Jang Uk", note: "the child she claimed, then betrayed", link: "jang-uk" },
        { name: "Jang Gang", note: "whose ruin she served", link: "jang-gang" }
      ],
      tags: ["fire", "schemer", "mask"]
    }
  ]
};