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
        if not api_key or api_key == "your_groq_api_key_here":
            raise ValueError("GROQ_API_KEY not configured")
        
        self.client = Groq(api_key=api_key)
        self.model = "llama-3.1-8b-instant"
        self.enabled = os.getenv("ENABLE_AI_ENHANCEMENT", "false").lower() == "true"
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
                
                prompt = f"""Title: {title}

Short Content: {text}

Task: Expand to 3-4 paragraphs (350-450 words). Keep all facts. Use <p> tags.

Expanded:"""
                
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "Professional tech editor. Expand content while preserving facts."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=500,
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
        except Exception as e:
            print(f"[ai] Not available: {e}")
            return None
    return _instance
