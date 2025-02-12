import re
import requests

ssml_text = """
<speak>
  Hi <break time="200ms"/> John!
  I'm your BuzzNodes assistant for Cosmos.
  Commission for <emphasis level="strong">ValidatorX</emphasis> decreased from  
  <say-as interpret-as="cardinal">5.00</say-as> to  
  <say-as interpret-as="cardinal">3.50</say-as>.
</speak>
"""

clean_text = re.sub(r"<[^>]+>", "", ssml_text).strip()
clean_text = re.sub(r"\s+", " ", clean_text).strip()
print(clean_text)
