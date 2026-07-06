export interface DeliveryPartner {
  id: string;
  name: string;
  avatar: string; // High-quality profile picture URL
  rating: number; // 4.6–5.0
  totalDeliveries: number;
  vehicleType: 'Scooter' | 'Bike';
  vehicleNumber: string;
  phoneNumber: string;
  experienceBadge: string;
  voicePitch: number; // For SpeechSynthesis synthesis customization
  voiceRate: number;  // Voice speech rate
}

export interface VoiceMessage {
  speaker: 'partner' | 'customer';
  text: string;
}

export interface VoiceScript {
  id: string;
  scenarioName: string;
  messages: VoiceMessage[];
}

export const DELIVERY_PARTNERS: DeliveryPartner[] = [
  {
    id: 'partner-1',
    name: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 4.9,
    totalDeliveries: 1240,
    vehicleType: 'Scooter',
    vehicleNumber: 'KA-05-AB-4587',
    phoneNumber: '+91 98765 04123',
    experienceBadge: 'Pro Courier 🏆',
    voicePitch: 1.05,
    voiceRate: 0.95
  },
  {
    id: 'partner-2',
    name: 'Aman Verma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 4.8,
    totalDeliveries: 820,
    vehicleType: 'Bike',
    vehicleNumber: 'KA-03-MK-7281',
    phoneNumber: '+91 91234 56789',
    experienceBadge: 'Speed Star ⚡',
    voicePitch: 0.90,
    voiceRate: 1.05
  },
  {
    id: 'partner-3',
    name: 'Aditya Das',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 4.7,
    totalDeliveries: 510,
    vehicleType: 'Scooter',
    vehicleNumber: 'KA-51-EF-9912',
    phoneNumber: '+91 98760 12345',
    experienceBadge: 'Customer Favorite ❤️',
    voicePitch: 1.15,
    voiceRate: 0.92
  },
  {
    id: 'partner-4',
    name: 'Rakesh Kumar',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 5.0,
    totalDeliveries: 1950,
    vehicleType: 'Bike',
    vehicleNumber: 'KA-01-XY-3401',
    phoneNumber: '+91 95551 23456',
    experienceBadge: 'Elite Veteran 🎖️',
    voicePitch: 0.85,
    voiceRate: 1.0
  },
  {
    id: 'partner-5',
    name: 'Soham Mishra',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 4.6,
    totalDeliveries: 430,
    vehicleType: 'Scooter',
    vehicleNumber: 'KA-04-HG-8821',
    phoneNumber: '+91 90001 88822',
    experienceBadge: 'Eco Rider 🌱',
    voicePitch: 1.2,
    voiceRate: 1.1
  },
  {
    id: 'partner-6',
    name: 'Arjun Patel',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 4.9,
    totalDeliveries: 1450,
    vehicleType: 'Bike',
    vehicleNumber: 'KA-02-JK-1109',
    phoneNumber: '+91 97778 12300',
    experienceBadge: 'Rain Specialist 🌧️',
    voicePitch: 0.95,
    voiceRate: 0.98
  },
  {
    id: 'partner-7',
    name: 'Vivek Singh',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 4.8,
    totalDeliveries: 980,
    vehicleType: 'Scooter',
    vehicleNumber: 'KA-05-PQ-5524',
    phoneNumber: '+91 98881 99911',
    experienceBadge: 'Local Guide 🗺️',
    voicePitch: 1.1,
    voiceRate: 1.05
  },
  {
    id: 'partner-8',
    name: 'Satyajit Mohanty',
    avatar: 'https://images.unsplash.com/photo-1542343633-ce7a21021f43?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 4.7,
    totalDeliveries: 320,
    vehicleType: 'Bike',
    vehicleNumber: 'KA-11-AA-4455',
    phoneNumber: '+91 96660 77711',
    experienceBadge: 'Rising Star ⭐',
    voicePitch: 1.0,
    voiceRate: 0.9
  },
  {
    id: 'partner-9',
    name: 'Karan Gupta',
    avatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 4.9,
    totalDeliveries: 1670,
    vehicleType: 'Scooter',
    vehicleNumber: 'KA-03-ZZ-8899',
    phoneNumber: '+91 94440 33322',
    experienceBadge: 'Night Owl 🦉',
    voicePitch: 0.88,
    voiceRate: 1.0
  },
  {
    id: 'partner-10',
    name: 'Rohit Das',
    avatar: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 4.8,
    totalDeliveries: 1100,
    vehicleType: 'Bike',
    vehicleNumber: 'KA-05-LM-6021',
    phoneNumber: '+91 91112 33344',
    experienceBadge: 'Hyperlocal Guru 🛵',
    voicePitch: 1.02,
    voiceRate: 1.12
  },
  {
    id: 'partner-11',
    name: 'Ayush Nayak',
    avatar: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 4.9,
    totalDeliveries: 740,
    vehicleType: 'Scooter',
    vehicleNumber: 'KA-53-TT-2233',
    phoneNumber: '+91 92225 66677',
    experienceBadge: 'Smiles Agent 😊',
    voicePitch: 1.08,
    voiceRate: 1.0
  },
  {
    id: 'partner-12',
    name: 'Manish Sahoo',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 5.0,
    totalDeliveries: 2100,
    vehicleType: 'Bike',
    vehicleNumber: 'KA-01-QQ-9988',
    phoneNumber: '+91 93334 55566',
    experienceBadge: 'Master Captain 👨‍✈️',
    voicePitch: 0.82,
    voiceRate: 0.95
  }
];

