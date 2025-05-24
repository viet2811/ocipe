from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

load_dotenv()

def getRecipeFromURL(url):
    gemini_key = os.getenv('GEMINI_API_KEY')
    client = genai.Client(api_key=gemini_key)

    RECIPE_JSON_SCHEMA = {
        "type": "object",
        "properties": {
            "name": {"type": "string", "description": "The name of the dish."},
            "meat_type": {"type": "string", "description": "The type of meat used. Any notes () just put it in 'note' field. For example: Beef(ribeye or sirloin) will have meat_type as Beef and add 'Sirloin or ribeye meat' in 'note'. On the other hand if recipe are as Chicken thighs then simply put down as Chicken thighs"},
            "longevity": {"type": "integer", "description": "The number of portions the recipe provides. Extract this as an integer."},
            "frequency": {"type": "string", "description": "When this dish is typically eaten. 'weekday' if quick and simple; 'weekend' if time-consuming or complex. Default to 'weekday' if unclear."},
            "note": {"type": "string", "description": "Detailed recipe instructions step-by-step for the recipe alongside any extra notes"},
            "state": {"type": "string", "description": "A custom attribute, always set to 'active'."},
            "ingredients": {
                "type": "array",
                "description": "A list of ingredients, each with a name and quantity.",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string", "description": "The name of the ingredient, e.g., 'chicken thighs', 'soy sauce'"},
                        "quantity": {"type": "string", "description": "The quantity and unit of the ingredient, e.g., '200g', '1 tbsp', '1 large'."}
                    },
                    "required": ["name", "quantity"]
                }
            }
        },
        "required": ["name", "meat_type", "longevity", "frequency", "note", "state", "ingredients"]
    }

    prompt = f"""Generate recipe follow JSON schema from this link at: {url}.
          **Crucially, for the 'name' field with each ingredient:
          - Only include pure, base name of the ingredients.
          - EXCLUDE any text found within parentheses `()`. Move those into 'note' field instead.
          - EXCLUDE descriptive adjectives or preparations like 'thinly slice', 'cooked', 'diced', ..etc
          ALWAYS EXCLUDE text in parentheses except for 'note' field
          **For the 'note' field:
          - ALWAYS INCLUDE INSTRUCTIONS of how to cook the recipe STEP-BY-STEP
          - Include any extra note on what is the ingredient is, i.e dashi - japanese soup stock
          """

    response = client.models.generate_content(
        model="gemini-2.0-flash-lite",
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.7,
            system_instruction="You are an expert recipe extractor. Your task is to extract recipe details from the given URL and format them strictly follows the given JSON schema",
            response_mime_type="application/json",
            response_schema=RECIPE_JSON_SCHEMA
        ),
    )

    return response
