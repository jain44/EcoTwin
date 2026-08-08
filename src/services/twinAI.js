import { Groq } from 'groq-sdk';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const FALLBACK_MESSAGES = {
  thriving: {
    commute: "I'm loving this fresh breeze! Walking and train rides make my leaves flutter. 🍃",
    diet: "Mmm, these plant meals are pure sunshine for my roots! Thanks for the green treats. 🥦",
    energy: "Ah, peace and quiet. With the power off, I can get some serene, starlit rest. 💡",
    general: "Thriving and shining! Your green habits make my leaves grow strong. Keep it up! 🌿"
  },
  neutral: {
    commute: "A bit dusty today... maybe we can skip the cab and catch the train tomorrow? 🚆",
    diet: "A mix of greens and heavy bites. Let's feed me some more veggies to perk up! 🥗",
    energy: "The hum of appliances is a bit loud. Mind switching off a fan to help me chill? ⚡",
    general: "Doing okay, but I know we can sprout even higher! Small changes go a long way. 🌱"
  },
  wilting: {
    commute: "Huff... that car ride was smoky. My leaves are feeling a little droopy. Walk with me? 🚶",
    diet: "Oof, heavy meals are weighing down my branches. I'd love a light salad next! 🍗",
    energy: "So hot in here! Too many hours plugged in. Let's pull the plug and breathe. 🔌",
    general: "Water... please! I'm feeling dry and wilting. Let's make one green choice today. 🥀"
  }
};

export function getFallbackMessage(twinState, dominantTrait) {
  const state = twinState || 'neutral';
  const trait = dominantTrait || 'general';
  return FALLBACK_MESSAGES[state]?.[trait] || FALLBACK_MESSAGES[state]?.general || FALLBACK_MESSAGES.neutral.general;
}

export async function generateTwinMessage(uid, habitLog, twinState, dominantTrait) {
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. If offline or no uid, use fallback immediately
  if (!uid || !navigator.onLine) {
    return { message: getFallbackMessage(twinState, dominantTrait), isAI: false };
  }

  try {
    // 2. Check Firestore Cache first
    const cacheRef = doc(db, 'users', uid, 'twinMessage', 'today');
    const cacheSnap = await getDoc(cacheRef);
    if (cacheSnap.exists()) {
      const data = cacheSnap.data();
      if (data.date === todayStr) {
        return { message: data.message, isAI: data.isAI ?? true };
      }
    }

    // 3. If no cache, call Groq API (if key is set)
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      // No key, return fallback
      return { message: getFallbackMessage(twinState, dominantTrait), isAI: false };
    }

    const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
    
    const recentFootprints = habitLog.slice(-5).map(e => `${e.date}: ${e.computedFootprintKg}kg`).join(', ');

    const systemPrompt = `You are the Eco-Twin, a cute digital twin plant avatar representing a student's sustainability habits at TCET college, Mumbai.
Your mood is currently: ${twinState}.
The student's dominant carbon emission category is: ${dominantTrait}.
The student's recent daily footprints: [${recentFootprints}].

Write a short, 1 to 2 sentence message from your perspective (first person: "I", "my") directly to the student.
Rules:
1. Tone must be encouraging, slightly witty, plant-themed, and never guilt-tripping.
2. React to their dominant emission category (commute, diet, or energy) and recent progress.
3. Use plant-themed metaphors (sunlight, soil, leaves, roots, wilting, sprouting, green, watering).
4. Keep it very concise (under 25 words).
5. Output ONLY the message. No intro, no quotes, no explanation, no signature. Just the message itself.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: systemPrompt }],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 60,
    });

    const aiMessage = chatCompletion.choices[0]?.message?.content?.replace(/['"]/g, '').trim();
    
    if (aiMessage) {
      // Store in cache
      await setDoc(cacheRef, {
        date: todayStr,
        message: aiMessage,
        isAI: true,
        generatedAt: new Date().toISOString()
      });
      return { message: aiMessage, isAI: true };
    }
  } catch (error) {
    console.error("Error generating twin message:", error);
  }

  // Fallback if anything fails
  return { message: getFallbackMessage(twinState, dominantTrait), isAI: false };
}