export const VOICE_CONVERSATIONS: VoiceScript[] = [
  {
    id: 'script-1',
    scenarioName: 'Standard Gate Delivery',
    messages: [
      { speaker: 'partner', text: "Hello! This is your delivery partner from Brew and Bites. I have reached your location. Could you please come outside to collect your order? Thank you!" },
      { speaker: 'customer', text: "Thank you. I'm coming downstairs now." },
      { speaker: 'partner', text: "Perfect. I'll wait near the main gate." }
    ]
  },
  {
    id: 'script-2',
    scenarioName: 'Rainy Covered Lobby',
    messages: [
      { speaker: 'partner', text: "Hello! Good afternoon. I'm outside your building, but it is raining quite heavily here. Are you able to meet me near the covered lobby area?" },
      { speaker: 'customer', text: "Yes, sure! I'll grab my umbrella and be right down in a minute." },
      { speaker: 'partner', text: "No problem at all! Please take your time, safety first. I'm waiting in the dry area." }
    ]
  },
  {
    id: 'script-3',
    scenarioName: 'Doorstep Drop Handle',
    messages: [
      { speaker: 'partner', text: "Hi, this is your Brew and Bites rider. I am outside your apartment door. Should I ring the bell or leave the bag on the handle?" },
      { speaker: 'customer', text: "Please leave it on the handle and knock once. Thank you so much!" },
      { speaker: 'partner', text: "Understood! I have placed it safely and knocked. Enjoy your warm coffee!" }
    ]
  },
  {
    id: 'script-4',
    scenarioName: 'Confusing Block Elevator',
    messages: [
      { speaker: 'partner', text: "Hello! I have entered your society gate, but there are multiple blocks here. Is it Block B or Block C for your apartment?" },
      { speaker: 'customer', text: "It is Block B, third floor, flat three-zero-four. Take the left elevator." },
      { speaker: 'partner', text: "Ah, got it! Block B on the left. I'll be at your doorstep in just a minute." }
    ]
  },
  {
    id: 'script-5',
    scenarioName: 'Security Gate Approval',
    messages: [
      { speaker: 'partner', text: "Hi, this is your delivery partner. The security guard at the main gate is asking for your flat confirmation. Can I pass the phone to him?" },
      { speaker: 'customer', text: "Oh, let me approve it on my intercom, or you can tell him it is for Souvik." },
      { speaker: 'partner', text: "Okay, I told him and he has allowed me in. Coming up to your floor now!" }
    ]
  },
  {
    id: 'script-6',
    scenarioName: 'Hot Cups Warning',
    messages: [
      { speaker: 'partner', text: "Hello! This is your driver. I've arrived with your fresh brew. The cups are extremely hot, so please hold the thermal tray carefully when you take it." },
      { speaker: 'customer', text: "Thanks for the heads up, I will be careful. Be right down!" },
      { speaker: 'partner', text: "My pleasure! See you in a moment near the reception desk." }
    ]
  },
  {
    id: 'script-7',
    scenarioName: 'Cold Shakes Melting Alert',
    messages: [
      { speaker: 'partner', text: "Hi! I have arrived with your cold milkshakes. Since the weather is a bit warm, I want to deliver it immediately before it starts melting." },
      { speaker: 'customer', text: "Thank you! I am stepping out of my flat right now to collect it." },
      { speaker: 'partner', text: "Great, I am standing near the lift lobby with your insulated bag ready." }
    ]
  },
  {
    id: 'script-8',
    scenarioName: 'Reception Drop ms Priya',
    messages: [
      { speaker: 'partner', text: "Hello, this is your Brew and Bites courier. The security here says visitors aren't allowed upstairs. Should I leave your order at the reception desk?" },
      { speaker: 'customer', text: "Yes, please leave it with the receptionist. I will collect it shortly." },
      { speaker: 'partner', text: "Sure, I have kept it safely with Ms. Priya at the desk. Have a wonderful day!" }
    ]
  },
  {
    id: 'script-9',
    scenarioName: 'Elevator Out of Order stairs',
    messages: [
      { speaker: 'partner', text: "Hi! I am at your apartment building, but the main elevator seems to be under maintenance. I will take the stairs to reach your fourth floor." },
      { speaker: 'customer', text: "Oh, that's a lot of climbing! Let me walk down halfway so you don't have to walk all the way up." },
      { speaker: 'partner', text: "That is incredibly kind of you! Let's meet on the second-floor stairwell." }
    ]
  },
  {
    id: 'script-10',
    scenarioName: 'Low Battery Nameplate',
    messages: [
      { speaker: 'partner', text: "Hello, this is your rider. My phone battery is extremely low, but I am near the building. Is your apartment the one with the wooden nameplate?" },
      { speaker: 'customer', text: "Yes! It has the green plants and wooden nameplate right next to the stairs." },
      { speaker: 'partner', text: "Perfect, I see it now! Bringing your freshly sealed order right up." }
    ]
  },
  {
    id: 'script-11',
    scenarioName: 'Balcony Delivery Code',
    messages: [
      { speaker: 'partner', text: "Hi there! I am just turning into your street now. Could you please keep your delivery code ready so I can hand over the package quickly?" },
      { speaker: 'customer', text: "Sure, I have the order screen open. I am standing near my balcony." },
      { speaker: 'partner', text: "Wonderful! I am pulling up on my scooter right now. See you!" }
    ]
  },
  {
    id: 'script-12',
    scenarioName: 'No Bell Sleeping Baby',
    messages: [
      { speaker: 'partner', text: "Hello! I am outside your flat door. You mentioned in the instructions not to ring the bell because of a sleeping baby. Is that correct?" },
      { speaker: 'customer', text: "Yes, thank you so much for checking! I will open the door quietly now." },
      { speaker: 'partner', text: "Excellent. I have placed the package on the door-mat. Have a peaceful afternoon!" }
    ]
  },
  {
    id: 'script-13',
    scenarioName: 'Yellow Temple Lane',
    messages: [
      { speaker: 'partner', text: "Hi, this is your delivery partner. I am near the yellow temple you mentioned, but which lane should I turn into?" },
      { speaker: 'customer', text: "Take the immediate right lane after the temple. It is the third house on your left." },
      { speaker: 'partner', text: "Ah, yes! I see the blue gate now. I am parking outside. Thank you!" }
    ]
  },
  {
    id: 'script-14',
    scenarioName: 'Road Construction Walk',
    messages: [
      { speaker: 'partner', text: "Hello, sorry to bother you! I am just two minutes away, but there is some road construction near your gate. I am walking the remaining distance." },
      { speaker: 'customer', text: "Oh, thank you for walking! I will come out to the construction barrier to meet you." },
      { speaker: 'partner', text: "That would be fantastic, thank you so much for your cooperation!" }
    ]
  },
  {
    id: 'script-15',
    scenarioName: 'Eco Bicycle Stand',
    messages: [
      { speaker: 'partner', text: "Hi, this is your courier. I am delivering your meal on an eco-friendly bicycle and have just reached your lobby entrance. Could you meet me near the bicycle stand?" },
      { speaker: 'customer', text: "Absolutely! Love the green delivery. I am heading downstairs now." },
      { speaker: 'partner', text: "Thank you! Together we are saving some carbon emissions today. I'll be waiting." }
    ]
  },
  {
    id: 'script-16',
    scenarioName: 'Corporate Cafeteria Drop',
    messages: [
      { speaker: 'partner', text: "Hello! This is your Brew and Bites rider. I am at the corporate park main tower, but security says I can only deliver to the cafeteria." },
      { speaker: 'customer', text: "No problem, the cafeteria is perfect. I am sitting on the first-floor deck." },
      { speaker: 'partner', text: "Great, I am entering the cafeteria now in my yellow jacket. See you soon!" }
    ]
  },
  {
    id: 'script-17',
    scenarioName: 'Midnight Streetlamp Drop',
    messages: [
      { speaker: 'partner', text: "Good evening! I have arrived with your midnight snack. Since it is late, I am waiting quietly near the building gate to avoid disturbing the neighbors." },
      { speaker: 'customer', text: "Thank you for being so thoughtful! I'm coming out with my flashlight." },
      { speaker: 'partner', text: "Awesome! I'm parked right under the streetlamp. See you in a bit." }
    ]
  },
  {
    id: 'script-18',
    scenarioName: 'Double Order Hazelnut Mocha',
    messages: [
      { speaker: 'partner', text: "Hello! I have your Brew and Bites order here. I just want to double-check, did you order two items including the Hazelnut Mocha?" },
      { speaker: 'customer', text: "Yes, that's correct! One Hazelnut Mocha and one butter croissant." },
      { speaker: 'partner', text: "Perfect! Just verifying so you get the exact items fresh and hot. Arrived downstairs!" }
    ]
  },
  {
    id: 'script-19',
    scenarioName: 'Birthday Tag Special',
    messages: [
      { speaker: 'partner', text: "Hi, this is your delivery partner! I see a birthday tag on your order. Happy Birthday from Brew and Bites! I'm outside with your special dessert." },
      { speaker: 'customer', text: "Wow, thank you so much! That is such a sweet gesture." },
      { speaker: 'partner', text: "You're very welcome! I am holding it carefully. I'll see you near the lift." }
    ]
  },
  {
    id: 'script-20',
    scenarioName: 'Gourmet Thermal Tray',
    messages: [
      { speaker: 'partner', text: "Hello! I have arrived with your gourmet package. I've kept it in my thermal box all the way. Would you like me to hand it over in the tray?" },
      { speaker: 'customer', text: "Yes, please! I will take it with the tray. Be there in thirty seconds." },
      { speaker: 'partner', text: "Splendid! It is fresh, hot, and ready for you. See you now." }
    ]
  }
];
