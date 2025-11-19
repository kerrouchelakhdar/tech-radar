"""
AI Content Enhancer using Groq API
Optimized for Groq free tier: 30 requests/min, 14,400/day
"""
import os
import time
from typing import Optional
from groq import Groq
from dotenv import load_dotenv

load_dotenv()


class AIEnhancer:
    """Enhance short content using Groq's free LLM API with rate limiting"""
    
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        
        # AI enhancement is enabled if a valid key is found and not explicitly disabled
        user_enabled = os.getenv("ENABLE_AI_ENHANCEMENT", "true").lower()
        self.enabled = bool(api_key and api_key != "your_groq_api_key_here" and user_enabled == "true")
        
        if self.enabled:
            self.client = Groq(api_key=api_key)
        else:
            self.client = None

        self.model = "llama-3.1-8b-instant"
        self.min_length = int(os.getenv("AI_MIN_CONTENT_LENGTH", "400"))
        
        # Rate limiting for Groq free tier (30 req/min)
        self.delay_between_requests = 2.5  # ~24 req/min (safe)
        self.last_request_time = 0
        self.max_retries = 2
        
        # Limit enhancements per run
        self.max_per_run = int(os.getenv("AI_MAX_PER_RUN", "20"))
        self.count = 0
        
    def should_enhance(self, content: str) -> bool:
        """Check if content needs enhancement"""
        if not self.enabled or self.count >= self.max_per_run:
            return False
        
        from bs4 import BeautifulSoup
        text = BeautifulSoup(content, 'html.parser').get_text()
        return len(text.strip()) < self.min_length
    
    def _wait_for_rate_limit(self):
        """Rate limiting"""
        if self.last_request_time > 0:
            elapsed = time.time() - self.last_request_time
            if elapsed < self.delay_between_requests:
                time.sleep(self.delay_between_requests - elapsed)
        self.last_request_time = time.time()
    
    def enhance_content(self, short_content: str, title: str = "") -> Optional[str]:
        """Expand content using AI"""
        if not self.should_enhance(short_content):
            return None
        
        from bs4 import BeautifulSoup
        text = BeautifulSoup(short_content, 'html.parser').get_text(separator=' ', strip=True)
        
        for attempt in range(self.max_retries):
            try:
                self._wait_for_rate_limit()
                
                prompt = f"""As a professional tech editor, your task is to expand the following short content into a comprehensive and engaging article.

**Title:** "{title}"

**Original Content:**
"{text}"

**Your Task:**
1.  **Expand:** Write a full article of at least 5 high-quality paragraphs and 600-800 words.
2.  **Structure:** Start with an introduction, develop the main points in the body, and finish with a conclusion.
3.  **Formatting:** Use HTML `<p>` tags for each paragraph. Do not use any other HTML tags.
4.  **Tone:** Maintain a professional, informative, and engaging tone suitable for a tech news website.
5.  **Factual Accuracy:** Preserve all facts from the original content. Do not add any speculative or unverified information.

**Expanded Article:**"""
                
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are a professional tech editor tasked with expanding short content into a full, well-structured article. Follow the user's instructions carefully."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=2048,
                    top_p=0.9,
                )
                
                enhanced = response.choices[0].message.content.strip()
                
                if len(enhanced) > 200 and enhanced.count('<p>') >= 2:
                    self.count += 1
                    return self._format(enhanced)
                
            except Exception as e:
                if 'rate_limit' in str(e).lower():
                    print(f"[ai] Rate limit, waiting...")
                    time.sleep(10)
                elif attempt < self.max_retries - 1:
                    time.sleep(2)
                else:
                    print(f"[ai] Enhancement failed: {e}")
        
        return None
    
    def _format(self, content: str) -> str:
        """Format HTML"""
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(content, 'html.parser')
        if not soup.find('p'):
            return ''.join(f'<p>{p.strip()}</p>' for p in content.split('\n\n') if p.strip())
        return str(soup)


_instance = None

def get_enhancer() -> Optional[AIEnhancer]:
    global _instance
    if _instance is None:
        try:
            _instance = AIEnhancer()
            if _instance.enabled:
                print(f"[ai] Initialized (max {_instance.max_per_run} enhancements/run)")
            else:
                # This is now an expected state, not an error
                print("[ai] Not available: GROQ_API_KEY not found or enhancement disabled.")
        except Exception as e:
            print(f"[ai] Failed to initialize: {e}")
            _instance = None # Ensure instance is not used on error
    return _instance
