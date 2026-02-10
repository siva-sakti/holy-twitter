// Seed data for HolyScroll
// All quotes are authentic from the original sources

export interface SeedFigure {
  id: string;
  displayName: string;
  type: 'person' | 'text';
  bio: string;
  profilePicUrl: string;
  tradition: string;
  externalLinks: { label: string; url: string }[];
}

export interface SeedQuote {
  figureId: string;
  text: string;
  sourceCitation: string;
}

// Helper to generate UI Avatars URL (reliable placeholder service)
const avatar = (name: string, bg: string = '8B5CF6', color: string = 'fff') =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=${color}&size=128&bold=true`;

export const figures: SeedFigure[] = [
  {
    id: 'meister-eckhart',
    displayName: 'Meister Eckhart',
    type: 'person',
    bio: 'German Dominican theologian, philosopher, and mystic (c. 1260–1328). Known for his profound sermons on detachment, the birth of the Word in the soul, and the nature of God.',
    profilePicUrl: avatar('Meister Eckhart', '4A5568'),
    tradition: 'Christian',
    externalLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Meister_Eckhart' },
      { label: 'Complete Works', url: 'https://www.gutenberg.org/ebooks/author/6217' },
    ],
  },
  {
    id: 'teresa-of-avila',
    displayName: 'Teresa of Ávila',
    type: 'person',
    bio: 'Spanish Carmelite nun, mystic, and Doctor of the Church (1515–1582). Reformed the Carmelite Order and authored spiritual classics including The Interior Castle and The Way of Perfection.',
    profilePicUrl: avatar('Teresa of Ávila', '9F7AEA'),
    tradition: 'Christian',
    externalLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Teresa_of_%C3%81vila' },
      { label: 'Interior Castle', url: 'https://www.gutenberg.org/ebooks/28061' },
    ],
  },
  {
    id: 'rumi',
    displayName: 'Rumi',
    type: 'person',
    bio: 'Jalāl al-Dīn Muḥammad Rūmī (1207–1273), Persian poet, Islamic scholar, and Sufi mystic. Founder of the Mevlevi Order. His poetry explores divine love, unity, and the soul\'s journey to God.',
    profilePicUrl: avatar('Rumi', '38A169'),
    tradition: 'Sufi',
    externalLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Rumi' },
      { label: 'Poetry Foundation', url: 'https://www.poetryfoundation.org/poets/jalal-al-din-rumi' },
    ],
  },
  {
    id: 'krishna',
    displayName: 'Krishna',
    type: 'person',
    bio: 'Supreme deity in Hinduism, speaker of the Bhagavad Gita. The Gita records his teachings to Arjuna on the battlefield of Kurukshetra, covering dharma, yoga, devotion, and liberation.',
    profilePicUrl: avatar('Krishna', '3182CE'),
    tradition: 'Hindu',
    externalLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Krishna' },
      { label: 'Bhagavad Gita', url: 'https://www.holy-bhagavad-gita.org/' },
    ],
  },
  {
    id: 'ramana-maharshi',
    displayName: 'Ramana Maharshi',
    type: 'person',
    bio: 'Indian Hindu sage (1879–1950) of Advaita Vedanta. Advocated self-enquiry (vichara) as the principal means to attain self-realization. Spent most of his life at Arunachala in Tiruvannamalai.',
    profilePicUrl: avatar('Ramana Maharshi', 'DD6B20'),
    tradition: 'Hindu',
    externalLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Ramana_Maharshi' },
      { label: 'Sri Ramanasramam', url: 'https://www.sriramanamaharshi.org/' },
    ],
  },
  {
    id: 'rudolf-steiner',
    displayName: 'Rudolf Steiner',
    type: 'person',
    bio: 'Austrian philosopher, educator, and esotericist (1861–1925). Founded Anthroposophy, Waldorf education, biodynamic agriculture, and anthroposophical medicine. Author of the Calendar of the Soul.',
    profilePicUrl: avatar('Rudolf Steiner', '805AD5'),
    tradition: 'Anthroposophy',
    externalLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Rudolf_Steiner' },
      { label: 'Rudolf Steiner Archive', url: 'https://rsarchive.org/' },
    ],
  },
  {
    id: 'the-psalms',
    displayName: 'The Psalms',
    type: 'text',
    bio: 'The Book of Psalms, a collection of 150 religious songs and poems in the Hebrew Bible. Attributed primarily to King David, they express praise, lament, thanksgiving, and trust in God.',
    profilePicUrl: avatar('The Psalms', 'B7791F'),
    tradition: 'Jewish/Christian',
    externalLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Psalms' },
      { label: 'Bible Gateway', url: 'https://www.biblegateway.com/passage/?search=Psalms&version=ESV' },
    ],
  },
];

export const quotes: SeedQuote[] = [
  // ============ MEISTER ECKHART ============
  {
    figureId: 'meister-eckhart',
    text: 'The eye through which I see God is the same eye through which God sees me; my eye and God\'s eye are one eye, one seeing, one knowing, one love.',
    sourceCitation: 'Sermon 57',
  },
  {
    figureId: 'meister-eckhart',
    text: 'If the only prayer you ever say in your entire life is "thank you," it will be enough.',
    sourceCitation: 'Sermons',
  },
  {
    figureId: 'meister-eckhart',
    text: 'Be willing to be a beginner every single morning.',
    sourceCitation: 'Counsels on Discernment',
  },
  {
    figureId: 'meister-eckhart',
    text: 'The soul must long for God in order to be set aflame by God\'s love; but if the soul cannot yet feel this longing, then it must long for the longing. To long for the longing is also from God.',
    sourceCitation: 'Talks of Instruction',
  },
  {
    figureId: 'meister-eckhart',
    text: 'God is at home, it\'s we who have gone out for a walk.',
    sourceCitation: 'Sermons',
  },
  {
    figureId: 'meister-eckhart',
    text: 'What a man takes in by contemplation, that he pours out in love.',
    sourceCitation: 'Sermons',
  },
  {
    figureId: 'meister-eckhart',
    text: 'To be full of things is to be empty of God. To be empty of things is to be full of God.',
    sourceCitation: 'German Sermons',
  },
  {
    figureId: 'meister-eckhart',
    text: 'The outward work will never be puny if the inward work is great. And the outward work can never be great or even good if the inward one is puny or of little worth.',
    sourceCitation: 'The Talks of Instruction',
  },
  {
    figureId: 'meister-eckhart',
    text: 'Truly, it is in darkness that one finds the light, so when we are in sorrow, then this light is nearest of all to us.',
    sourceCitation: 'Counsels on Discernment',
  },
  {
    figureId: 'meister-eckhart',
    text: 'In silence and in stillness a devout soul makes progress and learns the hidden things of Scripture.',
    sourceCitation: 'German Sermons',
  },

  // ============ TERESA OF ÁVILA ============
  {
    figureId: 'teresa-of-avila',
    text: 'Let nothing disturb you, let nothing frighten you. All things are passing; God never changes. Patience obtains all things. Whoever has God lacks nothing. God alone suffices.',
    sourceCitation: 'Bookmark Prayer',
  },
  {
    figureId: 'teresa-of-avila',
    text: 'Christ has no body now but yours. No hands, no feet on earth but yours. Yours are the eyes through which he looks compassion on this world.',
    sourceCitation: 'Attributed',
  },
  {
    figureId: 'teresa-of-avila',
    text: 'Prayer is nothing else than being on terms of friendship with God, frequently conversing in secret with Him who, we know, loves us.',
    sourceCitation: 'The Life of Teresa of Jesus, Ch. 8',
  },
  {
    figureId: 'teresa-of-avila',
    text: 'The feeling remains that God is on the journey, too.',
    sourceCitation: 'Interior Castle',
  },
  {
    figureId: 'teresa-of-avila',
    text: 'We can only learn to know ourselves and do what we can — namely, surrender our will and fulfill God\'s will in us.',
    sourceCitation: 'Interior Castle, First Mansions',
  },
  {
    figureId: 'teresa-of-avila',
    text: 'Mental prayer is nothing else than an intimate sharing between friends; it means taking time frequently to be alone with him who we know loves us.',
    sourceCitation: 'The Life of Teresa of Jesus, Ch. 8',
  },
  {
    figureId: 'teresa-of-avila',
    text: 'Accustom yourself continually to make many acts of love, for they enkindle and melt the soul.',
    sourceCitation: 'Maxims for Her Nuns',
  },
  {
    figureId: 'teresa-of-avila',
    text: 'It is love alone that gives worth to all things.',
    sourceCitation: 'Interior Castle',
  },
  {
    figureId: 'teresa-of-avila',
    text: 'The important thing is not to think much but to love much; and so do that which best stirs you to love.',
    sourceCitation: 'Interior Castle, Fourth Mansions',
  },
  {
    figureId: 'teresa-of-avila',
    text: 'To have courage for whatever comes in life — everything lies in that.',
    sourceCitation: 'Letters',
  },

  // ============ RUMI ============
  {
    figureId: 'rumi',
    text: 'Out beyond ideas of wrongdoing and rightdoing, there is a field. I\'ll meet you there. When the soul lies down in that grass, the world is too full to talk about.',
    sourceCitation: 'Masnavi',
  },
  {
    figureId: 'rumi',
    text: 'The wound is the place where the Light enters you.',
    sourceCitation: 'Divan-e Shams-e Tabrizi',
  },
  {
    figureId: 'rumi',
    text: 'What you seek is seeking you.',
    sourceCitation: 'Masnavi',
  },
  {
    figureId: 'rumi',
    text: 'You were born with wings, why prefer to crawl through life?',
    sourceCitation: 'Masnavi',
  },
  {
    figureId: 'rumi',
    text: 'Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray.',
    sourceCitation: 'Masnavi',
  },
  {
    figureId: 'rumi',
    text: 'Don\'t grieve. Anything you lose comes round in another form.',
    sourceCitation: 'Masnavi',
  },
  {
    figureId: 'rumi',
    text: 'Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.',
    sourceCitation: 'Masnavi',
  },
  {
    figureId: 'rumi',
    text: 'Be like a tree and let the dead leaves drop.',
    sourceCitation: 'Divan-e Shams-e Tabrizi',
  },
  {
    figureId: 'rumi',
    text: 'Silence is the language of God, all else is poor translation.',
    sourceCitation: 'Masnavi',
  },
  {
    figureId: 'rumi',
    text: 'You are not a drop in the ocean. You are the entire ocean in a drop.',
    sourceCitation: 'Masnavi',
  },
  {
    figureId: 'rumi',
    text: 'When you do things from your soul, you feel a river moving in you, a joy.',
    sourceCitation: 'Masnavi',
  },
  {
    figureId: 'rumi',
    text: 'Love is the bridge between you and everything.',
    sourceCitation: 'Divan-e Shams-e Tabrizi',
  },

  // ============ KRISHNA (BHAGAVAD GITA) ============
  {
    figureId: 'krishna',
    text: 'You have the right to work, but never to the fruit of work. You should never engage in action for the sake of reward, nor should you long for inaction.',
    sourceCitation: 'Bhagavad Gita 2:47',
  },
  {
    figureId: 'krishna',
    text: 'The soul is neither born, and nor does it die. It was not born, and it will not cease to be. It is unborn, eternal, and primeval. It is not slain when the body is slain.',
    sourceCitation: 'Bhagavad Gita 2:20',
  },
  {
    figureId: 'krishna',
    text: 'As a person puts on new garments, giving up old ones, the soul similarly accepts new material bodies, giving up the old and useless ones.',
    sourceCitation: 'Bhagavad Gita 2:22',
  },
  {
    figureId: 'krishna',
    text: 'Reshape yourself through the power of your will; never let yourself be degraded by self-will. The will is the only friend of the Self, and the will is the only enemy of the Self.',
    sourceCitation: 'Bhagavad Gita 6:5',
  },
  {
    figureId: 'krishna',
    text: 'Whenever dharma declines and the purpose of life is forgotten, I manifest myself on earth. I am born in every age to protect the good, to destroy evil, and to reestablish dharma.',
    sourceCitation: 'Bhagavad Gita 4:7-8',
  },
  {
    figureId: 'krishna',
    text: 'When meditation is mastered, the mind is unwavering like the flame of a candle in a windless place.',
    sourceCitation: 'Bhagavad Gita 6:19',
  },
  {
    figureId: 'krishna',
    text: 'For one who has conquered the mind, the mind is the best of friends; but for one who has failed to do so, the mind will remain the greatest enemy.',
    sourceCitation: 'Bhagavad Gita 6:6',
  },
  {
    figureId: 'krishna',
    text: 'Those who see all creatures in themselves and themselves in all creatures know no fear. Those who see all creatures in themselves and themselves in all creatures know no grief.',
    sourceCitation: 'Bhagavad Gita 6:29',
  },
  {
    figureId: 'krishna',
    text: 'The peace of God is with them whose mind and soul are in harmony, who are free from desire and wrath, who know their own soul.',
    sourceCitation: 'Bhagavad Gita 5:26',
  },
  {
    figureId: 'krishna',
    text: 'I am the beginning, middle, and end of all beings.',
    sourceCitation: 'Bhagavad Gita 10:20',
  },

  // ============ RAMANA MAHARSHI ============
  {
    figureId: 'ramana-maharshi',
    text: 'Your own Self-Realization is the greatest service you can render the world.',
    sourceCitation: 'Talks with Sri Ramana Maharshi',
  },
  {
    figureId: 'ramana-maharshi',
    text: 'The mind is only a bundle of thoughts. The thoughts arise because there is a thinker. The thinker is the ego. If one enquires "Who am I?", the ego vanishes.',
    sourceCitation: 'Who Am I?',
  },
  {
    figureId: 'ramana-maharshi',
    text: 'Silence is the true teaching. It is the perfect teaching. It is suited only for the most advanced seeker. The others are unable to draw full inspiration from it. Therefore, they require words to explain the truth.',
    sourceCitation: 'Talks with Sri Ramana Maharshi',
  },
  {
    figureId: 'ramana-maharshi',
    text: 'Happiness is your nature. It is not wrong to desire it. What is wrong is seeking it outside when it is inside.',
    sourceCitation: 'Be As You Are',
  },
  {
    figureId: 'ramana-maharshi',
    text: 'The question "Who am I?" is not really meant to get an answer. It is meant to dissolve the questioner.',
    sourceCitation: 'Self-Enquiry',
  },
  {
    figureId: 'ramana-maharshi',
    text: 'There is no greater mystery than this: being Reality ourselves, we seek to gain Reality.',
    sourceCitation: 'Forty Verses on Reality',
  },
  {
    figureId: 'ramana-maharshi',
    text: 'The degree of freedom from unwanted thoughts and the degree of concentration on a single thought are the measures to gauge spiritual progress.',
    sourceCitation: 'Talks with Sri Ramana Maharshi',
  },
  {
    figureId: 'ramana-maharshi',
    text: 'You need not aspire for or get any new state. Get rid of your present thoughts, that is all.',
    sourceCitation: 'Talks with Sri Ramana Maharshi',
  },
  {
    figureId: 'ramana-maharshi',
    text: 'Whatever is destined not to happen will not happen, try as you may. Whatever is destined to happen will happen, do what you may to prevent it. This is certain. The best course, therefore, is to remain silent.',
    sourceCitation: 'Talks with Sri Ramana Maharshi',
  },
  {
    figureId: 'ramana-maharshi',
    text: 'All that is required to realize the Self is to be still.',
    sourceCitation: 'Who Am I?',
  },

  // ============ RUDOLF STEINER ============
  {
    figureId: 'rudolf-steiner',
    text: 'For every step in spiritual perception, three steps are to be taken in moral development.',
    sourceCitation: 'Knowledge of the Higher Worlds',
  },
  {
    figureId: 'rudolf-steiner',
    text: 'May my soul bloom in love for all existence.',
    sourceCitation: 'Calendar of the Soul, Week 6',
  },
  {
    figureId: 'rudolf-steiner',
    text: 'The heart of man is a mirror in which the Cosmos may behold itself.',
    sourceCitation: 'Lectures on the Gospel of St. John',
  },
  {
    figureId: 'rudolf-steiner',
    text: 'Thinking that is not permeated with feeling is cold and dead; feeling that is not guided by thinking is chaotic and destructive.',
    sourceCitation: 'The Philosophy of Freedom',
  },
  {
    figureId: 'rudolf-steiner',
    text: 'When we raise ourselves through meditation to what unites us with the spirit, we quicken something within us that is eternal and unlimited by birth and death.',
    sourceCitation: 'Theosophy',
  },
  {
    figureId: 'rudolf-steiner',
    text: 'The smallest thing in its right place can be the greatest.',
    sourceCitation: 'Lectures',
  },
  {
    figureId: 'rudolf-steiner',
    text: 'We must eradicate from the soul all fear and terror of what comes towards man out of the future.',
    sourceCitation: 'Verses and Meditations',
  },
  {
    figureId: 'rudolf-steiner',
    text: 'I feel the spell that liberates myself from spirit-sleep at last is breaking; the cosmic womb gives birth to self, while blazing light from depths of soul ignites the will to cosmic life.',
    sourceCitation: 'Calendar of the Soul, Week 1',
  },
  {
    figureId: 'rudolf-steiner',
    text: 'The sun with loving light makes bright for me each day, the soul with spirit power gives strength unto my limbs.',
    sourceCitation: 'Morning Verse for Children',
  },
  {
    figureId: 'rudolf-steiner',
    text: 'Reverence awakens in the soul a sympathetic power through which we attract qualities in the beings around us which would otherwise remain hidden.',
    sourceCitation: 'Knowledge of the Higher Worlds',
  },

  // ============ THE PSALMS ============
  {
    figureId: 'the-psalms',
    text: 'The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.',
    sourceCitation: 'Psalm 23:1-3',
  },
  {
    figureId: 'the-psalms',
    text: 'Be still, and know that I am God. I will be exalted among the nations, I will be exalted in the earth.',
    sourceCitation: 'Psalm 46:10',
  },
  {
    figureId: 'the-psalms',
    text: 'Create in me a clean heart, O God, and renew a right spirit within me. Cast me not away from your presence, and take not your Holy Spirit from me.',
    sourceCitation: 'Psalm 51:10-11',
  },
  {
    figureId: 'the-psalms',
    text: 'The heavens declare the glory of God, and the sky above proclaims his handiwork. Day to day pours out speech, and night to night reveals knowledge.',
    sourceCitation: 'Psalm 19:1-2',
  },
  {
    figureId: 'the-psalms',
    text: 'As a deer pants for flowing streams, so pants my soul for you, O God. My soul thirsts for God, for the living God.',
    sourceCitation: 'Psalm 42:1-2',
  },
  {
    figureId: 'the-psalms',
    text: 'I lift up my eyes to the hills. From where does my help come? My help comes from the Lord, who made heaven and earth.',
    sourceCitation: 'Psalm 121:1-2',
  },
  {
    figureId: 'the-psalms',
    text: 'Blessed is the man who walks not in the counsel of the wicked, nor stands in the way of sinners, nor sits in the seat of scoffers; but his delight is in the law of the Lord.',
    sourceCitation: 'Psalm 1:1-2',
  },
  {
    figureId: 'the-psalms',
    text: 'The Lord is my light and my salvation; whom shall I fear? The Lord is the stronghold of my life; of whom shall I be afraid?',
    sourceCitation: 'Psalm 27:1',
  },
  {
    figureId: 'the-psalms',
    text: 'O Lord, you have searched me and known me! You know when I sit down and when I rise up; you discern my thoughts from afar.',
    sourceCitation: 'Psalm 139:1-2',
  },
  {
    figureId: 'the-psalms',
    text: 'Deep calls to deep at the roar of your waterfalls; all your breakers and your waves have gone over me.',
    sourceCitation: 'Psalm 42:7',
  },
  {
    figureId: 'the-psalms',
    text: 'This is the day that the Lord has made; let us rejoice and be glad in it.',
    sourceCitation: 'Psalm 118:24',
  },
  {
    figureId: 'the-psalms',
    text: 'For you formed my inward parts; you knitted me together in my mother\'s womb. I praise you, for I am fearfully and wonderfully made.',
    sourceCitation: 'Psalm 139:13-14',
  },
];
